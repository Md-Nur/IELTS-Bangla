import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { findUserByEmailSafe } from "@/lib/db/ensureSchema";
import { sendPasswordResetEmail } from "@/lib/email/emailService";

export const instant = false;

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।"),
});

// Simple in-memory rate limiting map (IP/Email -> timestamp)
const requestRateLimit = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "অবৈধ অনুরোধ।" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    // Check rate limit: minimum 30 seconds between requests per email
    const now = Date.now();
    const lastRequest = requestRateLimit.get(email);
    if (lastRequest && now - lastRequest < 30 * 1000) {
      // Return generic success to avoid revealing rate limiting or account existence
      return NextResponse.json(
        {
          success: true,
          message:
            "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স চেক করুন।",
        },
        { status: 200 }
      );
    }
    requestRateLimit.set(email, now);

    // Clean up rate limit map if oversized
    if (requestRateLimit.size > 10000) {
      requestRateLimit.clear();
    }

    const user = await findUserByEmailSafe(email);

    if (user && user.isActive) {
      // 1. Invalidate any existing unused tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      // 2. Generate a cryptographically secure random token (64 hex characters)
      const rawToken = crypto.randomBytes(32).toString("hex");

      // 3. Store only the SHA-256 hash in the database
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes validity

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      // 4. Send email via centralized Gmail SMTP service
      // Delivery errors are logged internally and do not expose server secrets
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        token: rawToken,
      });
    } else {
      // Add a small artificial delay to avoid timing attacks
      await new Promise((r) => setTimeout(r, 200));
    }

    // Always return generic success message to prevent user enumeration
    return NextResponse.json(
      {
        success: true,
        message:
          "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স ও স্প্যাম ফোল্ডার চেক করুন।",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[forgot-password] Internal error:", error);
    return NextResponse.json(
      { error: "অনুরোধটি সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
