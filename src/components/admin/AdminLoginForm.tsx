"use client";

import { useState, type FormEvent } from "react";

export default function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "로그인에 실패했습니다.");
        return;
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <p className="admin-eyebrow">Admin</p>
      <h1 className="admin-title">관리자 로그인</h1>

      <div className="admin-field">
        <label htmlFor="admin-username">아이디</label>
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">비밀번호</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="admin-submit" disabled={loading}>
        {loading ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
