import { redirect } from "next/navigation";
import Link from "next/link";
import { AttemptStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { StartExamButton } from "@/components/dashboard/StartExamButton";

export const instant = false;

export const metadata = {
  title: "স্টুডেন্ট ড্যাশবোর্ড | IELTS বাংলা",
  description: "আপনার IELTS পরীক্ষার প্রস্তুতি, মক টেস্ট এবং ফলাফল পর্যালোচনার কেন্দ্রীয় ড্যাশবোর্ড।",
};

export default async function DashboardPage() {
  const user = await getCurrentServerUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  // 1. Fetch available active tests
  const availableTests = await prisma.test.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });

  // 2. Fetch active in-progress attempt for this student
  const inProgressAttempt = await prisma.testAttempt.findFirst({
    where: {
      userId: user.id,
      status: AttemptStatus.IN_PROGRESS,
      expiresAt: { gt: new Date() },
    },
    include: {
      test: true,
    },
    orderBy: { startedAt: "desc" },
  });

  // 3. Fetch student's completed/timed out historical attempts
  const pastAttempts = await prisma.testAttempt.findMany({
    where: {
      userId: user.id,
      status: {
        in: [AttemptStatus.SUBMITTED, AttemptStatus.TIMED_OUT],
      },
    },
    include: {
      test: true,
      evaluation: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  // Performance calculations from actual database records
  const totalCompleted = pastAttempts.length;
  const bands = pastAttempts
    .map((a) => a.estimatedBand)
    .filter((b): b is number => b !== null && b !== undefined);

  const bestBand = bands.length > 0 ? Math.max(...bands).toFixed(1) : null;
  const avgBand =
    bands.length > 0
      ? (bands.reduce((acc, curr) => acc + curr, 0) / bands.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F]">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#20395F]/15 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E7F5EF] text-[#087653]">
              <span>স্টুডেন্ট ড্যাশবোর্ড</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20395F] tracking-tight">
              স্বাগতম, {user.name || "শিক্ষার্থী"}!
            </h1>
            <p className="text-xs sm:text-sm text-[#20395F]/75">
              ইমেইল: <span className="font-medium text-[#20395F]">{user.email}</span> · প্রস্তুতি চালিয়ে যান এবং নিজের বাস্তব ব্যান্ড যাচাই করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#20395F] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              টেস্ট নির্দেশিকা দেখুন
            </Link>
          </div>
        </div>

        {/* Active In-Progress Attempt Banner */}
        {inProgressAttempt && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 animate-pulse-subtle">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  চলমান পরীক্ষা (In-Progress Exam)
                </span>
                <h3 className="text-lg font-bold text-amber-950">
                  {inProgressAttempt.test.title}
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  আপনার এই পরীক্ষাটির সময় এখনও বাকি আছে। পরীক্ষাটি সম্পূর্ণ করতে নিচের বাটনে ক্লিক করুন।
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={`/exam/${inProgressAttempt.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#D93A45] hover:bg-[#b82e38] shadow-sm transition-all"
              >
                <span>পরীক্ষা চালিয়ে যান (Resume)</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#20395F]/15 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-[#20395F]/70">সম্পূর্ণ পরীক্ষা</span>
            <div className="text-2xl sm:text-3xl font-black text-[#20395F]">
              {totalCompleted}
            </div>
            <span className="text-[11px] text-[#20395F]/60">মক টেস্ট সমাপ্ত</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#20395F]/15 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-[#087653]">সর্বোচ্চ ব্যান্ড (Best)</span>
            <div className="text-2xl sm:text-3xl font-black text-[#087653]">
              {bestBand ? `Band ${bestBand}` : "—"}
            </div>
            <span className="text-[11px] text-[#20395F]/60">
              {bestBand ? "সর্বোচ্চ প্রাপ্ত ফলাফল" : "এখনও কোনো টেস্ট দেননি"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#20395F]/15 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-[#20395F]/70">গড় ব্যান্ড (Average)</span>
            <div className="text-2xl sm:text-3xl font-black text-[#20395F]">
              {avgBand ? `Band ${avgBand}` : "—"}
            </div>
            <span className="text-[11px] text-[#20395F]/60">
              {avgBand ? "সকল টেস্টের গড় স্কোর" : "পরবর্তী টেস্টের অপেক্ষায়"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#20395F]/15 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-[#20395F]/70">সক্রিয় মডিউল</span>
            <div className="text-2xl sm:text-3xl font-black text-[#20395F]">
              Reading
            </div>
            <span className="text-[11px] text-[#087653] font-semibold">
              Academic Phase 1
            </span>
          </div>
        </div>

        {/* Available IELTS Modules Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#20395F]">
              IELTS মডিউলসমূহ
            </h2>
            <span className="text-xs text-[#20395F]/60">
              ৪টি স্কিল বিভাগ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border-2 border-[#087653] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#087653]">Reading</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F5EF] text-[#087653]">
                  সক্রিয় (Active)
                </span>
              </div>
              <p className="text-xs text-[#20395F]/80">
                ৩টি প্যাসেজ, ৪০টি প্রশ্ন এবং বাস্তবসম্মত ইন্টারফেস।
              </p>
              <div className="text-[11px] font-semibold text-[#087653]">
                {availableTests.length}টি মক টেস্ট প্রস্তুত
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#20395F]/10 space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Listening</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  শীঘ্রই আসছে
                </span>
              </div>
              <p className="text-xs text-[#20395F]/70">
                ৪টি অডিও সেকশন এবং আন্তর্জাতিক অ্যাকসেন্ট।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#20395F]/10 space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Writing</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  শীঘ্রই আসছে
                </span>
              </div>
              <p className="text-xs text-[#20395F]/70">
                Task 1 ও Task 2 রচনা এবং ব্যান্ড ক্রাইটেরিয়া।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#20395F]/10 space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Speaking</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  শীঘ্রই আসছে
                </span>
              </div>
              <p className="text-xs text-[#20395F]/70">
                Part 1-3 ইন্টারভিউ রেকর্ডিং ও মূল্যায়ন।
              </p>
            </div>
          </div>
        </div>

        {/* Available Mock Tests Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#20395F]">
                উপলব্ধ মক টেস্ট (Available Tests)
              </h2>
              <p className="text-xs text-[#20395F]/70">
                কম্পিউটার-ডেলিভার্ড বাস্তব পরীক্ষার অভিজ্ঞতা নিতে টেস্ট নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTests.map((t) => {
              const isCurrentAttempt = inProgressAttempt?.testId === t.id;

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-[#20395F]/15 p-6 shadow-sm space-y-5 hover:border-[#087653]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E7F5EF] text-[#087653] uppercase tracking-wide mb-1">
                        {t.category} · {t.module}
                      </span>
                      <h3 className="text-lg font-bold text-[#20395F]">
                        {t.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#087653] block">
                        ফ্রি (Free)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Version 1.0
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F8F8F9] border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">সময়সীমা</span>
                      <span className="font-bold text-[#20395F]">{t.durationMinutes} মিনিট</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8F8F9] border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">প্রশ্নসংখ্যা</span>
                      <span className="font-bold text-[#20395F]">{t.totalQuestions} টি</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8F8F9] border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">প্যাসেজ</span>
                      <span className="font-bold text-[#20395F]">৩টি প্যাসেজ</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#20395F]/75 leading-relaxed">
                    প্যাসেজ ১: The Bicycle · প্যাসেজ ২: Green Roofs · প্যাসেজ ৩: The Myth of Multitasking. True/False/Not Given, Matching Headings, Summary & Sentence Completion প্রশ্ন সমন্বিত।
                  </p>

                  <div className="pt-2">
                    <StartExamButton
                      testSlug={t.slug}
                      hasActiveAttempt={isCurrentAttempt}
                      activeAttemptId={isCurrentAttempt ? inProgressAttempt?.id : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Attempts & Score History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#20395F]">
                পূর্ববর্তী পরীক্ষার ফলাফল (Test History)
              </h2>
              <p className="text-xs text-[#20395F]/70">
                আপনার দেওয়া মক টেস্টের ইতিহাস ও ফলাফল বিশ্লেষণ
              </p>
            </div>
          </div>

          {pastAttempts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#20395F]/20 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E7F5EF] text-[#087653] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#20395F]">
                এখনও কোনো মক টেস্ট সম্পন্ন করেননি
              </h3>
              <p className="text-xs sm:text-sm text-[#20395F]/70 max-w-md mx-auto">
                উপরের উপলব্ধ মক টেস্ট থেকে &ldquo;মক টেস্ট শুরু করুন&rdquo; বাটনে ক্লিক করে পরীক্ষা দিন। পরীক্ষা শেষ হলেই আপনার স্কোর ও উত্তর বিশ্লেষণ এখানে যুক্ত হবে।
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#20395F]/15 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F8F9] text-[#20395F] font-bold border-b border-[#20395F]/10">
                    <tr>
                      <th className="py-3.5 px-4">টেস্টের নাম</th>
                      <th className="py-3.5 px-4">তারিখ</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 text-center">স্কোর (Raw)</th>
                      <th className="py-3.5 px-4 text-center">ব্যান্ড স্কোর</th>
                      <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#20395F]">
                    {pastAttempts.map((att) => {
                      const isTimedOut = att.status === AttemptStatus.TIMED_OUT;
                      const formattedDate = att.submittedAt
                        ? new Date(att.submittedAt).toLocaleDateString("bn-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-sm text-[#20395F]">
                            {att.test.title}
                          </td>
                          <td className="py-4 px-4 text-[#20395F]/75">
                            {formattedDate}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isTimedOut
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-[#E7F5EF] text-[#087653]"
                              }`}
                            >
                              {isTimedOut ? "সময় সমাপ্ত (Timed Out)" : "সম্পন্ন (Submitted)"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold">
                            {att.rawScore !== null ? `${att.rawScore} / 40` : "—"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {att.estimatedBand !== null ? (
                              <span className="font-extrabold text-[#087653] text-sm">
                                Band {att.estimatedBand.toFixed(1)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link
                              href={`/results/${att.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#087653] bg-[#E7F5EF] hover:bg-[#d8efe5] transition-colors"
                            >
                              <span>রিভিউ দেখুন</span>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
