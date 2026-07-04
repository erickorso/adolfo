"use client";

import { useEffect, useState } from "react";

export function useParallaxOffset(speed = 0.35) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const onScroll = () => {
      setOffset(window.scrollY * speed);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return offset;
}
