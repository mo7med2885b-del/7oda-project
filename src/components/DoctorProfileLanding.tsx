import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { doctorInfo } from '../utils/i18n';
import { doctorPhoto } from '../assets/images';
import { useReveal } from '../hooks/useReveal';
import { ServiceShowcase } from './ServiceShowcase';
import { TestimonialDrift } from './TestimonialDrift';
import { VideoShowcase } from './VideoShowcase';
import { PortalNav } from './PortalNav';
import { WhatsAppFab } from './WhatsAppFab';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { bannerFamily, aboutFamily } from '../assets/services';
import {
  SERVICES,
  MARQUEE_TERMS,
  PROCESS_STEPS,
  FAQS,
  MORE_FAQS,
  TESTIMONIALS,
  COMPARISON
} from './clinicalContent';
import {
  MapPin,
  Calendar,
  Phone,
  Clock,
  CheckCircle,
  MessageCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Ticket,
  X,
  Plus,
  Minus,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

/* ------------------------------------------------------------------
   Shared primitives — the visual grammar taken from the reference:
   bracketed mono eyebrows, oversized display headings, soft glass.
------------------------------------------------------------------ */

const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'light' | 'dark' }> = ({
  children,
  tone = 'dark'
}) => (
  <span
    className={`clinical-eyebrow inline-block ${
      tone === 'light' ? 'text-clinical-lime' : 'text-clinical-mid'
    }`}
  >
    [ {children} ]
  </span>
);

