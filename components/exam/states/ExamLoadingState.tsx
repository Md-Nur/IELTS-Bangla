import React from "react";

export function ExamLoadingState() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Header Skeleton */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-36 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse hidden sm:block" />
        </div>
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Split Skeleton Panes */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane Skeleton */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2.5 pt-4">
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
          </div>
          <div className="space-y-2.5 pt-4">
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
            <div className="h-4 w-3/5 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Right Pane Skeleton */}
        <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6">
          <div className="h-20 w-full bg-slate-200/70 dark:bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-24 w-full bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Skeleton */}
      <div className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center justify-between">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse hidden sm:block" />
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
