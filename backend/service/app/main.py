from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import numpy as np
import pandas as pd
import joblib
import shap
import json
import os


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="FraudGuard ML Service",
    description="XGBoost-based financial fraud detection service",
    version="2.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "fraudguard_xgb.pkl"
)

CONFIG_PATH = os.path.join(
    BASE_DIR,
    "model",
    "fraudguard_config.json"
)


# =========================================================
# LOAD MODEL + CONFIG
# =========================================================

model = None
explainer = None
FEATURE_NAMES = []
threshold = 0.90

try:

    model = joblib.load(MODEL_PATH)

    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)

    FEATURE_NAMES = config["features"]
    threshold = config.get("threshold", 0.90)

    print("FraudGuard ML model loaded successfully.")
    print("Features:", FEATURE_NAMES)
    print("Feature count:", len(FEATURE_NAMES))
    print("Threshold:", threshold)

except Exception as e:

    print("Error loading ML files:")
    print(e)


# =========================================================
# SHAP EXPLAINER
# =========================================================

if model is not None:

    try:

        explainer = shap.TreeExplainer(model)

        print("SHAP explainer loaded successfully.")

    except Exception as e:

        print("SHAP initialization failed:")
        print(e)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class PredictionRequest(BaseModel):

    features: list[float] = Field(
        ...,
        min_length=16,
        max_length=16,
        description="16 transaction features used by the FraudGuard XGBoost model"
    )


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "FraudGuard FastAPI ML Service is running",
        "model": "XGBoost",
        "features": len(FEATURE_NAMES),
        "threshold": threshold
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "shap_loaded": explainer is not None,
        "feature_count": len(FEATURE_NAMES)
    }


# =========================================================
# MODEL INFO
# =========================================================

@app.get("/model-info")
def model_info():

    return {
        "model": "XGBoost",
        "features": FEATURE_NAMES,
        "feature_count": len(FEATURE_NAMES),
        "threshold": threshold,
        "shap_available": explainer is not None
    }


# =========================================================
# PREPROCESSING
# =========================================================

def preprocess(features):

    if len(features) != len(FEATURE_NAMES):

        raise ValueError(
            f"Expected {len(FEATURE_NAMES)} features, "
            f"received {len(features)}"
        )

    # Check for invalid numbers
    if not all(np.isfinite(feature) for feature in features):

        raise ValueError(
            "All features must contain valid finite numbers"
        )

    # Create DataFrame using EXACT training feature order
    X = pd.DataFrame(
        [features],
        columns=FEATURE_NAMES
    )

    return X


# =========================================================
# RISK LEVEL
# =========================================================

def get_risk_level(probability):

    score = probability * 100

    if score <= 20:

        return "LOW"

    elif score <= 50:

        return "MEDIUM"

    elif score <= 75:

        return "HIGH"

    else:

        return "CRITICAL"


# =========================================================
# SHAP EXPLANATION
# =========================================================

def get_shap_explanation(X):

    if explainer is None:

        return []

    shap_values = explainer.shap_values(X)

    shap_values = np.asarray(shap_values)

    # Handle possible SHAP output shapes
    if shap_values.ndim == 3:

        values = shap_values[0, :, -1]

    elif shap_values.ndim == 2:

        values = shap_values[0]

    else:

        values = shap_values

    explanation = []

    for feature, value, shap_value in zip(
        FEATURE_NAMES,
        X.iloc[0].values,
        values
    ):

        explanation.append(
            {
                "feature": feature,
                "value": float(value),
                "shap_value": float(shap_value)
            }
        )

    # Most influential features first
    explanation.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    return explanation[:10]

@app.post("/predict")
def predict(request: PredictionRequest):

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="ML model is not loaded"
        )

    try:

        X = preprocess(request.features)

        probability = float(
            model.predict_proba(X)[0][1]
        )

        prediction = int(
            probability >= threshold
        )

        risk_score = round(
            probability * 100,
            2
        )

        risk_level = get_risk_level(
            probability
        )

        shap_explanation = get_shap_explanation(X)

        return {

            "fraud_probability": round(
                probability,
                6
            ),

            "risk_score": risk_score,

            "risk_level": risk_level,

            "prediction": prediction,

            "prediction_label": (
                "FRAUD"
                if prediction == 1
                else "LEGITIMATE"
            ),

            "threshold": threshold,

            "shap_explanation": shap_explanation
        }


    except Exception as e:

        print("Prediction error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )