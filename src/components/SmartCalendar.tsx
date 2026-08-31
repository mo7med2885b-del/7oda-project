import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Appointment, AppointmentStatus } from '../types';
import { doctorInfo } from '../utils/i18n';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  CalendarCheck,
  CheckCircle,
  PlayCircle,
  Search
} from 'lucide-react';

interface SmartCalendarProps {
  onOpenNewAppointment: () => void;
  onOpenTriageModal: (patientId: string) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({ onOpenTriageModal }) => {
  const { appointments, patients, addAppointment, updateAppointmentStatus, t, lang } = useClinic();

  const [currentDate, setCurrentDate] = useState<string>('2026-08-31');
  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'month' | 'list'>('week');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // New Booking State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [aptDate, setAptDate] = useState(currentDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:30');
  const [visitType, setVisitType] = useState('ICSI Protocol');
  const [visitReason, setVisitReason] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(doctorInfo.branches[0].id);

  // Week Days Generation (Aug 30 - Sep 5, 2026)
  const weekDays = [
    { dayNameAr: 'الأحد', dayNameEn: 'SUN', dateStr: '2026-08-30', num: 30 },
    { dayNameAr: 'الإثنين', dayNameEn: 'MON', dateStr: '2026-08-31', num: 31, isToday: true },
    { dayNameAr: 'الثلاثاء', dayNameEn: 'TUE', dateStr: '2026-09-01', num: 1 },
    { dayNameAr: 'الأربعاء', dayNameEn: 'WED', dateStr: '2026-09-02', num: 2 },
    { dayNameAr: 'الخميس', dayNameEn: 'THU', dateStr: '2026-09-03', num: 3 },
    { dayNameAr: 'الجمعة', dayNameEn: 'FRI', dateStr: '2026-09-04', num: 4 },
    { dayNameAr: 'السبت', dayNameEn: 'SAT', dateStr: '2026-09-05', num: 5 }
  ];

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesBranch = selectedBranchFilter === 'all' || apt.reason.includes(selectedBranchFilter);
    return matchesBranch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId);
    if (!pat) return alert(lang === 'ar' ? 'يرجى اختيار مريضة' : 'Please select a patient');

    const branchObj = doctorInfo.branches.find(b => b.id === selectedBranch);
    const branchName = branchObj ? (lang === 'ar' ? branchObj.city_ar : branchObj.city_en) : '';

    addAppointment({
      patient_id: pat.id,
      patient_name: pat.full_name,
      appointment_date: aptDate,
      start_time: startTime,
      end_time: endTime,
      status: 'Waiting',
      reason: `${visitReason || (lang === 'ar' ? 'كشف عيادة' : 'Consultation')} [${visitType} - ${branchName}]`,
      type: visitType
    });

