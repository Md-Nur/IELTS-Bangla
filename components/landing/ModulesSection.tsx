import React from "react";
import Link from "next/link";
import {
  StudyBookIllustration,
  ListeningAudioIllustration,
  WritingPencilIllustration,
  SpeakingPartnerIllustration,
} from "@/components/common/AcademicIllustrations";

interface ModulesSectionProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function ModulesSection({ user }: ModulesSectionProps) {
  const upcomingModules = [
    {
      id: "listening",
      title: "Listening Module",
      banglaTitle: "লিসেনিং মডিউল",
      statusBadge: "Phase 2 · উন্নয়ন চলমান",
      description: "আন্তর্জাতিক অ্যাকসেন্ট (British, Australian, American), ৪টি অডিও সেকশন এবং অবিকল কম্পিউটার পরীক্ষার অডিও প্লেব্যাক কন্ট্রোল।",
      specs: ["৪টি অডিও সেকশন", "৪০টি প্রশ্ন", "৩০ মিনিট + ১০ মিনিট রিভিউ"],
      illustration: <ListeningAudioIllustration className="w-10 h-10" />,
    },
    {
      id: "writing",
      title: "Writing Module",
      banglaTitle: "রাইটিং মডিউল",
      statusBadge: "Phase 3 · পরিকল্পিত",
      description: "Task 1 (গ্রাফ/চার্ট বিশ্লেষণ) ও Task 2 (একাডেমিক প্রবন্ধ)। অটোমেটিক ওয়ার্ড কাউন্ট এবং অফিসিয়াল ৪-ক্রাইটেরিয়া ব্যান্ড স্কোরিং গাইড।",
      specs: ["Task 1 ও 2", "লাইভ ওয়ার্ড কাউন্টার", "৬০ মিনিট"],
      illustration: <WritingPencilIllustration className="w-10 h-10" />,
    },
    {
      id: "speaking",
      title: "Speaking Module",
      banglaTitle: "স্পিকিং মডিউল",
      statusBadge: "Phase 4 · পরিকল্পিত",
      description: "Part 1 পরিচিতি, Part 2 কিউ-কার্ড ১ মিনিট প্রস্তুতি এবং Part 3 ডিসকাশন। ব্রাউজারে অডিও রেকর্ডিং ও ফ্লুয়েন্সি সেলফ-অ্যাসেসমেন্ট।",
      specs: ["Part 1, 2 ও 3", "অডিও রেকর্ডার", "১১–১৪ মিনিট"],
      illustration: <SpeakingPartnerIllustration className="w-10 h-10" />,
    },
  ];

  return (
    <section id="modules" className="py-20 bg-[#F8F8F9] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            <span>প্রস্তুতি মডিউল ও রোডম্যাপ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20395F] tracking-tight">
            IELTS-এর চারটি স্কিল: বর্তমান ও ভবিষ্যৎ
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            আমরা প্রতিটি মডিউল হুবহু আন্তর্জাতিক মানদণ্ডে তৈরি করছি। বর্তমানে একাডেমিক রিডিং মডিউল সম্পূর্ণ কার্যকরী ও সবার জন্য উন্মুক্ত।
          </p>
        </div>

        {/* Primary Showcase Card: Academic Reading (Live Module) */}
        <div className="bg-white rounded-xl border-2 border-[#087653] p-7 sm:p-9 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E7F5EF] text-[#087653] border border-[#087653]/30">
                  ● এখন সম্পূর্ণ সক্রিয় (Live Module)
                </span>
                <span className="text-xs font-semibold text-[#20395F]/60">
                  Academic Reading Test 1
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#20395F]">
                  IELTS Academic Reading Module
                </h3>
                <p className="text-sm text-[#087653] font-semibold mt-1">
                  ৩টি পূর্ণাঙ্গ প্যাসেজ · ৪০টি প্রমাণিক প্রশ্ন · ৬০ মিনিটের অফিশিয়াল টাইম ফ্রেম
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#20395F]/80 leading-relaxed">
                প্যাসেজ ১ (The Bicycle), প্যাসেজ ২ (Green Roofs) এবং প্যাসেজ ৩ (The Myth of Multitasking)। সাথে রয়েছে True/False/Not Given, Matching Headings, Summary ও Sentence Completion সহ বাস্তব পরীক্ষার সকল প্রধান প্রশ্ন টাইপ।
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {["৩টি প্যাসেজ", "৪০টি প্রশ্ন", "৬০ মিনিট টাইমার", "ইনস্ট্যান্ট ব্যান্ড স্কোর", "অফিসিয়াল অ্যান্সার কী"].map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#F8F8F9] text-[#20395F] border border-[#20395F]/10 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 w-full lg:w-auto shrink-0">
              <div className="w-24 h-24 rounded-xl bg-[#E7F5EF] border border-[#087653]/20 flex items-center justify-center p-2 shadow-2xs">
                <StudyBookIllustration className="w-16 h-16" />
              </div>
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto lg:w-48 py-3 px-6 rounded-lg font-bold text-xs text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-all text-center cursor-pointer"
              >
                {user ? "মক টেস্ট শুরু করুন" : "বিনামূল্যে টেস্ট দিন"}
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Modules: 3-column Roadmap */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#20395F]/70">
              পরবর্তী মডিউলসমূহ (Development Pipeline)
            </h4>
            <span className="text-xs text-[#20395F]/50">পর্যায়ক্রমে যুক্ত হচ্ছে</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingModules.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-xl bg-white border border-[#20395F]/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {m.statusBadge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#F8F8F9] flex items-center justify-center">
                      {m.illustration}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-[#087653] font-semibold">{m.banglaTitle}</span>
                    <h5 className="text-base font-bold text-[#20395F]">{m.title}</h5>
                  </div>

                  <p className="text-xs text-[#20395F]/70 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {m.specs.map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
