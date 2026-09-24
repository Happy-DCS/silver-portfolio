import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type WorkCategory = {
  slug: string;
  label: string;
};

export type WorkListItem = {
  id: number;
  titleKr: string;
  titleEn: string;
  year: number;
  categories: WorkCategory[];
  ratio: number;
  pdfUrl: string | null;
};

async function getCategoryMap(): Promise<Map<number, WorkCategory>> {
  const { data, error } = await supabaseAdmin.from("categories").select("id, slug, label_en");
  if (error) throw error;
  return new Map((data ?? []).map((c) => [c.id, { slug: c.slug, label: c.label_en }]));
}

export type Category = {
  slug: string;
  labelKr: string;
  labelEn: string;
};

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin.from("categories").select("slug, label_kr, label_en").order("id");
  if (error) throw error;
  return (data ?? []).map((c) => ({ slug: c.slug, labelKr: c.label_kr, labelEn: c.label_en }));
}

function resolveCategories(categoryIds: number[] | null | undefined, catMap: Map<number, WorkCategory>): WorkCategory[] {
  return (categoryIds ?? [])
    .map((id) => catMap.get(id))
    .filter((c): c is WorkCategory => Boolean(c));
}

export async function getWorks(): Promise<WorkListItem[]> {
  const [catMap, worksResult] = await Promise.all([
    getCategoryMap(),
    supabaseAdmin
      .from("works")
      .select("id, title_kr, title_en, worked_at, category_ids, work_pdfs(ratio, pdf_url)")
      .order("id"),
  ]);

  const { data, error } = worksResult;
  if (error) throw error;

  return (data ?? []).map((w) => {
    const pdf = Array.isArray(w.work_pdfs) ? w.work_pdfs[0] : w.work_pdfs;
    return {
      id: w.id,
      titleKr: w.title_kr,
      titleEn: w.title_en,
      year: w.worked_at,
      categories: resolveCategories(w.category_ids, catMap),
      ratio: pdf?.ratio ?? 1,
      pdfUrl: pdf?.pdf_url ?? null,
    };
  });
}

export type WorkDetail = {
  id: number;
  titleKr: string;
  titleEn: string;
  year: number;
  categories: WorkCategory[];
  pdfUrl: string | null;
};

export async function getWorkById(id: number): Promise<WorkDetail | null> {
  const [catMap, workResult] = await Promise.all([
    getCategoryMap(),
    supabaseAdmin
      .from("works")
      .select("id, title_kr, title_en, worked_at, category_ids, work_pdfs(pdf_url)")
      .eq("id", id)
      .maybeSingle(),
  ]);

  const { data, error } = workResult;
  if (error) throw error;
  if (!data) return null;

  const pdf = Array.isArray(data.work_pdfs) ? data.work_pdfs[0] : data.work_pdfs;
  return {
    id: data.id,
    titleKr: data.title_kr,
    titleEn: data.title_en,
    year: data.worked_at,
    categories: resolveCategories(data.category_ids, catMap),
    pdfUrl: pdf?.pdf_url ?? null,
  };
}
