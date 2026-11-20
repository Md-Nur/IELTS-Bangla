import React from "react";
import { QuestionStatusItem } from "@/hooks/useExamState";
import { BrandLoader } from "@/components/common/BrandLoader";

export interface ExamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionStatusList: QuestionStatusItem[];
  onSelectQuestion: (questionNumber: number) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function ExamReviewModal({
  isOpen,
  onClose,
  questionStatusList,
  onSelectQuestion,
  onSubmit,
  isSubmitting = false,
}: ExamReviewModalProps) {
  if (!isOpen) return null;

  const total = questionStatusList.length;
  const answered = questionStatusList.filter((q) => q.isAnswered).length;
  const unanswered = total - answered;
  const flagged = questionStatusList.filter((q) => q.isFlagged).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20395F]/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-[#20395F]/15 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#20395F]/10 flex items-center justify-between bg-[#F8F8F9]">
          <div>
            <h2 id="review-modal-title" className="text-lg font-bold text-[#20395F]">
              পরীক্ষার সারসংক্ষেপ ও প্রশ্ন নেভিগেশন
            </h2>
            <p className="text-xs text-[#20395F]/70 mt-0.5">
              পরীক্ষা চূড়ান্তভাবে জমা দেওয়ার আগে সকল ৪০টি প্রশ্নের অবস্থা যাচাই করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#20395F]/40 hover:text-[#20395F] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="মডাল বন্ধ করুন"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="px-6 py-3.5 bg-white border-b border-[#20395F]/10 grid grid-cols-3 gap-4 text-center">
          <div className="p-2 rounded-xl bg-[#E7F5EF] border border-[#087653]/20">
            <div className="text-xl font-black text-[#087653]">{answered}</div>
            <div className="text-xs text-[#087653]/80 font-bold">উত্তর দেওয়া হয়েছে</div>
          </div>
          <div className={`p-2 rounded-xl border ${unanswered > 0 ? "bg-[#FDECEE] border-[#D93A45]/30" : "bg-[#F8F8F9] border-[#20395F]/10"}`}>
            <div className={`text-xl font-black ${unanswered > 0 ? "text-[#D93A45]" : "text-[#20395F]/60"}`}>{unanswered}</div>
            <div className={`text-xs font-bold ${unanswered > 0 ? "text-[#D93A45]" : "text-[#20395F]/70"}`}>অনুত্তরিত</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-xl font-black text-amber-700">{flagged}</div>
            <div className="text-xs text-amber-800 font-bold">রিভিউ চিহ্নিত</div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
            {questionStatusList.map((item) => {
              return (
                <button
                  key={item.questionNumber}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(item.questionNumber);
                    onClose();
                  }}
                  className={`relative h-11 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    item.isCurrent
                      ? "ring-2 ring-[#087653] border-[#087653] bg-[#E7F5EF] text-[#087653] scale-105 shadow-2xs"
                      : item.isAnswered
                      ? "bg-[#20395F] border-[#20395F] text-white shadow-2xs hover:bg-[#1a2e4c]"
                      : "bg-white border-[#20395F]/20 text-[#20395F] hover:bg-[#F8F8F9] hover:border-[#087653]"
                  }`}
                >
                  <span>{item.questionNumber}</span>
                  {item.isFlagged && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FFD66B] ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#20395F]/75">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-[#20395F]" />
              <span className="font-medium">উত্তর সম্পন্ন</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-white border border-[#20395F]/30" />
              <span className="font-medium">অনুত্তরিত</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FFD66B] ring-1 ring-white" />
              <span className="font-medium">রিভিউয়ের জন্য চিহ্নিত</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8F8F9] border-t border-[#20395F]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#20395F]/20 hover:bg-white text-[#20395F] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
          >
            পরীক্ষায় ফিরে যান
          </button>

          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-sm ${
                isSubmitting
                  ? "bg-[#087653]/60 cursor-not-allowed"
                  : "bg-[#087653] hover:bg-[#065e42] hover:shadow cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <BrandLoader variant="inline" text="ফলাফল প্রস্তুত হচ্ছে..." />
              ) : (
                <span>পরীক্ষা জমা দিন (Submit Test)</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
