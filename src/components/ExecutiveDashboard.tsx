import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Appointment, Patient, AppointmentStatus } from '../types';
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  XCircle,
  Sparkles,
  UserPlus,
  PlusCircle,
  Activity,
  BarChart2,
  PieChart,
  Award
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewExpense: () => void;
  onOpenSoapNote: (patientId: string, appointmentId?: string) => void;
  onViewPatientProfile: (patientId: string) => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenNewAppointment,
  onOpenNewInvoice,
  onOpenNewExpense,
  onOpenSoapNote,
  onViewPatientProfile,
  onOpenAiPrompt
}) => {
  const { appointments, patients, invoices, expenses, updateAppointmentStatus, t, lang, can } = useClinic();
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

  const todayExpenses = expenses
    .filter(e => e.expense_date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

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
        // Attribute the actually-collected amount proportionally to line items
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

  // Weekly Revenue Trend Data (Sat - Thu)
  const weeklyData = [
    { day: 'السبت', revenue: 18500, expense: 4200 },
    { day: 'الأحد', revenue: 24000, expense: 6100 },
    { day: 'الإثنين', revenue: 21500, expense: 3800 },
    { day: 'الثلاثاء', revenue: 29000, expense: 8500 },
    { day: 'الأربعاء', revenue: 26500, expense: 5000 },
    { day: 'الخميس', revenue: 32000, expense: 9200 }
  ];

  const maxWeeklyRevenue = Math.max(...weeklyData.map(d => d.revenue));

  // Procedure Breakdown Data
  const proceduresData = [
    { name: 'حقن مجهري (ICSI Cycles)', count: 42, percent: 38, color: '#6AB8FF' },
    { name: 'أطفال أنابيب (IVF Protocol)', count: 28, percent: 25, color: '#2C3137' },
    { name: 'متابعة حمل (Obstetrics Care)', count: 22, percent: 20, color: '#10b981' },
    { name: 'مناظير وسحب بويضات (Laparoscopy)', count: 18, percent: 17, color: '#f59e0b' }
  ];

  const handleAiBrief = (patient: Patient, apt: Appointment) => {
    if (!onOpenAiPrompt) return;
    const prompt = `قم بإجراء ملخص سريع بالذكاء الاصطناعي لموعد الكشف الحالي للمريضة:\n• الاسم: ${patient.full_name}\n• التوقيت: ${apt.start_time} - ${apt.end_time}\n• سبب الزيارة: ${apt.reason}\n• السن وفصيلة الدم: ${patient.age} سنة (${patient.blood_type})\n• التنبيهات الكلينيكية: ${patient.medical_alerts || 'لا يوجد'}\nقدم الملخص الكلينيكي والتوصيات السريعة للطبيب.`;
    onOpenAiPrompt(prompt);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Waiting':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {t('waiting')}
          </span>
        );
      case 'In Consultation':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#6AB8FF]/20 text-[#6AB8FF] border border-[#6AB8FF]/40 flex items-center gap-1.5 animate-pulse">
            <PlayCircle className="w-3.5 h-3.5 text-[#6AB8FF]" /> {t('active_exam')}
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> {t('completed')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenNewAppointment}
          className="px-4 py-2.5 rounded-full bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{t('book_appointment')}</span>
        </button>
        <button
          onClick={onOpenNewInvoice}
          className="px-4 py-2.5 rounded-full bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-white border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm font-bold text-xs transition hover:text-[#6AB8FF] flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-[#2C3137] dark:text-[#6AB8FF]" />
          <span>{t('new_invoice')}</span>
        </button>
        {can('manage_expenses') && (
          <button
            onClick={onOpenNewExpense}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-[#22262B] text-[#2C3137] dark:text-white border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm font-bold text-xs transition hover:text-[#6AB8FF] flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-rose-500" />
            <span>{t('record_expense')}</span>
          </button>
        )}
      </div>

      {/* Primary KPI Metric Cards - 6 card soft grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Patients Today */}
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'مرضى اليوم' : 'Patients Today'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-4xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                {String(totalScheduled).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'إجمالي المواعيد' : 'Total Appointments'}
              </div>
            </div>
            <div className="text-end space-y-1">
              <div className="flex items-center justify-end gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'في الانتظار' : 'Waiting'}</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-300 w-6 text-end">{String(waitingCount).padStart(2, '0')}</span>
              </div>
              <div className="flex items-center justify-end gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'قيد الكشف' : 'In Exam'}</span>
                <span className="font-mono font-bold text-[#6AB8FF] w-6 text-end">{String(inConsultationCount).padStart(2, '0')}</span>
              </div>
              <div className="flex items-center justify-end gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
                <span className="font-mono font-bold text-emerald-500 w-6 text-end">{String(completedCount).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Expense Today */}
        {showFinancials && (
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'مصروفات اليوم' : 'Expense Today'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 leading-none" dir="ltr">
                {todayExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'مصروفات' : 'Expense'}
              </div>
            </div>
            <div className="text-end">
              <div className="text-2xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                {monthExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'هذا الشهر' : 'This Month'}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Card 3: Collection Today */}
        {showFinancials && (
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'تحصيل اليوم' : 'Collection Today'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-14">{lang === 'ar' ? 'كشوفات' : 'Clinic'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {consultationRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-14">{lang === 'ar' ? 'إجراءات' : 'Procedures'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {procedureRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-3xl font-black text-[#6AB8FF] leading-none" dir="ltr">
                {todayGrossInflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Card 4: Due (Not Collected) */}
        {showFinancials && (
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'مستحقات (غير محصلة)' : 'Due (Not Collected)'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-14">{lang === 'ar' ? 'اليوم' : 'Today'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {todayPendingPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-14">{lang === 'ar' ? 'سابق' : 'Previous'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {Math.max(0, totalOutstanding - todayPendingPayments).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-300 leading-none" dir="ltr">
                {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Card 5: Appointment Status */}
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'حالة المواعيد اليوم' : 'Appointment Status'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              {[
                { label: lang === 'ar' ? 'مجدول' : 'Scheduled', value: scheduledCount },
                { label: lang === 'ar' ? 'في الانتظار' : 'Waiting', value: waitingCount },
                { label: lang === 'ar' ? 'قيد الكشف' : 'In Exam', value: inConsultationCount },
                { label: lang === 'ar' ? 'مكتمل' : 'Completed', value: completedCount },
                { label: lang === 'ar' ? 'ملغي' : 'Cancelled', value: cancelledCount }
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3 text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400 w-16">{row.label}</span>
                  <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                    {String(row.value).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-end">
              <div className="text-3xl font-black text-[#2C3137] dark:text-white leading-none" dir="ltr">
                {totalScheduled}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Upcoming Appointments */}
        <div className="p-6 rounded-[26px] bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/20 shadow-[0_4px_24px_-8px_rgba(0,71,62,0.12)]">
          <div className="text-center text-sm font-bold text-[#2C3137] dark:text-white mb-5">
            {lang === 'ar' ? 'المواعيد القادمة' : 'Upcoming Appointments'}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-16">{lang === 'ar' ? 'غداً' : 'Tomorrow'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {String(tomorrowCount).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-16">{lang === 'ar' ? 'هذا الأسبوع' : 'This Week'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {String(weekAheadCount).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 w-16">{lang === 'ar' ? 'إجمالي المرضى' : 'Total Patients'}</span>
                <span className="font-mono font-bold text-[#2C3137] dark:text-white" dir="ltr">
                  {String(patients.length).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-3xl font-black text-[#6AB8FF] leading-none" dir="ltr">
                {String(upcomingCount).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MEANINGFUL ANALYTICS & VISUAL GRAPHS SECTION */}
      {showFinancials && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH 1: Weekly Revenue vs Expense Inflow Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-[#2C3137] dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#6AB8FF]" />
                مؤشر التدفق المالي الأسبوعي (الإيرادات vs المصروفات)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">مقارنة الإيرادات اليومية من عمليات الحقن والمناظير بالمصروفات</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#6AB8FF]"></div>
                <span className="text-slate-600 dark:text-slate-300">الإيرادات (EGP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-rose-500"></div>
                <span className="text-slate-600 dark:text-slate-300">المصروفات (EGP)</span>
              </div>
            </div>
          </div>

          {/* Pure Responsive Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#C6D2E2] dark:border-white/10">
            {weeklyData.map((d, i) => {
              const revHeight = (d.revenue / maxWeeklyRevenue) * 100;
              const expHeight = (d.expense / maxWeeklyRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/2 bg-[#6AB8FF] hover:bg-[#4FA5F5] rounded-t-lg transition-all relative group-hover:brightness-110"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-[#22262B] text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
                        {d.revenue.toLocaleString()} EGP
                      </span>
                    </div>

                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-1/2 bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all relative group-hover:brightness-110"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-[#22262B] text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
                        {d.expense.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRAPH 2: Procedure Breakdown Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-[#2C3137] dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#6AB8FF]" />
            توزيع الحالات حسب الإجراء الطبي
          </h3>

          <div className="space-y-3 pt-2">
            {proceduresData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="font-mono text-[#6AB8FF]">{item.count} حالة ({item.percent}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#FCFDFF] dark:bg-[#22262B] overflow-hidden">
                  <div
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    className="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#C6D2E2] dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-300">
            💡 أعلى الحجوزات تسجيلاً هذا الشهر: <strong>بروتوكول الحقن المجهري (ICSI)</strong> بفرعي القاهرة والمنصورة.
          </div>
        </div>
      </div>
      )}

      {/* Main Section: Live Queue Board */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6AB8FF]" />
            {t('live_queue_board')} ({todayAppointments.length})
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#6AB8FF]/20 text-[#6AB8FF] font-bold">
            LIVE QUEUE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#C6D2E2] dark:border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">{t('slot')}</th>
                <th className="py-3 px-3">{t('patient_name')}</th>
                <th className="py-3 px-3">{t('reason')}</th>
                <th className="py-3 px-3">{t('status')}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C6D2E2] dark:divide-white/10 text-xs">
              {todayAppointments.map(apt => {
                const pat = patients.find(p => p.id === apt.patient_id);
                return (
                  <tr key={apt.id} className="hover:bg-[#FCFDFF]/50 dark:hover:bg-[#22262B]/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#2C3137] dark:text-[#6AB8FF]">
                      {apt.start_time} - {apt.end_time}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#2C3137] dark:text-white">
                      <button onClick={() => pat && onViewPatientProfile(pat.id)} className="hover:underline">
                        {apt.patient_name}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{apt.reason}</td>
                    <td className="py-3 px-3">{getStatusBadge(apt.status)}</td>
                    <td className="py-3 px-3 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        {pat && (
                          <button
                            onClick={() => handleAiBrief(pat, apt)}
                            className="px-2.5 py-1 rounded-lg bg-[#6AB8FF]/15 text-[#6AB8FF] font-bold text-xs hover:bg-[#6AB8FF] hover:text-slate-950 transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t('ai_brief_btn')}</span>
                          </button>
                        )}

                        {apt.status === 'Waiting' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="px-2.5 py-1 rounded-lg bg-[#2C3137] text-white font-bold text-[10px] hover:bg-[#1F2429]"
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
                            className="px-2.5 py-1 rounded-lg bg-[#6AB8FF] text-slate-950 font-bold text-[10px] hover:bg-[#4FA5F5]"
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
      </div>
    </div>
  );
};
