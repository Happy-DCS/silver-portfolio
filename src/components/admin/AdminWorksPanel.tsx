"use client";

import { useState } from "react";
import type { AdminCategory, AdminCategoryGroup, WorkListItem } from "@/lib/getWorks";
import AdminCategoriesPanel from "./AdminCategoriesPanel";
import AdminFeaturedGrid from "./AdminFeaturedGrid";
import AdminModal from "./AdminModal";
import AdminWorkForm, { type NewWorkDraft } from "./AdminWorkForm";

const FEATURED_COUNT = 5;

export default function AdminWorksPanel({
  works: initialWorks,
  categories,
  categoryGroups,
}: {
  works: WorkListItem[];
  categories: AdminCategory[];
  categoryGroups: AdminCategoryGroup[];
}) {
  const [works, setWorks] = useState(initialWorks);
  const [addOpen, setAddOpen] = useState(false);
  const featured = works.slice(0, FEATURED_COUNT);
  const featuredIds = new Set(featured.map((w) => w.id));

  function handleRemove(id: number) {
    setWorks((prev) => prev.filter((w) => w.id !== id));
  }

  function handleAddWork(draft: NewWorkDraft) {
    setWorks((prev) => {
      const tempId = Math.min(0, ...prev.map((w) => w.id)) - 1;
      return [...prev, { id: tempId, ...draft }];
    });
    setAddOpen(false);
  }

  return (
    <section className="admin-section">
      <div className="admin-section-block">
        <div className="admin-section-head">
          <h2>대표 작업물</h2>
          <span className="admin-count">{featured.length}</span>
        </div>
        <AdminFeaturedGrid works={works} />
      </div>

      <AdminCategoriesPanel categories={categories} categoryGroups={categoryGroups} />

      <div className="admin-section-block">
        <div className="admin-section-head">
          <h2>모든 작업물</h2>
          <span className="admin-count">{works.length}</span>
          <button
            type="button"
            className="admin-submit admin-list-btn admin-add-btn"
            onClick={() => setAddOpen(true)}
          >
            + 추가
          </button>
        </div>
        <ul className="admin-list">
          {works.map((w) => {
            const locked = featuredIds.has(w.id);
            return (
              <li key={w.id} className="admin-list-row">
                <span className="admin-list-main">
                  <span className="admin-list-title">{w.titleKr}</span>
                  <span className="admin-list-sub">
                    {w.titleEn} · {w.year}
                  </span>
                </span>
                <span className="admin-list-cat">{w.categories.map((c) => c.label).join(" · ")}</span>
                <button
                  type="button"
                  className={locked ? "admin-remove-btn admin-remove-btn--locked" : "admin-remove-btn"}
                  disabled={locked}
                  onClick={locked ? undefined : () => handleRemove(w.id)}
                  aria-label={locked ? "대표 작업물은 삭제할 수 없습니다" : "작업물 삭제"}
                >
                  −
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AdminModal open={addOpen} onClose={() => setAddOpen(false)} title="작업물 추가">
        <AdminWorkForm categories={categories} onSubmit={handleAddWork} />
      </AdminModal>
    </section>
  );
}
