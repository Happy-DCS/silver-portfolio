"use client";

import { useRouter } from "next/navigation";
import { useState, type DragEvent } from "react";
import type { AdminCategory, AdminCategoryGroup } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";

type LineupGroup = {
  id: string;
  categoryIds: number[];
};

let draftCounter = 0;
function nextDraftId() {
  draftCounter += 1;
  return `draft-${draftCounter}`;
}

const DRAG_TYPE = "text/x-category-id";

export default function AdminCategoriesPanel({
  categories,
  categoryGroups,
}: {
  categories: AdminCategory[];
  categoryGroups: AdminCategoryGroup[];
}) {
  const router = useRouter();
  const token = useAdminToken();
  const [groups, setGroups] = useState<LineupGroup[]>(
    categoryGroups.map((g) => ({ id: String(g.id), categoryIds: g.categoryIds }))
  );
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const groupedIds = new Set(groups.flatMap((g) => g.categoryIds));
  const pool = categories.filter((c) => !groupedIds.has(c.id));
  const catById = new Map(categories.map((c) => [c.id, c]));

  async function handleRemoveCategory(id: number) {
    setRemovingId(id);
    try {
      setGroups((prev) =>
        prev
          .map((g) => ({ ...g, categoryIds: g.categoryIds.filter((cid) => cid !== id) }))
          .filter((g) => g.categoryIds.length > 0)
      );
      const res = await adminFetch(token, `/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  function handleDragStart(e: DragEvent, id: number) {
    e.dataTransfer.setData(DRAG_TYPE, String(id));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent, zoneId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(zoneId);
  }

  function handleDropOnGroup(e: DragEvent, groupId: string) {
    e.preventDefault();
    setDragOverId(null);
    const id = Number(e.dataTransfer.getData(DRAG_TYPE));
    if (!id) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId && !g.categoryIds.includes(id) ? { ...g, categoryIds: [...g.categoryIds, id] } : g))
    );
  }

  function handleDropNewGroup(e: DragEvent) {
    e.preventDefault();
    setDragOverId(null);
    const id = Number(e.dataTransfer.getData(DRAG_TYPE));
    if (!id) return;
    setGroups((prev) => [...prev, { id: nextDraftId(), categoryIds: [id] }]);
  }

  function handleRemoveFromGroup(groupId: string, categoryId: number) {
    setGroups((prev) =>
      prev
        .map((g) => (g.id === groupId ? { ...g, categoryIds: g.categoryIds.filter((id) => id !== categoryId) } : g))
        .filter((g) => g.categoryIds.length > 0)
    );
  }

  return (
    <div className="admin-section-block">
      <div className="admin-section-head">
        <h2>카테고리</h2>
        <span className="admin-count">{categories.length}</span>
      </div>

      <p className="admin-lineup-hint">아래 카테고리를 드래그해서 works 페이지 필터에 보일 묶음을 구성하세요.</p>
      <div className="admin-lineup">
        {groups.map((g) => (
          <div
            key={g.id}
            className={dragOverId === g.id ? "admin-lineup-group admin-lineup-group--over" : "admin-lineup-group"}
            onDragOver={(e) => handleDragOver(e, g.id)}
            onDragLeave={() => setDragOverId((prev) => (prev === g.id ? null : prev))}
            onDrop={(e) => handleDropOnGroup(e, g.id)}
          >
            {g.categoryIds.map((id) => {
              const cat = catById.get(id);
              if (!cat) return null;
              return (
                <span key={id} className="admin-lineup-chip">
                  {cat.labelKr}
                  <button
                    type="button"
                    onClick={() => handleRemoveFromGroup(g.id, id)}
                    aria-label={`${cat.labelKr} 그룹에서 제거`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        ))}
        <div
          className={dragOverId === "new" ? "admin-lineup-newzone admin-lineup-newzone--over" : "admin-lineup-newzone"}
          onDragOver={(e) => handleDragOver(e, "new")}
          onDragLeave={() => setDragOverId((prev) => (prev === "new" ? null : prev))}
          onDrop={handleDropNewGroup}
        >
          + 새 그룹 (여기로 드래그)
        </div>
      </div>

      <ul className="admin-list">
        {pool.map((c) => (
          <li key={c.id} className="admin-list-row" draggable onDragStart={(e) => handleDragStart(e, c.id)}>
            <span className="admin-list-main">
              <span className="admin-list-title">{c.labelKr}</span>
              <span className="admin-list-sub">{c.labelEn}</span>
            </span>
            <button type="button" className="admin-submit admin-list-btn">
              수정
            </button>
            <button
              type="button"
              className="admin-remove-btn"
              disabled={removingId === c.id}
              onClick={() => handleRemoveCategory(c.id)}
              aria-label="카테고리 삭제"
            >
              −
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
