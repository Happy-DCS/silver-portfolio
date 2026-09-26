import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "work-pdfs";

// Vercel 서버리스 함수는 요청 본문이 4.5MB를 넘으면 413을 반환한다. PDF를
// 이 API로 직접 흘려보내는 대신, 클라이언트가 Supabase Storage에 곧바로
// 업로드할 수 있는 서명된 업로드 URL만 발급한다.
export async function POST(request: Request) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  const objectPath = `work-${randomUUID()}.pdf`;
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(objectPath);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "업로드 URL 생성에 실패했습니다." }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);

  return NextResponse.json({
    path: data.path,
    token: data.token,
    publicUrl: publicUrlData.publicUrl,
  });
}
