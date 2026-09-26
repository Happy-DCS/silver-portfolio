"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import PhLabel from "@/components/PhLabel";
import { PDFJS_VERSION } from "@/lib/pdfjs";

// 같은 작업물이 여러 슬롯/카드에 동시에 표시될 때, 동일한 PDF를 두 번 내려받지
// 않도록 바이트만 공유한다. PDFDocumentProxy/PDFPageProxy 자체는 pdf.js가
// 페이지 단위로 캐싱해 공유하기 때문에, 그걸 그대로 공유하면 같은 페이지 객체에
// 동시에 render()가 두 번 걸려 한쪽이 조용히 실패한다 — 그래서 각 인스턴스가
// 받아온 바이트의 복사본으로 자기만의 문서 객체를 새로 연다.
const pdfBufferCache = new Map<string, Promise<ArrayBuffer>>();

function loadPdfBuffer(pdfUrl: string): Promise<ArrayBuffer> {
  const cached = pdfBufferCache.get(pdfUrl);
  if (cached) return cached;

  const promise = fetch(pdfUrl).then((res) => {
    if (!res.ok) throw new Error(`PDF를 불러오지 못했습니다: ${res.status}`);
    return res.arrayBuffer();
  });
  pdfBufferCache.set(pdfUrl, promise);
  promise.catch(() => pdfBufferCache.delete(pdfUrl));
  return promise;
}

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function WorkThumbnail({
  pdfUrl,
  fallbackBg,
  accentColor,
  label,
  focalPoint,
}: {
  pdfUrl: string | null;
  fallbackBg: string;
  accentColor: string;
  label: string;
  focalPoint?: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const [failed, setFailed] = useState(!pdfUrl);

  useEffect(() => {
    if (!pdfUrl) return;
    const canvas = canvasRef.current;
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsReady || !canvas || !pdfjsLib) return;

    let cancelled = false;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

    loadPdfBuffer(pdfUrl)
      .then(async (buffer) => {
        if (cancelled) return;
        const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        const cw = canvas.parentElement?.clientWidth ?? 400;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const v0 = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: (cw / v0.width) * dpr });
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [pdfjsReady, pdfUrl]);

  if (failed) {
    return (
      <div className="ph-fallback" style={{ background: fallbackBg }}>
        <PhLabel>{label}</PhLabel>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`}
        onReady={() => setPdfjsReady(true)}
        onError={() => setFailed(true)}
      />
      <canvas
        ref={canvasRef}
        className="ph-canvas"
        style={focalPoint ? { objectPosition: `${focalPoint.x}% ${focalPoint.y}%` } : undefined}
      />
      <div className="ph-tint" style={{ background: fallbackBg }} />
      <div
        className="ph-scrim"
        style={{
          background: `linear-gradient(to top, ${hexToRgba(accentColor, 0.75)}, ${hexToRgba(accentColor, 0)} 55%)`,
        }}
      />
      <PhLabel>{label}</PhLabel>
    </>
  );
}
