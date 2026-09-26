"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminCategory, AdminCategoryGroup, WorkListItem } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";
import AdminCategoriesPanel from "./AdminCategoriesPanel";
import AdminFeaturedGrid from "./AdminFeaturedGrid";
import AdminModal from "./AdminModal";
import AdminWorkForm from "./AdminWorkForm";

const FEATURED_COUNT = 5;

export default function AdminWorksPanel({
  works,
  categories,
  categoryGroups,
}: {
  works: WorkListItem[];
  categories: AdminCategory[];
  categoryGroups: AdminCategoryGroup[];
}) {
  const router = useRouter();
  const token = useAdminToken();
  const [addOpen, setAddOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const featured = works.slice(0, FEATURED_COUNT);
  const featuredIds = new Set(featured.map((w) => w.id));

  async function handleRemove(id: number) {
    setRemovingId(id);
    try {
      const res = await adminFetch(token, `/api/admin/works/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  function handleCreated() {
    setAddOpen(false);
    router.refresh();
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
                  disabled={locked || removingId === w.id}
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
        <AdminWorkForm categories={categories} onCreated={handleCreated} />
      </AdminModal>
    </section>
  );
}
