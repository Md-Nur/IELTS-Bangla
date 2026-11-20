import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const instant = false;

const resetPasswordSchema = z.object({
  token: z.string().min(32, "অবৈধ পাসওয়ার্ড রিসেট টোকেন।"),
  password: z.string().min(8, "পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "অবৈধ অনুরোধ।" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড রিসেট লিংকটি পাওয়া যায়নি বা এটি অবৈধ।" },
        { status: 404 }
      );
    }

    if (record.usedAt) {
      return NextResponse.json(
        { error: "এই পাসওয়ার্ড রিসেট লিংকটি ইতিমধ্যে ব্যবহার করা হয়েছে। অনুগ্রহ করে নতুন অনুরোধ করুন।" },
        { status: 400 }
      );
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড রিসেট লিংকের ৩০ মিনিটের মেয়াদ উত্তীর্ণ হয়ে গেছে। অনুগ্রহ করে আবার অনুরোধ পাঠান।" },
        { status: 410 }
      );
    }

    if (!record.user.isActive) {
      return NextResponse.json(
        { error: "আপনার অ্যাকাউন্টটি নিষ্ক্রিয় অবস্থায় রয়েছে। সাপোর্টে যোগাযোগ করুন।" },
        { status: 403 }
      );
    }

    // Hash the new password securely using bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    // Atomically update user password, invalidate this token, and clean any other pending tokens
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: record.userId,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে। অনুগ্রহ করে নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[reset-password] Internal error:", error);
    return NextResponse.json(
      { error: "পাসওয়ার্ড রিসেট সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
