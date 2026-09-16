import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";

export default function AboutPage() {
  return (
    <>
      <main style={{ paddingTop: "72px", minHeight: "60vh" }}>
        <div className="container" style={{ padding: "160px 50px" }}>
          <p>소개 · CV는 다음 단계에서 이식합니다.</p>
        </div>
      </main>
      <Footer />
      <TopButton />
    </>
  );
}
