import AdminGate from "@/components/admin/AdminGate";
import { getAdminCategories, getAdminCategoryGroups, getFeaturedSlots, getWorks } from "@/lib/getWorks";
import { getProfile } from "@/lib/getProfile";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [works, categories, categoryGroups, featuredSlots, profile] = await Promise.all([
    getWorks(),
    getAdminCategories(),
    getAdminCategoryGroups(),
    getFeaturedSlots(),
    getProfile(),
  ]);

  return (
    <div className="admin-page">
      <div className="container">
        <AdminGate
          works={works}
          categories={categories}
          categoryGroups={categoryGroups}
          featuredSlots={featuredSlots}
          profile={profile}
        />
      </div>
    </div>
  );
}
