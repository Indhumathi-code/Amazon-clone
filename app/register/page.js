"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import axios from "axios";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState(() => {
    const identifier = searchParams ? searchParams.get("identifier") : null;
    const isEmail = identifier ? identifier.includes("@") : false;
    return {
      name: "",
      email: isEmail ? identifier : "",
      mobile: isEmail ? "" : (identifier ? identifier.replace(/\D/g, "").slice(-10) : ""),
      password: "",
    };
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Passwords must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", form);
      const data = res.data;

      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Network error. Make sure the server is running.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-8 px-4 font-sans select-none">
      
      {/* Centered Amazon Logo */}
      <Link href="/" className="mb-6 hover:opacity-90 transition-opacity">
        <img
          src="/amazon-logo.svg"
          alt="Amazon"
          className="h-9 w-28 object-contain"
        />
      </Link>

      {/* Create Account Card Container */}
      <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-5">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile number</label>
            <div className="flex gap-2">
              <select
                disabled
                className="h-9 border border-gray-300 rounded-lg bg-gray-50 text-xs text-gray-500 px-3 cursor-not-allowed font-semibold focus:outline-none"
              >
                <option>IN +91</option>
              </select>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                className="flex-grow h-9 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 font-medium"
                placeholder="your number"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Your name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full h-9 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 font-medium"
              placeholder="First and last name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full h-9 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 font-medium"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Password (at least 6 characters)
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full h-9 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-455 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200"
              placeholder="At least 6 characters"
            />
          </div>

          {/* Info icon and Password requirement */}
          <div className="flex items-start gap-2 text-[11px] text-gray-550 leading-relaxed font-semibold">
            <Info size={14} className="text-[#007185] shrink-0 mt-0.5" />
            <span>Passwords must be at least 6 characters.</span>
          </div>

          <p className="text-[10px] text-gray-450 leading-relaxed font-medium">
            To verify your number, we will send you a text message with a temporary code. Message and data rates may apply.
          </p>

          {error && (
            <div className="border border-red-200 bg-red-50/50 text-gray-800 text-xs rounded-xl p-3 flex items-start gap-2 shadow-3xs">
              <AlertTriangle size={15} className="text-red-650 shrink-0 mt-0.5" />
              <span className="text-[11px] text-gray-600 font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 text-xs font-bold rounded-lg border border-[#a88734] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] transition-all shadow-xs focus:outline-none cursor-pointer disabled:opacity-60 text-gray-950 flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? "Verifying..." : "Verify mobile number"}
          </button>

          <p className="text-[11px] text-gray-500 leading-relaxed mt-4 font-medium text-center">
            By creating an account or logging in, you agree to Amazon&apos;s{" "}
            <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-bold">
              Conditions of Use
            </span>{" "}
            and{" "}
            <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-bold">
              Privacy Policy
            </span>
            .
          </p>
        </form>

        {/* Divider with text */}
        <div className="flex items-center my-6 w-full">
          <div className="h-px bg-gray-150 flex-grow"></div>
          <span className="text-[11px] text-gray-400 px-3 font-semibold uppercase tracking-wider">Already a customer?</span>
          <div className="h-px bg-gray-150 flex-grow"></div>
        </div>

        <div className="text-center text-xs">
          <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#0066c0] hover:text-[#c45500] hover:underline font-bold">
            Sign in instead
          </Link>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full max-w-[1000px] border-t border-gray-200 mt-8 pt-6 flex flex-col items-center">
        <div className="flex gap-6 text-[11px] text-[#0066c0] font-semibold mb-3">
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
          © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center font-sans">
        <div className="text-gray-500 font-medium">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}