import AdminGate from "@/components/admin/AdminGate";
import { getWorks } from "@/lib/getWorks";

export default async function AdminPage() {
  const works = await getWorks();

  return (
    <div className="admin-page">
      <div className="container">
        <AdminGate works={works} />
      </div>
    </div>
  );
}
