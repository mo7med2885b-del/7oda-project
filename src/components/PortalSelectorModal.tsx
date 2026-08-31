import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Stethoscope, Heart, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface PortalSelectorModalProps {
  onSelectPortal: (mode: 'admin' | 'patient') => void;
}

export const PortalSelectorModal: React.FC<PortalSelectorModalProps> = ({ onSelectPortal }) => {
  const { lang } = useClinic();

  return (
    <div className="fixed inset-0 z-50 bg-[#061e23]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-[#082930] border border-[#15606e]/60 shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-8 md:p-12 space-y-10 text-center relative overflow-hidden">
        {/* Ambient Gradient Glow Effects */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#15606e]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Clean Header: Clinic Logo Only (Doctor photo removed per request) */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src="/LOGO 7oda.jpg"
              alt="Mohamed Hosny Clinic Logo"
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './LOGO 7oda.jpg';
              }}
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#15606e] border border-cyan-400 text-cyan-300 shadow">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {lang === 'ar' ? 'عيادات الدكتور محمد حسني علي' : 'Dr. Mohamed Hosny Ali Clinics'}
            </h1>
            <p className="text-sm md:text-base text-cyan-300 font-extrabold">
              {lang === 'ar'
                ? 'استشاري النساء والتوليد وعلاج العقم وجراحة المناظير والحقن المجهري'
                : 'Consultant of OB/GYN, Infertility, Laparoscopic Surgery & IVF'}
            </p>
            <p className="text-xs md:text-sm text-slate-300 pt-1">
              {lang === 'ar'
                ? 'مرحباً بكم. يرجى اختيار البوابة المطلوبة للدخول وتفعيل ثيم التجربة المناسب'
                : 'Welcome. Please choose your portal destination to experience tailored features'}
            </p>
          </div>
        </div>

        {/* Expanded Dual Portal Selection Cards (Bigger & Better Layout) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left rtl:text-right">
          {/* Card 1: Admin / Doctor Portal */}
          <div
            onClick={() => onSelectPortal('admin')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-[#0c363f] to-[#061e23] border-2 border-[#15606e] hover:border-cyan-400 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#15606e] flex items-center justify-center text-cyan-300 font-black shadow-lg group-hover:scale-110 transition">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                  {lang === 'ar' ? 'نمط الطبيب والإدارة' : 'Doctor Admin Theme'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-cyan-300 transition">
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
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'ar' ? 'متابعة قائمة الانتظار والفحص المباشر' : 'Live Appointment Queue Board'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'ar' ? 'محرر SOAP الطبي والروشتة الإلكترونية بالذكاء الاصطناعي' : 'AI Doctor SOAP Scribe & Rx Generator'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'ar' ? 'المركز المالي المزدوج والمصروفات' : 'Double-Entry Financial Hub & Invoices'}</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-4 rounded-2xl bg-[#15606e] group-hover:bg-cyan-400 group-hover:text-slate-950 text-white font-black text-sm transition shadow-xl flex items-center justify-center gap-2 mt-4">
              <span>{lang === 'ar' ? 'الدخول كـ طبيب / أدمن' : 'Enter Admin Doctor Portal'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Card 2: Patient Portal / Maven-Style Public Portal */}
          <div
            onClick={() => onSelectPortal('patient')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-[#144853] to-[#082930] border-2 border-rose-500/40 hover:border-rose-400 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-black shadow-lg group-hover:scale-110 transition">
                  <Heart className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                  {lang === 'ar' ? 'نمط المرضى والزوار' : 'Patient Public Portal'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-rose-400 transition">
                  {lang === 'ar' ? '🌸 بوابة المرضى والزوار' : '🌸 Patient & Public Portal'}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                  {lang === 'ar'
                    ? 'الموقع الرسمي للمراجعين والزوار بتصميم عالي التباين (مستوحى من Maven). يحتوي على السيرة الذاتية لدكتور محمد حسني، الفروع الـ 4، وحجز المواعيد أونلاين.'
                    : 'Public patient portal inspired by Maven. View Dr. Mohamed Hosny credentials, verified success stats (+60 IVF), 4 clinic branches & 1-click booking.'}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{lang === 'ar' ? 'السيرة الذاتية لاستشاري أطفال الأنابيب والخصوبة' : 'IVF & ICSI Specialist Credentials'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{lang === 'ar' ? 'فروع العيادة (القاهرة، المنصورة، دمياط، بورسعيد)' : '4 Clinic Locations Across Egypt'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{lang === 'ar' ? 'حجز موعد أونلاين ومتابعة الواتساب المباشرة' : '1-Click Online Booking & WhatsApp'}</span>
                </li>
              </ul>
            </div>

            <button className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition shadow-xl flex items-center justify-center gap-2 mt-4">
              <span>{lang === 'ar' ? 'الدخول كـ مريض / زائر' : 'Enter Patient Public Portal'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
