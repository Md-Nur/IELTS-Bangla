import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  getExamResult,
  ExamNotFoundError,
  ExamForbiddenError,
  ExamConflictError,
} from "@/lib/services/examAttemptService";

export async function GET(
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

  // 3. Fetch finalized exam result
  try {
    const result = await getExamResult({
      userId: authUser.id,
      attemptId,
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
    if (error instanceof ExamConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    console.error("Unhandled error retrieving exam result:", error);
    return NextResponse.json(
      { error: "Internal server error retrieving exam result", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
