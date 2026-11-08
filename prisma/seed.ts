/**
 * Seed script for IELTS Bangla
 * Populates Mock Test 01 draft structure and publishes Version 1.
 *
 * NOTE: DO NOT EXECUTE AGAINST PRODUCTION/NEON WITHOUT EXPLICIT FOUNDER APPROVAL.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { mock01TestData } from "./seeds/mock01Data";
import { publishDraftTestVersion } from "../lib/services/testPublishing";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for IELTS Bangla...");

  // Check if Mock Test 01 already exists
  const existingTest = await prisma.test.findUnique({
    where: { slug: mock01TestData.slug },
    include: {
      publishedVersions: true,
    },
  });

  if (existingTest) {
    console.log(`Test '${mock01TestData.title}' (${mock01TestData.slug}) already exists with ID: ${existingTest.id}`);
    console.log(`Published versions: ${existingTest.publishedVersions.length}`);
    return;
  }

  console.log(`Creating test '${mock01TestData.title}'...`);

  await prisma.$transaction(async (tx) => {
    // 1. Create root Test
    const test = await tx.test.create({
      data: {
        title: mock01TestData.title,
        slug: mock01TestData.slug,
        module: mock01TestData.module,
        category: mock01TestData.category,
        durationMinutes: mock01TestData.durationMinutes,
        totalQuestions: mock01TestData.totalQuestions,
        status: "ACTIVE",
      },
    });

    console.log(`Created root Test: ${test.id}`);

    // 2. Create draft hierarchy
    for (const sectionData of mock01TestData.sections) {
      const section = await tx.draftSection.create({
        data: {
          testId: test.id,
          orderIndex: sectionData.orderIndex,
          title: sectionData.title,
          passageText: sectionData.passageText,
        },
      });

      console.log(`Created DraftSection ${sectionData.orderIndex}: ${sectionData.title}`);

      for (const groupData of sectionData.groups) {
        const group = await tx.draftQuestionGroup.create({
          data: {
            sectionId: section.id,
            orderIndex: groupData.orderIndex,
            instruction: groupData.instruction,
            questionType: groupData.questionType,
            wordLimit: groupData.wordLimit,
            contextOptions: groupData.contextOptions ? (groupData.contextOptions as Prisma.InputJsonValue) : Prisma.JsonNull,
          },
        });

        for (const qData of groupData.questions) {
          const question = await tx.draftQuestion.create({
            data: {
              questionGroupId: group.id,
              questionNumber: qData.questionNumber,
              prompt: qData.prompt,
              options: qData.options ? (qData.options as Prisma.InputJsonValue) : Prisma.JsonNull,
              explanation: qData.explanation,
            },
          });

          for (let ansIdx = 0; ansIdx < qData.acceptedAnswers.length; ansIdx++) {
            const ansData = qData.acceptedAnswers[ansIdx];
            await tx.draftAcceptedAnswer.create({
              data: {
                questionId: question.id,
                acceptedText: ansData.acceptedText,
                isCaseSensitive: Boolean(ansData.isCaseSensitive),
                orderIndex: ansIdx,
              },
            });
          }
        }
      }
    }

    console.log("Draft hierarchy created. Publishing Version 1 snapshot...");

    // 3. Publish Version 1
    const publishResult = await publishDraftTestVersion(tx, {
      testId: test.id,
      targetVersionNumber: 1,
      bandConversionTable: mock01TestData.bandConversionTable,
    });

    console.log(
      `Successfully published Version 1 (${publishResult.publishedVersionId}): ${publishResult.totalQuestions} questions across ${publishResult.sectionsCount} sections.`
    );
  });

  console.log("Seed process completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed process encountered an error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
