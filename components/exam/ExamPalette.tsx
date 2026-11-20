import React, { useState } from "react";
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
  // Determine active passage from current question number
  const activePassage =
    currentQuestionNumber <= 13 ? 1 : currentQuestionNumber <= 26 ? 2 : 3;

  // Track user-chosen tab override tied to current question
  const [tabOverride, setTabOverride] = useState<{
    target: number | "all";
    questionNumber: number;
  } | null>(null);

  const selectedPassage =
    tabOverride && tabOverride.questionNumber === currentQuestionNumber
      ? tabOverride.target
      : activePassage;

  // Split into Passages: 1-13, 14-26, 27-40
  const passage1 = questionStatusList.filter((q) => q.questionNumber <= 13);
  const passage2 = questionStatusList.filter((q) => q.questionNumber > 13 && q.questionNumber <= 26);
  const passage3 = questionStatusList.filter((q) => q.questionNumber > 26);

  const groups = [
    { passageNum: 1, label: "P1", range: "১–১৩", items: passage1 },
    { passageNum: 2, label: "P2", range: "১৪–২৬", items: passage2 },
    { passageNum: 3, label: "P3", range: "২৭–৪০", items: passage3 },
  ];

  // Questions to display based on selectedPassage
  const displayedItems =
    selectedPassage === "all"
      ? questionStatusList
      : selectedPassage === 1
      ? passage1
      : selectedPassage === 2
      ? passage2
      : passage3;

  const handleSelectTab = (target: number | "all") => {
    setTabOverride({ target, questionNumber: currentQuestionNumber });
  };

  return (
    <nav
      aria-label="Question Navigator Palette"
      className="flex items-center gap-2 select-none max-w-full"
    >
      {/* Passage Selector Pills */}
      <div className="flex items-center bg-[#F8F8F9] p-0.5 rounded-lg border border-[#20395F]/15 shrink-0">
        {groups.map((grp) => {
          const isGrpActive = selectedPassage === grp.passageNum;
          const answeredInGrp = grp.items.filter((i) => i.isAnswered).length;
          return (
            <button
              key={grp.passageNum}
              type="button"
              onClick={() => handleSelectTab(grp.passageNum)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isGrpActive
                  ? "bg-[#20395F] text-white shadow-2xs"
                  : "text-[#20395F]/70 hover:text-[#20395F] hover:bg-white"
              }`}
              title={`Passage ${grp.passageNum} (${grp.range}) - ${answeredInGrp}/${grp.items.length} সম্পন্ন`}
            >
              <span>{grp.label}</span>
              <span
                className={`text-[9px] px-1 rounded-full ${
                  isGrpActive ? "bg-white/20 text-white" : "bg-black/5 text-[#20395F]/60"
                }`}
              >
                {answeredInGrp}/{grp.items.length}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handleSelectTab(selectedPassage === "all" ? activePassage : "all")}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
            selectedPassage === "all"
              ? "bg-[#20395F] text-white shadow-2xs"
              : "text-[#20395F]/70 hover:text-[#20395F] hover:bg-white"
          }`}
          title="সকল ৪০টি প্রশ্ন একসাথে দেখুন"
        >
          সব (৪০)
        </button>
      </div>

      <div className="h-5 w-px bg-[#20395F]/15 shrink-0" />

      {/* Question Number Buttons (Overflow-free, no scrollbar bar) */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5 max-w-full">
        {displayedItems.map((item) => {
          const isCurrent = item.questionNumber === currentQuestionNumber;

          return (
            <button
              key={item.questionNumber}
              type="button"
              onClick={() => onSelectQuestion(item.questionNumber)}
              aria-label={`Go to Question ${item.questionNumber}${
                item.isAnswered ? " (Answered)" : " (Unanswered)"
              }${item.isFlagged ? " (Flagged)" : ""}`}
              className={`relative w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isCurrent
                  ? "ring-2 ring-[#087653] border border-[#087653] bg-[#E7F5EF] text-[#087653] scale-105 z-10 shadow-xs"
                  : item.isAnswered
                  ? "bg-[#20395F] border border-[#20395F] text-white shadow-2xs hover:bg-[#1a2e4c]"
                  : "bg-white border border-[#20395F]/20 text-[#20395F] hover:bg-[#F8F8F9] hover:border-[#087653]/40"
              }`}
            >
              <span>{item.questionNumber}</span>
              {item.isFlagged && (
                <span
                  title="রিভিউয়ের জন্য চিহ্নিত"
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFD66B] ring-1.5 ring-white shadow-2xs"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
