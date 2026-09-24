"use client";

import { useState } from "react";
import type { CategoryGroup, WorkListItem } from "@/lib/getWorks";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import WorkThumbnail from "@/components/WorkThumbnail";

export default function WorksGrid({
  works,
  categoryGroups,
}: {
  works: WorkListItem[];
  categoryGroups: CategoryGroup[];
}) {
  const [active, setActive] = useState<string>("all");
  const groupByKey = new Map(categoryGroups.map((g) => [g.key, g]));
  const hasGroup = (w: WorkListItem, group: CategoryGroup) =>
    w.categories.some((c) => group.categorySlugs.includes(c.slug));
  const isInFilter = (w: WorkListItem, key: string) => {
    const group = groupByKey.get(key);
    return group ? hasGroup(w, group) : false;
  };
  const visible = active === "all" ? works : works.filter((w) => isInFilter(w, active));

  const filters = [
    { f: "all", en: "All", kr: "전체" },
    ...categoryGroups.map((g) => ({ f: g.key, en: g.labelEn, kr: g.labelKr })),
  ];

  return (
    <div className="container">
      <div className="filters">
        {filters.map(({ f, en, kr }) => (
          <button key={f} className={active === f ? "on" : undefined} onClick={() => setActive(f)}>
            <span className="bw">
              <span className="b-en">{en}</span>
              <span className="b-kr">{kr}</span>
            </span>{" "}
            <i>{f === "all" ? works.length : works.filter((w) => isInFilter(w, f)).length}</i>
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
