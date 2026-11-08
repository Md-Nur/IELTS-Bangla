"use client";

import React, { useState, useEffect } from "react";
import { ExamResultResponseDTO } from "@/lib/services/examAttemptService";
import { ResultHeader } from "./ResultHeader";
import { ScoreSummaryCard } from "./ScoreSummaryCard";
import { DetailedReviewSection } from "./DetailedReviewSection";
import { ResultLoadingState, ResultErrorState } from "./ResultStates";

export function ResultPageContent({ attemptId }: { attemptId: string }) {
  const [result, setResult] = useState<ExamResultResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchResult = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/exam/${attemptId}/result`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409 && errorData.code === "ATTEMPT_STILL_IN_PROGRESS") {
          throw new Error("This examination attempt is still in progress. Please submit or finalize it first.");
        }
        if (res.status === 403) {
          throw new Error("You do not have permission to view results for this examination attempt.");
        }
        if (res.status === 404) {
          throw new Error("Examination attempt not found.");
        }
        throw new Error(errorData.error || `Failed to load results (${res.status})`);
      }

      const body = await res.json();
      if (body.success && body.data) {
        setResult(body.data);
      } else {
        throw new Error("Invalid response format received from server.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred while loading results.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch(`/api/exam/${attemptId}/result`);
        if (!isMounted) return;

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 409 && errorData.code === "ATTEMPT_STILL_IN_PROGRESS") {
            setErrorMessage("This examination attempt is still in progress. Please submit or finalize it first.");
          } else if (res.status === 403) {
            setErrorMessage("You do not have permission to view results for this examination attempt.");
          } else if (res.status === 404) {
            setErrorMessage("Examination attempt not found.");
          } else {
            setErrorMessage(errorData.error || `Failed to load results (${res.status})`);
          }
          setIsLoading(false);
          return;
        }

        const body = await res.json();
        if (!isMounted) return;

        if (body.success && body.data) {
          setResult(body.data);
        } else {
          setErrorMessage("Invalid response format received from server.");
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred while loading results.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (isLoading) {
    return <ResultLoadingState />;
  }

  if (errorMessage || !result) {
    return (
      <ResultErrorState
        errorMessage={errorMessage || "Unable to display result."}
        onRetry={fetchResult}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <ResultHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <ScoreSummaryCard result={result} />
        <DetailedReviewSection sections={result.sections} />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} IELTS Bangla. All Mock Test content and scoring calibrated for standard IELTS Academic preparation.</p>
        </div>
      </footer>
    </div>
  );
}
