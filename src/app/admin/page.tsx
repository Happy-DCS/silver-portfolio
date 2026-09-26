import AdminGate from "@/components/admin/AdminGate";
import { getAdminCategories, getAdminCategoryGroups, getFeaturedSlots, getWorks } from "@/lib/getWorks";

export default async function AdminPage() {
  const [works, categories, categoryGroups, featuredSlots] = await Promise.all([
    getWorks(),
    getAdminCategories(),
    getAdminCategoryGroups(),
    getFeaturedSlots(),
  ]);

  return (
    <div className="admin-page">
      <div className="container">
        <AdminGate works={works} categories={categories} categoryGroups={categoryGroups} featuredSlots={featuredSlots} />
      </div>
    </div>
  );
}
