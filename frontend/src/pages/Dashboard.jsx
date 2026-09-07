import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaExchangeAlt,
  FaExclamationTriangle,
  FaRupeeSign,
  FaShieldAlt,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";
import AlertCard from "../components/AlertCard";

import { apiFetch } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [dashboardError, setDashboardError] = useState("");

  // ─────────────────────────────────────
  // AUTH CHECK
  // ─────────────────────────────────────

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // ─────────────────────────────────────
  // AUTHENTICATED API REQUEST
  // ─────────────────────────────────────

  const authenticatedFetch = async (endpoint) => {
    return apiFetch(endpoint);
  };

  // ─────────────────────────────────────
  // FETCH DASHBOARD DATA
  // ─────────────────────────────────────

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchDashboardData = async () => {
      setDashboardError("");

      // -------------------------------
      // STATS
      // -------------------------------

      try {
        setLoadingStats(true);

        const response = await authenticatedFetch(
          "/dashboard/stats"
        );

        setStats(response.data || null);
      } catch (error) {
        console.error("Dashboard stats error:", error);
        setStats(null);
        setDashboardError(
          "Unable to load some dashboard information."
        );
      } finally {
        setLoadingStats(false);
      }

      // -------------------------------
      // TRANSACTIONS
      // -------------------------------

      try {
        setLoadingTransactions(true);

        const response = await authenticatedFetch(
          "/transactions?limit=5"
        );

        setTransactions(
          Array.isArray(response.data)
            ? response.data
            : response.data?.transactions || []
        );
      } catch (error) {
        console.error("Transactions loading error:", error);
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }

      // -------------------------------
      // ALERTS
      // -------------------------------

      try {
        setLoadingAlerts(true);

        const response = await authenticatedFetch(
          "/alerts?limit=3"
        );

        setAlerts(
          Array.isArray(response.data)
            ? response.data
            : response.data?.alerts || []
        );
      } catch (error) {
        console.error("Alerts loading error:", error);
        setAlerts([]);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated]);

  // ─────────────────────────────────────
  // FORMAT AMOUNT
  // ─────────────────────────────────────

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "—";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // ─────────────────────────────────────
  // UNREAD ALERTS
  // ─────────────────────────────────────

  const unreadAlerts =
    alerts?.filter((alert) => !alert.isRead).length || 0;

  // ─────────────────────────────────────
  // STATS SKELETON
  // ─────────────────────────────────────

  const StatsSkeleton = () => (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
        />
      ))}
    </div>
  );

  // ─────────────────────────────────────
  // TRANSACTION SKELETON
  // ─────────────────────────────────────

  const TransactionSkeleton = () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-800" />

      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-xl bg-slate-800/60"
          />
        ))}
      </div>

    </div>
  );

  // ─────────────────────────────────────
  // ALERT SKELETON
  // ─────────────────────────────────────

  const AlertSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
        />
      ))}
    </div>
  );

  // ─────────────────────────────────────
  // AUTH LOADING
  // ─────────────────────────────────────

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <FaShieldAlt size={22} />
          </div>

          <p className="text-sm font-medium text-slate-300">
            Verifying your account...
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────
  // MAIN UI
  // ─────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}

      <Sidebar unreadAlerts={unreadAlerts} />

      {/* Main Content */}

      <div className="ml-72 min-h-screen">

        {/* Navbar */}

        <Navbar
          user={user}
          notificationCount={unreadAlerts}
          onNotificationClick={() => navigate("/alerts")}
        />

        <main className="px-6 py-7 lg:px-8">

          {/* ─────────────────────────────
              PAGE HEADER
          ───────────────────────────── */}

          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Security Overview
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Monitor your transaction activity and stay ahead
                  of potential fraud risks.
                </p>

              </div>

              <button
                onClick={() => navigate("/payment")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Analyze Transaction

                <FaArrowRight
                  size={11}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </div>

          </section>

          {/* ─────────────────────────────
              ERROR MESSAGE
          ───────────────────────────── */}

          {dashboardError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">

              <FaExclamationTriangle
                className="shrink-0 text-amber-400"
                size={14}
              />

              <p className="text-xs text-amber-400">
                {dashboardError}
              </p>

            </div>
          )}

          {/* ─────────────────────────────
              STAT CARDS
          ───────────────────────────── */}

          {loadingStats ? (
            <StatsSkeleton />
          ) : stats ? (

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Transactions"
                value={stats.totalTransactions ?? "—"}
                icon={FaExchangeAlt}
                trend={stats.transactionTrend}
                subtitle="vs last month"
              />

              <StatCard
                title="Flagged Transactions"
                value={stats.flaggedTransactions ?? "—"}
                icon={FaExclamationTriangle}
                trend={stats.flaggedTrend}
                trendType="down"
                subtitle="vs last month"
              />

              <StatCard
                title="Amount Processed"
                value={formatAmount(stats.amountProcessed)}
                icon={FaRupeeSign}
                trend={stats.amountTrend}
                subtitle="vs last month"
              />

              <StatCard
                title="Protection Score"
                value={
                  stats.protectionScore !== undefined &&
                  stats.protectionScore !== null
                    ? `${stats.protectionScore}%`
                    : "—"
                }
                icon={FaShieldAlt}
                trend={stats.protectionStatus}
                subtitle="security status"
              />

            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Transactions"
                value="—"
                icon={FaExchangeAlt}
              />

              <StatCard
                title="Flagged Transactions"
                value="—"
                icon={FaExclamationTriangle}
              />

              <StatCard
                title="Amount Processed"
                value="—"
                icon={FaRupeeSign}
              />

              <StatCard
                title="Protection Score"
                value="—"
                icon={FaShieldAlt}
              />

            </div>
          )}

          {/* ─────────────────────────────
              RISK OVERVIEW
          ───────────────────────────── */}

          <section className="mt-7">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-sm font-semibold text-white">
                    Risk Overview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Transaction risk distribution
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FaChartLine size={16} />
                </div>

              </div>

              {/* Risk Data */}

              {stats?.riskDistribution ? (

                <div className="mt-6">

                  <div className="mb-5 flex h-4 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${stats.riskDistribution.low || 0}%`,
                      }}
                    />

                    <div
                      className="bg-amber-400"
                      style={{
                        width: `${stats.riskDistribution.medium || 0}%`,
                      }}
                    />

                    <div
                      className="bg-orange-400"
                      style={{
                        width: `${stats.riskDistribution.high || 0}%`,
                      }}
                    />

                    <div
                      className="bg-red-500"
                      style={{
                        width: `${stats.riskDistribution.critical || 0}%`,
                      }}
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                    <RiskItem
                      label="Low"
                      value={stats.riskDistribution.low}
                      indicator="bg-emerald-400"
                    />

                    <RiskItem
                      label="Medium"
                      value={stats.riskDistribution.medium}
                      indicator="bg-amber-400"
                    />

                    <RiskItem
                      label="High"
                      value={stats.riskDistribution.high}
                      indicator="bg-orange-400"
                    />

                    <RiskItem
                      label="Critical"
                      value={stats.riskDistribution.critical}
                      indicator="bg-red-400"
                    />

                  </div>

                </div>

              ) : (

                <div className="mt-6 flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30">

                  <div className="text-center">

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                      <FaChartLine size={16} />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-400">
                      Risk analytics
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Risk distribution will appear when transaction data is available.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </section>

          {/* ─────────────────────────────
              TRANSACTIONS + ALERTS
          ───────────────────────────── */}

          <section className="mt-7 grid gap-7 xl:grid-cols-[1.7fr_1fr]">

            {/* Transactions */}

            <div>

              {loadingTransactions ? (

                <TransactionSkeleton />

              ) : (

                <TransactionTable
                  transactions={transactions}
                  loading={false}
                  onViewAll={() => navigate("/transactions")}
                />

              )}

            </div>

            {/* Alerts */}

            <div>

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h2 className="text-sm font-semibold text-white">
                    Security Alerts
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Recent security activity
                  </p>

                </div>

                <button
                  onClick={() => navigate("/alerts")}
                  className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  View all
                </button>

              </div>

              {loadingAlerts ? (

                <AlertSkeleton />

              ) : alerts.length > 0 ? (

                <div className="space-y-3">

                  {alerts.slice(0, 3).map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onClick={() => navigate("/alerts")}
                    />
                  ))}

                </div>

              ) : (

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <FaShieldAlt size={16} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No security alerts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    You're all clear. New alerts will appear here.
                  </p>

                </div>

              )}

            </div>

          </section>

          {/* ─────────────────────────────
              FOOTER STATUS
          ───────────────────────────── */}

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-700">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            FraudGuard Protection System

          </div>

        </main>

      </div>

    </div>
  );
}

// ─────────────────────────────────────
// RISK ITEM
// ─────────────────────────────────────

function RiskItem({ label, value, indicator }) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2 w-2 rounded-full ${indicator}`}
      />

      <div>

        <p className="text-[11px] text-slate-500">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-300">
          {value !== undefined && value !== null
            ? `${value}%`
            : "—"}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;