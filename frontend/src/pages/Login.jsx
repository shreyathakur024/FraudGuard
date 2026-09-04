import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(formData.email, formData.password);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT — BRANDING */}

        <div className="relative hidden overflow-hidden border-r border-slate-800 lg:flex lg:flex-col lg:justify-between p-12">

          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="relative">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                <FaShieldAlt size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Fraud<span className="text-emerald-400">Guard</span>
                </h1>

                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  AI Security
                </p>
              </div>
            </Link>

          </div>

          <div className="relative max-w-lg">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Intelligent Protection
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white">
              Secure every transaction with
              <span className="text-emerald-400">
                {" "}AI-powered fraud detection.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Monitor transaction activity, identify suspicious
              behavior and understand the risks behind every payment.
            </p>

          </div>

          <p className="relative text-xs text-slate-700">
            FraudGuard AI • Secure Transaction Intelligence
          </p>

        </div>

        {/* RIGHT — LOGIN */}

        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                <FaShieldAlt size={19} />
              </div>

              <h1 className="text-lg font-bold">
                Fraud<span className="text-emerald-400">Guard</span>
              </h1>

            </div>

            {/* Header */}

            <div className="mb-8">

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Sign in to FraudGuard
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Access your transaction security dashboard.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Email address
                </label>

                <div className="relative">

                  <FaEnvelope
                    size={13}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-slate-900"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-xs font-medium text-slate-400">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <FaLock
                    size={13}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-slate-900"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>

                </div>

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <FaArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            {/* Signup */}

            <p className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Create one
              </Link>

            </p>

            {/* Security note */}

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-700">

              <FaShieldAlt size={10} />

              Secure authentication

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;