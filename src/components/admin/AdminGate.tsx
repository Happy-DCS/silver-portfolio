"use client";

import { useState } from "react";
import type { AdminCategory, AdminCategoryGroup, FeaturedSlot, WorkListItem } from "@/lib/getWorks";
import { AdminAuthProvider } from "./AdminAuthContext";
import AdminLoginForm from "./AdminLoginForm";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminWorksPanel from "./AdminWorksPanel";

export default function AdminGate({
  works,
  categories,
  categoryGroups,
  featuredSlots,
}: {
  works: WorkListItem[];
  categories: AdminCategory[];
  categoryGroups: AdminCategoryGroup[];
  featuredSlots: FeaturedSlot[];
}) {
  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return <AdminLoginForm onSuccess={setToken} />;
  }

  return (
    <AdminAuthProvider token={token}>
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Admin</p>
            <h1 className="admin-title">관리자 페이지</h1>
          </div>
          <AdminLogoutButton onLogout={() => setToken(null)} />
        </div>
        <AdminWorksPanel
          works={works}
          categories={categories}
          categoryGroups={categoryGroups}
          featuredSlots={featuredSlots}
        />
      </div>
    </AdminAuthProvider>
  );
}
