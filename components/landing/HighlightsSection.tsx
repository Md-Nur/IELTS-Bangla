import React from "react";

export function HighlightsSection() {
  const highlights = [
    {
      title: "IELTS Academic স্ট্যান্ডার্ড অনুশীলন",
      banglaTag: "অফিসিয়াল ফরম্যাট",
      description: "বিজ্ঞান, ইতিহাস ও সমাজবিজ্ঞান সম্পর্কিত পূর্ণাঙ্গ Reading প্যাসেজ যা অফিসিয়াল IELTS একাডেমিক পরীক্ষার মানের সাথে শতভাগ সামঞ্জস্যপূর্ণ।",
      icon: (
        <svg className="w-6 h-6 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "বাস্তবসম্মত Computer-Delivered Mock Test",
      banglaTag: "আসল পরীক্ষার ইন্টারফেস",
      description: "স্প্লিট-স্ক্রিন প্যাসেজ রিডার, প্রশ্ন প্যালেট, ফ্ল্যাগিং টুল এবং স্ট্যান্ডার্ড রিভিউ মডালসহ হুবহু অফিসিয়াল পরীক্ষার পরিবেশ।",
      icon: (
        <svg className="w-6 h-6 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "টাইমড এক্সাম ও স্বয়ংক্রিয় সেভ (Autosave)",
      banglaTag: "টাইম ম্যানেজমেন্ট",
      description: "সার্ভার-নিয়ন্ত্রিত ৬০ মিনিটের নিখুঁত টাইমার, প্রতিটি উত্তরের স্বয়ংক্রিয় ব্যাকআপ এবং নির্ধারিত সময় শেষে স্বয়ংক্রিয় ফাইনাল সাবমিশন।",
      icon: (
        <svg className="w-6 h-6 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "অগ্রগতি ও Band Score ট্র্যাকিং",
      banglaTag: "পারফরম্যান্স অ্যানালিটিক্স",
      description: "প্রতিটি টেস্টের ফলাফল, র' স্কোর অগ্রগতি এবং আপনার কাঙ্ক্ষিত ব্যান্ড স্কোর (১.০ থেকে ৯.০) অর্জনের ধারাবাহিক ট্র্যাক রেকর্ড।",
      icon: (
        <svg className="w-6 h-6 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "বিস্তারিত উত্তর বিশ্লেষণ ও ব্যাখ্যা",
      banglaTag: "সঠিক উত্তর পর্যালোচনা",
      description: "প্রতিটি প্রশ্নের সঠিক উত্তরের ব্যাখ্যা, অনুমোদিত বিকল্প উত্তর এবং কেন কোনো উত্তর ভুল হয়েছে তার সুস্পষ্ট দিকনির্দেশনা।",
      icon: (
        <svg className="w-6 h-6 text-[#087653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#20395F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            প্ল্যাটফর্মের মূল বৈশিষ্ট্যসমূহ
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20395F] tracking-tight">
            বাস্তবসম্মত IELTS প্রস্তুতির নির্ভরযোগ্য পরিবেশ
          </h2>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            প্রতিটি সুবিধা আসল পরীক্ষার পরিবেশ এবং কার্যকর মূল্যায়নের কথা মাথায় রেখে নিখুঁতভাবে তৈরি করা হয়েছে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border border-[#20395F]/10 bg-[#F8F8F9] hover:bg-white hover:border-[#087653]/40 transition-all shadow-2xs hover:shadow-md ${
                idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#E7F5EF] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <div className="text-xs font-semibold text-[#087653] mb-1">
                {item.banglaTag}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#20395F] mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
