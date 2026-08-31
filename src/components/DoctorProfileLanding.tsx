import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { doctorInfo } from '../utils/i18n';
import { doctorPhoto, clinicLogo } from '../assets/images';
import {
  Sparkles,
  Award,
  MapPin,
  Calendar,
  Phone,
  Clock,
  HeartHandshake,
  CheckCircle,
  MessageCircle,
  Star,
  ShieldCheck,
  Building2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  User,
  Activity,
  FileText,
  Tag,
  Receipt,
  Check,
  Send,
  Ticket
} from 'lucide-react';

export const DoctorProfileLanding: React.FC = () => {
  const { lang, addAppointment, appointments } = useClinic();

  // Booking Form & Checkout State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingBranch, setBookingBranch] = useState(doctorInfo.branches[0].id);
  const [selectedService, setSelectedService] = useState({
    id: 'icsi',
    name_ar: 'بروتوكول الحقن المجهري (ICSI Protocol)',
    name_en: 'ICSI Protocol Consultation',
    price: 1200
  });
  const [selectedDate, setSelectedDate] = useState('2026-08-31');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const servicesList = [
    {
      id: 'consultation',
      name_ar: 'كشف استشاري وتقييم أولي',
      name_en: 'Initial Consultant Assessment',
      price: 500
    },
    {
      id: 'icsi',
      name_ar: 'بروتوكول الحقن المجهري (ICSI Protocol)',
      name_en: 'ICSI Protocol Consultation',
      price: 1200
    },
    {
      id: 'follicle',
      name_ar: 'متابعة تبويض وسونار مهبلي',
      name_en: 'Folliculometry & Ultrasound',
      price: 350
    },
    {
      id: 'hysteroscopy',
      name_ar: 'منظار رحمي وسحب بويضات',
      name_en: 'Diagnostic Hysteroscopy',
      price: 2000
    }
  ];

  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'];

  const discountPercent = discountApplied ? 10 : 0;
  const discountValue = (selectedService.price * discountPercent) / 100;
  const netTotalPrice = Math.max(0, selectedService.price - discountValue);

  // Convert 12-hour AM/PM string to 24-hour time to match backend/seed data format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const isTimeSlotBooked = (dateStr: string, slotStr: string) => {
    const slot24 = convertTo24Hour(slotStr);
    const slotHour = slot24.split(':')[0];
    return appointments.some(apt => apt.appointment_date === dateStr && apt.start_time.startsWith(slotHour));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HOSNY10' || promoCode.trim() === 'خصم10') {
      setDiscountApplied(true);
      alert(lang === 'ar' ? 'تم تطبيق كود الخصم بنجاح (خصم 10%)!' : 'Promo code applied! (10% OFF)');
    } else {
      alert(lang === 'ar' ? 'كود الخصم غير صحيح. جرب كود: HOSNY10' : 'Invalid code. Try: HOSNY10');
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;

    const branchObj = doctorInfo.branches.find(b => b.id === bookingBranch);
    const branchName = branchObj ? (lang === 'ar' ? branchObj.city_ar : branchObj.city_en) : '';

    addAppointment({
      patient_id: `p-online-${Date.now()}`,
      patient_name: bookingName,
      appointment_date: selectedDate,
      start_time: selectedTimeSlot,
      end_time: '11:00 AM',
      status: 'Waiting',
      reason: `${selectedService.name_ar} [أونلاين - ${branchName}] - السعر: ${netTotalPrice} ج.م`,
      type: selectedService.name_en
    });

    setBookingSubmitted(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 -mt-3 sm:-mt-6 -mx-3 sm:-mx-6 text-[#122620] dark:text-[#f5f2eb] font-sans overflow-x-hidden">
      {/* 1. LUXURIOUS DEEP FOREST EMERALD HERO SECTION WITH PROMINENT DOCTOR PHOTO */}
      <section className="relative min-h-[540px] md:min-h-[640px] rounded-b-3xl overflow-hidden bg-gradient-to-r from-[#001c15] via-[#00261c] to-[#00473e] text-white shadow-2xl p-4 sm:p-8 md:p-12 flex flex-col justify-between border-b border-[#00cb87]/30">
        
        {/* Announcement Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#00cb87] font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-mono text-[10px]">مباشر</span>
            <span className="text-[11px] sm:text-xs">حجز المواعيد والاستشارات الطبية للحقن المجهري مفتوح الآن</span>
          </div>
          <a
            href={`https://wa.me/${doctorInfo.whatsapp_phone}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#00cb87] font-bold underline transition"
          >
            <span>تواصل مباشرة عبر واتساب</span>
            {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </a>
        </div>

        {/* Split Grid: Left Copy & Right Crisp Doctor Portrait */}
        <div className="relative z-10 w-full max-w-7xl mx-auto py-6 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="md:col-span-7 space-y-5 sm:space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00cb87]/15 border border-[#00cb87]/40 text-[#00cb87] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>العيادة الاستشارية المعتمدة للحقن المجهري بمصر</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-serif">
              {lang === 'ar' ? (
                <>
                  رعاية صحية <span className="italic text-[#00cb87] font-normal">موثقة وشاملة</span> للنساء وعلاج العقم
                </>
              ) : (
                <>
                  Evidence-based <span className="italic text-[#00cb87] font-normal">women's & fertility</span> care
                </>
              )}
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'تحت إشراف الدكتور محمد حسني علي - استشاري الحقن المجهري وجراحة المناظير وعضو الجمعية الأوروبية والأمريكية للخصوبة (ESHRE & ASRM).'
                : 'Expert fertility and laparoscopic care under Dr. Mohamed Hosny Ali in Cairo, Mansoura, Damietta & Port Said.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <a
                href="#booking-checkout-section"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(0,203,135,0.4)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>احجزي موعدكِ الآن</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <a
                href={`tel:${doctorInfo.contact_phone}`}
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm backdrop-blur-md transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#00cb87]" />
                <span className="font-mono">{doctorInfo.contact_phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: CRISP DOCTOR PHOTO DISPLAY */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-[340px] sm:h-[380px] md:h-[450px] rounded-3xl overflow-hidden border-2 border-[#00cb87]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <img
                src={doctorPhoto}
                alt="الدكتور محمد حسني علي"
                className="w-full h-full object-cover object-top filter brightness-105 contrast-105 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c15]/90 via-transparent to-transparent"></div>

              {/* Photo Bottom Tag */}
              <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 p-3 rounded-2xl bg-[#00261c]/90 backdrop-blur-md border border-[#00cb87]/40 text-center space-y-1">
                <div className="text-xs sm:text-sm font-black text-white font-serif">{doctorInfo.name_ar}</div>
                <div className="text-[10px] sm:text-xs text-[#00cb87] font-bold">استشاري النساء والتوليد وعلاج العقم والحقن المجهري</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS OVERVIEW CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {doctorInfo.stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-[#001c15] border border-[#00cb87]/30 shadow-xl space-y-2 text-center transform hover:-translate-y-1 transition"
          >
            <div className="text-2xl sm:text-4xl font-black text-[#00cb87] font-mono tracking-tight">{stat.metric}</div>
            <div className="text-xs sm:text-sm font-extrabold text-white">{stat.label_ar}</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium">{stat.sub_ar}</div>
          </div>
        ))}
      </section>

      {/* 3. FOUR CLINIC BRANCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] text-xs font-bold uppercase tracking-wider">
            فروع عيادات د. محمد حسني
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight dark:text-white text-[#122620]">
            أربعة فروع مجهزة بأحدث تقنيات أطفال الأنابيب
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
            احجزي في الفرع الأقرب إليكِ بالقاهرة، المنصورة، دمياط، أو بورسعيد.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctorInfo.branches.map(branch => (
            <div
              key={branch.id}
              className="p-6 rounded-3xl bg-[#001c15] border border-[#00cb87]/30 shadow-xl space-y-4 flex flex-col justify-between hover:border-[#00cb87] transition"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00473e] text-[#00cb87] flex items-center justify-center font-bold shadow">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">{branch.city_ar}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{branch.address_ar}</p>
                <div className="text-xs text-[#00cb87] font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{branch.days_ar} ({branch.hours})</span>
                </div>
              </div>

              <a
                href="#booking-checkout-section"
                onClick={() => setBookingBranch(branch.id)}
                className="w-full py-2.5 rounded-xl bg-[#00473e] hover:bg-[#00cb87] hover:text-slate-950 text-white font-bold text-xs transition text-center shadow"
              >
                احجزي فرع {branch.city_ar}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE APPOINTMENT CHECKOUT SECTION */}
      <section id="booking-checkout-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#001c15] border-2 border-[#00cb87]/40 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] text-xs font-bold mb-2">
                <Ticket className="w-4 h-4 text-[#00cb87]" />
                <span>حجز الكشف وتأكيد التذكرة الرقمية</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">حجز موعد جديد واختيار الخدمات والتسعير</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">اختر الإجراء الطبي والفرع والتوقيت واطلع على إجمالي الرسوم والخصومات مباشرة.</p>
            </div>
          </div>

          {bookingSubmitted ? (
            <div className="p-8 rounded-3xl bg-[#00261c] border-2 border-[#00cb87] text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#00cb87] text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-white">تم تأكيد طلب الحجز وإصدار التذكرة بنجاح!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                شكراً لكِ د./أ.{' '}
                <span className="text-[#00cb87] font-bold">{bookingName}</span>. تم حجز موعدك لـ{' '}
                <span className="text-white font-bold">{selectedService.name_ar}</span> بتاريخ{' '}
                <span className="font-mono text-[#00cb87]">{selectedDate} ({selectedTimeSlot})</span>.
              </p>
              <div className="p-4 rounded-2xl bg-[#001c15] border border-[#00cb87]/40 max-w-md mx-auto text-xs space-y-1.5 text-right font-mono">
                <div className="flex justify-between text-slate-300"><span>الإجمالي:</span><span>{selectedService.price} ج.م</span></div>
                {discountApplied && <div className="flex justify-between text-rose-400"><span>الخصم المطبق (10%):</span><span>-{discountValue} ج.م</span></div>}
                <div className="flex justify-between text-white font-bold text-sm border-t border-white/10 pt-1.5"><span>الصافي المطلوب بالعيادة:</span><span className="text-[#00cb87]">{netTotalPrice} ج.م</span></div>
              </div>
              <button
                onClick={() => setBookingSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#00cb87] text-slate-950 font-black text-xs shadow-lg hover:bg-[#00b074] transition"
              >
                حجز موعد آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Interactive Form Controls */}
              <div className="lg:col-span-7 space-y-6 text-xs">
                
                {/* 1. Select Branch */}
                <div className="space-y-2">
                  <label className="block text-white font-extrabold text-sm">1. اختر فرع العيادة *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {doctorInfo.branches.map(b => (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => setBookingBranch(b.id)}
                        className={`p-3 rounded-2xl font-bold border transition text-center ${
                          bookingBranch === b.id
                            ? 'bg-[#00cb87] text-slate-950 border-[#00cb87] shadow-lg'
                            : 'bg-[#00261c] text-slate-200 border-white/10 hover:border-[#00cb87]/50'
                        }`}
                      >
                        {b.city_ar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select Medical Service */}
                <div className="space-y-2">
                  <label className="block text-white font-extrabold text-sm">2. اختر نوع الكشف / الإجراء الطبي *</label>
                  <div className="space-y-2">
                    {servicesList.map(srv => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                          selectedService.id === srv.id
                            ? 'bg-[#00473e] border-[#00cb87] text-white shadow-md'
                            : 'bg-[#00261c] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-xs text-white">{srv.name_ar}</div>
                          <div className="text-[10px] text-slate-400">{srv.name_en}</div>
                        </div>
                        <div className="font-mono font-black text-sm text-[#00cb87]">{srv.price} ج.م</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-white font-extrabold">3. تاريخ الحجز *</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#00261c] border border-white/20 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-white font-extrabold">4. توقيت الحجز المناسب *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(ts => {
                        const booked = isTimeSlotBooked(selectedDate, ts);
                        const isSelected = selectedTimeSlot === ts;
                        return (
                          <button
                            key={ts}
                            type="button"
                            disabled={booked}
                            onClick={() => setSelectedTimeSlot(ts)}
                            className={`p-2 rounded-xl border text-[11px] font-mono font-bold transition flex flex-col items-center justify-center gap-1 ${
                              booked
                                ? 'bg-rose-500/10 border-rose-400/30 text-rose-600/70 cursor-not-allowed opacity-75'
                                : isSelected
                                ? 'bg-[#00cb87] text-slate-950 border-[#00cb87] shadow-lg scale-105'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-[#00cb87] hover:text-slate-950'
                            }`}
                          >
                            <span>{ts}</span>
                            {booked ? (
                              <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded">مشغول</span>
                            ) : (
                              <span className="text-[8px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded">متاح</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Patient Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-white font-extrabold">اسم المريضة بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      placeholder="أدخلي اسمكِ الثلاثي"
                      className="w-full p-3 rounded-xl bg-[#00261c] border border-white/20 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-white font-extrabold">رقم الهاتف (الواتساب) *</label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={e => setBookingPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full p-3 rounded-xl bg-[#00261c] border border-white/20 text-white placeholder-slate-400 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Live Interactive Checkout Summary Card */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-[#00261c] border border-[#00cb87]/40 shadow-2xl space-y-6 sticky top-24">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#00cb87]" />
                      <span>ملخص التذكرة والحجز المالي</span>
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-mono text-[10px] font-bold">
                      Checkout
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>الخدمة المختارة:</span>
                      <span className="font-bold text-white max-w-[170px] text-left truncate">{selectedService.name_ar}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>الفرع:</span>
                      <span className="font-bold text-[#00cb87]">
                        {doctorInfo.branches.find(b => b.id === bookingBranch)?.city_ar}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>الموعد والتاريخ:</span>
                      <span className="font-mono text-white">{selectedDate} | {selectedTimeSlot}</span>
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-2 font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>السعر الأساسي:</span>
                        <span>{selectedService.price} ج.م</span>
                      </div>

                      {discountApplied && (
                        <div className="flex justify-between text-rose-400 font-bold">
                          <span>الخصم المطبق (10%):</span>
                          <span>-{discountValue} ج.م</span>
                        </div>
                      )}

                      <div className="flex justify-between text-white font-extrabold text-base border-t border-white/10 pt-2">
                        <span>إجمالي الرسوم:</span>
                        <span className="text-[#00cb87]">{netTotalPrice} ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <label className="block text-xs text-slate-300 font-bold">هل لديكِ كود خصم؟ (أدخلي: HOSNY10)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        placeholder="HOSNY10"
                        className="flex-1 p-2.5 rounded-xl bg-[#001c15] border border-white/20 text-white font-mono uppercase text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 rounded-xl bg-[#00473e] hover:bg-[#00cb87] hover:text-slate-950 text-white font-bold text-xs transition"
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>تأكيد الحجز والدفع بالعيادة ({netTotalPrice} ج.م)</span>
                  </button>

                  <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                    * الدفع يتم بالكامل في مقر العيادة عند الحضور.
                  </div>

                </div>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* 5. ENTERPRISE FOOTER */}
      <footer className="bg-[#001c15] text-white p-6 sm:p-10 md:p-16 rounded-3xl mx-2 sm:mx-6 border border-[#00cb87]/30 space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={clinicLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-[#00cb87]/40" />
              <span className="font-serif font-black text-lg sm:text-xl text-white">د. محمد حسني علي</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              عيادات استشارية متخصصة في الحقن المجهري وأطفال الأنابيب وجراحة المناظير بمحافظات القاهرة، المنصورة، دمياط، وبورسعيد.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#00cb87] uppercase tracking-wider">الخدمات والبروتوكولات</h4>
            <ul className="space-y-1 text-slate-300">
              <li>حقن مجهري (ICSI Protocol)</li>
              <li>أطفال أنابيب (IVF Cycle)</li>
              <li>جراحة مناظير الرحم والبطن</li>
              <li>متابعة الحمل عالي الخطورة</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#00cb87] uppercase tracking-wider">فروع العيادة</h4>
            <ul className="space-y-1 text-slate-300">
              <li>القاهرة: مول well care التجمع الخامس</li>
              <li>المنصورة: برج اللؤلؤة ميدان المحطة</li>
              <li>دمياط: كفر سعد أعلي سيراميك عوف</li>
              <li>بورسعيد: مركز رويال للخصوبة</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#00cb87] uppercase tracking-wider">للتواصل المباشر</h4>
            <div className="text-slate-300 font-mono space-y-1">
              <div>الهاتف: {doctorInfo.contact_phone}</div>
              <div>واتساب: {doctorInfo.whatsapp_phone}</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-xs text-slate-400">
          جميع الحقوق محفوظة © 2026 عيادات الدكتور محمد حسني علي.
        </div>
      </footer>
    </div>
  );
};
