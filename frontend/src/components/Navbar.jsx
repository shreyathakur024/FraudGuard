import { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

function Navbar({
  user = null,
  notificationCount = 0,
  onNotificationClick,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  const userName = user?.name || "User";
  const userRole = user?.role || "Customer";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5 lg:px-7">

        {/* Left */}
        <div className="flex items-center gap-4">

          <div className="hidden md:block">
            <p className="text-xs text-slate-500">
              FraudGuard
            </p>

            <h2 className="text-sm font-semibold text-white">
              Security Dashboard
            </h2>
          </div>

        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">

          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="flex w-56 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 transition focus-within:border-slate-700">

              <FaSearch className="text-xs text-slate-600" />

              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-slate-300 outline-none placeholder:text-slate-600"
              />

            </div>
          </div>

          {/* Notification */}
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            aria-label="Notifications"
          >
            <FaBell size={15} />

            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {notificationCount > 9
                  ? "9+"
                  : notificationCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-800 sm:block" />

          {/* Profile */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-900"
            >

              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-emerald-400">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={userName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={22} />
                )}
              </div>

              {/* User info */}
              <div className="hidden text-left sm:block">
                <p className="max-w-28 truncate text-xs font-semibold text-slate-200">
                  {userName}
                </p>

                <p className="text-[10px] text-slate-500">
                  {userRole}
                </p>
              </div>

              <FaChevronDown
                size={10}
                className={`hidden text-slate-600 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/30">

                <div className="border-b border-slate-800 px-4 py-3">
                  <p className="truncate text-sm font-medium text-white">
                    {userName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {userRole}
                  </p>
                </div>

                <div className="p-1.5">

                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-400 transition hover:bg-red-500/10"
                  >
                    Log Out
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;