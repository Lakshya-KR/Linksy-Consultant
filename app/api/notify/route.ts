import { NextResponse } from "next/server";
import { sendAdminEmail } from "@/lib/notifications/email";
import { SERVICE_LABELS } from "@/lib/types";
import { formatCurrency, getSiteUrl } from "@/lib/utils";

interface ProjectPreview {
  id: string;
  title: string;
  description: string;
  service_type: keyof typeof SERVICE_LABELS;
  budget_min: number;
  budget_max: number;
  timeline_weeks: number;
  preferred_contact: string;
}

export async function POST(req: Request) {
  try {
    const { project, contact, clientName } = (await req.json()) as {
      project: ProjectPreview;
      contact: string;
      clientName?: string;
    };

    const service = SERVICE_LABELS[project.service_type];
    const budget = `${formatCurrency(project.budget_min)} – ${formatCurrency(project.budget_max)}`;
    const phoneClean = contact.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const isPhone = phoneClean.length >= 8;

    const greet = encodeURIComponent(
      `Hi${clientName ? " " + clientName.split(" ")[0] : ""}, thanks for the brief on "${project.title}". Got a few minutes to chat?`
    );
    const waLink = isPhone ? `https://wa.me/${phoneClean}?text=${greet}` : null;
    const telLink = isPhone ? `tel:+${phoneClean}` : null;
    const isEmail = /^[^@\s]+@[^@\s]+$/.test(contact);
    const mailLink = isEmail
      ? `mailto:${contact}?subject=${encodeURIComponent(`Re: ${project.title}`)}`
      : null;

    const adminLink = `${getSiteUrl()}/admin/projects/${project.id}`;

    // Inline action buttons — admin taps one and gets a prefilled WhatsApp/dialer/mail
    const actions: string[] = [];
    if (waLink)
      actions.push(
        `<a href="${waLink}" style="display:inline-block;margin:0 6px 6px 0;padding:10px 16px;background:#25d366;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px;">💬 WhatsApp client</a>`
      );
    if (telLink)
      actions.push(
        `<a href="${telLink}" style="display:inline-block;margin:0 6px 6px 0;padding:10px 16px;background:#1f1f1f;color:#fafafa;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px;border:1px solid #333;">📞 Call client</a>`
      );
    if (mailLink)
      actions.push(
        `<a href="${mailLink}" style="display:inline-block;margin:0 6px 6px 0;padding:10px 16px;background:#1f1f1f;color:#fafafa;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px;border:1px solid #333;">✉ Reply by email</a>`
      );

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#0a0a0a;color:#fafafa;border-radius:14px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;">New project proposal</div>
        <h1 style="font-size:28px;margin:8px 0 6px;color:#fff;line-height:1.2;">${escape(project.title)}</h1>
        ${clientName ? `<div style="color:#aaa;font-size:14px;margin-bottom:20px;">from ${escape(clientName)}</div>` : `<div style="margin-bottom:20px;"></div>`}

        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #1f1f1f;">
          <tr><td style="padding:10px 0;color:#888;width:35%;border-bottom:1px solid #141414;">Service</td><td style="border-bottom:1px solid #141414;">${escape(service)}</td></tr>
          <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #141414;">Timeline</td><td style="border-bottom:1px solid #141414;">${project.timeline_weeks} weeks</td></tr>
          <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #141414;">Budget</td><td style="border-bottom:1px solid #141414;">${budget}</td></tr>
          <tr><td style="padding:10px 0;color:#888;">Preferred contact</td><td><strong>${escape(project.preferred_contact)}</strong> — <code style="background:#1f1f1f;padding:2px 6px;border-radius:4px;">${escape(contact)}</code></td></tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#141414;border-radius:10px;font-size:14px;line-height:1.55;white-space:pre-wrap;color:#e5e5e5;">${escape(project.description)}</div>

        ${actions.length ? `
        <div style="margin-top:24px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:10px;">Reply in one tap</div>
          ${actions.join("")}
        </div>` : ""}

        <a href="${adminLink}"
           style="display:inline-block;margin-top:20px;padding:12px 22px;background:#fafafa;color:#000;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">
          Open in admin →
        </a>
      </div>
    `;

    const text = `New project: ${project.title}${clientName ? " (from " + clientName + ")" : ""}\nService: ${service}\nTimeline: ${project.timeline_weeks}w\nBudget: ${budget}\nPreferred contact: ${project.preferred_contact} — ${contact}\n\n${project.description}\n\n${waLink ? "WhatsApp: " + waLink + "\n" : ""}${telLink ? "Call: " + telLink + "\n" : ""}Open in admin: ${adminLink}`;

    const result = await sendAdminEmail({
      subject: `New proposal · ${project.title}`,
      html,
      text,
    });

    return NextResponse.json({ email: result });
  } catch (e) {
    console.error("notify error", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
