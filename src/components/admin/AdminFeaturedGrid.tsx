"use client";

import { useState, type MouseEvent } from "react";
import type { WorkListItem } from "@/lib/getWorks";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import WorkThumbnail from "@/components/WorkThumbnail";
import AdminModal from "./AdminModal";

const FEATURED_COUNT = 5;

type FocalPoint = { x: number; y: number };

export default function AdminFeaturedGrid({ works }: { works: WorkListItem[] }) {
  const [slots, setSlots] = useState<(WorkListItem | null)[]>(() =>
    Array.from({ length: FEATURED_COUNT }, (_, i) => works[i] ?? null)
  );
  const [focalPoints, setFocalPoints] = useState<Record<number, FocalPoint>>({});
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [pendingWorkId, setPendingWorkId] = useState<number | null>(null);
  const [pendingFocal, setPendingFocal] = useState<FocalPoint>({ x: 50, y: 50 });

  function openPicker(index: number) {
    const existing = slots[index];
    setPendingWorkId(existing?.id ?? null);
    setPendingFocal(existing ? focalPoints[existing.id] ?? { x: 50, y: 50 } : { x: 50, y: 50 });
    setPickerSlot(index);
  }

  function closePicker() {
    setPickerSlot(null);
  }

  function handlePickWork(work: WorkListItem) {
    setPendingWorkId(work.id);
    setPendingFocal(focalPoints[work.id] ?? { x: 50, y: 50 });
  }

  function handleFocalClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPendingFocal({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  }

  function handleConfirm() {
    if (pickerSlot === null) return;
    const work = works.find((w) => w.id === pendingWorkId) ?? null;
    const slotIndex = pickerSlot;
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? work : s)));
    if (work) {
      setFocalPoints((prev) => ({ ...prev, [work.id]: pendingFocal }));
    }
    closePicker();
  }

  const pendingWork = works.find((w) => w.id === pendingWorkId) ?? null;

  return (
    <>
      <div className="admin-featured-grid">
        {slots.map((work, i) => (
          <button key={i} type="button" className="admin-featured-slot" onClick={() => openPicker(i)}>
            {work ? (
              <div className="ph">
                <WorkThumbnail
                  pdfUrl={work.pdfUrl}
                  fallbackBg={categoryGradient(work.categories[0]?.slug)}
                  accentColor={categoryAccent(work.categories[0]?.slug)}
                  label={work.titleEn}
                  focalPoint={focalPoints[work.id]}
                />
              </div>
            ) : (
              <div className="ph admin-featured-empty">+ 선택</div>
            )}
          </button>
        ))}
      </div>

      <AdminModal open={pickerSlot !== null} onClose={closePicker} title="대표 작업물 선택">
        <div className="admin-featured-picker">
          <div className="admin-featured-picker-list">
            {works.map((w) => (
              <button
                key={w.id}
                type="button"
                className={
                  pendingWorkId === w.id
                    ? "admin-category-chip admin-category-chip--active"
                    : "admin-category-chip"
                }
                onClick={() => handlePickWork(w)}
              >
                {w.titleKr}
              </button>
            ))}
          </div>

          {pendingWork && (
            <div className="admin-featured-focal">
              <p className="admin-field-hint">이미지를 클릭해서 보여줄 위치(포컬 포인트)를 지정하세요.</p>
              <div className="admin-featured-focal-preview" onClick={handleFocalClick}>
                <WorkThumbnail
                  pdfUrl={pendingWork.pdfUrl}
                  fallbackBg={categoryGradient(pendingWork.categories[0]?.slug)}
                  accentColor={categoryAccent(pendingWork.categories[0]?.slug)}
                  label={pendingWork.titleEn}
                  focalPoint={pendingFocal}
                />
                <span className="admin-focal-dot" style={{ left: `${pendingFocal.x}%`, top: `${pendingFocal.y}%` }} />
              </div>
            </div>
          )}

          <button type="button" className="admin-submit" onClick={handleConfirm} disabled={!pendingWork}>
            적용
          </button>
        </div>
      </AdminModal>
    </>
  );
}
