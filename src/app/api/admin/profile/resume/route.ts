import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "work-pdfs";
const OBJECT_PATH = "profile-resume.pdf";

export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const pdfFile = form.get("pdf");
  if (!(pdfFile instanceof File)) {
    return NextResponse.json({ error: "PDF 파일이 필요합니다." }, { status: 400 });
  }

  const buffer = await pdfFile.arrayBuffer();
  const { error: uploadErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(OBJECT_PATH, buffer, { contentType: "application/pdf", upsert: true });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(OBJECT_PATH);
  const resumeUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

  const { error: updateErr } = await supabaseAdmin
    .from("profile")
    .update({ resume_url: resumeUrl, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ url: resumeUrl });
}
