import React from "react";

export interface MultipleChoiceProps {
  questionId: string;
  questionNumber: number;
  options: unknown | null;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function MultipleChoice({
  questionId,
  questionNumber,
  options,
  value,
  onChange,
  disabled,
}: MultipleChoiceProps) {
  const optionsList: string[] = Array.isArray(options) ? options : [];
  const selectedOption = (value || "").toUpperCase().trim();

  return (
    <div
      role="radiogroup"
      aria-label={`Options for Question ${questionNumber}`}
      className="space-y-2 mt-3"
    >
      {optionsList.map((optText, index) => {
        // Option text usually starts with "A ", "B ", "C ", etc.
        const match = optText.match(/^([A-Da-d])[.\s)]/);
        const letter = match ? match[1].toUpperCase() : String.fromCharCode(65 + index);
        const isSelected = selectedOption === letter;

        return (
          <label
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
              isSelected
                ? "bg-blue-50/80 border-blue-500 dark:bg-blue-950/40 dark:border-blue-500"
                : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750"
            }`}
          >
            <input
              type="radio"
              name={`mcq-${questionId}`}
              value={letter}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(letter)}
              className="mt-1 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 dark:border-slate-600 dark:focus:ring-blue-600"
            />
            <span
              className={`text-sm leading-relaxed ${
                isSelected
                  ? "font-medium text-slate-900 dark:text-slate-100"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {optText}
            </span>
          </label>
        );
      })}
    </div>
  );
}
