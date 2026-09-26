"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Script from "next/script";
import type { AdminCategory } from "@/lib/getWorks";
import { adminFetch } from "@/lib/adminFetch";
import { PDFJS_VERSION } from "@/lib/pdfjs";
import { slugify } from "@/lib/slugify";
import { useAdminToken } from "./AdminAuthContext";

type DraftCategory = {
  id: string;
  labelKr: string;
  labelEn: string;
};

type RatioStatus = "idle" | "loading" | "done" | "error";

export default function AdminWorkForm({
  categories,
  onCreated,
}: {
  categories: AdminCategory[];
  onCreated: () => void;
}) {
  const token = useAdminToken();
  const [titleKr, setTitleKr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [draftCategories, setDraftCategories] = useState<DraftCategory[]>([]);
  const [selectedDraftIds, setSelectedDraftIds] = useState<Set<string>>(new Set());
  const [newCategoryLabelKr, setNewCategoryLabelKr] = useState("");
  const [newCategoryLabelEn, setNewCategoryLabelEn] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [ratioStatus, setRatioStatus] = useState<RatioStatus>("idle");
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleDraftCategory(id: string) {
    setSelectedDraftIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddDraftCategory() {
    const labelKr = newCategoryLabelKr.trim();
    const labelEn = newCategoryLabelEn.trim();
    if (!labelKr || !labelEn) return;
    const id = slugify(labelEn);
    if (draftCategories.some((d) => d.id === id)) {
      setNewCategoryLabelKr("");
      setNewCategoryLabelEn("");
      return;
    }
    setDraftCategories((prev) => [...prev, { id, labelKr, labelEn }]);
    setSelectedDraftIds((prev) => new Set(prev).add(id));
    setNewCategoryLabelKr("");
    setNewCategoryLabelEn("");
  }

  async function handlePdfChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPdfFile(file);
    setRatio(null);

    if (!file) {
      setRatioStatus("idle");
      return;
    }
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsReady || !pdfjsLib) {
      setRatioStatus("error");
      return;
    }

    setRatioStatus("loading");
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      setRatio(viewport.width / viewport.height);
      setRatioStatus("done");
    } catch {
      setRatioStatus("error");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pdfFile) return;
    setError(null);
    setSubmitting(true);

    try {
      const drafts = draftCategories.filter((d) => selectedDraftIds.has(d.id));
      const form = new FormData();
      form.set("titleKr", titleKr);
      form.set("titleEn", titleEn);
      form.set("year", year);
      form.set("description", description);
      form.set("ratio", String(ratio ?? 1));
      form.set("categoryIds", JSON.stringify([...selectedIds]));
      form.set("newCategories", JSON.stringify(drafts.map((d) => ({ labelKr: d.labelKr, labelEn: d.labelEn }))));
      form.set("pdf", pdfFile);

      const res = await adminFetch(token, "/api/admin/works", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "작업물 저장에 실패했습니다.");
        return;
      }
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-work-form" onSubmit={handleSubmit}>
      <Script
        src={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`}
        onReady={() => setPdfjsReady(true)}
      />

      <div className="admin-field">
        <label htmlFor="work-title-kr">제목 (한글)</label>
        <input id="work-title-kr" value={titleKr} onChange={(e) => setTitleKr(e.target.value)} required />
      </div>

      <div className="admin-field">
        <label htmlFor="work-title-en">제목 (영문)</label>
        <input id="work-title-en" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
      </div>

      <div className="admin-field">
        <label htmlFor="work-year">작업 연도</label>
        <input
          id="work-year"
          type="number"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="work-description">설명</label>
        <textarea
          id="work-description"
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
          {draftCategories.map((d) => (
            <button
              key={d.id}
              type="button"
              className={
                selectedDraftIds.has(d.id)
                  ? "admin-category-chip admin-category-chip--active"
                  : "admin-category-chip"
              }
              onClick={() => toggleDraftCategory(d.id)}
            >
              {d.labelKr}
              <span className="admin-category-chip-new">new</span>
            </button>
          ))}
        </div>
        <div className="admin-category-add">
          <input
            placeholder="새 카테고리 (한글)"
            value={newCategoryLabelKr}
            onChange={(e) => setNewCategoryLabelKr(e.target.value)}
          />
          <input
            placeholder="새 카테고리 (영문)"
            value={newCategoryLabelEn}
            onChange={(e) => setNewCategoryLabelEn(e.target.value)}
          />
          <button type="button" className="admin-submit admin-list-btn" onClick={handleAddDraftCategory}>
            + 추가
          </button>
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="work-pdf">PDF 파일</label>
        <input id="work-pdf" type="file" accept="application/pdf" onChange={handlePdfChange} required />
        {pdfFile && <p className="admin-field-hint">{pdfFile.name}</p>}
        {ratioStatus === "loading" && <p className="admin-field-hint">비율 계산 중…</p>}
        {ratioStatus === "done" && ratio !== null && (
          <p className="admin-field-hint">자동 계산된 비율(width/height): {ratio.toFixed(3)}</p>
        )}
        {ratioStatus === "error" && <p className="admin-field-hint">비율을 계산하지 못했습니다.</p>}
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="admin-submit" disabled={submitting}>
        {submitting ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
