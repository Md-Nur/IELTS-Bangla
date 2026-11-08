import React from "react";
import Link from "next/link";

export function ResultLoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 animate-spin" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Loading Examination Results...
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Retrieving your authoritative evaluated scores, passage breakdowns, and answer keys.
        </p>
      </div>
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
          Unable to Load Results
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {errorMessage || "The examination result could not be retrieved. Please check your credentials or attempt status."}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-blue-600 text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Retry
            </button>
          )}
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
