import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function ResultHeader() {
  return (
    <header className="bg-white border-b border-[#20395F]/15 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <Logo size="sm" href="/" />
          <div className="hidden sm:block border-l border-[#20395F]/15 pl-3">
            <span className="text-[11px] font-bold text-[#087653] uppercase tracking-wider block">
              ফলাফল ও মূল্যায়ন
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#20395F] hover:bg-[#F8F8F9] border border-[#20395F]/20 transition-colors cursor-pointer"
            title="রিপোর্ট প্রিন্ট করুন"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>রিপোর্ট প্রিন্ট</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#087653] hover:bg-[#065e42] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ড্যাশবোর্ড</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
