import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * GET /api/test-email
 *
 * Public-safe diagnostic. Cannot be abused for spam: it only ever sends to
 * the ADMIN_EMAIL configured in env. Reports every layer of failure so you
 * can pinpoint exactly where things break in production.
 */
export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const to = process.env.ADMIN_EMAIL || user;

  // Layer 1 — env vars present?
  const env = {
    GMAIL_USER: user ? `✓ "${user}"` : "✗ MISSING",
    GMAIL_APP_PASSWORD: pass ? `✓ length=${pass.length} (expected 16)` : "✗ MISSING",
    ADMIN_EMAIL: to ? `✓ "${to}"` : "✗ MISSING",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "(unset, falls back to VERCEL_URL)",
    VERCEL_URL: process.env.VERCEL_URL || "(not on Vercel)",
    VERCEL_ENV: process.env.VERCEL_ENV || "(not on Vercel)",
  };

  if (!user || !pass || !to) {
    return NextResponse.json(
      { stage: "env", env, error: "missing required env vars on Vercel" },
      { status: 500 }
    );
  }

  // Try BOTH ports. If 465 (SSL) is blocked from Vercel egress, 587 (STARTTLS)
  // often still works. Whichever succeeds, we report it.
  const attempts: Array<{ port: number; secure: boolean }> = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  const log: Record<string, unknown>[] = [];

  for (const { port, secure } of attempts) {
    const tx = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port,
      secure,
      auth: { user, pass },
      // Generous timeouts — Vercel cold start + Gmail handshake can be slow
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });

    // 2 — verify SMTP creds
    try {
      await tx.verify();
    } catch (e) {
      log.push({
        port,
        secure,
        stage: "verify",
        ok: false,
        error: String((e as Error).message ?? e),
      });
      continue;
    }

    // 3 — actually send
    try {
      const info = await tx.sendMail({
        from: `"Linksy" <${user}>`,
        to,
        subject: "Linksy SMTP test ✓",
        text: `If you can read this, SMTP is working from your deployment on port ${port}.`,
        html: `<div style="font-family:system-ui;padding:24px;background:#0a0a0a;color:#fafafa;border-radius:12px;">
          <h2 style="margin:0 0 8px;">Linksy SMTP test ✓</h2>
          <p>Your production deployment can send mail (port ${port}).</p>
          <p style="font-size:12px;color:#888;">${new Date().toISOString()}</p>
        </div>`,
      });
      log.push({
        port,
        secure,
        stage: "send",
        ok: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
      return NextResponse.json({
        stage: "done",
        env,
        attempts: log,
        result: "sent",
      });
    } catch (e) {
      log.push({
        port,
        secure,
        stage: "send",
        ok: false,
        error: String((e as Error).message ?? e),
      });
    }
  }

  // Both ports failed
  return NextResponse.json(
    { stage: "smtp", env, attempts: log, error: "all SMTP attempts failed" },
    { status: 500 }
  );
}
