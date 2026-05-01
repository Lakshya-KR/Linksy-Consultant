import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD missing — cannot send");
    return null;
  }
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      // App passwords often have spaces when copied from Google. Strip them.
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, ""),
    },
  });
  return transporter;
}

export async function sendAdminEmail(opts: {
  subject: string;
  html: string;
  text?: string;
}) {
  const tx = getTransporter();
  const to = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
  if (!tx || !to) {
    console.warn("[email] not configured — skipping send", {
      hasUser: !!process.env.GMAIL_USER,
      hasPass: !!process.env.GMAIL_APP_PASSWORD,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
    });
    return { skipped: true, reason: "missing-env" };
  }
  try {
    const info = await tx.sendMail({
      from: `"Linksy" <${process.env.GMAIL_USER}>`,
      to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    console.log(`[email] sent ✓ messageId=${info.messageId} accepted=${JSON.stringify(info.accepted)} rejected=${JSON.stringify(info.rejected)}`);
    return { sent: true, messageId: info.messageId };
  } catch (e) {
    console.error("[email] send failed", e);
    return { error: String(e) };
  }
}

/** Verify SMTP credentials work — used by the diagnostic endpoint. */
export async function verifyEmailConfig() {
  const tx = getTransporter();
  if (!tx) return { ok: false, reason: "missing-env" };
  try {
    await tx.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}
