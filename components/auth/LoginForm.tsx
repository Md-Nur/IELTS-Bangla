"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { BrandLoader } from "@/components/common/BrandLoader";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage("ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        } else if (res.status === 403) {
          setErrorMessage("আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। সাপোর্টে যোগাযোগ করুন।");
        } else {
          setErrorMessage(data?.error || "লগইন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        }
        return;
      }

      // Successful login -> Redirect to target or dashboard
      router.push(redirectPath);
      router.refresh();
    } catch {
      setErrorMessage("ইন্টারনেট সংযোগে ত্রুটি। অনুগ্রহ করে আপনার নেটওয়ার্ক চেক করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-[#20395F]/15 p-7 sm:p-8 shadow-2xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20395F]">
            স্টুডেন্ট লগইন
          </h1>
          <p className="text-xs text-[#20395F]/75">
            আপনার অ্যাকাউন্টে প্রবেশ করে মক টেস্ট শুরু করুন
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              ইমেইল ঠিকানা (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              autoComplete="email"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider">
                পাসওয়ার্ড (Password)
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#087653] hover:underline font-medium cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#087653] focus:ring-[#087653] border-[#20395F]/30"
              />
              <span className="text-xs text-[#20395F]/80">
                আমাকে লগইন অবস্থায় রাখুন (৭ দিন)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer ${
              isLoading
                ? "bg-[#087653]/70 cursor-wait"
                : "bg-[#087653] hover:bg-[#065e42] active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <BrandLoader variant="inline" text="যাচাই করা হচ্ছে..." />
            ) : (
              <span>লগইন করুন</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#20395F]/75">
          এখনও অ্যাকাউন্ট নেই?{" "}
          <Link
            href={`/signup${redirectPath !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-bold text-[#087653] hover:underline"
          >
            নতুন অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </div>
  );
}
