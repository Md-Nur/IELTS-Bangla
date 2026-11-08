import { NextResponse } from "next/server";
import { requireAuth, AuthenticationError, DeactivatedAccountError } from "@/lib/auth/guards";
import {
  getExamContent,
  ExamNotFoundError,
  ExamForbiddenError,
  ExamConflictError,
  ExamExpiredError,
} from "@/lib/services/examAttemptService";

export async function GET(
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

    // 3. Retrieve published examination content with ownership and expiration verification
    const examContent = await getExamContent({
      userId: student.id,
      attemptId: attemptId.trim(),
    });

    return NextResponse.json({
      success: true,
      data: examContent,
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

    if (error instanceof ExamNotFoundError) {
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

    if (error instanceof ExamConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    if (error instanceof ExamExpiredError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    console.error("Exam content retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while retrieving exam content", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
