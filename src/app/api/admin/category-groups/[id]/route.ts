import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const groupId = Number(id);
  const { categoryIds } = await request.json();
  if (!Array.isArray(categoryIds)) {
    return NextResponse.json({ error: "categoryIds가 필요합니다." }, { status: 400 });
  }

  if (categoryIds.length === 0) {
    const { error } = await supabaseAdmin.from("category_groups").delete().eq("id", groupId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, deleted: true });
  }

  const { error } = await supabaseAdmin
    .from("category_groups")
    .update({ category_ids: categoryIds })
    .eq("id", groupId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { error } = await supabaseAdmin.from("category_groups").delete().eq("id", Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
