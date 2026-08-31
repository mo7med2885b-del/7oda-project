import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Sun, Moon, Shield, RefreshCw, Activity, Search, Globe, UserCheck, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, lang, toggleLang, t, portalMode, setPortalMode, userRole, setUserRole, resetToSeedData } = useClinic();

  const handleReset = () => {
    if (confirm(lang === 'ar' ? 'هل تريد إعادة ضبط البيانات التجريبية إلى الوضع الافتراضي؟' : 'Reset demo data to default initial seed dataset?')) {
      resetToSeedData();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-[#082930]/95 border-b border-slate-200 dark:border-[#15606e]/30 px-6 py-3 transition-colors shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Custom Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="/LOGO 7oda.jpg"
            alt="Dr. Mohamed Hosny Logo"
            className="w-11 h-11 rounded-xl object-cover border border-[#15606e]/30 shadow-md"
            onError={(e) => {
              // Fallback if image path relative
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-lg font-black tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
              {t('clinic_title')}
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                  portalMode === 'admin'
                    ? 'bg-[#15606e]/10 text-[#15606e] dark:bg-cyan-500/10 dark:text-[#00d9ff] border-[#15606e]/30'
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                }`}
              >
                {portalMode === 'admin' ? (lang === 'ar' ? 'بوابة الطبيب الإدارية' : 'Doctor Admin') : (lang === 'ar' ? 'بوابة المرضى' : 'Patient Portal')}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-[#051c22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#15606e]/30 focus:outline-none focus:ring-2 focus:ring-[#15606e]"
            />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Portal Switcher Button */}
          <button
            onClick={() => setPortalMode(portalMode === 'admin' ? 'patient' : 'admin')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
              portalMode === 'admin'
                ? 'bg-[#15606e] text-white hover:bg-[#0e4a55]'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title="Switch between Admin Doctor View and Public Patient Portal"
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#051c22] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#15606e]/30 font-bold text-xs hover:bg-slate-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-[#15606e]" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Role Switcher */}
          {portalMode === 'admin' && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30">
              <Shield className="w-3.5 h-3.5 text-[#15606e]" />
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-[#00d9ff] focus:outline-none cursor-pointer"
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
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#15606e]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
