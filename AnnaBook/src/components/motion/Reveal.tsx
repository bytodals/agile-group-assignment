import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
  /** Animate immediately on mount instead of on scroll-into-view. */
  immediate?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
  immediate = false,
}: RevealProps) {
  const MotionTag = motion[as];
  const transition = { duration: 0.7, ease: EASE, delay };

  if (immediate) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={transition}
    >
      {children}
    </MotionTag>
  );
}
