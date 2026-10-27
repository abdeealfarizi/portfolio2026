"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 420, damping: 30 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
