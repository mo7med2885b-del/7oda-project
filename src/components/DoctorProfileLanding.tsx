import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { doctorInfo } from '../utils/i18n';
import {
  Award,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Sparkles,
  Send,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Heart,
  Activity,
  Star,
  Users,
  ChevronLeft
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
    <div className="space-y-16 -mt-6 -mx-6 text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. MAVEN-STYLE HERO SECTION WITH DOCTOR PHOTO BACKGROUND */}
      <section className="relative min-h-[600px] md:min-h-[680px] rounded-b-3xl overflow-hidden flex flex-col justify-between p-6 md:p-12 text-white shadow-2xl">
        {/* Background Image: Doctor Portrait with Dark Emerald/Teal Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Frame-76-1.png.webp"
            alt="Dr. Mohamed Hosny Ali"
            className="w-full h-full object-cover object-top filter brightness-[0.42] scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './Frame-76-1.png.webp';
            }}
          />
          {/* Subtle Maven Dark Emerald & Ocean Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031d22]/95 via-[#082930]/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051c22] via-transparent to-[#031d22]/60"></div>
        </div>

        {/* Floating Top Banner (Maven Announcement Bar) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#00e599] font-bold">
            <span className="px-2 py-0.5 rounded bg-[#00e599]/20 text-[#00e599] font-mono text-[10px]">مباشر</span>
            <span>حجز المواعيد والاستشارات الطبية لمراكز الحقن المجهري مفتوح الآن</span>
          </div>
          <a
            href={`https://wa.me/${doctorInfo.whatsapp_phone}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 text-white hover:text-[#00e599] font-bold underline"
          >
            <span>تواصل مباشرة عبر واتساب</span>
            {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </a>
        </div>

        {/* Main Hero Copy & Typography (Maven Style) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto py-12 md:py-20 space-y-6 text-center rtl:text-right ltr:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00e599] font-extrabold text-xs uppercase tracking-wider shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>عيادات أطفال الأنابيب والحقن المجهري المعتمدة بمصر</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight font-serif">
            {lang === 'ar' ? (
              <>
                رعاية صحية <span className="italic text-[#00e599] font-normal">موثقة وشاملة</span> للنساء وعلاج العقم
              </>
            ) : (
              <>
                Evidence-based <span className="italic text-[#00e599] font-normal">women's & fertility</span> healthcare
              </>
            )}
          </h1>

          <p className="text-base md:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? 'تحت إشراف د. محمد حسني علي - استشاري الحقن المجهري وجراحة المناظير وعضو الجمعية الأوروبية والأمريكية للخصوبة.'
              : 'Expert clinical care across every fertility stage under Dr. Mohamed Hosny Ali in Cairo, Mansoura, Damietta & Port Said.'}
          </p>

          <div className="flex flex-wrap items-center justify-center rtl:justify-start gap-4 pt-4">
            <a
              href="#booking-section"
              className="px-8 py-4 rounded-2xl bg-[#00e599] hover:bg-[#00c985] text-slate-950 font-black text-sm shadow-[0_10px_30px_rgba(0,229,153,0.35)] transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>احجزي موعدكِ الآن</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>

            <a
              href={`tel:${doctorInfo.contact_phone}`}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold text-sm backdrop-blur-md transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#00e599]" />
              <span>{doctorInfo.contact_phone}</span>
            </a>
          </div>
        </div>

        {/* Doctor Badges Footer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>عضو الجامعة المصرية والأوروبية والأمريكية للخصوبة والعقم (ESHRE & ASRM)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>استشاري الجودة من الجامعة الأمريكية وعضو جمعية التدخل الجراحي الدقيق</span>
          </div>
        </div>
      </section>

      {/* 2. MAVEN-STYLE BIG SCALING NUMBER CIRCLE METRICS SECTION ("Lowering costs by improving care") */}
      <section className="bg-[#edeade] dark:bg-[#061e23] py-20 px-6 md:px-12 rounded-3xl mx-4 md:mx-6 shadow-xl space-y-12 text-center border border-slate-300 dark:border-[#15606e]/40">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-serif text-slate-900 dark:text-white">
            تحقيق أعلى نسب نجاح الخصوبة <span className="italic text-[#15606e] dark:text-[#00e599]">بأعلى دقة كلينيكية</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
            من خلال توجيه الزوجين لأدق البرامج العلاجية المخصصة، نضمن أفضل النتائج ورفع نسب النجاح للحمل.
          </p>
        </div>

        {/* 4 BIG CIRCULAR SCALING NUMBER STATS (Maven Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Circle 1: 3000+ Patients */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#082930] shadow-xl border border-slate-200 dark:border-[#15606e]/30">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-[#00e599]" fill="transparent" strokeDasharray="264" strokeDashoffset="30" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">+3,000</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">مريضة موثوقة</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">أكثر من 3000 مريضة تثق في خدمات العيادة بمصر</p>
          </div>

          {/* Circle 2: 78% ICSI Success */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#082930] shadow-xl border border-slate-200 dark:border-[#15606e]/30">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-cyan-400" fill="transparent" strokeDasharray="264" strokeDashoffset="58" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">78%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">نجاح من أول مرة</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">نسبة نجاح الحقن المجهري الموثقة من أول محاولة</p>
          </div>

          {/* Circle 3: 94% Uterine Recovery */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#082930] shadow-xl border border-slate-200 dark:border-[#15606e]/30">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-emerald-500" fill="transparent" strokeDasharray="264" strokeDashoffset="20" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">94%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">تعافي الأرحام</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">شفاء تام من أمراض الرحم وتكيس المبيضين بالمنظار</p>
          </div>

          {/* Circle 4: +600 Deliveries */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white dark:bg-[#082930] shadow-xl border border-slate-200 dark:border-[#15606e]/30">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-purple-400" fill="transparent" strokeDasharray="264" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">+600</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ولادة أطفال</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">ولادة ناجحة لأطفال وحالات توائم بدون مضاعفات</p>
          </div>
        </div>
      </section>

      {/* 3. MAVEN-STYLE DEEP TEAL SECTION (Healthcare designed for women & families) */}
      <section className="bg-[#052e26] text-white py-16 px-6 md:px-12 rounded-3xl mx-4 md:mx-6 shadow-2xl space-y-12 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-serif">
            {lang === 'ar' ? (
              <>
                رعاية صحية مصممة <span className="italic text-[#00e599] font-normal">خصيصاً للنساء</span> بإثباتات ونتائج موثقة
              </>
            ) : (
              <>
                Healthcare designed for <span className="italic text-[#00e599] font-normal">women and families</span> that's personal and proven
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-medium">
            أكثر من 60+ حالة أطفال أنابيب ناجحة و 60+ حالة حقن مجهري من أول مرة و 100+ حالة شفيت تماماً من أمراض الرحم.
          </p>
        </div>

        {/* 4 TALL LIFE STAGES CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left rtl:text-right relative z-10">
          {/* Card 1 */}
          <div className="group cursor-pointer rounded-3xl bg-[#083b31] border border-emerald-500/30 hover:border-[#00e599] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00e599] transition">
                الحقن المجهري وأطفال الأنابيب
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                بروتوكولات تنشيط المبيض الفائقة المخصصة، سحب البويضات بدون ألم، وفحص الجودة الوراثية للأجنة.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00e599] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>استكشاف البروتوكول</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          {/* Card 2 */}
          <div className="group cursor-pointer rounded-3xl bg-[#083b31] border border-emerald-500/30 hover:border-[#00e599] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00e599] transition">
                رعاية الحمل والأجنة الخرجة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                متابعة دقيقة للحمل عالي الخطورة والحمل التوأمي بالسونار رباعي الأبعاد والتشخيص المبكر.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00e599] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>متابعة الحمل</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          {/* Card 3 */}
          <div className="group cursor-pointer rounded-3xl bg-[#083b31] border border-emerald-500/30 hover:border-[#00e599] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-purple-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00e599] transition">
                جراحة المناظير وتكيس المبيض
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مناظير الرحم والبطن التشخيصية والعلاجية، إزالة ألياف الرحم وعلاج بطانة الرحم المهاجرة.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00e599] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>جراحة المناظير</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          {/* Card 4 */}
          <div className="group cursor-pointer rounded-3xl bg-[#083b31] border border-emerald-500/30 hover:border-[#00e599] p-6 space-y-6 flex flex-col justify-between shadow-xl transition transform hover:-translate-y-1">
            <div className="space-y-3">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow"></span>
              <h3 className="text-xl font-black text-white group-hover:text-[#00e599] transition">
                توازن الهرمونات ومناعة الخصوبة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                علاج خمول الغدة الدرقية، اضطرابات هرمون الحليب (Prolactin)، وتحفيز توازن التبويض.
              </p>
            </div>
            <a href="#booking-section" className="px-4 py-2.5 rounded-xl bg-white/10 group-hover:bg-[#00e599] group-hover:text-slate-950 text-white font-extrabold text-xs transition flex items-center justify-between">
              <span>تحليل الهرمونات</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      </section>

      {/* 4. MAVEN-STYLE MEDICAL CENTERS & ACCREDITATION LOGO BAR (Image 3) */}
      <section className="bg-[#031d22] py-10 px-6 border-y border-emerald-500/20 text-white space-y-6">
        <div className="text-center text-xs font-mono font-bold uppercase tracking-widest text-[#00e599]">
          • المراكز الطبية والجمعيات المعتمدة (TRUSTED MEDICAL PARTNERS) •
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-85 text-xs font-extrabold tracking-wider">
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-amber-400 font-serif font-black text-sm">ASRM</span>
            <span>الجامعة الأمريكية للخصوبة</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-cyan-400 font-serif font-black text-sm">ESHRE</span>
            <span>الجامعة الأوروبية لعقم النساء</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-[#00e599] font-serif font-black text-sm">ROYAL</span>
            <span>مركز رويال للخصوبة (بورسعيد)</span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-emerald-300 font-serif font-black text-sm">WELL CARE</span>
            <span>مول ويل كير (التجمع الخامس)</span>
          </div>
        </div>
      </section>

      {/* 5. MAVEN-STYLE BOOKING FORM CARD */}
      <section id="booking-section" className="px-6 md:px-12 pb-12">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#031d22] via-[#082930] to-[#0e4a55] text-white shadow-2xl space-y-8 border border-cyan-500/40">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-4xl font-black font-serif">احجزي موعدكِ الآن مع أفضل دكتور أمراض نساء وحقن مجهري</h2>
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
                  className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00e599]"
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
                  className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00e599] font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{t('branch_select')} *</label>
                <select
                  value={bookingBranch}
                  onChange={e => setBookingBranch(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00e599] font-bold"
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
                  className="w-full py-4 rounded-2xl bg-[#00e599] hover:bg-[#00c985] text-slate-950 font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد طلب الحجز الآن</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 6. MAVEN-STYLE ENTERPRISE FOOTER WITH 5-STAR REVIEWS (Image 4) */}
      <footer className="bg-[#031d22] text-white p-10 md:p-16 rounded-3xl mx-4 md:mx-6 border border-emerald-500/30 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/LOGO 7oda.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40" />
              <span className="font-serif font-black text-xl text-white">د. محمد حسني علي</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              عيادات استشارية متخصصة في الحقن المجهري وأطفال الأنابيب وجراحة المناظير بمحافظات القاهرة، المنصورة، دمياط، وبورسعيد.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#00e599] uppercase tracking-wider">الخدمات والبروتوكولات</h4>
            <ul className="space-y-1 text-slate-300">
              <li>حقن مجهري (ICSI Protocol)</li>
              <li>أطفال أنابيب (IVF Cycle)</li>
              <li>جراحة مناظير الرحم والبطن</li>
              <li>متابعة الحمل عالي الخطورة</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-[#00e599] uppercase tracking-wider">فروع العيادة</h4>
            <ul className="space-y-1 text-slate-300">
              <li>القاهرة: مول well care التجمع الخامس</li>
              <li>المنصورة: برج اللؤلؤة ميدان المحطة</li>
              <li>دمياط: كفر سعد أعلي سيراميك عوف</li>
              <li>بورسعيد: مركز رويال للخصوبة</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
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
