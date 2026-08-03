"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type MotionFallInProps = {
  children: ReactNode;
  className?: string;
  /** Index for stagger (seconds). */
  index?: number;
  /** Enable hover/tap scale on the wrapper. */
  interactive?: boolean;
};

/** Entrance: fall from above with spring. Respects prefers-reduced-motion. */
export function MotionFallIn({
  children,
  className,
  index = 0,
  interactive = false,
}: MotionFallInProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: Math.min(index, 24) * 0.05 }}
      {...(interactive
        ? {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
          }
        : {})}
    >
      {children}
    </motion.div>
  );
}
