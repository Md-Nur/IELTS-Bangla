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
      className="flex flex-wrap gap-2.5 mt-3"
    >
      {OPTIONS.map((opt) => {
        const isSelected = normalizedValue === opt || (normalizedValue === "Y" && opt === "YES") || (normalizedValue === "N" && opt === "NO") || (normalizedValue === "NG" && opt === "NOT GIVEN");

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer select-none ${
              isSelected
                ? "bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600 dark:text-white ring-2 ring-slate-800/30"
                : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
