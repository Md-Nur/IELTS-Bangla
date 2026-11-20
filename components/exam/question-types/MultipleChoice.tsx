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
      className="space-y-2.5 mt-3.5"
    >
      {optionsList.map((optText, index) => {
        // Option text usually starts with "A ", "B ", "C ", etc.
        const match = optText.match(/^([A-Da-d])[.\s)]/);
        const letter = match ? match[1].toUpperCase() : String.fromCharCode(65 + index);
        const isSelected = selectedOption === letter;

        return (
          <label
            key={index}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
              isSelected
                ? "bg-[#E7F5EF] border-[#087653] text-[#20395F] font-semibold ring-1 ring-[#087653]/25 shadow-2xs"
                : "bg-white border-[#20395F]/15 hover:bg-[#F8F8F9] hover:border-[#087653]/40 text-[#20395F]/90"
            }`}
          >
            <input
              type="radio"
              name={`mcq-${questionId}`}
              value={letter}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(letter)}
              className="mt-1 h-4 w-4 accent-[#087653] text-[#087653] border-[#20395F]/20 focus:ring-[#087653]"
            />
            <span className="text-sm leading-relaxed flex-1">
              {optText}
            </span>
          </label>
        );
      })}
    </div>
  );
}
