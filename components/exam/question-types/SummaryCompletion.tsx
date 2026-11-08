import React from "react";

export interface SummaryCompletionProps {
  questionId: string;
  questionNumber: number;
  wordListMap: Record<string, string>;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function SummaryCompletion({
  questionId,
  questionNumber,
  wordListMap,
  value,
  onChange,
  disabled,
}: SummaryCompletionProps) {
  const currentValue = (value || "").toUpperCase().trim();
  const wordKeys = Object.keys(wordListMap);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-3">
        <label htmlFor={`summary-select-${questionId}`} className="sr-only">
          Select letter for Question {questionNumber}
        </label>
        <select
          id={`summary-select-${questionId}`}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-lg px-3.5 py-2 text-sm rounded-md border border-slate-300 bg-white text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">-- Select option letter (A–H) --</option>
          {wordKeys.map((key) => (
            <option key={key} value={key}>
              {key}: {wordListMap[key]}
            </option>
          ))}
        </select>
      </div>

      {currentValue && wordListMap[currentValue] && (
        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200 dark:border-slate-700/60 max-w-lg flex items-center justify-between">
          <span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Selected:
            </span>{" "}
            Letter <strong className="text-blue-600 dark:text-blue-400">{currentValue}</strong> ({wordListMap[currentValue]})
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
