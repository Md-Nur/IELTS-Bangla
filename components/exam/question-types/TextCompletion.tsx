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
    <div id={`text-completion-${questionId}`} className="mt-3.5 space-y-2">
      <div className="relative">
        <input
          id={`input-q-${questionNumber}`}
          type="text"
          value={textValue}
          disabled={disabled}
          placeholder="এখানে উত্তর লিখুন..."
          onChange={(e) => onChange(e.target.value)}
          className={`w-full max-w-lg px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 bg-white text-[#20395F] ${
            isOverLimit
              ? "border-[#D93A45] focus:border-[#D93A45] focus:ring-[#D93A45]/20"
              : "border-[#20395F]/20 focus:border-[#087653] focus:ring-[#087653]/20"
          }`}
        />
      </div>

      {wordLimit && (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-semibold ${
              isOverLimit
                ? "text-[#D93A45]"
                : "text-[#20395F]/70"
            }`}
          >
            শব্দ গণনা: {currentWordCount} / {wordLimit} {wordLimit === 1 ? "word" : "words"}
          </span>
          {isOverLimit && (
            <span className="text-[#D93A45] font-bold">
              (অনুমোদিত শব্দসীমা অতিক্রম করেছে)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
