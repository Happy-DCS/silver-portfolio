"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function observeOnce(selector: string, options?: IntersectionObserverInit) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, options);
  document.querySelectorAll(selector).forEach((el) => io.observe(el));
  return io;
}

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // 페이지 이동 시(레이아웃은 리마운트되지 않음) 새 페이지의 요소를 다시 찾도록 pathname을 의존성에 둔다
    const io = observeOnce(".reveal, .collage .art", { threshold: 0.15 });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
