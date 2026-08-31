import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { AppointmentStatus } from '../types';
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
  Search,
  UserPlus,
  Users,
  X
} from 'lucide-react';

interface SmartCalendarProps {
  onOpenNewAppointment?: () => void;
  onOpenTriageModal: (patientId: string) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({ onOpenTriageModal }) => {
  const { appointments, patients, addPatient, addAppointment, updateAppointmentStatus, t, lang } = useClinic();

  const [currentDate, setCurrentDate] = useState<string>('2026-08-31');
  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'month' | 'list'>('week');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // New Booking State
  const [isCreatingNewPatient, setIsCreatingNewPatient] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  // Quick New Patient Form Fields
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNationalId, setNewNationalId] = useState('');
  const [newAge, setNewAge] = useState<number>(30);
  const [newBloodType, setNewBloodType] = useState('A+');

  // Appointment Form Fields
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
    let patientIdToBook = selectedPatientId;
    let patientNameToBook = '';

    if (isCreatingNewPatient) {
      if (!newFullName || !newPhone || !newNationalId) {
        alert(lang === 'ar' ? 'يرجى ملء كافة بيانات المريضة الجديدة (الاسم، الهاتف، الرقم القومي).' : 'Please fill full name, phone & national ID.');
        return;
      }

      const createdPat = addPatient({
        full_name: newFullName,
        phone: newPhone,
        national_id: newNationalId,
        age: Number(newAge),
        gender: 'Female',
        blood_type: newBloodType,
        medical_alerts: 'حجز جديد عن طريق الأجندة الطبية',
        allergies: 'None',
        emergency_contact: 'N/A'
      });

      patientIdToBook = createdPat.id;
      patientNameToBook = createdPat.full_name;
    } else {
      const pat = patients.find(p => p.id === selectedPatientId);
      if (!pat) return alert(lang === 'ar' ? 'يرجى اختيار مريضة مسجلة أو إضافة مريضة جديدة.' : 'Please select a patient or create a new one.');
      patientNameToBook = pat.full_name;
    }

    const branchObj = doctorInfo.branches.find(b => b.id === selectedBranch);
    const branchName = branchObj ? (lang === 'ar' ? branchObj.city_ar : branchObj.city_en) : '';

    addAppointment({
      patient_id: patientIdToBook,
      patient_name: patientNameToBook,
      appointment_date: aptDate,
      start_time: startTime,
      end_time: endTime,
      status: 'Waiting',
      reason: `${visitReason || (lang === 'ar' ? 'كشف عيادة' : 'Consultation')} [${visitType} - ${branchName}]`,
      type: visitType
    });

    alert(lang === 'ar' ? `تم تسجيل وحجز الموعد بنجاح للمريضة (${patientNameToBook})!` : `Appointment booked successfully for ${patientNameToBook}!`);

