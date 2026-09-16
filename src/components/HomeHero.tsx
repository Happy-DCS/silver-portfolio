"use client";

import { useEffect, useRef } from "react";

export default function HomeHero() {
  const heroBoxRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const dvLineRef = useRef<HTMLSpanElement>(null);
  const dvClRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const heroBox = heroBoxRef.current;
        const dv = dividerRef.current;
        const dvLine = dvLineRef.current;
        const dvCl = dvClRef.current;
        if (!heroBox || !dv || !dvLine || !dvCl) {
          ticking = false;
          return;
        }
        const y = window.scrollY;
        const vh = window.innerHeight;
        const p = Math.min(1, y / (vh * 0.7));
        heroBox.style.transform = `translateY(${y * 0.3}px) scale(${1 - p * 0.06})`;
        heroBox.style.opacity = String(1 - p);

        const r = dv.getBoundingClientRect();
        const g = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.62)));
        dvLine.style.transform = `scaleY(${g})`;
        dvCl.style.top = `${g * 100}%`;
        dvCl.style.transform = `translate(-50%, -50%) rotate(${g * 180}deg)`;
        ticking = false;
      });
    };

    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hero">
        <div className="container" ref={heroBoxRef}>
          <h1>
            <span className="line1">
              <span className="l-en">
                HI, I&apos;M <em>Silver</em> EUN CHO
              </span>
              <span className="l-kr">
                안녕하세요, <span className="oj">조은</span>입니다
              </span>
            </span>
            <br />
            <span className="l2">
              WELCOME
              <span className="cl">
                <img src="/assets/img/clover.png" alt="" />
              </span>{" "}
              TO MY
            </span>{" "}
            <em className="pf">portfolio</em>
          </h1>
        </div>
      </div>

      <div className="divider" ref={dividerRef}>
        <span className="dv-line" ref={dvLineRef} />
        <img className="dv-cl" ref={dvClRef} src="/assets/img/clover.png" alt="" />
      </div>
    </>
  );
}
