import React, { useMemo } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Appointment, Patient, AppointmentStatus } from '../types';
import {
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  PlayCircle,
  XCircle,
  CalendarClock,
  Sparkles,
  UserPlus,
  PlusCircle,
  BarChart2,
  PieChart
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewExpense: () => void;
  onOpenSoapNote: (patientId: string, appointmentId?: string) => void;
  onViewPatientProfile: (patientId: string) => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

const PROCEDURE_COLORS = ['#6AB8FF', '#2C3137', '#10b981', '#f59e0b', '#a855f7', '#ec4899'];

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenNewAppointment,
  onOpenNewInvoice,
  onOpenNewExpense,
  onOpenSoapNote,
  onViewPatientProfile,
  onOpenAiPrompt
}) => {
  const { appointments, patients, invoices, expenses, updateAppointmentStatus, t, lang, can } = useClinic();
  const isAr = lang === 'ar';
  const showFinancials = can('view_financials');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);

  // Status Metrics
  const totalScheduled = todayAppointments.length;
  const completedCount = todayAppointments.filter(a => a.status === 'Completed').length;
  const waitingCount = todayAppointments.filter(a => a.status === 'Waiting').length;
  const inConsultationCount = todayAppointments.filter(a => a.status === 'In Consultation').length;
  const scheduledCount = todayAppointments.filter(a => a.status === 'Scheduled').length;
  const cancelledCount = todayAppointments.filter(a => a.status === 'Cancelled' || a.status === 'No-Show').length;

  // Upcoming appointment metrics
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const weekAheadStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const activeUpcoming = appointments.filter(
    a => a.appointment_date > todayStr && a.status !== 'Cancelled' && a.status !== 'No-Show'
  );
  const tomorrowCount = activeUpcoming.filter(a => a.appointment_date === tomorrowStr).length;
  const weekAheadCount = activeUpcoming.filter(a => a.appointment_date <= weekAheadStr).length;
  const upcomingCount = activeUpcoming.length;

  // Financial Metrics Today
  const todayInvoices = invoices.filter(i => i.created_at.startsWith(todayStr));
  const todayGrossInflow = todayInvoices
    .filter(i => i.payment_status === 'Paid' || i.payment_status === 'Partially Paid')
    .reduce((acc, curr) => acc + curr.paid_amount, 0);

  const todayPendingPayments = todayInvoices
    .filter(i => i.payment_status !== 'Paid' && i.payment_status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.total_amount - curr.paid_amount), 0);

  const todayExpenses = expenses.filter(e => e.expense_date === todayStr).reduce((acc, curr) => acc + curr.amount, 0);

  // Month-to-date expenses
  const monthPrefix = todayStr.slice(0, 7);
  const monthExpenses = expenses
    .filter(e => (e.expense_date || '').startsWith(monthPrefix))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Revenue split: consultations vs procedures (based on invoice line items)
  const CONSULT_KEYWORDS = ['كشف', 'استشار', 'consult', 'follow'];
  const splitRevenue = todayInvoices
    .filter(i => i.payment_status === 'Paid' || i.payment_status === 'Partially Paid')
    .reduce(
      (acc, inv) => {
        const items = inv.items || [];
        const itemsTotal = items.reduce((s, it) => s + (it.total ?? it.total_price ?? 0), 0);
        const consultTotal = items
          .filter(it => CONSULT_KEYWORDS.some(k => (it.description || '').toLowerCase().includes(k)))
          .reduce((s, it) => s + (it.total ?? it.total_price ?? 0), 0);
        const ratio = itemsTotal > 0 ? consultTotal / itemsTotal : 1;
        acc.consultation += inv.paid_amount * ratio;
        acc.procedure += inv.paid_amount * (1 - ratio);
        return acc;
      },
      { consultation: 0, procedure: 0 }
    );
  const consultationRevenue = splitRevenue.consultation;
  const procedureRevenue = splitRevenue.procedure;

  // All-time outstanding receivables
  const totalOutstanding = invoices
    .filter(i => i.payment_status !== 'Paid' && i.payment_status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.total_amount - curr.paid_amount), 0);

  // ---- Real weekly revenue vs expense trend (last 7 days, computed from actual data) ----
  const dayNamesAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weeklyData = useMemo(() => {
    const days: { dateStr: string; day: string; revenue: number; expense: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = isAr ? dayNamesAr[d.getDay()] : dayNamesEn[d.getDay()];
      const dayInvoices = invoices.filter(inv => inv.created_at.startsWith(dateStr));
      const revenue = dayInvoices
        .filter(inv => inv.payment_status === 'Paid' || inv.payment_status === 'Partially Paid')
        .reduce((s, inv) => s + inv.paid_amount, 0);
      const expense = expenses.filter(e => e.expense_date === dateStr).reduce((s, e) => s + e.amount, 0);
      days.push({ dateStr, day: dayLabel, revenue, expense });
    }
    return days;
  }, [invoices, expenses, isAr]);

  const maxWeeklyValue = Math.max(1, ...weeklyData.map(d => Math.max(d.revenue, d.expense)));
  const weekTotalRevenue = weeklyData.reduce((s, d) => s + d.revenue, 0);
  const weekTotalExpense = weeklyData.reduce((s, d) => s + d.expense, 0);

  // ---- Real procedure/appointment-type breakdown (last 30 days) ----
  const proceduresData = useMemo(() => {
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const recent = appointments.filter(a => a.appointment_date >= cutoff && a.status !== 'Cancelled');
    const counts = new Map<string, number>();
    recent.forEach(a => {
      const key = a.type?.trim() || (isAr ? 'غير محدد' : 'Unspecified');
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const total = recent.length || 1;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], i) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
        color: PROCEDURE_COLORS[i % PROCEDURE_COLORS.length]
      }));
  }, [appointments, isAr]);

  const topProcedure = proceduresData[0];

  const handleAiBrief = (patient: Patient, apt: Appointment) => {
    if (!onOpenAiPrompt) return;
    const prompt = `قم بإجراء ملخص سريع بالذكاء الاصطناعي لموعد الكشف الحالي للمريضة:\n• الاسم: ${patient.full_name}\n• التوقيت: ${apt.start_time} - ${apt.end_time}\n• سبب الزيارة: ${apt.reason}\n• السن وفصيلة الدم: ${patient.age} سنة (${patient.blood_type})\n• التنبيهات الكلينيكية: ${patient.medical_alerts || 'لا يوجد'}\nقدم الملخص الكلينيكي والتوصيات السريعة للطبيب.`;
    onOpenAiPrompt(prompt);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Waiting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {t('waiting')}
          </span>
        );
      case 'In Consultation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#6AB8FF]/15 text-[#2C3137] dark:text-[#6AB8FF] border border-[#6AB8FF]/40">
            <PlayCircle className="w-3.5 h-3.5 text-[#6AB8FF]" aria-hidden="true" /> {t('active_exam')}
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> {t('completed')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" aria-hidden="true" /> {status}
          </span>
        );
    }
  };

  const egp = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const card = 'rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-sm';

  return (
    <div className="space-y-6">
      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onOpenNewAppointment}
          className="min-h-[44px] px-5 rounded-full bg-[#6AB8FF] hover:bg-[#4FA5F5] text-white font-bold text-sm shadow-sm transition flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          <span>{t('book_appointment')}</span>
        </button>
        <button
          onClick={onOpenNewInvoice}
          className="min-h-[44px] px-5 rounded-full bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-white border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm font-bold text-sm transition hover:border-[#6AB8FF] hover:text-[#6AB8FF] flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
        >
          <PlusCircle className="w-4 h-4 text-[#2C3137] dark:text-[#6AB8FF]" aria-hidden="true" />
          <span>{t('new_invoice')}</span>
        </button>
        {can('manage_expenses') && (
          <button
            onClick={onOpenNewExpense}
            className="min-h-[44px] px-5 rounded-full bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-white border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm font-bold text-sm transition hover:border-rose-400 hover:text-rose-500 flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
          >
            <DollarSign className="w-4 h-4 text-rose-500" aria-hidden="true" />
            <span>{t('record_expense')}</span>
          </button>
        )}
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Patients Today */}
        <div className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#6AB8FF]/12 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#6AB8FF]" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
              {isAr ? 'مرضى اليوم' : 'Patients Today'}
            </h3>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-4xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                {totalScheduled}
              </div>
              <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">
                {isAr ? 'إجمالي المواعيد' : 'Total appointments'}
              </div>
            </div>
            <dl className="text-end space-y-1">
              <div className="flex items-center justify-end gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400">{isAr ? 'انتظار' : 'Waiting'}</dt>
                <dd className="font-mono font-bold text-amber-600 dark:text-amber-300 w-6 text-end">{waitingCount}</dd>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400">{isAr ? 'كشف' : 'In exam'}</dt>
                <dd className="font-mono font-bold text-[#6AB8FF] w-6 text-end">{inConsultationCount}</dd>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400">{isAr ? 'مكتمل' : 'Done'}</dt>
                <dd className="font-mono font-bold text-emerald-500 w-6 text-end">{completedCount}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Card 2: Expense Today */}
        {showFinancials && (
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-rose-500/12 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-rose-500" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
                {isAr ? 'مصروفات اليوم' : 'Expense Today'}
              </h3>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400 leading-none" dir="ltr">
                  {egp(todayExpenses)}
                </div>
                <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'اليوم' : 'Today'}</div>
              </div>
              <div className="text-end">
                <div className="text-2xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                  {egp(monthExpenses)}
                </div>
                <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'هذا الشهر' : 'This month'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Collection Today */}
        {showFinancials && (
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/12 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
                {isAr ? 'تحصيل اليوم' : 'Collection Today'}
              </h3>
            </div>
            <div className="flex items-end justify-between gap-3">
              <dl className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <dt className="text-[#7C7C7C] dark:text-slate-400 w-16">{isAr ? 'كشوفات' : 'Clinic'}</dt>
                  <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{egp(consultationRevenue)}</dd>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <dt className="text-[#7C7C7C] dark:text-slate-400 w-16">{isAr ? 'إجراءات' : 'Procedures'}</dt>
                  <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{egp(procedureRevenue)}</dd>
                </div>
              </dl>
              <div className="text-end">
                <div className="text-3xl font-black text-[#6AB8FF] leading-none" dir="ltr">{egp(todayGrossInflow)}</div>
                <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'الإجمالي' : 'Total'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Due (Not Collected) */}
        {showFinancials && (
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-amber-500/12 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
                {isAr ? 'مستحقات غير محصلة' : 'Due (Not Collected)'}
              </h3>
            </div>
            <div className="flex items-end justify-between gap-3">
              <dl className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <dt className="text-[#7C7C7C] dark:text-slate-400 w-16">{isAr ? 'اليوم' : 'Today'}</dt>
                  <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{egp(todayPendingPayments)}</dd>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <dt className="text-[#7C7C7C] dark:text-slate-400 w-16">{isAr ? 'سابق' : 'Previous'}</dt>
                  <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                    {egp(Math.max(0, totalOutstanding - todayPendingPayments))}
                  </dd>
                </div>
              </dl>
              <div className="text-end">
                <div className="text-3xl font-black text-amber-600 dark:text-amber-300 leading-none" dir="ltr">
                  {egp(totalOutstanding)}
                </div>
                <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'الإجمالي' : 'Total'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Card 5: Appointment Status */}
        <div className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#2C3137]/8 dark:bg-white/10 flex items-center justify-center shrink-0">
              <CalendarClock className="w-4 h-4 text-[#2C3137] dark:text-white" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
              {isAr ? 'حالة المواعيد اليوم' : 'Appointment Status'}
            </h3>
          </div>
          <div className="flex items-end justify-between gap-3">
            <dl className="space-y-1">
              {[
                { label: isAr ? 'مجدول' : 'Scheduled', value: scheduledCount },
                { label: isAr ? 'انتظار' : 'Waiting', value: waitingCount },
                { label: isAr ? 'كشف' : 'In exam', value: inConsultationCount },
                { label: isAr ? 'مكتمل' : 'Completed', value: completedCount },
                { label: isAr ? 'ملغي' : 'Cancelled', value: cancelledCount }
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2 text-xs">
                  <dt className="text-[#7C7C7C] dark:text-slate-400 w-16">{row.label}</dt>
                  <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="text-end">
              <div className="text-3xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                {totalScheduled}
              </div>
              <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'الإجمالي' : 'Total'}</div>
            </div>
          </div>
        </div>

        {/* Card 6: Upcoming Appointments */}
        <div className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#6AB8FF]/12 flex items-center justify-center shrink-0">
              <CalendarClock className="w-4 h-4 text-[#6AB8FF]" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold text-[#2C3137] dark:text-white">
              {isAr ? 'المواعيد القادمة' : 'Upcoming Appointments'}
            </h3>
          </div>
          <div className="flex items-end justify-between gap-3">
            <dl className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400 w-20">{isAr ? 'غداً' : 'Tomorrow'}</dt>
                <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{tomorrowCount}</dd>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400 w-20">{isAr ? 'هذا الأسبوع' : 'This week'}</dt>
                <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{weekAheadCount}</dd>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <dt className="text-[#7C7C7C] dark:text-slate-400 w-20">{isAr ? 'كل المرضى' : 'All patients'}</dt>
                <dd className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">{patients.length}</dd>
              </div>
            </dl>
            <div className="text-end">
              <div className="text-3xl font-black text-[#6AB8FF] leading-none" dir="ltr">{upcomingCount}</div>
              <div className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1.5">{isAr ? 'الإجمالي' : 'Total'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics: real weekly trend + real procedure breakdown */}
      {showFinancials && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Weekly revenue vs expense — computed from actual invoices/expenses */}
          <div className={`${card} lg:col-span-2 p-5 sm:p-6 space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#6AB8FF]" aria-hidden="true" />
                  {isAr ? 'التدفق المالي — آخر 7 أيام' : 'Cash Flow — Last 7 Days'}
                </h3>
                <p className="text-xs text-[#7C7C7C] dark:text-slate-400 mt-1">
                  {isAr
                    ? `إجمالي الإيرادات ${egp(weekTotalRevenue)} ج.م، المصروفات ${egp(weekTotalExpense)} ج.م`
                    : `Total revenue ${egp(weekTotalRevenue)} EGP, expenses ${egp(weekTotalExpense)} EGP`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#6AB8FF]" aria-hidden="true" />
                  <span className="text-[#2C3137] dark:text-slate-200">{isAr ? 'إيرادات' : 'Revenue'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500" aria-hidden="true" />
                  <span className="text-[#2C3137] dark:text-slate-200">{isAr ? 'مصروفات' : 'Expense'}</span>
                </span>
              </div>
            </div>

            {weekTotalRevenue === 0 && weekTotalExpense === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center gap-2">
                <BarChart2 className="w-8 h-8 text-[#7C7C7C]" aria-hidden="true" />
                <p className="text-sm text-[#7C7C7C]">
                  {isAr ? 'لا توجد بيانات مالية خلال آخر 7 أيام.' : 'No financial activity in the last 7 days.'}
                </p>
              </div>
            ) : (
              <div
                role="img"
                aria-label={
                  isAr
                    ? `رسم بياني للإيرادات والمصروفات آخر 7 أيام، الإجمالي ${egp(weekTotalRevenue)} إيرادات و ${egp(weekTotalExpense)} مصروفات`
                    : `Bar chart of revenue and expenses over the last 7 days, totaling ${egp(weekTotalRevenue)} in revenue and ${egp(weekTotalExpense)} in expenses`
                }
                className="h-56 flex items-end justify-between gap-2 sm:gap-3 pt-8 pb-2 px-1 border-b border-[#C6D2E2] dark:border-white/10"
              >
                {weeklyData.map((d, i) => {
                  const revHeight = (d.revenue / maxWeeklyValue) * 100;
                  const expHeight = (d.expense / maxWeeklyValue) * 100;
                  const isToday = d.dateStr === todayStr;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${Math.max(revHeight, d.revenue > 0 ? 2 : 0)}%` }}
                          className="w-1/2 max-w-[22px] bg-[#6AB8FF] rounded-t-md transition-all relative"
                        >
                          {d.revenue > 0 && (
                            <span className="pointer-events-none opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition absolute -top-7 start-1/2 -translate-x-1/2 text-[11px] font-mono font-bold bg-[#22262B] text-white px-2 py-1 rounded shadow whitespace-nowrap z-10">
                              {egp(d.revenue)}
                            </span>
                          )}
                        </div>
                        <div
                          style={{ height: `${Math.max(expHeight, d.expense > 0 ? 2 : 0)}%` }}
                          className="w-1/2 max-w-[22px] bg-rose-500 rounded-t-md transition-all relative"
                        >
                          {d.expense > 0 && (
                            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition absolute -top-7 start-1/2 -translate-x-1/2 text-[11px] font-mono font-bold bg-[#22262B] text-white px-2 py-1 rounded shadow whitespace-nowrap z-10">
                              {egp(d.expense)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isToday ? 'text-[#6AB8FF]' : 'text-[#2C3137] dark:text-slate-300'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Procedure breakdown — computed from real appointment types, last 30 days */}
          <div className={`${card} p-5 sm:p-6 space-y-4`}>
            <h3 className="text-base font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#6AB8FF]" aria-hidden="true" />
              {isAr ? 'توزيع الإجراءات — 30 يوم' : 'Procedure Mix — 30 Days'}
            </h3>

            {proceduresData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#7C7C7C]">
                  {isAr ? 'لا توجد مواعيد خلال آخر 30 يوم.' : 'No appointments in the last 30 days.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {proceduresData.map((item, idx) => (
                  <li key={idx}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#2C3137] dark:text-slate-200 truncate pe-2">{item.name}</span>
                      <span className="font-mono text-[#6AB8FF] shrink-0">
                        {item.count} · {item.percent}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={item.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.name}: ${item.percent}%`}
                      className="w-full h-2.5 rounded-full bg-[#FCFDFF] dark:bg-[#22262B] overflow-hidden"
                    >
                      <div
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {topProcedure && (
              <p className="pt-3 border-t border-[#C6D2E2] dark:border-white/10 text-xs text-[#7C7C7C] dark:text-slate-300 leading-relaxed">
                {isAr ? 'الأكثر تكراراً هذا الشهر: ' : 'Most frequent this month: '}
                <strong className="text-[#2C3137] dark:text-white">{topProcedure.name}</strong>
                {isAr ? ` (${topProcedure.count} حالة)` : ` (${topProcedure.count} visits)`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Live Queue Board */}
      <div className={`${card} p-5 sm:p-6 space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6AB8FF]" aria-hidden="true" />
            {t('live_queue_board')} ({todayAppointments.length})
          </h3>
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#6AB8FF]/15 text-[#2C3137] dark:text-[#6AB8FF] font-bold shrink-0">
            {isAr ? 'مباشر' : 'LIVE'}
          </span>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="py-10 text-center">
            <CalendarClock className="w-8 h-8 text-[#7C7C7C] mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-[#7C7C7C]">{isAr ? 'لا توجد مواعيد اليوم.' : 'No appointments today.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-start border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#C6D2E2] dark:border-white/10 text-xs font-bold text-[#7C7C7C] dark:text-slate-400">
                  <th scope="col" className="py-3 px-3 text-start">{t('slot')}</th>
                  <th scope="col" className="py-3 px-3 text-start">{t('patient_name')}</th>
                  <th scope="col" className="py-3 px-3 text-start">{t('reason')}</th>
                  <th scope="col" className="py-3 px-3 text-start">{t('status')}</th>
                  <th scope="col" className="py-3 px-3 text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C6D2E2] dark:divide-white/10 text-sm">
                {todayAppointments.map(apt => {
                  const pat = patients.find(p => p.id === apt.patient_id);
                  return (
                    <tr key={apt.id} className="hover:bg-[#FCFDFF] dark:hover:bg-[#22262B]/50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-[#2C3137] dark:text-[#6AB8FF] whitespace-nowrap">
                        {apt.start_time} - {apt.end_time}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2C3137] dark:text-white">
                        <button
                          onClick={() => pat && onViewPatientProfile(pat.id)}
                          className="min-h-[36px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6AB8FF] rounded"
                        >
                          {apt.patient_name}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-[#7C7C7C] dark:text-slate-300 max-w-[220px] truncate">{apt.reason}</td>
                      <td className="py-3 px-3">{getStatusBadge(apt.status)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {pat && (
                            <button
                              onClick={() => handleAiBrief(pat, apt)}
                              className="min-h-[36px] px-3 rounded-lg bg-[#6AB8FF]/15 text-[#2C3137] dark:text-[#6AB8FF] font-bold text-xs hover:bg-[#6AB8FF] hover:text-white transition flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6AB8FF]"
                            >
                              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{t('ai_brief_btn')}</span>
                            </button>
                          )}

                          {apt.status === 'Waiting' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                              className="min-h-[36px] px-3 rounded-lg bg-[#2C3137] text-white font-bold text-xs hover:bg-[#1F2429] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6AB8FF]"
                            >
                              {t('start_exam')}
                            </button>
                          )}

                          {apt.status === 'In Consultation' && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'Completed');
                                if (pat) onOpenSoapNote(pat.id, apt.id);
                              }}
                              className="min-h-[36px] px-3 rounded-lg bg-[#6AB8FF] text-white font-bold text-xs hover:bg-[#4FA5F5] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6AB8FF]"
                            >
                              {t('finish_soap')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
