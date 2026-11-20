import React from "react";
import { QuestionStatusItem } from "@/hooks/useExamState";
import { BrandLoader } from "@/components/common/BrandLoader";

export interface ExamSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  questionStatusList: QuestionStatusItem[];
  isSubmitting?: boolean;
}

export function ExamSubmissionModal({
  isOpen,
  onClose,
  onConfirm,
  questionStatusList,
  isSubmitting = false,
}: ExamSubmissionModalProps) {
  if (!isOpen) return null;

  const total = questionStatusList.length;
  const answered = questionStatusList.filter((q) => q.isAnswered).length;
  const unanswered = total - answered;
  const flagged = questionStatusList.filter((q) => q.isFlagged).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20395F]/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-[#20395F]/15 w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#20395F]/10 flex items-center justify-between bg-[#F8F8F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7F5EF] text-[#087653] flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 id="submission-modal-title" className="text-lg font-bold text-[#20395F]">
                পরীক্ষা জমা দেওয়ার নিশ্চিতকরণ
              </h2>
              <p className="text-xs text-[#20395F]/70">
                IELTS Academic Reading Mock Test
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-[#20395F]/40 hover:text-[#20395F] hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="মডাল বন্ধ করুন"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Status Summary */}
        <div className="p-6 space-y-5">
          {/* Answered vs Unanswered Stats Card */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#E7F5EF] border border-[#087653]/20">
              <div className="text-2xl font-black text-[#087653]">{answered}</div>
              <div className="text-xs font-semibold text-[#087653]/80 mt-0.5">উত্তর দেওয়া হয়েছে</div>
            </div>
            <div className={`p-3.5 rounded-xl border ${unanswered > 0 ? "bg-[#FDECEE] border-[#D93A45]/30" : "bg-slate-50 border-slate-200"}`}>
              <div className={`text-2xl font-black ${unanswered > 0 ? "text-[#D93A45]" : "text-slate-400"}`}>
                {unanswered}
              </div>
              <div className={`text-xs font-semibold ${unanswered > 0 ? "text-[#D93A45]" : "text-slate-500"} mt-0.5`}>
                অনুত্তরিত রয়েছে
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-2xl font-black text-amber-700">{flagged}</div>
              <div className="text-xs font-semibold text-amber-800 mt-0.5">রিভিউ চিহ্নিত</div>
            </div>
          </div>

          {/* Unanswered Warning if any */}
          {unanswered > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FDECEE] border border-[#D93A45]/25 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#D93A45] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-[#D93A45] leading-relaxed">
                <strong className="font-bold">সতর্কতা:</strong> আপনার {unanswered}টি প্রশ্নের উত্তর এখনও অনুত্তরিত রয়েছে। আইইএলটিএস পরীক্ষায় কোনো নেগেটিভ মার্কিং নেই, তাই অনুত্তরিত প্রশ্নগুলোরও আনুমানিক উত্তর দেওয়ার পরামর্শ দেওয়া হয়।
              </div>
            </div>
          )}

          {/* Final Submission Notice */}
          <div className="text-xs text-[#20395F]/75 leading-relaxed bg-[#F8F8F9] p-3.5 rounded-xl border border-[#20395F]/10">
            <span className="font-semibold text-[#20395F]">গুরুত্বপূর্ণ তথ্য:</span> একবার নিশ্চিত করার পর আপনার উত্তরপত্র চূড়ান্তভাবে মূল্যায়ন সার্ভারে জমা হয়ে যাবে এবং উত্তর আর পরিবর্তন করা সম্ভব হবে না।
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#F8F8F9] border-t border-[#20395F]/10 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#20395F]/20 hover:bg-white text-[#20395F] font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50 text-center"
          >
            পরীক্ষায় ফিরে যান
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all ${
              isSubmitting
                ? "bg-[#087653]/60 cursor-not-allowed"
                : "bg-[#087653] hover:bg-[#065e42] hover:shadow-lg cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <BrandLoader variant="inline" text="উত্তরপত্র জমা হচ্ছে..." />
            ) : (
              <>
                <span>হ্যাঁ, চূড়ান্তভাবে জমা দিন</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
