import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import HomeHero from "@/components/HomeHero";
import RevealObserver from "@/components/RevealObserver";

const COLLAGE = [
  {
    p: 1,
    gridColumn: "1/7",
    ratio: "r-169",
    bg: "linear-gradient(135deg,#a0482c,#e8b64c)",
    titleEn: "GGACHI COFFEE BAR",
    titleKr: "까치커피바",
    meta: "Branding · Web — 2026",
  },
  {
    p: 2,
    gridColumn: "9/13",
    marginTop: 130,
    ratio: "r-34",
    bg: "linear-gradient(135deg,#2b3a67,#8ea7d9)",
    titleEn: "Demian, Re-covered",
    titleKr: "데미안 리커버",
    meta: "Book Design — 2025",
  },
  {
    p: 3,
    gridColumn: "2/12",
    marginTop: 170,
    ratio: "r-1610",
    bg: "linear-gradient(135deg,#2f7d43,#cfe3a8)",
    titleEn: "Luck Foraging",
    titleKr: "행운 채집 展",
    meta: "Poster · Graphic — 2025",
  },
  {
    p: 4,
    gridColumn: "1/5",
    marginTop: 170,
    ratio: "r-34",
    bg: "linear-gradient(135deg,#584a8f,#e3b8d5)",
    titleEn: "Mitjul App",
    titleKr: "밑줄",
    meta: "UI/UX — 2024",
  },
  {
    p: 6,
    gridColumn: "6/12",
    marginTop: 340,
    ratio: "r-169",
    bg: "linear-gradient(135deg,#c9541e,#f3d34a)",
    titleEn: "SPROUT Exhibition",
    titleKr: "SPROUT 전시 아이덴티티",
    meta: "Branding — 2024",
  },
];

export default function Home() {
  return (
    <>
      <HomeHero />

      <section id="works">
        <div className="container">
          <div className="collage">
            {COLLAGE.map((item) => (
              <a
                key={item.p}
                className="art"
                style={{ gridColumn: item.gridColumn, marginTop: item.marginTop }}
                href={`/works/${item.p}`}
              >
                <div className={`ph ${item.ratio}`} style={{ background: item.bg }}>
                  <em>{item.titleEn}</em>
                </div>
                <span className="lb">
                  {item.titleKr}
                  <i>{item.meta}</i>
                </span>
              </a>
            ))}
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
      <RevealObserver />
    </>
  );
}
