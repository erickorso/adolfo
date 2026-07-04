"use client";

import { useLayoutEffect, useRef, useState } from "react";

type UseScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

function parseRootMarginValue(raw: string, axisSize: number): number {
  const trimmed = raw.trim();
  if (trimmed.endsWith("%")) {
    return (Number.parseFloat(trimmed) / 100) * axisSize;
  }
  return Number.parseFloat(trimmed);
}

function expandRootMargin(rootMargin: string): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const parts = rootMargin.trim().split(/\s+/);
  const values =
    parts.length === 1
      ? [parts[0], parts[0], parts[0], parts[0]]
      : parts.length === 2
        ? [parts[0], parts[1], parts[0], parts[1]]
        : parts.length === 3
          ? [parts[0], parts[1], parts[2], parts[1]]
          : parts;

  return {
    top: parseRootMarginValue(values[0], window.innerHeight),
    right: parseRootMarginValue(values[1], window.innerWidth),
    bottom: parseRootMarginValue(values[2], window.innerHeight),
    left: parseRootMarginValue(values[3], window.innerWidth),
  };
}

function isNodeRevealed(
  node: HTMLElement,
  threshold: number,
  rootMargin: string,
): boolean {
  const { top, right, bottom, left } = expandRootMargin(rootMargin);
  const rect = node.getBoundingClientRect();
  const rootTop = top;
  const rootLeft = left;
  const rootBottom = window.innerHeight - bottom;
  const rootRight = window.innerWidth - right;

  const visibleWidth = Math.max(
    0,
    Math.min(rect.right, rootRight) - Math.max(rect.left, rootLeft),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, rootBottom) - Math.max(rect.top, rootTop),
  );
  const visibleArea = visibleWidth * visibleHeight;
  const nodeArea = Math.max(rect.width * rect.height, 1);

  return visibleArea / nodeArea >= threshold;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const threshold = options.threshold ?? 0.2;
  const rootMargin = options.rootMargin ?? "0px 0px -10% 0px";

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const reveal = () => {
      requestAnimationFrame(() => setVisible(true));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    if (isNodeRevealed(node, threshold, rootMargin)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    const syncAfterLayout = () => {
      if (isNodeRevealed(node, threshold, rootMargin)) {
        reveal();
        observer.disconnect();
      }
    };

    requestAnimationFrame(syncAfterLayout);
    window.addEventListener("pageshow", syncAfterLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", syncAfterLayout);
    };
  }, [rootMargin, threshold]);

  return { ref, visible };
}
