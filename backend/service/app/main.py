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
    version="1.0.0"
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
    "finshield_xgb.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "model",
    "finshield_scaler.pkl"
)

CONFIG_PATH = os.path.join(
    BASE_DIR,
    "model",
    "finshield_config.json"
)


# =========================================================
# FEATURE NAMES
# =========================================================

FEATURE_NAMES = (
    ["Time"]
    + [f"V{i}" for i in range(1, 29)]
    + ["Amount"]
)


# =========================================================
# LOAD MODEL
# =========================================================

try:

    model = joblib.load(MODEL_PATH)

    scaler = joblib.load(SCALER_PATH)

    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)

    threshold = config.get("threshold", 0.52)

    print("FraudGuard ML model loaded successfully.")
    print("Threshold:", threshold)

except Exception as e:

    print("Error loading ML files:")
    print(e)

    model = None
    scaler = None
    threshold = 0.52


# =========================================================
# SHAP EXPLAINER
# =========================================================

explainer = None

if model is not None:

    try:

        explainer = shap.TreeExplainer(model)

        print("SHAP explainer loaded successfully.")

    except Exception as e:

        print("SHAP initialization failed:")
        print(e)

# REQUEST SCHEMA

class PredictionRequest(BaseModel):

    features: list[float] = Field(
        ...,
        min_length=30,
        max_length=30,
        description="30 model features: Time, V1-V28, Amount"
    )


# SHAP RESPONSE

class ShapFeature(BaseModel):

    feature: str
    value: float
    shap_value: float


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "FraudGuard FastAPI ML Service is running",
        "model": "XGBoost",
        "features": 30
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "shap_loaded": explainer is not None
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

    X = np.array(features, dtype=float).reshape(1, -1)

    if X.shape[1] != 30:

        raise ValueError(
            f"Expected 30 features, received {X.shape[1]}"
        )

    # -----------------------------------------------------
    # IMPORTANT:
    # During training only Time and Amount were scaled.
    #
    # Time -> index 0
    # Amount -> index 29
    # -----------------------------------------------------

    time_amount = X[:, [0, 29]]

    scaled_time_amount = scaler.transform(time_amount)

    X[:, [0, 29]] = scaled_time_amount

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

    # For binary XGBoost models this should normally be
    # a 2D array: (samples, features)

    if isinstance(shap_values, list):

        shap_values = shap_values[-1]

    shap_values = np.asarray(shap_values)

    if shap_values.ndim == 2:

        values = shap_values[0]

    else:

        values = shap_values

    explanation = []

    for feature, value, shap_value in zip(
        FEATURE_NAMES,
        X[0],
        values
    ):

        explanation.append({

            "feature": feature,

            "value": float(value),

            "shap_value": float(shap_value)

        })

    # Most influential features first

    explanation.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    return explanation[:10]


# =========================================================
# PREDICTION
# =========================================================

@app.post("/predict")
def predict(request: PredictionRequest):

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="ML model is not loaded"
        )

    try:

        # -------------------------------------------------
        # PREPROCESS
        # -------------------------------------------------

        X = preprocess(request.features)


        # -------------------------------------------------
        # PROBABILITY
        # -------------------------------------------------

        probability = float(
            model.predict_proba(X)[0][1]
        )


        # -------------------------------------------------
        # PREDICTION
        # -------------------------------------------------

        prediction = int(
            probability >= threshold
        )


        # -------------------------------------------------
        # RISK
        # -------------------------------------------------

        risk_score = round(
            probability * 100,
            2
        )

        risk_level = get_risk_level(
            probability
        )

        # SHAP

        shap_explanation = get_shap_explanation(X)

        # RESPONSE

        return {

            "fraud_probability": round(
                probability,
                6
            ),

            "risk_score": risk_score,

            "risk_level": risk_level,

            "prediction": prediction,

            "prediction_label":
                "FRAUD"
                if prediction == 1
                else "LEGITIMATE",

            "threshold": threshold,

            "shap_explanation":
                shap_explanation

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )