"use client";

import { useState } from "react";
import type { WorkListItem } from "@/lib/getWorks";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import WorkThumbnail from "@/components/WorkThumbnail";

const FILTERS = [
  { f: "all", en: "All", kr: "전체" },
  { f: "branding", en: "Branding", kr: "브랜딩" },
  { f: "graphic", en: "Graphic·Poster", kr: "그래픽·포스터" },
  { f: "book", en: "Book·Editorial", kr: "북·편집" },
  { f: "uiux", en: "UI/UX", kr: "UI/UX" },
  { f: "product", en: "Product", kr: "제품" },
] as const;

export default function WorksGrid({ works }: { works: WorkListItem[] }) {
  const [active, setActive] = useState<string>("all");
  const hasCategory = (w: WorkListItem, slug: string) => w.categories.some((c) => c.slug === slug);
  const visible = active === "all" ? works : works.filter((w) => hasCategory(w, active));

  return (
    <div className="container">
      <div className="filters">
        {FILTERS.map(({ f, en, kr }) => (
          <button key={f} className={active === f ? "on" : undefined} onClick={() => setActive(f)}>
            <span className="bw">
              <span className="b-en">{en}</span>
              <span className="b-kr">{kr}</span>
            </span>{" "}
            <i>{f === "all" ? works.length : works.filter((w) => hasCategory(w, f)).length}</i>
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((w) => (
          <a key={w.id} className="card" href={`/works/${w.id}`}>
            <div className="ph" style={{ aspectRatio: w.ratio }}>
              <WorkThumbnail
                pdfUrl={w.pdfUrl}
                fallbackBg={categoryGradient(w.categories[0]?.slug)}
                accentColor={categoryAccent(w.categories[0]?.slug)}
                label={w.titleEn}
              />
            </div>
            <div className="meta">
              <span className="t-kr">{w.titleKr}</span>
              <span className="yr">{w.year}</span>
            </div>
            <span className="cat">{w.categories.map((c) => c.label).join(" · ")}</span>
          </a>
        ))}
      </div>
      {visible.length === 0 && <p id="empty">이 분야의 작업은 준비 중입니다 🌱</p>}
    </div>
  );
}
