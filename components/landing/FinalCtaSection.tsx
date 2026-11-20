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
    <section className="py-20 bg-[#087653] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-[#8FD8C4] border border-white/20">
          <span>নিবন্ধন ও প্র্যাকটিস</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          আজই আপনার রিডিং প্রস্তুতি যাচাই করুন
        </h2>

        <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed">
          বিনামূল্যে সম্পূর্ণ ৬০ মিনিটের একাডেমিক রিডিং মক টেস্ট সম্পন্ন করে তাৎক্ষণিক ব্যান্ড স্কোর ও প্রশ্নের বিস্তারিত সমাধান জেনে নিন।
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs text-[#087653] bg-white hover:bg-[#F8F8F9] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{user ? "ড্যাশবোর্ডে গিয়ে পরীক্ষা দিন" : "বিনামূল্যে অ্যাকাউন্ট খুলুন"}</span>
            <svg
              className="w-4 h-4"
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
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-bold text-xs text-white/90 hover:text-white border border-white/30 hover:border-white/60 transition-colors"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
