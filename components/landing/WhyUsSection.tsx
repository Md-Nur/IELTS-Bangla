import React from "react";

export function WhyUsSection() {
  const pillars = [
    {
      num: "01",
      title: "কোচিং নির্ভরতা কমিয়ে স্বয়ংসম্পূর্ণ প্রস্তুতি",
      description: "ব্যয়বহুল অফলাইন কোচিং কিংবা ফটোকপি বইয়ের বাইরে গিয়ে আসল পরীক্ষার স্ক্রিন ফরম্যাটের সাথে প্রার্থীর স্বাভাবিক বোঝাপড়া গড়ে তোলা।",
    },
    {
      num: "02",
      title: "অফিশিয়াল Cambridge মানের প্রশ্ন ও প্যাসেজ",
      description: "আন্তর্জাতিক জার্নাল ও গবেষণা প্রবন্ধ থেকে নির্বাচিত বিষয়বস্তু, যা রিডিং পরীক্ষার গভীরতা ও ভাষাগত কাঠামোর হুবহু প্রতিফলন।",
    },
    {
      num: "03",
      title: "ডিস্ট্রাকশন-মুক্ত পেশাদার ইন্টারফেস",
      description: "অপ্রয়োজনীয় অ্যানিমেশন কিংবা বিজ্ঞাপনের ভিড় ছাড়াই নিখুঁত টু-প্যানেল স্ক্রিন, যেখানে শুধু প্যাসেজ আর প্রশ্নই মুখ্য।",
    },
    {
      num: "04",
      title: "কঠোর অ্যালগরিদমিক মূল্যায়ন",
      description: "স্পেলিং ও ক্যাপিটালাইজেশন বিবেচনা করে প্রতিটি উত্তরের নির্ভুল গ্রেডিং, যাতে অনুমানের ওপর ভিত্তি না করে বাস্তব ব্যান্ড বোঝা যায়।",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#20395F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading, Mission, and Commitment */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
              <span>আমাদের দর্শন</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20395F] tracking-tight leading-tight">
              কেন IELTS বাংলা সাধারণ প্র্যাকটিস সাইট থেকে আলাদা?
            </h2>

            <p className="text-sm sm:text-base text-[#20395F]/80 leading-relaxed">
              অধিকাংশ শিক্ষার্থী পরীক্ষার হলে গিয়ে কম্পিউটারে ৬০ মিনিটে ৩টি বড় প্যাসেজ পড়ার চাপে ভুল করেন। আমাদের উদ্দেশ্য শিক্ষার্থীদের সেই ইন্টারফেস ও সময় চাপের সাথে আগেভাগেই অভ্যস্ত করে তোলা।
            </p>

            <div className="p-5 rounded-lg bg-[#F8F8F9] border-l-4 border-[#087653] space-y-2">
              <p className="text-xs sm:text-sm font-medium text-[#20395F] italic leading-relaxed">
                &ldquo;আমাদের লক্ষ্য বাণিজ্যিক প্রতিশ্রুতি দেওয়া নয়; বরং আন্তর্জাতিক মানের একটি নির্ভরযোগ্য প্র্যাকটিস প্ল্যাটফর্ম তৈরি করা, যার মাধ্যমে প্রার্থীরা নিজেদের সত্যিকারের ব্যান্ড মূল্যায়ন করতে পারেন।&rdquo;
              </p>
              <span className="text-xs text-[#087653] font-bold block">
                — একাডেমিক ডেভেলপমেন্ট টিম, IELTS বাংলা
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Structured Pillars with Clean Dividers */}
          <div className="lg:col-span-7 bg-[#F8F8F9] rounded-xl border border-[#20395F]/10 p-6 sm:p-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#087653] mb-6">
              প্ল্যাটফর্মের ৪টি মূল ভিত্তি
            </h3>

            <div className="divide-y divide-[#20395F]/10 space-y-6">
              {pillars.map((p, i) => (
                <div key={i} className={i > 0 ? "pt-6" : ""}>
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#20395F]/10 text-[#087653] shrink-0 mt-0.5">
                      {p.num}
                    </span>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-[#20395F]">
                        {p.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
