import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { clinicLogo } from '../assets/images';
import { doctorInfo } from '../utils/i18n';
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signIn, lang, toggleLang } = useClinic();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setError(
        err.toLowerCase().includes('invalid')
          ? isAr
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
            : 'Invalid email or password.'
          : err
      );
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex bg-[#DAE3EE] dark:bg-[#22262B]">
      {/* ---------- Left: brand panel (desktop only) ---------- */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative overflow-hidden bg-[#2C3137]">
        {/* soft ambient glows */}
        <div
          className="absolute -top-32 -start-24 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #6AB8FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -end-20 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #CFA3F6 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
          <div className="flex items-center gap-3">
            <img
              src={clinicLogo}
              alt=""
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20"
            />
            <div className="text-white/90 font-bold text-sm leading-tight">
              {isAr ? 'عيادات د. محمد حسني علي' : 'Dr. Mohamed Hosny Ali'}
              <div className="text-white/45 text-[11px] font-normal">
                {isAr ? 'نظام إدارة العيادة' : 'Clinic Management System'}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-white font-black leading-[1.15] text-[40px] xl:text-[46px] tracking-tight">
              {isAr ? (
                <>
                  رعاية منظّمة،
                  <br />
                  <span className="text-[#6AB8FF]">وبيانات آمنة.</span>
                </>
              ) : (
                <>
                  Organised care,
                  <br />
                  <span className="text-[#6AB8FF]">secure records.</span>
                </>
              )}
            </h2>
            <p className="mt-5 text-white/55 text-[13px] leading-relaxed max-w-sm">
              {isAr
                ? 'إدارة المواعيد، الملفات الطبية، والفواتير من مكان واحد — بصلاحيات دقيقة لكل موظف.'
                : 'Appointments, medical records and billing in one place — with precise access control for every staff member.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {(isAr
                ? ['المواعيد', 'الملفات الطبية', 'الفواتير', 'الروشتات']
                : ['Scheduling', 'Medical records', 'Billing', 'Prescriptions']
              ).map(chip => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-[11px] font-medium backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/35 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? 'البيانات مشفّرة ومحمية بصلاحيات على مستوى قاعدة البيانات'
                : 'Encrypted and protected by database-level access policies'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Right: form ---------- */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[380px]">
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <img
              src={clinicLogo}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover mx-auto shadow-lg ring-1 ring-black/5"
            />
            <h1 className="mt-4 text-lg font-black text-[#2C3137] dark:text-white">
              {isAr ? 'عيادات د. محمد حسني علي' : 'Dr. Mohamed Hosny Ali'}
            </h1>
          </div>

          <div className="mb-7">
            <h2 className="text-[26px] font-black text-[#2C3137] dark:text-white tracking-tight">
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </h2>
            <p className="text-[13px] text-[#7C7C7C] dark:text-slate-400 mt-1.5">
              {isAr ? 'أدخل بياناتك للوصول إلى لوحة التحكم.' : 'Enter your details to access the dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-[12px] font-semibold text-[#2C3137] dark:text-slate-200 mb-2 block">
                {isAr ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <div className="relative group">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3.5 w-[17px] h-[17px] text-[#7C7C7C] group-focus-within:text-[#6AB8FF] transition-colors pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full ps-11 pe-4 py-3.5 rounded-xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-white/10 text-[13px] text-[#2C3137] dark:text-white placeholder:text-[#7C7C7C]/60 shadow-sm transition-all focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-semibold text-[#2C3137] dark:text-slate-200 mb-2 block">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative group">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3.5 w-[17px] h-[17px] text-[#7C7C7C] group-focus-within:text-[#6AB8FF] transition-colors pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full ps-11 pe-11 py-3.5 rounded-xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-white/10 text-[13px] text-[#2C3137] dark:text-white placeholder:text-[#7C7C7C]/60 shadow-sm transition-all focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute top-1/2 -translate-y-1/2 end-3.5 text-[#7C7C7C] hover:text-[#2C3137] dark:hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/8 border border-rose-500/25 text-[12px] font-medium text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100 text-white font-bold text-[13px] shadow-lg shadow-[#6AB8FF]/25 transition-all flex items-center justify-center gap-2 !mt-6"
            >
              {busy ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{isAr ? 'جارٍ الدخول...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>{isAr ? 'تسجيل الدخول' : 'Sign in'}</span>
                  <Arrow className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#C6D2E2] dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#7C7C7C] dark:text-slate-500">
              {isAr ? 'مشكلة في الدخول؟' : 'Trouble signing in?'}{' '}
              <a
                href={`https://wa.me/${doctorInfo.whatsapp_phone}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#6AB8FF] hover:underline"
              >
                {isAr ? 'تواصل معنا' : 'Contact us'}
              </a>
            </span>
            <button
              type="button"
              onClick={toggleLang}
              className="text-[11px] font-semibold text-[#7C7C7C] dark:text-slate-400 hover:text-[#6AB8FF] transition-colors"
            >
              {isAr ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
