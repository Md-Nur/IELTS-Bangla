import React from "react";
import Link from "next/link";
import { BrandLoader } from "@/components/common/BrandLoader";

export function ResultLoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <BrandLoader
        variant="full"
        text="ফলাফল ও বিশ্লেষণ লোড হচ্ছে..."
        subtext="আপনার মূল্যায়নকৃত স্কোর, ব্যান্ড স্কোর এবং উত্তরমালা তৈরি করা হচ্ছে।"
      />
    </div>
  );
}

export function ResultErrorState({
  errorMessage,
  onRetry,
}: {
  errorMessage?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-8 text-center shadow-sm space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          ফলাফল লোড করা সম্ভব হয়নি
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {errorMessage || "পরীক্ষার ফলাফল পাওয়া যায়নি। অনুগ্রহ করে আপনার প্রচেষ্টা বা সংযোগ যাচাই করুন।"}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white dark:bg-emerald-600 text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              পুনরায় চেষ্টা করুন
            </button>
          )}
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
