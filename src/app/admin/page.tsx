import AdminGate from "@/components/admin/AdminGate";
import { getAdminCategories, getAdminCategoryGroups, getWorks } from "@/lib/getWorks";

export default async function AdminPage() {
  const [works, categories, categoryGroups] = await Promise.all([
    getWorks(),
    getAdminCategories(),
    getAdminCategoryGroups(),
  ]);

  return (
    <div className="admin-page">
      <div className="container">
        <AdminGate works={works} categories={categories} categoryGroups={categoryGroups} />
      </div>
    </div>
  );
}
