"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import PhLabel from "@/components/PhLabel";
import { PDFJS_VERSION } from "@/lib/pdfjs";

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

    pdfjsLib
      .getDocument(pdfUrl)
      .promise.then(async (pdf) => {
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
