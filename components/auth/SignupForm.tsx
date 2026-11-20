"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { BrandLoader } from "@/components/common/BrandLoader";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার ইমেইল প্রদান করুন।");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("দুইটি পাসওয়ার্ড মিলছে না। অনুগ্রহ করে যাচাই করুন।");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("প্ল্যাটফর্ম ব্যবহারের শর্তাবলি এবং নীতিমালায় সম্মতি প্রদান আবশ্যক।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage("এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে। অনুগ্রহ করে লগইন করুন।");
        } else {
          setErrorMessage(data?.error || "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        }
        return;
      }

      // Successful registration sets session cookie and redirects directly to dashboard
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
      <div className="bg-white rounded-2xl border border-[#20395F]/15 p-7 sm:p-9 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold text-[#20395F]">
            নতুন স্টুডেন্ট অ্যাকাউন্ট
          </h1>
          <p className="text-xs sm:text-sm text-[#20395F]/75">
            কয়েক সেকেন্ডেই রেজিস্ট্রেশন করে মক টেস্ট শুরু করুন
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              পুরো নাম (Full Name)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মোঃ সাব্বির আহমেদ"
              autoComplete="name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
            />
          </div>

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
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              পাসওয়ার্ড (Password - ন্যূনতম ৮ অক্ষর)
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

          <div>
            <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="পাসওয়ার্ডটি আবার লিখুন"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#20395F]/20 text-sm text-[#20395F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087653] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#087653] focus:ring-[#087653] border-[#20395F]/30"
            />
            <label htmlFor="terms" className="text-xs text-[#20395F]/80 leading-snug cursor-pointer select-none">
              আমি প্ল্যাটফর্মের{" "}
              <Link href="/terms" className="text-[#087653] font-semibold hover:underline">
                শর্তাবলি
              </Link>{" "}
              ও{" "}
              <Link href="/privacy" className="text-[#087653] font-semibold hover:underline">
                গোপনীয়তা নীতি
              </Link>
              -তে সম্মতি জানাচ্ছি।
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isLoading
                ? "bg-[#087653]/70 cursor-wait"
                : "bg-[#087653] hover:bg-[#065e42] active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <BrandLoader variant="inline" text="অ্যাকাউন্ট তৈরি হচ্ছে..." />
            ) : (
              <span>অ্যাকাউন্ট তৈরি করুন</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#20395F]/75">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href={`/login${redirectPath !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-bold text-[#087653] hover:underline"
          >
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
