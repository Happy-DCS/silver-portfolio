import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const categoryId = Number(id);
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof body.labelKr === "string") update.label_kr = body.labelKr;
  if (typeof body.labelEn === "string") {
    update.label_en = body.labelEn;
    update.slug = slugify(body.labelEn);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "수정할 항목이 없습니다." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("categories").update(update).eq("id", categoryId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const categoryId = Number(id);

  const { data: works } = await supabaseAdmin
    .from("works")
    .select("id")
    .contains("category_ids", [categoryId]);
  if ((works ?? []).length > 0) {
    return NextResponse.json(
      { error: "해당 카테고리에 포함된 작업물이 있습니다.\n작업물을 옮긴 후 다시 시도해주세요." },
      { status: 409 }
    );
  }

  const { data: groups } = await supabaseAdmin
    .from("category_groups")
    .select("id, category_ids")
    .contains("category_ids", [categoryId]);
  for (const g of groups ?? []) {
    const nextIds = ((g.category_ids as number[]) ?? []).filter((cid) => cid !== categoryId);
    await supabaseAdmin.from("category_groups").update({ category_ids: nextIds }).eq("id", g.id);
  }

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", categoryId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
