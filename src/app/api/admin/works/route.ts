import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const titleKr = String(body.titleKr ?? "").trim();
  const titleEn = String(body.titleEn ?? "").trim();
  const year = Number(body.year);
  const description = String(body.description ?? "");
  const ratio = Number(body.ratio) || 1;
  const pdfUrl = String(body.pdfUrl ?? "").trim();
  const categoryIds: number[] = Array.isArray(body.categoryIds) ? body.categoryIds : [];
  const newCategories: { labelKr: string; labelEn: string }[] = Array.isArray(body.newCategories)
    ? body.newCategories
    : [];

  if (!titleKr || !titleEn || !year || !pdfUrl) {
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

  const { error: pdfRowErr } = await supabaseAdmin
    .from("work_pdfs")
    .insert({ work_id: work.id, pdf_url: pdfUrl, ratio });
  if (pdfRowErr) {
    return NextResponse.json({ error: pdfRowErr.message }, { status: 500 });
  }

  return NextResponse.json({ id: work.id });
}
