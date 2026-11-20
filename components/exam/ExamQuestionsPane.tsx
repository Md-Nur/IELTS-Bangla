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
      className="h-full overflow-y-auto px-4 py-6 sm:px-6 md:px-8 bg-[#F8F8F9] text-[#20395F]"
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
              <div className="p-5 rounded-2xl bg-white border border-[#20395F]/15 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#087653] bg-[#E7F5EF] px-2.5 py-0.5 rounded-full border border-[#087653]/20">
                    Questions {group.questions[0]?.questionNumber}–{group.questions[group.questions.length - 1]?.questionNumber}
                  </span>
                  {group.wordLimit && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E7F5EF] text-[#087653] border border-[#087653]/30">
                      NO MORE THAN {group.wordLimit === 1 ? "ONE WORD" : `${group.wordLimit} WORDS`}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-[#20395F] whitespace-pre-line leading-relaxed">
                  {group.instruction}
                </p>

                {/* Reference Box: Matching Headings list */}
                {headings && (
                  <div className="mt-3 p-4 rounded-xl bg-[#F8F8F9] border border-[#20395F]/15 text-xs space-y-2">
                    <div className="font-bold text-[#20395F] uppercase tracking-wider text-[11px] border-b border-[#20395F]/10 pb-1.5">
                      List of Headings
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {Object.keys(headings).map((key) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-bold text-[#087653] w-6 shrink-0 text-right">
                            {key}
                          </span>
                          <span className="text-[#20395F]/85">
                            {headings[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Box: Summary Completion Word List */}
                {words && (
                  <div className="mt-3 p-4 rounded-xl bg-[#F8F8F9] border border-[#20395F]/15 text-xs space-y-2">
                    {summaryTitle && (
                      <div className="font-bold text-[#20395F] text-sm text-center">
                        {summaryTitle}
                      </div>
                    )}
                    <div className="font-bold text-[#20395F] uppercase tracking-wider text-[11px] border-b border-[#20395F]/10 pb-1.5">
                      List of words, A–H:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5">
                      {Object.keys(words).map((letter) => (
                        <div
                          key={letter}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#20395F]/15 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="font-bold text-[#087653]">
                            {letter}
                          </span>
                          <span className="text-[#20395F]/85 font-medium truncate">
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
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-white border-[#087653] shadow-md ring-1 ring-[#087653]/30"
                          : "bg-white border-[#20395F]/12 hover:border-[#20395F]/25 shadow-2xs"
                      }`}
                    >
                      {/* Question Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                              isCurrent
                                ? "bg-[#087653] text-white shadow-xs"
                                : "bg-[#E7F5EF] text-[#20395F]"
                            }`}
                          >
                            {q.questionNumber}
                          </span>
                          <span className="text-xs text-[#20395F]/60 font-semibold">
                            প্রশ্ন {q.questionNumber}
                          </span>
                        </div>

                        {/* Flag for Review Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFlag(q.id);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                            isFlagged
                              ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs"
                              : "text-[#20395F]/50 hover:text-[#20395F] hover:bg-slate-100 border border-transparent"
                          }`}
                          title="Mark question for review"
                          aria-label={`Mark Question ${q.questionNumber} for review`}
                          aria-pressed={isFlagged}
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${
                              isFlagged ? "fill-current text-amber-500" : "text-[#20395F]/40"
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
                          <span>{isFlagged ? "চিহ্নিত" : "ফ্ল্যাগ"}</span>
                        </button>
                      </div>

                      {/* Prompt Text */}
                      <p className="mt-3 text-sm sm:text-[15px] font-medium text-[#20395F] leading-relaxed">
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
