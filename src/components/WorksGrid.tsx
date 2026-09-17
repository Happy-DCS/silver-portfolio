"use client";

import { useState } from "react";

type Category = "branding" | "graphic" | "book" | "uiux" | "product" | "motion";

type Work = {
  p: number;
  cat: Category;
  ratio: string;
  bg: string;
  titleEn: string;
  titleKr: string;
  year: number;
  catLabel: string;
};

const WORKS: Work[] = [
  {
    p: 1,
    cat: "branding",
    ratio: "r-45",
    bg: "linear-gradient(135deg,#a0482c,#e8b64c)",
    titleEn: "GGACHI COFFEE BAR",
    titleKr: "까치커피바",
    year: 2026,
    catLabel: "Branding · Web",
  },
  {
    p: 2,
    cat: "book",
    ratio: "r-34",
    bg: "linear-gradient(135deg,#2b3a67,#8ea7d9)",
    titleEn: "Demian, Re-covered",
    titleKr: "데미안 리커버",
    year: 2025,
    catLabel: "Book Design",
  },
  {
    p: 3,
    cat: "graphic",
    ratio: "r-45",
    bg: "linear-gradient(135deg,#2f7d43,#cfe3a8)",
    titleEn: "Luck Foraging",
    titleKr: "행운 채집 展",
    year: 2025,
    catLabel: "Poster · Graphic",
  },
  {
    p: 4,
    cat: "uiux",
    ratio: "r-11",
    bg: "linear-gradient(135deg,#584a8f,#e3b8d5)",
    titleEn: "Mitjul App",
    titleKr: "밑줄",
    year: 2024,
    catLabel: "UI/UX",
  },
  {
    p: 5,
    cat: "product",
    ratio: "r-43",
    bg: "linear-gradient(135deg,#8d9198,#e6e8ec)",
    titleEn: "CLOVER OBJET",
    titleKr: "클로버 오브제",
    year: 2024,
    catLabel: "Product",
  },
  {
    p: 6,
    cat: "branding",
    ratio: "r-169",
    bg: "linear-gradient(135deg,#c9541e,#f3d34a)",
    titleEn: "SPROUT Exhibition",
    titleKr: "SPROUT 전시 아이덴티티",
    year: 2024,
    catLabel: "Branding",
  },
  {
    p: 7,
    cat: "book",
    ratio: "r-45",
    bg: "linear-gradient(135deg,#3e7c5b,#f0e3b2)",
    titleEn: "The Lucky Grass — Picture Book",
    titleKr: "행복한 풀 (동화책)",
    year: 2025,
    catLabel: "Book · Illustration",
  },
  {
    p: 8,
    cat: "motion",
    ratio: "r-169",
    bg: "linear-gradient(135deg,#1f2d24,#6fbf8a)",
    titleEn: "The Lucky Grass — Animated",
    titleKr: "행복한 풀 (애니메이션)",
    year: 2025,
    catLabel: "Motion · Animation",
  },
  {
    p: 9,
    cat: "graphic",
    ratio: "r-34",
    bg: "linear-gradient(135deg,#d94f70,#f7c8d4)",
    titleEn: "Typo Poster Series",
    titleKr: "타이포 포스터 연작",
    year: 2023,
    catLabel: "Poster · Type",
  },
  {
    p: 10,
    cat: "uiux",
    ratio: "r-45",
    bg: "linear-gradient(135deg,#28607a,#a8d8e8)",
    titleEn: "Campus Kiosk Redesign",
    titleKr: "키오스크 리디자인",
    year: 2023,
    catLabel: "UI/UX",
  },
  {
    p: 11,
    cat: "motion",
    ratio: "r-11",
    bg: "linear-gradient(135deg,#5b3f8f,#c9b8f0)",
    titleEn: "Kinetic Type Loop",
    titleKr: "키네틱 타이포 루프",
    year: 2023,
    catLabel: "Motion",
  },
  {
    p: 12,
    cat: "graphic",
    ratio: "r-43",
    bg: "linear-gradient(135deg,#b8860b,#f5e6a8)",
    titleEn: "Local Market Identity Poster",
    titleKr: "동네 마켓 포스터",
    year: 2023,
    catLabel: "Graphic",
  },
];

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
