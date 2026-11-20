import React from "react";

export function WhyUsSection() {
  const values = [
    {
      title: "Accessible IELTS Preparation",
      banglaTitle: "সবার জন্য সহজলভ্য প্রস্তুতি",
      description: "Bringing high-quality, computer-delivered mock tests to candidates across Bangladesh without costly coaching center barriers.",
    },
    {
      title: "Structured Practice Resources",
      banglaTitle: "গঠনমূলক ও স্ট্যান্ডার্ড কনটেন্ট",
      description: "Authentic, carefully authored test materials adhering to Cambridge and British Council Academic IELTS specifications.",
    },
    {
      title: "User-Friendly Examination Interface",
      banglaTitle: "সহজ ও পরিচ্ছন্ন ইন্টারফেস",
      description: "A distraction-free, responsive split-screen reader interface engineered specifically for comfortable test-taking on modern screens.",
    },
    {
      title: "Focus on Consistent Improvement",
      banglaTitle: "ক্রমাগত দক্ষতা বৃদ্ধির নিশ্চয়তা",
      description: "Server-authoritative evaluations eliminate guesswork, highlighting areas of weakness across different question types.",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#20395F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
              Why IELTS Bangla
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20395F] tracking-tight leading-tight">
              কেন IELTS বাংলা আপনার প্রস্তুতির সেরা সঙ্গী?
            </h2>
            <p className="text-sm sm:text-base text-[#20395F]/80 leading-relaxed">
              আইইএলটিএস পরীক্ষার প্রস্তুতিতে কেবল বই পড়া যথেষ্ট নয়; প্রয়োজন বাস্তব পরীক্ষার টাইমিং এবং কম্পিউটার-ডেলিভার্ড ফরম্যাটের নিয়মিত অভ্যাস। আমাদের প্ল্যাটফর্ম সেই চাহিদাকে কেন্দ্র করেই গড়ে তোলা হয়েছে।
            </p>
            <div className="pt-2 border-l-4 border-[#087653] pl-4">
              <p className="text-sm font-semibold text-[#20395F]">
                &ldquo;আমাদের লক্ষ্য প্রতিটি বাংলাদেশী শিক্ষার্থী যেন নির্ভরযোগ্য মানের আইইএলটিএস টেস্ট দিয়ে নিজের বাস্তব অবস্থান যাচাই করতে পারে।&rdquo;
              </p>
              <span className="text-xs text-[#087653] font-medium block mt-1">
                — প্রতিষ্ঠাতা দল, IELTS বাংলা
              </span>
            </div>
          </div>

          {/* Right Column: 4 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F8F8F9] border border-[#20395F]/10 space-y-2.5 hover:border-[#087653]/30 transition-colors shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E7F5EF] text-[#087653] font-bold text-xs flex items-center justify-center">
                  0{i + 1}
                </div>
                <div className="text-xs font-semibold text-[#087653]">
                  {v.banglaTitle}
                </div>
                <h3 className="text-base font-bold text-[#20395F]">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
