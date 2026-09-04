import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaTachometerAlt,
  FaShieldAlt,
  FaCreditCard,
  FaHistory,
  FaBell,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar({ unreadAlerts = 0 }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FaTachometerAlt,
    },
    {
      name: "Analyze Transaction",
      path: "/payment",
      icon: FaCreditCard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: FaHistory,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: FaBell,
      badge: unreadAlerts,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "User";
  const userRole = "Protected Account";

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  const initials = getInitials(userName);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-800/80 bg-slate-950 text-white">

      {/* ─────────────────────────────────────
          LOGO
      ───────────────────────────────────── */}

      <div className="flex h-20 items-center border-b border-slate-800/80 px-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3"
        >

          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 transition duration-200 group-hover:scale-105">
            <FaShieldAlt size={22} />
          </div>

          {/* Brand */}
          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight">
              Fraud<span className="text-emerald-400">Guard</span>
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              AI Security
            </p>
          </div>

        </button>

      </div>

      {/* ─────────────────────────────────────
          USER PROFILE
      ───────────────────────────────────── */}

      <div className="px-4 pt-6">

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={userName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-slate-200">
              {userName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {userRole}
            </p>

          </div>

          {/* Account status */}
          <span
            className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"
            title="Account protected"
          />

        </div>

      </div>

      {/* ─────────────────────────────────────
          NAVIGATION
      ───────────────────────────────────── */}

      <div className="px-4 pt-8">

        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Overview
        </p>

        <nav className="space-y-1.5">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3 rounded-xl px-3.5 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }
                  `
                }
              >

                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400" />
                    )}

                    {/* Icon */}
                    <Icon
                      size={19}
                      className="shrink-0"
                    />

                    {/* Label */}
                    <span className="flex-1">
                      {item.name}
                    </span>

                    {/* Dynamic alert badge */}
                    {item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/10 px-1.5 text-[10px] font-bold text-red-400">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}

                    {/* Arrow on active route */}
                    {isActive && (
                      <FaChevronRight
                        size={13}
                        className="text-emerald-500/70"
                      />
                    )}

                  </>
                )}

              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* ─────────────────────────────────────
          SECURITY STATUS
      ───────────────────────────────────── */}

      <div className="mt-8 px-4">

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <FaShieldAlt size={15} />
            </div>

            <span className="text-xs font-semibold text-slate-300">
              Protection Active
            </span>

          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            FraudGuard is monitoring your transaction activity.
          </p>

        </div>

      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ─────────────────────────────────────
          LOGOUT
      ───────────────────────────────────── */}

      <div className="border-t border-slate-800/80 p-4">

        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-red-500/5 hover:text-red-400"
        >

          <FaSignOutAlt
            size={17}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          <span>
            Logout
          </span>

        </button>

        <p className="mt-3 text-center text-[9px] uppercase tracking-[0.18em] text-slate-700">
          FraudGuard AI • v1.0
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;