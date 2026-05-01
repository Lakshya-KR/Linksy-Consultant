import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
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
    console.warn("[email] not configured — skipping send");
    return { skipped: true };
  }
  await tx.sendMail({
    from: `"Linksy" <${process.env.GMAIL_USER}>`,
    to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return { sent: true };
}
