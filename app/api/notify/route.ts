import { NextResponse } from "next/server";
import { sendProjectAlert, type ProjectAlertInput } from "@/lib/notifications/sendProjectAlert";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProjectAlertInput;
    const result = await sendProjectAlert(body);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    console.error("[/api/notify] error", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
