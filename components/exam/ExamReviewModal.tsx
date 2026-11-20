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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              পরীক্ষার সারসংক্ষেপ ও নেভিগেশন
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              পরীক্ষা চূড়ান্তভাবে জমা দেওয়ার আগে সকল ৪০টি প্রশ্নের উত্তর যাচাই করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <span className="sr-only">Close modal</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{answered}</div>
            <div className="text-xs text-slate-500 font-medium">উত্তর দেওয়া হয়েছে</div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-500 dark:text-slate-400">{unanswered}</div>
            <div className="text-xs text-slate-500 font-medium">অনুত্তরিত</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{flagged}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">রিভিউয়ের জন্য চিহ্নিত</div>
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
                  className={`relative h-11 rounded-lg border text-sm font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    item.isCurrent
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : ""
                  } ${
                    item.isAnswered
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{item.questionNumber}</span>
                  {item.isFlagged && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-900 dark:bg-blue-600" />
              <span>উত্তর সম্পন্ন</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700" />
              <span>অনুত্তরিত</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>রিভিউয়ের জন্য চিহ্নিত</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            পরীক্ষায় ফিরে যান
          </button>

          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-white font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <BrandLoader variant="inline" text="ফলাফল প্রস্তুত হচ্ছে..." />
              ) : (
                <span>পরীক্ষা জমা দিন (Submit)</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
