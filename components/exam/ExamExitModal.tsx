import React from "react";
import { useRouter } from "next/navigation";

export interface ExamExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamExitModal({ isOpen, onClose }: ExamExitModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Leave Examination?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are currently in an active timed IELTS session.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your examination timer continues running on the server while you are away. You can resume this attempt anytime before the 60-minute duration concludes.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Resume Examination
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/");
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors cursor-pointer"
          >
            Leave Exam
          </button>
        </div>
      </div>
    </div>
  );
}
