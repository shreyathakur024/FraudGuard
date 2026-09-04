import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem(
      "fraudguard_result"
    );

    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            No transaction found
          </h1>

          <button
            onClick={() => navigate("/payment")}
            className="bg-emerald-500 text-slate-950 px-5 py-2 rounded-lg font-medium"
          >
            Analyze Transaction
          </button>
        </div>
      </div>
    );
  }

  const isFraud = result.prediction === 1;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <button
            onClick={() => navigate("/payment")}
            className="text-slate-400 hover:text-white"
          >
            ← New Analysis
          </button>

          <div className="font-bold text-lg">
            FraudGuard
          </div>

        </div>

        {/* Result Header */}
        <div className="text-center mb-10">

          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${
              isFraud
                ? "bg-red-500/10 text-red-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isFraud ? "!" : "✓"}
          </div>

          <p className="text-sm text-slate-400 mb-2">
            TRANSACTION ANALYSIS
          </p>

          <h1
            className={`text-4xl font-bold ${
              isFraud
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {result.risk_level} RISK
          </h1>

          <p className="text-slate-400 mt-3">
            {isFraud
              ? "This transaction has been flagged as suspicious."
              : "This transaction appears legitimate."}
          </p>

        </div>

        {/* Risk Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Fraud Probability
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {(result.fraud_probability * 100).toFixed(2)}%
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Risk Score
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {result.risk_score}
              <span className="text-lg text-slate-500">
                /100
              </span>
            </h2>
          </div>

        </div>

        {/* Transaction Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-semibold mb-6">
            Transaction Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Detail
              label="Merchant"
              value={result.merchant}
            />

            <Detail
              label="Amount"
              value={`₹${Number(result.amount).toLocaleString("en-IN")}`}
            />

            <Detail
              label="Transaction Type"
              value={result.transactionType}
            />

            <Detail
              label="Location"
              value={result.location}
            />

            <Detail
              label="Device"
              value={result.device}
            />

            <Detail
              label="Time"
              value={result.time}
            />

          </div>

        </div>

        {/* SHAP Explanation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-semibold">
            Why This Decision?
          </h2>

          <p className="text-slate-400 text-sm mt-2 mb-6">
            Top features contributing to the model prediction.
          </p>

          <div className="space-y-5">

            {result.shap_explanation.map(
              (item, index) => {

                const positive =
                  item.shap_value > 0;

                const width = Math.min(
                  Math.abs(item.shap_value) * 30,
                  100
                );

                return (
                  <div key={index}>

                    <div className="flex justify-between text-sm mb-2">

                      <span>
                        {item.feature}
                      </span>

                      <span
                        className={
                          positive
                            ? "text-red-400"
                            : "text-emerald-400"
                        }
                      >
                        {item.shap_value > 0
                          ? "+"
                          : ""}
                        {item.shap_value.toFixed(2)}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full ${
                          positive
                            ? "bg-red-500"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${width}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

          <p className="text-xs text-slate-500 mt-6">
            V1–V28 are anonymized features from the
            underlying fraud detection dataset.
          </p>

        </div>

        {/* Decision */}
        <div
          className={`rounded-2xl p-6 mb-8 ${
            isFraud
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-emerald-500/10 border border-emerald-500/20"
          }`}
        >

          <h2 className="font-semibold mb-2">
            AI Recommendation
          </h2>

          <p className="text-slate-300">
            {isFraud
              ? "Transaction requires further verification."
              : "Transaction appears safe based on the current model assessment."}
          </p>

        </div>

        {/* Button */}
        <div className="text-center">

          <button
            onClick={() => navigate("/payment")}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition"
          >
            Analyze Another Transaction
          </button>

        </div>

      </div>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-slate-200 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}

export default Result;