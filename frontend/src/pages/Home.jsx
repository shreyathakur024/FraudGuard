import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaBrain,
  FaBolt,
  FaBell,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaExclamationTriangle,
  FaCreditCard,
} from "react-icons/fa";

import HomeNavbar from "../components/HomeNavbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      <HomeNavbar />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}

      <section className="relative px-6 pb-24 pt-36 lg:px-8 lg:pb-32 lg:pt-44">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">

            {/* Hero Content */}

            <div>

              {/* Badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
                  AI-Powered Fraud Protection
                </span>

              </div>

              {/* Heading */}

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">

                Detect fraud.
                <br />

                <span className="text-emerald-400">
                  Protect every transaction.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                FraudGuard uses intelligent transaction analysis to
                identify suspicious activity, assess risk, and help
                you make safer payment decisions.
              </p>

              {/* Buttons */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() => navigate("/signup")}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Get Started

                  <FaArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => navigate("/payment")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
                >
                  Try Transaction Analyzer
                </button>

              </div>

              {/* Trust points */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                <TrustPoint text="Real-time analysis" />

                <TrustPoint text="Risk scoring" />

                <TrustPoint text="Smart alerts" />

              </div>

            </div>

            {/* Hero Dashboard Preview */}

            <div className="relative">

              <div className="absolute -inset-8 rounded-[3rem] bg-emerald-500/[0.04] blur-3xl" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl shadow-black/30">

                {/* Window Header */}

                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                    FraudGuard AI
                  </span>

                </div>

                {/* Preview */}

                <div className="p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-600">
                        Transaction Analysis
                      </p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        Payment Review
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <FaShieldAlt size={15} />
                    </div>

                  </div>

                  {/* Transaction */}

                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                          <FaCreditCard size={15} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Online Payment
                          </p>

                          <p className="text-[10px] text-slate-600">
                            Transaction #FG-28491
                          </p>
                        </div>

                      </div>

                      <p className="text-sm font-semibold text-white">
                        ₹4,250
                      </p>

                    </div>

                  </div>

                  {/* Risk */}

                  <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                          <FaCheckCircle size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            Low Risk
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            Transaction appears safe
                          </p>
                        </div>

                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">
                          8%
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          Risk
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[8%] rounded-full bg-emerald-400" />
                    </div>

                  </div>

                  {/* Mini stats */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <MiniStat
                      icon={FaChartLine}
                      label="Risk Score"
                      value="0.08"
                    />

                    <MiniStat
                      icon={FaBolt}
                      label="Analysis"
                      value="Instant"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════
          SECURITY STRIP
      ═══════════════════════════════════════ */}

      <section
        id="security"
        className="border-y border-slate-800/70 bg-slate-900/30"
      >

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-800/70 px-6 lg:grid-cols-4 lg:px-8">

          <SecurityStat
            value="AI"
            label="Powered Detection"
          />

          <SecurityStat
            value="24/7"
            label="Continuous Protection"
          />

          <SecurityStat
            value="Real-time"
            label="Risk Analysis"
          />

          <SecurityStat
            value="Secure"
            label="Account Protection"
          />

        </div>

      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}

      <section
        id="features"
        className="px-6 py-24 lg:px-8 lg:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="Intelligent Protection"
            title="Everything you need to understand transaction risk."
            description="FraudGuard combines transaction intelligence, risk scoring, and security alerts in one focused platform."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <FeatureCard
              icon={FaBrain}
              title="AI-Powered Detection"
              description="Analyze transaction patterns and identify potentially fraudulent activity using intelligent prediction."
            />

            <FeatureCard
              icon={FaChartLine}
              title="Risk Scoring"
              description="Turn complex transaction signals into an easy-to-understand risk score and risk level."
            />

            <FeatureCard
              icon={FaBell}
              title="Smart Security Alerts"
              description="Stay informed when suspicious activity is detected and quickly review important security events."
            />

          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}

      <section
        id="how-it-works"
        className="border-y border-slate-800/70 bg-slate-900/20 px-6 py-24 lg:px-8 lg:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="Simple Process"
            title="Fraud detection without the complexity."
            description="Analyze a transaction in three simple steps."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <StepCard
              number="01"
              icon={FaCreditCard}
              title="Enter Transaction"
              description="Provide the transaction details you want FraudGuard to analyze."
            />

            <StepCard
              number="02"
              icon={FaBrain}
              title="AI Analyzes Risk"
              description="Our fraud detection model evaluates transaction signals and calculates risk."
            />

            <StepCard
              number="03"
              icon={FaShieldAlt}
              title="Get a Clear Result"
              description="Receive a risk level, score, and actionable security information."
            />

          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}

      <section className="px-6 py-24 lg:px-8 lg:py-32">

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-16 text-center sm:px-12">

          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl" />

          <div className="relative">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FaLock size={19} />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make every transaction a safer one.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Start using FraudGuard to analyze transaction risk
              and keep suspicious activity under control.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Create Your Account

              <FaArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}

      <footer className="border-t border-slate-800/70 px-6 py-10 lg:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
              <FaShieldAlt size={15} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-200">
                Fraud<span className="text-emerald-400">Guard</span>
              </p>

              <p className="text-[9px] uppercase tracking-wider text-slate-700">
                AI Security
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} FraudGuard. Intelligent transaction security.
          </p>

        </div>

      </footer>

    </div>
  );
}

/* ═══════════════════════════════════════
    TRUST POINT
═══════════════════════════════════════ */

function TrustPoint({ text }) {
  return (
    <div className="flex items-center gap-2">

      <FaCheckCircle
        size={12}
        className="text-emerald-400"
      />

      <span className="text-xs text-slate-500">
        {text}
      </span>

    </div>
  );
}

/* ═══════════════════════════════════════
    MINI STAT
═══════════════════════════════════════ */

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">

      <div className="flex items-center gap-2">

        <Icon
          size={11}
          className="text-emerald-400"
        />

        <span className="text-[9px] uppercase tracking-wider text-slate-600">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-300">
        {value}
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════
    SECURITY STAT
═══════════════════════════════════════ */

function SecurityStat({ value, label }) {
  return (
    <div className="px-5 py-8 text-center sm:px-8">

      <p className="text-xl font-bold text-emerald-400">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════
    SECTION HEADING
═══════════════════════════════════════ */

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="max-w-2xl">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════
    FEATURE CARD
═══════════════════════════════════════ */

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-slate-900/80">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500/15">
        <Icon size={18} />
      </div>

      <h3 className="mt-6 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════
    STEP CARD
═══════════════════════════════════════ */

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="relative">

      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

        <div className="flex items-center justify-between">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Icon size={18} />
          </div>

          <span className="text-3xl font-bold text-slate-800">
            {number}
          </span>

        </div>

        <h3 className="mt-7 text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

export default Home;