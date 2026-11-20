import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import * as emailService from "@/lib/email/emailService";
import { POST as forgotPasswordHandler } from "@/app/api/auth/forgot-password/route";
import { GET as verifyTokenHandler } from "@/app/api/auth/verify-reset-token/route";
import { POST as resetPasswordHandler } from "@/app/api/auth/reset-password/route";

describe("Password Recovery & Reset System (Gmail SMTP & Security)", () => {
  const testEmail = "reset.candidate@ieltsbangla.com";
  let userId: string;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Clean up test user and tokens
    const existing = await prisma.user.findUnique({ where: { email: testEmail } });
    if (existing) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }

    // Create fresh test user with known password
    const passwordHash = await bcrypt.hash("OldPassword123!", 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Reset Candidate",
        passwordHash,
        isActive: true,
      },
    });
    userId = user.id;

    // Spy on email sending to avoid sending live test emails in automated tests
    vi.spyOn(emailService, "sendPasswordResetEmail").mockResolvedValue({
      success: true,
      messageId: "mock-message-id",
    });
  });

  it("1. Generates single-use hashed reset token and generic success response", async () => {
    const req = new Request("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });

    const res = await forgotPasswordHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে");

    // Verify token was stored as SHA-256 hash in DB, never plaintext
    const tokens = await prisma.passwordResetToken.findMany({
      where: { userId },
    });
    expect(tokens.length).toBe(1);
    expect(tokens[0].tokenHash).toHaveLength(64); // SHA-256 hex string
    expect(tokens[0].usedAt).toBeNull();
    expect(tokens[0].expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Verify emailService was invoked
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
  });

  it("2. Returns generic success for non-existent email without leaking account existence", async () => {
    const req = new Request("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent.user.404@example.com" }),
    });

    const res = await forgotPasswordHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে");
    // Email should not be sent for non-existent user
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("3. Verifies token validity and handles invalid, used, or expired tokens", async () => {
    // Generate test token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    // Valid token check
    const validReq = new NextRequest(`http://localhost:3000/api/auth/verify-reset-token?token=${rawToken}`);
    const validRes = await verifyTokenHandler(validReq);
    const validData = await validRes.json();
    expect(validRes.status).toBe(200);
    expect(validData.valid).toBe(true);
    expect(validData.email).toBe(testEmail);

    // Non-existent token check
    const invalidReq = new NextRequest(`http://localhost:3000/api/auth/verify-reset-token?token=${crypto.randomBytes(32).toString("hex")}`);
    const invalidRes = await verifyTokenHandler(invalidReq);
    expect(invalidRes.status).toBe(404);

    // Expired token check
    const expiredRaw = crypto.randomBytes(32).toString("hex");
    const expiredHash = crypto.createHash("sha256").update(expiredRaw).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: expiredHash,
        expiresAt: new Date(Date.now() - 5000), // Expired 5 seconds ago
      },
    });

    const expiredReq = new NextRequest(`http://localhost:3000/api/auth/verify-reset-token?token=${expiredRaw}`);
    const expiredRes = await verifyTokenHandler(expiredReq);
    expect(expiredRes.status).toBe(410);
  });

  it("4. Resets password successfully, hashes new password with bcrypt, and prevents token reuse", async () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const newPassword = "NewSecurePassword2026!";

    // Reset password request
    const resetReq = new Request("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: rawToken,
        password: newPassword,
      }),
    });

    const resetRes = await resetPasswordHandler(resetReq);
    const resetData = await resetRes.json();

    expect(resetRes.status).toBe(200);
    expect(resetData.success).toBe(true);

    // Verify user password in DB has changed
    const updatedUser = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(await bcrypt.compare(newPassword, updatedUser.passwordHash!)).toBe(true);
    expect(await bcrypt.compare("OldPassword123!", updatedUser.passwordHash!)).toBe(false);

    // Verify token is now marked as used
    const tokenInDb = await prisma.passwordResetToken.findUniqueOrThrow({ where: { tokenHash } });
    expect(tokenInDb.usedAt).not.toBeNull();

    // Verify token reuse is strictly rejected
    const reuseReq = new Request("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: rawToken,
        password: "AnotherNewPassword999!",
      }),
    });

    const reuseRes = await resetPasswordHandler(reuseReq);
    expect(reuseRes.status).toBe(400);
    const reuseData = await reuseRes.json();
    expect(reuseData.error).toContain("ইতিমধ্যে ব্যবহার করা হয়েছে");
  });

  it("5. Rejects passwords shorter than 8 characters", async () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const shortReq = new Request("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: rawToken,
        password: "short",
      }),
    });

    const shortRes = await resetPasswordHandler(shortReq);
    expect(shortRes.status).toBe(400);
    const shortData = await shortRes.json();
    expect(shortData.error).toContain("৮ অক্ষরের");
  });
});
