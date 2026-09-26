import type { CSSProperties } from "react";
import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import HomeHero from "@/components/HomeHero";
import WorkThumbnail from "@/components/WorkThumbnail";
import { categoryAccent, categoryGradient } from "@/lib/categoryColor";
import { centerFocalPoint } from "@/lib/cropFocalPoint";
import { getFeaturedSlots, type FeaturedSlot } from "@/lib/getWorks";

// 320px(모바일 최소)~1340px(컨테이너 최대) 사이를 선형 보간해 마진을 유동적으로 줄인다.
function fluidMargin(max: number, floor = Math.round(max * 0.3)) {
  const coeff = (max - floor) / 1020;
  return `clamp(${floor}px, calc(${floor}px + (100vw - 320px) * ${coeff.toFixed(5)}), ${max}px)`;
}

// featured_slots의 slot_index(0~4) 순서에 대응하는 콜라주 배치 정보.
const COLLAGE_LAYOUT = [
  { gridColumn: "1/7", ratio: "r-169" },
  { gridColumn: "9/13", marginTop: 130, ratio: "r-34" },
  { gridColumn: "2/12", marginTop: 170, ratio: "r-1610" },
  { gridColumn: "1/5", marginTop: 170, ratio: "r-34" },
  { gridColumn: "6/12", marginTop: 340, ratio: "r-169" },
];

type CollageItem = { layout: (typeof COLLAGE_LAYOUT)[number]; slot: FeaturedSlot | undefined };

export default async function Home() {
  const featuredSlots = await getFeaturedSlots();
  const slots = [...featuredSlots].sort((a, b) => a.slotIndex - b.slotIndex);
  const items: CollageItem[] = COLLAGE_LAYOUT.map((layout, i) => ({ layout, slot: slots[i] }));

  return (
    <>
      <HomeHero />

      <section id="works">
        <div className="container">
          <div className="collage">
            {items.map(({ layout, slot }, i) => {
              const work = slot?.work ?? null;
              const style = {
                "--gc": layout.gridColumn,
                "--mt": layout.marginTop ? fluidMargin(layout.marginTop) : "0px",
              } as CSSProperties;

              if (!work) {
                return (
                  <div key={i} className="art art--empty" style={style}>
                    <div className={`ph ${layout.ratio} ph-placeholder`} />
                    <span className="lb">기대해주세요</span>
                  </div>
                );
              }

              return (
                <a key={i} className="art" style={style} href={`/works/${work.id}`}>
                  <div className={`ph ${layout.ratio}`}>
                    <WorkThumbnail
                      pdfUrl={work.pdfUrl}
                      fallbackBg={categoryGradient(work.categories[0]?.slug)}
                      accentColor={categoryAccent(work.categories[0]?.slug)}
                      label={work.titleEn}
                      focalPoint={slot?.crop ? centerFocalPoint(slot.crop) : undefined}
                    />
                  </div>
                  <span className="lb">
                    {work.titleKr}
                    <i>
                      {work.categories.map((c) => c.label).join(" · ")} — {work.year}
                    </i>
                  </span>
                </a>
              );
            })}
          </div>
          <p className="col-more">
            <a href="/works">
              <span className="bw">
                <span className="b-en">View all works →</span>
                <span className="b-kr">모든 작업 보기 →</span>
              </span>
            </a>
          </p>
        </div>
      </section>

      <Footer />
      <TopButton />
    </>
  );
}
