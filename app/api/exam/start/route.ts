import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, AuthenticationError, DeactivatedAccountError } from "@/lib/auth/guards";
import {
  startExamAttempt,
  ExamNotFoundError,
  UnpublishedTestError,
  ExamForbiddenError,
} from "@/lib/services/examAttemptService";

const startExamSchema = z
  .object({
    testSlug: z.string().trim().min(1).optional(),
    testId: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.testSlug || data.testId, {
    message: "Either testSlug or testId must be provided",
    path: ["testSlug"],
  });

export async function POST(request: Request) {
  try {
    // 1. Authenticate student
    const student = await requireAuth(request);

    // 2. Parse and validate request body
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const validation = startExamSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { testSlug, testId } = validation.data;

    // 3. Start or resume attempt using authoritative database time and single active constraint
    const attemptResult = await startExamAttempt({
      userId: student.id,
      testSlug,
      testId,
    });

    // 200 OK for resumed attempt, 201 Created for freshly initialized attempt
    const statusCode = attemptResult.isResumed ? 200 : 201;

    return NextResponse.json(
      {
        success: true,
        data: attemptResult,
      },
      { status: statusCode }
    );
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message, code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (error instanceof DeactivatedAccountError) {
      return NextResponse.json(
        { error: error.message, code: "ACCOUNT_DEACTIVATED" },
        { status: 403 }
      );
    }

    if (error instanceof ExamNotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }

    if (error instanceof UnpublishedTestError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }

    if (error instanceof ExamForbiddenError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    console.error("Exam start error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while starting exam", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
