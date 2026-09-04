import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaShieldVirus } from "react-icons/fa";

function RiskBadge({ level }) {
  const normalizedLevel = level?.toUpperCase() || "UNKNOWN";

  const getConfig = () => {
    switch (normalizedLevel) {
      case "LOW":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: <FaCheckCircle className="text-emerald-400" />,
          label: "Low Risk",
          glow: "shadow-emerald-500/5",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          icon: <FaExclamationTriangle className="text-amber-400" />,
          label: "Medium Risk",
          glow: "shadow-amber-500/5",
        };
      case "HIGH":
        return {
          bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
          icon: <FaShieldVirus className="text-orange-400" />,
          label: "High Risk",
          glow: "shadow-orange-500/5",
        };
      case "CRITICAL":
        return {
          bg: "bg-red-500/15 border-red-500/40 text-red-400 animate-pulse",
          icon: <FaTimesCircle className="text-red-400" />,
          label: "Critical Risk",
          glow: "shadow-red-500/10",
        };
      default:
        return {
          bg: "bg-slate-500/10 border-slate-500/30 text-slate-400",
          icon: <FaExclamationTriangle className="text-slate-400" />,
          label: "Unknown",
          glow: "shadow-slate-500/5",
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md shadow-lg ${config.bg} ${config.glow}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

export default RiskBadge;
