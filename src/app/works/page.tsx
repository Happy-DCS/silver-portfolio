import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";
import WorksGrid from "@/components/WorksGrid";
import { getCategoryGroups, getWorks } from "@/lib/getWorks";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const [works, categoryGroups] = await Promise.all([getWorks(), getCategoryGroups()]);

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

      <WorksGrid works={works} categoryGroups={categoryGroups} />

      <Footer />
      <TopButton />
    </>
  );
}
