"use client";

import { createContext, useContext, type ReactNode } from "react";

const AdminAuthContext = createContext<string | null>(null);

export function AdminAuthProvider({ token, children }: { token: string; children: ReactNode }) {
  return <AdminAuthContext.Provider value={token}>{children}</AdminAuthContext.Provider>;
}

/** 로그인된 admin 세션의 bearer 토큰. 새로고침하면 사라지는 메모리 전용 값이다. */
export function useAdminToken(): string {
  const token = useContext(AdminAuthContext);
  if (!token) throw new Error("useAdminToken은 로그인된 AdminGate 내부에서만 사용할 수 있습니다.");
  return token;
}
