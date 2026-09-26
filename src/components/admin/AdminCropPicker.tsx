"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { PDFJS_VERSION } from "@/lib/pdfjs";

export type CropArea = Area;

type PdfPageImageResult = { pdfUrl: string; imageUrl: string | null };

function usePdfPageImage(pdfUrl: string | null, ready: boolean) {
  const [result, setResult] = useState<PdfPageImageResult | null>(null);

  useEffect(() => {
    if (!pdfUrl || !ready) return;
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) return;

    let cancelled = false;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

    pdfjsLib
      .getDocument(pdfUrl)
      .promise.then(async (pdf) => {
        if (cancelled) return;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setResult({ pdfUrl, imageUrl: canvas.toDataURL("image/png") });
      })
      .catch(() => {
        if (!cancelled) setResult({ pdfUrl, imageUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, [pdfUrl, ready]);

  const current = result && result.pdfUrl === pdfUrl ? result : null;
  return { imageUrl: current?.imageUrl ?? null, failed: current !== null && current.imageUrl === null };
}

export default function AdminCropPicker({
  pdfUrl,
  aspect,
  initialArea,
  onChange,
}: {
  pdfUrl: string | null;
  aspect: number;
  initialArea?: CropArea;
  onChange: (area: CropArea) => void;
}) {
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const { imageUrl, failed } = usePdfPageImage(pdfUrl, pdfjsReady);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [resultArea, setResultArea] = useState<CropArea | null>(initialArea ?? null);

  function handleCropComplete(croppedAreaPercent: Area) {
    setResultArea(croppedAreaPercent);
    onChange(croppedAreaPercent);
  }

  return (
    <div className="admin-crop-split">
      <Script
        src={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`}
        onReady={() => setPdfjsReady(true)}
      />

      <div className="admin-crop-source">
        {imageUrl ? (
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            restrictPosition
            initialCroppedAreaPercentages={initialArea}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        ) : failed ? (
          <p className="admin-field-hint">원본 이미지를 불러오지 못했습니다.</p>
        ) : (
          <p className="admin-field-hint">원본 이미지를 불러오는 중…</p>
        )}
      </div>

      <div className="admin-crop-result" style={{ aspectRatio: aspect }}>
        {imageUrl && resultArea && (
          <img
            src={imageUrl}
            alt=""
            style={{
              position: "absolute",
              width: `${10000 / resultArea.width}%`,
              height: `${10000 / resultArea.height}%`,
              left: `${(-resultArea.x * 100) / resultArea.width}%`,
              top: `${(-resultArea.y * 100) / resultArea.height}%`,
              maxWidth: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
