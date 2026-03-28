import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com";

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
        <h2 style="color: #1a1a1a;">Reset Your Password</h2>
        <p style="color: #555; line-height: 1.6;">
          You requested a password reset. Click the button below to set a new password.
          This link expires in 1 hour.
        </p>
        <a
          href="${resetUrl}"
          style="display: inline-block; padding: 12px 24px; background: #2962ff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0;"
        >
          Reset Password
        </a>
        <p style="color: #999; font-size: 0.85rem;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
}

