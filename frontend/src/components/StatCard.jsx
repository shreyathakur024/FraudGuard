import { FaArrowUp, FaArrowDown } from "react-icons/fa";


function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "up",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
      
      {/* Subtle background glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-3xl transition group-hover:bg-emerald-500/10" />

      {/* Top section */}
      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {value ?? "—"}
          </h3>
        </div>

        {/* Icon */}
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-emerald-400">
            <Icon size={19} />
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="relative mt-5 flex min-h-5 items-center gap-2">

        {trend !== undefined && trend !== null && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              trendType === "down"
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {trendType === "down" ? (
              <FaArrowDown size={10} />
            ) : (
              <FaArrowUp size={10} />
            )}

            {trend}
          </span>
        )}

        {subtitle && (
          <span className="text-xs text-slate-500">
            {subtitle}
          </span>
        )}

      </div>
    </div>
  );
}

export default StatCard;