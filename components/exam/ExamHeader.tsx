import React from "react";
import { CountdownTimerResult } from "@/hooks/useCountdownTimer";
import { SectionDTO } from "@/lib/services/examAttemptService";
import { SaveStatus } from "@/hooks/useExamAutosave";
import { Logo } from "@/components/common/Logo";

export interface ExamHeaderProps {
  testTitle: string;
  sections: SectionDTO[];
  currentSectionIndex: number;
  timer: CountdownTimerResult;
  saveStatus?: SaveStatus;
  mobileActiveTab: "passage" | "questions";
  answeredCount?: number;
  totalQuestions?: number;
  onSelectSection: (index: number) => void;
  onSelectMobileTab: (tab: "passage" | "questions") => void;
  onSubmitClick?: () => void;
  onExitClick: () => void;
}

export function ExamHeader({
  testTitle,
  sections,
  currentSectionIndex,
  timer,
  saveStatus = "idle",
  mobileActiveTab,
  answeredCount = 0,
  totalQuestions = 40,
  onSelectSection,
  onSelectMobileTab,
  onSubmitClick,
  onExitClick,
}: ExamHeaderProps) {
  return (
    <header className="shrink-0 bg-white border-b border-[#20395F]/15 text-[#20395F] select-none shadow-2xs z-30">
      {/* Top Bar */}
      <div className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Test Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 flex items-center">
            <Logo size="sm" showText={true} href="" />
          </div>

          <div className="h-4 w-px bg-[#20395F]/15 hidden md:block shrink-0" />

          <div className="hidden sm:flex items-center gap-2 truncate">
            <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653] border border-[#087653]/20">
              Academic Reading
            </span>
            <h1 className="text-xs sm:text-sm font-semibold text-[#20395F] truncate">
              {testTitle}
            </h1>
          </div>
        </div>

        {/* Center: Desktop Passage Switcher */}
        <nav
          aria-label="Passage Navigation"
          className="hidden lg:flex items-center gap-1.5 bg-[#F8F8F9] p-1 rounded-xl border border-[#20395F]/12 shadow-2xs"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#087653] text-white shadow-2xs"
                    : "text-[#20395F]/75 hover:text-[#20395F] hover:bg-white"
                }`}
              >
                Passage {idx + 1} ({qStart}–{qEnd})
              </button>
            );
          })}
        </nav>

        {/* Right: Autosave status, Progress, Countdown Timer & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Progress Indicator (desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F8F9] border border-[#20395F]/10 text-xs font-semibold text-[#20395F]">
            <span className="text-[#087653] font-bold">✓</span>
            <span>উত্তর: {answeredCount}/{totalQuestions}</span>
          </div>

          {/* Autosave Indicator */}
          <div className="flex items-center text-xs font-medium">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F8F9] text-[#20395F]/75 text-[11px] border border-[#20395F]/10">
                <svg className="animate-spin h-3 w-3 text-[#087653]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="hidden md:inline">সংরক্ষণ হচ্ছে...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E7F5EF] text-[#087653] text-[11px] border border-[#087653]/30 font-semibold">
                <svg className="w-3 h-3 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden md:inline">সংরক্ষিত</span>
              </span>
            )}
            {saveStatus === "failed" && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FDECEE] text-[#D93A45] text-[11px] border border-[#D93A45]/30 font-semibold">
                <svg className="w-3 h-3 text-[#D93A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>পুনরায় চেষ্টা</span>
              </span>
            )}
          </div>

          {/* Prominent High-Contrast Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm tracking-wider font-bold transition-all shadow-2xs ${
              timer.isUrgent
                ? "bg-[#FDECEE] text-[#D93A45] border border-[#D93A45]/40 animate-pulse"
                : timer.isWarning
                ? "bg-amber-50 text-amber-700 border border-amber-300"
                : "bg-[#F8F8F9] text-[#20395F] border border-[#20395F]/15"
            }`}
            aria-live="polite"
            aria-label={`অবশিষ্ট সময়: ${timer.formattedTime}`}
          >
            <svg
              className={`w-3.5 h-3.5 ${
                timer.isUrgent ? "text-[#D93A45]" : timer.isWarning ? "text-amber-600" : "text-[#087653]"
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

          {/* Primary Submit Button in Header */}
          {onSubmitClick && (
            <button
              type="button"
              onClick={onSubmitClick}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              title="পরীক্ষা চূড়ান্তভাবে জমা দিন"
            >
              <span className="hidden sm:inline">টেস্ট জমা দিন</span>
              <span className="sm:hidden">জমা দিন</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}

          {/* Exit / Leave button */}
          <button
            type="button"
            onClick={onExitClick}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#20395F]/70 hover:text-[#20395F] hover:bg-slate-100 transition-colors cursor-pointer border border-[#20395F]/15 shrink-0"
            title="পরীক্ষা থেকে সাময়িক প্রস্থান"
          >
            <span className="hidden sm:inline">বাহির হন</span>
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

      {/* Mobile Sub-Header: Passage Switcher & Tab Toggle [প্যাসেজ | প্রশ্নোত্তর] */}
      <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-[#F8F8F9] border-t border-[#20395F]/10 text-xs">
        {/* Mobile Passage Select */}
        <div className="flex items-center gap-1">
          <span className="text-[#20395F]/70 text-[11px] font-semibold">প্যাসেজ:</span>
          <select
            value={currentSectionIndex}
            onChange={(e) => onSelectSection(Number(e.target.value))}
            className="bg-white text-[#20395F] border border-[#20395F]/20 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer"
          >
            {sections.map((_, idx) => (
              <option key={idx} value={idx}>
                Passage {idx + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Tab Toggle: [Passage | Questions] */}
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-[#20395F]/15 shadow-2xs">
          <button
            type="button"
            onClick={() => onSelectMobileTab("passage")}
            className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
              mobileActiveTab === "passage"
                ? "bg-[#087653] text-white shadow-xs"
                : "text-[#20395F]/70 hover:text-[#20395F]"
            }`}
          >
            প্যাসেজ
          </button>
          <button
            type="button"
            onClick={() => onSelectMobileTab("questions")}
            className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
              mobileActiveTab === "questions"
                ? "bg-[#087653] text-white shadow-xs"
                : "text-[#20395F]/70 hover:text-[#20395F]"
            }`}
          >
            প্রশ্নোত্তর
          </button>
        </div>
      </div>
    </header>
  );
}