    // Reset Form
    setIsCreatingNewPatient(false);
    setSelectedPatientId('');
    setNewFullName('');
    setNewPhone('');
    setNewNationalId('');
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-4">
      {/* ENTERPRISE CALENDAR BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00cb87] text-slate-950 flex items-center justify-center font-mono font-black text-lg shadow">
            31
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#122620] dark:text-white font-serif">
                {lang === 'ar' ? 'أغسطس – سبتمبر 2026' : 'August – September 2026'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-mono text-[10px] font-bold">
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
            className="px-3.5 py-2 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-xs font-bold text-[#122620] dark:text-[#00cb87] hover:bg-slate-200"
          >
            {lang === 'ar' ? 'اليوم (Today)' : 'Today'}
          </button>

          <div className="flex items-center gap-1 bg-[#ece7de] dark:bg-[#001c15] p-1 rounded-xl border border-[#e3ded5] dark:border-[#00cb87]/30">
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'week' ? 'bg-[#00473e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'أسبوعي (Week)' : 'Week'}
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'day' ? 'bg-[#00473e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'يومي (Day)' : 'Day'}
            </button>
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calendarView === 'list' ? 'bg-[#00473e] text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {lang === 'ar' ? 'قائمة (List)' : 'List Agenda'}
            </button>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{lang === 'ar' ? 'حجز موعد جديد' : 'New Appointment'}</span>
          </button>
        </div>
      </div>

      {/* CALENDAR MAIN BODY WITH LEFT MINI-PANEL & WEEKLY TIME GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT MINI CALENDAR & FILTERS PANEL */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm space-y-6">
          {/* Mini Calendar Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#122620] dark:text-white font-mono">{lang === 'ar' ? 'أغسطس 2026' : 'August 2026'}</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-[#ece7de] dark:hover:bg-white/10 rounded">‹</button>
                <button className="p-1 hover:bg-[#ece7de] dark:hover:bg-white/10 rounded">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 gap-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-mono gap-1 text-slate-700 dark:text-slate-300">
              <span className="text-slate-400">26</span><span className="text-slate-400">27</span><span className="text-slate-400">28</span><span className="text-slate-400">29</span>
              <span>30</span>
              <span className="w-6 h-6 rounded-full bg-[#00cb87] text-slate-950 font-bold mx-auto flex items-center justify-center shadow">31</span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
          </div>

          {/* Branch Checkbox Filters */}
          <div className="space-y-3 pt-4 border-t border-[#e3ded5] dark:border-white/10 text-xs">
            <h4 className="font-extrabold text-[#00473e] dark:text-[#00cb87] uppercase tracking-wider">
              {lang === 'ar' ? 'فروع العيادة (Branches)' : 'Clinic Branches'}
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#122620] dark:text-white">
                <input
                  type="radio"
                  name="branch"
                  checked={selectedBranchFilter === 'all'}
                  onChange={() => setSelectedBranchFilter('all')}
                  className="accent-[#00cb87]"
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
                    className="accent-[#00cb87]"
                  />
                  <span>{lang === 'ar' ? b.city_ar : b.city_en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Legend Badges */}
          <div className="space-y-2 pt-4 border-t border-[#e3ded5] dark:border-white/10 text-[11px]">
            <h4 className="font-extrabold text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'دليل نوع الإجراء' : 'Procedure Legend'}</h4>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-[#00473e]"></span><span>ICSI Protocol</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-[#00cb87]"></span><span>IVF Cycle</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-emerald-500"></span><span>Antenatal Care</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-amber-500"></span><span>Laparoscopy</span></div>
          </div>
        </div>

        {/* RIGHT FULL WEEKLY TIME GRID CALENDAR */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm overflow-x-auto space-y-4">
          {calendarView === 'week' ? (
            <div className="min-w-[700px]">
              {/* Header Days Row */}
              <div className="grid grid-cols-8 border-b border-[#e3ded5] dark:border-white/10 pb-3 text-center text-xs font-bold">
                <div className="text-slate-400 font-mono">GMT+03</div>
                {weekDays.map(d => (
                  <div key={d.dateStr} className={`space-y-1 ${d.isToday ? 'text-[#00473e] dark:text-[#00cb87]' : 'text-slate-600 dark:text-slate-300'}`}>
                    <div className="uppercase font-mono text-[11px]">{lang === 'ar' ? d.dayNameAr : d.dayNameEn}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-mono font-black text-sm ${d.isToday ? 'bg-[#00cb87] text-slate-950 shadow-md' : ''}`}>
                      {d.num}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="divide-y divide-[#e3ded5] dark:divide-white/10 relative">
                {timeSlots.map((time, idx) => (
                  <div key={idx} className="grid grid-cols-8 min-h-[56px] items-start text-[11px]">
                    <div className="py-2 text-slate-400 font-mono text-[10px]">{time}</div>

                    {weekDays.map(d => {
                      const hourStr = time.split(':')[0];
                      const slotAppointments = filteredAppointments.filter(
                        a => a.appointment_date === d.dateStr && a.start_time.startsWith(hourStr)
                      );

                      return (
                        <div key={d.dateStr} className="p-1 border-r border-[#e3ded5] dark:border-white/10 min-h-[56px] relative hover:bg-[#ece7de]/40 dark:hover:bg-[#001c15]/40 transition">
                          {d.isToday && idx === 3 && (
                            <div className="absolute top-4 left-0 right-0 border-t-2 border-rose-500 z-20 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-rose-500 -ml-1"></span>
                            </div>
                          )}

                          {slotAppointments.map(apt => (
                            <div
                              key={apt.id}
                              className="p-2 rounded-xl bg-[#00473e] text-white shadow space-y-1 border border-[#00cb87]/40 hover:scale-105 transition cursor-pointer"
                            >
                              <div className="font-bold truncate text-[11px]">{apt.patient_name}</div>
                              <div className="text-[9px] text-[#00cb87] truncate">{apt.reason}</div>
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
              <table className="w-full text-right rtl:text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e3ded5] dark:border-white/10 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-3">{lang === 'ar' ? 'التوقيت' : 'Time'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'المريضة' : 'Patient'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'التشخيص / السبب' : 'Procedure'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ded5] dark:divide-white/10">
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-[#ece7de]/40 dark:hover:bg-[#001c15]/40">
                      <td className="py-3 px-3 font-mono text-[#00473e] dark:text-[#00cb87] font-bold">{apt.start_time} - {apt.end_time}</td>
                      <td className="py-3 px-3 font-bold text-[#122620] dark:text-white">{apt.patient_name}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{apt.reason}</td>
                      <td className="py-3 px-3"><span className="px-2.5 py-1 rounded-full bg-[#00cb87]/15 text-[#00cb87] font-bold">{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* NEW APPOINTMENT MODAL (WITH QUICK NEW PATIENT CREATION TOGGLE) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-[#001c15]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/40 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e3ded5] dark:border-white/10 pb-3">
              <h3 className="text-base sm:text-lg font-black text-[#122620] dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#00cb87]" />
                {lang === 'ar' ? 'حجز موعد كشف جديد' : 'New Appointment Booking'}
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            {/* Toggle Patient Selection Mode */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsCreatingNewPatient(false)}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  !isCreatingNewPatient ? 'bg-[#00473e] text-white shadow' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>مريضة مسجلة بالسجل</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNewPatient(true)}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  isCreatingNewPatient ? 'bg-[#00cb87] text-slate-950 shadow' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ إضافة وحجز مريضة جديدة</span>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
              {!isCreatingNewPatient ? (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{lang === 'ar' ? 'اختر مريضة مسجلة *' : 'Select Registered Patient *'}</label>
                  <select
                    required
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold focus:ring-2 focus:ring-[#00cb87]"
                  >
                    <option value="">-- {lang === 'ar' ? 'اختر اسم المريضة من السجل الطبي' : 'Select Patient from Registry'} --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>
                    ))}
                  </select>
                </div>
              ) : (
                /* NEW PATIENT REGISTRATION FIELDS ON THE FLY */
                <div className="p-3.5 rounded-xl bg-[#00cb87]/10 border border-[#00cb87]/30 space-y-2.5">
                  <div className="text-[11px] font-black text-[#00cb87] uppercase tracking-wider flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>بيانات المريضة الجديدة (تُضاف آلياً للسجل الطبي)</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم المريضة بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={e => setNewFullName(e.target.value)}
                      placeholder="مثال: ياسمين علي الكردي"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رقم الهاتف *</label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="010xxxxxxxx"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الرقم القومي *</label>
                      <input
                        type="text"
                        required
                        value={newNationalId}
                        onChange={e => setNewNationalId(e.target.value)}
                        placeholder="295xxxxxxxxxxx"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">العمر</label>
                      <input
                        type="number"
                        value={newAge}
                        onChange={e => setNewAge(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">فصيلة الدم</label>
                      <select
                        value={newBloodType}
                        onChange={e => setNewBloodType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{lang === 'ar' ? 'تاريخ الكشف' : 'Date'}</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={e => setAptDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{lang === 'ar' ? 'الفرع' : 'Branch'}</label>
                  <select
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold"
                  >
                    {doctorInfo.branches.map(b => (
                      <option key={b.id} value={b.id}>{lang === 'ar' ? b.city_ar : b.city_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وقت البداية</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نوع الإجراء الطبي</label>
                  <select
                    value={visitType}
                    onChange={e => setVisitType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold"
                  >
                    <option value="ICSI Protocol">حقن مجهري (ICSI Protocol)</option>
                    <option value="IVF Cycle">أطفال أنابيب (IVF Cycle)</option>
                    <option value="Antenatal Care">متابعة حمل (Antenatal Care)</option>
                    <option value="Laparoscopy">مناظير نسائية (Laparoscopy)</option>
                    <option value="Initial Assessment">كشف واستشارة أولية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">سبب الزيارة / ملاحظات</label>
                <input
                  type="text"
                  value={visitReason}
                  onChange={e => setVisitReason(e.target.value)}
                  placeholder="مثال: استشارة بروتوكول الحقن المجهري ودراسة البطانة..."
                  className="w-full p-2.5 rounded-xl bg-[#ece7de] dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3ded5] dark:border-white/10">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-slate-400 font-bold">
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black shadow-lg">
                  {lang === 'ar' ? 'تأكيد الحجز وتسجيل الموعد' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
