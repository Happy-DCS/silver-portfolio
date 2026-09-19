export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="ft-head">
          <h2 className="ft-cta">
            <span className="fl">
              <span className="f-en">
                LET&apos;S CREATE <em>together</em>
              </span>
              <span className="f-kr">함께 만들어가요</span>
            </span>
          </h2>
          <a className="ft-mailbtn" href="mailto:euncho.work@gmail.com">
            euncho.work@gmail.com ↗
          </a>
        </div>
        <div className="ft-bottom">
          <span>© 2026 Silver Eun Cho. All rights reserved.</span>
          <span className="sns">
            <a href="#">Instagram</a>
            <a href="#">Behance</a>
            <a href="#">LinkedIn</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
