import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const { labelKr, labelEn } = await request.json();
  if (!labelKr || !labelEn) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ slug: slugify(labelEn), label_kr: labelKr, label_en: labelEn })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
