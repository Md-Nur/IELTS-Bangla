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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg
            className="w-6 h-6"
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

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            পরীক্ষা লোড করতে সমস্যা হয়েছে
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#087653] hover:bg-[#065e42] text-white font-medium text-sm transition-colors cursor-pointer"
            >
              আবার চেষ্টা করুন
            </button>
          )}
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors text-center"
          >
            ড্যাশবোর্ডে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
