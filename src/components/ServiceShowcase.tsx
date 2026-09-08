import React, { useState } from 'react';
import { SERVICES } from './clinicalContent';
import { serviceImages } from '../assets/services';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Expanding service cards.
 *
 * Desktop: a row of photo panels. The active panel grows and reveals
 * its description and CTA while the others compress to a vertical
 * title strip — driven by flex-grow so the row always fills the width.
 *
 * Touch / small screens: hover has no meaning, so the same cards
 * stack as a normal grid with the detail always visible.
 */

const FALLBACK_GRADIENTS: Record<string, string> = {
  icsi: 'linear-gradient(160deg, #2f5d84 0%, #1d3f5e 100%)',
  ivf: 'linear-gradient(160deg, #3a6b8a 0%, #22485f 100%)',
  obstetrics: 'linear-gradient(160deg, #4c7091 0%, #2b4b66 100%)',
  laparoscopy: 'linear-gradient(160deg, #35617f 0%, #1f4159 100%)',
  ultrasound: 'linear-gradient(160deg, #44648e 0%, #263f5c 100%)',
  gyn: 'linear-gradient(160deg, #3d6c8c 0%, #234561 100%)'
};

export const ServiceShowcase: React.FC<{
  isAr: boolean;
  onBook: () => void;
}> = ({ isAr, onBook }) => {
  const [active, setActive] = useState(0);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* ---------- Desktop: expanding accordion row ---------- */}
      <div className="clinical-reveal mt-14 hidden lg:flex gap-3 h-[440px]">
        {SERVICES.map((s, i) => {
          const isActive = active === i;
          const img = serviceImages[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={onBook}
              aria-expanded={isActive}
              className="group relative overflow-hidden rounded-2xl border border-white/15 text-start transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: isActive ? 3.4 : 1, flexBasis: 0 }}
            >
              {/* Media */}
              {img ? (
                <img
                  src={img}
                  alt={isAr ? s.name_ar : s.name_en}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <span
                  className="absolute inset-0"
                  style={{ background: FALLBACK_GRADIENTS[s.id] }}
                />
              )}

              {/* Legibility scrim */}
              <span
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
                    : 'bg-gradient-to-t from-black/85 via-black/55 to-black/30'
                }`}
              />

              {/* Colour dot */}
              <span
                className="absolute top-4 start-4 h-3 w-3 rounded-full ring-2 ring-white/25"
                style={{ background: s.dot }}
              />

              {/* Collapsed: vertical title */}
              <span
                className={`absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 ${
                  isActive ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span
                  className="clinical-display whitespace-nowrap text-[19px] font-medium text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {isAr ? s.name_ar : s.name_en}
                </span>
              </span>

              {/* Expanded: full detail */}
              <span
                className={`absolute inset-x-0 bottom-0 p-7 transition-all duration-500 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="clinical-display block text-[27px] font-medium leading-tight text-white">
                  {isAr ? s.name_ar : s.name_en}
                </span>
                <span className="mt-1.5 block text-[12.5px] text-clinical-lime">
                  {isAr ? s.tag_ar : s.tag_en}
                </span>
                <span className="mt-3 block max-w-md text-[13px] leading-relaxed text-white/80">
                  {isAr ? s.body_ar : s.body_en}
                </span>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-clinical-lime px-5 py-2.5 text-[12.5px] font-bold text-clinical-olive">
                  {isAr ? 'احجزي الآن' : 'Book now'}
                  <Arrow className="h-3.5 w-3.5" />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Mobile / tablet: stacked cards ---------- */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:hidden">
        {SERVICES.map((s, i) => {
          const img = serviceImages[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={onBook}
              className="clinical-reveal group relative h-[300px] overflow-hidden rounded-2xl border border-white/15 text-start"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {img ? (
                <img
                  src={img}
                  alt={isAr ? s.name_ar : s.name_en}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <span
                  className="absolute inset-0"
                  style={{ background: FALLBACK_GRADIENTS[s.id] }}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
              <span
                className="absolute top-4 start-4 h-3 w-3 rounded-full ring-2 ring-white/25"
                style={{ background: s.dot }}
              />
              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="clinical-display block text-[23px] font-medium text-white">
                  {isAr ? s.name_ar : s.name_en}
                </span>
                <span className="mt-1 block text-[12px] text-clinical-lime">
                  {isAr ? s.tag_ar : s.tag_en}
                </span>
                <span className="mt-2.5 block text-[12.5px] leading-relaxed text-white/75">
                  {isAr ? s.body_ar : s.body_en}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
