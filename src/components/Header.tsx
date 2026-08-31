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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f5f2eb]/95 dark:bg-[#00261c]/95 border-b border-[#e3ded5] dark:border-[#00cb87]/20 px-6 py-3 transition-colors shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Custom Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src={clinicLogo}
            alt="Dr. Mohamed Hosny Logo"
            className="w-11 h-11 rounded-xl object-cover border border-[#00473e]/40 shadow-md"
          />
          <div>
            <h1 className="text-lg font-black tracking-tight dark:text-white text-[#122620] flex items-center gap-2">
              {t('clinic_title')}
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                  portalMode === 'admin'
                    ? 'bg-[#00473e]/10 text-[#00473e] dark:bg-[#00cb87]/20 dark:text-[#00cb87] border-[#00473e]/30'
                    : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                }`}
              >
                {portalMode === 'admin' ? (lang === 'ar' ? 'بوابة الطبيب الإدارية' : 'Doctor Admin') : (lang === 'ar' ? 'بوابة المرضى' : 'Patient Portal')}
              </span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">{t('subtitle')}</p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Portal Switcher Button */}
          <button
            onClick={() => setPortalMode(portalMode === 'admin' ? 'patient' : 'admin')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
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
                <span>{lang === 'ar' ? 'عرض لوحة الإدارة (Doctor)' : 'Switch to Doctor Admin'}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#023326] text-[#122620] dark:text-slate-200 border border-[#e3ded5] dark:border-[#00cb87]/30 font-bold text-xs hover:bg-[#ece7de] transition"
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
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-white dark:bg-[#023326] border border-[#e3ded5] dark:border-[#00cb87]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#00473e]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
