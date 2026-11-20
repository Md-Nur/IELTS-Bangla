import React from "react";
import Link from "next/link";

interface HeroSectionProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background soft ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#E7F5EF]/60 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F5EF] border border-[#087653]/20 text-[#087653] text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#087653] animate-pulse" />
              <span>বিশ্বস্ত কম্পিউটার-ডেলিভার্ড IELTS প্ল্যাটফর্ম</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-[#20395F] tracking-tight leading-[1.2]">
              সঠিক প্রস্তুতি। কার্যকর অনুশীলন।{" "}
              <span className="text-[#087653] block sm:inline">
                অর্জন করুন কাঙ্ক্ষিত IELTS লক্ষ্য।
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#20395F]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              বাস্তব পরীক্ষার অভিজ্ঞতা, কাঠামোগত Mock Test এবং নির্ভুল স্কোর বিশ্লেষণের মাধ্যমে প্রস্তুতি নিন। মূল পরীক্ষার আগেই তৈরি করে নিন নিজের আত্মবিশ্বাস।
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-[#20395F]/10 text-[#20395F] shadow-2xs">
                ✓ ৩টি Academic প্যাসেজ
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-[#20395F]/10 text-[#20395F] shadow-2xs">
                ✓ ৬০ মিনিটের অফিসিয়াল টাইমার
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-[#E7F5EF] border border-[#087653]/30 text-[#087653] shadow-2xs">
                ✓ তাৎক্ষণিক অটোমেটেড স্কোর ও রিভিউ
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>{user ? "ড্যাশবোর্ডে যান" : "অনুশীলন শুরু করুন"}</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#modules"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-[#20395F] bg-white hover:bg-slate-50 border border-[#20395F]/20 shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Mock Test সমূহ দেখুন</span>
                <svg className="w-4 h-4 text-[#20395F]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Visual Col: Interactive Test Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background blur ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#087653]/20 to-[#20395F]/20 rounded-3xl blur-xl opacity-70 -z-10" />

              {/* Main Card */}
              <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-7 shadow-xl space-y-6">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653] mb-1.5">
                      Academic Reading · Mock 01
                    </span>
                    <h3 className="text-lg font-bold text-[#20395F]">
                      কম্পিউটার-ডেলিভার্ড IELTS সিমুলেশন
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#D93A45]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>60:00</span>
                  </div>
                </div>

                {/* Sample Question Preview */}
                <div className="space-y-3 bg-[#F8F8F9] rounded-xl p-4 border border-[#20395F]/10">
                  <div className="text-xs font-semibold text-[#087653] uppercase tracking-wide">
                    Passage 1 · প্রশ্ন ১–১৩
                  </div>
                  <blockquote className="text-xs italic text-[#20395F]/80 pl-3 border-l-2 border-[#087653] leading-relaxed">
                    &ldquo;Although the wooden velocipede was introduced earlier, the modern bicycle transformed daily transport only after pneumatic tyres were developed.&rdquo;
                  </blockquote>
                  <div className="pt-1">
                    <p className="text-xs font-bold text-[#20395F]">
                      True / False / Not Given:
                    </p>
                    <p className="text-xs text-[#20395F]/90 mt-0.5">
                      Pneumatic tyres were essential to the everyday adoption of the bicycle.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-[#087653] text-white">
                        ✓ TRUE
                      </span>
                      <span className="px-3 py-1 rounded-md text-[11px] font-medium bg-white text-[#20395F] border border-[#20395F]/15">
                        FALSE
                      </span>
                      <span className="px-3 py-1 rounded-md text-[11px] font-medium bg-white text-[#20395F] border border-[#20395F]/15">
                        NOT GIVEN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Features Meta */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-slate-400 font-medium">প্রশ্নসংখ্যা</span>
                    <span className="font-extrabold text-[#20395F]">৪০টি প্রশ্ন</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-slate-400 font-medium">সময়সীমা</span>
                    <span className="font-extrabold text-[#20395F]">৬০ মিনিট</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E7F5EF] border border-[#087653]/20">
                    <span className="block text-[#087653]/70 font-medium">মূল্যায়ন</span>
                    <span className="font-extrabold text-[#087653]">Band ১.০–৯.০</span>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#087653] bg-[#E7F5EF] hover:bg-[#d8efe5] transition-colors block"
                >
                  {user ? "ড্যাশবোর্ডে পরীক্ষা দিন →" : "বিনামূল্যে পরীক্ষা দিতে সাইন আপ করুন →"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
