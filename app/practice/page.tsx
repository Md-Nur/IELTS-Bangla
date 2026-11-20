import React from "react";
import Link from "next/link";
import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { prisma } from "@/lib/prisma";
import { StartExamButton } from "@/components/dashboard/StartExamButton";

export const instant = false;

export const metadata = {
  title: "প্র্যাকটিস টেস্ট ও নির্দেশিকা | IELTS বাংলা",
  description: "IELTS Academic Reading মক টেস্ট, প্রশ্নকাঠামো এবং ব্যান্ড কনভার্সন নির্দেশিকা।",
};

export default async function PracticePage() {
  const user = await getCurrentServerUser();

  const tests = await prisma.test.findMany({
    where: { status: "ACTIVE" },
  });

  const questionTypes = [
    {
      name: "True / False / Not Given",
      desc: "প্যাসেজের তথ্যের সাথে প্রদত্ত বাক্যের সত্যতা বা সামঞ্জস্য নিরূপণ।",
      example: "Passage 1 (Questions 1–7)",
    },
    {
      name: "Note / Summary Completion",
      desc: "প্যাসেজ থেকে শব্দ নিয়ে শূন্যস্থান পূরণ, নির্দিষ্ট শব্দসীমা মেনে।",
      example: "Passage 1 & 3 (Questions 8–13, 37–40)",
    },
    {
      name: "Matching Headings",
      desc: "প্রতিটি প্যারাগ্রাফের মূল ভাব অনুযায়ী সঠিক রোমান সংখ্যাযুক্ত শিরোনাম নির্বাচন।",
      example: "Passage 2 (Questions 14–19)",
    },
    {
      name: "Sentence Completion",
      desc: "প্যাসেজের তথ্য অনুযায়ী অসম্পূর্ণ বাক্য সমাপ্ত করা।",
      example: "Passage 2 (Questions 20–23)",
    },
    {
      name: "Multiple Choice (MCQ)",
      desc: "চারটি বিকল্প (A, B, C, D) থেকে সঠিক বিকল্প নির্বাচন।",
      example: "Passage 2 & 3 (Questions 24–26, 33–36)",
    },
    {
      name: "Yes / No / Not Given",
      desc: "লেখকের দৃষ্টিভঙ্গি বা মতামতের সাথে বিবৃতির ঐক্য বা বৈসাদৃশ্য যাচাই।",
      example: "Passage 3 (Questions 27–32)",
    },
  ];

  const bandTable = [
    { raw: "39–40", band: "Band 9.0", level: "Expert User" },
    { raw: "37–38", band: "Band 8.5", level: "Very Good User" },
    { raw: "35–36", band: "Band 8.0", level: "Very Good User" },
    { raw: "33–34", band: "Band 7.5", level: "Good User" },
    { raw: "30–32", band: "Band 7.0", level: "Good User" },
    { raw: "27–29", band: "Band 6.5", level: "Competent User" },
    { raw: "23–26", band: "Band 6.0", level: "Competent User" },
    { raw: "19–22", band: "Band 5.5", level: "Modest User" },
    { raw: "15–18", band: "Band 5.0", level: "Modest User" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653]">
            Official Examination Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20395F] tracking-tight">
            IELTS Academic Reading প্র্যাকটিস ও নির্দেশিকা
          </h1>
          <p className="text-sm sm:text-base text-[#20395F]/75 leading-relaxed">
            কম্পিউটার-ডেলিভার্ড আইইএলটিএস পরীক্ষার সম্পূর্ণ প্যাটার্ন, সময় বণ্টন এবং মূল্যায়ন পদ্ধতি জেনে নিয়ে মক টেস্টে অংশ নিন।
          </p>
        </div>

        {/* Available Tests Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#20395F]">
            সক্রিয় মক টেস্টসমূহ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-[#20395F]/15 p-6 shadow-sm space-y-4 hover:border-[#087653]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#087653] uppercase tracking-wide">
                      {t.category} · {t.module}
                    </span>
                    <h3 className="text-lg font-bold text-[#20395F] mt-0.5">
                      {t.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E7F5EF] text-[#087653]">
                    ফ্রি
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">সময়</span>
                    <span className="font-bold text-[#20395F]">{t.durationMinutes} মিনিট</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">প্রশ্ন</span>
                    <span className="font-bold text-[#20395F]">{t.totalQuestions} টি</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">প্যাসেজ</span>
                    <span className="font-bold text-[#20395F]">৩টি সেকশন</span>
                  </div>
                </div>

                <p className="text-xs text-[#20395F]/75">
                  The Bicycle, Green Roofs, এবং The Myth of Multitasking প্যাসেজ সমন্বিত ফুল-লেংথ একাডেমিক টেস্ট।
                </p>

                <div className="pt-2">
                  {user ? (
                    <StartExamButton testSlug={t.slug} />
                  ) : (
                    <Link
                      href="/signup"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#087653] hover:bg-[#065e42] shadow-sm transition-all inline-flex items-center justify-center gap-2"
                    >
                      <span>পরীক্ষা দিতে অ্যাকাউন্ট খুলুন</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#20395F]">
            প্রশ্নের ধরনসমূহ (Question Types)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionTypes.map((q, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-[#20395F]/15 space-y-2 shadow-2xs"
              >
                <span className="text-[11px] font-bold text-[#087653] block">
                  ধরণ ০{i + 1}
                </span>
                <h3 className="text-sm font-bold text-[#20395F]">
                  {q.name}
                </h3>
                <p className="text-xs text-[#20395F]/75 leading-relaxed">
                  {q.desc}
                </p>
                <div className="text-[11px] font-medium text-slate-500 pt-1">
                  নমুনা: {q.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Band Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#20395F]">
              স্কোরিং ও ব্যান্ড কনভার্সন টেবিল (Academic Reading)
            </h2>
            <p className="text-xs text-[#20395F]/70">
              ৪০টি প্রশ্নের মধ্যে প্রাপ্ত নম্বরের ভিত্তিতে অফিশিয়াল ব্যান্ড স্কোর নির্ধারণ নির্দেশিকা
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#20395F]/15 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F9] text-[#20395F] font-bold border-b border-[#20395F]/10">
                <tr>
                  <th className="py-3 px-4">সঠিক উত্তরের সংখ্যা (Raw Score)</th>
                  <th className="py-3 px-4">আইইএলটিএস ব্যান্ড (Estimated Band)</th>
                  <th className="py-3 px-4">দক্ষতার স্তর (Proficiency Level)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bandTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#20395F]">
                      {row.raw}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#087653]">
                      {row.band}
                    </td>
                    <td className="py-3 px-4 text-[#20395F]/80">
                      {row.level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
