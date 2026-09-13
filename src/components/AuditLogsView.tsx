import React, { useMemo, useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { AuditLog } from '../types';
import {
  ShieldCheck,
  Lock,
  Search,
  ChevronDown,
  UserPlus,
  UserCog,
  Trash2,
  Calendar,
  FileText,
  Receipt,
  DollarSign,
  Pill,
  LogIn,
  Activity,
  Info
} from 'lucide-react';

/** Action → icon + accent. Falls back to a neutral activity icon. */
const ACTION_STYLE: { match: (a: string) => boolean; icon: React.ElementType; tone: string }[] = [
  { match: a => /delete|remove/i.test(a), icon: Trash2, tone: 'text-rose-500 bg-rose-500/10' },
  { match: a => /create patient|register/i.test(a), icon: UserPlus, tone: 'text-emerald-500 bg-emerald-500/10' },
  { match: a => /update (patient|profile)/i.test(a), icon: UserCog, tone: 'text-[#6AB8FF] bg-[#6AB8FF]/10' },
  { match: a => /appointment/i.test(a), icon: Calendar, tone: 'text-violet-500 bg-violet-500/10' },
  { match: a => /soap|record/i.test(a), icon: FileText, tone: 'text-amber-500 bg-amber-500/10' },
  { match: a => /invoice|payment/i.test(a), icon: Receipt, tone: 'text-emerald-500 bg-emerald-500/10' },
  { match: a => /expense/i.test(a), icon: DollarSign, tone: 'text-rose-500 bg-rose-500/10' },
  { match: a => /drug|stock|movement/i.test(a), icon: Pill, tone: 'text-[#6AB8FF] bg-[#6AB8FF]/10' },
  { match: a => /login|sign/i.test(a), icon: LogIn, tone: 'text-slate-500 bg-slate-500/10' }
];
const styleFor = (action: string) =>
  ACTION_STYLE.find(s => s.match(action)) || { icon: Activity, tone: 'text-slate-500 bg-slate-500/10' };

const ROLE_LABEL: Record<string, { en: string; ar: string }> = {
  Admin: { en: 'Admin', ar: 'مدير' },
  Doctor: { en: 'Doctor', ar: 'طبيب' },
  Receptionist: { en: 'Receptionist', ar: 'استقبال' },
  Accountant: { en: 'Accountant', ar: 'محاسب' }
};

const formatDetails = (details?: Record<string, any>): string => {
  if (!details) return '';
  return Object.entries(details)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' · ');
};

const formatTime = (iso: string, lang: 'en' | 'ar') => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const AuditLogsView: React.FC = () => {
  const { auditLogs, lang } = useClinic();
  const isAr = lang === 'ar';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const roles = useMemo(() => Array.from(new Set(auditLogs.map(l => l.user_role))), [auditLogs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return auditLogs.filter(log => {
      const matchesRole = roleFilter === 'all' || log.user_role === roleFilter;
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        formatDetails(log.details).toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [auditLogs, search, roleFilter]);

  const card = 'rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-sm';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`${card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3137] dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#6AB8FF]" aria-hidden="true" />
            {isAr ? 'سجل التدقيق الأمني' : 'Audit Security Log'}
          </h2>
          <p className="text-sm text-[#7C7C7C] dark:text-slate-400 mt-1.5 leading-relaxed">
            {isAr
              ? 'سجل ثابت لكل تعديل على بيانات المرضى والحسابات وإجراءات النظام.'
              : 'An immutable record of every change to patient data, financial postings, and system actions.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0 self-start">
          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
          {isAr ? 'محمي بسياسات Supabase RLS' : 'Protected by Supabase RLS'}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[#7C7C7C]" aria-hidden="true" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث في السجل...' : 'Search the log...'}
            aria-label={isAr ? 'ابحث في سجل التدقيق' : 'Search audit log'}
            className="w-full min-h-[44px] ps-11 pe-4 rounded-xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white placeholder:text-[#7C7C7C] focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label={isAr ? 'تصفية حسب الدور' : 'Filter by role'}>
          <button
            onClick={() => setRoleFilter('all')}
            aria-pressed={roleFilter === 'all'}
            className={`min-h-[44px] px-4 rounded-full text-sm font-bold whitespace-nowrap border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30 ${
              roleFilter === 'all'
                ? 'bg-[#2C3137] text-white border-[#2C3137]'
                : 'bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-slate-200 border-[#C6D2E2] dark:border-[#6AB8FF]/25 hover:border-[#6AB8FF]'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              aria-pressed={roleFilter === r}
              className={`min-h-[44px] px-4 rounded-full text-sm font-bold whitespace-nowrap border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30 ${
                roleFilter === r
                  ? 'bg-[#2C3137] text-white border-[#2C3137]'
                  : 'bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-slate-200 border-[#C6D2E2] dark:border-[#6AB8FF]/25 hover:border-[#6AB8FF]'
              }`}
            >
              {isAr ? ROLE_LABEL[r]?.ar || r : ROLE_LABEL[r]?.en || r}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs font-semibold text-[#7C7C7C] dark:text-slate-400 px-1">
        {isAr
          ? `${filtered.length} من ${auditLogs.length} حدث`
          : `${filtered.length} of ${auditLogs.length} events`}
      </p>

      {/* Timeline feed */}
      {filtered.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <ShieldCheck className="w-10 h-10 text-[#7C7C7C] mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#2C3137] dark:text-white">
            {isAr ? 'لا توجد أحداث مطابقة' : 'No matching events'}
          </p>
          <p className="text-sm text-[#7C7C7C] mt-1">
            {isAr ? 'جرّب تغيير البحث أو الفلتر.' : 'Try adjusting the search or filter.'}
          </p>
        </div>
      ) : (
        <ol className={`${card} divide-y divide-[#C6D2E2] dark:divide-white/10`}>
          {filtered.map(log => {
            const { icon: Icon, tone } = styleFor(log.action);
            const detailsText = formatDetails(log.details);
            const isOpen = expandedId === log.id;
            return (
              <li key={log.id}>
                <button
                  onClick={() => setExpandedId(isOpen ? null : log.id)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[44px] flex items-center gap-3 p-4 text-start hover:bg-[#FCFDFF] dark:hover:bg-[#22262B]/60 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/20 focus-visible:ring-inset"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#2C3137] dark:text-white">{log.action}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C6D2E2]/50 dark:bg-white/10 text-[11px] font-bold text-[#2C3137] dark:text-slate-200">
                        {isAr ? ROLE_LABEL[log.user_role]?.ar || log.user_role : ROLE_LABEL[log.user_role]?.en || log.user_role}
                      </span>
                    </div>
                    <div className="text-sm text-[#7C7C7C] dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{log.entity_type}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={log.timestamp} className="font-mono">
                        {formatTime(log.timestamp, lang)}
                      </time>
                    </div>
                  </div>

                  {detailsText && (
                    <ChevronDown
                      className={`w-4 h-4 text-[#7C7C7C] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {isOpen && detailsText && (
                  <div className="px-4 pb-4 ps-[70px]">
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-white/10">
                      <Info className="w-4 h-4 text-[#7C7C7C] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-[#2C3137] dark:text-slate-200 leading-relaxed break-words">
                        {detailsText}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
