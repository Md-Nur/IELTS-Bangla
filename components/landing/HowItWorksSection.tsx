import React from "react";
import Link from "next/link";

interface HowItWorksSectionProps {
  user?: {
    id: string;
    email: string;
  } | null;
}

export function HowItWorksSection({ user }: HowItWorksSectionProps) {
  const steps = [
    {
      step: "০১",
      title: "অ্যাকাউন্ট তৈরি করুন",
      description: "আপনার নাম ও ইমেইল দিয়ে মাত্র কয়েক সেকেন্ডে বিনামূল্যে নিবন্ধন করুন। কোনো জটিলতা নেই।",
      icon: (
        <svg className="w-5 h-5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      step: "০২",
      title: "Mock Test নির্বাচন করুন",
      description: "ড্যাশবোর্ড থেকে উপলব্ধ পূর্ণাঙ্গ Academic Reading টেস্ট নির্বাচন করে নিজের প্রস্তুতি শুরু করুন।",
      icon: (
        <svg className="w-5 h-5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      step: "০৩",
      title: "নির্দিষ্ট সময়ে পরীক্ষা দিন",
      description: "অটোসেভ সুবিধাসহ ৬০ মিনিটের আসল কম্পিউটার পরীক্ষার পরিবেশে সম্পূর্ণ প্রস্তুতি যাচাই করুন।",
      icon: (
        <svg className="w-5 h-5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      step: "০৪",
      title: "ফলাফল বিশ্লেষণ ও প্রস্তুতি বৃদ্ধি",
      description: "তাৎক্ষণিক প্রাপ্ত র' স্কোর, আনুমানিক Band Score এবং প্যাসেজ অনুযায়ী বিস্তারিত উত্তর বিশ্লেষণ দেখে নিজের দক্ষতা বাড়ান।",
      icon: (
        <svg className="w-5 h-5 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-[#20395F]/10 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            ৪টি সহজ ধাপ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20395F] tracking-tight">
            কীভাবে শুরু করবেন?
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            কোনো জটিলতা ছাড়া খুব সহজেই প্ল্যাটফর্মে যুক্ত হয়ে আপনার আইইএলটিএস প্রস্তুতি শুরু করতে পারেন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-[#F8F8F9] border border-[#20395F]/10 space-y-4 hover:border-[#087653]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#087653]/30">
                  {st.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#20395F]/10 flex items-center justify-center">
                  {st.icon}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#20395F]">
                  {st.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#087653] hover:bg-[#065e42] shadow-sm hover:shadow transition-all"
          >
            <span>{user ? "ড্যাশবোর্ডে টেস্ট দিন" : "এখনই ফ্রি অ্যাকাউন্ট খুলুন"}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
