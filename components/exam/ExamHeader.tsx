import React from "react";
import { CountdownTimerResult } from "@/hooks/useCountdownTimer";
import { SectionDTO } from "@/lib/services/examAttemptService";

export interface ExamHeaderProps {
  testTitle: string;
  sections: SectionDTO[];
  currentSectionIndex: number;
  timer: CountdownTimerResult;
  mobileActiveTab: "passage" | "questions";
  onSelectSection: (index: number) => void;
  onSelectMobileTab: (tab: "passage" | "questions") => void;
  onExitClick: () => void;
}

export function ExamHeader({
  testTitle,
  sections,
  currentSectionIndex,
  timer,
  mobileActiveTab,
  onSelectSection,
  onSelectMobileTab,
  onExitClick,
}: ExamHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white select-none">
      {/* Top Bar */}
      <div className="h-14 px-3 sm:px-6 flex items-center justify-between gap-4">
        {/* Branding & Test Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-xs tracking-wider">
              IELTS
            </span>
            <span className="font-semibold text-sm tracking-tight text-slate-100 hidden sm:inline">
              Bangla
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />

          <h1 className="text-xs sm:text-sm font-medium text-slate-300 truncate">
            {testTitle}
          </h1>
        </div>

        {/* Center: Passage Tabs (Desktop only) */}
        <nav
          aria-label="Passage Navigation"
          className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80"
        >
          {sections.map((sec, idx) => {
            const isSelected = idx === currentSectionIndex;
            const qStart = idx === 0 ? 1 : idx === 1 ? 14 : 27;
            const qEnd = idx === 0 ? 13 : idx === 1 ? 26 : 40;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(idx)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                Passage {idx + 1} ({qStart}–{qEnd})
              </button>
            );
          })}
        </nav>

        {/* Right: Countdown Timer & Exit */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Prominent Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-sm tracking-wider font-bold transition-all ${
              timer.isUrgent
                ? "bg-red-950/80 text-red-400 border border-red-800 animate-pulse"
                : timer.isWarning
                ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                : "bg-slate-800 text-slate-100 border border-slate-700"
            }`}
            aria-live="polite"
            aria-label={`Time remaining: ${timer.formattedTime}`}
          >
            <svg
              className={`w-4 h-4 ${
                timer.isUrgent ? "text-red-400" : timer.isWarning ? "text-amber-300" : "text-slate-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{timer.formattedTime}</span>
          </div>

          {/* Exit / Leave button */}
          <button
            type="button"
            onClick={onExitClick}
            className="px-2.5 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Leave examination"
          >
            <span className="hidden sm:inline">Exit</span>
            <svg
              className="w-4 h-4 sm:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Header: Passage Selector & Mobile Tab Toggle */}
      <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-slate-950 border-t border-slate-800 text-xs">
        {/* Mobile Passage Select */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-[11px]">Passage:</span>
          <select
            value={currentSectionIndex}
            onChange={(e) => onSelectSection(Number(e.target.value))}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs"
          >
            {sections.map((_, idx) => (
              <option key={idx} value={idx}>
                Passage {idx + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Tab Toggle: [Passage | Questions] */}
        <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => onSelectMobileTab("passage")}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
              mobileActiveTab === "passage"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Passage
          </button>
          <button
            type="button"
            onClick={() => onSelectMobileTab("questions")}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
              mobileActiveTab === "questions"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Questions
          </button>
        </div>
      </div>
    </header>
  );
}
