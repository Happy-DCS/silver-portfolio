"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
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
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResumeChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    setResumeError(null);
    setResumeUploading(true);
    try {
      const form = new FormData();
      form.set("pdf", file);
      const res = await adminFetch(token, "/api/admin/profile/resume", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setResumeError(data?.error ?? "업로드에 실패했습니다.");
        return;
      }
      setResumeUrl(data.url);
    } finally {
      setResumeUploading(false);
    }
  }

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
        <label htmlFor="profile-resume">이력서</label>
        <input id="profile-resume" value={resumeUrl} readOnly placeholder="등록된 이력서가 없습니다" />
        <input
          id="profile-resume-upload"
          type="file"
          accept="application/pdf"
          onChange={handleResumeChange}
          disabled={resumeUploading}
        />
        {resumeUploading && <p className="admin-field-hint">업로드 중…</p>}
        {resumeError && <p className="admin-error">{resumeError}</p>}
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="admin-submit" disabled={submitting}>
        {submitting ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
