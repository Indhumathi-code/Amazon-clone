"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import axios from "axios";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/check-user", { email });
      const data = res.data;

      if (data.exists) {
        setStep(2);
      } else {
        router.push(`/register?identifier=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`);
      }
      setLoading(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Network error. Make sure the server is running.";
      setError(msg);
      setLoading(false);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const data = res.data;

      if (!data.success) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("amazon_token", data.token);
      localStorage.setItem("amazon_user", data.user.name);

      router.push(redirect);
    } catch (err) {
      const msg = err.response?.data?.message || "Network error. Make sure the server is running.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-4 px-4 font-sans select-none">
      
      {/* Centered Amazon Logo */}
      <Link href="/" className="mb-4 mt-2 hover:opacity-90 transition-opacity">
        <img
          src="/amazon-logo.svg"
          alt="Amazon"
          className="h-8 w-[105px] object-contain"
        />
      </Link>

      {/* Sign-in Card Container */}
      <div className="w-full max-w-[348px] bg-white border border-gray-300 rounded-lg px-6 py-5">
        <h1 className="text-[28px] font-normal text-gray-900 leading-tight mb-4 tracking-tight">Sign in or create account</h1>

        <form onSubmit={step === 1 ? handleContinue : loginUser} className="space-y-3.5">
          {step === 1 ? (
            <div>
              <label className="block text-[13px] font-bold text-gray-900 mb-1">
                Enter mobile number or email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[34px] border border-gray-400 rounded-[3px] px-2 text-sm text-gray-900 focus:border-[#007185] focus:ring-[3px] focus:ring-[#c8f3fa] focus:outline-none transition-all duration-200"
              />
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-2 text-xs">
                <span className="text-gray-800 font-medium truncate max-w-[200px]">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="text-[#0066c0] hover:text-[#c45500] hover:underline font-normal cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="block text-[13px] font-bold text-gray-900">Password</label>
                  <span className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-normal">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full h-[34px] border border-gray-400 rounded-[3px] px-2 text-sm text-gray-900 focus:border-[#007185] focus:ring-[3px] focus:ring-[#c8f3fa] focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50/50 text-gray-800 text-xs rounded-xl p-3.5 flex items-start gap-2.5 shadow-3xs mt-3">
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-red-700 font-bold block">There was a problem</span>
                <p className="text-[11px] text-gray-600 mt-0.5 font-medium leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[32px] mt-3 text-[13px] font-normal rounded-full border border-[#FCD200] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] transition-colors shadow-xs focus:outline-none cursor-pointer disabled:opacity-60 text-gray-900 flex items-center justify-center font-semibold"
          >
            {loading ? "Please wait..." : step === 1 ? "Continue" : "Sign in"}
          </button>

          <p className="text-[12px] text-gray-900 leading-relaxed font-normal mt-4">
            By continuing, you agree to Amazon&apos;s{" "}
            <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
              Conditions of Use
            </span>{" "}
            and{" "}
            <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
              Privacy Notice
            </span>
            .
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center mt-6 mb-5 w-full">
          <div className="h-px bg-gray-200 flex-grow"></div>
        </div>

        {/* Buying for work */}
        <div className="mb-2">
          <h3 className="text-[13px] font-bold text-gray-900">Buying for work?</h3>
          <Link href="/register" className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline font-normal mt-0.5 inline-block">
            Create a free business account
          </Link>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full mt-14">
        <div className="w-full border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white h-8 shadow-inner shadow-gray-100/50"></div>
        <div className="max-w-[1000px] mx-auto flex flex-col items-center mt-2">
          <div className="flex gap-8 text-[11px] text-[#0066c0] font-normal mb-3">
            <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
            <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
          </div>
          <div className="text-[11px] text-gray-500 font-normal mb-8">
            © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans select-none p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#FF9900]/20 border-t-[#FF9900] rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Loading...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}