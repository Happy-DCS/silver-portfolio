import Image from "next/image";
import Footer from "@/components/Footer";
import TopButton from "@/components/TopButton";

export default function AboutPage() {
  return (
    <>
      <section className="intro">
        <div className="container">
          <h1>
            <span className="line1">
              <span className="l-en">
                ABOUT <em>me</em>
              </span>
              <span className="l-kr">
                <span className="oj">조은</span>에 대하여
              </span>
            </span>
          </h1>
          <div className="intro-grid">
            <div className="photo reveal">
              <Image src="/assets/img/profile.jpg" alt="디자이너 조은 프로필 사진" fill sizes="(max-width: 800px) 100vw, 40vw" />
            </div>
            <div className="intro-txt reveal">
              <p className="story">
                널린 풀이지만, 행복한 풀.
                <br />
                <em>An ordinary grass — a lucky one.</em>
              </p>
              <p>
                처음 이름이 지어질 때 저는 <b>&apos;풀잎이름 은&apos;</b>이었습니다. 세상에 널린
                풀이라는 뜻이라는 걸 듣고, 이상하게 서운하기보다 좋았습니다. 그날 저는 마음속으로
                정했습니다 — 나는 세상에 널린 풀이지만, <b>행복한 풀</b>이 될 거야. 그때부터 흔한
                풀 사이에서 발견되는 네잎클로버를 마음에 품고 삽니다. 흔한 것들 속에서 특별한
                이야기를 발견하는 일. 제가 생각하는 디자인도 그것과 다르지 않습니다.
              </p>
              <p>
                시각적인 작업을 하는 <b>디자이너 조은</b>입니다. 브랜딩, 포스터, 북 디자인,
                UI/UX까지 형식은 달라도 하는 일은 같습니다. 대상이 가진 이야기를 찾고, 그것이
                가장 잘 읽히는 구조에 담는 것. 뼈대는 깔끔하게 세우되 색은 과감하게 씁니다.
                그래서인지 제 작업은 &quot;깔끔하다&quot;는 말과 &quot;색이 강렬하다&quot;는 말을
                같이 듣습니다. 저는 그 두 말이 함께 있는 지점이 좋습니다.
              </p>
              <p>
                디자인만큼, 어쩌면 그보다 <b>책과 책 속의 문장</b>을 좋아합니다. 고전 소설의 한
                줄에 심장이 뛰는 경험을 자주 하고, 그 마음을 잊지 않으려 밑줄을 긋고 필사합니다.
                그래서 제 디자인에는 늘 한 줄의 카피가 함께 심어져 있습니다. 화면과 지면 위의
                글이 장식이 아니라 심장이 되기를 바라면서요.
              </p>
              <p>
                제가 만들고 싶은 것은 뻔하지 않은, <b>이야기가 있는 디자인</b>입니다. 그리고 그
                디자인을 본 누군가가 잠깐이라도 행복해진다면 — 그날의 저는 네잎클로버를 찾은
                것과 같습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cv">
        <div className="container">
          <div className="cv-sec reveal">
            <div className="cv-grid">
              <div className="cv-h">
                <span className="en">Education</span>
              </div>
              <ul className="cv-list">
                <li>
                  <span className="yr">2021 — 현재</span>
                  <span className="tt">
                    충남대학교 환경소재공학과
                    <small>디자인창의학과 시각제품디자인전공 (복수전공) · 2027년 2월 졸업 예정</small>
                  </span>
                  <span className="tag">Bachelor</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="cv-sec reveal">
            <div className="cv-grid">
              <div className="cv-h">
                <span className="en">Experience</span>
              </div>
              <ul className="cv-list">
                <li>
                  <span className="yr">2026.05 — 현재</span>
                  <span className="tt">
                    (주)북극여우<wbr /> 프리랜서&nbsp;디자이너
                    <small>UI/UX · 브랜딩</small>
                  </span>
                  <span className="tag">Freelance</span>
                </li>
                <li>
                  <span className="yr">2023.12 — 2024.02</span>
                  <span className="tt">
                    Dr.in B 인턴
                    <small>UI/UX 디자인</small>
                  </span>
                  <span className="tag">Intern</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="cv-sec reveal">
            <div className="cv-grid">
              <div className="cv-h">
                <span className="en">Tools</span>
              </div>
              <div>
                <div className="sk-group">
                  <span className="sk-cap">Design</span>
                  <div className="skills">
                    <span>Photoshop</span>
                    <span>Illustrator</span>
                    <span>InDesign</span>
                    <span>Procreate</span>
                    <span>After Effects</span>
                    <span>CapCut</span>
                    <span>Figma</span>
                  </div>
                </div>
                <div className="sk-group">
                  <span className="sk-cap">AI</span>
                  <div className="skills">
                    <span>ChatGPT</span>
                    <span>Claude</span>
                    <span>Adobe Firefly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cv-sec reveal">
            <div className="cv-grid">
              <div className="cv-h">
                <span className="en">Beyond Design</span>
              </div>
              <ul className="cv-list">
                <li>
                  <span className="yr">Books</span>
                  <span className="tt">
                    고전 소설 읽기
                    <small>밑줄 긋고 필사하며 문장을 수집합니다</small>
                  </span>
                  <span className="tag">Reading</span>
                </li>
                <li>
                  <span className="yr">Coffee</span>
                  <span className="tt">
                    커피 내리기
                    <small>한 잔을 정성껏 만드는 시간을 좋아합니다</small>
                  </span>
                  <span className="tag">Barista</span>
                </li>
                <li>
                  <span className="yr">Video</span>
                  <span className="tt">
                    여행 영상 기록하기
                    <small>일상을 찍고 편집해 유튜브에 올립니다</small>
                  </span>
                  <a
                    className="tag tag-link"
                    href="https://www.youtube.com/@silver_life_1123"
                    target="_blank"
                    rel="noopener"
                  >
                    YouTube ↗
                  </a>
                </li>
                <li>
                  <span className="yr">Bass</span>
                  <span className="tt">
                    베이스 기타 연주하기
                    <small>가장 멋있어서 연주합니다</small>
                  </span>
                  <span className="tag">Music</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <TopButton />
    </>
  );
}
