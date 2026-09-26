"use client";

import { useState, type FormEvent } from "react";
import type { AdminCategory, WorkListItem } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";

export default function AdminWorkEditForm({
  work,
  categories,
  locked,
  onSaved,
  onDeleted,
}: {
  work: WorkListItem;
  categories: AdminCategory[];
  locked: boolean;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const token = useAdminToken();
  const [titleKr, setTitleKr] = useState(work.titleKr);
  const [titleEn, setTitleEn] = useState(work.titleEn);
  const [year, setYear] = useState(String(work.year));
  const [description, setDescription] = useState(work.description);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(categories.filter((c) => work.categories.some((wc) => wc.slug === c.slug)).map((c) => c.id))
  );
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await adminFetch(token, `/api/admin/works/${work.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleKr,
          titleEn,
          year: Number(year),
          description,
          categoryIds: [...selectedIds],
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "저장에 실패했습니다.");
        return;
      }
      onSaved();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (locked) return;
    if (!window.confirm(`"${work.titleKr}"을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setError(null);
    setDeleting(true);
    try {
      const res = await adminFetch(token, `/api/admin/works/${work.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "삭제에 실패했습니다.");
        return;
      }
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form className="admin-work-form" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label htmlFor="edit-work-title-kr">제목 (한글)</label>
        <input id="edit-work-title-kr" value={titleKr} onChange={(e) => setTitleKr(e.target.value)} required />
      </div>

      <div className="admin-field">
        <label htmlFor="edit-work-title-en">제목 (영문)</label>
        <input id="edit-work-title-en" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
      </div>

      <div className="admin-field">
        <label htmlFor="edit-work-year">작업 연도</label>
        <input
          id="edit-work-year"
          type="number"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="edit-work-description">설명</label>
        <textarea
          id="edit-work-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label>카테고리</label>
        <div className="admin-category-picker">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={
                selectedIds.has(c.id) ? "admin-category-chip admin-category-chip--active" : "admin-category-chip"
              }
              onClick={() => toggleCategory(c.id)}
            >
              {c.labelKr}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-work-form-actions">
        <button type="submit" className="admin-submit" disabled={submitting || deleting}>
          {submitting ? "저장 중…" : "저장"}
        </button>
        <button
          type="button"
          className="admin-submit admin-danger-btn"
          disabled={locked || submitting || deleting}
          onClick={handleDelete}
          title={locked ? "대표 작업물은 삭제할 수 없습니다" : undefined}
        >
          {deleting ? "삭제 중…" : locked ? "삭제 (대표 작업물 해제 필요)" : "삭제"}
        </button>
      </div>
    </form>
  );
}
