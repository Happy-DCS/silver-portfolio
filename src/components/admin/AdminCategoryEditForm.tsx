"use client";

import { useState, type FormEvent } from "react";
import type { AdminCategory } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";

export default function AdminCategoryEditForm({
  category,
  onSaved,
}: {
  category: AdminCategory;
  onSaved: () => void;
}) {
  const token = useAdminToken();
  const [labelKr, setLabelKr] = useState(category.labelKr);
  const [labelEn, setLabelEn] = useState(category.labelEn);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await adminFetch(token, `/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labelKr, labelEn }),
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

  return (
    <form className="admin-work-form" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label htmlFor="category-label-kr">라벨 (한글)</label>
        <input id="category-label-kr" value={labelKr} onChange={(e) => setLabelKr(e.target.value)} required />
      </div>

      <div className="admin-field">
        <label htmlFor="category-label-en">라벨 (영문)</label>
        <input id="category-label-en" value={labelEn} onChange={(e) => setLabelEn(e.target.value)} required />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="admin-submit" disabled={submitting}>
        {submitting ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
