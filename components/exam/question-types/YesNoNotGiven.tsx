import React from "react";

export interface YesNoNotGivenProps {
  questionId: string;
  questionNumber: number;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const OPTIONS = ["YES", "NO", "NOT GIVEN"] as const;

export function YesNoNotGiven({
  questionId,
  questionNumber,
  value,
  onChange,
  disabled,
}: YesNoNotGivenProps) {
  const normalizedValue = (value || "").toUpperCase().trim();

  return (
    <div
      id={`yn-group-${questionId}`}
      role="radiogroup"
      aria-label={`Options for Question ${questionNumber}`}
      className="flex flex-wrap gap-2.5 mt-3.5"
    >
      {OPTIONS.map((opt) => {
        const isSelected =
          normalizedValue === opt ||
          (normalizedValue === "Y" && opt === "YES") ||
          (normalizedValue === "N" && opt === "NO") ||
          (normalizedValue === "NG" && opt === "NOT GIVEN");

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#087653]/30 cursor-pointer select-none ${
              isSelected
                ? "bg-[#087653] border-[#087653] text-white shadow-xs scale-102"
                : "bg-white border-[#20395F]/20 text-[#20395F] hover:bg-[#F8F8F9] hover:border-[#087653]/40"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
