"use client";

import { useEffect, useRef, useState } from "react";
import PhLabel from "@/components/PhLabel";
import { PDFJS_VERSION, type PdfJsLib } from "@/lib/pdfjs";

const PDFJS_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;

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

// next/script의 onReady는 같은 src로 여러 컴포넌트가 동시에 마운트될 때 일부
// 인스턴스에서 누락되는 경우가 있었다(썸네일 여러 개가 한 화면에 뜰 때 일부만
// 로딩됨). 대신 스크립트 태그를 직접 한 번만 주입하고, 이후 요청은 전부 같은
// Promise를 공유해 모든 인스턴스가 확실히 알림을 받게 한다.
let pdfJsLoadPromise: Promise<PdfJsLib> | null = null;

function loadPdfJsLib(): Promise<PdfJsLib> {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfJsLoadPromise) return pdfJsLoadPromise;

  pdfJsLoadPromise = new Promise<PdfJsLib>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PDFJS_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => {
      if (window.pdfjsLib) resolve(window.pdfjsLib);
      else reject(new Error("pdf.js 로드에 실패했습니다."));
    });
    script.addEventListener("error", () => reject(new Error("pdf.js 스크립트를 불러오지 못했습니다.")));
    if (!existing) {
      script.src = PDFJS_SRC;
      document.head.appendChild(script);
    }
  });
  pdfJsLoadPromise.catch(() => {
    pdfJsLoadPromise = null;
  });
  return pdfJsLoadPromise;
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
  const [failed, setFailed] = useState(!pdfUrl);

  useEffect(() => {
    if (!pdfUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    loadPdfJsLib()
      .then(async (pdfjsLib) => {
        if (cancelled) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

        const buffer = await loadPdfBuffer(pdfUrl);
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
  }, [pdfUrl]);

  if (failed) {
    return (
      <div className="ph-fallback" style={{ background: fallbackBg }}>
        <PhLabel>{label}</PhLabel>
      </div>
    );
  }

  return (
    <>
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
