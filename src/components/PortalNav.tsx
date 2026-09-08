import React, { useEffect, useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Globe, Menu, Plus, UserCheck, X } from 'lucide-react';

/**
 * Public-facing navigation for the patient portal.
 *
 * Transparent over the hero, then solidifies into a blurred bar once the
 * user scrolls — so it never competes with the portrait behind it.
 */

const LINKS = [
  { id: 'about', ar: 'من نحن', en: 'About' },
  { id: 'services', ar: 'الخدمات', en: 'Services' },
  { id: 'process', ar: 'رحلتك', en: 'Process' },
  { id: 'videos', ar: 'فيديوهات', en: 'Videos' },
  { id: 'branches', ar: 'الفروع', en: 'Locations' },
  { id: 'faq', ar: 'أسئلة شائعة', en: 'FAQ' }
];

export const PortalNav: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const { lang, toggleLang, setPortalMode } = useClinic();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'border-b border-white/10 bg-clinical-deep/90 backdrop-blur-md py-3'
          : 'border-b border-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
        {/* Wordmark */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-clinical-lime">
            <Plus className="h-4 w-4 text-clinical-olive" strokeWidth={3} />
          </span>
          <span className="clinical-display text-[16px] font-medium text-white">
            {isAr ? 'د. محمد حسني' : 'Dr. Mohamed Hosny'}
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-[13.5px] text-white/75 transition hover:text-white"
            >
              {isAr ? l.ar : l.en}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-[12px] font-bold text-white transition hover:bg-white/10"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>

          <button
            onClick={() => {
              setPortalMode('admin');
              window.history.pushState(null, '', '/dashboard');
            }}
            title={isAr ? 'لوحة الإدارة' : 'Admin dashboard'}
            className="hidden sm:grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <UserCheck className="h-4 w-4" />
          </button>

          <button
            onClick={() => go('booking')}
            className="hidden sm:block rounded-full bg-clinical-lime px-5 py-2.5 text-[13px] font-bold text-clinical-olive transition hover:brightness-105"
          >
            {isAr ? 'احجزي الآن' : 'Book now'}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={isAr ? 'القائمة' : 'Menu'}
            className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden mt-3 border-t border-white/10 bg-clinical-deep/95 px-5 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1">
            {LINKS.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-lg px-3 py-3 text-start text-[14px] text-white/80 transition hover:bg-white/10"
              >
                {isAr ? l.ar : l.en}
              </button>
            ))}
            <button
              onClick={() => go('booking')}
              className="mt-2 rounded-full bg-clinical-lime px-5 py-3 text-[14px] font-bold text-clinical-olive"
            >
              {isAr ? 'احجزي الآن' : 'Book now'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
