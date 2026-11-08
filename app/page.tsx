"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartExam = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Try to start exam directly with current session
      const startRes = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testSlug: "academic-reading-mock-01" }),
      });

      if (startRes.ok) {
        const startJson = await startRes.json();
        router.push(`/exam/${startJson.data.attemptId}`);
        return;
      }

      // If unauthenticated, authenticate as demo student
      if (startRes.status === 401) {
        const demoEmail = "student@ieltsbangla.com";
        const demoPass = "StudentPass123!";

        // Attempt login
        let loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: demoEmail, password: demoPass }),
        });

        // If demo user doesn't exist yet, register demo student
        if (!loginRes.ok) {
          const regRes = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Demo Student",
              email: demoEmail,
              password: demoPass,
            }),
          });

          if (!regRes.ok && regRes.status !== 409) {
            setError("Unable to initialize demo student account.");
            return;
          }

          loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: demoEmail, password: demoPass }),
          });
        }

        // Now retry starting attempt
        const retryStart = await fetch("/api/exam/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testSlug: "academic-reading-mock-01" }),
        });

        if (retryStart.ok) {
          const retryJson = await retryStart.json();
          router.push(`/exam/${retryJson.data.attemptId}`);
          return;
        }

        const errJson = await retryStart.json().catch(() => null);
        setError(errJson?.error || "Failed to initialize examination session.");
        return;
      }

      const errData = await startRes.json().catch(() => null);
      setError(errData?.error || "Failed to start examination.");
    } catch {
      setError("Network connection error. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-red-600 text-white font-extrabold text-sm tracking-wider">
            IELTS
          </span>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Bangla
          </span>
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Official CD-IELTS Mock Test Platform
        </div>
      </header>

      {/* Hero / Test Catalog */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8 flex flex-col justify-center">
        <div className="space-y-3 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            Phase 1 · Reading MVP
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            IELTS Academic Mock Examination
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Experience the real computer-delivered IELTS (CD-IELTS) testing environment. Timed 60-minute test with 40 questions, standard IELTS question types, and server-authoritative scoring.
          </p>
        </div>

        {/* Test Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Academic Reading
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Mock Test 01 (Version 1)
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>60 Minutes</span>
              </div>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <div>40 Questions</div>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <div>3 Passages</div>
            </div>
          </div>

          {/* Test Sections Outline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">Passage 1 (Q1–13)</div>
              <div className="text-slate-600 dark:text-slate-400">The Bicycle: Wooden Hobby-Horse to Everyday Machine</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-1">
                True/False/Not Given, Note Completion
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">Passage 2 (Q14–26)</div>
              <div className="text-slate-600 dark:text-slate-400">Green Roofs: Gardens in the Sky</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-1">
                Matching Headings, Sentence Completion, MCQ
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">Passage 3 (Q27–40)</div>
              <div className="text-slate-600 dark:text-slate-400">The Myth of Multitasking</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-1">
                Yes/No/Not Given, MCQ, Summary Completion
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Enforces single active attempt per student. Progress saved automatically.
            </div>

            <button
              type="button"
              onClick={handleStartExam}
              disabled={isLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                isLoading
                  ? "bg-slate-700 cursor-wait"
                  : "bg-red-600 hover:bg-red-700 active:scale-98 dark:bg-red-600 dark:hover:bg-red-500"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Loading Examination...</span>
                </>
              ) : (
                <span>Start Mock Test 01</span>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        IELTS Bangla · Built for Bangladeshi IELTS Candidates · Technical Lead: Nur · Founders: Nur & Mozammel
      </footer>
    </div>
  );
}
