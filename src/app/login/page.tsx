"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Phone, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      // Redirect based on role
      const role = data.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "agent") router.push("/agent/profile");
      else router.push("/customer/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setSuccessMsg(data.message + " (Test code: 123456)");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Invalid OTP");
      }

      const role = data.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "agent") router.push("/agent/profile");
      else router.push("/customer/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setAuthMode("password");
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-12">
        <div className="w-full max-w-md rounded-[24px] bg-[#111116]/90 border border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-zinc-400 mt-1">Sign in to your EstateAI Kolkata account</p>
          </div>

          {/* Auth Mode Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
            <button
              onClick={() => { setAuthMode("password"); setError(null); }}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                authMode === "password" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Email & Password
            </button>
            <button
              onClick={() => { setAuthMode("otp"); setError(null); }}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                authMode === "otp" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Mobile / Email OTP
            </button>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Password Form */}
          {authMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In with Password"}
              </button>
            </form>
          ) : (
            /* OTP Form */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">Phone or Email</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        placeholder="+91 98300 12345 or email"
                        className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Get Verification Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">Enter 6-Digit OTP</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full tracking-widest text-center font-mono rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-[11px] text-zinc-400 hover:text-white"
                  >
                    Change phone/email
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 text-center">
              Quick Test Accounts:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => handleQuickDemoLogin("admin@estateai.kolkata.in", "admin123")}
                className="py-1 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin("sanjay.b@estateai.kolkata.in", "agent123")}
                className="py-1 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center"
              >
                Agent
              </button>
              <button
                onClick={() => handleQuickDemoLogin("anirban.s@example.com", "customer123")}
                className="py-1 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center"
              >
                Buyer
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Create account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
