import { useEffect, useRef } from 'react';

/**
 * Adds `.is-visible` to any descendant carrying `.clinical-reveal`
 * once it scrolls into view. Mirrors the staged section entrances
 * used across the inspiration reference.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.clinical-reveal'));
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
};
