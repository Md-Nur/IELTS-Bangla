import { useState, useMemo, useCallback } from "react";
import { ExamContentResponseDTO, QuestionDTO } from "@/lib/services/examAttemptService";

export interface AnswerState {
  answerText: string | null;
  isFlaggedForReview: boolean;
}

export type AnswersMap = Record<string, AnswerState>;

export interface QuestionInfo {
  question: QuestionDTO;
  questionNumber: number;
  questionId: string;
  sectionIndex: number;
  groupId: string;
}

export interface QuestionStatusItem {
  questionNumber: number;
  questionId: string;
  sectionIndex: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isCurrent: boolean;
}

export interface UseExamStateOptions {
  examData: ExamContentResponseDTO;
  onAnswerChange?: (questionId: string, answerText: string | null, isFlagged: boolean) => void;
}

export function useExamState({ examData, onAnswerChange }: UseExamStateOptions) {
  // 1. Build flat list of all questions with section indices
  const allQuestionsMap = useMemo(() => {
    const list: QuestionInfo[] = [];
    examData.sections.forEach((sec, secIdx) => {
      sec.questionGroups.forEach((grp) => {
        grp.questions.forEach((q) => {
          list.push({
            question: q,
            questionNumber: q.questionNumber,
            questionId: q.id,
            sectionIndex: secIdx,
            groupId: grp.id,
          });
        });
      });
    });
    // Sort by questionNumber asc
    list.sort((a, b) => a.questionNumber - b.questionNumber);
    return list;
  }, [examData]);

  // 2. Initialize answers state from savedAnswers
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    // Seed all questions with empty answers
    allQuestionsMap.forEach((qInfo) => {
      initial[qInfo.questionId] = {
        answerText: null,
        isFlaggedForReview: false,
      };
    });

    // Populate with saved answers from server
    if (examData.savedAnswers && Array.isArray(examData.savedAnswers)) {
      examData.savedAnswers.forEach((saved) => {
        if (initial[saved.questionId]) {
          initial[saved.questionId] = {
            answerText: saved.answerText,
            isFlaggedForReview: saved.isFlaggedForReview,
          };
        }
      });
    }

    return initial;
  });

  // 3. Navigation state
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"passage" | "questions">("questions");

  // 4. Update answer
  const setAnswer = useCallback(
    (questionId: string, answerText: string | null) => {
      setAnswers((prev) => {
        const current = prev[questionId] || { answerText: null, isFlaggedForReview: false };
        const updated = {
          ...current,
          answerText: answerText && answerText.trim() !== "" ? answerText : null,
        };
        onAnswerChange?.(questionId, updated.answerText, updated.isFlaggedForReview);
        return {
          ...prev,
          [questionId]: updated,
        };
      });
    },
    [onAnswerChange]
  );

  // 5. Toggle flag
  const toggleFlag = useCallback(
    (questionId: string) => {
      setAnswers((prev) => {
        const current = prev[questionId] || { answerText: null, isFlaggedForReview: false };
        const updated = {
          ...current,
          isFlaggedForReview: !current.isFlaggedForReview,
        };
        onAnswerChange?.(questionId, updated.answerText, updated.isFlaggedForReview);
        return {
          ...prev,
          [questionId]: updated,
        };
      });
    },
    [onAnswerChange]
  );

  // 6. Navigation functions
  const goToQuestion = useCallback(
    (qNum: number) => {
      const target = allQuestionsMap.find((item) => item.questionNumber === qNum);
      if (!target) return;

      setCurrentSectionIndex(target.sectionIndex);
      setCurrentQuestionNumber(target.questionNumber);

      // On mobile, switch to questions tab when jumping to a question
      setMobileActiveTab("questions");

      // Smooth scroll to the question card
      if (typeof document !== "undefined") {
        setTimeout(() => {
          const el = document.getElementById(`question-card-${target.questionNumber}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
    },
    [allQuestionsMap]
  );

  const goToSection = useCallback(
    (secIdx: number) => {
      if (secIdx < 0 || secIdx >= examData.sections.length) return;
      setCurrentSectionIndex(secIdx);
      // Find the first question in that section
      const firstQ = allQuestionsMap.find((item) => item.sectionIndex === secIdx);
      if (firstQ) {
        setCurrentQuestionNumber(firstQ.questionNumber);
      }
    },
    [examData.sections.length, allQuestionsMap]
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionNumber < allQuestionsMap.length) {
      goToQuestion(currentQuestionNumber + 1);
    }
  }, [currentQuestionNumber, allQuestionsMap.length, goToQuestion]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionNumber > 1) {
      goToQuestion(currentQuestionNumber - 1);
    }
  }, [currentQuestionNumber, goToQuestion]);

  // 7. Computed stats and palette items
  const questionStatusList: QuestionStatusItem[] = useMemo(() => {
    return allQuestionsMap.map((info) => {
      const ans = answers[info.questionId];
      const hasAnswer = Boolean(ans && ans.answerText && ans.answerText.trim() !== "");
      const isFlagged = Boolean(ans && ans.isFlaggedForReview);
      return {
        questionNumber: info.questionNumber,
        questionId: info.questionId,
        sectionIndex: info.sectionIndex,
        isAnswered: hasAnswer,
        isFlagged,
        isCurrent: info.questionNumber === currentQuestionNumber,
      };
    });
  }, [allQuestionsMap, answers, currentQuestionNumber]);

  const stats = useMemo(() => {
    const total = allQuestionsMap.length;
    let answered = 0;
    let flagged = 0;

    questionStatusList.forEach((item) => {
      if (item.isAnswered) answered++;
      if (item.isFlagged) flagged++;
    });

    return {
      totalQuestions: total,
      answeredCount: answered,
      unansweredCount: total - answered,
      flaggedCount: flagged,
    };
  }, [allQuestionsMap.length, questionStatusList]);

  const currentQuestionInfo = useMemo(() => {
    return allQuestionsMap.find((item) => item.questionNumber === currentQuestionNumber);
  }, [allQuestionsMap, currentQuestionNumber]);

  return {
    answers,
    currentSectionIndex,
    currentQuestionNumber,
    currentQuestionInfo,
    allQuestionsMap,
    questionStatusList,
    stats,
    isReviewModalOpen,
    isExitModalOpen,
    mobileActiveTab,
    setMobileActiveTab,
    setIsReviewModalOpen,
    setIsExitModalOpen,
    setAnswer,
    toggleFlag,
    goToQuestion,
    goToSection,
    nextQuestion,
    prevQuestion,
  };
}
