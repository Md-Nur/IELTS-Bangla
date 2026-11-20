import React from "react";
import { QuestionStatusItem } from "@/hooks/useExamState";
import { ExamPalette } from "./ExamPalette";

export interface ExamBottomBarProps {
  currentQuestionNumber: number;
  currentQuestionId?: string;
  isCurrentFlagged: boolean;
  questionStatusList: QuestionStatusItem[];
  totalQuestions: number;
  onToggleFlag: (questionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectQuestion: (questionNumber: number) => void;
  onOpenReviewModal: () => void;
  onSubmitExam?: () => void;
}

export function ExamBottomBar({
  currentQuestionNumber,
  currentQuestionId,
  isCurrentFlagged,
  questionStatusList,
  totalQuestions,
  onToggleFlag,
  onPrev,
  onNext,
  onSelectQuestion,
  onOpenReviewModal,
  onSubmitExam,
}: ExamBottomBarProps) {
  const isFirst = currentQuestionNumber <= 1;
  const isLast = currentQuestionNumber >= totalQuestions;
  const answeredCount = questionStatusList.filter((q) => q.isAnswered).length;

  return (
    <footer className="shrink-0 bg-white border-t border-[#20395F]/15 px-3 sm:px-6 py-2.5 select-none shadow-xs z-20">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Left: Flag Review toggle & Overview Button */}
        <div className="flex items-center gap-2 shrink-0">
          {currentQuestionId && (
            <button
              type="button"
              onClick={() => onToggleFlag(currentQuestionId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isCurrentFlagged
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-2xs"
                  : "bg-[#F8F8F9] text-[#20395F]/80 border-[#20395F]/15 hover:bg-white hover:text-[#20395F]"
              }`}
              title="বর্তমান প্রশ্নটিকে রিভিউয়ের জন্য চিহ্নিত বা বাতিল করুন"
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  isCurrentFlagged ? "fill-current text-amber-500" : "text-[#20395F]/40"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span className="hidden sm:inline">
                {isCurrentFlagged ? "চিহ্নিত (ফ্ল্যাগ)" : "ফ্ল্যাগ"}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#20395F] bg-[#F8F8F9] hover:bg-white border border-[#20395F]/15 transition-all cursor-pointer flex items-center gap-1.5"
            title="সকল প্রশ্নের রিভিউ ও সারসংক্ষেপ দেখুন"
          >
            <svg className="w-3.5 h-3.5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>
              রিভিউ <span className="text-[#087653]">({answeredCount}/{totalQuestions})</span>
            </span>
          </button>
        </div>

        {/* Center: Question Palette (Hidden on small mobile, visible on tablet & desktop) */}
        <div className="hidden md:flex flex-1 justify-center min-w-0 px-2 overflow-hidden">
          <ExamPalette
            questionStatusList={questionStatusList}
            currentQuestionNumber={currentQuestionNumber}
            onSelectQuestion={onSelectQuestion}
          />
        </div>

        {/* Right: Navigation (Prev / Next) & Submit Exam */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isFirst
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white text-[#20395F] border-[#20395F]/20 hover:bg-[#F8F8F9] hover:border-[#087653] cursor-pointer shadow-2xs"
            }`}
            title="আগের প্রশ্ন"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">পূর্ববর্তী</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isLast}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isLast
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-[#20395F] text-white border-[#20395F] hover:bg-[#1a2e4c] cursor-pointer shadow-2xs"
            }`}
            title="পরের প্রশ্ন"
          >
            <span className="hidden sm:inline">পরবর্তী</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Submit Button in Bottom Bar */}
          {onSubmitExam && (
            <button
              type="button"
              onClick={onSubmitExam}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#087653] hover:bg-[#065e42] shadow-xs hover:shadow transition-all cursor-pointer"
              title="টেস্ট চূড়ান্তভাবে জমা দিন"
            >
              <span>জমা দিন</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
