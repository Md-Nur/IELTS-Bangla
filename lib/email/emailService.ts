import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { renderPasswordResetEmail } from "./templates/passwordResetEmail";

export interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  appUrl: string;
}

let cachedTransporter: Transporter | null = null;

/**
 * Resolves current SMTP configuration from environment variables safely.
 */
export function getEmailConfig(): EmailServiceConfig {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const from = process.env.EMAIL_FROM || (user ? `IELTS Bangla <${user}>` : "IELTS Bangla <noreply@ieltsbangla.com>");
  
  // Resolve production / app base URL without untrusted request headers
  let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ieltsbangla.com";
  // Remove trailing slashes
  appUrl = appUrl.replace(/\/+$/, "");

  return { host, port, secure, user, pass, from, appUrl };
}

/**
 * Returns a configured Nodemailer Transporter instance.
 * Uses IPv4 (family: 4) to ensure resilience against broken IPv6 routing.
 */
export function getTransporter(): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getEmailConfig();

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Enforce IPv4 to avoid network dropouts on dual-stack environments
    family: 4,
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  } as unknown as Parameters<typeof nodemailer.createTransport>[0]);

  return cachedTransporter;
}

/**
 * Verifies SMTP connectivity without exposing any secrets.
 */
export async function verifyEmailConfiguration(): Promise<{ ok: boolean; message?: string }> {
  const config = getEmailConfig();

  if (!config.user || !config.pass) {
    return { ok: false, message: "SMTP credentials are not configured in environment variables." };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { ok: true, message: "SMTP configuration verified successfully." };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown SMTP connection error";
    // Sanitize any potential secrets from the error message
    const sanitized = errMsg.replace(config.pass, "[REDACTED]");
    return { ok: false, message: `SMTP verification failed: ${sanitized}` };
  }
}

export interface SendPasswordResetEmailArgs {
  to: string;
  name?: string | null;
  token: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Dispatches a Bengali branded password reset email via configured Gmail SMTP.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: SendPasswordResetEmailArgs): Promise<SendEmailResult> {
  const config = getEmailConfig();

  if (!config.user || !config.pass) {
    console.error("[EmailService] Cannot send password reset: SMTP_USER or SMTP_PASS missing.");
    return { success: false, error: "ইমেইল সার্ভিস কনফিগারেশন অনুপস্থিত।" };
  }

  const resetUrl = `${config.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const { html, text } = renderPasswordResetEmail({
    name,
    resetUrl,
  });

  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject: "IELTS Bangla - পাসওয়ার্ড রিসেট করুন",
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Failed to deliver email";
    const sanitized = config.pass ? errMsg.replace(config.pass, "[REDACTED]") : errMsg;
    console.error("[EmailService] Password reset delivery error:", sanitized);
    return { success: false, error: "ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
  }
}
