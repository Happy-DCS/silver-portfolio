export default function ContactPage() {
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
        <a className="mail" href="mailto:euncho.work@gmail.com">
          euncho.work@gmail.com
        </a>
        <div className="c-sns">
          <a className="ig" href="#" target="_blank" rel="noopener">
            Instagram
            <span className="igc">
              <img src="/assets/img/instagram.png" alt="" />
            </span>
          </a>
          <a className="be" href="#" target="_blank" rel="noopener">
            Behance
            <span className="igc">
              <img src="/assets/img/behance.png" alt="" />
            </span>
          </a>
          <a className="li" href="#" target="_blank" rel="noopener">
            LinkedIn
            <span className="igc">
              <img src="/assets/img/linkedin.png" alt="" />
            </span>
          </a>
          <a className="rs" href="#">
            <span className="r-en">Resume</span>
            <span className="r-kr">이력서</span>
          </a>
        </div>
      </div>
    </main>
  );
}
