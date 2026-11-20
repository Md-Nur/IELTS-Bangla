"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { BrandLoader } from "@/components/common/BrandLoader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার ইমেইল ঠিকানাটি লিখুন।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error || "অনুরোধটি পাঠানো সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        return;
      }

      setSuccessMessage(
        data?.message ||
          "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স ও স্প্যাম ফোল্ডার চেক করুন।"
      );
    } catch {
      setErrorMessage("ইন্টারনেট সংযোগে ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে আপনার নেটওয়ার্ক চেক করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F8F9] text-[#20395F]">
      {/* Simple Top Navigation */}
      <header className="h-18 px-4 sm:px-8 flex items-center justify-between border-b border-[#20395F]/10 bg-white">
        <Logo size="md" href="/" />
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-[#087653] hover:underline"
        >
          ← লগইন পেজে ফিরে যান
        </Link>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-[#20395F]/15 p-7 sm:p-8 shadow-2xs space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-11 h-11 rounded-xl bg-[#E7F5EF] text-[#087653] flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#20395F]">
                পাসওয়ার্ড রিসেট
              </h1>
              <p className="text-xs text-[#20395F]/75">
                আপনার নিবন্ধিত ইমেইলটি লিখুন। আমরা নিরাপদ পাসওয়ার্ড রিসেট লিংক পাঠাব।
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-xl bg-[#E7F5EF] border border-[#087653]/30 text-xs sm:text-sm text-[#087653] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <svg className="w-5 h-5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>অনুরোধ সফল হয়েছে</span>
                  </div>
                  <p className="text-[#20395F]/85 leading-relaxed">
                    {successMessage}
                  </p>
                  <p className="text-[11px] text-[#20395F]/70 pt-1">
                    * লিংকটি ৩০ মিনিট পর্যন্ত কার্যকর থাকবে।
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] transition-colors shadow-2xs"
                  >
                    লগইন পেজে যান
                  </Link>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#20395F] uppercase tracking-wider mb-1.5">
                    আপনার নিবন্ধিত ইমেইল (Email)
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <BrandLoader variant="inline" text="অনুরোধ পাঠানো হচ্ছে..." />
                  ) : (
                    <span>রিসেট লিংক পাঠান</span>
                  )}
                </button>
              </form>
            )}

            {/* Back link */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#20395F]/75 hover:text-[#087653] transition-colors"
              >
                পাসওয়ার্ড মনে পড়েছে? <span className="text-[#087653] underline">লগইন করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#20395F]/60">
        © 2026 IELTS বাংলা · সর্বস্বত্ব সংরক্ষিত
      </footer>
    </div>
  );
}
