import Image from "next/image";
import { getProfile } from "@/lib/getProfile";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfile();

  const email = profile?.email ?? "euncho.work@gmail.com";
  const instagramUrl = profile?.instagramUrl ?? "#";
  const behanceUrl = profile?.behanceUrl ?? "#";
  const linkedinUrl = profile?.linkedinUrl ?? "#";
  const resumeUrl = profile?.resumeUrl ?? "#";

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
        <a className="mail" href={`mailto:${email}`}>
          {email}
        </a>
        <div className="c-sns">
          <a className="ig" href={instagramUrl} target="_blank" rel="noopener">
            Instagram
            <span className="igc">
              <Image src="/assets/img/instagram.png" alt="" fill sizes="24px" />
            </span>
          </a>
          <a className="be" href={behanceUrl} target="_blank" rel="noopener">
            Behance
            <span className="igc">
              <Image src="/assets/img/behance.png" alt="" fill sizes="24px" />
            </span>
          </a>
          <div className="sns-row">
            <a className="li" href={linkedinUrl} target="_blank" rel="noopener">
              LinkedIn
              <span className="igc">
                <Image src="/assets/img/linkedin.png" alt="" fill sizes="24px" />
              </span>
            </a>
            <a className="rs" href={resumeUrl} target="_blank" rel="noopener">
              <span className="r-en">Resume</span>
              <span className="r-kr">이력서</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
