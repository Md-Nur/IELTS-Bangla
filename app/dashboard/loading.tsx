import React from "react";
import { BrandLoader } from "@/components/common/BrandLoader";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      {/* Skeleton Navbar Header */}
      <div className="h-18 bg-white border-b border-[#20395F]/10 px-4 sm:px-8 flex items-center justify-between">
        <div className="h-8 w-36 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse hidden md:block" />
        <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <BrandLoader variant="section" text="আপনার ড্যাশবোর্ড লোড হচ্ছে..." />

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#20395F]/10 space-y-2 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Catalog Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#20395F]/10 p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
              <div className="h-16 w-full bg-slate-100 rounded-xl" />
              <div className="h-9 w-36 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
