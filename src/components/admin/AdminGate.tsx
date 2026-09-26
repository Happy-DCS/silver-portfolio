"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminCategory, AdminCategoryGroup, FeaturedSlot, WorkListItem } from "@/lib/getWorks";
import type { Profile } from "@/lib/getProfile";
import { AdminAuthProvider } from "./AdminAuthContext";
import AdminLoginForm from "./AdminLoginForm";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminModal from "./AdminModal";
import AdminProfileForm from "./AdminProfileForm";
import AdminWorksPanel from "./AdminWorksPanel";

export default function AdminGate({
  works,
  categories,
  categoryGroups,
  featuredSlots,
  profile,
}: {
  works: WorkListItem[];
  categories: AdminCategory[];
  categoryGroups: AdminCategoryGroup[];
  featuredSlots: FeaturedSlot[];
  profile: Profile | null;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

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
          <div className="admin-panel-head-actions">
            {profile && (
              <button type="button" className="admin-submit" onClick={() => setProfileOpen(true)}>
                정보수정
              </button>
            )}
            <AdminLogoutButton onLogout={() => setToken(null)} />
          </div>
        </div>
        <AdminWorksPanel
          works={works}
          categories={categories}
          categoryGroups={categoryGroups}
          featuredSlots={featuredSlots}
        />
      </div>

      {profile && (
        <AdminModal open={profileOpen} onClose={() => setProfileOpen(false)} title="정보 수정">
          <AdminProfileForm
            profile={profile}
            onSaved={() => {
              setProfileOpen(false);
              router.refresh();
            }}
          />
        </AdminModal>
      )}
    </AdminAuthProvider>
  );
}
