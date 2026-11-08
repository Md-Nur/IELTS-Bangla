import React, { useMemo } from "react";
import { countWords } from "@/lib/scoring/wordLimit";

export interface TextCompletionProps {
  questionId: string;
  questionNumber: number;
  wordLimit?: number | null;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function TextCompletion({
  questionId,
  questionNumber,
  wordLimit,
  value,
  onChange,
  disabled,
}: TextCompletionProps) {
  const textValue = value || "";
  const currentWordCount = useMemo(() => countWords(textValue), [textValue]);
  const isOverLimit = Boolean(wordLimit && currentWordCount > wordLimit);

  return (
    <div id={`text-completion-${questionId}`} className="mt-3 space-y-1.5">
      <div className="relative">
        <input
          id={`input-q-${questionNumber}`}
          type="text"
          value={textValue}
          disabled={disabled}
          placeholder="Type your answer here..."
          onChange={(e) => onChange(e.target.value)}
          className={`w-full max-w-lg px-3.5 py-2 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
            isOverLimit
              ? "border-amber-500 focus:border-amber-600 focus:ring-amber-500/20"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400"
          }`}
        />
      </div>

      {wordLimit && (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-mono ${
              isOverLimit
                ? "text-amber-600 dark:text-amber-400 font-semibold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {currentWordCount} / {wordLimit} {wordLimit === 1 ? "word" : "words"}
          </span>
          {isOverLimit && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              (Exceeds word limit)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
