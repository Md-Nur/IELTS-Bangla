import React from "react";
import Link from "next/link";
import {
  ExamClipboardIllustration,
  StudyBookIllustration,
  TimedExamIllustration,
  ScoreAnalyticsIllustration,
} from "@/components/common/AcademicIllustrations";

interface HowItWorksSectionProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function HowItWorksSection({ user }: HowItWorksSectionProps) {
  const steps = [
    {
      num: "01",
      title: "নিবন্ধন ও ড্যাশবোর্ড",
      description: "ইমেইল ও পাসওয়ার্ড দিয়ে বিনামূল্যে অ্যাকাউন্ট খুলে আপনার ব্যক্তিগত প্র্যাকটিস ড্যাশবোর্ডে প্রবেশ করুন।",
      illustration: <ExamClipboardIllustration className="w-8 h-8" />,
    },
    {
      num: "02",
      title: "মক টেস্ট নির্বাচন",
      description: "উপলব্ধ টেস্ট ক্যাটালগ থেকে অফিশিয়াল ফরম্যাটের Academic Reading মক টেস্টটি শুরু করার জন্য প্রস্তুত হন।",
      illustration: <StudyBookIllustration className="w-8 h-8" />,
    },
    {
      num: "03",
      title: "৬০ মিনিটের টেস্ট সম্পাদন",
      description: "ডুয়েল স্ক্রোলবার, প্রশ্ন প্যালেট ও অটোসেভ সুবিধাসহ হুবহু কম্পিউটার-ডেলিভার্ড পরীক্ষায় অংশগ্রহণ করুন।",
      illustration: <TimedExamIllustration className="w-8 h-8" />,
    },
    {
      num: "04",
      title: "স্কোর ও উত্তর বিশ্লেষণ",
      description: "টেস্ট শেষ হওয়া মাত্রই প্রাপ্ত র' স্কোর, আনুমানিক ব্যান্ড এবং প্রতিটি প্রশ্নের পুঙ্খানুপুঙ্খ ব্যাখ্যা দেখুন।",
      illustration: <ScoreAnalyticsIllustration className="w-8 h-8" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-[#20395F]/10 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            <span>প্রস্তুতি পরিক্রমা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20395F] tracking-tight">
            যেভাবে পরীক্ষা সম্পন্ন করবেন
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            কোনো জটিলতা ছাড়াই মাত্র কয়েকটি পদক্ষেপে আন্তর্জাতিক মানের কম্পিউটারাইজড মক টেস্টে অংশ নিন।
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#20395F]/10 -translate-y-8 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="relative bg-[#F8F8F9] rounded-xl border border-[#20395F]/10 p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-[#087653]/30 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#20395F]/10 text-[#087653]">
                      STEP {st.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#20395F]/10 flex items-center justify-center shadow-2xs">
                      {st.illustration}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#20395F]">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-12 flex items-center justify-start">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>{user ? "ড্যাশবোর্ডে গিয়ে পরীক্ষা দিন" : "এখনই ফ্রি অ্যাকাউন্ট খুলুন"}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
