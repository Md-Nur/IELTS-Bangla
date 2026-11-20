import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const instant = false;

export async function GET(request: NextRequest | Request) {
  try {
    const searchParams = "nextUrl" in request ? request.nextUrl.searchParams : new URL(request.url).searchParams;
    const token = searchParams.get("token");

    if (!token || typeof token !== "string" || token.length < 32) {
      return NextResponse.json(
        { valid: false, error: "অবৈধ বা অনুপস্থিত রিসেট টোকেন।" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { valid: false, error: "পাসওয়ার্ড রিসেট লিংকটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (record.usedAt) {
      return NextResponse.json(
        { valid: false, error: "এই পাসওয়ার্ড রিসেট লিংকটি ইতিমধ্যে ব্যবহার করা হয়েছে।" },
        { status: 400 }
      );
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json(
        { valid: false, error: "পাসওয়ার্ড রিসেট লিংকের ৩০ মিনিটের মেয়াদ শেষ হয়ে গেছে।" },
        { status: 410 }
      );
    }

    if (!record.user.isActive) {
      return NextResponse.json(
        { valid: false, error: "অ্যাকাউন্টটি নিষ্ক্রিয় অবস্থায় রয়েছে।" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        email: record.user.email,
        name: record.user.name,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      (error as { digest?: string }).digest === "NEXT_PRERENDER_INTERRUPTED"
    ) {
      throw error;
    }
    console.error("[verify-reset-token] Internal error:", error);
    return NextResponse.json(
      { valid: false, error: "টোকেন যাচাই করার সময় ত্রুটি ঘটেছে।" },
      { status: 500 }
    );
  }
}
