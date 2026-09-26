export type PdfPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => {
    promise: Promise<void>;
  };
};

export type PdfDocument = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
};

export type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: string | { data: ArrayBuffer }) => { promise: Promise<PdfDocument> };
};

export const PDFJS_VERSION = "3.11.174";

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
  }
}
