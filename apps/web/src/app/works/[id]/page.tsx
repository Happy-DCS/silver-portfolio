import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import WorkPdfViewer from "@/components/WorkPdfViewer";
import { WORKS, getWorkById } from "@/data/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ id: String(w.p) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/works/[id]">): Promise<Metadata> {
  const { id } = await params;
  const work = getWorkById(Number(id));
  if (!work) return {};
  return { title: `${work.titleKr} — Silver Eun Cho` };
}

export default async function WorkDetailPage({ params }: PageProps<"/works/[id]">) {
  const { id } = await params;
  const work = getWorkById(Number(id));
  if (!work) notFound();

  const index = WORKS.findIndex((w) => w.p === work.p);
  const prev = WORKS[(index - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(index + 1) % WORKS.length];
  const pdfPath = `/assets/pdf/work${work.p}.pdf`;
  const hasPdf = existsSync(path.join(process.cwd(), "public", "assets", "pdf", `work${work.p}.pdf`));

  return (
    <>
      <div className="container wk-head">
        <Link className="wk-back" href="/works">
          ← All Works
        </Link>
        <h1>{work.titleKr}</h1>
        <span className="en">{work.titleEn}</span>
        <div className="wk-meta">
          <span>{work.year}</span>
          <span>{work.catLabel}</span>
        </div>
      </div>

      <div className="container wk-view">
        <WorkPdfViewer key={work.p} pdfPath={pdfPath} hasPdf={hasPdf} />
      </div>

      <div className="container wk-nav">
        <div className="wk-nav-line" />
        <div className="wk-nav-row">
          <Link href={`/works/${prev.p}`}>
            <span className="dir">← Prev</span>
            <span className="ttl">{prev.titleKr}</span>
          </Link>
          <Link className="all" href="/works">
            All Works
          </Link>
          <Link className="nx" href={`/works/${next.p}`}>
            <span className="dir">Next →</span>
            <span className="ttl">{next.titleKr}</span>
          </Link>
        </div>
      </div>

      <Footer />
      <TopButton />
    </>
  );
}
