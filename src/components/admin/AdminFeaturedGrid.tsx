"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FeaturedSlot, WorkListItem } from "@/lib/getWorks";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import { adminFetch } from "@/lib/adminFetch";
import { centerFocalPoint } from "@/lib/cropFocalPoint";
import WorkThumbnail from "@/components/WorkThumbnail";
import { useAdminToken } from "./AdminAuthContext";
import AdminCropPicker, { type CropArea } from "./AdminCropPicker";
import AdminModal from "./AdminModal";

// 홈페이지 collage(page.tsx의 COLLAGE_LAYOUT)에서 각 슬롯이 실제로 쓰는 비율. 관리자
// 그리드 자체는 단순 정사각형으로 통일했지만, 크롭을 정확히 잡으려면 모달 미리보기는
// 실제 랜딩페이지 비율과 같아야 한다.
const SLOT_RATIOS = ["r-169", "r-34", "r-1610", "r-34", "r-169"];
const RATIO_VALUES: Record<string, number> = {
  "r-169": 16 / 10,
  "r-34": 3 / 4,
  "r-1610": 16 / 9,
};

export default function AdminFeaturedGrid({
  works,
  featuredSlots,
}: {
  works: WorkListItem[];
  featuredSlots: FeaturedSlot[];
}) {
  const router = useRouter();
  const token = useAdminToken();
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [pendingWorkId, setPendingWorkId] = useState<number | null>(null);
  const [pendingArea, setPendingArea] = useState<CropArea | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const slots = [...featuredSlots].sort((a, b) => a.slotIndex - b.slotIndex);

  function openPicker(index: number) {
    const existing = slots[index]?.work ?? null;
    setPendingWorkId(existing?.id ?? null);
    setPendingArea(slots[index]?.crop ?? undefined);
    setPickerSlot(index);
  }

  function closePicker() {
    setPickerSlot(null);
  }

  function handlePickWork(work: WorkListItem) {
    setPendingWorkId(work.id);
    const existingSlot = slots.find((s) => s.work?.id === work.id);
    setPendingArea(existingSlot?.crop ?? undefined);
  }

  async function saveSlot(workId: number | null, crop: CropArea | undefined) {
    if (pickerSlot === null) return;
    setSaving(true);
    try {
      const res = await adminFetch(token, `/api/admin/featured-slots/${pickerSlot}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId, crop: workId ? (crop ?? null) : null }),
      });
      if (res.ok) {
        router.refresh();
        closePicker();
      }
    } finally {
      setSaving(false);
    }
  }

  const pendingWork = works.find((w) => w.id === pendingWorkId) ?? null;
  const pickerRatioClass = pickerSlot !== null ? SLOT_RATIOS[pickerSlot] : null;

  return (
    <>
      <div className="admin-featured-grid">
        {slots.map((slot, i) => (
          <button key={slot.slotIndex} type="button" className="admin-featured-slot" onClick={() => openPicker(i)}>
            {slot.work ? (
              <div className="ph">
                <WorkThumbnail
                  pdfUrl={slot.work.pdfUrl}
                  fallbackBg={categoryGradient(slot.work.categories[0]?.slug)}
                  accentColor={categoryAccent(slot.work.categories[0]?.slug)}
                  label={slot.work.titleEn}
                  focalPoint={slot.crop ? centerFocalPoint(slot.crop) : undefined}
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
                initialArea={pendingArea}
                onChange={setPendingArea}
              />
            </div>
          )}

          <div className="admin-featured-picker-actions">
            <button
              type="button"
              className="admin-submit"
              onClick={() => saveSlot(pendingWorkId, pendingArea)}
              disabled={!pendingWork || saving}
            >
              {saving ? "저장 중…" : "적용"}
            </button>
            <button
              type="button"
              className="admin-submit admin-list-btn"
              onClick={() => saveSlot(null, undefined)}
              disabled={saving}
            >
              슬롯 비우기
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
