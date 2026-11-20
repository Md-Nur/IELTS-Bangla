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
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-[#20395F]/10 bg-gradient-to-b from-white via-[#F8F8F9] to-[#F8F8F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E7F5EF] border border-[#087653]/25 text-[#087653] text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#087653]" />
              <span>IELTS Academic · কম্পিউটার-ডেলিভার্ড মক টেস্ট প্ল্যাটফর্ম</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#20395F] tracking-tight leading-[1.25]">
              আসল পরীক্ষার পরিবেশে Cambridge মানের{" "}
              <span className="text-[#087653]">IELTS Reading</span> অনুশীলন
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[#20395F]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              বাস্তব পরীক্ষার স্প্লিট-স্ক্রিন ইন্টারফেস, ৩টি পূর্ণাঙ্গ একাডেমিক প্যাসেজ এবং ৬০ মিনিটের নিখুঁত টাইমার। কোনো কোচিংয়ের মুখাপেক্ষী না হয়ে ঘরে বসেই বাংলায় বিস্তারিত ব্যাখ্যাসহ নিজের প্রস্তুতি যাচাই করুন।
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-[#20395F]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#20395F]/15 font-medium">
                <span className="text-[#087653] font-bold">✓</span> ৩টি প্রমাণিক Academic প্যাসেজ
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#20395F]/15 font-medium">
                <span className="text-[#087653] font-bold">✓</span> ৬০ মিনিটের সার্ভার টাইমার ও অটোসেভ
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7F5EF] border border-[#087653]/30 font-semibold text-[#087653]">
                <span>✓</span> তাৎক্ষণিক Band Score (১.০–৯.০)
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto px-7 py-3 rounded-lg font-bold text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-colors flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{user ? "ড্যাশবোর্ডে টেস্ট দিন" : "ফ্রি মক টেস্ট শুরু করুন"}</span>
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
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#20395F] bg-white hover:bg-slate-50 border border-[#20395F]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>পরীক্ষার বিবরণ ও ফরম্যাট</span>
                <svg className="w-4 h-4 text-[#20395F]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Visual Col: Grounded Realistic Exam Simulation Window */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md lg:max-w-none">
              {/* Window Frame */}
              <div className="bg-white rounded-xl border border-[#20395F]/20 shadow-md overflow-hidden space-y-0">
                {/* Simulated Desktop Window Bar */}
                <div className="bg-[#20395F] px-4 py-2.5 flex items-center justify-between text-white text-xs select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D93A45]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD66B]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#087653]/80" />
                    <span className="ml-2 font-mono text-[11px] text-white/80 font-medium hidden sm:inline">
                      IELTS Academic Reading · Test Simulation
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 font-mono text-xs font-bold text-[#FFD66B]">
                    <span>⏱ 60:00</span>
                  </div>
                </div>

                {/* Window Inner Content */}
                <div className="p-5 sm:p-6 space-y-4 text-[#20395F]">
                  <div className="flex items-center justify-between border-b border-[#20395F]/10 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#087653]">
                        Passage 1 · প্রশ্ন ১–১৩
                      </span>
                      <h3 className="text-base font-bold text-[#20395F]">
                        The Development of the Modern Bicycle
                      </h3>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#E7F5EF] text-[#087653] font-bold border border-[#087653]/25">
                      Academic Mode
                    </span>
                  </div>

                  {/* Sample Passage Snippet */}
                  <blockquote className="text-xs italic text-[#20395F]/85 pl-3 border-l-2 border-[#087653] leading-relaxed font-serif bg-[#F8F8F9] py-2 pr-2 rounded-r">
                    &ldquo;Although the wooden velocipede was introduced earlier, the modern bicycle transformed daily urban transport only after pneumatic tyres were developed.&rdquo;
                  </blockquote>

                  {/* Sample Question & Radios */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#20395F]">
                      <span>প্রশ্ন ১: True / False / Not Given</span>
                      <span className="text-[11px] font-normal text-[#20395F]/60">১ নম্বর</span>
                    </div>
                    <p className="text-xs text-[#20395F]/90 leading-normal">
                      Pneumatic tyres were essential to the everyday adoption of the bicycle.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <span className="px-3 py-1 rounded text-xs font-bold bg-[#087653] text-white shadow-2xs">
                        ✓ TRUE
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-white text-[#20395F] border border-[#20395F]/20">
                        FALSE
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-white text-[#20395F] border border-[#20395F]/20">
                        NOT GIVEN
                      </span>
                    </div>
                  </div>

                  {/* Window Bottom Meta Bar */}
                  <div className="pt-3 border-t border-[#20395F]/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[11px] text-[#20395F]/70">
                      <span><strong>৪০টি</strong> প্রশ্ন</span>
                      <span>•</span>
                      <span><strong>৩টি</strong> প্যাসেজ</span>
                      <span>•</span>
                      <span className="text-[#087653] font-semibold">অটোসেভ সক্রিয়</span>
                    </div>
                    <Link
                      href={user ? "/dashboard" : "/signup"}
                      className="text-xs font-bold text-[#087653] hover:underline"
                    >
                      পরীক্ষা শুরু করুন →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
