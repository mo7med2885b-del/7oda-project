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
  const { appointments, patients, invoices, expenses, updateAppointmentStatus, t } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);

  // Status Metrics
  const totalScheduled = todayAppointments.length;
  const completedCount = todayAppointments.filter(a => a.status === 'Completed').length;
  const waitingCount = todayAppointments.filter(a => a.status === 'Waiting').length;
  const inConsultationCount = todayAppointments.filter(a => a.status === 'In Consultation').length;

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
    { name: 'حقن مجهري (ICSI Cycles)', count: 42, percent: 38, color: '#00cb87' },
    { name: 'أطفال أنابيب (IVF Protocol)', count: 28, percent: 25, color: '#00473e' },
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
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00cb87]/20 text-[#00cb87] border border-[#00cb87]/40 flex items-center gap-1.5 animate-pulse">
            <PlayCircle className="w-3.5 h-3.5 text-[#00cb87]" /> {t('active_exam')}
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
      {/* Top Welcome & Quick Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
        <div>
          <div className="text-xs font-black text-[#00473e] dark:text-[#00cb87] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#00473e] dark:text-[#00cb87]" />
            <span>{t('exec_header')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight dark:text-white text-[#122620]">
            {t('exec_sub')} - عيادات د. محمد حسني علي
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            {t('exec_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenNewAppointment}
            className="w-full px-4 py-2.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs shadow transition flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>{t('book_appointment')}</span>
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] text-[#122620] dark:text-white hover:bg-slate-200 border border-[#e3ded5] dark:border-[#00cb87]/30 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#00473e] dark:text-[#00cb87]" />
            <span>{t('new_invoice')}</span>
          </button>
          <button
            onClick={onOpenNewExpense}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] text-[#122620] dark:text-white hover:bg-slate-200 border border-[#e3ded5] dark:border-[#00cb87]/30 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-rose-500" />
            <span>{t('record_expense')}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('queue_title')}</span>
            <div className="w-8 h-8 rounded-xl bg-[#00cb87]/15 flex items-center justify-center text-[#00473e] dark:text-[#00cb87]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono dark:text-white text-[#122620] mb-2">
            {totalScheduled} <span className="text-xs font-sans font-normal text-slate-400">{t('scheduled_today')}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#e3ded5] dark:border-white/10 text-[11px]">
            <div>
              <span className="text-amber-600 dark:text-amber-300 font-bold">{waitingCount}</span> <span className="text-slate-500 dark:text-slate-400">{t('waiting')}</span>
            </div>
            <div>
              <span className="text-[#00cb87] font-bold">{inConsultationCount}</span> <span className="text-slate-500 dark:text-slate-400">{t('active_exam')}</span>
            </div>
            <div>
              <span className="text-emerald-500 font-bold">{completedCount}</span> <span className="text-slate-500 dark:text-slate-400">{t('completed')}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('gross_inflow_today')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[#00cb87] mb-2" dir="ltr">
            EGP {todayGrossInflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-[#e3ded5] dark:border-white/10 pt-2">
            <span>{t('pending_receivables')}:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-300" dir="ltr">EGP {todayPendingPayments.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('today_expenses')}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 mb-2" dir="ltr">
            EGP {todayExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-[#e3ded5] dark:border-white/10 pt-2">
            <span>{t('net_operating_cashflow')}:</span>
            <span className={`font-mono font-bold ${todayGrossInflow - todayExpenses >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} dir="ltr">
              EGP {(todayGrossInflow - todayExpenses).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">نسبة نجاح الحقن المجهري</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[#00cb87] mb-2">
            78.4% <span className="text-xs font-sans font-normal text-slate-400">First Try ICSI</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-[#e3ded5] dark:border-white/10 pt-2">
            <span>إجمالي الحالات المتعافية:</span>
            <span className="font-mono font-bold text-emerald-500">+100 حالة</span>
          </div>
        </div>
      </div>

      {/* MEANINGFUL ANALYTICS & VISUAL GRAPHS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH 1: Weekly Revenue vs Expense Inflow Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-[#122620] dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#00cb87]" />
                مؤشر التدفق المالي الأسبوعي (الإيرادات vs المصروفات)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">مقارنة الإيرادات اليومية من عمليات الحقن والمناظير بالمصروفات</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#00cb87]"></div>
                <span className="text-slate-600 dark:text-slate-300">الإيرادات (EGP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-rose-500"></div>
                <span className="text-slate-600 dark:text-slate-300">المصروفات (EGP)</span>
              </div>
            </div>
          </div>

          {/* Pure Responsive Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#e3ded5] dark:border-white/10">
            {weeklyData.map((d, i) => {
              const revHeight = (d.revenue / maxWeeklyRevenue) * 100;
              const expHeight = (d.expense / maxWeeklyRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/2 bg-[#00cb87] hover:bg-[#00b074] rounded-t-lg transition-all relative group-hover:brightness-110"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-[#001c15] text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
                        {d.revenue.toLocaleString()} EGP
                      </span>
                    </div>

                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-1/2 bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all relative group-hover:brightness-110"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-[#001c15] text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
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
        <div className="p-6 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-[#122620] dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#00cb87]" />
            توزيع الحالات حسب الإجراء الطبي
          </h3>

          <div className="space-y-3 pt-2">
            {proceduresData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="font-mono text-[#00cb87]">{item.count} حالة ({item.percent}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#ece7de] dark:bg-[#001c15] overflow-hidden">
                  <div
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    className="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e3ded5] dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-300">
            💡 أعلى الحجوزات تسجيلاً هذا الشهر: <strong>بروتوكول الحقن المجهري (ICSI)</strong> بفرعي القاهرة والمنصورة.
          </div>
        </div>
      </div>

      {/* Main Section: Live Queue Board */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#122620] dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00cb87]" />
            {t('live_queue_board')} ({todayAppointments.length})
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-bold">
            LIVE QUEUE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e3ded5] dark:border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">{t('slot')}</th>
                <th className="py-3 px-3">{t('patient_name')}</th>
                <th className="py-3 px-3">{t('reason')}</th>
                <th className="py-3 px-3">{t('status')}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3ded5] dark:divide-white/10 text-xs">
              {todayAppointments.map(apt => {
                const pat = patients.find(p => p.id === apt.patient_id);
                return (
                  <tr key={apt.id} className="hover:bg-[#ece7de]/50 dark:hover:bg-[#001c15]/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#00473e] dark:text-[#00cb87]">
                      {apt.start_time} - {apt.end_time}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#122620] dark:text-white">
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
                            className="px-2.5 py-1 rounded-lg bg-[#00cb87]/15 text-[#00cb87] font-bold text-xs hover:bg-[#00cb87] hover:text-slate-950 transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t('ai_brief_btn')}</span>
                          </button>
                        )}

                        {apt.status === 'Waiting' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="px-2.5 py-1 rounded-lg bg-[#00473e] text-white font-bold text-[10px] hover:bg-[#003831]"
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
                            className="px-2.5 py-1 rounded-lg bg-[#00cb87] text-slate-950 font-bold text-[10px] hover:bg-[#00b074]"
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
