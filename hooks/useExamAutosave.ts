import { useState, useRef, useCallback, useEffect } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "failed";

export interface AutosaveItem {
  questionId: string;
  answerText: string | null;
  isFlaggedForReview: boolean;
  version: number;
  retryCount: number;
}

export interface UseExamAutosaveOptions {
  attemptId: string;
  initialAnswers?: Array<{
    questionId: string;
    answerText: string | null;
    isFlaggedForReview: boolean;
  }>;
}

export interface UseExamAutosaveResult {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
  queueAnswerSave: (
    questionId: string,
    answerText: string | null,
    isFlaggedForReview: boolean,
    immediate?: boolean
  ) => void;
  flushPendingSaves: () => Promise<void>;
}

export function useExamAutosave({
  attemptId,
  initialAnswers,
}: UseExamAutosaveOptions): UseExamAutosaveResult {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Map of questionId -> last committed (or saved) state to prevent unnecessary requests
  const savedStateMap = useRef<Map<string, { answerText: string | null; isFlagged: boolean }>>(
    new Map()
  );

  // Monotonic version counter per questionId to prevent stale responses
  const versionMap = useRef<Map<string, number>>(new Map());

  // Active timers per questionId for debouncing
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Queue of items needing saving
  const pendingQueue = useRef<Map<string, AutosaveItem>>(new Map());

  // In-flight saving tracker
  const inFlightCount = useRef<number>(0);

  // Self-referential ref for safe recursive retries without hoisting violation
  const executeSaveRef = useRef<((item: AutosaveItem) => Promise<void>) | null>(null);

  // Initialize saved state from initialAnswers
  useEffect(() => {
    if (initialAnswers && Array.isArray(initialAnswers)) {
      initialAnswers.forEach((ans) => {
        savedStateMap.current.set(ans.questionId, {
          answerText: ans.answerText,
          isFlagged: ans.isFlaggedForReview,
        });
      });
    }
  }, [initialAnswers]);

  // Execute a single save request with retry capability
  const executeSave = useCallback(
    async (item: AutosaveItem) => {
      inFlightCount.current += 1;
      setSaveStatus("saving");

      try {
        const response = await fetch(`/api/exam/${attemptId}/answers`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: item.questionId,
            answerText: item.answerText,
            isFlaggedForReview: item.isFlaggedForReview,
          }),
        });

        // Check if a newer version was queued while this request was in flight (stale response prevention)
        const currentVersion = versionMap.current.get(item.questionId) || 0;
        if (item.version < currentVersion) {
          // A newer change superseded this save; ignore stale response
          return;
        }

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const json = await response.json().catch(() => null);

        // Update last saved state map
        savedStateMap.current.set(item.questionId, {
          answerText: item.answerText,
          isFlagged: item.isFlaggedForReview,
        });

        // Remove from pending queue
        pendingQueue.current.delete(item.questionId);
        setPendingCount(pendingQueue.current.size);

        const serverSavedAt = json?.data?.lastSavedAt ? new Date(json.data.lastSavedAt) : new Date();
        setLastSavedAt(serverSavedAt);

        if (pendingQueue.current.size === 0 && inFlightCount.current <= 1) {
          setSaveStatus("saved");
        }
      } catch {
        // Retry logic: up to 3 retries with backoff
        if (item.retryCount < 3) {
          const nextRetry = item.retryCount + 1;
          const delay = Math.pow(2, nextRetry) * 500; // 1000ms, 2000ms, 4000ms

          setTimeout(() => {
            const currentVersion = versionMap.current.get(item.questionId) || 0;
            if (item.version === currentVersion) {
              executeSaveRef.current?.({ ...item, retryCount: nextRetry });
            }
          }, delay);
        } else {
          setSaveStatus("failed");
        }
      } finally {
        inFlightCount.current = Math.max(0, inFlightCount.current - 1);
      }
    },
    [attemptId]
  );

  useEffect(() => {
    executeSaveRef.current = executeSave;
  }, [executeSave]);

  // Queue an answer save with debouncing
  const queueAnswerSave = useCallback(
    (
      questionId: string,
      answerText: string | null,
      isFlaggedForReview: boolean,
      immediate: boolean = false
    ) => {
      // 1. Avoid unnecessary requests: compare against last saved state
      const lastSaved = savedStateMap.current.get(questionId);
      if (
        lastSaved &&
        lastSaved.answerText === (answerText ?? null) &&
        lastSaved.isFlagged === isFlaggedForReview
      ) {
        // No meaningful change; skip network request
        return;
      }

      // 2. Clear any existing debounce timer for this question
      const existingTimer = debounceTimers.current.get(questionId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // 3. Increment version for stale response prevention
      const newVersion = (versionMap.current.get(questionId) || 0) + 1;
      versionMap.current.set(questionId, newVersion);

      const item: AutosaveItem = {
        questionId,
        answerText: answerText ?? null,
        isFlaggedForReview,
        version: newVersion,
        retryCount: 0,
      };

      pendingQueue.current.set(questionId, item);
      setPendingCount(pendingQueue.current.size);
      setSaveStatus("saving");

      const delay = immediate ? 50 : 600; // 600ms debounce for typing, 50ms for discrete clicks

      const timer = setTimeout(() => {
        executeSave(item);
        debounceTimers.current.delete(questionId);
      }, delay);

      debounceTimers.current.set(questionId, timer);
    },
    [executeSave]
  );

  // Flush all pending debounced saves immediately (e.g. before exit)
  const flushPendingSaves = useCallback(async () => {
    debounceTimers.current.forEach((timer) => clearTimeout(timer));
    debounceTimers.current.clear();

    const pendingItems = Array.from(pendingQueue.current.values());
    if (pendingItems.length === 0) return;

    await Promise.all(pendingItems.map((item) => executeSave(item)));
  }, [executeSave]);

  // Network online listener: automatically retry pending saves when connection returns
  useEffect(() => {
    const handleOnline = () => {
      const itemsToRetry = Array.from(pendingQueue.current.values());
      if (itemsToRetry.length > 0) {
        itemsToRetry.forEach((item) => executeSave({ ...item, retryCount: 0 }));
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [executeSave]);

  return {
    saveStatus,
    lastSavedAt,
    hasUnsavedChanges: pendingCount > 0 || saveStatus === "saving" || saveStatus === "failed",
    queueAnswerSave,
    flushPendingSaves,
  };
}
