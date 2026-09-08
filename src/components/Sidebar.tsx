import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { LayoutDashboard, Users, Landmark, Calendar, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';

export type NavTab = 'dashboard' | 'patients' | 'financials' | 'calendar' | 'doctor_profile' | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAiFinancialAdvisor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAiFinancialAdvisor }) => {
  const { t, lang } = useClinic();

  const navItems = [
    { id: 'dashboard' as NavTab, label: t('nav_command'), icon: LayoutDashboard, badge: 'Live' },
    { id: 'calendar' as NavTab, label: t('nav_calendar'), icon: Calendar, badge: 'Schedule' },
    { id: 'patients' as NavTab, label: t('nav_patients'), icon: Users, badge: '16' },
    { id: 'financials' as NavTab, label: t('nav_financials'), icon: Landmark, badge: 'Ledger' },
    { id: 'audit' as NavTab, label: t('nav_audit'), icon: ShieldCheck, badge: 'RLS' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white dark:bg-[#22262B] border-r dark:border-[#6AB8FF]/20 border-[#C6D2E2] p-4 flex-col justify-between min-h-[calc(100vh-61px)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-[11px] font-extrabold text-[#2C3137] dark:text-[#6AB8FF] uppercase tracking-wider px-3 mb-2">
              {lang === 'ar' ? 'وحدات عيادة د. محمد حسني' : 'Clinic Navigation'}
            </h2>
            <nav className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-[#2C3137] text-white shadow-lg shadow-[#2C3137]/30'
                        : 'text-[#2C3137] dark:text-slate-200 hover:bg-[#FCFDFF] dark:hover:bg-[#2C3137] hover:text-[#2C3137] dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#6AB8FF]' : 'text-[#2C3137] dark:text-[#6AB8FF]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FCFDFF] dark:bg-[#2C3137] text-slate-700 dark:text-slate-300 border border-[#C6D2E2] dark:border-[#6AB8FF]/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Financial Advisor Quick Launch Widget */}
          <div className="rounded-2xl p-4 bg-gradient-to-b from-[#2C3137] to-[#22262B] text-white shadow-xl relative overflow-hidden group border border-[#6AB8FF]/30">
            <div className="flex items-center gap-2 mb-2 text-[#6AB8FF]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">{t('ai_financial_advisor_title')}</span>
            </div>
            <p className="text-[11px] text-slate-200 mb-3 leading-relaxed">
              {t('ai_financial_advisor_desc')}
            </p>
            <button
              onClick={onOpenAiFinancialAdvisor}
              className="w-full py-2 px-3 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 text-xs font-black shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <span>{t('analyze_cash_flow')}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t dark:border-[#6AB8FF]/20 border-[#C6D2E2] text-center">
          <div className="text-[11px] text-[#2C3137] dark:text-white font-extrabold">عيادات د. محمد حسني علي</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">القاهرة • المنصورة • دمياط • بورسعيد</div>
        </div>
      </aside>

      {/* Mobile Bottom Responsive Navigation Bar */}
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
    </>
  );
};
