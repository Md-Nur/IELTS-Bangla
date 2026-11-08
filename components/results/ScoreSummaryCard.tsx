import React from "react";
import { ExamResultResponseDTO } from "@/lib/services/examAttemptService";

export interface ScoreSummaryCardProps {
  result: ExamResultResponseDTO;
}

export function ScoreSummaryCard({ result }: ScoreSummaryCardProps) {
  const accuracy = Math.round((result.totalCorrect / result.totalQuestions) * 100);

  // Format time taken
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const formattedTime = `${minutes}m ${seconds.toString().padStart(2, "0")}s`;

  // Format completion date
  const completedDate = new Date(result.completionDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
      {/* Top Banner with Band Score & Status */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wider uppercase border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {result.status === "TIMED_OUT" ? "Completed (Timed Out)" : "Completed & Finalized"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {result.testTitle}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Completed on: {completedDate}</span>
              <span>•</span>
              <span>Duration: {formattedTime} / 60m</span>
              <span>•</span>
              <span className="font-mono text-slate-400 text-xs">ID: {result.attemptId.slice(0, 10)}...</span>
            </p>
          </div>

          {/* Primary Band Score Badge */}
          <div className="shrink-0 flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-inner">
            <div className="text-center px-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
                Estimated Band
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {result.estimatedBand.toFixed(1)}
              </div>
              <div className="text-[11px] text-blue-200/90 font-medium mt-1">
                IELTS Academic Reading
              </div>
            </div>
          </div>
        </div>

        {/* Band Disclaimer Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-blue-200/80">
          <svg className="w-4 h-4 shrink-0 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{result.bandDisclaimer}</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            {result.rawScore} <span className="text-base font-normal text-slate-500">/ {result.totalQuestions}</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            Raw Score
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {result.totalCorrect}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            Correct Answers
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {result.totalIncorrect}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            Incorrect / Unanswered
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {accuracy}%
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            Overall Accuracy
          </div>
        </div>
      </div>

      {/* Passage-by-Passage Performance Breakdown */}
      <div className="p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Passage-by-Passage Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.sections.map((sec) => {
            const secAccuracy = sec.accuracyPercentage;
            return (
              <div
                key={sec.sectionIndex}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    Passage {sec.sectionIndex}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      secAccuracy >= 80
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : secAccuracy >= 60
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    {secAccuracy}%
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
                  {sec.title}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Score: {sec.correct} / {sec.totalQuestions}</span>
                    <span>Attempted: {sec.attempted}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        secAccuracy >= 80 ? "bg-emerald-500" : secAccuracy >= 60 ? "bg-blue-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${secAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
