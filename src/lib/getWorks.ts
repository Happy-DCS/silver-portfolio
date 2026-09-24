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

export type CategoryGroup = {
  key: string;
  labelKr: string;
  labelEn: string;
  categorySlugs: string[];
};

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  const [{ data: groups, error: groupsErr }, { data: cats, error: catsErr }] = await Promise.all([
    supabaseAdmin.from("category_groups").select("id, category_ids, sort_order").order("sort_order"),
    supabaseAdmin.from("categories").select("id, slug, label_kr, label_en"),
  ]);
  if (groupsErr) throw groupsErr;
  if (catsErr) throw catsErr;

  const catById = new Map((cats ?? []).map((c) => [c.id, c]));
  const groupedIds = new Set<number>();

  const result: CategoryGroup[] = (groups ?? []).map((g) => {
    const ids: number[] = g.category_ids ?? [];
    ids.forEach((id) => groupedIds.add(id));
    const members = ids.map((id) => catById.get(id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
    return {
      key: String(g.id),
      labelKr: members.map((c) => c.label_kr).join("·"),
      labelEn: members.map((c) => c.label_en).join(" · "),
      categorySlugs: members.map((c) => c.slug),
    };
  });

  // 어떤 큐레이션된 그룹에도 속하지 않은 카테고리는 자동으로 "기타"로 묶는다
  const leftover = (cats ?? []).filter((c) => !groupedIds.has(c.id));
  if (leftover.length > 0) {
    result.push({
      key: "etc",
      labelKr: "기타",
      labelEn: "Etc",
      categorySlugs: leftover.map((c) => c.slug),
    });
  }

  return result;
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
