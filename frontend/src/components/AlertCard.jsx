import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

function AlertCard({
  alert,
  onClick,
}) {
  if (!alert) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex min-h-40 flex-col items-center justify-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/60 text-slate-500">
            <FaShieldAlt size={17} />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-300">
            No security alerts
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
            You're all clear. New security alerts will appear here.
          </p>
        </div>
      </div>
    );
  }

  const severity = alert.severity?.toUpperCase() || "INFO";

  const getSeverityConfig = () => {
    switch (severity) {
      case "CRITICAL":
        return {
          icon: FaExclamationTriangle,
          iconWrapper:
            "bg-red-500/10 text-red-400 border-red-500/20",
          title: "text-red-400",
        };

      case "HIGH":
        return {
          icon: FaExclamationTriangle,
          iconWrapper:
            "bg-orange-500/10 text-orange-400 border-orange-500/20",
          title: "text-orange-400",
        };

      case "MEDIUM":
        return {
          icon: FaExclamationTriangle,
          iconWrapper:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",
          title: "text-amber-400",
        };

      case "LOW":
        return {
          icon: FaShieldAlt,
          iconWrapper:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          title: "text-emerald-400",
        };

      case "RESOLVED":
        return {
          icon: FaCheckCircle,
          iconWrapper:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          title: "text-emerald-400",
        };

      default:
        return {
          icon: FaShieldAlt,
          iconWrapper:
            "bg-slate-800 text-slate-400 border-slate-700",
          title: "text-slate-300",
        };
    }
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onClick?.(alert)}
      className="group w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="flex items-start gap-3">

        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.iconWrapper}`}
        >
          <Icon size={16} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-slate-200">
                {alert.title || "Security Alert"}
              </h4>

              <p className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${config.title}`}>
                {severity}
              </p>
            </div>

            <FaArrowRight
              size={11}
              className="mt-1 shrink-0 text-slate-700 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-400"
            />

          </div>

          {/* Message */}
          {alert.message && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
              {alert.message}
            </p>
          )}

          {/* Time */}
          {alert.createdAt && (
            <p className="mt-3 text-[10px] text-slate-600">
              {new Date(alert.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

        </div>

      </div>
    </button>
  );
}

export default AlertCard;