"use client";

import { useRouter } from "next/navigation";
import { useState, type DragEvent } from "react";
import type { AdminCategory, AdminCategoryGroup } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";
import AdminCategoryEditForm from "./AdminCategoryEditForm";
import AdminModal from "./AdminModal";

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
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [blockedDeleteMessage, setBlockedDeleteMessage] = useState<string | null>(null);

  const groupedIds = new Set(categoryGroups.flatMap((g) => g.categoryIds));
  const pool = categories.filter((c) => !groupedIds.has(c.id));
  const catById = new Map(categories.map((c) => [c.id, c]));

  async function handleRemoveCategory(id: number) {
    setRemovingId(id);
    try {
      const res = await adminFetch(token, `/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setBlockedDeleteMessage(data?.error ?? "삭제에 실패했습니다.");
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

  async function handleDropOnGroup(e: DragEvent, group: AdminCategoryGroup) {
    e.preventDefault();
    setDragOverId(null);
    const id = Number(e.dataTransfer.getData(DRAG_TYPE));
    if (!id || group.categoryIds.includes(id)) return;

    setPending(true);
    try {
      const res = await adminFetch(token, `/api/admin/category-groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: [...group.categoryIds, id] }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDropNewGroup(e: DragEvent) {
    e.preventDefault();
    setDragOverId(null);
    const id = Number(e.dataTransfer.getData(DRAG_TYPE));
    if (!id) return;

    setPending(true);
    try {
      const res = await adminFetch(token, "/api/admin/category-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: [id] }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleRemoveFromGroup(group: AdminCategoryGroup, categoryId: number) {
    setPending(true);
    try {
      const nextIds = group.categoryIds.filter((id) => id !== categoryId);
      const res = await adminFetch(token, `/api/admin/category-groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: nextIds }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-section-block">
      <div className="admin-section-head">
        <h2>카테고리</h2>
        <span className="admin-count">{categories.length}</span>
      </div>

      <p className="admin-lineup-hint">아래 카테고리를 드래그해서 works 페이지 필터에 보일 묶음을 구성하세요.</p>
      <div className={pending ? "admin-lineup admin-lineup--pending" : "admin-lineup"}>
        {categoryGroups.map((g) => (
          <div
            key={g.id}
            className={
              dragOverId === String(g.id) ? "admin-lineup-group admin-lineup-group--over" : "admin-lineup-group"
            }
            onDragOver={(e) => handleDragOver(e, String(g.id))}
            onDragLeave={() => setDragOverId((prev) => (prev === String(g.id) ? null : prev))}
            onDrop={(e) => handleDropOnGroup(e, g)}
          >
            {g.categoryIds.map((id) => {
              const cat = catById.get(id);
              if (!cat) return null;
              return (
                <span key={id} className="admin-lineup-chip">
                  {cat.labelKr}
                  <button
                    type="button"
                    onClick={() => handleRemoveFromGroup(g, id)}
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
            <button
              type="button"
              className="admin-submit admin-list-btn"
              onClick={() => setEditingCategory(c)}
            >
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

      <AdminModal open={editingCategory !== null} onClose={() => setEditingCategory(null)} title="카테고리 수정">
        {editingCategory && (
          <AdminCategoryEditForm
            category={editingCategory}
            onSaved={() => {
              setEditingCategory(null);
              router.refresh();
            }}
          />
        )}
      </AdminModal>

      <AdminModal
        open={blockedDeleteMessage !== null}
        onClose={() => setBlockedDeleteMessage(null)}
        title="삭제할 수 없습니다"
      >
        <p className="admin-modal-message">{blockedDeleteMessage}</p>
      </AdminModal>
    </div>
  );
}
