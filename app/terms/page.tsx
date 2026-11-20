import React from "react";
import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export const instant = false;

export const metadata = {
  title: "শর্তাবলি (Terms of Service) | IELTS বাংলা",
  description: "IELTS বাংলা প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী ও শর্তাবলি।",
};

export default async function TermsPage() {
  const user = await getCurrentServerUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      <Navbar user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#20395F]">
            ব্যবহারের শর্তাবলি (Terms of Service)
          </h1>
          <p className="text-xs text-[#20395F]/70">সর্বশেষ আপডেট: নভেম্বর ২০২৬</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#20395F]/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">১. প্ল্যাটফর্ম ব্যবহার</h2>
            <p>
              IELTS বাংলা শিক্ষার্থীদের ব্যক্তিগত প্রস্তুতি ও মক টেস্ট মূল্যায়নের জন্য তৈরি। এই প্ল্যাটফর্মের কোনো টেস্ট কনটেন্ট অননুমোদিতভাবে স্ক্র্যাপ করা, প্রতিলিপি করা বা বাণিজ্যিক উদ্দেশ্যে পুনঃবিক্রি করা সম্পূর্ণ নিষিদ্ধ।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">২. অ্যাকাউন্টের দায়িত্ব</h2>
            <p>
              শিক্ষার্থী তার নিজস্ব অ্যাকাউন্টের তথ্যের সঠিকতা ও পাসওয়ার্ডের গোপনীয়তা রক্ষার জন্য দায়ী থাকবেন। একটি অ্যাকাউন্ট একক শিক্ষার্থীর ব্যবহারের জন্য প্রযোজ্য।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">৩. মূল্যায়ন ও ব্যান্ড স্কোর</h2>
            <p>
              আমাদের স্বয়ংক্রিয় স্কোরিং ব্যবস্থা অফিশিয়াল আইইএলটিএস মানদণ্ড অনুসরণ করে এস্টিমেটেড ব্যান্ড স্কোর প্রদর্শন করে। এটি শিক্ষার্থীদের প্রস্তুতির সহায়ক নির্দেশক এবং বাস্তব অফিশিয়াল পরীক্ষার অফিসিয়াল সনদের সমতুল্য নয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#20395F]">৪. শর্ত পরিবর্তন</h2>
            <p>
              কর্তৃপক্ষ প্রয়োজনে এই শর্তাবলি পরিমার্জন বা হালনাগাদ করার অধিকার সংরক্ষণ করে।
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
