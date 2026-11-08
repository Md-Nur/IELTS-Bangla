"use client";

import { use, useEffect, useState, useCallback, Suspense } from "react";
import { ExamContentResponseDTO } from "@/lib/services/examAttemptService";
import { ExamInterface } from "@/components/exam/ExamInterface";
import { ExamLoadingState } from "@/components/exam/states/ExamLoadingState";
import { ExamErrorState } from "@/components/exam/states/ExamErrorState";
import { ExamExpiredState } from "@/components/exam/states/ExamExpiredState";

function ExamContent({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = use(params);

  const [examData, setExamData] = useState<ExamContentResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsExpired(false);
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(`/api/exam/${attemptId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await response.json().catch(() => null);

        if (!isMounted) return;

        if (!response.ok) {
          if (response.status === 403 && json?.code === "ATTEMPT_EXPIRED") {
            setIsExpired(true);
            return;
          }

          if (response.status === 401) {
            setErrorMessage("Authentication session expired. Please log in to access your examination.");
            return;
          }

          setErrorMessage(json?.error || `Unable to load exam (Error ${response.status})`);
          return;
        }

        if (json?.data) {
          setExamData(json.data);
        } else {
          setErrorMessage("Invalid exam content structure received from server.");
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Network error occurred while fetching examination content.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [attemptId, reloadKey]);

  if (isLoading) {
    return <ExamLoadingState />;
  }

  if (isExpired) {
    return <ExamExpiredState />;
  }

  if (errorMessage || !examData) {
    return (
      <ExamErrorState
        message={errorMessage || "Unable to display examination."}
        onRetry={handleRetry}
      />
    );
  }

  return <ExamInterface examData={examData} />;
}

export default function ExamPage(props: {
  params: Promise<{ attemptId: string }>;
}) {
  return (
    <Suspense fallback={<ExamLoadingState />}>
      <ExamContent params={props.params} />
    </Suspense>
  );
}
