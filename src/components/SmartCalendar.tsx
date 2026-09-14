import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { AppointmentStatus, Appointment } from '../types';
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

  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState<string>(todayStr);
  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'month'>('day');
  const [calendarSearch, setCalendarSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
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
    const matchesBranch = selectedBranchFilter === 'all' || (apt.reason || '').includes(selectedBranchFilter);
    const matchesService = serviceFilter === 'all' || apt.type === serviceFilter;
    const q = calendarSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (apt.patient_name || '').toLowerCase().includes(q) ||
      (apt.reason || '').toLowerCase().includes(q) ||
      (apt.type || '').toLowerCase().includes(q);
    return matchesBranch && matchesService && matchesSearch;
  });

  // ---- Calendar view helpers ----
  const dayNamesShortAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const dayNamesShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesFullAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesFullEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const serviceTypes = Array.from(new Set(appointments.map(a => a.type).filter(Boolean))) as string[];

  // Parse "HH:MM" or "H:MM AM/PM" into minutes since midnight
  const toMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const s = timeStr.trim().toUpperCase();
    const isPm = s.includes('PM');
    const isAm = s.includes('AM');
    const [hRaw, mRaw] = s.replace(/\s*(AM|PM)\s*/, '').split(':');
    let h = parseInt(hRaw, 10) || 0;
    const min = parseInt(mRaw, 10) || 0;
    if (isPm && h !== 12) h += 12;
    if (isAm && h === 12) h = 0;
    return h * 60 + min;
  };

  const durationLabel = (start: string, end: string) => {
    const mins = Math.max(0, toMinutes(end) - toMinutes(start));
    if (mins === 0) return '';
    if (mins < 60) return lang === 'ar' ? `${mins} دقيقة` : `${mins} min session`;
    const h = Math.floor(mins / 60);
    const rem = mins % 60;
    const hLabel = lang === 'ar' ? `${h} ساعة` : `${h}h`;
    return rem ? `${hLabel} ${rem}${lang === 'ar' ? ' د' : 'm'}` : `${hLabel}${lang === 'ar' ? '' : ' session'}`;
  };

  const statusTone = (status: AppointmentStatus) => {
    switch (status) {
      case 'Waiting':
        return { bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-400', text: 'text-amber-900 dark:text-amber-200' };
      case 'In Consultation':
        return { bg: 'bg-[#6AB8FF]/10', border: 'border-[#6AB8FF]', text: 'text-[#2C3137] dark:text-[#6AB8FF]' };
      case 'Completed':
        return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-600', text: 'text-emerald-900 dark:text-emerald-200' };
      case 'Cancelled':
      case 'No-Show':
        return { bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-400', text: 'text-rose-900 dark:text-rose-200' };
      default:
        return { bg: 'bg-slate-100 dark:bg-white/5', border: 'border-slate-300 dark:border-slate-600', text: 'text-[#2C3137] dark:text-white' };
    }
  };

  const dayAppointments = filteredAppointments
    .filter(a => a.appointment_date === currentDate)
    .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time));

  // Hour range: cover 8am-8pm, widened to fit any appointment outside it
  const apptHours = dayAppointments.map(a => Math.floor(toMinutes(a.start_time) / 60));
  const minHour = Math.min(8, ...(apptHours.length ? apptHours : [8]));
  const maxHour = Math.max(20, ...(apptHours.length ? apptHours.map(h => h + 1) : [20]));
  const hourSlots = Array.from({ length: maxHour - minHour }, (_, i) => minHour + i);

  // Current-time indicator (day view only, ~76px per hour row)
  const HOUR_ROW_PX = 76;
  const isViewingToday = currentDate === todayStr;
  const nowDate = new Date();
  const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  const nowOffsetPx =
    nowMinutes >= minHour * 60 && nowMinutes <= maxHour * 60
      ? ((nowMinutes - minHour * 60) / 60) * HOUR_ROW_PX
      : null;
  const nowLabel = `${nowDate.getHours()}:${String(nowDate.getMinutes()).padStart(2, '0')}`;

  // Month grid cells (leading blanks + days of month)
  const monthFirst = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const leadingBlanks = monthFirst.getDay();
  const monthCells: { day: number | null; dateStr: string | null }[] = [
    ...Array.from({ length: leadingBlanks }, () => ({ day: null, dateStr: null })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      dateStr: `${y}-${String(m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    }))
  ];

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
      {/* HEADER BAR: title, search, filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-black text-[#2C3137] dark:text-white">
          {lang === 'ar' ? 'الحجوزات' : 'Reservations'}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              value={calendarSearch}
              onChange={e => setCalendarSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن مريضة أو خدمة...' : 'Search for patient or service...'}
              className="bg-transparent text-[11px] text-[#2C3137] dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
            />
          </div>

          <select
            value={selectedBranchFilter}
            onChange={e => setSelectedBranchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm text-[11px] font-bold text-[#2C3137] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="all">{lang === 'ar' ? 'كل الفروع' : 'All branches'}</option>
            {doctorInfo.branches.map(b => (
              <option key={b.id} value={lang === 'ar' ? b.city_ar : b.city_en}>
                {lang === 'ar' ? b.city_ar : b.city_en}
              </option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm text-[11px] font-bold text-[#2C3137] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="all">{lang === 'ar' ? 'كل الخدمات' : 'All services'}</option>
            {serviceTypes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black text-[11px] shadow-sm transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'حجز جديد' : 'New Booking'}</span>
          </button>
        </div>
      </div>

      {/* MAIN CALENDAR CARD */}
      <div className="rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 shadow-sm overflow-hidden">
        {/* Date bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#C6D2E2] dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-[#C6D2E2] dark:border-[#6AB8FF]/25 flex flex-col items-center justify-center shrink-0 bg-[#DAE3EE] dark:bg-[#22262B]">
              <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-none">
                {lang === 'ar' ? dayNamesShortAr[currD.getDay()] : dayNamesShortEn[currD.getDay()]}
              </span>
              <span className="text-lg font-black text-[#2C3137] dark:text-white leading-none mt-0.5">{currD.getDate()}</span>
            </div>
            <div>
              <div className="text-base font-black text-[#2C3137] dark:text-white">
                {lang === 'ar' ? currentMonthNameAr : currentMonthNameEn}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? dayNamesFullAr[currD.getDay()] : dayNamesFullEn[currD.getDay()]}
              </div>
            </div>
            <div className="flex items-center gap-1 ms-2">
              <button
                onClick={() => shiftDateByDays(calendarView === 'month' ? -30 : calendarView === 'week' ? -7 : -1)}
                className="p-1.5 rounded-lg border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-slate-500 dark:text-slate-300 hover:text-[#6AB8FF] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => shiftDateByDays(calendarView === 'month' ? 30 : calendarView === 'week' ? 7 : 1)}
                className="p-1.5 rounded-lg border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-slate-500 dark:text-slate-300 hover:text-[#6AB8FF] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(todayStr)}
              className="px-3 py-1.5 rounded-lg border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[11px] font-bold text-[#2C3137] dark:text-white hover:text-[#6AB8FF] transition"
            >
              {lang === 'ar' ? 'اليوم' : 'Today'}
            </button>
            <div className="flex items-center rounded-lg border border-[#C6D2E2] dark:border-[#6AB8FF]/25 overflow-hidden">
              {(['day', 'week', 'month'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setCalendarView(v)}
                  className={`px-3.5 py-1.5 text-[11px] font-bold transition ${
                    calendarView === v
                      ? 'bg-[#2C3137] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#6AB8FF]'
                  }`}
                >
                  {v === 'day' ? (lang === 'ar' ? 'يوم' : 'Day') : v === 'week' ? (lang === 'ar' ? 'أسبوع' : 'Week') : (lang === 'ar' ? 'شهر' : 'Month')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DAY VIEW - single doctor time grid */}
        {calendarView === 'day' && (
          <div>
            {/* Doctor header */}
            <div className="flex border-b border-[#C6D2E2] dark:border-white/10">
              <div className="w-20 shrink-0 border-e border-[#C6D2E2] dark:border-white/10 flex flex-col items-center justify-center py-3">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">GMT</span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">+3:00</span>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#2C3137] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {lang === 'ar' ? 'م.ح' : 'MH'}
                </div>
                <div>
                  <div className="text-sm font-black text-[#2C3137] dark:text-white">
                    {lang === 'ar' ? 'د. محمد حسني علي' : 'Dr. Mohamed Hosny Ali'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'استشاري النساء والتوليد والحقن المجهري' : 'Consultant OB/GYN & IVF'}
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment count row */}
            <div className="flex border-b border-[#C6D2E2] dark:border-white/10 bg-[#DAE3EE] dark:bg-[#22262B]">
              <div className="w-20 shrink-0 border-e border-[#C6D2E2] dark:border-white/10 py-2 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </div>
              <div className="flex-1 py-2 text-center text-[11px] font-bold text-[#2C3137] dark:text-white">
                {lang === 'ar' ? `المواعيد: ${dayAppointments.length}` : `Appointments: ${dayAppointments.length}`}
              </div>
            </div>

            {/* Time grid */}
            <div className="relative">
              {hourSlots.map(hour => {
                const slotAppointments = dayAppointments.filter(a => {
                  const startMin = toMinutes(a.start_time);
                  return startMin >= hour * 60 && startMin < (hour + 1) * 60;
                });

                return (
                  <div key={hour} className="flex border-b border-[#C6D2E2] dark:border-white/10 min-h-[76px]">
                    <div className="w-20 shrink-0 border-e border-[#C6D2E2] dark:border-white/10 pt-2 text-center">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {String(hour).padStart(2, '0')}:00
                      </span>
                    </div>
                    <div className="flex-1 p-1.5 space-y-1.5">
                      {slotAppointments.map(apt => {
                        const tone = statusTone(apt.status);
                        return (
                          <button
                            key={apt.id}
                            onClick={() => {
                              setSelectedAppointmentForDetails(apt);
                              setMedPriceEditVal(apt.medicine_price_details || '');
                            }}
                            className={`w-full text-start rounded-lg border-s-[3px] px-3 py-2 transition hover:shadow-sm ${tone.bg} ${tone.border}`}
                          >
                            <div className={`text-[12px] font-bold ${tone.text}`}>{apt.patient_name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                              {apt.start_time} → {apt.end_time} ({durationLabel(apt.start_time, apt.end_time)})
                            </div>
                            {apt.type && (
                              <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-1.5">
                                <Tag className="w-3 h-3 shrink-0 opacity-60" />
                                <span className="truncate">{apt.type}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Current time indicator */}
              {isViewingToday && nowOffsetPx !== null && (
                <div className="absolute left-0 right-0 pointer-events-none z-10" style={{ top: `${nowOffsetPx}px` }}>
                  <div className="flex items-center">
                    <div className="w-20 shrink-0 flex justify-end pe-1">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold font-mono">
                        {nowLabel}
                      </span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-rose-500 relative">
                      <div className="absolute -top-1 -start-1 w-2 h-2 rounded-full bg-rose-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {calendarView === 'week' && (
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Day headers */}
              <div className="flex border-b border-[#C6D2E2] dark:border-white/10">
                <div className="w-20 shrink-0 border-e border-[#C6D2E2] dark:border-white/10 flex flex-col items-center justify-center py-3">
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">GMT</span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">+3:00</span>
                </div>
                {weekDays.map(d => {
                  const count = filteredAppointments.filter(a => a.appointment_date === d.dateStr).length;
                  const isSelected = d.dateStr === currentDate;
                  return (
                    <button
                      key={d.dateStr}
                      onClick={() => {
                        setCurrentDate(d.dateStr);
                        setCalendarView('day');
                      }}
                      className={`flex-1 py-3 border-e border-[#C6D2E2] dark:border-white/10 last:border-e-0 transition ${
                        isSelected ? 'bg-[#6AB8FF]/10' : 'hover:bg-[#DAE3EE] dark:hover:bg-[#22262B]'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {lang === 'ar' ? d.dayNameAr : d.dayNameEn}
                      </div>
                      <div className={`text-lg font-black ${d.dateStr === todayStr ? 'text-[#6AB8FF]' : 'text-[#2C3137] dark:text-white'}`}>
                        {d.num}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        {lang === 'ar' ? `${count} موعد` : `${count} appt`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hour rows */}
              {hourSlots.map(hour => (
                <div key={hour} className="flex border-b border-[#C6D2E2] dark:border-white/10 min-h-[64px]">
                  <div className="w-20 shrink-0 border-e border-[#C6D2E2] dark:border-white/10 pt-2 text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  </div>
                  {weekDays.map(d => {
                    const cellAppointments = filteredAppointments.filter(a => {
                      if (a.appointment_date !== d.dateStr) return false;
                      const startMin = toMinutes(a.start_time);
                      return startMin >= hour * 60 && startMin < (hour + 1) * 60;
                    });
                    return (
                      <div
                        key={d.dateStr}
                        className="flex-1 border-e border-[#C6D2E2] dark:border-white/10 last:border-e-0 p-1 space-y-1"
                      >
                        {cellAppointments.map(apt => {
                          const tone = statusTone(apt.status);
                          return (
                            <button
                              key={apt.id}
                              onClick={() => {
                                setSelectedAppointmentForDetails(apt);
                                setMedPriceEditVal(apt.medicine_price_details || '');
                              }}
                              className={`w-full text-start rounded-md border-s-[3px] px-2 py-1.5 transition hover:shadow-sm ${tone.bg} ${tone.border}`}
                            >
                              <div className={`text-[10px] font-bold truncate ${tone.text}`}>{apt.patient_name}</div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                                {apt.start_time}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONTH VIEW */}
        {calendarView === 'month' && (
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
            <div className="grid grid-cols-7 border-b border-[#C6D2E2] dark:border-white/10">
              {(lang === 'ar' ? dayNamesShortAr : dayNamesShortEn).map(dn => (
                <div key={dn} className="py-2.5 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {dn}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthCells.map((cell, idx) => {
                const count = cell.dateStr
                  ? filteredAppointments.filter(a => a.appointment_date === cell.dateStr).length
                  : 0;
                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === currentDate;
                return (
                  <button
                    key={idx}
                    disabled={!cell.dateStr}
                    onClick={() => {
                      if (cell.dateStr) {
                        setCurrentDate(cell.dateStr);
                        setCalendarView('day');
                      }
                    }}
                    className={`min-h-[92px] p-2 border-e border-b border-[#C6D2E2] dark:border-white/10 text-start align-top transition ${
                      !cell.dateStr
                        ? 'bg-[#DAE3EE]/50 dark:bg-[#22262B]/50 cursor-default'
                        : isSelected
                        ? 'bg-[#6AB8FF]/10'
                        : 'hover:bg-[#DAE3EE] dark:hover:bg-[#22262B]'
                    }`}
                  >
                    {cell.dateStr && (
                      <>
                        <div
                          className={`text-xs font-black mb-1 ${
                            isToday
                              ? 'w-6 h-6 rounded-full bg-[#6AB8FF] text-slate-950 flex items-center justify-center'
                              : 'text-[#2C3137] dark:text-white'
                          }`}
                        >
                          {cell.day}
                        </div>
                        {count > 0 && (
                          <div className="space-y-0.5">
                            {filteredAppointments
                              .filter(a => a.appointment_date === cell.dateStr)
                              .slice(0, 2)
                              .map(apt => {
                                const tone = statusTone(apt.status);
                                return (
                                  <div
                                    key={apt.id}
                                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold truncate border-s-2 ${tone.bg} ${tone.border} ${tone.text}`}
                                  >
                                    {apt.start_time} {apt.patient_name}
                                  </div>
                                );
                              })}
                            {count > 2 && (
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold ps-1">
                                +{count - 2} {lang === 'ar' ? 'أخرى' : 'more'}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            </div>
          </div>
        )}

        {/* Empty state for day view */}
        {calendarView === 'day' && dayAppointments.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            {lang === 'ar' ? 'لا توجد مواعيد في هذا اليوم.' : 'No appointments scheduled for this day.'}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-1 text-[10px] font-bold">
        {[
          { label: lang === 'ar' ? 'مجدول' : 'Scheduled', cls: 'bg-slate-300 dark:bg-slate-600' },
          { label: lang === 'ar' ? 'في الانتظار' : 'Waiting', cls: 'bg-amber-400' },
          { label: lang === 'ar' ? 'قيد الكشف' : 'In Consultation', cls: 'bg-[#6AB8FF]' },
          { label: lang === 'ar' ? 'مكتمل' : 'Completed', cls: 'bg-emerald-600' },
          { label: lang === 'ar' ? 'ملغي' : 'Cancelled', cls: 'bg-rose-400' }
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${l.cls}`} />
            <span className="text-slate-600 dark:text-slate-300">{l.label}</span>
          </div>
        ))}
      </div>

      {/* NEW APPOINTMENT MODAL (HARMONIOUS MEDICAL EMERALD COLOR PALETTE & UNLIMITED DATE PICKER) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-[#22262B]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/40 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#C6D2E2] dark:border-white/10 pb-3">
              <h3 className="text-base sm:text-lg font-black text-[#2C3137] dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#6AB8FF]" />
                {lang === 'ar' ? 'حجز موعد كشف جديد' : 'New Appointment Booking'}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="min-w-[44px] min-h-[44px] rounded-lg text-[#7C7C7C] hover:text-rose-500 hover:bg-rose-500/10 transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Toggle Patient Selection Mode */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsCreatingNewPatient(false)}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  !isCreatingNewPatient ? 'bg-[#2C3137] text-white shadow' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>مريضة مسجلة بالسجل</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNewPatient(true)}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  isCreatingNewPatient ? 'bg-[#6AB8FF] text-slate-950 shadow' : 'text-slate-600 dark:text-slate-300'
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
                    className="w-full p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold focus:ring-2 focus:ring-[#6AB8FF]"
                  >
                    <option value="">-- {lang === 'ar' ? 'اختر اسم المريضة من السجل الطبي' : 'Select Patient from Registry'} --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>
                    ))}
                  </select>
                </div>
              ) : (
                /* NEW PATIENT REGISTRATION FIELDS ON THE FLY */
                <div className="p-3.5 rounded-xl bg-[#6AB8FF]/10 border border-[#6AB8FF]/30 space-y-2.5">
                  <div className="text-[11px] font-black text-[#6AB8FF] uppercase tracking-wider flex items-center gap-1">
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
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white"
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
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-mono"
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
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-mono"
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
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">فصيلة الدم</label>
                      <select
                        value={newBloodType}
                        onChange={e => setNewBloodType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold"
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
              <div className="p-4 rounded-2xl bg-[#2C3137]/5 dark:bg-[#22262B] border border-[#2C3137]/20 dark:border-[#6AB8FF]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2C3137]/10 dark:border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#2C3137] dark:text-[#6AB8FF]">
                    <CalendarIcon className="w-4 h-4 text-[#2C3137] dark:text-[#6AB8FF]" />
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
                    <label className="block text-xs text-[#2C3137] dark:text-white font-extrabold">
                      اختر تاريخ الكشف (أو اختر أي يوم في السنة):
                    </label>
                    <input
                      type="date"
                      required
                      value={aptDate}
                      onChange={e => setAptDate(e.target.value)}
                      className="p-1.5 rounded-xl bg-white dark:bg-[#2C3137] border border-[#2C3137]/30 dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-mono font-bold text-xs shadow-sm"
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
                            ? 'bg-[#2C3137] text-white border-[#2C3137] shadow-md dark:bg-[#6AB8FF] dark:text-slate-950'
                            : 'bg-white dark:bg-[#2C3137] text-slate-700 dark:text-slate-200 border-[#C6D2E2] dark:border-white/10 hover:border-[#6AB8FF]'
                        }`}
                      >
                        <span>{d.dayNameAr}</span>
                        <span className="font-mono text-xs">{d.num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Time Slot Grid */}
                <div className="space-y-1.5 pt-2 border-t border-[#2C3137]/10 dark:border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-[#2C3137] dark:text-white font-bold">
                    <span>التوقيتات المتاحة ليوم (<span className="font-mono text-[#2C3137] dark:text-[#6AB8FF]">{aptDate}</span>):</span>
                    <span className="text-[#2C3137] dark:text-[#6AB8FF] font-mono">المحدد: {startTime}</span>
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
                              ? 'bg-[#2C3137] text-white border-[#2C3137] shadow-lg dark:bg-[#6AB8FF] dark:text-slate-950 scale-105'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-[#2C3137] hover:text-white'
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
                    className="w-full p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold"
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
                    className="w-full p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold"
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
                  className="w-full p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white"
                />
              </div>

              {/* DEDICATED FINANCIAL & DISCOUNT SECTION */}
              <div className="p-3.5 rounded-xl bg-[#2C3137]/15 border border-[#6AB8FF]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#6AB8FF]">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#6AB8FF]" />
                    <span>رسوم الكشف والخصم المالي (Pricing & Discounts)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#6AB8FF]/20 text-[#6AB8FF] font-mono text-[10px]">
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
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-mono font-bold"
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
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-rose-500 dark:text-rose-400 font-mono font-bold"
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
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#22262B] border-2 border-rose-500/50 text-[#2C3137] dark:text-white font-bold focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#C6D2E2] dark:border-white/10">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-slate-400 font-bold">
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black shadow-lg">
                  {lang === 'ar' ? 'تأكيد الحجز وتسجيل الموعد' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAppointmentForDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#DAE3EE] dark:bg-[#2C3137] border-2 border-[#2C3137]/20 dark:border-[#6AB8FF]/30 rounded-3xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppointmentForDetails(null)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-[#22262B] rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-[#2C3137] dark:text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-[#6AB8FF]" />
              <span>تفاصيل الحجز والأدوية</span>
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#22262B] shadow-sm space-y-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-slate-500">المريض:</span>
                  <span className="text-[#6AB8FF]">{selectedAppointmentForDetails.patient_name}</span>
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
                  <Tag className="w-4 h-4 text-[#6AB8FF]" />
                  <span>تفاصيل الأدوية وأسعارها (Medicine & Price)</span>
                </label>
                <textarea
                  value={medPriceEditVal}
                  onChange={e => setMedPriceEditVal(e.target.value)}
                  placeholder="مثال: Gonal-F 300 IU (1500 ج.م), Ovitrelle 250 mcg (800 ج.م)..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 text-[#2C3137] dark:text-white font-bold placeholder-slate-400 focus:ring-2 focus:ring-[#6AB8FF] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C6D2E2] dark:border-white/10">
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
                  className="px-6 py-2.5 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black shadow-lg flex items-center gap-2 transition"
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
