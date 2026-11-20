import React from "react";
import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export const instant = false;

export const metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | IELTS বাংলা",
  description: "IELTS বাংলা প্ল্যাটফর্মের ডেটা নিরাপত্তা ও গোপনীয়তা নীতি।",
};

export default async function PrivacyPage() {
  const user = await getCurrentServerUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      <Navbar user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#20395F]">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-xs text-[#20395F]/70">সর্বশেষ আপডেট: নভেম্বর ২০২৬</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#20395F]/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">১. তথ্য সংগ্রহ</h2>
            <p>
              IELTS বাংলা প্ল্যাটফর্মে রেজিস্ট্রেশনের সময় আপনার নাম ও ইমেইল ঠিকানা সংগ্রহ করা হয়। এছাড়া আপনার মক টেস্টের উত্তর, সময়কাল এবং ব্যান্ড স্কোর ফলাফল সম্পর্কিত ডাটা আমাদের সুরক্ষিত ডাটাবেসে সংরক্ষিত থাকে যাতে আপনি যেকোনো সময় আপনার অগ্রগতি দেখতে পারেন।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">২. তথ্যের নিরাপত্তা</h2>
            <p>
              আপনার পাসওয়ার্ড শিল্পের সর্বোচ্চ মানদণ্ড (bcrypt হ্যাশিং) অনুযায়ী সুরক্ষিত রাখা হয়। পাসওয়ার্ড কখনো প্লেইন টেক্সট হিসেবে সংরক্ষণ বা প্রদর্শিত হয় না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">৩. তৃতীয় পক্ষের সাথে তথ্য ভাগাভাগি</h2>
            <p>
              আমরা কোনো শিক্ষার্থীর ব্যক্তিগত তথ্য বা ইমেইল বাণিজ্যিক বা বিপণন উদ্দেশ্যে কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">৪. কুকিজ ও সেশন</h2>
            <p>
              লগইন সেশন সচল রাখতে এবং প্ল্যাটফর্মের সুরক্ষা নিশ্চিত করতে আমরা সিকিউর httpOnly কুকি ব্যবহার করি।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">৫. যোগাযোগ</h2>
            <p>
              গোপনীয়তা নীতি সম্পর্কিত যেকোনো তথ্যের জন্য support@ieltsbangla.com এ যোগাযোগ করুন।
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
