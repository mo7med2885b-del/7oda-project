import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { NavTab } from './Sidebar';
import {
  LayoutDashboard,
  Users,
  Landmark,
  Calendar,
  ShieldCheck,
  ChevronDown,
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  Globe,
  Heart,
  UserCog,
  LogOut
} from 'lucide-react';

interface TopNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAiFinancialAdvisor: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewExpense: () => void;
  onOpenUserManagement: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  actions: { label: string; run: () => void }[];
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiFinancialAdvisor,
  onOpenNewAppointment,
  onOpenNewInvoice,
  onOpenNewExpense,
  onOpenUserManagement
}) => {
  const { t, lang, theme, toggleTheme, toggleLang, setPortalMode, currentProfile, getAvatarUrl, signOut, can } = useClinic();
  const [openMenu, setOpenMenu] = useState<NavTab | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const avatarUrl = getAvatarUrl(currentProfile?.avatar_path);

  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      icon: LayoutDashboard,
      actions: [
        { label: lang === 'ar' ? 'عرض لوحة التحكم' : 'View Dashboard', run: () => setActiveTab('dashboard') },
        { label: lang === 'ar' ? 'المستشار المالي الذكي' : 'AI Financial Advisor', run: onOpenAiFinancialAdvisor }
      ]
    },
    {
      id: 'calendar',
      label: lang === 'ar' ? 'المواعيد' : 'Appointments',
      icon: Calendar,
      actions: [
        { label: lang === 'ar' ? 'الجدول الذكي' : 'Smart Calendar', run: () => setActiveTab('calendar') },
        { label: lang === 'ar' ? 'حجز موعد جديد' : 'New Appointment', run: onOpenNewAppointment }
      ]
    },
    {
      id: 'patients',
      label: lang === 'ar' ? 'المرضى' : 'Patients',
      icon: Users,
      actions: [
        { label: lang === 'ar' ? 'سجل المرضى' : 'Patient Registry', run: () => setActiveTab('patients') },
        // Secretaries take payments but have no Financials tab, so surface invoicing here
        ...(can('take_payments') && !can('view_financials')
          ? [{ label: lang === 'ar' ? 'إصدار فاتورة' : 'New Invoice', run: onOpenNewInvoice }]
          : [])
      ]
    },
    {
      id: 'financials',
      label: lang === 'ar' ? 'الحسابات' : 'Financials',
      icon: Landmark,
      actions: [
        { label: lang === 'ar' ? 'المركز المالي' : 'Financial Hub', run: () => setActiveTab('financials') },
        { label: lang === 'ar' ? 'إصدار فاتورة' : 'New Invoice', run: onOpenNewInvoice },
        { label: lang === 'ar' ? 'تسجيل مصروفات' : 'Record Expense', run: onOpenNewExpense }
      ]
    },
    {
      id: 'audit',
      label: lang === 'ar' ? 'سجل التدقيق' : 'Audit Logs',
      icon: ShieldCheck,
      actions: [{ label: lang === 'ar' ? 'عرض السجل' : 'View Logs', run: () => setActiveTab('audit') }]
    }
  ];

  // Hide sections this role has no access to (mirrors the database RLS policies)
  const navItems = allNavItems.filter(item => {
    if (item.id === 'financials') return can('view_financials');
    if (item.id === 'audit') return can('view_audit_logs');
    return true;
  });

  return (
    <div className="w-full px-3 sm:px-6 pt-4 pb-2">
      {/* Top row: profile left, title center, tools right */}
      <div className="relative flex items-start justify-between gap-3">
        {/* Profile chip */}
        <div ref={profileRef} className="relative shrink-0">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm hover:shadow transition"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#2C3137] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                {currentProfile?.full_name?.charAt(0) || '?'}
              </div>
            )}
            <div className="text-start hidden sm:block leading-tight">
              <div className="text-[11px] font-extrabold text-[#2C3137] dark:text-white">
                {currentProfile?.full_name || '—'}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400">
                {currentProfile?.role === 'admin'
                  ? lang === 'ar' ? 'مدير' : 'Admin'
                  : lang === 'ar' ? 'سكرتارية' : 'Secretary'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute top-full mt-2 start-0 z-50 w-56 rounded-2xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-xl p-1.5">
              <button
                onClick={() => {
                  onOpenUserManagement();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] transition"
              >
                <UserCog className="w-4 h-4 text-[#6AB8FF]" />
                <span>{can('manage_users') ? (lang === 'ar' ? 'إدارة الحساب والمستخدمين' : 'Account & Users') : lang === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</span>
              </button>

              <div className="my-1 h-px bg-[#C6D2E2] dark:bg-white/10" />

              <button
                onClick={() => {
                  toggleTheme();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2C3137]" />}
                <span>{theme === 'dark' ? t('theme_light') : t('theme_dark')}</span>
              </button>
              <button
                onClick={() => {
                  toggleLang();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] transition"
              >
                <Globe className="w-4 h-4 text-[#2C3137] dark:text-[#6AB8FF]" />
                <span>{lang === 'en' ? 'العربية' : 'English'}</span>
              </button>
              <button
                onClick={() => {
                  setPortalMode('patient');
                  window.history.pushState(null, '', '/welcome');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] transition"
              >
                <Heart className="w-4 h-4 text-[#6AB8FF]" />
                <span>{lang === 'ar' ? 'عرض بوابة المرضى' : 'Patient Portal'}</span>
              </button>

              <div className="my-1 h-px bg-[#C6D2E2] dark:bg-white/10" />

              <button
                onClick={() => {
                  setProfileOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Centered title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none hidden md:block">
          <h1 className="text-lg lg:text-xl font-black tracking-[0.15em] text-[#2C3137] dark:text-white uppercase">
            {lang === 'ar' ? 'عيادات د. محمد حسني' : 'HOSNY CLINIC ERP'}
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">
            {lang === 'ar' ? 'نظام إدارة العيادة والسجلات الطبية' : 'Clinic & Medical Records Management System'}
          </p>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm w-40 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
              className="bg-transparent text-[11px] text-[#2C3137] dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
            />
          </div>
          <button className="p-2.5 rounded-full bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm text-slate-500 dark:text-slate-300 hover:text-[#6AB8FF] transition">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAiFinancialAdvisor}
            className="p-2.5 rounded-full bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm text-slate-500 dark:text-slate-300 hover:text-[#6AB8FF] transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Greeting + pill nav row */}
      <div className="mt-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'أهلاً د. محمد!' : 'Hi, Dr. Mohamed!'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C3137] dark:text-white leading-tight">
            {lang === 'ar' ? 'أهلاً بعودتك' : 'Welcome Back'}
          </h2>
        </div>

        <div ref={navRef} className="flex-1 hidden md:flex items-center gap-2 flex-wrap lg:justify-center">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isOpen = openMenu === item.id;
            return (
              <div key={item.id} className="relative">
                <div
                  className={`flex items-center rounded-full border shadow-sm transition-all ${
                    isActive
                      ? 'bg-[#2C3137] border-[#2C3137] text-white shadow-[#2C3137]/25'
                      : 'bg-white dark:bg-[#22262B] border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setOpenMenu(null);
                    }}
                    className="flex items-center gap-2 pl-3 pr-2 py-2"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#6AB8FF] text-slate-950' : 'bg-[#FCFDFF] dark:bg-[#2C3137] text-[#2C3137] dark:text-[#6AB8FF]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] font-bold whitespace-nowrap">{item.label}</span>
                  </button>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.id)}
                    className={`px-2 py-2 border-s ${
                      isActive ? 'border-white/20' : 'border-[#C6D2E2] dark:border-[#6AB8FF]/20'
                    }`}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isOpen && (
                  <div className="absolute top-full mt-2 start-0 z-50 min-w-[200px] rounded-2xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-xl p-1.5">
                    {item.actions.map(action => (
                      <button
                        key={action.label}
                        onClick={() => {
                          action.run();
                          setOpenMenu(null);
                        }}
                        className="w-full text-start px-3 py-2 rounded-xl text-[11px] font-bold text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] transition whitespace-nowrap"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#22262B] border-t border-[#6AB8FF]/30 text-white px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl font-bold text-[10px] transition ${
                isActive ? 'text-[#6AB8FF] bg-white/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[55px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
