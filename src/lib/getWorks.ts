import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type WorkListItem = {
  id: number;
  titleKr: string;
  titleEn: string;
  year: number;
  categories: string[];
  ratio: number;
};

export async function getWorks(): Promise<WorkListItem[]> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select("id, title_kr, title_en, worked_at, category, work_pdfs(ratio)")
    .order("id");

  if (error) throw error;

  return (data ?? []).map((w) => {
    const pdf = Array.isArray(w.work_pdfs) ? w.work_pdfs[0] : w.work_pdfs;
    return {
      id: w.id,
      titleKr: w.title_kr,
      titleEn: w.title_en,
      year: w.worked_at,
      categories: w.category ?? [],
      ratio: pdf?.ratio ?? 1,
    };
  });
}

export type WorkDetail = {
  id: number;
  titleKr: string;
  titleEn: string;
  year: number;
  categories: string[];
  pdfUrl: string | null;
};

export async function getWorkById(id: number): Promise<WorkDetail | null> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select("id, title_kr, title_en, worked_at, category, work_pdfs(pdf_url)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const pdf = Array.isArray(data.work_pdfs) ? data.work_pdfs[0] : data.work_pdfs;
  return {
    id: data.id,
    titleKr: data.title_kr,
    titleEn: data.title_en,
    year: data.worked_at,
    categories: data.category ?? [],
    pdfUrl: pdf?.pdf_url ?? null,
  };
}
