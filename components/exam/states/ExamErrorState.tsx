import React from "react";
import Link from "next/link";

export interface ExamErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ExamErrorState({
  message = "পরীক্ষার প্রশ্ন ও বিষয়বস্তু লোড করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।",
  onRetry,
}: ExamErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F9] p-6 text-[#20395F]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#20395F]/15 p-7 text-center shadow-lg space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FDECEE] border border-[#D93A45]/30 flex items-center justify-center text-[#D93A45]">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold font-heading text-[#20395F]">
            পরীক্ষা লোড করতে সমস্যা হয়েছে
          </h2>
          <p className="text-sm text-[#20395F]/75 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#087653] hover:bg-[#065e42] text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
            >
              আবার চেষ্টা করুন
            </button>
          )}
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#20395F]/20 hover:bg-[#F8F8F9] text-[#20395F] font-semibold text-sm transition-colors text-center"
          >
            ড্যাশবোর্ডে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
