import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ index: string }> }) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { index } = await params;
  const slotIndex = Number(index);
  const { workId, crop } = await request.json();

  if (workId !== null && typeof workId !== "number") {
    return NextResponse.json({ error: "workId가 올바르지 않습니다." }, { status: 400 });
  }

  const update = {
    work_id: workId,
    crop_x: crop?.x ?? null,
    crop_y: crop?.y ?? null,
    crop_width: crop?.width ?? null,
    crop_height: crop?.height ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("featured_slots").update(update).eq("slot_index", slotIndex);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
