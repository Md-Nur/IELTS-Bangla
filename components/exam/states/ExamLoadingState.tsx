import React from "react";
import { BrandLoader } from "@/components/common/BrandLoader";

export function ExamLoadingState() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      {/* Header Skeleton */}
      <div className="h-14 sm:h-16 border-b border-[#20395F]/15 bg-white px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 bg-[#E7F5EF] rounded-xl animate-pulse" />
          <div className="h-4 w-36 bg-slate-100 rounded-lg animate-pulse hidden sm:block" />
        </div>
        <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      {/* Split Skeleton Panes */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-20">
          <BrandLoader text="পরীক্ষার বিষয়বস্তু ও প্রশ্ন লোড করা হচ্ছে..." />
        </div>

        {/* Left Pane Skeleton */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#20395F]/10 space-y-4 bg-white">
          <div className="h-6 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-3/5 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Right Pane Skeleton */}
        <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6 bg-[#F8F8F9]">
          <div className="h-20 w-full bg-white rounded-2xl border border-[#20395F]/10 animate-pulse" />
          <div className="space-y-4">
            <div className="h-28 w-full bg-white rounded-2xl border border-[#20395F]/10 p-5 space-y-3">
              <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-[#E7F5EF] rounded-lg" />
                <div className="h-8 w-20 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Skeleton */}
      <div className="h-14 border-t border-[#20395F]/15 bg-white px-6 flex items-center justify-between">
        <div className="h-8 w-28 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-8 w-48 bg-[#E7F5EF] rounded-xl animate-pulse hidden sm:block" />
        <div className="h-8 w-28 bg-[#087653]/20 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
