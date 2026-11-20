"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLoader } from "@/components/common/BrandLoader";

interface StartExamButtonProps {
  testSlug: string;
  hasActiveAttempt?: boolean;
  activeAttemptId?: string;
  className?: string;
}

export function StartExamButton({
  testSlug,
  hasActiveAttempt = false,
  activeAttemptId,
  className = "",
}: StartExamButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAction = async () => {
    // If already in-progress, resume immediately
    if (hasActiveAttempt && activeAttemptId) {
      router.push(`/exam/${activeAttemptId}`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testSlug }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(json?.error || "পরীক্ষা শুরু করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        return;
      }

      if (json?.data?.attemptId) {
        router.push(`/exam/${json.data.attemptId}`);
      } else {
        setErrorMessage("সার্ভার থেকে ত্রুটিপূর্ণ রেসপন্স এসেছে।");
      }
    } catch {
      setErrorMessage("ইন্টারনেট সংযোগে ত্রুটি দেখা দিয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {errorMessage && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}
      <button
        type="button"
        onClick={handleAction}
        disabled={isLoading}
        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
          hasActiveAttempt
            ? "bg-[#D93A45] hover:bg-[#b82e38]"
            : "bg-[#087653] hover:bg-[#065e42]"
        } ${isLoading ? "opacity-75 cursor-wait" : "active:scale-[0.98]"} ${className}`}
      >
        {isLoading ? (
          <BrandLoader variant="inline" text="পরীক্ষা লোড হচ্ছে..." />
        ) : hasActiveAttempt ? (
          <>
            <span>চালিয়ে যান (Resume Test)</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        ) : (
          <>
            <span>মক টেস্ট শুরু করুন</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
