import React, { useEffect, useRef } from 'react';
import { VIDEOS, CHANNEL_URL, thumbUrl, watchUrl } from './videoContent';
import { Play, Youtube, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * "Editorial filmstrip" video carousel — same interaction model as the
 * ThreeUI CharacterCarousel (filmstrip variant) reference, hand-built here
 * so it can show the doctor's real videos and link out to YouTube (the
 * packaged component can't: its portraits/links are baked in with no
 * prop for either).
 *
 * Mechanism, ported from that reference's source:
 *  - Cards are absolutely centred and spread apart by one continuous
 *    `phase` value (their index minus phase = signed "distance from
 *    centre" in card-units).
 *  - Moving the pointer across the whole stage sets a `target` phase;
 *    a render loop eases `phase` toward it every frame
 *    (`ease = 1 - k^(dt/1000)` for a constant k, not a CSS transition —
 *    lower k glides faster, higher k glides slower/heavier).
 *  - Every card's transform (x/y/z offset, scale, rotateY, opacity, blur,
 *    even sepia/saturation via a --focus CSS var) is a pure function of
 *    its own distance from the live phase — so the whole deck reads as
 *    one continuous ribbon reacting to the cursor, not independent hovers.
 *  - Wheel and arrow keys also move the phase; clicking a card recentres
 *    on it. After 3.6s idle, a slow sine sway takes over.
 * Direct DOM style writes (refs, no React state) drive the per-frame
 * updates, matching the original's approach — re-rendering 8+ elements
 * through React on every animation frame would be needlessly heavy.
 */

const CARD_ASPECT = 0.72; // matches the reference's portrait-card ratio

