"use client";

import { useState } from "react";
import type { WorkListItem } from "@/lib/getWorks";
import { formatCategories } from "@/lib/categoryLabels";

const FILTERS = [
  { f: "all", en: "All", kr: "전체" },
  { f: "branding", en: "Branding", kr: "브랜딩" },
  { f: "graphic", en: "Graphic·Poster", kr: "그래픽·포스터" },
  { f: "book", en: "Book·Editorial", kr: "북·편집" },
  { f: "uiux", en: "UI/UX", kr: "UI/UX" },
  { f: "product", en: "Product", kr: "제품" },
] as const;

const CATEGORY_GRADIENTS: Record<string, string> = {
  branding: "linear-gradient(135deg,#c9541e,#f3d34a)",
  graphic: "linear-gradient(135deg,#2f7d43,#cfe3a8)",
  book: "linear-gradient(135deg,#2b3a67,#8ea7d9)",
  uiux: "linear-gradient(135deg,#584a8f,#e3b8d5)",
  product: "linear-gradient(135deg,#8d9198,#e6e8ec)",
  motion: "linear-gradient(135deg,#1f2d24,#6fbf8a)",
  web: "linear-gradient(135deg,#28607a,#a8d8e8)",
};
const DEFAULT_GRADIENT = "linear-gradient(135deg,#8d9198,#e6e8ec)";

export default function WorksGrid({ works }: { works: WorkListItem[] }) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? works : works.filter((w) => w.categories.includes(active));

  return (
    <div className="container">
      <div className="filters">
        {FILTERS.map(({ f, en, kr }) => (
          <button key={f} className={active === f ? "on" : undefined} onClick={() => setActive(f)}>
            <span className="bw">
              <span className="b-en">{en}</span>
              <span className="b-kr">{kr}</span>
            </span>{" "}
            <i>{f === "all" ? works.length : works.filter((w) => w.categories.includes(f)).length}</i>
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((w) => (
          <a key={w.id} className="card" href={`/works/${w.id}`}>
            <div
              className="ph"
              style={{ aspectRatio: w.ratio, background: CATEGORY_GRADIENTS[w.categories[0]] ?? DEFAULT_GRADIENT }}
            >
              <em>{w.titleEn}</em>
            </div>
            <div className="meta">
              <span className="t-kr">{w.titleKr}</span>
              <span className="yr">{w.year}</span>
            </div>
            <span className="cat">{formatCategories(w.categories)}</span>
          </a>
        ))}
      </div>
      {visible.length === 0 && <p id="empty">이 분야의 작업은 준비 중입니다 🌱</p>}
    </div>
  );
}
