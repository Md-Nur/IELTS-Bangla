"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { BrandLoader } from "@/components/common/BrandLoader";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isTokenPresent = Boolean(token);

  const [isVerifying, setIsVerifying] = useState(isTokenPresent);
  const [tokenError, setTokenError] = useState<string | null>(
    !isTokenPresent
      ? "পাসওয়ার্ড রিসেট টোকেন অনুপস্থিত। অনুগ্রহ করে ইমেইলের সম্পূর্ণ লিংকটি ব্যবহার করুন।"
      : null
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function checkToken() {
      try {
        const res = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token!)}`);
        const data = await res.json().catch(() => null);

        if (!isMounted) return;
        if (!res.ok || !data?.valid) {
          setTokenError(
            data?.error ||
              "পাসওয়ার্ড রিসেট লিংকটি অবৈধ অথবা এর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার অনুরোধ করুন।"
          );
        } else {
          setUserEmail(data.email);
        }
      } catch {
        if (isMounted) {
          setTokenError("টোকেন যাচাই করতে নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    checkToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("দুইটি পাসওয়ার্ড মিলছে না। অনুগ্রহ করে যাচাই করুন।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage("ইন্টারনেট সংযোগে ত্রুটি। অনুগ্রহ করে আপনার নেটওয়ার্ক পরীক্ষা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#20395F]/15 p-8 shadow-lg">
        <BrandLoader variant="section" text="রিসেট লিংক যাচাই করা হচ্ছে..." />
      </div>
    );
  }

  // Token is invalid or expired
  if (tokenError) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#20395F]/15 p-8 shadow-lg space-y-5 text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#20395F]">
          লিংকটি কার্যকর নয়
        </h2>
        <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
          {tokenError}
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] transition-colors shadow-sm"
          >
            নতুন লিংক পাঠান
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#20395F]/15 p-8 shadow-lg space-y-6 text-center animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-[#E7F5EF] text-[#087653] flex items-center justify-center mx-auto">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#20395F]">
            পাসওয়ার্ড পরিবর্তিত হয়েছে!
          </h2>
          <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
            আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্টে প্রবেশ করতে পারেন।
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] transition-colors shadow-sm cursor-pointer"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  // Active Reset Password Form
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-[#20395F]/15 p-7 sm:p-9 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold text-[#20395F]">
            নতুন পাসওয়ার্ড নির্ধারণ
          </h1>
          {userEmail && (
            <p className="text-xs text-[#087653] font-medium bg-[#E7F5EF] py-1 px-3 rounded-full inline-block">
              {userEmail}
            </p>
          )}
          <p className="text-xs sm:text-sm text-[#20395F]/75">
            নিরাপদ রাখতে কমপক্ষে ৮ অক্ষরের একটি নতুন পাসওয়ার্ড প্রদান করুন
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              নতুন পাসওয়ার্ড (New Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                autoComplete="new-password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
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

          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <BrandLoader variant="inline" text="পাসওয়ার্ড আপডেট করা হচ্ছে..." />
            ) : (
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F8F9] text-[#20395F]">
      <header className="h-18 px-4 sm:px-8 flex items-center justify-between border-b border-[#20395F]/10 bg-white">
        <Logo size="md" href="/" />
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-[#087653] hover:underline"
        >
          লগইন পেজে যান
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <Suspense fallback={<BrandLoader variant="section" text="লোড হচ্ছে..." />}>
          <ResetPasswordContent />
        </Suspense>
      </main>

      <footer className="py-4 text-center text-xs text-[#20395F]/60">
        © 2026 IELTS বাংলা · সর্বস্বত্ব সংরক্ষিত
      </footer>
    </div>
  );
}
