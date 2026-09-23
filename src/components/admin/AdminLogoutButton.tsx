"use client";

export default function AdminLogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button type="button" className="admin-submit admin-logout" onClick={onLogout}>
      로그아웃
    </button>
  );
}
