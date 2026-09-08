import React, { useEffect, useState } from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

/**
 * Floating WhatsApp contact button.
 *
 * Pinned to the bottom corner and persists across the whole page.
 * The side follows the reading direction: bottom-left in Arabic (RTL),
 * bottom-right in English (LTR).
 *
 * Collapses to a circle once the user scrolls past the hero so it stops
 * competing with the content, and expands on hover/focus.
 */
export const WhatsAppFab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp';

  return (
    <a
      href={buildWhatsAppLink(isAr)}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`group fixed bottom-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 text-[13px] font-bold text-white shadow-lg shadow-black/25 transition-all duration-300 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        isAr ? 'left-5' : 'right-5'
      } ${compact ? 'px-3.5' : 'px-5'}`}
    >
      {/* WhatsApp glyph */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
      </svg>

      {/* Label — always present for screen readers, visually collapses on scroll */}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          compact
            ? 'max-w-0 opacity-0 group-hover:max-w-[220px] group-hover:opacity-100 group-focus-visible:max-w-[220px] group-focus-visible:opacity-100'
            : 'max-w-[220px] opacity-100'
        }`}
      >
        {label}
      </span>
    </a>
  );
};
