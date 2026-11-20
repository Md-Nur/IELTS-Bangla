import React from "react";
import Link from "next/link";

export function ExamExpiredState({ attemptId }: { attemptId?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F9] p-6 text-[#20395F]">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-[#20395F]/15 p-8 text-center shadow-xl space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
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
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">
            পরীক্ষা সমাপ্ত
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#20395F]">
            পরীক্ষার নির্ধারিত সময় শেষ হয়ে গেছে
          </h1>
          <p className="text-sm text-[#20395F]/75 leading-relaxed max-w-sm mx-auto">
            অফিশিয়াল সার্ভার সময় অনুযায়ী এই IELTS Academic Reading পরীক্ষার বরাদ্দকৃত ৬০ মিনিট অতিক্রান্ত হয়েছে। আপনার সংরক্ষিত সকল উত্তর চূড়ান্তভাবে গৃহীত হয়েছে।
          </p>
        </div>

        <div className="pt-3 flex flex-wrap justify-center gap-3">
          {attemptId && (
            <Link
              href={`/results/${attemptId}`}
              className="inline-block px-6 py-3 rounded-xl bg-[#087653] hover:bg-[#065e42] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              পরীক্ষার ফলাফল ও রিভিউ দেখুন
            </Link>
          )}
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-white border border-[#20395F]/20 hover:bg-[#F8F8F9] text-[#20395F] font-bold text-sm transition-colors shadow-2xs cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
