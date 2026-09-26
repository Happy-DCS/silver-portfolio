import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { categoryIds } = await request.json();
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    return NextResponse.json({ error: "카테고리가 최소 1개 필요합니다." }, { status: 400 });
  }

  const { data: maxRow } = await supabaseAdmin
    .from("category_groups")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabaseAdmin
    .from("category_groups")
    .insert({ category_ids: categoryIds, sort_order: nextSortOrder })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
