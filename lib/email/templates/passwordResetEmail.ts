export interface PasswordResetEmailParams {
  name?: string | null;
  resetUrl: string;
  supportEmail?: string;
}

export function renderPasswordResetEmail({
  name,
  resetUrl,
  supportEmail = "support@ieltsbangla.com",
}: PasswordResetEmailParams): { html: string; text: string } {
  const greeting = name ? `প্রিয় ${name},` : "প্রিয় শিক্ষার্থী,";

  const text = `${greeting}

আপনার IELTS Bangla অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ পাওয়া গেছে।

নতুন পাসওয়ার্ড সেট করতে নিচের লিংকে ক্লিক করুন:
${resetUrl}

এই লিংকটি ৩০ মিনিট পর্যন্ত কার্যকর থাকবে।

আপনি যদি এই অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট নিরাপদ থাকবে।

যে কোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন: ${supportEmail}

ধন্যবাদ,
IELTS Bangla টিম
https://ieltsbangla.com`;

  const html = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IELTS Bangla - পাসওয়ার্ড রিসেট করুন</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f8f9; font-family: 'Hind Siliguri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #20395f; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f8f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(32, 57, 95, 0.12); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #087653 0%, #044a34 100%); padding: 32px 24px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="background-color: #ffffff; padding: 8px 16px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                    <span style="font-size: 20px; font-weight: 800; color: #20395f; letter-spacing: -0.5px;">
                      IELTS <span style="color: #087653;">বাংলা</span>
                    </span>
                  </td>
                </tr>
              </table>
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 16px 0 0 0; letter-spacing: -0.3px;">
                পাসওয়ার্ড রিসেট অনুরোধ
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px; font-size: 15px; line-height: 1.7; color: #20395f;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #20395f;">
                ${greeting}
              </p>
              <p style="margin: 0 0 16px 0; color: #20395f;">
                আপনার IELTS Bangla অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ পাওয়া গেছে।
              </p>
              <p style="margin: 0 0 28px 0; color: #20395f;">
                নতুন পাসওয়ার্ড সেট করতে নিচের বাটনে ক্লিক করুন:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 32px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #087653;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; background-color: #087653; box-shadow: 0 4px 12px rgba(8, 118, 83, 0.3);">
                      পাসওয়ার্ড রিসেট করুন
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: #e7f5ef; border-left: 4px solid #087653; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; font-weight: 600; color: #087653;">
                  ⏱️ এই লিংকটি ৩০ মিনিট পর্যন্ত কার্যকর থাকবে।
                </p>
              </div>

              <!-- Fallback Link -->
              <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(32, 57, 95, 0.75);">
                বাটনটি কাজ না করলে নিচের লিংকটি কপি করে আপনার ব্রাউজারে পেস্ট করুন:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 11px; word-break: break-all; color: #087653; background-color: #f8f8f9; padding: 10px 12px; border-radius: 6px; border: 1px solid rgba(32, 57, 95, 0.1);">
                <a href="${resetUrl}" target="_blank" style="color: #087653; text-decoration: underline;">${resetUrl}</a>
              </p>

              <!-- Disclaimer -->
              <div style="border-top: 1px solid rgba(32, 57, 95, 0.1); padding-top: 20px; font-size: 13px; color: rgba(32, 57, 95, 0.75); line-height: 1.6;">
                <p style="margin: 0 0 8px 0;">
                  🔒 <strong>নিরাপত্তা বার্তা:</strong> আপনি যদি এই অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট সম্পূর্ণ নিরাপদ থাকবে এবং কোনো পরিবর্তন করা হবে না।
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f3; padding: 24px 32px; text-align: center; font-size: 12px; color: rgba(32, 57, 95, 0.65); border-top: 1px solid rgba(32, 57, 95, 0.08);">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #20395f;">
                IELTS বাংলা — বাংলাদেশের শিক্ষার্থীদের জন্য আধুনিক ও বিশ্বস্ত IELTS প্রস্তুতি
              </p>
              <p style="margin: 0 0 4px 0;">
                সাহায্যের প্রয়োজন? <a href="mailto:${supportEmail}" style="color: #087653; text-decoration: underline;">${supportEmail}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(32, 57, 95, 0.5);">
                © 2026 IELTS বাংলা · সর্বস্বত্ব সংরক্ষিত।
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}
