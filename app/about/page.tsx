import React from "react";
import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export const instant = false;

export const metadata = {
  title: "আমাদের সম্পর্কে (About Us) | IELTS বাংলা",
  description: "IELTS বাংলা প্ল্যাটফর্মের লক্ষ্য, প্রতিষ্ঠা এবং বাংলাদেশী শিক্ষার্থীদের জন্য আমাদের প্রতিশ্রুতি।",
};

export default async function AboutPage() {
  const user = await getCurrentServerUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      <Navbar user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Intro */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            About IELTS Bangla
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20395F] tracking-tight">
            বাংলাদেশের শিক্ষার্থীদের জন্য আধুনিক ও বিশ্বস্ত IELTS প্রস্তুতি
          </h1>
          <p className="text-base sm:text-lg text-[#20395F]/80 leading-relaxed">
            IELTS বাংলা একটি নিবেদিত অনলাইন মক টেস্ট প্ল্যাটফর্ম, যা বাংলাদেশী শিক্ষার্থীদের উচ্চশিক্ষা ও বিদেশযাত্রার স্বপ্ন পূরণে কার্যকর ভূমিকা রাখতে তৈরি করা হয়েছে।
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-7 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7F5EF] text-[#087653] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#20395F]">আমাদের লক্ষ্য (Mission)</h2>
            <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
              শিক্ষার্থীদের ব্যয়বহুল কোচিং সেন্টারের উপর নির্ভরতা কমিয়ে ঘরে বসেই আসল কম্পিউটার-ডেলিভার্ড পরীক্ষার পরিবেশ, নিয়মিত অনুশীলন এবং নিখুঁত মূল্যায়ন প্রাপ্তি নিশ্চিত করা।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-7 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7F5EF] text-[#087653] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#20395F]">আমাদের ভিশন (Vision)</h2>
            <p className="text-xs sm:text-sm text-[#20395F]/75 leading-relaxed">
              বাংলাদেশের প্রতিটি প্রান্ত থেকে যেন যেকোনো শিক্ষার্থী স্বাচ্ছন্দ্যে আন্তর্জাতিক মানদণ্ডের IELTS পরীক্ষা দিয়ে তার প্রয়োজনীয় ব্যান্ড স্কোর অর্জন করতে পারে।
            </p>
          </div>
        </div>

        {/* Founding Principles */}
        <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#20395F]">
            আমাদের মূল নীতিসমূহ (Core Principles)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#F8F8F9] border border-slate-100 space-y-1">
              <span className="font-bold text-[#087653]">১. নির্ভুলতা (Accuracy over Fluff)</span>
              <p className="text-[#20395F]/75">অযথা অপ্রয়োজনীয় ফিচারের পরিবর্তে পরীক্ষার সঠিক প্রশ্ন কাঠামো এবং মানসম্পন্ন স্কোরিং-কে অগ্রাধিকার দেওয়া।</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8F9] border border-slate-100 space-y-1">
              <span className="font-bold text-[#087653]">২. বাস্তবসম্মত অভিজ্ঞতা (Realistic Exam Experience)</span>
              <p className="text-[#20395F]/75">অফিশিয়াল ব্রিটিশ কাউন্সিল ও আইডিপি সিডি-আইইএলটিএস পরীক্ষার ইন্টারফেস ও টাইমার অনুকরণ করা।</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8F9] border border-slate-100 space-y-1">
              <span className="font-bold text-[#087653]">৩. নিরাপত্তা ও গোপনীয়তা (Data Privacy)</span>
              <p className="text-[#20395F]/75">শিক্ষার্থীর সকল উত্তর ও ব্যক্তিগত তথ্য আধুনিক এনক্রিপশন ও অথেন্টিকেশন দ্বারা সুরক্ষিত রাখা।</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8F9] border border-slate-100 space-y-1">
              <span className="font-bold text-[#087653]">৪. অ্যাক্সেসিবিলিটি (Accessibility)</span>
              <p className="text-[#20395F]/75">কম্পিউটার, ল্যাপটপ কিংবা যেকোনো মোবাইল স্ক্রিনে মসৃণভাবে টেস্ট নেওয়ার ব্যবস্থা রাখা।</p>
            </div>
          </div>
        </div>

        {/* Leadership & Contact */}
        <div className="bg-[#E7F5EF] rounded-2xl border border-[#087653]/20 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#087653]">
            উদ্যোগ ও টিম (Team & Contact)
          </h2>
          <p className="text-xs sm:text-sm text-[#20395F]/80 leading-relaxed">
            IELTS বাংলা প্ল্যাটফর্মটি নূর (Technical Lead) এবং মোজাম্মেল-এর যৌথ উদ্যোগে প্রতিষ্ঠিত। প্ল্যাটফর্ম সংক্রান্ত যেকোনো পরামর্শ বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
          </p>
          <div className="pt-2 text-xs font-semibold text-[#20395F]">
            ইমেইল: <a href="mailto:support@ieltsbangla.com" className="text-[#087653] underline">support@ieltsbangla.com</a> · ঢাকা, বাংলাদেশ
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
