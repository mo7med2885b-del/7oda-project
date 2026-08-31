import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { clinicLogo } from '../assets/images';
import { Stethoscope, Heart, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface PortalSelectorModalProps {
  onSelectPortal: (mode: 'admin' | 'patient') => void;
}

export const PortalSelectorModal: React.FC<PortalSelectorModalProps> = ({ onSelectPortal }) => {
  const { lang } = useClinic();

  return (
    <div className="fixed inset-0 z-50 bg-[#001c15]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-[#00261c] border border-[#00cb87]/30 shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-8 md:p-12 space-y-10 text-center relative overflow-hidden">
        {/* Ambient Gradient Glow Effects */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#00473e]/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#00cb87]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Clean Header */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={clinicLogo}
              alt="Mohamed Hosny Clinic Logo"
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-2 border-[#00cb87]/60 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#00473e] border border-[#00cb87] text-[#00cb87] shadow">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {lang === 'ar' ? 'عيادات الدكتور محمد حسني علي' : 'Dr. Mohamed Hosny Ali Clinics'}
            </h1>
            <p className="text-sm md:text-base text-[#00cb87] font-extrabold">
              {lang === 'ar'
                ? 'استشاري النساء والتوليد وعلاج العقم وجراحة المناظير والحقن المجهري'
                : 'Consultant of OB/GYN, Infertility, Laparoscopic Surgery & IVF'}
            </p>
            <p className="text-xs md:text-sm text-slate-300 pt-1">
              {lang === 'ar'
                ? 'مرحباً بكم. يرجى اختيار البوابة المطلوبة للدخول وتفعيل النمط المناسب'
                : 'Welcome. Please select your target portal to proceed'}
            </p>
          </div>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left rtl:text-right">
          {/* Card 1: Admin / Doctor Portal */}
          <div
            onClick={() => onSelectPortal('admin')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-[#023326] to-[#001c15] border-2 border-[#00473e] hover:border-[#00cb87] shadow-2xl transition-all duration-300 transform hover:-translate-y-2 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#00473e] flex items-center justify-center text-[#00cb87] font-black shadow-lg group-hover:scale-110 transition">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] border border-[#00cb87]/40 text-xs font-mono font-bold uppercase tracking-wider">
                  {lang === 'ar' ? 'نمط الطبيب والإدارة' : 'Doctor Admin Portal'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-[#00cb87] transition">
                  {lang === 'ar' ? '🏥 بوابة الطبيب والإدارة' : '🏥 Doctor Admin Portal'}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                  {lang === 'ar'
                    ? 'منصة العمليات التشغيلية الخاصة بالطبيب، السكرتارية والمحاسب. تشمل قائمة الانتظار المباشرة، محرر SOAP الطبي بالذكاء الاصطناعي، والمركز المالي.'
                    : 'Operational platform for Dr. Mohamed Hosny & staff. Features live patient queue, AI SOAP scribe, EHR dossiers, and double-entry financial ledger.'}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'متابعة قائمة الانتظار والفحص المباشر' : 'Live Appointment Queue Board'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'محرر SOAP الطبي والروشتة الإلكترونية بالذكاء الاصطناعي' : 'AI Doctor SOAP Scribe & Rx Generator'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'المركز المالي المزدوج والمصروفات' : 'Double-Entry Financial Hub & Invoices'}</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-4 rounded-2xl bg-[#00473e] group-hover:bg-[#00cb87] group-hover:text-slate-950 text-white font-black text-sm transition shadow-xl flex items-center justify-center gap-2 mt-4">
              <span>{lang === 'ar' ? 'الدخول كـ طبيب / أدمن' : 'Enter Admin Doctor Portal'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Card 2: Patient Portal */}
          <div
            onClick={() => onSelectPortal('patient')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-[#044435] to-[#00261c] border-2 border-emerald-500/40 hover:border-[#00cb87] shadow-2xl transition-all duration-300 transform hover:-translate-y-2 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#00cb87]/20 flex items-center justify-center text-[#00cb87] font-black shadow-lg group-hover:scale-110 transition">
                  <Heart className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] border border-[#00cb87]/40 text-xs font-mono font-bold uppercase tracking-wider">
                  {lang === 'ar' ? 'نمط المرضى والزوار' : 'Patient Public Portal'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-[#00cb87] transition">
                  {lang === 'ar' ? '🌸 بوابة المرضى والزوار' : '🌸 Patient & Public Portal'}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                  {lang === 'ar'
                    ? 'الموقع الرسمي للمراجعين والزوار بتصميم أنيق فاخر. يحتوي على السيرة الذاتية لدكتور محمد حسني، الفروع الـ 4، وحجز المواعيد أونلاين.'
                    : 'Official patient portal. View Dr. Mohamed Hosny credentials, verified success stats (+3,000 ICSI patients), 4 clinic branches & 1-click booking.'}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'السيرة الذاتية لاستشاري أطفال الأنابيب والخصوبة' : 'IVF & ICSI Specialist Credentials'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'فروع العيادة (القاهرة، المنصورة، دمياط، بورسعيد)' : '4 Clinic Locations Across Egypt'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00cb87] shrink-0" />
                  <span>{lang === 'ar' ? 'حجز موعد أونلاين ومتابعة الواتساب المباشرة' : '1-Click Online Booking & WhatsApp'}</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-4 rounded-2xl bg-[#00cb87] text-slate-950 font-black text-sm transition shadow-xl flex items-center justify-center gap-2 mt-4 hover:bg-[#00b074]">
              <span>{lang === 'ar' ? 'الدخول كـ مريض / زائر' : 'Enter Patient Public Portal'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
