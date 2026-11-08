"use client";

import React, { useEffect, useCallback } from "react";
import { ExamContentResponseDTO } from "@/lib/services/examAttemptService";
import { useExamState } from "@/hooks/useExamState";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useExamAutosave } from "@/hooks/useExamAutosave";
import { ExamHeader } from "./ExamHeader";
import { ExamPassagePane } from "./ExamPassagePane";
import { ExamQuestionsPane } from "./ExamQuestionsPane";
import { ExamBottomBar } from "./ExamBottomBar";
import { ExamReviewModal } from "./ExamReviewModal";
import { ExamExitModal } from "./ExamExitModal";
import { ExamExpiredState } from "./states/ExamExpiredState";

export interface ExamInterfaceProps {
  examData: ExamContentResponseDTO;
}

export function ExamInterface({ examData }: ExamInterfaceProps) {
  // 1. Authoritative Countdown Timer
  const timer = useCountdownTimer({
    expiresAt: examData.attempt.expiresAt,
    initialRemainingSeconds: examData.attempt.remainingSeconds,
  });

  // 2. Reliable Autosave Hook
  const autosave = useExamAutosave({
    attemptId: examData.attempt.id,
    initialAnswers: examData.savedAnswers,
  });

  // Handle answer change with autosave debouncing
  const handleAnswerChange = useCallback(
    (questionId: string, answerText: string | null, isFlagged: boolean) => {
      // Find question type to determine if debounce or immediate
      const questionInfo = examData.sections
        .flatMap((s) => s.questionGroups)
        .find((g) => g.questions.some((q) => q.id === questionId));

      const isTextCompletion =
        questionInfo?.questionType === "NOTE_COMPLETION" ||
        questionInfo?.questionType === "SENTENCE_COMPLETION" ||
        questionInfo?.questionType === "SHORT_ANSWER";

      // Immediate for discrete choices (radio, select, flag), debounced 600ms for text typing
      const immediate = !isTextCompletion;
      autosave.queueAnswerSave(questionId, answerText, isFlagged, immediate);
    },
    [autosave, examData.sections]
  );

  // 3. Exam State Manager
  const exam = useExamState({
    examData,
    onAnswerChange: handleAnswerChange,
  });

  // 4. Prevent accidental tab close or page navigation; warn if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autosave.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes in your examination. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [autosave.hasUnsavedChanges]);

  // 5. Keyboard Navigation (ArrowLeft / ArrowRight for Prev / Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if (e.key === "ArrowLeft") {
        exam.prevQuestion();
      } else if (e.key === "ArrowRight") {
        exam.nextQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exam]);

  // If timer has expired according to server deadline, display expired state
  if (timer.isExpired) {
    return <ExamExpiredState />;
  }

  const currentSection = examData.sections[exam.currentSectionIndex] || examData.sections[0];
  const currentFlag = Boolean(
    exam.currentQuestionInfo &&
      exam.answers[exam.currentQuestionInfo.questionId]?.isFlaggedForReview
  );

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <ExamHeader
        testTitle={examData.attempt.testTitle}
        sections={examData.sections}
        currentSectionIndex={exam.currentSectionIndex}
        timer={timer}
        saveStatus={autosave.saveStatus}
        mobileActiveTab={exam.mobileActiveTab}
        onSelectSection={exam.goToSection}
        onSelectMobileTab={exam.setMobileActiveTab}
        onExitClick={() => exam.setIsExitModalOpen(true)}
      />

      {/* Main Examination Split Content */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Pane: Passage Text */}
        <div
          className={`w-full lg:w-1/2 h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 transition-all ${
            exam.mobileActiveTab === "passage" ? "block" : "hidden lg:block"
          }`}
        >
          <ExamPassagePane
            section={currentSection}
            sectionIndex={exam.currentSectionIndex}
          />
        </div>

        {/* Right Pane: Question Workspace */}
        <div
          className={`w-full lg:w-1/2 h-full transition-all ${
            exam.mobileActiveTab === "questions" ? "block" : "hidden lg:block"
          }`}
        >
          <ExamQuestionsPane
            section={currentSection}
            sectionIndex={exam.currentSectionIndex}
            answers={exam.answers}
            currentQuestionNumber={exam.currentQuestionNumber}
            onSetAnswer={exam.setAnswer}
            onToggleFlag={exam.toggleFlag}
            onSelectQuestion={exam.goToQuestion}
          />
        </div>
      </main>

      {/* Bottom Action & Palette Bar */}
      <ExamBottomBar
        currentQuestionNumber={exam.currentQuestionNumber}
        currentQuestionId={exam.currentQuestionInfo?.questionId}
        isCurrentFlagged={currentFlag}
        questionStatusList={exam.questionStatusList}
        totalQuestions={exam.stats.totalQuestions}
        onToggleFlag={exam.toggleFlag}
        onPrev={exam.prevQuestion}
        onNext={exam.nextQuestion}
        onSelectQuestion={exam.goToQuestion}
        onOpenReviewModal={() => exam.setIsReviewModalOpen(true)}
      />

      {/* Modals */}
      <ExamReviewModal
        isOpen={exam.isReviewModalOpen}
        onClose={() => exam.setIsReviewModalOpen(false)}
        questionStatusList={exam.questionStatusList}
        onSelectQuestion={exam.goToQuestion}
      />

      <ExamExitModal
        isOpen={exam.isExitModalOpen}
        onClose={() => exam.setIsExitModalOpen(false)}
      />
    </div>
  );
}
