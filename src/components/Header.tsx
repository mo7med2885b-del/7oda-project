import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { clinicLogo } from '../assets/images';
import { Sun, Moon, Shield, RefreshCw, Globe, UserCheck, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, lang, toggleLang, t, portalMode, setPortalMode, userRole, setUserRole, resetToSeedData } = useClinic();

  const handleReset = () => {
    if (confirm(lang === 'ar' ? 'هل تريد إعادة ضبط البيانات التجريبية إلى الوضع الافتراضي؟' : 'Reset demo data to default initial seed dataset?')) {
      resetToSeedData();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f5f2eb]/95 dark:bg-[#00261c]/95 border-b border-[#e3ded5] dark:border-[#00cb87]/20 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left / Top Side: Logo, Clinic Title & Mode Badge */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src={clinicLogo}
              alt="Dr. Mohamed Hosny Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#00473e]/40 shadow-md shrink-0"
            />
            <div>
              <h1 className="text-sm sm:text-lg font-black tracking-tight dark:text-white text-[#122620] flex items-center gap-1.5 flex-wrap">
                <span className="truncate max-w-[160px] sm:max-w-none">{t('clinic_title')}</span>
                <span
                  className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    portalMode === 'admin'
                      ? 'bg-[#00473e]/10 text-[#00473e] dark:bg-[#00cb87]/20 dark:text-[#00cb87] border-[#00473e]/30'
                      : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                  }`}
                >
                  {portalMode === 'admin' ? (lang === 'ar' ? 'طبيب / أدمن' : 'Doctor Admin') : (lang === 'ar' ? 'بوابة المرضى' : 'Patient Portal')}
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 truncate max-w-[210px] sm:max-w-none">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Right / Bottom Controls Toolbar */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap pt-1 sm:pt-0 border-t border-slate-200/60 sm:border-0 dark:border-white/5">
          {/* Portal Switcher Button */}
          <button
            onClick={() => {
              const newMode = portalMode === 'admin' ? 'patient' : 'admin';
              setPortalMode(newMode);
              window.location.hash = newMode === 'patient' ? '#patient' : '#dashboard';
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition shadow-sm shrink-0 ${
              portalMode === 'admin'
                ? 'bg-[#00473e] text-white hover:bg-[#003831]'
                : 'bg-[#00cb87] text-slate-950 hover:bg-[#00b074]'
            }`}
            title="Switch between Doctor View and Public Patient Portal"
          >
            {portalMode === 'admin' ? (
              <>
                <Heart className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض بوابة المرضى' : 'Switch to Patient View'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض لوحة الإدارة' : 'Doctor Admin'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#023326] text-[#122620] dark:text-slate-200 border border-[#e3ded5] dark:border-[#00cb87]/30 font-bold text-[11px] sm:text-xs hover:bg-[#ece7de] transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#00473e] dark:text-[#00cb87]" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Role Switcher */}
            {portalMode === 'admin' && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#023326] border border-[#e3ded5] dark:border-[#00cb87]/30">
                <Shield className="w-3.5 h-3.5 text-[#00473e] dark:text-[#00cb87]" />
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-[#122620] dark:text-[#00cb87] focus:outline-none cursor-pointer"
                >
                  <option value="Admin">{t('admin_role')}</option>
                  <option value="Doctor">{t('doctor_role')}</option>
                  <option value="Receptionist">{t('receptionist_role')}</option>
                  <option value="Accountant">{t('accountant_role')}</option>
                </select>
              </div>
            )}

            {/* Reset Seed Data */}
            <button
              onClick={handleReset}
              title={t('reset_data')}
              className="p-1.5 rounded-xl text-slate-600 hover:text-[#00473e] dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#023326] border border-[#e3ded5] dark:border-[#00cb87]/30 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-white dark:bg-[#023326] border border-[#e3ded5] dark:border-[#00cb87]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#00473e]" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
