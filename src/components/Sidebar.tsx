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
    { id: 'doctor_profile' as NavTab, label: t('nav_doctor_profile'), icon: Stethoscope, badge: 'Maven' },
    { id: 'audit' as NavTab, label: t('nav_audit'), icon: ShieldCheck, badge: 'RLS' }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#082930] border-r dark:border-[#15606e]/30 border-slate-200 p-4 flex flex-col justify-between min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <h2 className="text-[11px] font-extrabold text-[#15606e] dark:text-cyan-300 uppercase tracking-wider px-3 mb-2">
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
                      ? 'bg-[#15606e] text-white shadow-lg shadow-[#15606e]/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#051c22] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-[#15606e] dark:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-[#051c22] text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-[#15606e]/30'
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
        <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e4a55] to-[#082930] text-white shadow-xl relative overflow-hidden group border border-cyan-400/30">
          <div className="flex items-center gap-2 mb-2 text-cyan-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">{t('ai_financial_advisor_title')}</span>
          </div>
          <p className="text-[11px] text-slate-200 mb-3 leading-relaxed">
            {t('ai_financial_advisor_desc')}
          </p>
          <button
            onClick={onOpenAiFinancialAdvisor}
            className="w-full py-2 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <span>{t('analyze_cash_flow')}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t dark:border-[#15606e]/30 border-slate-200 text-center">
        <div className="text-[11px] text-slate-900 dark:text-white font-extrabold">عيادات د. محمد حسني علي</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">القاهرة • المنصورة • دمياط • بورسعيد</div>
      </div>
    </aside>
  );
};
