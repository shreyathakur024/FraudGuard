import React, { useEffect, useState } from "react";
import {
  FaExchangeAlt,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import { apiFetch } from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/transactions");

      setTransactions(data.data?.transactions || []);
    } catch (err) {
      console.error("Transactions fetch error:", err);
      setError(
        err.message || "Unable to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "—";
    }

    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getRiskIcon = (riskLevel) => {
    const level = riskLevel?.toLowerCase();

    if (level === "critical" || level === "high") {
      return <FaExclamationTriangle />;
    }

    if (level === "medium") {
      return <FaClock />;
    }

    return <FaCheckCircle />;
  };

  const getRiskStyles = (riskLevel) => {
    const level = riskLevel?.toLowerCase();

    if (level === "critical") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (level === "high") {
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }

    if (level === "medium") {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }

    if (level === "low") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase();

    return (
      transaction.merchant
        ?.toLowerCase()
        .includes(searchText) ||
      transaction.paymentMethod
        ?.toLowerCase()
        .includes(searchText) ||
      String(transaction.id).includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FaExchangeAlt className="text-emerald-400" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">
                Transactions
              </h1>
            </div>

            <p className="text-slate-400">
              View and monitor your transaction activity.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <FaSearch
              size={13}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0c1929] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[#0c1929] border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />

            <p className="text-slate-400">
              Loading transactions...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-[#0c1929] border border-red-500/20 rounded-2xl p-8 text-center">
            <FaExclamationTriangle className="text-red-400 text-2xl mx-auto mb-3" />

            <h3 className="font-semibold mb-2">
              Unable to load transactions
            </h3>

            <p className="text-sm text-slate-400 mb-5">
              {error}
            </p>

            <button
              onClick={getTransactions}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Transactions */}
        {!loading && !error && (
          <>
            {filteredTransactions.length > 0 ? (
              <div className="bg-[#0c1929] border border-white/10 rounded-2xl overflow-hidden">

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Merchant
                        </th>

                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Payment
                        </th>

                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Date
                        </th>

                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Risk
                        </th>

                        <th className="px-6 py-4 text-xs font-medium text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTransactions.map((transaction) => {
                        const prediction = transaction.prediction;
                        const riskLevel = prediction?.riskLevel;

                        return (
                          <tr
                            key={transaction.id}
                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {transaction.merchant}
                                </p>

                                <p className="text-xs text-slate-600 mt-1">
                                  #{transaction.id}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-sm font-medium">
                              {formatAmount(transaction.amount)}
                            </td>

                            <td className="px-6 py-5">
                              <span className="text-sm text-slate-400">
                                {transaction.paymentMethod || "—"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-400 whitespace-nowrap">
                              {formatDate(transaction.timestamp)}
                            </td>

                            <td className="px-6 py-5">
                              {prediction ? (
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${getRiskStyles(
                                    riskLevel
                                  )}`}
                                >
                                  {getRiskIcon(riskLevel)}
                                  {riskLevel || "Unknown"}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">
                                  Not analyzed
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <span className="text-xs text-slate-400">
                                {transaction.status || "PENDING"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-white/5">
                  {filteredTransactions.map((transaction) => {
                    const prediction = transaction.prediction;
                    const riskLevel = prediction?.riskLevel;

                    return (
                      <div
                        key={transaction.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">
                              {transaction.merchant}
                            </p>

                            <p className="text-xs text-slate-600 mt-1">
                              Transaction #{transaction.id}
                            </p>
                          </div>

                          <p className="font-semibold text-white">
                            {formatAmount(transaction.amount)}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Payment
                            </p>

                            <p className="text-sm text-slate-400">
                              {transaction.paymentMethod || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Status
                            </p>

                            <p className="text-sm text-slate-400">
                              {transaction.status || "PENDING"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Date
                            </p>

                            <p className="text-sm text-slate-400">
                              {formatDate(transaction.timestamp)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Risk
                            </p>

                            {prediction ? (
                              <span
                                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium ${getRiskStyles(
                                  riskLevel
                                )}`}
                              >
                                {getRiskIcon(riskLevel)}
                                {riskLevel || "Unknown"}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600">
                                Not analyzed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="bg-[#0c1929] border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <FaExchangeAlt className="text-emerald-400 text-xl" />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {search
                    ? "No matching transactions"
                    : "No transactions yet"}
                </h3>

                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  {search
                    ? "Try searching with a different merchant, payment method, or transaction ID."
                    : "Your analyzed transactions will appear here once you make a payment through FraudGuard."}
                </p>

                {!search && (
                  <button
                    onClick={() => {
                      window.location.href = "/payment";
                    }}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition"
                  >
                    Make a transaction
                    <FaArrowRight size={11} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;