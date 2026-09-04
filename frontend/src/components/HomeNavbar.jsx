import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";

function HomeNavbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}

        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 transition group-hover:scale-105">
            <FaShieldAlt size={21} />
          </div>

          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Fraud<span className="text-emerald-400">Guard</span>
            </h1>

            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
              AI Security
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            How It Works
          </a>

          <a
            href="#security"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Security
          </a>
        </nav>

        {/* Actions */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white sm:block"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Get Started

            <FaArrowRight
              size={10}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

      </div>
    </header>
  );
}

export default HomeNavbar;