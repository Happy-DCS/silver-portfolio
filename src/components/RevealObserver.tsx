"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    const io = observeOnce(".reveal, .collage .art", { threshold: 0.15 });
    return () => io.disconnect();
  }, []);

  return null;
}
