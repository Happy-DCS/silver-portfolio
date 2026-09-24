import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import WorksGrid from "@/components/WorksGrid";
import { getCategories, getWorks } from "@/lib/getWorks";

export default async function WorksPage() {
  const [works, categories] = await Promise.all([getWorks(), getCategories()]);

  return (
    <>
      <div className="container page-head">
        <h1>
          <span className="line1">
            <span className="l-en">
              ALL <em>works</em>
            </span>
            <span className="l-kr">
              <span className="oj">모든</span> 작업들
            </span>
          </span>
        </h1>
      </div>

      <WorksGrid works={works} categories={categories} />

      <Footer />
      <TopButton />
    </>
  );
}
