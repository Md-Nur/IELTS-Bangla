import React from "react";
import Link from "next/link";

interface FinalCtaProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function FinalCtaSection({ user }: FinalCtaProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#087653] to-[#044A34] text-white text-center relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-[#8FD8C4] border border-white/20">
          Get Started Today
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          আজই শুরু করুন আপনার IELTS প্রস্তুতি
        </h2>

        <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          কোনো ফি ছাড়াই সম্পূর্ণ একাডেমিক রিডিং মক টেস্ট দিন। নিজের স্কোর, ব্যান্ড এস্টিমেশন এবং বিস্তারিত অ্যানালাইসিস দেখুন এক ক্লিকেই।
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-[#044A34] bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>{user ? "ড্যাশবোর্ডে পরীক্ষা দিন" : "বিনামূল্যে অ্যাকাউন্ট খুলুন"}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {!user && (
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm text-white/90 hover:text-white border border-white/30 hover:border-white/60 transition-colors"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
