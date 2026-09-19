"use client";

import { useState } from "react";
import { WORKS } from "@/data/works";

const FEATURED_COUNT = 5;

export default function AdminWorksPanel() {
  const [works, setWorks] = useState(WORKS);
  const featured = works.slice(0, FEATURED_COUNT);
  const featuredIds = new Set(featured.map((w) => w.p));

  function handleRemove(id: number) {
    setWorks((prev) => prev.filter((w) => w.p !== id));
  }

  return (
    <section className="admin-section">
      <div className="admin-section-block">
        <div className="admin-section-head">
          <h2>대표 작업물</h2>
          <span className="admin-count">{featured.length}</span>
        </div>
        <ul className="admin-list">
          {featured.map((w) => (
            <li key={w.p} className="admin-list-row">
              <span className="admin-list-main">
                <span className="admin-list-title">{w.titleKr}</span>
                <span className="admin-list-sub">
                  {w.titleEn} · {w.year}
                </span>
              </span>
              <span className="admin-list-cat">{w.catLabel}</span>
              <button type="button" className="admin-submit admin-list-btn">
                수정
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section-block">
        <div className="admin-section-head">
          <h2>모든 작업물</h2>
          <span className="admin-count">{works.length}</span>
          <button type="button" className="admin-submit admin-list-btn admin-add-btn">
            + 추가
          </button>
        </div>
        <ul className="admin-list">
          {works.map((w) => {
            const locked = featuredIds.has(w.p);
            return (
              <li key={w.p} className="admin-list-row">
                <span className="admin-list-main">
                  <span className="admin-list-title">{w.titleKr}</span>
                  <span className="admin-list-sub">
                    {w.titleEn} · {w.year}
                  </span>
                </span>
                <span className="admin-list-cat">{w.catLabel}</span>
                <button
                  type="button"
                  className={locked ? "admin-remove-btn admin-remove-btn--locked" : "admin-remove-btn"}
                  disabled={locked}
                  onClick={locked ? undefined : () => handleRemove(w.p)}
                  aria-label={locked ? "대표 작업물은 삭제할 수 없습니다" : "작업물 삭제"}
                >
                  −
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
