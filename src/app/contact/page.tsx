import Image from "next/image";
import { getProfile } from "@/lib/getProfile";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <main>
      <div className="container">
        <p className="c-label">
          <span className="line1">
            <span className="l-en">
              <b>GET IN</b> <em>touch</em>
            </span>
            <span className="l-kr">편하게 연락해 주세요</span>
          </span>
        </p>
        {profile?.email && (
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        )}
        <div className="c-sns">
          {profile?.instagramUrl && (
            <a className="ig" href={profile.instagramUrl} target="_blank" rel="noopener">
              Instagram
              <span className="igc">
                <Image src="/assets/img/instagram.png" alt="" fill sizes="24px" />
              </span>
            </a>
          )}
          {profile?.behanceUrl && (
            <a className="be" href={profile.behanceUrl} target="_blank" rel="noopener">
              Behance
              <span className="igc">
                <Image src="/assets/img/behance.png" alt="" fill sizes="24px" />
              </span>
            </a>
          )}
          {(profile?.linkedinUrl || profile?.resumeUrl) && (
            <div className="sns-row">
              {profile?.linkedinUrl && (
                <a className="li" href={profile.linkedinUrl} target="_blank" rel="noopener">
                  LinkedIn
                  <span className="igc">
                    <Image src="/assets/img/linkedin.png" alt="" fill sizes="24px" />
                  </span>
                </a>
              )}
              {profile?.resumeUrl && (
                <a className="rs" href={profile.resumeUrl} target="_blank" rel="noopener">
                  <span className="r-en">Resume</span>
                  <span className="r-kr">이력서</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
