import React, { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "রেজিস্ট্রেশন | IELTS বাংলা",
  description: "IELTS বাংলা প্ল্যাটফর্মে নতুন অ্যাকাউন্ট খুলে ফ্রি মক টেস্টে অংশ নিন।",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F9] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 border-b border-[#20395F]/10 bg-white px-6 sm:px-10 flex items-center justify-between">
        <Logo size="md" href="/" />
        <Link
          href="/"
          className="text-xs font-semibold text-[#20395F]/70 hover:text-[#087653] transition-colors flex items-center gap-1"
        >
          <span>← হোমপেজে ফিরুন</span>
        </Link>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#20395F]/15 p-8 text-center text-xs text-slate-500">
              লোড হচ্ছে...
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#20395F]/60 border-t border-[#20395F]/10">
        © 2026 IELTS বাংলা · সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}
