import React from "react";
import { QuestionStatusItem } from "@/hooks/useExamState";

export interface ExamPaletteProps {
  questionStatusList: QuestionStatusItem[];
  currentQuestionNumber: number;
  onSelectQuestion: (questionNumber: number) => void;
}

export function ExamPalette({
  questionStatusList,
  currentQuestionNumber,
  onSelectQuestion,
}: ExamPaletteProps) {
  // Split into Passages: 1-13, 14-26, 27-40
  const passage1 = questionStatusList.filter((q) => q.questionNumber <= 13);
  const passage2 = questionStatusList.filter((q) => q.questionNumber > 13 && q.questionNumber <= 26);
  const passage3 = questionStatusList.filter((q) => q.questionNumber > 26);

  const groups = [
    { label: "Passage 1", items: passage1 },
    { label: "Passage 2", items: passage2 },
    { label: "Passage 3", items: passage3 },
  ];

  return (
    <nav
      aria-label="Question Navigator Palette"
      className="flex items-center gap-4 overflow-x-auto py-1 px-2 scrollbar-thin select-none"
    >
      {groups.map((group, gIdx) => (
        <div key={gIdx} className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            P{gIdx + 1}:
          </span>
          <div className="flex items-center gap-1">
            {group.items.map((item) => {
              const isCurrent = item.questionNumber === currentQuestionNumber;

              return (
                <button
                  key={item.questionNumber}
                  type="button"
                  onClick={() => onSelectQuestion(item.questionNumber)}
                  aria-label={`Go to Question ${item.questionNumber}${
                    item.isAnswered ? " (Answered)" : " (Unanswered)"
                  }${item.isFlagged ? " (Flagged)" : ""}`}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? "ring-2 ring-blue-500 z-10 scale-105"
                      : ""
                  } ${
                    item.isAnswered
                      ? "bg-slate-900 border border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{item.questionNumber}</span>
                  {item.isFlagged && (
                    <span
                      title="Flagged for review"
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white dark:ring-slate-900"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {gIdx < 2 && <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1" />}
        </div>
      ))}
    </nav>
  );
}
