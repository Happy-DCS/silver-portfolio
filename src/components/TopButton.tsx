"use client";

import { useEffect, useState } from "react";

export default function TopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`top-btn${show ? " show" : ""}`}
      aria-label="맨 위로"
      onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
    >
      TOP
    </button>
  );
}
