import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type Profile = {
  email: string;
  instagramUrl: string | null;
  behanceUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
};

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from("profile")
    .select("email, instagram_url, behance_url, linkedin_url, resume_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    email: data.email,
    instagramUrl: data.instagram_url,
    behanceUrl: data.behance_url,
    linkedinUrl: data.linkedin_url,
    resumeUrl: data.resume_url,
  };
}
