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

type CategoryRow = { slug: string; label_en: string };
type CategoryRef = CategoryRow | CategoryRow[] | null;

function extractCategories(workCategories: { categories: CategoryRef }[] | null | undefined): WorkCategory[] {
  return (workCategories ?? [])
    .map((wc) => (Array.isArray(wc.categories) ? wc.categories[0] : wc.categories))
    .filter((c): c is CategoryRow => Boolean(c))
    .map((c) => ({ slug: c.slug, label: c.label_en }));
}

export async function getWorks(): Promise<WorkListItem[]> {
  const { data, error } = await supabaseAdmin
    .from("works")
    .select(
      "id, title_kr, title_en, worked_at, work_categories(categories(slug, label_en)), work_pdfs(ratio, pdf_url)"
    )
    .order("id");

  if (error) throw error;

  return (data ?? []).map((w) => {
    const pdf = Array.isArray(w.work_pdfs) ? w.work_pdfs[0] : w.work_pdfs;
    return {
      id: w.id,
      titleKr: w.title_kr,
      titleEn: w.title_en,
      year: w.worked_at,
      categories: extractCategories(w.work_categories),
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
  const { data, error } = await supabaseAdmin
    .from("works")
    .select(
      "id, title_kr, title_en, worked_at, work_categories(categories(slug, label_en)), work_pdfs(pdf_url)"
    )
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
    categories: extractCategories(data.work_categories),
    pdfUrl: pdf?.pdf_url ?? null,
  };
}
