"use client";

import { useLayoutEffect, useRef } from "react";

const MIN_FONT_SIZE_PX = 9;

/**
 * `.ph-label` 텍스트가 컨테이너 폭을 넘어서 줄바꿈될 상황이면,
 * 한 줄에 들어갈 때까지 font-size를 자동으로 줄인다.
 */
export default function PhLabel({ children }: { children: string }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    function fit() {
      if (!el) return;
      el.style.fontSize = "";

      const baseSize = parseFloat(window.getComputedStyle(el).fontSize);
      const overflow = el.scrollWidth - el.clientWidth;
      if (overflow <= 0) return;

      const ratio = el.clientWidth / el.scrollWidth;
      const nextSize = Math.max(MIN_FONT_SIZE_PX, Math.floor(baseSize * ratio));
      el.style.fontSize = `${nextSize}px`;
    }

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <em ref={ref} className="ph-label" style={{ whiteSpace: "nowrap" }}>
      {children}
    </em>
  );
}
