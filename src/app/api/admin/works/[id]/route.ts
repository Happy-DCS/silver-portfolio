import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "work-pdfs";

function extractObjectPath(pdfUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = pdfUrl.indexOf(marker);
  if (idx === -1) return null;
  return pdfUrl.slice(idx + marker.length).split("?")[0];
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const workId = Number(id);
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof body.titleKr === "string") update.title_kr = body.titleKr;
  if (typeof body.titleEn === "string") update.title_en = body.titleEn;
  if (typeof body.year === "number") update.worked_at = body.year;
  if (typeof body.description === "string") update.description = body.description;
  if (Array.isArray(body.categoryIds)) update.category_ids = body.categoryIds;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 항목이 없습니다." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("works").update(update).eq("id", workId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const workId = Number(id);

  const { data: pdfRow } = await supabaseAdmin
    .from("work_pdfs")
    .select("pdf_url")
    .eq("work_id", workId)
    .maybeSingle();

  await supabaseAdmin.from("work_pdfs").delete().eq("work_id", workId);
  const { error } = await supabaseAdmin.from("works").delete().eq("id", workId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const objectPath = pdfRow?.pdf_url ? extractObjectPath(pdfRow.pdf_url) : null;
  if (objectPath) {
    await supabaseAdmin.storage.from(BUCKET).remove([objectPath]);
  }

  return NextResponse.json({ ok: true });
}
