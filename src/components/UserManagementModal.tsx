import React, { useState, useRef } from 'react';
import { useClinic } from '../context/ClinicContext';
import { AppRole } from '../types';
import { X, UserPlus, Camera, Shield, Trash2, Check, AlertCircle } from 'lucide-react';

interface UserManagementModalProps {
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ onClose }) => {
  const {
    lang,
    profiles,
    currentProfile,
    can,
    createUser,
    updateProfile,
    deleteProfile,
    uploadAvatar,
    getAvatarUrl
  } = useClinic();

  const isAr = lang === 'ar';
  const isAdmin = can('manage_users');

  const [tab, setTab] = useState<'me' | 'users'>('me');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // My profile form
  const [myName, setMyName] = useState(currentProfile?.full_name || '');
  const [myPhone, setMyPhone] = useState(currentProfile?.phone || '');

  // New user form
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('secretary');
  const [creating, setCreating] = useState(false);

  const roleLabel = (role: AppRole) =>
    role === 'admin' ? (isAr ? 'مدير (صلاحية كاملة)' : 'Admin (full access)') : isAr ? 'سكرتارية' : 'Secretary';

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProfile) return;
    setUploading(true);
    const path = await uploadAvatar(currentProfile.id, file);
    setUploading(false);
    setMessage(
      path
        ? { type: 'ok', text: isAr ? 'تم تحديث الصورة الشخصية.' : 'Profile picture updated.' }
        : { type: 'err', text: isAr ? 'فشل رفع الصورة.' : 'Avatar upload failed.' }
    );
    e.target.value = '';
  };

  const handleSaveMe = async () => {
    if (!currentProfile) return;
    const { error } = await updateProfile(currentProfile.id, { full_name: myName, phone: myPhone });
    setMessage(
      error
        ? { type: 'err', text: error }
        : { type: 'ok', text: isAr ? 'تم حفظ بياناتك.' : 'Your profile was saved.' }
    );
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    const { error } = await createUser(newEmail.trim(), newPassword, newName.trim(), newRole);
    setCreating(false);
    if (error) {
      setMessage({ type: 'err', text: error });
      return;
    }
    setMessage({
      type: 'ok',
      text: isAr
        ? 'تم إنشاء المستخدم. قد تحتاج لتسجيل الدخول مرة أخرى بحسابك.'
        : 'User created. You may need to sign in again with your own account.'
    });
    setNewEmail('');
    setNewPassword('');
    setNewName('');
    setNewRole('secretary');
  };

  const avatarUrl = getAvatarUrl(currentProfile?.avatar_path);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#22262B] text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">{isAr ? 'إدارة الحساب' : 'Account Management'}</h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isAr ? 'الملف الشخصي وصلاحيات المستخدمين' : 'Your profile and user permissions'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-5 pt-3 border-b border-[#C6D2E2] dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setTab('me')}
            className={`pb-3 border-b-2 transition ${
              tab === 'me' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-500'
            }`}
          >
            {isAr ? 'ملفي الشخصي' : 'My Profile'}
          </button>
          {isAdmin && (
            <button
              onClick={() => setTab('users')}
              className={`pb-3 border-b-2 transition ${
                tab === 'users' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-500'
              }`}
            >
              {isAr ? `المستخدمون (${profiles.length})` : `Users (${profiles.length})`}
            </button>
          )}
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {message && (
            <div
              className={`flex items-start gap-2 p-2.5 rounded-xl border text-[11px] font-bold ${
                message.type === 'ok'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}
            >
              {message.type === 'ok' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* MY PROFILE */}
          {tab === 'me' && currentProfile && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-[#6AB8FF]" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#22262B] text-white flex items-center justify-center text-xl font-black">
                      {currentProfile.full_name.charAt(0)}
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 end-0 p-1.5 rounded-full bg-[#6AB8FF] text-slate-950 shadow border-2 border-white dark:border-[#2C3137] hover:bg-[#4FA5F5] transition"
                    title={isAr ? 'تغيير الصورة' : 'Change picture'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
                </div>
                <div>
                  <div className="font-black text-sm text-[#2C3137] dark:text-white">{currentProfile.full_name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">{currentProfile.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6AB8FF]/15 text-[#2C3137] dark:text-[#6AB8FF] text-[10px] font-black">
                    <Shield className="w-3 h-3" />
                    {roleLabel(currentProfile.role)}
                  </div>
                  {uploading && <div className="text-[10px] text-slate-500 mt-1">{isAr ? 'جارٍ الرفع...' : 'Uploading...'}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    {isAr ? 'الاسم بالكامل' : 'Full name'}
                  </label>
                  <input
                    value={myName}
                    onChange={e => setMyName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6AB8FF]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    {isAr ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    value={myPhone}
                    onChange={e => setMyPhone(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6AB8FF]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveMe}
                className="px-5 py-2.5 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black shadow transition"
              >
                {isAr ? 'حفظ التغييرات' : 'Save changes'}
              </button>
            </div>
          )}

          {/* USER MANAGEMENT (admins only) */}
          {tab === 'users' && isAdmin && (
            <div className="space-y-5">
              {/* Existing users */}
              <div className="space-y-2">
                {profiles.map(p => {
                  const url = getAvatarUrl(p.avatar_path);
                  const isSelf = p.id === currentProfile?.id;
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {url ? (
                          <img src={url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#22262B] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                            {p.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[#2C3137] dark:text-white truncate">
                            {p.full_name} {isSelf && <span className="text-slate-400 font-normal">({isAr ? 'أنت' : 'you'})</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate" dir="ltr">{p.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={p.role}
                          disabled={isSelf}
                          onChange={e => updateProfile(p.id, { role: e.target.value as AppRole })}
                          className="px-2 py-1.5 rounded-lg bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[10px] font-bold text-[#2C3137] dark:text-white disabled:opacity-50 cursor-pointer"
                          title={isSelf ? (isAr ? 'لا يمكنك تغيير صلاحيتك' : "You can't change your own role") : ''}
                        >
                          <option value="admin">{isAr ? 'مدير' : 'Admin'}</option>
                          <option value="secretary">{isAr ? 'سكرتارية' : 'Secretary'}</option>
                        </select>

                        {!isSelf && (
                          <button
                            onClick={() => {
                              if (confirm(isAr ? `حذف المستخدم ${p.full_name}؟` : `Delete user ${p.full_name}?`)) {
                                deleteProfile(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add new user */}
              <form
                onSubmit={handleCreateUser}
                className="p-4 rounded-xl border border-dashed border-[#C6D2E2] dark:border-[#6AB8FF]/30 space-y-3"
              >
                <div className="font-black text-[#2C3137] dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#6AB8FF]" />
                  {isAr ? 'إضافة مستخدم جديد' : 'Add a new user'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder={isAr ? 'الاسم بالكامل' : 'Full name'}
                    className="px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6AB8FF]"
                  />
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                    dir="ltr"
                    className="px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6AB8FF]"
                  />
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder={isAr ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6 chars)'}
                    dir="ltr"
                    className="px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-[#2C3137] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6AB8FF]"
                  />
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as AppRole)}
                    className="px-3 py-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 font-bold text-[#2C3137] dark:text-white cursor-pointer"
                  >
                    <option value="secretary">{isAr ? 'سكرتارية' : 'Secretary'}</option>
                    <option value="admin">{isAr ? 'مدير' : 'Admin'}</option>
                  </select>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? 'السكرتارية ترى المواعيد والمرضى والفواتير فقط — بدون السجلات الطبية أو المصروفات أو التقارير المالية.'
                    : 'Secretaries see appointments, patients and invoices only — no medical records, expenses, or financial reports.'}
                </p>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] disabled:opacity-60 text-slate-950 font-black shadow transition"
                >
                  {creating ? (isAr ? 'جارٍ الإنشاء...' : 'Creating...') : isAr ? 'إنشاء المستخدم' : 'Create user'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
