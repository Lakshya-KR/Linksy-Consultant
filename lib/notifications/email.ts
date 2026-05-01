import nodemailer from "nodemailer";

interface SendOpts {
  subject: string;
  html: string;
  text?: string;
}

function makeTransport(port: number, secure: boolean) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!.replace(/\s+/g, ""),
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
}

export async function sendAdminEmail(opts: SendOpts) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.ADMIN_EMAIL || user;

  if (!user || !pass || !to) {
    console.warn("[email] missing env — skipping send", {
      hasUser: !!user,
      hasPass: !!pass,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
    });
    return { skipped: true, reason: "missing-env" };
  }

  // Try 465 (SSL) first, fall back to 587 (STARTTLS) if Vercel/host blocks 465.
  const ports: Array<{ port: number; secure: boolean }> = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  let lastError: unknown = null;
  for (const { port, secure } of ports) {
    try {
      const tx = makeTransport(port, secure);
      const info = await tx.sendMail({
        from: `"Linksy" <${user}>`,
        to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      });
      console.log(`[email] sent ✓ port=${port} messageId=${info.messageId}`);
      return { sent: true, port, messageId: info.messageId };
    } catch (e) {
      lastError = e;
      console.warn(`[email] port=${port} failed: ${(e as Error).message ?? e}`);
    }
  }

  console.error("[email] all SMTP attempts failed", lastError);
  return { error: String((lastError as Error)?.message ?? lastError) };
}

export async function verifyEmailConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return { ok: false, reason: "missing-env" };
  for (const { port, secure } of [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ]) {
    try {
      await makeTransport(port, secure).verify();
      return { ok: true, port };
    } catch (e) {
      console.warn(`[email] verify port=${port} failed:`, (e as Error).message ?? e);
    }
  }
  return { ok: false, reason: "all SMTP ports failed" };
}
