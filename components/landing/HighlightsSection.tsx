import React from "react";
import Link from "next/link";
import {
  StudyBookIllustration,
  ExamClipboardIllustration,
  TimedExamIllustration,
  ScoreAnalyticsIllustration,
  MistakeCheckerIllustration,
} from "@/components/common/AcademicIllustrations";

export function HighlightsSection() {
  const secondaryFeatures = [
    {
      title: "অফিসিয়াল প্রশ্ন কাঠামো ও ভ্যারাইটি",
      description: "True/False/Not Given, Matching Headings, Summary ও Sentence Completion সহ বাস্তব পরীক্ষার সকল প্রধান প্রশ্ন টাইপ।",
      illustration: <StudyBookIllustration className="w-8 h-8 text-[#087653]" />,
    },
    {
      title: "রিয়েল-টাইম অটোসেভ ও রেসিলিয়েন্ট স্টেট",
      description: "প্রতিটি উত্তরের তাৎক্ষণিক ব্যাকআপ; ব্রাউজার রিফ্রেশ হলেও প্রগ্রেস কিংবা অবশিষ্ট সময় নষ্ট হয় না।",
      illustration: <TimedExamIllustration className="w-8 h-8 text-[#087653]" />,
    },
    {
      title: "Cambridge স্কেলে তাৎক্ষণিক ব্যান্ড গণনা",
      description: "৪০টি প্রশ্নের র' স্কোরের ভিত্তিতে অফিশিয়াল একাডেমিক কনভার্সন টেবিল অনুযায়ী ১.০ থেকে ৯.০ ব্যান্ডের নির্ভুল হিসাব।",
      illustration: <ScoreAnalyticsIllustration className="w-8 h-8 text-[#087653]" />,
    },
    {
      title: "বিশদ উত্তর ব্যাখ্যা ও ডিস্ট্রাক্টর অ্যানালাইসিস",
      description: "পরীক্ষা শেষে প্রতিটি প্রশ্নের সঠিক উত্তরের লজিক এবং বিভ্রান্তিকর অপশনগুলো কেন ভুল তা সুস্পষ্টভাবে জেনে নিন।",
      illustration: <MistakeCheckerIllustration className="w-8 h-8 text-[#087653]" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#20395F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            <span>প্ল্যাটফর্মের সক্ষমতা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20395F] tracking-tight">
            আসল পরীক্ষার মানসিক চাপ কাটিয়ে ওঠার নির্ভরযোগ্য মাধ্যম
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            IELTS কম্পিউটার-ডেলিভার্ড পরীক্ষায় সাফল্য কেবল ইংরেজি জানার ওপর নয়, ইন্টারফেসের গতি ও সময় ব্যবস্থাপনার ওপর সমানভাবে নির্ভর করে।
          </p>
        </div>

        {/* Asymmetric Showcase Grid: Core Engine Feature on Left, 4 Grounded Capabilities on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Focus Card: The CBT Exam Simulation (Takes 5 columns) */}
          <div className="lg:col-span-5 bg-[#F8F8F9] rounded-xl border border-[#20395F]/15 p-7 flex flex-col justify-between shadow-2xs">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-lg bg-white border border-[#20395F]/10 flex items-center justify-center shadow-2xs">
                <ExamClipboardIllustration className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#087653]">
                  কোর সিমুলেশন ইঞ্জিন
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#20395F] mt-1">
                  Computer-Delivered পরীক্ষার অবিকল অভিজ্ঞতা
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#20395F]/80 leading-relaxed">
                প্যাসেজ ও প্রশ্ন পাশাপাশি রেখে পড়ার স্প্লিট-স্ক্রিন লেআউট, প্রশ্ন প্যালেট নেভিগেশন, রিভিউ ফ্ল্যাগিং এবং ৬০ মিনিটের নিখুঁত টাইমার—সবকিছুই আসল ব্রিটিশ কাউন্সিল ও আইডিপি কম্পিউটার পরীক্ষার আদলে তৈরি।
              </p>

              {/* Technical Specifications Checklist */}
              <div className="pt-4 border-t border-[#20395F]/10 space-y-2.5 text-xs text-[#20395F]/85">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#E7F5EF] text-[#087653] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>স্বতন্ত্র ডুয়াল স্ক্রলবার ও ফন্ট সাইজ অ্যাডজাস্টমেন্ট</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#E7F5EF] text-[#087653] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>১ থেকে ৪০ পর্যন্ত প্রতিটি প্রশ্নের ডিরেক্ট জাম্প প্যালেট</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#E7F5EF] text-[#087653] flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>সার্ভার-অথরিটেটিভ কাউন্টডাউন ও অটো-সাবমিট সুরক্ষা</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#20395F]/10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#087653] hover:text-[#065e42] transition-colors"
              >
                <span>সিমুলেশন দিয়ে প্রস্তুতি শুরু করুন</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right 4 Features (Takes 7 columns in 2x2 grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {secondaryFeatures.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white border border-[#20395F]/10 hover:border-[#087653]/35 hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F8F8F9] border border-[#20395F]/10 flex items-center justify-center">
                    {f.illustration}
                  </div>
                  <h4 className="text-base font-bold text-[#20395F] leading-snug">
                    {f.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
