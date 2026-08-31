import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { doctorInfo } from '../utils/i18n';
import {
  Award,
  Phone,
  CheckCircle,
  Sparkles,
  Send,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Star
} from 'lucide-react';

export const DoctorProfileLanding: React.FC = () => {
  const { lang, t, addAppointment, addPatient } = useClinic();

  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingBranch, setBookingBranch] = useState(doctorInfo.branches[0].id);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      alert(lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف.' : 'Please enter your name and phone number.');
      return;
    }

    const newPat = addPatient({
      full_name: bookingName,
      phone: bookingPhone,
      national_id: `29${Math.floor(Math.random() * 100000000000)}`,
      age: 28,
      gender: 'Female',
      blood_type: 'O+',
      medical_alerts: 'Online Booking Request',
      allergies: 'None',
      emergency_contact: bookingPhone
    });

    const todayStr = new Date().toISOString().split('T')[0];
    addAppointment({
      patient_id: newPat.id,
      patient_name: newPat.full_name,
      appointment_date: todayStr,
      start_time: '12:00',
      end_time: '12:30',
      status: 'Waiting',
      reason: `Online Reservation (${bookingBranch})`,
      type: 'Initial Assessment'
    });

    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingName('');
      setBookingPhone('');
      setBookingSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-16 -mt-6 -mx-6 text-[#122620] dark:text-[#f5f2eb] font-sans">
      {/* 1. LUXURIOUS DEEP FOREST EMERALD HERO SECTION WITH PROMINENT DOCTOR PHOTO */}
      <section className="relative min-h-[580px] md:min-h-[640px] rounded-b-3xl overflow-hidden bg-gradient-to-r from-[#001c15] via-[#00261c] to-[#00473e] text-white shadow-2xl p-6 md:p-12 flex flex-col justify-between border-b border-[#00cb87]/30">
        
        {/* Announcement Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#00cb87] font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00cb87]/20 text-[#00cb87] font-mono text-[10px]">مباشر</span>
            <span>حجز المواعيد والاستشارات الطبية للحقن المجهري مفتوح الآن</span>
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
        <div className="relative z-10 w-full max-w-7xl mx-auto py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="md:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00cb87]/15 border border-[#00cb87]/40 text-[#00cb87] font-extrabold text-xs uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>العيادة الاستشارية المعتمدة للحقن المجهري بمصر</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-serif">
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

            <p className="text-sm md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'تحت إشراف الدكتور محمد حسني علي - استشاري الحقن المجهري وجراحة المناظير وعضو الجمعية الأوروبية والأمريكية للخصوبة (ESHRE & ASRM).'
                : 'Expert fertility and laparoscopic care under Dr. Mohamed Hosny Ali in Cairo, Mansoura, Damietta & Port Said.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#booking-section"
                className="px-8 py-4 rounded-2xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-sm shadow-[0_10px_30px_rgba(0,203,135,0.4)] transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>احجزي موعدكِ الآن</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <a
                href={`tel:${doctorInfo.contact_phone}`}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm backdrop-blur-md transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#00cb87]" />
                <span className="font-mono">{doctorInfo.contact_phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: CRISP DOCTOR PHOTO DISPLAY */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative w-full max-w-sm md:max-w-md h-[380px] md:h-[450px] rounded-3xl overflow-hidden border-2 border-[#00cb87]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <img
                src="/Frame-76-1.png.webp"
                alt="الدكتور محمد حسني علي"
                className="w-full h-full object-cover object-top filter brightness-105 contrast-105 transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = './Frame-76-1.png.webp';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c15]/90 via-transparent to-transparent"></div>

              {/* Photo Bottom Tag */}
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-[#00261c]/90 backdrop-blur-md border border-[#00cb87]/40 text-center space-y-1">
                <div className="text-sm font-black text-white font-serif">{doctorInfo.name_ar}</div>
                <div className="text-[10px] text-[#00cb87] font-bold">استشاري النساء والتوليد وعلاج العقم والحقن المجهري</div>
              </div>
            </div>
          </div>

        </div>

        {/* Doctor Credentials Footer Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>عضو الجامعة المصرية والأوروبية والأمريكية للخصوبة والعقم (ESHRE & ASRM)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00cb87]" />
            <span>استشاري الجودة من الجامعة الأمريكية وعضو الجمعية المصرية للتدخل الجراحي الدقيق</span>
          </div>
        </div>
      </section>

      {/* 2. ELEGANT WARM CREAM SCALING STATS SECTION */}
      <section className="bg-[#f5f2eb] dark:bg-[#00261c] py-16 px-6 md:px-12 rounded-3xl mx-4 md:mx-6 shadow-xl space-y-12 text-center border border-[#e3ded5] dark:border-[#00cb87]/30">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-serif text-[#122620] dark:text-white">
            تحقيق أعلى نسب نجاح الخصوبة <span className="italic text-[#00473e] dark:text-[#00cb87]">بأعلى دقة كلينيكية</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
            نقدم بروتوكولات علاجية مخصصة لكل زوجين لضمان أعلى نسب نجاح للحمل بأمان تترسخ فيه الخبرات الكلينيكية.
          </p>
        </div>

        {/* 4 STATS CIRCLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#023326] shadow-lg border border-[#e3ded5] dark:border-[#00cb87]/30">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-[#00cb87]" fill="transparent" strokeDasharray="264" strokeDashoffset="30" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-[#00473e] dark:text-white">+3,000</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">مريضة موثوقة</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">أكثر من 3000 مريضة تثق في خدمات العيادة بمصر</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#023326] shadow-lg border border-[#e3ded5] dark:border-[#00cb87]/30">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-[#00473e]" fill="transparent" strokeDasharray="264" strokeDashoffset="58" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-[#00473e] dark:text-white">78%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">نجاح من أول مرة</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">نسبة نجاح الحقن المجهري الموثقة من أول محاولة</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#023326] shadow-lg border border-[#e3ded5] dark:border-[#00cb87]/30">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-emerald-500" fill="transparent" strokeDasharray="264" strokeDashoffset="20" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-[#00473e] dark:text-white">94%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">تعافي الأرحام</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">شفاء تام من أمراض الرحم وتكيس المبيضين بالمنظار</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#023326] shadow-lg border border-[#e3ded5] dark:border-[#00cb87]/30">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-purple-500" fill="transparent" strokeDasharray="264" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-[#00473e] dark:text-white">+600</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ولادة أطفال</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">ولادة ناجحة لأطفال وحالات توائم بدون مضاعفات</p>
          </div>
        </div>
      </section>

      {/* 3. DEEP FOREST EMERALD CLINICAL SPECIALTIES CARDS GRID */}
      <section className="bg-[#00261c] text-white py-16 px-6 md:px-12 rounded-3xl mx-4 md:mx-6 shadow-2xl space-y-12 text-center relative overflow-hidden border border-[#00cb87]/20">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-serif">
            {lang === 'ar' ? (
              <>
                رعاية صحية مصممة <span className="italic text-[#00cb87] font-normal">خصيصاً للنساء</span> بإثباتات ونتائج موثقة
              </>
            ) : (
              <>
                Healthcare designed for <span className="italic text-[#00cb87] font-normal">women and families</span> that's personal and proven
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-medium">
            أكثر من 60+ حالة أطفال أنابيب ناجحة و 60+ حالة حقن مجهري من أول مرة و 100+ حالة شفيت تماماً من أمراض الرحم.
          </p>
        </div>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left rtl:text-right relative z-10">
          <div className="group cursor-pointer rounded-3xl bg-[#023326] border border-[#00cb87]/30 hover:border-[#00cb87] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-[#00cb87] inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00cb87] transition">
                الحقن المجهري وأطفال الأنابيب
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                بروتوكولات تنشيط المبيض الفائقة المخصصة، سحب البويضات بدون ألم، وفحص الجودة الوراثية للأجنة.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00cb87] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>استكشاف البروتوكول</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          <div className="group cursor-pointer rounded-3xl bg-[#023326] border border-[#00cb87]/30 hover:border-[#00cb87] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00cb87] transition">
                رعاية الحمل والأجنة الخرجة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                متابعة دقيقة للحمل عالي الخطورة والحمل التوأمي بالسونار رباعي الأبعاد والتشخيص المبكر.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00cb87] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>متابعة الحمل</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          <div className="group cursor-pointer rounded-3xl bg-[#023326] border border-[#00cb87]/30 hover:border-[#00cb87] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-purple-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00cb87] transition">
                جراحة المناظير وتكيس المبيض
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مناظير الرحم والبطن التشخيصية والعلاجية، إزالة ألياف الرحم وعلاج بطانة الرحم المهاجرة.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00cb87] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>جراحة المناظير</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          <div className="group cursor-pointer rounded-3xl bg-[#023326] border border-[#00cb87]/30 hover:border-[#00cb87] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00cb87] transition">
                توازن الهرمونات ومناعة الخصوبة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                علاج خمول الغدة الدرقية، اضطرابات هرمون الحليب (Prolactin)، وتحفيز توازن التبويض.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00cb87] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>تحليل الهرمونات</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      </section>

      {/* 4. ACCREDITATION PARTNERS BAR */}
      <section className="bg-[#001c15] py-10 px-6 border-y border-[#00cb87]/20 text-white space-y-6">
        <div className="text-center text-xs font-mono font-bold uppercase tracking-widest text-[#00cb87]">
          • المراكز الطبية والجمعيات المعتمدة (TRUSTED MEDICAL PARTNERS) •
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-85 text-xs font-extrabold tracking-wider">
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-amber-300 font-serif font-black text-sm">ASRM</span>
            <span>الجامعة الأمريكية للخصوبة</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-[#00cb87] font-serif font-black text-sm">ESHRE</span>
            <span>الجامعة الأوروبية لعقم النساء</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-emerald-300 font-serif font-black text-sm">ROYAL</span>
            <span>مركز رويال للخصوبة (بورسعيد)</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-cyan-300 font-serif font-black text-sm">WELL CARE</span>
            <span>مول ويل كير (التجمع الخامس)</span>
          </div>
        </div>
      </section>

      {/* 5. BOOKING FORM CARD */}
      <section id="booking-section" className="px-6 md:px-12 pb-12">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#001c15] via-[#00261c] to-[#00473e] text-white shadow-2xl space-y-8 border border-[#00cb87]/40">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-4xl font-black font-serif">احجزي موعدكِ الآن مع الدكتور محمد حسني علي</h2>
            <p className="text-xs md:text-sm text-slate-300">سجلي بياناتك وسيقوم فريق تنسيق العيادة بالتواصل معكِ فوراً لتأكيد الحجز وتحديد الموعد المناسب.</p>
          </div>

          {bookingSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'تم تسجيل طلب الحجز بنجاح! ستقوم سكرتارية عيادة د. محمد حسني بالتواصل معكِ فوراً.'
                  : 'Booking request registered successfully! Our team will contact you shortly.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{t('name_field')} *</label>
                <input
                  type="text"
                  required
                  value={bookingName}
                  onChange={e => setBookingName(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخلي اسمك بالكامل' : 'Full Name'}
                  className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00cb87]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{t('phone_field')} *</label>
                <input
                  type="text"
                  required
                  value={bookingPhone}
                  onChange={e => setBookingPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00cb87] font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{t('branch_select')} *</label>
                <select
                  value={bookingBranch}
                  onChange={e => setBookingBranch(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#001c15] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00cb87] font-bold"
                >
                  {doctorInfo.branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {lang === 'ar' ? b.city_ar : b.city_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد طلب الحجز الآن</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 6. ENTERPRISE FOOTER */}
      <footer className="bg-[#001c15] text-white p-10 md:p-16 rounded-3xl mx-4 md:mx-6 border border-[#00cb87]/30 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/LOGO 7oda.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-[#00cb87]/40" />
              <span className="font-serif font-black text-xl text-white">د. محمد حسني علي</span>
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

          <div className="space-y-3">
            <div className="flex items-center gap-1 text-amber-300">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs text-slate-300 font-bold ml-1">4.9 / 5.0</span>
            </div>
            <p className="text-xs text-slate-300 font-bold">بناءً على تقييم أكثر من +3,000 مريضة موثقة بمصر ⭐⭐⭐⭐⭐</p>
            <div className="text-[11px] text-slate-400 pt-2 font-mono">
              © 2026 Dr. Mohamed Hosny Ali Clinics. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
