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
    <div className="mt-3.5 space-y-2.5">
      <div className="flex items-center gap-3">
        <label htmlFor={`heading-select-${questionId}`} className="sr-only">
          Select heading for Question {questionNumber}
        </label>
        <select
          id={`heading-select-${questionId}`}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 text-sm rounded-xl border border-[#20395F]/20 bg-white text-[#20395F] focus:outline-none focus:ring-2 focus:ring-[#087653]/20 focus:border-[#087653] cursor-pointer"
        >
          <option value="">-- সঠিক হেডিং নির্বাচন করুন --</option>
          {headingKeys.map((key) => (
            <option key={key} value={key}>
              {key}. {headingsMap[key]}
            </option>
          ))}
        </select>
      </div>

      {currentValue && headingsMap[currentValue] && (
        <div className="text-xs text-[#20395F] bg-[#E7F5EF] p-3 rounded-xl border border-[#087653]/30 max-w-lg">
          <span className="font-bold text-[#087653] uppercase">
            নির্বাচিত হেডিং {currentValue}:
          </span>{" "}
          {headingsMap[currentValue]}
        </div>
      )}
    </div>
  );
}
