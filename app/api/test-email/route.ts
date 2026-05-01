import { NextResponse } from "next/server";
import { sendAdminEmail, verifyEmailConfig } from "@/lib/notifications/email";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/test-email — admin-only diagnostic.
 *
 * Returns the SMTP environment + tries to verify the SMTP connection
 * + tries to actually send a test email. Useful for production triage.
 */
export async function GET() {
  // Restrict to admin so it's not a public spam tool.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "admin only" }, { status: 403 });
  }

  const env = {
    GMAIL_USER: process.env.GMAIL_USER ? "✓ set" : "✗ missing",
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD
      ? `✓ set (length=${process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "").length})`
      : "✗ missing",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.GMAIL_USER || "✗ missing",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "(unset, will fall back to VERCEL_URL/localhost)",
    VERCEL_URL: process.env.VERCEL_URL || "(not on Vercel)",
  };

  const verify = await verifyEmailConfig();

  const send = await sendAdminEmail({
    subject: "Linksy SMTP test ✓",
    text: "If you can read this, SMTP is working from your deployment.",
    html: `<div style="font-family:system-ui;padding:24px;background:#0a0a0a;color:#fafafa;border-radius:12px;">
      <h2 style="margin:0 0 8px;">Linksy SMTP test ✓</h2>
      <p>If you're seeing this email, your production deployment can send mail.</p>
      <p style="font-size:12px;color:#888;">Sent at ${new Date().toISOString()}</p>
    </div>`,
  });

  return NextResponse.json({ env, verify, send });
}
