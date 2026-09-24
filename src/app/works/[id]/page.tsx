import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import WorkPdfViewer from "@/components/WorkPdfViewer";
import { getWorkById, getWorks } from "@/lib/getWorks";

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((w) => ({ id: String(w.id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/works/[id]">): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkById(Number(id));
  if (!work) return {};
  return { title: `${work.titleKr} — Silver Eun Cho` };
}

export default async function WorkDetailPage({ params }: PageProps<"/works/[id]">) {
  const { id } = await params;
  const work = await getWorkById(Number(id));
  if (!work) notFound();

  const works = await getWorks();
  const index = works.findIndex((w) => w.id === work.id);
  const prev = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <>
      <div className="container wk-head">
        <Link className="wk-back" href="/works">
          ← All Works
        </Link>
        <h1>{work.titleKr}</h1>
        <span className="en">{work.titleEn}</span>
        <div className="wk-meta">
          <div className="wk-tags">
            <span>{work.year}</span>
            <span>{work.categories.map((c) => c.label).join(" · ")}</span>
          </div>
          {work.pdfUrl && (
            <a className="wk-download" href={work.pdfUrl} download target="_blank" rel="noopener">
              <Image src="/assets/img/download.png" alt="PDF 다운로드" width={20} height={20} />
            </a>
          )}
        </div>
      </div>

      <div className="container wk-view">
        <WorkPdfViewer key={work.id} pdfPath={work.pdfUrl ?? ""} hasPdf={!!work.pdfUrl} />
      </div>

      <div className="container wk-nav">
        <div className="wk-nav-line" />
        <div className="wk-nav-row">
          <Link href={`/works/${prev.id}`}>
            <span className="dir">← Prev</span>
            <span className="ttl">{prev.titleKr}</span>
          </Link>
          <Link className="all" href="/works">
            All Works
          </Link>
          <Link className="nx" href={`/works/${next.id}`}>
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
