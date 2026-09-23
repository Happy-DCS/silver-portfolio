export const CATEGORY_LABELS: Record<string, string> = {
  branding: "Branding",
  graphic: "Graphic",
  book: "Book",
  uiux: "UI/UX",
  product: "Product",
  motion: "Motion",
  web: "Web",
};

export function formatCategories(categories: string[]): string {
  return categories.map((c) => CATEGORY_LABELS[c] ?? c).join(" · ");
}
