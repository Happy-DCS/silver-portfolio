"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const PDFJS_VERSION = "3.11.174";

type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (path: string) => { promise: Promise<PdfDocument> };
};

type PdfDocument = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
};

type PdfPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => {
    promise: Promise<void>;
  };
};

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
  }
}

type Status = "loading" | "rendered" | "error";

export default function WorkPdfViewer({ pdfPath, hasPdf }: { pdfPath: string; hasPdf: boolean }) {
  const pagesRef = useRef<HTMLDivElement>(null);
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const [status, setStatus] = useState<Status>(hasPdf ? "loading" : "error");

  useEffect(() => {
    if (!hasPdf) return;
    const pagesBox = pagesRef.current;
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsReady || !pagesBox || !pdfjsLib) return;

    let cancelled = false;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

    pdfjsLib
      .getDocument(pdfPath)
      .promise.then(async (pdf) => {
        const cw = pagesBox.clientWidth;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const v0 = page.getViewport({ scale: 1 });
          const scale = cw / v0.width;
          const vp = page.getViewport({ scale: scale * dpr });
          const canvas = document.createElement("canvas");
          const { width, height } = vp as { width: number; height: number };
          canvas.width = width;
          canvas.height = height;
          pagesBox.appendChild(canvas);
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
        }
        if (!cancelled) setStatus("rendered");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [pdfjsReady, pdfPath, hasPdf]);

  return (
    <>
      {hasPdf && (
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`}
          onReady={() => setPdfjsReady(true)}
          onError={() => setStatus("error")}
        />
      )}
      <div className="wk-pages" ref={pagesRef} />
      {status !== "rendered" && (
        <div className="wk-status">
          {status === "loading" && <p className="wk-status-loading">불러오는 중…</p>}
          {status === "error" && (
            <p>
              <b>PDF를 불러오는 중 문제가 발생했습니다.</b>
            </p>
          )}
        </div>
      )}
    </>
  );
}
