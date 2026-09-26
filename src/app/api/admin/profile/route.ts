import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof body.email === "string") update.email = body.email;
  if (typeof body.instagramUrl === "string" || body.instagramUrl === null) update.instagram_url = body.instagramUrl;
  if (typeof body.behanceUrl === "string" || body.behanceUrl === null) update.behance_url = body.behanceUrl;
  if (typeof body.linkedinUrl === "string" || body.linkedinUrl === null) update.linkedin_url = body.linkedinUrl;
  if (typeof body.resumeUrl === "string" || body.resumeUrl === null) update.resume_url = body.resumeUrl;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 항목이 없습니다." }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin.from("profile").update(update).eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