export const VideoShowcase: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLAnchorElement => !!c);
    if (!stage || !cards.length) return;

    const count = cards.length;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const state = {
      phase: (count - 1) / 2,
      target: (count - 1) / 2,
      base: (count - 1) / 2,
      pointerX: 0,
      pointerY: 0,
      active: false,
      lastInput: performance.now()
    };

    const wrappedDelta = (index: number, phase: number) => {
      let delta = index - phase;
      while (delta > count / 2) delta -= count;
      while (delta < -count / 2) delta += count;
      return delta;
    };

    const nearestIndex = () => (((Math.round(state.phase) % count) + count) % count);

    const moveTo = (index: number) => {
      const current = nearestIndex();
      let delta = index - current;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      state.base += delta;
      state.target = state.base;
      state.active = false;
      state.lastInput = performance.now();
    };

    const clickHandlers: Array<() => void> = [];
    cards.forEach((card, index) => {
      const onFocus = () => moveTo(index);
      card.addEventListener('focus', onFocus);
      clickHandlers.push(() => card.removeEventListener('focus', onFocus));
    });

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      state.pointerX = nx;
      state.pointerY = ny;
      state.active = true;
      state.target = state.base + (window.innerWidth < 650 ? ny * 2.8 : nx * 4.4);
      state.lastInput = performance.now();
      stage.style.setProperty('--pointer-x', `${(nx + 1) * 50}%`);
    };

    const onPointerLeave = () => {
      state.active = false;
      state.pointerX = 0;
      state.pointerY = 0;
      state.target = state.base;
      stage.style.setProperty('--pointer-x', '50%');
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = Math.sign(
        Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      );
      if (!direction) return;
      state.base += direction;
      state.target = state.base;
      state.active = false;
      state.lastInput = performance.now();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
      if (!forward && !backward) return;
      // Only steer the deck when focus is already inside it.
      if (!stage.contains(document.activeElement)) return;
      event.preventDefault();
      state.base += forward ? 1 : -1;
      state.target = state.base;
      state.active = false;
      state.lastInput = performance.now();
    };

    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', onPointerLeave);
    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    let previousTime = performance.now();
    let frame = 0;

    const render = (time: number) => {
      const deltaTime = Math.min(32, time - previousTime);
      previousTime = time;
      const ease = reducedMotion ? 1 : 1 - Math.pow(0.02, deltaTime / 1000);

      if (!state.active && time - state.lastInput > 3600) {
        const idle = time - state.lastInput - 3600;
        state.target = state.base + Math.sin(idle * 0.00042) * 2.45;
      }

      state.phase += (state.target - state.phase) * ease;
      const compact = window.innerWidth < 650;
      const horizontalSpacing = Math.min(200, Math.max(130, window.innerWidth * 0.14));
      const verticalSpacing = Math.min(122, Math.max(88, window.innerHeight * 0.112));

      cards.forEach((card, index) => {
        const delta = wrappedDelta(index, state.phase);
        const distance = Math.abs(delta);
        const focus = Math.exp(-distance * distance * 1.28);
        const side = Math.max(0, 1 - distance / 5);
        const direction = Math.sign(delta);
        const x = compact ? delta * 24 + Math.sin(delta * 0.9) * 25 : delta * horizontalSpacing;
        const y = compact ? delta * verticalSpacing : distance * 8 + state.pointerY * focus * 10;
        const z = focus * 145 - distance * 148;
        const scale = 0.54 + side * 0.15 + focus * 0.54;
        const rotateX = compact ? delta * 2.1 : -state.pointerY * focus * 3.5;
        const rotateY = compact
          ? -delta * 5
          : -direction * (distance > 0.2 ? 14 + Math.min(distance, 3) * 5 : 0) + state.pointerX * focus * 3;
        const rotateZ = compact ? delta * -1.4 : delta * 0.7;

        card.style.setProperty('--focus', focus.toFixed(4));
        card.style.zIndex = String(Math.round(1000 - distance * 100));
        card.style.opacity = String(Math.max(0.13, side * 0.76 + focus * 0.24));
        card.style.filter = `blur(${Math.max(0, distance - 1.5) * 0.38}px)`;
        card.style.transform = [
          'translate(-50%, -50%)',
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`,
          `rotateX(${rotateX.toFixed(2)}deg)`,
          `rotateY(${rotateY.toFixed(2)}deg)`,
          `rotateZ(${rotateZ.toFixed(2)}deg)`,
          `scale(${scale.toFixed(4)})`
        ].join(' ');
      });

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      clickHandlers.forEach(off => off());
    };
  }, []);

  return (
    <>
      {/* ---------- Cursor-driven filmstrip deck ---------- */}
      <div
        ref={stageRef}
        className="clinical-reveal clinical-filmstrip-stage relative mt-16 h-[440px] cursor-ew-resize touch-none overflow-hidden rounded-2xl sm:h-[480px]"
        style={{ perspective: '1450px' }}
        role="group"
        aria-label={isAr ? 'فيديوهات الدكتور — حرّكي المؤشر أو استخدمي عجلة الماوس' : 'Doctor videos — move the cursor or scroll to browse'}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {VIDEOS.map((v, i) => (
            <a
              key={v.id}
              ref={el => (cardRefs.current[i] = el)}
              href={watchUrl(v.id)}
              tabIndex={0}
              target="_blank"
              rel="noreferrer"
              aria-label={isAr ? v.title_ar : v.title_en}
              className="clinical-filmstrip-card absolute left-1/2 top-1/2 overflow-hidden rounded-[4px] border border-black/25 bg-[#e7d9bd] p-[7px] outline-none [transform-style:preserve-3d]"
              style={{
                width: 'clamp(154px, 16.8vw, 238px)',
                aspectRatio: `${CARD_ASPECT}`,
                willChange: 'transform, opacity, filter'
              }}
            >
              {/* Portrait */}
              <span className="absolute inset-x-[7px] top-[7px] bottom-[25%] block overflow-hidden bg-[#766a58]">
                <img
                  src={thumbUrl(v.id)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="clinical-filmstrip-img block h-full w-full scale-[1.55] object-cover"
                />
              </span>

              <span className="pointer-events-none absolute top-2 end-2 z-[3] rounded-full bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-white/90">
                {v.duration}
              </span>

              {/* Contact-sheet footer — video title leads, doctor name is the byline */}
              <span className="absolute inset-x-[7px] bottom-[7px] flex h-[calc(25%-7px)] items-center gap-2 bg-[#171612] px-2.5 text-start">
                <span className="grid aspect-square w-[clamp(20px,2.7vw,32px)] shrink-0 place-items-center rounded-full border border-[#ce5d20] font-mono text-[9px] font-semibold text-[#d86724]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-[10.5px] font-extrabold leading-tight text-[#f3e6cc]">
                    {isAr ? v.title_ar : v.title_en}
                  </span>
                  <span className="mt-0.5 block truncate text-[7px] font-bold uppercase tracking-[0.15em] text-[#d46a27]">
                    {isAr ? 'د. محمد حسني' : 'Dr. M. Hosny'}
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-[11.5px] text-white/40 lg:hidden">
        {isAr ? 'مرري لتصفح الفيديوهات' : 'Swipe to browse'}
      </p>

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
