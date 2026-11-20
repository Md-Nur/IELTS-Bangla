import React from "react";
import Link from "next/link";
import { BrandLoader } from "@/components/common/BrandLoader";

export function ResultLoadingState() {
  return (
    <div className="min-h-screen bg-[#F8F8F9] flex flex-col items-center justify-center p-6">
      <BrandLoader
        variant="full"
        text="ফলাফল ও বিশ্লেষণ লোড হচ্ছে..."
        subtext="আপনার মূল্যায়নকৃত স্কোর, ব্যান্ড স্কোর এবং বিস্তারিত উত্তরমালা প্রস্তুত করা হচ্ছে।"
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
    <div className="min-h-screen bg-[#F8F8F9] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl border border-rose-200 p-8 text-center shadow-2xs space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#D93A45]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[#20395F]">
          ফলাফল লোড করা সম্ভব হয়নি
        </h2>
        <p className="text-xs text-[#20395F]/75 leading-relaxed">
          {errorMessage || "পরীক্ষার ফলাফল পাওয়া যায়নি। অনুগ্রহ করে আপনার প্রচেষ্টা বা ইন্টারনেট সংযোগ যাচাই করুন।"}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-[#087653] text-white text-xs font-bold hover:bg-[#065e42] transition-colors cursor-pointer"
            >
              পুনরায় চেষ্টা করুন
            </button>
          )}
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-100 text-[#20395F] text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
