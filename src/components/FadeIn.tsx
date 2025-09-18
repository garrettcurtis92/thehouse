"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
  delay?: number;
  y?: number;
}

export default function FadeIn({ children, className = "", as: Tag = "div", delay = 0, y = 12 }: FadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const base = "transition-all duration-700 ease-out will-change-transform";
  const state = visible ? "opacity-100 translate-y-0" : "opacity-0";
  const transformStyle = visible ? undefined : { transform: `translateY(${y}px)` };

  return (
    <Tag
      ref={ref as any}
      className={`${base} ${state} ${className}`}
      style={{ ...(transformStyle || {}), transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}