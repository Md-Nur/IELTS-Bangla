import React from "react";
import { SectionDTO } from "@/lib/services/examAttemptService";
import { AnswersMap } from "@/hooks/useExamState";
import { TrueFalseNotGiven } from "./question-types/TrueFalseNotGiven";
import { YesNoNotGiven } from "./question-types/YesNoNotGiven";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { TextCompletion } from "./question-types/TextCompletion";
import { MatchingHeadings } from "./question-types/MatchingHeadings";
import { SummaryCompletion } from "./question-types/SummaryCompletion";

export interface ExamQuestionsPaneProps {
  section: SectionDTO;
  sectionIndex: number;
  answers: AnswersMap;
  currentQuestionNumber: number;
  onSetAnswer: (questionId: string, answerText: string | null) => void;
  onToggleFlag: (questionId: string) => void;
  onSelectQuestion: (questionNumber: number) => void;
}

export function ExamQuestionsPane({
  section,
  sectionIndex,
  answers,
  currentQuestionNumber,
  onSetAnswer,
  onToggleFlag,
  onSelectQuestion,
}: ExamQuestionsPaneProps) {
  return (
    <div
      aria-label={`Questions for Passage ${sectionIndex + 1}`}
      className="h-full overflow-y-auto px-4 py-6 sm:px-6 md:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
    >
      <div className="max-w-2xl mx-auto space-y-8 pb-16">
        {section.questionGroups.map((group) => {
          // Parse contextOptions safely
          const contextOpts = group.contextOptions as Record<string, unknown> | null;
          const headings = (contextOpts?.headings as Record<string, string>) || null;
          const words = (contextOpts?.words as Record<string, string>) || null;
          const summaryTitle = (contextOpts?.title as string) || null;

          return (
            <section
              key={group.id}
              className="space-y-4"
              aria-labelledby={`group-title-${group.id}`}
            >
              {/* Group Instruction Banner */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Questions {group.questions[0]?.questionNumber}–{group.questions[group.questions.length - 1]?.questionNumber}
                  </span>
                  {group.wordLimit && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      NO MORE THAN {group.wordLimit === 1 ? "ONE WORD" : `${group.wordLimit} WORDS`}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {group.instruction}
                </p>

                {/* Reference Box: Matching Headings list */}
                {headings && (
                  <div className="mt-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                      List of Headings
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.keys(headings).map((key) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300 w-6 shrink-0 text-right">
                            {key}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">
                            {headings[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Box: Summary Completion Word List */}
                {words && (
                  <div className="mt-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    {summaryTitle && (
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm text-center">
                        {summaryTitle}
                      </div>
                    )}
                    <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      List of words, A–H:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {Object.keys(words).map((letter) => (
                        <div
                          key={letter}
                          className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center gap-1.5"
                        >
                          <span className="font-bold text-blue-700 dark:text-blue-400">
                            {letter}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
                            {words[letter]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions in this group */}
              <div className="space-y-4">
                {group.questions.map((q) => {
                  const ans = answers[q.id];
                  const answerVal = ans?.answerText ?? null;
                  const isFlagged = ans?.isFlaggedForReview ?? false;
                  const isCurrent = q.questionNumber === currentQuestionNumber;

                  return (
                    <article
                      key={q.id}
                      id={`question-card-${q.questionNumber}`}
                      onClick={() => onSelectQuestion(q.questionNumber)}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-white dark:bg-slate-900 border-blue-500 shadow-sm ring-1 ring-blue-500/30"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Question Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {q.questionNumber}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Question {q.questionNumber}
                          </span>
                        </div>

                        {/* Flag for Review Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFlag(q.id);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer select-none ${
                            isFlagged
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Mark question for review"
                          aria-label={`Mark Question ${q.questionNumber} for review`}
                          aria-pressed={isFlagged}
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${
                              isFlagged ? "fill-current text-amber-500" : "text-slate-400"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                          </svg>
                          <span>{isFlagged ? "Flagged" : "Review"}</span>
                        </button>
                      </div>

                      {/* Prompt Text */}
                      <p className="mt-2.5 text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                        {q.prompt}
                      </p>

                      {/* Question Inputs by Type */}
                      {group.questionType === "TRUE_FALSE_NOT_GIVEN" && (
                        <TrueFalseNotGiven
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}

                      {group.questionType === "YES_NO_NOT_GIVEN" && (
                        <YesNoNotGiven
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}

                      {group.questionType === "MULTIPLE_CHOICE" && (
                        <MultipleChoice
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          options={q.options}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}

                      {(group.questionType === "NOTE_COMPLETION" ||
                        group.questionType === "SENTENCE_COMPLETION" ||
                        group.questionType === "SHORT_ANSWER") && (
                        <TextCompletion
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          wordLimit={group.wordLimit}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}

                      {group.questionType === "MATCHING_HEADINGS" && headings && (
                        <MatchingHeadings
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          headingsMap={headings}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}

                      {group.questionType === "SUMMARY_COMPLETION" && words && (
                        <SummaryCompletion
                          questionId={q.id}
                          questionNumber={q.questionNumber}
                          wordListMap={words}
                          value={answerVal}
                          onChange={(val) => onSetAnswer(q.id, val)}
                        />
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
