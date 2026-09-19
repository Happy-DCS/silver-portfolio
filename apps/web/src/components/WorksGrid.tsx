"use client";

import { useState } from "react";
import { WORKS, type Category } from "@/data/works";

const FILTERS: { f: "all" | Category; en: string; kr: string }[] = [
  { f: "all", en: "All", kr: "전체" },
  { f: "branding", en: "Branding", kr: "브랜딩" },
  { f: "graphic", en: "Graphic·Poster", kr: "그래픽·포스터" },
  { f: "book", en: "Book·Editorial", kr: "북·편집" },
  { f: "uiux", en: "UI/UX", kr: "UI/UX" },
  { f: "product", en: "Product", kr: "제품" },
];

export default function WorksGrid() {
  const [active, setActive] = useState<"all" | Category>("all");
  const visible = active === "all" ? WORKS : WORKS.filter((w) => w.cat === active);

  return (
    <div className="container">
      <div className="filters">
        {FILTERS.map(({ f, en, kr }) => (
          <button key={f} className={active === f ? "on" : undefined} onClick={() => setActive(f)}>
            <span className="bw">
              <span className="b-en">{en}</span>
              <span className="b-kr">{kr}</span>
            </span>{" "}
            <i>{f === "all" ? WORKS.length : WORKS.filter((w) => w.cat === f).length}</i>
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((w) => (
          <a key={w.p} className="card" href={`/works/${w.p}`}>
            <div className={`ph ${w.ratio}`} style={{ background: w.bg }}>
              <em>{w.titleEn}</em>
            </div>
            <div className="meta">
              <span className="t-kr">{w.titleKr}</span>
              <span className="yr">{w.year}</span>
            </div>
            <span className="cat">{w.catLabel}</span>
          </a>
        ))}
      </div>
      {visible.length === 0 && <p id="empty">이 분야의 작업은 준비 중입니다 🌱</p>}
    </div>
  );
}
