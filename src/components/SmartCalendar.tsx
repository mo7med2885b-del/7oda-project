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
  DollarSign,
  Tag,
  Receipt,
  Check,
  AlertCircle,
  X
} from 'lucide-react';

interface SmartCalendarProps {
  onOpenNewAppointment?: () => void;
  onOpenTriageModal: (patientId: string) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({ onOpenTriageModal }) => {
  const { appointments, patients, addPatient, addAppointment, updateAppointment, updateAppointmentStatus, addInvoice, t, lang } = useClinic();

  const [currentDate, setCurrentDate] = useState<string>('2026-08-31');
  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'month' | 'list'>('week');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState<Appointment | null>(null);
  const [medPriceEditVal, setMedPriceEditVal] = useState('');

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
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [visitType, setVisitType] = useState('ICSI Protocol');
  const [visitReason, setVisitReason] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(doctorInfo.branches[0].id);

  // Financial & Discount Fields
  const [feeAmount, setFeeAmount] = useState<number>(500);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');

  // Dynamic 14-Day Selector Generation (Starts from Sunday of the current week)
  const [y, m, dayNum] = currentDate.split('-').map(Number);
  const currD = new Date(y, m - 1, dayNum); 
  
  const shiftDateByDays = (days: number) => {
    const d = new Date(y, m - 1, dayNum + days);
    setCurrentDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const currentMonthNameAr = currD.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  const currentMonthNameEn = currD.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const dayOfWeek = currD.getDay(); // 0 is Sunday
  const startD = new Date(y, m - 1, dayNum - dayOfWeek);

  const daysList = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + idx);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayNamesEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return {
      dateStr,
      dayNameAr: dayNamesAr[d.getDay()],
      dayNameEn: dayNamesEn[d.getDay()],
      num: d.getDate(),
      monthAr: d.toLocaleDateString('ar-EG', { month: 'short' }),
      isToday: dateStr === currentDate
    };
  });

  const weekDays = daysList.slice(0, 7);

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesBranch = selectedBranchFilter === 'all' || apt.reason.includes(selectedBranchFilter);
    return matchesBranch;
  });

  const netPayable = Math.max(0, feeAmount - discountAmount);

  // Check if a time slot on aptDate is already booked
  const getAppointmentForSlot = (dateStr: string, slotStr: string) => {
    const slotHour = slotStr.split(':')[0];
    return appointments.find(apt => apt.appointment_date === dateStr && apt.start_time.startsWith(slotHour));
  };
  const isTimeSlotBooked = (dateStr: string, slotStr: string) => !!getAppointmentForSlot(dateStr, slotStr);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let patientIdToBook = selectedPatientId;
    let patientNameToBook = '';

    if (isCreatingNewPatient) {
      if (!newFullName || !newPhone || !newNationalId) {
        alert(lang === 'ar' ? 'يرجى ملء كافة بيانات المريضة الجديدة (الاسم، الهاتف، الرقم القومي).' : 'Please fill full name, phone & national ID.');
        return;
      }

      const createdPat = await addPatient({
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

      if (!createdPat) {
        alert(lang === 'ar' ? 'حدث خطأ أثناء إضافة المريضة.' : 'Failed to register patient.');
        return;
      }

      patientIdToBook = createdPat.id;
      patientNameToBook = createdPat.full_name;
    } else {
      const pat = patients.find(p => p.id === selectedPatientId);
      if (!pat) return alert(lang === 'ar' ? 'يرجى اختيار مريضة مسجلة أو إضافة مريضة جديدة.' : 'Please select a patient or create a new one.');
      patientNameToBook = pat.full_name;
    }

    const branchObj = doctorInfo.branches.find(b => b.id === selectedBranch);
    const branchName = branchObj ? (lang === 'ar' ? branchObj.city_ar : branchObj.city_en) : '';

    if (discountAmount > 0 && !discountReason.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال سبب الخصم (سبب الخصم إجباري عند وجود قيمة خصم).' : 'Please enter the discount reason (mandatory when discount is specified).');
      return;
    }

    const discountInfoStr = discountAmount > 0 
      ? ` [خصم: ${discountAmount} ج.م - ${discountReason}]` 
      : '';

    const fullReasonStr = `${visitReason || (lang === 'ar' ? 'كشف عيادة' : 'Consultation')} [${visitType} - ${branchName}] - الرسوم: ${netPayable} ج.م${discountInfoStr}`;

    addAppointment({
      patient_id: patientIdToBook,
      patient_name: patientNameToBook,
      appointment_date: aptDate,
      start_time: startTime,
      end_time: endTime,
      status: 'Waiting',
      reason: fullReasonStr,
      type: visitType
    });

    // Create Invoice if net payable >= 0
    if (netPayable >= 0) {
      addInvoice({
        patient_id: patientIdToBook,
        patient_name: patientNameToBook,
        issue_date: aptDate,
        total_amount: feeAmount,
        discount_amount: discountAmount,
        discount_reason: discountReason || 'خصم كشف مباشر',
        net_amount: netPayable,
        paid_amount: netPayable,
        payment_status: 'Paid',
        items: [
          {
            description: `${visitType} (${branchName})`,
            quantity: 1,
            unit_price: feeAmount,
            total: feeAmount
          }
        ]
      });
    }

    alert(
      lang === 'ar'
        ? `تم تسجيل وحجز الموعد بنجاح للمريضة (${patientNameToBook})!\nالمبلغ المستحق بعد الخصم: ${netPayable} ج.م`
        : `Appointment booked successfully for ${patientNameToBook}!\nNet total: EGP ${netPayable}`
    );

    // Reset Form
    setIsCreatingNewPatient(false);
    setSelectedPatientId('');
    setNewFullName('');
    setNewPhone('');
    setNewNationalId('');
    setFeeAmount(500);
    setDiscountAmount(0);
    setDiscountReason('');
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-4">
      {/* ENTERPRISE CALENDAR BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00cb87] text-slate-950 flex items-center justify-center font-mono font-black text-lg shadow">
            {currD.getDate()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#122620] dark:text-white font-serif">
                {lang === 'ar' ? currentMonthNameAr : currentMonthNameEn}
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
              <span className="text-[#122620] dark:text-white font-mono">{lang === 'ar' ? currentMonthNameAr : currentMonthNameEn}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => shiftDateByDays(-7)} className="p-1 hover:bg-[#ece7de] dark:hover:bg-white/10 rounded transition">‹</button>
                <button type="button" onClick={() => shiftDateByDays(7)} className="p-1 hover:bg-[#ece7de] dark:hover:bg-white/10 rounded transition">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 gap-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-mono gap-1 text-slate-700 dark:text-slate-300">
              {daysList.map(d => (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => setCurrentDate(d.dateStr)}
                  className={`w-6 h-6 flex items-center justify-center rounded-full transition hover:bg-[#ece7de] dark:hover:bg-white/10 ${
                    d.isToday 
                      ? 'bg-[#00cb87] text-slate-950 font-bold shadow' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {d.num}
                </button>
              ))}
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
                  <button 
                    type="button"
                    onClick={() => setCurrentDate(d.dateStr)}
                    key={d.dateStr} 
                    className={`space-y-1 transition hover:opacity-70 ${d.isToday ? 'text-[#00473e] dark:text-[#00cb87]' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    <div className="uppercase font-mono text-[11px]">{lang === 'ar' ? d.dayNameAr : d.dayNameEn}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-mono font-black text-sm transition ${d.isToday ? 'bg-[#00cb87] text-slate-950 shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                      {d.num}
                    </div>
                  </button>
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
                              onClick={() => {
                                setSelectedAppointmentForDetails(apt);
                                setMedPriceEditVal(apt.medicine_price_details || '');
                              }}
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
                    <tr 
                      key={apt.id} 
                      onClick={() => {
                        setSelectedAppointmentForDetails(apt);
                        setMedPriceEditVal(apt.medicine_price_details || '');
                      }}
                      className="hover:bg-[#ece7de]/40 dark:hover:bg-[#001c15]/40 cursor-pointer"
                    >
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

      {/* NEW APPOINTMENT MODAL (HARMONIOUS MEDICAL EMERALD COLOR PALETTE & UNLIMITED DATE PICKER) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-[#001c15]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#00261c] border border-[#e3ded5] dark:border-[#00cb87]/40 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
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

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
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

              {/* HARMONIOUS EMERALD TIME SLOT PICKER WITH UNLIMITED DATE SELECTION */}
              <div className="p-4 rounded-2xl bg-[#00473e]/5 dark:bg-[#001c15] border border-[#00473e]/20 dark:border-[#00cb87]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#00473e]/10 dark:border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#00473e] dark:text-[#00cb87]">
                    <CalendarIcon className="w-4 h-4 text-[#00473e] dark:text-[#00cb87]" />
                    <span>خريطة وحالة المواعيد المتاحة (Slot Status)</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> متاح
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> حجز سابق
                    </span>
                  </div>
                </div>

                {/* Unlimited Custom Date Picker & Quick Days Scroll */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs text-[#122620] dark:text-white font-extrabold">
                      اختر تاريخ الكشف (أو اختر أي يوم في السنة):
                    </label>
                    <input
                      type="date"
                      required
                      value={aptDate}
                      onChange={e => setAptDate(e.target.value)}
                      className="p-1.5 rounded-xl bg-white dark:bg-[#00261c] border border-[#00473e]/30 dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono font-bold text-xs shadow-sm"
                    />
                  </div>

                  {/* Horizontal Scrollable Days Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                    {daysList.map(d => (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => setAptDate(d.dateStr)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition shrink-0 flex items-center gap-1.5 ${
                          aptDate === d.dateStr
                            ? 'bg-[#00473e] text-white border-[#00473e] shadow-md dark:bg-[#00cb87] dark:text-slate-950'
                            : 'bg-white dark:bg-[#00261c] text-slate-700 dark:text-slate-200 border-[#e3ded5] dark:border-white/10 hover:border-[#00cb87]'
                        }`}
                      >
                        <span>{d.dayNameAr}</span>
                        <span className="font-mono text-xs">{d.num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Time Slot Grid */}
                <div className="space-y-1.5 pt-2 border-t border-[#00473e]/10 dark:border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-[#122620] dark:text-white font-bold">
                    <span>التوقيتات المتاحة ليوم (<span className="font-mono text-[#00473e] dark:text-[#00cb87]">{aptDate}</span>):</span>
                    <span className="text-[#00473e] dark:text-[#00cb87] font-mono">المحدد: {startTime}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {timeSlots.map(slot => {
                      const booked = isTimeSlotBooked(aptDate, slot);
                      const isSelected = startTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            if (booked) {
                              const apt = getAppointmentForSlot(aptDate, slot);
                              if (apt) {
                                setSelectedAppointmentForDetails(apt);
                                setMedPriceEditVal(apt.medicine_price_details || '');
                              }
                            } else {
                              setStartTime(slot);
                              // Auto estimate end time 30 mins later
                              const hourNum = parseInt(slot.split(':')[0], 10);
                              const nextHour = hourNum === 12 ? 1 : hourNum + 1;
                              setEndTime(`${nextHour < 10 ? '0' + nextHour : nextHour}:30 ${slot.split(' ')[1]}`);
                            }
                          }}
                          className={`p-2 rounded-xl border text-[11px] font-mono font-bold transition flex items-center justify-between ${
                            booked
                              ? 'bg-rose-500/10 border-rose-400/30 text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-500/20'
                              : isSelected
                              ? 'bg-[#00473e] text-white border-[#00473e] shadow-lg dark:bg-[#00cb87] dark:text-slate-950 scale-105'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-[#00473e] hover:text-white'
                          }`}
                        >
                          <span>{slot}</span>
                          {booked ? (
                            <span className="text-[9px] font-black bg-rose-500 text-white px-1 rounded">مشغول</span>
                          ) : (
                            <span className="text-[9px] font-black bg-emerald-600 text-white px-1 rounded">متاح</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-2">
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

              {/* DEDICATED FINANCIAL & DISCOUNT SECTION */}
              <div className="p-3.5 rounded-xl bg-[#00473e]/15 border border-[#00cb87]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#00cb87]">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#00cb87]" />
                    <span>رسوم الكشف والخصم المالي (Pricing & Discounts)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-mono text-[10px]">
                    الصافي: {netPayable} ج.م
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">قيمة الكشف / الإجراء (ج.م) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={feeAmount}
                      onChange={e => setFeeAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">قيمة الخصم (ج.م)</label>
                    <input
                      type="number"
                      min={0}
                      max={feeAmount}
                      value={discountAmount}
                      onChange={e => setDiscountAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-rose-500 dark:text-rose-400 font-mono font-bold"
                    />
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center justify-between">
                      <span>سبب الخصم (Discount Reason) *</span>
                      <span className="text-rose-500 text-[10px] font-black animate-pulse">مطلوب إجبارياً *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={discountReason}
                      onChange={e => setDiscountReason(e.target.value)}
                      placeholder="مثال: خصم نقابة الأطباء، حالة إنسانية، متابعة مجانية..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border-2 border-rose-500/50 text-[#122620] dark:text-white font-bold focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}
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

      {selectedAppointmentForDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#f5f2eb] dark:bg-[#00261c] border-2 border-[#00473e]/20 dark:border-[#00cb87]/30 rounded-3xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppointmentForDetails(null)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-[#001c15] rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-[#122620] dark:text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-[#00cb87]" />
              <span>تفاصيل الحجز والأدوية</span>
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#001c15] shadow-sm space-y-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-slate-500">المريض:</span>
                  <span className="text-[#00cb87]">{selectedAppointmentForDetails.patient_name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-slate-500">التاريخ والوقت:</span>
                  <span className="font-mono">{selectedAppointmentForDetails.appointment_date} | {selectedAppointmentForDetails.start_time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-slate-500">نوع الكشف:</span>
                  <span>{selectedAppointmentForDetails.type}</span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-500">سبب الزيارة (الرسوم):</span>
                  <span className="text-xs leading-relaxed">{selectedAppointmentForDetails.reason}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-extrabold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#00cb87]" />
                  <span>تفاصيل الأدوية وأسعارها (Medicine & Price)</span>
                </label>
                <textarea
                  value={medPriceEditVal}
                  onChange={e => setMedPriceEditVal(e.target.value)}
                  placeholder="مثال: Gonal-F 300 IU (1500 ج.م), Ovitrelle 250 mcg (800 ج.م)..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold placeholder-slate-400 focus:ring-2 focus:ring-[#00cb87] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e3ded5] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedAppointmentForDetails(null)}
                  className="px-4 py-2 text-slate-400 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateAppointment(selectedAppointmentForDetails.id, {
                      medicine_price_details: medPriceEditVal
                    });
                    setSelectedAppointmentForDetails(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-white font-black shadow-lg flex items-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
