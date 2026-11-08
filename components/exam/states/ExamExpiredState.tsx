import React from "react";
import Link from "next/link";

export function ExamExpiredState() {
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
            Session Concluded
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Examination Time Expired
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            The allocated 60 minutes for this IELTS Academic Reading attempt has expired according to server-authoritative time.
          </p>
        </div>

        <div className="pt-3">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