const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  body?: string;
  tone?: 'light' | 'dark';
  align?: 'start' | 'center';
}> = ({ eyebrow, title, body, tone = 'dark', align = 'start' }) => (
  <div className={`clinical-reveal max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
    <h2
      className={`clinical-display mt-4 text-[34px] sm:text-[48px] lg:text-[56px] font-medium ${
        tone === 'light' ? 'text-white' : 'text-clinical-deep dark:text-white'
      }`}
    >
      {title}
    </h2>
    {body && (
      <p
        className={`mt-5 text-[15px] sm:text-base leading-relaxed ${
          tone === 'light' ? 'text-white/70' : 'text-clinical-mid dark:text-white/60'
        }`}
      >
        {body}
      </p>
    )}
  </div>
);

/* ------------------------------------------------------------------ */

export const DoctorProfileLanding: React.FC = () => {
  const { lang, addAppointment, appointments } = useClinic();
  const isAr = lang === 'ar';
  const rootRef = useReveal<HTMLDivElement>();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openMoreFaq, setOpenMoreFaq] = useState<number | null>(null);

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

  /** Add minutes to a "HH:MM" string, for deriving the appointment end time. */
  const addMinutes = (time24: string, minutes: number) => {
    const [h, m] = time24.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  /**
   * A slot is unavailable when a live appointment already starts at exactly
   * that time on that date. Appointments come from Supabase via context, so
   * this reflects bookings made anywhere in the system — including the admin
   * calendar — and re-evaluates whenever that data changes.
   *
   * Cancelled appointments free their slot again.
   */
  const isTimeSlotBooked = (dateStr: string, slotStr: string) => {
    const slot24 = convertTo24Hour(slotStr);
    return appointments.some(apt => {
      if (apt.appointment_date !== dateStr) return false;
      if (apt.status === 'Cancelled') return false;
      // Stored times may carry seconds ("09:00:00"); compare HH:MM only.
      return apt.start_time.slice(0, 5) === slot24;
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HOSNY10' || promoCode.trim() === 'خصم10') {
      setDiscountApplied(true);
      alert(isAr ? 'تم تطبيق كود الخصم بنجاح (خصم 10%)!' : 'Promo code applied! (10% OFF)');
    } else {
      alert(isAr ? 'كود الخصم غير صحيح. جرب كود: HOSNY10' : 'Invalid code. Try: HOSNY10');
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;

    const branchObj = doctorInfo.branches.find(b => b.id === bookingBranch);
    const branchName = branchObj ? (isAr ? branchObj.city_ar : branchObj.city_en) : '';

    addAppointment({
      patient_id: `p-online-${Date.now()}`,
      patient_name: bookingName,
      appointment_date: selectedDate,
      start_time: convertTo24Hour(selectedTimeSlot),
      end_time: addMinutes(convertTo24Hour(selectedTimeSlot), 30),
      status: 'Waiting',
      reason: `${selectedService.name_ar} [أونلاين - ${branchName}] - السعر: ${netTotalPrice} ج.م`,
      type: selectedService.name_en
    });

    setBookingSubmitted(true);
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={rootRef}
      className="w-full font-sans overflow-x-hidden bg-clinical-cream dark:bg-[#0d1b28]"
    >
      <PortalNav isAr={isAr} />
      <WhatsAppFab isAr={isAr} />
      {/* ============================================================
          1. HERO — the doctor's portrait is the primary element
      ============================================================ */}
      <section className="relative min-h-[92vh] lg:min-h-screen overflow-hidden bg-clinical-deep bg-gradient-to-br from-[#132c42] via-clinical to-[#2f5a80] clinical-aurora">
        {/* Portrait — full-bleed on one side, the visual anchor of the page */}
        <div className="pointer-events-none absolute inset-y-0 end-0 z-[5] w-full lg:w-[52%]">
          <img
            src={doctorPhoto}
            alt={isAr ? doctorInfo.name_ar : doctorInfo.name_en}
            className="h-full w-full object-cover object-top opacity-25 lg:opacity-100"
          />
          {/* Blend the portrait into the field so it reads as one composition */}
          <div className="absolute inset-0 bg-gradient-to-t from-clinical-deep via-clinical-deep/25 to-transparent" />
          <div className="absolute inset-y-0 start-0 w-1/2 bg-gradient-to-r from-clinical-deep via-clinical-deep/60 to-transparent rtl:bg-gradient-to-l" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[92vh] lg:min-h-screen max-w-[1240px] flex-col justify-center px-5 sm:px-8 pt-28 pb-16">
          <div className="max-w-2xl">
            <span className="clinical-eyebrow text-clinical-lime">
              [ {isAr ? 'استشاري النساء والتوليد والحقن المجهري' : 'OB-GYN & ICSI CONSULTANT'} ]
            </span>

            <h1 className="clinical-reveal clinical-display mt-6 font-medium text-white text-[clamp(44px,7.5vw,92px)]">
              {isAr ? doctorInfo.name_ar : doctorInfo.name_en}
            </h1>

            <p className="clinical-reveal mt-6 max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-white/75">
              {isAr
                ? 'رعاية مخصصة للخصوبة وصحة المرأة — بخطة مكتوبة، وتكلفة واضحة، ومتابعة حتى النتيجة.'
                : 'Personalised fertility and women’s care — a written plan, clear costs, and follow-through to the result.'}
            </p>

            {/* Primary actions */}
            <div className="clinical-reveal mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToBooking}
                className="inline-flex items-center gap-2 rounded-full bg-clinical-lime px-7 py-3.5 text-[14px] font-bold text-clinical-olive transition hover:brightness-105"
              >
                {isAr ? 'احجزي موعدك' : 'Book an appointment'}
                <Arrow className="h-4 w-4" />
              </button>
              <a
                href={buildWhatsAppLink(isAr)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                {isAr ? 'استشارة سريعة' : 'Quick enquiry'}
              </a>
            </div>

            {/* Credibility strip */}
            <div className="clinical-reveal mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/15 pt-7">
              <div>
                <div className="clinical-display text-[30px] font-medium text-white">+15</div>
                <div className="text-[11.5px] text-white/60">
                  {isAr ? 'عاماً من الخبرة' : 'Years of experience'}
                </div>
              </div>
              <div>
                <div className="clinical-display text-[30px] font-medium text-white">+60</div>
                <div className="text-[11.5px] text-white/60">
                  {isAr ? 'حالة حقن مجهري ناجحة' : 'Successful ICSI cases'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-clinical-lime text-clinical-lime" />
                  ))}
                </div>
                <div className="mt-1.5 text-[11.5px] text-white/60">
                  {isAr ? '4.9 من تقييمات المرضى' : '4.9 from patient ratings'}
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="clinical-reveal mt-8 flex items-center gap-2.5">
              {[
                { href: doctorInfo.social.facebook, Icon: Facebook, label: 'Facebook' },
                { href: doctorInfo.social.instagram, Icon: Instagram, label: 'Instagram' },
                { href: doctorInfo.social.youtube, Icon: Youtube, label: 'YouTube' }
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. MARQUEE STRIP
      ============================================================ */}
      <div className="border-y border-clinical/10 bg-clinical-cream py-4 dark:border-white/10 dark:bg-[#0d1b28]">
        <div className="clinical-marquee-track">
          {[0, 1].map(dup => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_TERMS.map(term => (
                <span
                  key={`${dup}-${term.en}`}
                  className="clinical-display flex items-center gap-6 px-6 text-[20px] sm:text-[26px] font-medium text-clinical/45 dark:text-white/30"
                >
                  {isAr ? term.ar : term.en}
                  <Plus className="h-3.5 w-3.5 text-clinical-lime" strokeWidth={3} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          3. ABOUT
      ============================================================ */}
      <section id="about" className="relative overflow-hidden py-20 sm:py-28">
        {/* Photographic ground */}
        <img
          src={aboutFamily}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-clinical-deep/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-clinical-deep via-transparent to-clinical-deep" />

        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHeading
          tone="light"
          eyebrow={isAr ? 'من نحن' : 'ABOUT'}
          title={isAr ? 'تعرفي على الدكتور' : 'Meet the doctor'}
          body={
            isAr
              ? 'الدكتور محمد حسني علي، استشاري النساء والتوليد وعلاج العقم وجراحة المناظير. يؤمن أن الرعاية الجيدة أكبر من مجرد علاج: خبرة طبية، وتقنيات حديثة، وخطة مكتوبة بوضوح — ليقف معك في كل مرحلة من رحلتك.'
              : 'Dr. Mohamed Hosny Ali, consultant in obstetrics, gynecology, infertility and laparoscopic surgery. He believes good care is more than treatment: clinical experience, modern technology and a clearly written plan — standing with you at every stage of your journey.'
          }
        />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {doctorInfo.stats.map((stat, i) => (
            <div
              key={i}
              className="clinical-reveal rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="clinical-display text-[40px] font-medium text-white">
                {stat.count}
              </div>
              <div className="mt-2 text-[13px] leading-snug text-white/65">
                {isAr ? stat.label_ar : stat.label_en}
              </div>
            </div>
          ))}
        </div>

        <div className="clinical-reveal mt-6 grid gap-4 sm:grid-cols-3">
          {(isAr ? doctorInfo.credentials_ar : doctorInfo.credentials_en).map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 p-5 text-[13px] leading-relaxed text-white/75 backdrop-blur-md"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-clinical-lime" />
              {c}
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ============================================================
          4. SERVICES — deep blue, aurora, card grid
      ============================================================ */}
      <section id="services" className="relative overflow-hidden bg-clinical clinical-aurora py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            eyebrow={isAr ? 'الخدمات' : 'SERVICES'}
            title={isAr ? 'خدمات الخصوبة وصحة المرأة' : 'Fertility & women’s health services'}
            tone="light"
          />
          <ServiceShowcase isAr={isAr} onBook={scrollToBooking} />
        </div>
      </section>

      {/* ============================================================
          5. PROCESS
      ============================================================ */}
      <section id="process" className="mx-auto max-w-[1240px] px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow={isAr ? 'الرحلة' : 'PROCESS'}
          title={isAr ? 'رحلتك معنا تبدأ من هنا' : 'Your journey starts here'}
        />
        <div className="mt-14 space-y-4">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.n}
              className="clinical-reveal grid gap-8 rounded-3xl border border-clinical/12 bg-white p-7 sm:p-10 lg:grid-cols-[auto_1fr_1fr] dark:border-white/10 dark:bg-white/5"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="clinical-display text-[46px] font-medium leading-none text-clinical-lime">
                {step.n}
              </div>
              <div>
                <h3 className="clinical-display text-[26px] font-medium text-clinical-deep dark:text-white">
                  {isAr ? step.title_ar : step.title_en}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-clinical-mid dark:text-white/60">
                  {isAr ? step.body_ar : step.body_en}
                </p>
              </div>
              <div className="rounded-2xl bg-clinical/5 p-6 dark:bg-white/5">
                <div className="clinical-eyebrow text-clinical-mid dark:text-white/50">
                  {isAr ? 'يشمل' : 'What’s included'}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {(isAr ? step.items_ar : step.items_en).map(item => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] text-clinical-deep dark:text-white/70"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clinical-lime" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          5a. VIDEOS — from the doctor's YouTube channel
      ============================================================ */}
      <section id="videos" className="relative overflow-hidden bg-clinical-deep clinical-aurora py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            eyebrow={isAr ? 'من قناة الدكتور' : 'FROM THE CHANNEL'}
            title={isAr ? 'إجابات على أكثر ما يشغلك' : 'Answers to what matters most'}
            body={
              isAr
                ? 'شروحات مبسطة من الدكتور محمد حسني عن الحقن المجهري وتأخر الإنجاب وصحة المرأة.'
                : 'Straightforward explanations from Dr. Mohamed Hosny on ICSI, delayed conception and women’s health.'
            }
            tone="light"
            align="center"
          />
          <VideoShowcase isAr={isAr} />
        </div>
      </section>

      {/* ============================================================
          5b. FULL-BLEED IMAGE BAND
      ============================================================ */}
      <section className="relative h-[80vh] min-h-[560px] lg:h-screen overflow-hidden">
        <img
          src={bannerFamily}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clinical-deep/85 via-clinical-deep/20 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col justify-end px-5 sm:px-8 pb-14 sm:pb-20">
          <p className="clinical-display max-w-3xl text-[32px] sm:text-[52px] lg:text-[64px] font-medium leading-[1.05] text-white">
            {isAr
              ? 'كل رحلة تبدأ بقرار — ونحن معك من أول خطوة.'
              : 'Every journey starts with a decision — we are with you from the first step.'}
          </p>
        </div>
      </section>

      {/* ============================================================
          6. BRANCHES
      ============================================================ */}
      <section id="branches" className="mx-auto max-w-[1240px] px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow={isAr ? 'الفروع' : 'LOCATIONS'}
          title={isAr ? 'أربعة فروع، نفس مستوى الرعاية' : 'Four branches, one standard of care'}
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {doctorInfo.branches.map((b, i) => (
            <div
              key={b.id}
              className="clinical-reveal rounded-2xl border border-clinical/12 bg-white p-7 transition hover:border-clinical/30 dark:border-white/10 dark:bg-white/5"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="clinical-display text-[22px] font-medium text-clinical-deep dark:text-white">
                  {isAr ? b.city_ar : b.city_en}
                </h3>
                <MapPin className="h-4 w-4 shrink-0 text-clinical-lime" />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-clinical-mid dark:text-white/60">
                {isAr ? b.address_ar : b.address_en}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {b.phones.map(p => (
                  <a
                    key={p}
                    href={`tel:${p}`}
                    className="inline-flex items-center gap-2 rounded-full bg-clinical/8 px-3.5 py-1.5 font-mono text-[12px] text-clinical-deep transition hover:bg-clinical/15 dark:bg-white/10 dark:text-white/80"
                  >
                    <Phone className="h-3 w-3" />
                    {p}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          7. BOOKING / CHECKOUT
      ============================================================ */}
      <section
        id="booking"
        className="relative overflow-hidden bg-clinical-deep clinical-aurora py-20 sm:py-28"
      >
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            eyebrow={isAr ? 'الحجز' : 'BOOKING'}
            title={isAr ? 'احجزي موعدك الآن' : 'Reserve your appointment'}
            tone="light"
          />

          {bookingSubmitted ? (
            <div className="clinical-reveal mt-12 rounded-3xl border border-clinical-lime/30 bg-white/10 p-10 text-center backdrop-blur-md">
              <CheckCircle className="mx-auto h-14 w-14 text-clinical-lime" />
              <h3 className="clinical-display mt-5 text-[30px] font-medium text-white">
                {isAr ? 'تم تأكيد طلب الحجز' : 'Booking request confirmed'}
              </h3>
              <p className="mt-3 text-[14px] text-white/70">
                {isAr
                  ? `سنتواصل معك على ${bookingPhone} لتأكيد الموعد.`
                  : `We will contact you on ${bookingPhone} to confirm.`}
              </p>
              <div className="mx-auto mt-7 max-w-sm space-y-2 rounded-2xl bg-white/10 p-5 text-start text-[13px] text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/55">{isAr ? 'الخدمة' : 'Service'}</span>
                  <span className="font-bold">
                    {isAr ? selectedService.name_ar : selectedService.name_en}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/55">{isAr ? 'الموعد' : 'When'}</span>
                  <span className="font-mono">
                    {selectedDate} · {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/15 pt-2">
                  <span className="text-white/55">{isAr ? 'الإجمالي' : 'Total'}</span>
                  <span className="font-bold text-clinical-lime">
                    {netTotalPrice} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setBookingSubmitted(false)}
                className="mt-7 rounded-full border border-white/25 px-6 py-2.5 text-[13px] text-white transition hover:bg-white/10"
              >
                {isAr ? 'حجز موعد آخر' : 'Book another appointment'}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleBookingSubmit}
              className="clinical-reveal mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
            >
              {/* Left: controls */}
              <div className="space-y-7 rounded-3xl border border-white/15 bg-white/8 p-7 sm:p-9 backdrop-blur-md">
                {/* Branch */}
                <div>
                  <label className="clinical-eyebrow text-white/60">
                    {isAr ? '1 — اختر الفرع' : '1 — Choose a branch'}
                  </label>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {doctorInfo.branches.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBookingBranch(b.id)}
                        className={`rounded-xl border px-4 py-3 text-start text-[13px] transition ${
                          bookingBranch === b.id
                            ? 'border-clinical-lime bg-clinical-lime/15 text-white'
                            : 'border-white/15 text-white/65 hover:border-white/35'
                        }`}
                      >
                        {isAr ? b.city_ar : b.city_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="clinical-eyebrow text-white/60">
                    {isAr ? '2 — اختر الخدمة' : '2 — Choose a service'}
                  </label>
                  <div className="mt-3 space-y-2">
                    {servicesList.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-start transition ${
                          selectedService.id === s.id
                            ? 'border-clinical-lime bg-clinical-lime/15'
                            : 'border-white/15 hover:border-white/35'
                        }`}
                      >
                        <span className="text-[13px] text-white">
                          {isAr ? s.name_ar : s.name_en}
                        </span>
                        <span className="shrink-0 font-mono text-[13px] font-bold text-clinical-lime">
                          {s.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & time */}
                <div>
                  <label className="clinical-eyebrow text-white/60">
                    {isAr ? '3 — التاريخ والوقت' : '3 — Date & time'}
                  </label>
                  <div className="relative mt-3">
                    <Calendar className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 h-4 w-4 text-white/50" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 ps-11 pe-4 text-[13px] text-white outline-none transition focus:border-clinical-lime [color-scheme:dark]"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {timeSlots.map(slot => {
                      const booked = isTimeSlotBooked(selectedDate, slot);
                      const active = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-3 font-mono text-[12px] transition ${
                            booked
                              ? 'cursor-not-allowed border-red-400/30 bg-red-500/10 text-red-300/70 line-through'
                              : active
                              ? 'border-clinical-lime bg-clinical-lime text-clinical-olive font-bold'
                              : 'border-white/15 text-white/70 hover:border-white/35'
                          }`}
                        >
                          {booked ? <X className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Patient info */}
                <div>
                  <label className="clinical-eyebrow text-white/60">
                    {isAr ? '4 — بياناتك' : '4 — Your details'}
                  </label>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      placeholder={isAr ? 'الاسم بالكامل' : 'Full name'}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[13px] text-white placeholder-white/40 outline-none transition focus:border-clinical-lime"
                    />
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={e => setBookingPhone(e.target.value)}
                      placeholder={isAr ? 'رقم الهاتف' : 'Phone number'}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[13px] text-white placeholder-white/40 outline-none transition focus:border-clinical-lime"
                    />
                  </div>
                </div>
              </div>

              {/* Right: live summary */}
              <div className="h-fit rounded-3xl border border-white/15 bg-white/12 p-7 backdrop-blur-md lg:sticky lg:top-6">
                <div className="clinical-eyebrow text-white/60">
                  {isAr ? 'ملخص الحجز' : 'Order summary'}
                </div>

                <div className="mt-5 space-y-3.5 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-white/55">{isAr ? 'الخدمة' : 'Service'}</span>
                    <span className="text-end font-bold text-white">
                      {isAr ? selectedService.name_ar : selectedService.name_en}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-white/55">{isAr ? 'الفرع' : 'Branch'}</span>
                    <span className="text-end text-white">
                      {(() => {
                        const b = doctorInfo.branches.find(x => x.id === bookingBranch);
                        return b ? (isAr ? b.city_ar : b.city_en) : '—';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-white/55">{isAr ? 'الموعد' : 'When'}</span>
                    <span className="font-mono text-white">
                      {selectedDate} · {selectedTimeSlot}
                    </span>
                  </div>
                </div>

                {/* Promo */}
                <div className="mt-6 border-t border-white/15 pt-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 h-3.5 w-3.5 text-white/45" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        placeholder={isAr ? 'كود الخصم' : 'Promo code'}
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-3 ps-9 pe-3 font-mono text-[12px] text-white placeholder-white/40 outline-none transition focus:border-clinical-lime"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-white/15 px-4 text-[12px] font-bold text-white transition hover:bg-white/25"
                    >
                      {isAr ? 'تطبيق' : 'Apply'}
                    </button>
                  </div>
                  {discountApplied && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-clinical-lime">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {isAr ? 'تم تطبيق خصم 10%' : '10% discount applied'}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-2.5 border-t border-white/15 pt-5 text-[13px]">
                  <div className="flex justify-between text-white/65">
                    <span>{isAr ? 'قيمة الكشف' : 'Subtotal'}</span>
                    <span className="font-mono">{selectedService.price}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-clinical-lime">
                      <span>{isAr ? 'قيمة الخصم' : 'Discount'}</span>
                      <span className="font-mono">−{discountValue}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-white/15 pt-3">
                    <span className="text-white/65">{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span className="clinical-display text-[30px] font-medium text-clinical-lime">
                      {netTotalPrice}
                      <span className="ms-1.5 text-[13px] font-normal text-white/60">
                        {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-clinical-lime py-4 text-[14px] font-bold text-clinical-olive transition hover:brightness-105 disabled:opacity-50"
                  disabled={!bookingName || !bookingPhone}
                >
                  {isAr ? 'تأكيد الحجز' : 'Confirm booking'}
                  <Arrow className="h-4 w-4" />
                </button>
                <p className="mt-3 text-center text-[11px] text-white/45">
                  {isAr ? 'الدفع في العيادة عند الزيارة' : 'Payment is made at the clinic'}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================
          8. COMPARISON
      ============================================================ */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow={isAr ? 'المقارنة' : 'COMPARISON'}
          title={
            isAr
              ? 'الرعاية يجب أن تكون بسيطة، لا مرهقة'
              : 'Care should feel simple, not stressful'
          }
        />
        <div className="clinical-reveal mt-14 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-clinical/12 bg-clinical/5 p-7 sm:p-9 dark:border-white/10 dark:bg-white/5">
            <div className="clinical-eyebrow text-clinical-mid dark:text-white/50">
              {isAr ? 'الطريقة القديمة' : 'The old way'}
            </div>
            <ul className="mt-6 space-y-4">
              {COMPARISON.map(row => (
                <li
                  key={row.old_en}
                  className="flex items-start gap-3 text-[14px] text-clinical-mid dark:text-white/50"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  {isAr ? row.old_ar : row.old_en}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-clinical-lime/40 bg-clinical p-7 sm:p-9">
            <div className="clinical-eyebrow text-clinical-lime">
              {isAr ? 'مع الدكتور محمد حسني' : 'With Dr. Mohamed Hosny'}
            </div>
            <ul className="mt-6 space-y-4">
              {COMPARISON.map(row => (
                <li key={row.new_en} className="flex items-start gap-3 text-[14px] text-white">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-clinical-lime" strokeWidth={3} />
                  {isAr ? row.new_ar : row.new_en}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. TESTIMONIALS
      ============================================================ */}
      <section className="relative overflow-hidden bg-clinical-soft clinical-aurora py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            eyebrow={isAr ? 'آراء المرضى' : 'TESTIMONIALS'}
            title={isAr ? 'ثقة المرضى، وتوصية العائلات' : 'Trusted by patients, recommended by families'}
            tone="light"
            align="center"
          />

          <TestimonialDrift isAr={isAr} />
        </div>
      </section>

      {/* ============================================================
          10. FAQ
      ============================================================ */}
      <section id="faq" className="mx-auto max-w-[1240px] px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow={isAr ? 'أسئلة حقيقية' : 'REAL QUESTIONS'}
          title={isAr ? 'ما يسأل عنه الجميع أولاً' : 'What everyone asks first'}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Primary FAQs */}
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="clinical-reveal overflow-hidden rounded-2xl border border-clinical/12 bg-white dark:border-white/10 dark:bg-white/5"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-start justify-between gap-4 p-6 text-start"
                  >
                    <span>
                      <span className="clinical-eyebrow block text-clinical-mid dark:text-white/45">
                        {isAr ? f.who_ar : f.who_en}
                      </span>
                      <span className="clinical-display mt-2 block text-[19px] font-medium text-clinical-deep dark:text-white">
                        {isAr ? f.q_ar : f.q_en}
                      </span>
                    </span>
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-clinical/8 text-clinical dark:bg-white/10 dark:text-white">
                      {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {open && (
                    <p className="px-6 pb-6 text-[14px] leading-relaxed text-clinical-mid dark:text-white/60">
                      {isAr ? f.a_ar : f.a_en}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Secondary FAQs */}
          <div className="clinical-reveal h-fit rounded-3xl bg-clinical/5 p-7 dark:bg-white/5">
            <div className="clinical-eyebrow text-clinical-mid dark:text-white/50">
              {isAr ? 'أسئلة أخرى' : 'More questions'}
            </div>
            <div className="mt-5 divide-y divide-clinical/10 dark:divide-white/10">
              {MORE_FAQS.map((f, i) => {
                const open = openMoreFaq === i;
                return (
                  <div key={i} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenMoreFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-3 text-start text-[14px] font-bold text-clinical-deep dark:text-white"
                    >
                      {isAr ? f.q_ar : f.q_en}
                      <span className="shrink-0 text-clinical-lime">
                        {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    {open && (
                      <p className="mt-2.5 text-[13px] leading-relaxed text-clinical-mid dark:text-white/60">
                        {isAr ? f.a_ar : f.a_en}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. CTA + FOOTER
      ============================================================ */}
      <footer className="relative overflow-hidden bg-clinical-deep clinical-aurora">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8 py-20 sm:py-24">
          <div className="clinical-reveal text-center">
            <Eyebrow tone="light">{isAr ? 'ابدأ الآن' : 'GET STARTED'}</Eyebrow>
            <h2 className="clinical-display mx-auto mt-5 max-w-2xl text-[36px] sm:text-[54px] font-medium text-white">
              {isAr ? 'خطوتك الأولى نحو الأمومة' : 'Your first step toward parenthood'}
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={scrollToBooking}
                className="inline-flex items-center gap-2 rounded-full bg-clinical-lime px-7 py-3.5 text-[14px] font-bold text-clinical-olive transition hover:brightness-105"
              >
                {isAr ? 'احجزي موعدك' : 'Book an appointment'}
                <Arrow className="h-4 w-4" />
              </button>
              <a
                href={buildWhatsAppLink(isAr)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                {isAr ? 'تواصل عبر واتساب' : 'Message on WhatsApp'}
              </a>
            </div>
          </div>

          <div className="mt-20 grid gap-10 border-t border-white/12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-clinical-lime">
                  <Plus className="h-4 w-4 text-clinical-olive" strokeWidth={3} />
                </span>
                <span className="clinical-display text-[16px] font-medium text-white">
                  {isAr ? 'د. محمد حسني' : 'Dr. Mohamed Hosny'}
                </span>
              </div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-white/55">
                {isAr ? doctorInfo.title_ar : doctorInfo.title_en}
              </p>
            </div>

            <div>
              <div className="clinical-eyebrow text-white/45">
                {isAr ? 'الخدمات' : 'Services'}
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
                {SERVICES.slice(0, 4).map(s => (
                  <li key={s.id}>{isAr ? s.name_ar : s.name_en}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="clinical-eyebrow text-white/45">
                {isAr ? 'الفروع' : 'Branches'}
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
                {doctorInfo.branches.map(b => (
                  <li key={b.id}>{isAr ? b.city_ar : b.city_en}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="clinical-eyebrow text-white/45">
                {isAr ? 'تواصل معنا' : 'Contact'}
              </div>
              <a
                href={`tel:${doctorInfo.contact_phone}`}
                className="mt-4 flex items-center gap-2 font-mono text-[13px] text-white/70 transition hover:text-clinical-lime"
              >
                <Phone className="h-3.5 w-3.5" />
                {doctorInfo.contact_phone}
              </a>
              <a
                href={buildWhatsAppLink(isAr)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 text-[13px] text-white/70 transition hover:text-clinical-lime"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>

              <div className="mt-5 flex items-center gap-2.5">
                {[
                  { href: doctorInfo.social.facebook, Icon: Facebook, label: 'Facebook' },
                  { href: doctorInfo.social.instagram, Icon: Instagram, label: 'Instagram' },
                  { href: doctorInfo.social.youtube, Icon: Youtube, label: 'YouTube' }
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/12 pt-6 text-center text-[12px] text-white/40">
            © {new Date().getFullYear()} {isAr ? doctorInfo.name_ar : doctorInfo.name_en} —{' '}
            {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
          </div>
        </div>
      </footer>
    </div>
  );
};
