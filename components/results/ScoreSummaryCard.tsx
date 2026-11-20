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
  const formattedTime = `${minutes} মিনিট ${seconds.toString().padStart(2, "0")} সেকেন্ড`;

  // Format completion date
  const completedDate = new Date(result.completionDate).toLocaleDateString("bn-BD", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-[#20395F]/15 shadow-2xs overflow-hidden mb-8">
      {/* Top Banner with Band Score & Status */}
      <div className="bg-[#20395F] text-white p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 text-[#8FD8C4] text-xs font-semibold tracking-wider uppercase border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FD8C4]" />
              {result.status === "TIMED_OUT" ? "সম্পন্ন (নির্ধারিত সময় সমাপ্ত)" : "সম্পন্ন ও মূল্যায়িত"}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {result.testTitle}
            </h1>
            <p className="text-white/80 text-xs flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>সমাপ্তির তারিখ: {completedDate}</span>
              <span>•</span>
              <span>ব্যয়িত সময়: {formattedTime} (সর্বোচ্চ ৬০ মিনিট)</span>
              <span>•</span>
              <span className="font-mono text-white/60 text-[11px]">ID: {result.attemptId.slice(0, 10)}...</span>
            </p>
          </div>

          {/* Primary Band Score Badge */}
          <div className="shrink-0 flex items-center bg-white/10 rounded-xl p-4 border border-white/15 shadow-inner">
            <div className="text-center px-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8FD8C4] mb-0.5">
                আনুমানিক Band Score
              </div>
              <div className="text-4xl font-extrabold tracking-tight text-white font-mono">
                {result.estimatedBand.toFixed(1)}
              </div>
              <div className="text-[10px] text-[#8FD8C4] font-medium mt-0.5">
                IELTS Academic Reading
              </div>
            </div>
          </div>
        </div>

        {/* Band Disclaimer Banner */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2 text-xs text-white/75">
          <svg className="w-4 h-4 shrink-0 text-[#8FD8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{result.bandDisclaimer}</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#20395F]/10 border-b border-[#20395F]/10 bg-[#F8F8F9]">
        <div className="p-4 text-center">
          <div className="text-2xl font-extrabold text-[#20395F] font-mono">
            {result.rawScore} <span className="text-sm font-normal text-slate-500">/ {result.totalQuestions}</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            র&apos; স্কোর (Raw Score)
          </div>
        </div>

        <div className="p-4 text-center">
          <div className="text-2xl font-extrabold text-[#087653] font-mono">
            {result.totalCorrect}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            সঠিক উত্তর
          </div>
        </div>

        <div className="p-4 text-center">
          <div className="text-2xl font-extrabold text-[#D93A45] font-mono">
            {result.totalIncorrect}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            ভুল / অনুত্তরিত
          </div>
        </div>

        <div className="p-4 text-center">
          <div className="text-2xl font-extrabold text-[#087653] font-mono">
            {accuracy}%
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            সার্বিক নির্ভুলতা
          </div>
        </div>
      </div>

      {/* Passage-by-Passage Performance Breakdown */}
      <div className="p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#20395F]/70 mb-4">
          প্যাসেজ অনুযায়ী দক্ষতা বিশ্লেষণ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.sections.map((sec) => {
            const secAccuracy = sec.accuracyPercentage;
            return (
              <div
                key={sec.sectionIndex}
                className="p-4 rounded-lg border border-[#20395F]/10 bg-white shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20395F]">
                    প্যাসেজ {sec.sectionIndex}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      secAccuracy >= 80
                        ? "bg-[#E7F5EF] text-[#087653]"
                        : secAccuracy >= 60
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {secAccuracy}%
                  </span>
                </div>

                <div className="text-xs text-[#20395F]/80 line-clamp-1 font-medium">
                  {sec.title}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-[#20395F]/65">
                    <span>সঠিক: {sec.correct} / {sec.totalQuestions}</span>
                    <span>প্রদত্ত: {sec.attempted}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        secAccuracy >= 80 ? "bg-[#087653]" : secAccuracy >= 60 ? "bg-blue-600" : "bg-amber-500"
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
