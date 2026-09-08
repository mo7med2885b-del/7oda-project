import React, { useState } from 'react';
import { VIDEOS, CHANNEL_URL, thumbUrl, watchUrl } from './videoContent';
import { Play, Youtube, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Video cards from the doctor's YouTube channel.
 *
 * Hovering lifts a card and slides its description up over the thumbnail —
 * the thumbnail stays visible throughout, since that image is what makes
 * someone want to watch. Clicking opens the video in a lightbox so the
 * viewer stays on the site rather than being sent to YouTube.
 */
export const VideoShowcase: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* ---------- Desktop: arc fan ---------- */}
      {/*
        Flex centres the row for us, so the fan is always balanced on screen
        regardless of viewport width. Negative margins overlap the cards into
        a fan; only rotation and lift are applied per card.
      */}
      <div className="clinical-reveal mt-16 hidden justify-center gap-5 lg:flex">
        {VIDEOS.map((v, i) => {
          const mid = (VIDEOS.length - 1) / 2;
          const offset = i - mid;
          // Cards tilt away from the centre; the middle pair stays near
          // upright. No vertical dip — the row keeps a flat baseline.
          const angle = offset * 3.2;
          const isUp = hovered === i;

          return (
            <a
              key={v.id}
              href={watchUrl(v.id)}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              aria-label={isAr ? v.title_ar : v.title_en}
              className={`group relative w-[190px] xl:w-[215px] shrink-0 origin-center overflow-hidden rounded-2xl border bg-clinical-deep text-start shadow-2xl shadow-black/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-lime ${
                isUp ? 'border-clinical-lime/70' : 'border-white/15'
              }`}
              style={{
                transform: `rotate(${angle}deg) scale(${isUp ? 1.12 : 1})`,
                zIndex: isUp ? 50 : 10 + (10 - Math.abs(offset))
              }}
            >
              {/* Portrait thumbnail — hqdefault is 4:3, cropped to fill */}
              <span className="relative block h-[370px] overflow-hidden">
                <img
                  src={thumbUrl(v.id)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-[1.6] object-cover transition-transform duration-700 group-hover:scale-[1.68]"
                />
                <span
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isUp
                      ? 'bg-gradient-to-t from-clinical-deep via-clinical-deep/45 to-transparent'
                      : 'bg-gradient-to-t from-clinical-deep/95 via-clinical-deep/55 to-clinical-deep/25'
                  }`}
                />

                <span className="absolute top-3 end-3 rounded-md bg-black/70 px-2 py-1 font-mono text-[11px] text-white">
                  {v.duration}
                </span>

                {/* Title always visible; detail reveals on hover */}
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="clinical-display block text-[14.5px] font-medium leading-snug text-white">
                    {isAr ? v.title_ar : v.title_en}
                  </span>
                  <span
                    className={`block overflow-hidden text-[11.5px] leading-relaxed text-white/80 transition-all duration-500 ${
                      isUp ? 'mt-2 max-h-28 opacity-100' : 'mt-0 max-h-0 opacity-0'
                    }`}
                  >
                    {isAr ? v.blurb_ar : v.blurb_en}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-clinical-lime font-bold text-clinical-olive transition-all duration-500 ${
                      isUp
                        ? 'mt-2.5 max-h-9 px-3.5 py-2 text-[11px] opacity-100'
                        : 'mt-0 max-h-0 px-0 py-0 text-[0px] opacity-0'
                    }`}
                  >
                    <Play className="h-3 w-3 fill-current rtl:rotate-180" />
                    {isAr ? 'شاهد الآن' : 'Watch now'}
                  </span>
                </span>
              </span>
            </a>
          );
        })}
      </div>

      {/* ---------- Mobile / tablet: stacked grid ---------- */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:hidden">
        {VIDEOS.map((v, i) => (
          <a
            key={v.id}
            href={watchUrl(v.id)}
            target="_blank"
            rel="noreferrer"
            aria-label={isAr ? v.title_ar : v.title_en}
            className="clinical-reveal group relative block overflow-hidden rounded-2xl border border-white/12 bg-clinical-deep text-start"
            style={{ transitionDelay: `${(i % 2) * 70}ms` }}
          >
            <span className="relative block aspect-video overflow-hidden">
              <img
                src={thumbUrl(v.id)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-[1.35] object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-clinical-deep via-clinical-deep/25 to-transparent" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-clinical-lime/95 text-clinical-olive shadow-lg">
                  <Play className="h-4 w-4 translate-x-[1px] fill-current rtl:-translate-x-[1px] rtl:rotate-180" />
                </span>
              </span>
              <span className="absolute bottom-2.5 end-2.5 rounded-md bg-black/75 px-2 py-1 font-mono text-[11px] text-white">
                {v.duration}
              </span>
            </span>
            <span className="block p-5">
              <span className="clinical-display block text-[16px] font-medium leading-snug text-white">
                {isAr ? v.title_ar : v.title_en}
              </span>
              <span className="mt-2 block text-[12.5px] leading-relaxed text-white/60">
                {isAr ? v.blurb_ar : v.blurb_en}
              </span>
            </span>
          </a>
        ))}
      </div>

      {/* Channel link */}
      <div className="clinical-reveal mt-10 text-center">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[13.5px] text-white transition hover:bg-white/10"
        >
          <Youtube className="h-4 w-4" />
          {isAr ? 'شاهد باقي الفيديوهات على القناة' : 'See more on the channel'}
          <Arrow className="h-4 w-4" />
        </a>
      </div>

    </>
  );
};
