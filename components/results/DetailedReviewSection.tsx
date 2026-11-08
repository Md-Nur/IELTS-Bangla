"use client";

import React, { useState } from "react";
import { SectionReviewDTO, QuestionReviewDTO } from "@/lib/services/examAttemptService";

export interface DetailedReviewSectionProps {
  sections: SectionReviewDTO[];
}

type StatusFilter = "all" | "incorrect" | "correct";

export function DetailedReviewSection({ sections }: DetailedReviewSectionProps) {
  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number>(0); // 0 = All Passages
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedPassages, setExpandedPassages] = useState<Record<number, boolean>>({});

  const togglePassageExpand = (index: number) => {
    setExpandedPassages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Filter sections
  const filteredSections = sections.filter((sec) => {
    if (selectedPassageIndex === 0) return true;
    return sec.sectionIndex === selectedPassageIndex;
  });

  // Calculate counts for filters
  const allQuestions = sections.flatMap((s) => s.questions);
  const totalCount = allQuestions.length;
  const correctCount = allQuestions.filter((q) => q.isCorrect).length;
  const incorrectCount = totalCount - correctCount;

  return (
    <div className="space-y-6">
      {/* Controls Bar: Passage Navigation & Status Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Passage Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedPassageIndex(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedPassageIndex === 0
                ? "bg-slate-900 text-white dark:bg-blue-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Passages (1–40)
          </button>
          {sections.map((sec) => (
            <button
              key={sec.sectionIndex}
              type="button"
              onClick={() => setSelectedPassageIndex(sec.sectionIndex)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedPassageIndex === sec.sectionIndex
                  ? "bg-slate-900 text-white dark:bg-blue-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Passage {sec.sectionIndex} ({sec.questions[0]?.questionNumber}–{sec.questions[sec.questions.length - 1]?.questionNumber})
            </button>
          ))}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("incorrect")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === "incorrect"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Incorrect ({incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("correct")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === "correct"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Correct ({correctCount})
          </button>
        </div>
      </div>

      {/* Sections and Questions */}
      <div className="space-y-8">
        {filteredSections.map((sec) => {
          const visibleQuestions = sec.questions.filter((q) => {
            if (statusFilter === "correct") return q.isCorrect;
            if (statusFilter === "incorrect") return !q.isCorrect;
            return true;
          });

          if (visibleQuestions.length === 0) return null;

          const isExpanded = Boolean(expandedPassages[sec.sectionIndex]);

          return (
            <div
              key={sec.sectionIndex}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              {/* Passage Section Header */}
              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Reading Passage {sec.sectionIndex}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {sec.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    Accuracy: {sec.correct} / {sec.totalQuestions} ({sec.accuracyPercentage}%)
                  </span>

                  <button
                    type="button"
                    onClick={() => togglePassageExpand(sec.sectionIndex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{isExpanded ? "Hide Reading Passage" : "View Reading Passage"}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Passage Reading View */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/70 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-sm max-h-96 overflow-y-auto space-y-4">
                  {sec.passageText.split(/\n\s*\n/).map((para, pIdx) => (
                    <p key={pIdx} className="indent-4">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              )}

              {/* Questions List */}
              <div className="divide-y divide-slate-200 dark:divide-slate-800 p-4 sm:p-6 space-y-6">
                {visibleQuestions.map((q) => (
                  <QuestionReviewCard key={q.questionNumber} question={q} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionReviewCard({ question }: { question: QuestionReviewDTO }) {
  const isUnanswered = question.studentAnswer === null || question.studentAnswer.trim().length === 0;
  const alternatives = question.acceptedAnswers.filter(
    (a) => a.trim().toLowerCase() !== question.primaryAcceptedAnswer.trim().toLowerCase()
  );

  return (
    <div className="pt-6 first:pt-0 space-y-3.5">
      {/* Header: Question Number, Type tag, and Status pill */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-blue-600 dark:text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
            {question.questionNumber}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {question.questionType.replace(/_/g, " ")}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {question.isCorrect ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800/80">
              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Correct (+1)
            </span>
          ) : isUnanswered ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold border border-slate-300 dark:border-slate-700">
              <span className="w-2 h-0.5 bg-slate-500" />
              Unanswered (0)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800/80">
              <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Incorrect (0)
            </span>
          )}
        </div>
      </div>

      {/* Prompt */}
      <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-snug">
        {question.prompt}
      </div>

      {/* Answer Comparison Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Your Answer */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            question.isCorrect
              ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
              : isUnanswered
              ? "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              : "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Your Submitted Answer
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-sm sm:text-base ${
                question.isCorrect
                  ? "text-emerald-900 dark:text-emerald-200"
                  : isUnanswered
                  ? "text-slate-400 dark:text-slate-500 italic"
                  : "text-rose-900 dark:text-rose-200 line-through"
              }`}
            >
              {isUnanswered ? "(No answer submitted)" : question.studentAnswer}
            </span>

            {question.wordLimitExceeded && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                Word limit exceeded
              </span>
            )}
          </div>
        </div>

        {/* Correct Answer */}
        <div className="p-3.5 rounded-xl border bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
            Correct Answer
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100">
              {question.primaryAcceptedAnswer}
            </span>
            {alternatives.length > 0 && (
              <div className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-1">
                <span className="font-medium">Also accepted:</span> {alternatives.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation & Passage Reference */}
      {question.explanation && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Passage Reference & Explanation:</span>
          </div>
          <p className="leading-relaxed pl-5 font-medium text-slate-600 dark:text-slate-300">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
