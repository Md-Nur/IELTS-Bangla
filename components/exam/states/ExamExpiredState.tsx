import React from "react";
import Link from "next/link";

export function ExamExpiredState({ attemptId }: { attemptId?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-md space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-200 dark:border-amber-800/40">
            পরীক্ষা সমাপ্ত
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            পরীক্ষার সময় শেষ হয়ে গেছে
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            অফিশিয়াল সার্ভার সময় অনুযায়ী এই IELTS Academic Reading পরীক্ষার বরাদ্দকৃত ৬০ মিনিট অতিক্রান্ত হয়েছে। আপনার সংরক্ষিত সকল উত্তর চূড়ান্তভাবে গৃহীত হয়েছে।
          </p>
        </div>

        <div className="pt-3 flex flex-wrap justify-center gap-3">
          {attemptId && (
            <Link
              href={`/results/${attemptId}`}
              className="inline-block px-6 py-2.5 rounded-lg bg-[#087653] hover:bg-[#065e42] text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              পরীক্ষার ফলাফল ও রিভিউ দেখুন
            </Link>
          )}
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
