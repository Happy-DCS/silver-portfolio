"use client";

import { useState } from "react";
import type { WorkListItem } from "@/lib/getWorks";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import WorkThumbnail from "@/components/WorkThumbnail";
import AdminCropPicker, { type CropArea } from "./AdminCropPicker";
import AdminModal from "./AdminModal";

const FEATURED_COUNT = 5;

// 홈페이지 collage(page.tsx의 COLLAGE)에서 각 슬롯이 실제로 쓰는 비율. 관리자 그리드 자체는
// 단순 정사각형으로 통일했지만, 크롭을 정확히 잡으려면 모달 미리보기는 실제 랜딩페이지
// 비율과 같아야 한다.
const SLOT_RATIOS = ["r-169", "r-34", "r-1610", "r-34", "r-169"];
const RATIO_VALUES: Record<string, number> = {
  "r-169": 16 / 10,
  "r-34": 3 / 4,
  "r-1610": 16 / 9,
};

function centerFocalPoint(area: CropArea) {
  return { x: area.x + area.width / 2, y: area.y + area.height / 2 };
}

export default function AdminFeaturedGrid({ works }: { works: WorkListItem[] }) {
  const [slots, setSlots] = useState<(WorkListItem | null)[]>(() =>
    Array.from({ length: FEATURED_COUNT }, (_, i) => works[i] ?? null)
  );
  const [cropAreas, setCropAreas] = useState<Record<number, CropArea>>({});
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [pendingWorkId, setPendingWorkId] = useState<number | null>(null);
  const [pendingArea, setPendingArea] = useState<CropArea | undefined>(undefined);

  function openPicker(index: number) {
    const existing = slots[index];
    setPendingWorkId(existing?.id ?? null);
    setPendingArea(existing ? cropAreas[existing.id] : undefined);
    setPickerSlot(index);
  }

  function closePicker() {
    setPickerSlot(null);
  }

  function handlePickWork(work: WorkListItem) {
    setPendingWorkId(work.id);
    setPendingArea(cropAreas[work.id]);
  }

  function handleConfirm() {
    if (pickerSlot === null) return;
    const work = works.find((w) => w.id === pendingWorkId) ?? null;
    const slotIndex = pickerSlot;
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? work : s)));
    if (work && pendingArea) {
      setCropAreas((prev) => ({ ...prev, [work.id]: pendingArea }));
    }
    closePicker();
  }

  const pendingWork = works.find((w) => w.id === pendingWorkId) ?? null;
  const pickerRatioClass = pickerSlot !== null ? SLOT_RATIOS[pickerSlot] : null;

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
                  focalPoint={cropAreas[work.id] ? centerFocalPoint(cropAreas[work.id]) : undefined}
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

          {pendingWork && pickerRatioClass && (
            <div className="admin-featured-focal">
              <p className="admin-field-hint">
                왼쪽에서 드래그·스크롤로 원본 이미지를 조정하면, 오른쪽에 실제 랜딩페이지에 보일 모습이 나타납니다.
              </p>
              <AdminCropPicker
                pdfUrl={pendingWork.pdfUrl}
                aspect={RATIO_VALUES[pickerRatioClass]}
                initialArea={cropAreas[pendingWork.id]}
                onChange={setPendingArea}
              />
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
