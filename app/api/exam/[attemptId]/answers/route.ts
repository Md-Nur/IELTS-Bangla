import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, AuthenticationError, DeactivatedAccountError } from "@/lib/auth/guards";
import {
  saveStudentAnswer,
  ExamNotFoundError,
  ExamForbiddenError,
  ExamConflictError,
  ExamExpiredError,
  ExamQuestionMismatchError,
} from "@/lib/services/examAttemptService";

const saveAnswerSchema = z.object({
  questionId: z.string().trim().min(1, "questionId is required").max(100),
  answerText: z
    .string()
    .max(500, "Answer text must not exceed 500 characters")
    .nullable()
    .optional()
    .transform((val) => (val === undefined || val === null ? null : val.trim())),
  isFlaggedForReview: z.boolean().optional().default(false),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    // 1. Authenticate student
    const student = await requireAuth(request);

    // 2. Resolve asynchronous Next.js 16 route parameters
    const { attemptId } = await params;
    if (!attemptId || typeof attemptId !== "string" || attemptId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing attemptId parameter", code: "INVALID_PARAM" },
        { status: 400 }
      );
    }

    // 3. Parse and validate request body
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const validation = saveAnswerSchema.safeParse(rawBody);
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

    const { questionId, answerText, isFlaggedForReview } = validation.data;

    // 4. Execute atomic, row-locked autosave upsert
    const savedResult = await saveStudentAnswer({
      userId: student.id,
      attemptId: attemptId.trim(),
      questionId,
      answerText,
      isFlaggedForReview,
    });

    return NextResponse.json({
      success: true,
      data: savedResult,
    });
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

    if (error instanceof ExamForbiddenError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    if (error instanceof ExamExpiredError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    if (error instanceof ExamNotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }

    if (error instanceof ExamConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    if (error instanceof ExamQuestionMismatchError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    console.error("Autosave endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while saving answer", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
