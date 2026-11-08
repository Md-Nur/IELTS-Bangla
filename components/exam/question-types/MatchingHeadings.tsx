import React from "react";

export interface MatchingHeadingsProps {
  questionId: string;
  questionNumber: number;
  headingsMap: Record<string, string>;
  value: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function MatchingHeadings({
  questionId,
  questionNumber,
  headingsMap,
  value,
  onChange,
  disabled,
}: MatchingHeadingsProps) {
  const currentValue = (value || "").toLowerCase().trim();
  const headingKeys = Object.keys(headingsMap);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-3">
        <label htmlFor={`heading-select-${questionId}`} className="sr-only">
          Select heading for Question {questionNumber}
        </label>
        <select
          id={`heading-select-${questionId}`}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-lg px-3.5 py-2 text-sm rounded-md border border-slate-300 bg-white text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">-- Select correct heading --</option>
          {headingKeys.map((key) => (
            <option key={key} value={key}>
              {key}. {headingsMap[key]}
            </option>
          ))}
        </select>
      </div>

      {currentValue && headingsMap[currentValue] && (
        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200 dark:border-slate-700/60 max-w-lg">
          <span className="font-semibold text-slate-800 dark:text-slate-100 uppercase">
            Selected Heading {currentValue}:
          </span>{" "}
          {headingsMap[currentValue]}
        </div>
      )}
    </div>
  );
}
