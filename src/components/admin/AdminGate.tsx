"use client";

import { useState } from "react";
import AdminLoginForm from "./AdminLoginForm";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminWorksPanel from "./AdminWorksPanel";

export default function AdminGate() {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <AdminLoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="admin-eyebrow">Admin</p>
          <h1 className="admin-title">관리자 페이지</h1>
        </div>
        <AdminLogoutButton onLogout={() => setAuthed(false)} />
      </div>
      <AdminWorksPanel />
    </div>
  );
}
