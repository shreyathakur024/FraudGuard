import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function PaymentSimulator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientEmail: "",
    merchant: "",
    amount: "",
    paymentMethod: "UPI",
  });

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [step, setStep] = useState("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };
  
  const handleGetLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLocationLoading(false);
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          setError(
            "Location permission was denied. You can allow location access and try again."
          );
        } else if (error.code === 2) {
          setError(
            "Your current location could not be detected."
          );
        } else {
          setError(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleReview = (e) => {
    e.preventDefault();

    if (!formData.recipientEmail.trim()) {
      setError(
        "Please enter the recipient's email."
      );
      return;
    }

    if (!formData.merchant.trim()) {
      setError(
        "Please enter a merchant name."
      );
      return;
    }

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError(
        "Please enter a valid transaction amount."
      );
      return;
    }

    setError("");
    setStep("review");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem(
          "fraudguard_token"
        );

      if (!token) {
        throw new Error(
          "Please login again to continue."
        );
      }

      const response = await fetch(
        `${API_URL}/api/transactions/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            recipientEmail:
              formData.recipientEmail
                .trim()
                .toLowerCase(),

            merchant:
              formData.merchant.trim(),

            amount:
              Number(formData.amount),

            paymentMethod:
              formData.paymentMethod,

            // Location is optional.
            // If enabled, send current coordinates.
            latitude:
              location?.latitude ?? null,

            longitude:
              location?.longitude ?? null,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Transaction analysis failed."
        );
      }


      const result = {
        recipientEmail:
          formData.recipientEmail
            .trim()
            .toLowerCase(),

        merchant:
          formData.merchant.trim(),

        amount:
          Number(formData.amount),

        paymentMethod:
          formData.paymentMethod,

        locationEnabled:
          !!location,

        ...data.data,
      };


      sessionStorage.setItem(
        "fraudguard_result",
        JSON.stringify(result)
      );

      navigate("/result");

    } catch (err) {
      console.error(
        "FraudGuard prediction error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to FraudGuard server."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      </div>


      {/* Navbar */}
      <nav className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-black text-slate-950 shadow-lg shadow-emerald-500/10 transition group-hover:scale-105">
              F
            </div>

            <span className="text-xl font-bold tracking-tight">
              Fraud
              <span className="text-emerald-400">
                Guard
              </span>
            </span>

          </button>


          <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">

            <span className="h-2 w-2 rounded-full bg-amber-400" />

            <span className="text-xs font-semibold tracking-wide text-amber-300">
              DEMO ENVIRONMENT
            </span>

          </div>

        </div>

      </nav>


      {/* Main */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:py-16">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            Secure Transaction

          </div>


          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">

            {step === "details"
              ? "Send Money"
              : "Review Transaction"}

          </h1>


          <p className="mt-4 text-base leading-7 text-slate-400">

            {step === "details"
              ? "Enter the payment details and let FraudGuard assess the transaction."
              : "Review your transaction before running the FraudGuard security analysis."}

          </p>

        </div>


        {/* Card */}
        <div className="mx-auto mt-10 max-w-2xl">

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur-xl">

            {/* Card Header */}
            <div className="border-b border-slate-800 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    step === "details"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-cyan-500/10 text-cyan-400"
                  }`}
                >
                  {step === "details"
                    ? "₹"
                    : "✓"}
                </div>

                <div>

                  <h2 className="font-semibold text-white">

                    {step === "details"
                      ? "Payment Details"
                      : "Transaction Summary"}

                  </h2>

                  <p className="text-sm text-slate-500">

                    {step === "details"
                      ? "All transactions are simulated"
                      : "Verify the information below"}

                  </p>

                </div>

              </div>

            </div>

            {step === "details" && (

              <form
                onSubmit={handleReview}
                className="px-6 py-7 sm:px-8"
              >

                {/* Recipient */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Send To
                  </label>

                  <input
                    type="email"
                    name="recipientEmail"
                    value={
                      formData.recipientEmail
                    }
                    onChange={handleChange}
                    placeholder="friend@example.com"
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    The recipient must have a FraudGuard account.
                  </p>

                </div>


                {/* Merchant */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Merchant / Purpose
                  </label>

                  <input
                    type="text"
                    name="merchant"
                    value={
                      formData.merchant
                    }
                    onChange={handleChange}
                    placeholder="e.g. Amazon"
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  />

                </div>


                {/* Amount */}
                <div className="mb-6">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="amount"
                      value={
                        formData.amount
                      }
                      onChange={handleChange}
                      placeholder="500"
                      min="1"
                      step="0.01"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                    />

                  </div>

                </div>


                {/* Payment Method */}
                <div className="mb-6">

                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-3 gap-3">

                    {[
                      "UPI",
                      "Card",
                      "Bank Transfer",
                    ].map((method) => (

                      <button
                        type="button"
                        key={method}
                        onClick={() =>
                          setFormData(
                            (prev) => ({
                              ...prev,
                              paymentMethod:
                                method,
                            })
                          )
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-medium transition ${
                          formData.paymentMethod ===
                          method
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-700 bg-slate-950/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        {method}
                      </button>

                    ))}

                  </div>

                </div>


                {/* Location */}
                <div className="mb-7 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm font-medium text-slate-300">
                        Transaction Location
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Allow FraudGuard to use your current location as an additional fraud-risk signal.
                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        location
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {location
                        ? "Enabled"
                        : "Not enabled"}
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={
                      handleGetLocation
                    }
                    disabled={
                      locationLoading
                    }
                    className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {locationLoading
                      ? "Detecting Location..."
                      : location
                      ? "↻ Update Current Location"
                      : "⌖ Use Current Location"}

                  </button>


                  {location && (

                    <p className="mt-3 text-xs text-emerald-400">
                      ✓ Current location captured
                    </p>

                  )}

                </div>


                {/* Automatic data */}
                <div className="mb-7 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 text-emerald-400">
                      ◷
                    </div>

                    <div>

                      <p className="text-sm font-medium text-slate-300">
                        Automatic transaction data
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        FraudGuard automatically uses the sender and recipient balances stored in the database and records the transaction time on the server.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Error */}
                {error && (

                  <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">

                    <div className="flex gap-2">

                      <span>⚠</span>

                      <span>
                        {error}
                      </span>

                    </div>

                  </div>

                )}


                {/* Review */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-4 font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99]"
                >
                  Review Payment

                  <span className="text-lg">
                    →
                  </span>
                </button>

              </form>

            )}

            {step === "review" && (

              <div className="px-6 py-7 sm:px-8">

                <div className="mb-8 text-center">

                  <p className="text-sm text-slate-500">
                    Payment Amount
                  </p>

                  <p className="mt-2 text-4xl font-bold tracking-tight">

                    ₹
                    {Number(
                      formData.amount
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>


                <div className="overflow-hidden rounded-2xl border border-slate-800">

                  <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <span className="text-sm text-slate-500">
                      Recipient
                    </span>

                    <span className="text-right text-sm font-medium text-white">
                      {formData.recipientEmail}
                    </span>

                  </div>


                  <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <span className="text-sm text-slate-500">
                      Merchant
                    </span>

                    <span className="text-sm font-medium text-white">
                      {formData.merchant}
                    </span>

                  </div>


                  <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <span className="text-sm text-slate-500">
                      Payment Method
                    </span>

                    <span className="text-sm font-medium text-white">
                      {formData.paymentMethod}
                    </span>

                  </div>


                  <div className="flex items-center justify-between px-5 py-4">

                    <span className="text-sm text-slate-500">
                      Location
                    </span>

                    <span
                      className={`text-sm font-medium ${
                        location
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {location
                        ? "Enabled"
                        : "Not shared"}
                    </span>

                  </div>

                </div>


                {/* AI */}
                <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      ✦
                    </div>

                    <div>

                      <p className="font-medium text-emerald-300">
                        FraudGuard AI Analysis
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        XGBoost will analyze the transaction behaviour, while the available location context can provide an additional risk signal.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Error */}
                {error && (

                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">

                    <div className="flex gap-2">

                      <span>⚠</span>

                      <span>
                        {error}
                      </span>

                    </div>

                  </div>

                )}


                {/* Buttons */}
                <div className="mt-7 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setStep(
                        "details"
                      );
                      setError("");
                    }}
                    className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                  >
                    ← Edit
                  </button>


                  <button
                    type="button"
                    disabled={loading}
                    onClick={
                      handleAnalyze
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Transaction

                        <span>
                          →
                        </span>
                      </>
                    )}

                  </button>

                </div>

              </div>

            )}

          </div>


          {/* Bottom note */}
          <div className="mt-6 flex items-start justify-center gap-2 px-4 text-center">

            <span className="text-xs text-slate-600">
              🔒
            </span>

            <p className="text-xs leading-5 text-slate-600">
              FraudGuard is running in a simulated environment.
              No real payment or money transfer will occur.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default PaymentSimulator;