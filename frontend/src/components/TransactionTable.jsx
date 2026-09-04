import {
  FaArrowRight,
  FaCreditCard,
  FaClock,
} from "react-icons/fa";

import RiskBadge from "./RiskBadge";

function TransactionTable({
  transactions = [],
  loading = false,
  onViewAll,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Recent Transactions
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Latest payment activity and risk assessments
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="group flex items-center gap-2 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            View all
            <FaArrowRight
              size={10}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        )}

      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3 p-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-4 rounded-xl bg-slate-800/40 p-4"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-700/60" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-slate-700/60" />
                <div className="h-2 w-20 rounded bg-slate-800" />
              </div>

              <div className="h-6 w-20 rounded-full bg-slate-700/60" />
            </div>
          ))}

        </div>
      ) : transactions.length === 0 ? (

        /* Empty State */
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/60 text-slate-500">
            <FaCreditCard size={18} />
          </div>

          <h4 className="mt-4 text-sm font-medium text-slate-300">
            No transactions yet
          </h4>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Transaction activity will appear here once payments
            are analyzed by FraudGuard.
          </p>

        </div>

      ) : (

        /* Table */
        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/20">

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Merchant
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Date & Time
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Risk
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">

              {transactions.map((transaction) => (

                <tr
                  key={transaction.id}
                  className="group transition-colors hover:bg-slate-800/30"
                >

                  {/* Merchant */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300">
                        {transaction.merchant
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-slate-200">
                          {transaction.merchant || "Unknown Merchant"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          {transaction.paymentMethod || "Payment"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-slate-200">
                      {transaction.amount !== undefined
                        ? `₹${Number(transaction.amount).toLocaleString("en-IN")}`
                        : "—"}
                    </span>

                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-xs text-slate-400">

                      <FaClock
                        size={10}
                        className="text-slate-600"
                      />

                      <span>
                        {transaction.timestamp
                          ? new Date(
                              transaction.timestamp
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>

                    </div>

                  </td>

                  {/* Risk */}
                  <td className="px-5 py-4">

                    <RiskBadge
                      level={
                        transaction.riskLevel ||
                        transaction.risk_level
                      }
                    />

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex items-center rounded-full
                        border px-2.5 py-1
                        text-[10px] font-semibold
                        ${
                          transaction.status === "APPROVED"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : transaction.status === "BLOCKED"
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : transaction.status === "REVIEW"
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                            : "border-slate-700 bg-slate-800/50 text-slate-400"
                        }
                      `}
                    >
                      {transaction.status || "PENDING"}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default TransactionTable;