    setShowBookingModal(false);
  };

  return (
    <div className="space-y-4">
      {/* ENTERPRISE CALENDAR BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#082930] border border-slate-200 dark:border-[#15606e]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#15606e] text-cyan-300 flex items-center justify-center font-mono font-black text-lg shadow">
            31
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                {lang === 'ar' ? 'أغسطس – سبتمبر 2026' : 'August – September 2026'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                GMT+03:00 (Cairo)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {lang === 'ar'
                ? 'جدول الحجوزات الذكي ومنع تعارض فروع د. محمد حسني'
                : 'Smart Conflict-Free Schedule across Cairo, Mansoura, Damietta & Port Said'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentDate('2026-08-31')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-xs font-bold text-slate-700 dark:text-cyan-300 hover:bg-slate-200"
          >
            {lang === 'ar' ? 'اليوم (Today)' : 'Today'}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#051c22] p-1 rounded-xl border border-slate-200 dark:border-[#15606e]/30">
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'week' ? 'bg-[#15606e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'أسبوعي (Week)' : 'Week'}
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'day' ? 'bg-[#15606e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'يومي (Day)' : 'Day'}
            </button>
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'list' ? 'bg-[#15606e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'قائمة (List)' : 'List Agenda'}
            </button>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 rounded-xl bg-[#00e599] hover:bg-[#00c985] text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'حجز موعد جديد' : 'New Appointment'}</span>
          </button>
        </div>
      </div>

      {/* CALENDAR MAIN BODY WITH LEFT MINI-PANEL & WEEKLY TIME GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT MINI CALENDAR & FILTERS PANEL */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#082930] border border-slate-200 dark:border-[#15606e]/40 shadow-xl space-y-6">
          {/* Mini Calendar Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-white font-mono">{lang === 'ar' ? 'أغسطس 2026' : 'August 2026'}</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded">‹</button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 gap-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-mono gap-1 text-slate-700 dark:text-slate-300">
              <span className="text-slate-400">26</span><span className="text-slate-400">27</span><span className="text-slate-400">28</span><span className="text-slate-400">29</span>
              <span>30</span>
              <span className="w-6 h-6 rounded-full bg-[#15606e] text-cyan-300 font-bold mx-auto flex items-center justify-center shadow">31</span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
          </div>

          {/* Branch Checkbox Filters */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <h4 className="font-extrabold text-[#15606e] dark:text-cyan-300 uppercase tracking-wider">
              {lang === 'ar' ? 'فروع العيادة (Branches)' : 'Clinic Branches'}
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="branch"
                  checked={selectedBranchFilter === 'all'}
                  onChange={() => setSelectedBranchFilter('all')}
                  className="accent-[#00e599]"
                />
                <span>{lang === 'ar' ? 'جميع الفروع (All Branches)' : 'All Branches'}</span>
              </label>
              {doctorInfo.branches.map(b => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="radio"
                    name="branch"
                    checked={selectedBranchFilter === b.id}
                    onChange={() => setSelectedBranchFilter(b.id)}
                    className="accent-[#00e599]"
                  />
                  <span>{lang === 'ar' ? b.city_ar : b.city_en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Legend Badges */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px]">
            <h4 className="font-extrabold text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'دليل نوع الإجراء' : 'Procedure Legend'}</h4>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-[#15606e]"></span><span>ICSI Protocol</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-cyan-500"></span><span>IVF Cycle</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-emerald-500"></span><span>Antenatal Care</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-amber-500"></span><span>Laparoscopy</span></div>
          </div>
        </div>

        {/* RIGHT FULL WEEKLY TIME GRID CALENDAR */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-[#082930] border border-slate-200 dark:border-[#15606e]/40 shadow-xl overflow-x-auto space-y-4">
          {calendarView === 'week' ? (
            <div className="min-w-[700px]">
              {/* Header Days Row */}
              <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 pb-3 text-center text-xs font-bold">
                <div className="text-slate-400 font-mono">GMT+03</div>
                {weekDays.map(d => (
                  <div key={d.dateStr} className={`space-y-1 ${d.isToday ? 'text-[#15606e] dark:text-[#00e599]' : 'text-slate-600 dark:text-slate-300'}`}>
                    <div className="uppercase font-mono text-[11px]">{lang === 'ar' ? d.dayNameAr : d.dayNameEn}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-mono font-black text-sm ${d.isToday ? 'bg-[#15606e] text-cyan-300 shadow-md' : ''}`}>
                      {d.num}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 relative">
                {timeSlots.map((time, idx) => (
                  <div key={idx} className="grid grid-cols-8 min-h-[56px] items-start text-[11px]">
                    <div className="py-2 text-slate-400 font-mono text-[10px]">{time}</div>

                    {weekDays.map(d => {
                      const hourStr = time.split(':')[0];
                      const slotAppointments = filteredAppointments.filter(
                        a => a.appointment_date === d.dateStr && a.start_time.startsWith(hourStr)
                      );

                      return (
                        <div key={d.dateStr} className="p-1 border-r border-slate-100 dark:border-slate-800/40 min-h-[56px] relative hover:bg-slate-50 dark:hover:bg-white/5 transition">
                          {d.isToday && idx === 3 && (
                            <div className="absolute top-4 left-0 right-0 border-t-2 border-rose-500 z-20 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-rose-500 -ml-1"></span>
                            </div>
                          )}

                          {slotAppointments.map(apt => (
                            <div
                              key={apt.id}
                              className="p-2 rounded-xl bg-[#15606e] text-white shadow-lg space-y-1 border border-cyan-400/40 hover:scale-105 transition cursor-pointer"
                            >
                              <div className="font-bold truncate text-[11px]">{apt.patient_name}</div>
                              <div className="text-[9px] text-cyan-200 truncate">{apt.reason}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-3">{lang === 'ar' ? 'التوقيت' : 'Time'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'المريضة' : 'Patient'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'التشخيص / السبب' : 'Procedure'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-3 px-3 font-mono text-[#15606e] dark:text-cyan-300 font-bold">{apt.start_time} - {apt.end_time}</td>
                      <td className="py-3 px-3 font-bold">{apt.patient_name}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{apt.reason}</td>
                      <td className="py-3 px-3"><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* NEW APPOINTMENT MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#082930] border border-cyan-400/40 p-6 space-y-4 text-white text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-black">{lang === 'ar' ? 'حجز موعد كشف جديد' : 'New Appointment'}</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{lang === 'ar' ? 'اسم المريضة *' : 'Patient Name *'}</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/20 text-white font-bold"
                >
                  <option value="">-- {lang === 'ar' ? 'اختر مريضة' : 'Select Patient'} --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={e => setAptDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{lang === 'ar' ? 'الفرع' : 'Branch'}</label>
                  <select
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/20 text-white font-bold"
                  >
                    {doctorInfo.branches.map(b => (
                      <option key={b.id} value={b.id}>{lang === 'ar' ? b.city_ar : b.city_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-[#00e599] text-slate-950 font-black text-sm shadow-xl">
                {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
