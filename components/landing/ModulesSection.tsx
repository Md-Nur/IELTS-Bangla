import React from "react";
import Link from "next/link";

interface ModulesSectionProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function ModulesSection({ user }: ModulesSectionProps) {
  const modules = [
    {
      id: "reading",
      title: "Academic Reading",
      banglaTitle: "রিডিং মডিউল",
      status: "available",
      badge: "এখনই উপলব্ধ",
      badgeStyle: "bg-[#E7F5EF] text-[#087653] border-[#087653]/30",
      description: "৩টি পূর্ণাঙ্গ প্যাসেজ এবং ৪০টি প্রমাণিক প্রশ্ন। True/False/Not Given, Matching Headings, Summary ও Sentence Completion সহ সম্পূর্ণ প্র্যাকটিস।",
      specs: ["৩টি প্যাসেজ", "৪০টি প্রশ্ন", "৬০ মিনিট", "অটোমেটেড স্কোরিং"],
      ctaText: user ? "মক টেস্ট শুরু করুন" : "ফ্রি প্র্যাকটিস করুন",
      ctaHref: user ? "/dashboard" : "/signup",
      icon: (
        <svg className="w-7 h-7 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "listening",
      title: "Listening Module",
      banglaTitle: "লিসেনিং মডিউল",
      status: "coming_soon",
      badge: "শীঘ্রই আসছে",
      badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
      description: "৪টি অডিও সেকশন, ৪০টি প্রশ্ন এবং বাস্তবসম্মত অডিও প্লেব্যাক কন্ট্রোল। বিভিন্ন আন্তর্জাতিক অ্যাকসেন্টে শোনার দক্ষতা বৃদ্ধি করুন।",
      specs: ["৪টি অডিও সেকশন", "৪০টি প্রশ্ন", "৩০+১০ মিনিট", "উন্নয়ন চলমান"],
      ctaText: "শীঘ্রই আসছে",
      ctaHref: "#",
      icon: (
        <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
    },
    {
      id: "writing",
      title: "Writing Module",
      banglaTitle: "রাইটিং মডিউল",
      status: "coming_soon",
      badge: "শীঘ্রই আসছে",
      badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
      description: "Task 1 (রিপোর্ট/গ্রাফ) এবং Task 2 (একাডেমিক রচনা)। বাস্তব পরীক্ষার টাইমার ও ওয়ার্ড কাউন্টারসহ অফিসিয়াল ক্রাইটেরিয়া ভিত্তিক মূল্যায়ন।",
      specs: ["Task 1 ও Task 2", "ওয়ার্ড কাউন্টার", "৬০ মিনিট", "উন্নয়ন চলমান"],
      ctaText: "শীঘ্রই আসছে",
      ctaHref: "#",
      icon: (
        <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      id: "speaking",
      title: "Speaking Module",
      banglaTitle: "স্পিকিং মডিউল",
      status: "coming_soon",
      badge: "শীঘ্রই আসছে",
      badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
      description: "Part 1, Part 2 কিউ-কার্ড এবং Part 3 ফলো-আপ ইন্টারভিউ। ব্রাউজার অডিও রেকর্ডিং ও ফ্লুয়েন্সি অনুশীলনের পরিবেশ।",
      specs: ["Part 1, 2 ও 3", "অডিও রেকর্ডিং", "১১–১৪ মিনিট", "উন্নয়ন চলমান"],
      ctaText: "শীঘ্রই আসছে",
      ctaHref: "#",
      icon: (
        <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="modules" className="py-20 bg-[#F8F8F9] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            IELTS Preparation Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20395F] tracking-tight">
            IELTS-এর চারটি প্রধান স্কিল
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            প্রাথমিকভাবে আমাদের প্ল্যাটফর্মে একাডেমিক রিডিং মডিউল সম্পূর্ণ কার্যকরী। বাকি মডিউলগুলো পর্যায়ক্রমে যুক্ত হচ্ছে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => {
            const isAvail = m.status === "available";
            return (
              <div
                key={m.id}
                className={`flex flex-col justify-between p-6 rounded-2xl bg-white border transition-all ${
                  isAvail
                    ? "border-[#087653] shadow-md ring-1 ring-[#087653]/15"
                    : "border-[#20395F]/10 opacity-80"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isAvail ? "bg-[#E7F5EF]" : "bg-slate-100"}`}>
                      {m.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${m.badgeStyle}`}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#087653]">{m.banglaTitle}</span>
                    <h3 className="text-lg font-bold text-[#20395F] mt-0.5">{m.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.specs.map((s, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  {isAvail ? (
                    <Link
                      href={m.ctaHref}
                      className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-all block"
                    >
                      {m.ctaText}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-medium text-slate-400 bg-slate-100 cursor-not-allowed block"
                    >
                      {m.ctaText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
