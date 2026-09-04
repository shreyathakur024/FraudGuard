import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("fraudguard_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/alerts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch alerts");
      }

      setAlerts(data.data?.alerts || []);
    } catch (err) {
      console.error("Alerts fetch error:", err);
      setError(err.message || "Unable to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  const getAlertIcon = (severity) => {
    const level = severity?.toLowerCase();

    if (level === "critical" || level === "high") {
      return <FaExclamationTriangle />;
    }

    if (level === "medium" || level === "warning") {
      return <FaClock />;
    }

    return <FaCheckCircle />;
  };

  const getAlertStyles = (severity) => {
    const level = severity?.toLowerCase();

    if (level === "critical" || level === "high") {
      return {
        icon: "bg-red-500/10 text-red-400",
        border: "hover:border-red-500/20",
      };
    }

    if (level === "medium" || level === "warning") {
      return {
        icon: "bg-amber-500/10 text-amber-400",
        border: "hover:border-amber-500/20",
      };
    }

    return {
      icon: "bg-emerald-500/10 text-emerald-400",
      border: "hover:border-emerald-500/20",
    };
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FaBell className="text-emerald-400" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">
                Security Alerts
              </h1>
            </div>

            <p className="text-slate-400">
              Stay informed about suspicious and important transaction activity.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0c1929] border border-white/10 rounded-xl px-4 py-3">
            <FaBell className="text-emerald-400" />

            <div>
              <p className="text-xs text-slate-400">
                Active Alerts
              </p>

              <p className="text-lg font-semibold">
                {loading ? "—" : alerts.length}
              </p>
            </div>
          </div>
        </div>

        {/* Security status */}
        <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-emerald-400" />
            </div>

            <div>
              <h2 className="font-semibold text-white mb-1">
                FraudGuard is monitoring your transactions
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Suspicious activity detected by the risk engine will appear
                here for review.
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[#0c1929] border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />

            <p className="text-slate-400">
              Loading security alerts...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-[#0c1929] border border-red-500/20 rounded-2xl p-8 text-center">
            <FaExclamationTriangle className="text-red-400 text-2xl mx-auto mb-3" />

            <h3 className="font-semibold mb-2">
              Unable to load alerts
            </h3>

            <p className="text-sm text-slate-400 mb-5">
              {error}
            </p>

            <button
              onClick={getAlerts}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Alerts */}
        {!loading && !error && (
          <>
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const styles = getAlertStyles(alert.severity);

                  return (
                    <div
                      key={alert.id}
                      className={`group bg-[#0c1929] border border-white/10 rounded-2xl p-5 transition-all duration-200 ${styles.border}`}
                    >
                      <div className="flex gap-4">

                        {/* Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}
                        >
                          {getAlertIcon(alert.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-white">
                                {alert.title}
                              </h3>

                              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                {alert.message}
                              </p>
                            </div>

                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {formatDate(alert.createdAt)}
                            </span>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className="text-xs text-slate-500">
                              {alert.transactionId
                                ? `Transaction #${alert.transactionId}`
                                : "System Alert"}
                            </span>

                            {alert.transactionId && (
                              <button className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                                View transaction
                                <FaArrowRight className="text-xs" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-[#0c1929] border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-emerald-400 text-xl" />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  No security alerts
                </h3>

                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  You're all clear. FraudGuard will notify you if suspicious
                  transaction activity is detected.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Alerts;