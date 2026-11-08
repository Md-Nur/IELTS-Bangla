import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  finalizeAndScoreAttempt,
  ExamNotFoundError,
  ExamForbiddenError,
  ExamConflictError,
  ExamDeadlineNotPassedError,
} from "@/lib/services/examAttemptService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  // 1. Authenticate student
  const authUser = await getCurrentUser(request);
  if (!authUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // 2. Validate route parameter
  const { attemptId } = await params;
  if (!attemptId || typeof attemptId !== "string" || attemptId.length > 100) {
    return NextResponse.json(
      { error: "Invalid attempt identifier", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // 3. Parse optional body
  let reason: "MANUAL" | "TIMEOUT" = "MANUAL";
  try {
    const bodyText = await request.text();
    if (bodyText) {
      const body = JSON.parse(bodyText);
      if (body.reason === "TIMEOUT") {
        reason = "TIMEOUT";
      } else if (body.reason === "MANUAL") {
        reason = "MANUAL";
      }
    }
  } catch {
    // Body is optional; default is MANUAL
  }

  // 4. Finalize and score attempt inside atomic transaction
  try {
    const result = await finalizeAndScoreAttempt({
      userId: authUser.id,
      attemptId,
      reason,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
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
    if (error instanceof ExamDeadlineNotPassedError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }
    if (error instanceof ExamConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    console.error("Unhandled error during exam finalization:", error);
    return NextResponse.json(
      { error: "Internal server error during finalization", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
