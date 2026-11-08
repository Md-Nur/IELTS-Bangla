import { PrismaClient } from "@prisma/client";
import { evaluateSingleAnswer } from "../lib/scoring/reading";

const prisma = new PrismaClient();

async function main() {
  console.log("=== INDEPENDENT NEON POST-SEED VERIFICATION ===");

  // 1. Database Counts
  const tests = await prisma.test.count();
  const draftSections = await prisma.draftSection.count();
  const draftGroups = await prisma.draftQuestionGroup.count();
  const draftQuestions = await prisma.draftQuestion.count();
  const draftAnswers = await prisma.draftAcceptedAnswer.count();

  const pubVersions = await prisma.publishedTestVersion.count();
  const pubSections = await prisma.publishedSection.count();
  const pubGroups = await prisma.publishedQuestionGroup.count();
  const pubQuestions = await prisma.publishedQuestion.count();
  const pubAnswers = await prisma.publishedAcceptedAnswer.count();

  console.log("\n1. Entity Counts in Neon:");
  console.log({
    tests,
    draftSections,
    draftGroups,
    draftQuestions,
    draftAnswers,
    pubVersions,
    pubSections,
    pubGroups,
    pubQuestions,
    pubAnswers,
  });

  // 2. Published Version 1 Details
  const version = await prisma.publishedTestVersion.findFirst({
    include: {
      test: true,
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          groups: {
            orderBy: { orderIndex: "asc" },
            include: {
              questions: {
                orderBy: { questionNumber: "asc" },
                include: {
                  acceptedAnswers: {
                    orderBy: { orderIndex: "asc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!version) throw new Error("Published version not found!");

  console.log("\n2. Published Version Info:");
  console.log("Version ID:", version.id);
  console.log("Version Number:", version.versionNumber);
  console.log("Test ID:", version.testId);
  console.log("Title:", version.title);
  console.log("Duration Minutes:", version.durationMinutes);
  console.log("Total Questions:", version.totalQuestions);
  console.log("Published At:", version.publishedAt.toISOString());

  // 3. Question Number Continuity
  const allPubQuestions = version.sections
    .flatMap((s) => s.groups)
    .flatMap((g) => g.questions);

  const qNumbers = allPubQuestions.map((q) => q.questionNumber).sort((a, b) => a - b);
  const isContinuous = qNumbers.every((n, i) => n === i + 1);
  console.log("\n3. Question Continuity:");
  console.log("Continuous 1 to 40?", isContinuous);
  console.log("First question:", qNumbers[0], "| Last question:", qNumbers[qNumbers.length - 1]);

  function getPubQ(num: number) {
    const q = allPubQuestions.find((item) => item.questionNumber === num);
    if (!q) throw new Error(`Question ${num} not found`);
    return q;
  }

  console.log("\n4. Specific Question Answer Key Verification:");

  // Q9: air-filled and air filled
  const q9 = getPubQ(9);
  console.log("Q9 Accepted Answers:", q9.acceptedAnswers.map((a) => a.acceptedText));
  const q9ScoringInput = {
    questionId: q9.id,
    questionNumber: 9,
    questionType: "NOTE_COMPLETION",
    wordLimit: 2,
    acceptedAnswers: q9.acceptedAnswers,
  };
  const q9Check1 = evaluateSingleAnswer("air-filled", q9ScoringInput);
  const q9Check2 = evaluateSingleAnswer("air filled", q9ScoringInput);
  console.log("Q9 'air-filled' accepted?", q9Check1.isCorrect);
  console.log("Q9 'air filled' accepted?", q9Check2.isCorrect);

  // Q21: overflows vs overflow
  const q21 = getPubQ(21);
  console.log("Q21 Accepted Answers:", q21.acceptedAnswers.map((a) => a.acceptedText));
  const q21ScoringInput = {
    questionId: q21.id,
    questionNumber: 21,
    questionType: "SENTENCE_COMPLETION",
    wordLimit: 2,
    acceptedAnswers: q21.acceptedAnswers,
  };
  const q21Check1 = evaluateSingleAnswer("overflows", q21ScoringInput);
  const q21Check2 = evaluateSingleAnswer("overflow", q21ScoringInput);
  console.log("Q21 'overflows' accepted?", q21Check1.isCorrect);
  console.log("Q21 'overflow' rejected?", !q21Check2.isCorrect);

  // Q22: islands vs isolated islands
  const q22 = getPubQ(22);
  console.log("Q22 Accepted Answers:", q22.acceptedAnswers.map((a) => a.acceptedText));
  const q22ScoringInput = {
    questionId: q22.id,
    questionNumber: 22,
    questionType: "SENTENCE_COMPLETION",
    wordLimit: 2,
    acceptedAnswers: q22.acceptedAnswers,
  };
  const q22Check1 = evaluateSingleAnswer("islands", q22ScoringInput);
  const q22Check2 = evaluateSingleAnswer("isolated islands", q22ScoringInput);
  console.log("Q22 'islands' accepted?", q22Check1.isCorrect);
  console.log("Q22 'isolated islands' rejected?", !q22Check2.isCorrect);

  // Q37-Q40: Letters only
  for (const qNum of [37, 38, 39, 40]) {
    const q = getPubQ(qNum);
    console.log(`Q${qNum} Accepted Answers:`, q.acceptedAnswers.map((a) => a.acceptedText));
  }

  const q37 = getPubQ(37);
  const q37Input = {
    questionId: q37.id,
    questionNumber: 37,
    questionType: "SUMMARY_COMPLETION",
    acceptedAnswers: q37.acceptedAnswers,
  };
  console.log("Q37 'A' accepted?", evaluateSingleAnswer("A", q37Input).isCorrect);
  console.log("Q37 'a' accepted?", evaluateSingleAnswer("a", q37Input).isCorrect);
  console.log("Q37 'predator' rejected?", !evaluateSingleAnswer("predator", q37Input).isCorrect);
  console.log("Q37 'A predator' rejected?", !evaluateSingleAnswer("A predator", q37Input).isCorrect);

  const q38 = getPubQ(38);
  const q38Input = {
    questionId: q38.id,
    questionNumber: 38,
    questionType: "SUMMARY_COMPLETION",
    acceptedAnswers: q38.acceptedAnswers,
  };
  console.log("Q38 'C' accepted?", evaluateSingleAnswer("C", q38Input).isCorrect);
  console.log("Q38 'triggers' rejected?", !evaluateSingleAnswer("triggers", q38Input).isCorrect);

  const q39 = getPubQ(39);
  const q39Input = {
    questionId: q39.id,
    questionNumber: 39,
    questionType: "SUMMARY_COMPLETION",
    acceptedAnswers: q39.acceptedAnswers,
  };
  console.log("Q39 'D' accepted?", evaluateSingleAnswer("D", q39Input).isCorrect);
  console.log("Q39 'skill' rejected?", !evaluateSingleAnswer("skill", q39Input).isCorrect);

  const q40 = getPubQ(40);
  const q40Input = {
    questionId: q40.id,
    questionNumber: 40,
    questionType: "SUMMARY_COMPLETION",
    acceptedAnswers: q40.acceptedAnswers,
  };
  console.log("Q40 'E' accepted?", evaluateSingleAnswer("E", q40Input).isCorrect);
  console.log("Q40 'unproductive' rejected?", !evaluateSingleAnswer("unproductive", q40Input).isCorrect);

  // 5. Immutability Verification (Triggers)
  console.log("\n5. Immutability Test on Neon:");
  try {
    await prisma.publishedQuestion.update({
      where: { id: q9.id },
      data: { prompt: "Illegal modification" },
    });
    console.error("FAIL: Published question update should have thrown error!");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("PASS: Update blocked by trigger:", msg.includes("Immutable snapshot violation"));
  }

  try {
    await prisma.publishedQuestion.delete({
      where: { id: q9.id },
    });
    console.error("FAIL: Published question delete should have thrown error!");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("PASS: Delete blocked by trigger:", msg.includes("Immutable snapshot violation"));
  }

  console.log("\n=== POST-SEED AUDIT COMPLETED SUCCESSFULLY ===");
}

main().finally(() => prisma.$disconnect());
