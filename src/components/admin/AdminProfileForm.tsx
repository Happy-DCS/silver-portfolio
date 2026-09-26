"use client";

import { useState, type FormEvent } from "react";
import type { Profile } from "@/lib/getProfile";
import { adminFetch } from "@/lib/adminFetch";
import { useAdminToken } from "./AdminAuthContext";

export default function AdminProfileForm({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const token = useAdminToken();
  const [email, setEmail] = useState(profile.email);
  const [instagramUrl, setInstagramUrl] = useState(profile.instagramUrl ?? "");
  const [behanceUrl, setBehanceUrl] = useState(profile.behanceUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await adminFetch(token, "/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          instagramUrl: instagramUrl.trim() || null,
          behanceUrl: behanceUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
          resumeUrl: resumeUrl.trim() || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "저장에 실패했습니다.");
        return;
      }
      onSaved();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-work-form" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label htmlFor="profile-email">이메일</label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="profile-instagram">Instagram URL</label>
        <input id="profile-instagram" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
      </div>

      <div className="admin-field">
        <label htmlFor="profile-behance">Behance URL</label>
        <input id="profile-behance" value={behanceUrl} onChange={(e) => setBehanceUrl(e.target.value)} />
      </div>

      <div className="admin-field">
        <label htmlFor="profile-linkedin">LinkedIn URL</label>
        <input id="profile-linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
      </div>

      <div className="admin-field">
        <label htmlFor="profile-resume">이력서 URL</label>
        <input id="profile-resume" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="admin-submit" disabled={submitting}>
        {submitting ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
