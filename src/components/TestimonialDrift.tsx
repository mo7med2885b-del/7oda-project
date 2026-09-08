import React, { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from './clinicalContent';

/**
 * Scroll-driven testimonial cards.
 *
 * Cards are scattered around a centred heading and drift inward/upward as
 * the section passes through the viewport — the parallax treatment from the
 * reference, where quotes float over the title rather than sitting in a grid.
 *
 * Below `lg` the scatter would collide on narrow screens, so the same quotes
 * render as a plain stacked grid.
 */

/**
 * Two staggered columns: cards sit upright and alternate left/right, each
 * offset vertically from the last so the pair reads as a loose rhythm
 * rather than a rigid grid.
 */
const LAYOUT = [
  { left: '4%',  top: '0%',   depth: 1.0 },
  { left: '54%', top: '13%',  depth: 1.6 },
  { left: '17%', top: '26%',  depth: 1.2 },
  { left: '64%', top: '39%',  depth: 1.8 },
  { left: '4%',  top: '52%',  depth: 1.4 },
  { left: '54%', top: '65%',  depth: 1.1 },
  { left: '17%', top: '78%',  depth: 1.7 },
  { left: '64%', top: '91%',  depth: 1.3 }
];

export const TestimonialDrift: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setProgress(0.62);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top enters the bottom of the viewport,
      // 1 once its bottom has passed the top.
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const Card: React.FC<{ i: number; floating?: boolean }> = ({ i, floating }) => {
    const t = TESTIMONIALS[i];
    return (
      <figure
        className={`rounded-2xl bg-clinical-cream p-6 shadow-xl shadow-black/20 ${
          floating ? 'w-[300px] xl:w-[340px]' : ''
        }`}
      >
        <span className="clinical-display block bg-transparent text-[34px] leading-none text-clinical-lime">
          &ldquo;
        </span>
        <blockquote className="mt-2 text-[13.5px] leading-relaxed text-clinical-deep">
          {isAr ? t.body_ar : t.body_en}
        </blockquote>
        <figcaption className="mt-5">
          <div className="text-[13px] font-bold text-clinical-deep">
            {isAr ? t.name_ar : t.name_en}
          </div>
          <div className="clinical-eyebrow text-clinical-mid">
            {isAr ? 'مريضة' : 'Patient'}
          </div>
        </figcaption>
      </figure>
    );
  };

  return (
    <div ref={sectionRef}>
      {/* ---------- Desktop: drifting scatter ---------- */}
      <div className="relative mt-14 hidden lg:block h-[1560px]">
        {LAYOUT.map((pos, i) => {
          // Each card enters over its own slice of the scroll range, so they
          // appear one after another rather than all at once.
          const start = 0.08 + i * 0.045;
          const enter = Math.min(1, Math.max(0, (progress - start) / 0.22));

          // Rise: starts 120px low, settles at 0, then keeps drifting upward
          // as the section continues past — so scrolling down moves them up.
          const rise = (1 - enter) * 120 - progress * 90 * pos.depth;

          return (
            <div
              key={i}
              className="absolute will-change-transform"
              style={{
                left: pos.left,
                top: pos.top,
                opacity: enter,
                transform: `translate3d(0, ${rise}px, 0)`
              }}
            >
              <Card i={i} floating />
            </div>
          );
        })}
      </div>

      {/* ---------- Mobile / tablet: stacked ---------- */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:hidden">
        {TESTIMONIALS.map((_, i) => (
          <div key={i} className="clinical-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <Card i={i} />
          </div>
        ))}
      </div>
    </div>
  );
};
