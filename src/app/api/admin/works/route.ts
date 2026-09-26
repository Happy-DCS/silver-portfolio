import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "work-pdfs";

export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const titleKr = String(form.get("titleKr") ?? "").trim();
  const titleEn = String(form.get("titleEn") ?? "").trim();
  const year = Number(form.get("year"));
  const description = String(form.get("description") ?? "");
  const ratio = Number(form.get("ratio")) || 1;
  const pdfFile = form.get("pdf");

  let categoryIds: number[] = [];
  let newCategories: { labelKr: string; labelEn: string }[] = [];
  try {
    categoryIds = JSON.parse(String(form.get("categoryIds") ?? "[]"));
    newCategories = JSON.parse(String(form.get("newCategories") ?? "[]"));
  } catch {
    return NextResponse.json({ error: "카테고리 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (!titleKr || !titleEn || !year || !(pdfFile instanceof File)) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  let finalCategoryIds = [...categoryIds];
  if (newCategories.length > 0) {
    const { data: created, error: catErr } = await supabaseAdmin
      .from("categories")
      .insert(newCategories.map((c) => ({ slug: slugify(c.labelEn), label_kr: c.labelKr, label_en: c.labelEn })))
      .select("id");
    if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 });
    finalCategoryIds = [...finalCategoryIds, ...(created ?? []).map((c) => c.id)];
  }

  const { data: work, error: workErr } = await supabaseAdmin
    .from("works")
    .insert({
      title_kr: titleKr,
      title_en: titleEn,
      worked_at: year,
      description,
      category_ids: finalCategoryIds,
    })
    .select("id")
    .single();
  if (workErr || !work) {
    return NextResponse.json({ error: workErr?.message ?? "작업물 생성에 실패했습니다." }, { status: 500 });
  }

  const objectPath = `work-${work.id}.pdf`;
  const buffer = await pdfFile.arrayBuffer();
  const { error: uploadErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(objectPath, buffer, { contentType: "application/pdf", upsert: true });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);

  const { error: pdfRowErr } = await supabaseAdmin
    .from("work_pdfs")
    .insert({ work_id: work.id, pdf_url: publicUrlData.publicUrl, ratio });
  if (pdfRowErr) {
    return NextResponse.json({ error: pdfRowErr.message }, { status: 500 });
  }

  return NextResponse.json({ id: work.id });
}
