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
}: ExamBottomBarProps) {
  const isFirst = currentQuestionNumber <= 1;
  const isLast = currentQuestionNumber >= totalQuestions;

  return (
    <footer className="sticky bottom-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2 select-none shadow-xs">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Review toggle for current question */}
        <div className="flex items-center gap-2 shrink-0">
          {currentQuestionId && (
            <button
              type="button"
              onClick={() => onToggleFlag(currentQuestionId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                isCurrentFlagged
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700"
                  : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-750"
              }`}
              title="Flag or unflag current question for review"
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  isCurrentFlagged ? "fill-current text-amber-500" : "text-slate-400"
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
              <span className="hidden sm:inline">Review</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-750"
          >
            Review ({currentQuestionNumber}/40)
          </button>
        </div>

        {/* Center: Question Palette (Hidden on small mobile, visible on desktop/tablet) */}
        <div className="hidden md:flex flex-1 justify-center min-w-0">
          <ExamPalette
            questionStatusList={questionStatusList}
            currentQuestionNumber={currentQuestionNumber}
            onSelectQuestion={onSelectQuestion}
          />
        </div>

        {/* Right: Prev & Next controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isFirst
                ? "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-750 cursor-pointer shadow-2xs"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isLast}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isLast
                ? "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed"
                : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 cursor-pointer shadow-2xs"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
