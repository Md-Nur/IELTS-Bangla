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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20395F]/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-[#20395F]/15 w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 id="exit-modal-title" className="text-base font-bold text-[#20395F]">
              পরীক্ষা থেকে সাময়িক প্রস্থান?
            </h3>
            <p className="text-xs text-[#20395F]/70">
              আপনি বর্তমানে একটি নির্ধারিত সময়ের IELTS পরীক্ষায় অংশ নিচ্ছেন।
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#20395F]/80 leading-relaxed bg-[#F8F8F9] p-3.5 rounded-xl border border-[#20395F]/10">
          আপনি ড্যাশবোর্ডে ফিরে গেলেও সার্ভারে ৬০ মিনিটের টাইমার সচল থাকবে। নির্ধারিত ৬০ মিনিট পার হওয়ার পূর্বেই যেকোনো সময় ড্যাশবোর্ড থেকে পরীক্ষায় পুনরায় যুক্ত হতে পারবেন।
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/dashboard");
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#20395F]/20 hover:bg-[#F8F8F9] text-[#20395F] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
          >
            ড্যাশবোর্ডে ফিরুন
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#087653] hover:bg-[#065e42] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs text-center"
          >
            পরীক্ষা চালিয়ে যান
          </button>
        </div>
      </div>
    </div>
  );
}
