import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Patient } from '../types';
import { doctorInfo } from '../utils/i18n';
import { Users, Search, UserPlus, FileText, AlertTriangle, Phone, Trash2, MapPin, HeartPulse, CheckCircle } from 'lucide-react';

interface PatientRegistryProps {
  onViewPatientDossier: (patientId: string) => void;
  onOpenSoapEditor: (patientId: string) => void;
}

export const PatientRegistry: React.FC<PatientRegistryProps> = ({ onViewPatientDossier, onOpenSoapEditor }) => {
  const { patients, addPatient, deletePatient, t, lang } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patient Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [bloodType, setBloodType] = useState('A+');
  const [preferredBranch, setPreferredBranch] = useState(doctorInfo.branches[0].id);
  const [medicalAlerts, setMedicalAlerts] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.full_name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.national_id.includes(q) ||
      p.id.toLowerCase().includes(q);

    const matchesBlood = bloodFilter === 'all' || p.blood_type === bloodFilter;
    const matchesBranch = branchFilter === 'all' || (p.medical_alerts && p.medical_alerts.includes(branchFilter));

    return matchesSearch && matchesBlood && matchesBranch;
  });

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !nationalId) {
      alert(lang === 'ar' ? 'يرجى إدخال اسم المريض ورقم الهاتف والرقم القومي.' : 'Full Name, Phone & National ID are required.');
      return;
    }

    const branchObj = doctorInfo.branches.find(b => b.id === preferredBranch);
    const branchLabel = branchObj ? (lang === 'ar' ? branchObj.city_ar : branchObj.city_en) : '';

    const created = addPatient({
      full_name: fullName,
      phone,
      national_id: nationalId,
      age: Number(age),
      gender,
      blood_type: bloodType,
      medical_alerts: `${medicalAlerts || 'None'} [الفرع: ${branchLabel}]`,
      allergies: allergies || 'None',
      emergency_contact: emergencyContact || 'N/A'
    });

    alert(lang === 'ar' ? `تم إضافة المريضة (${created.full_name}) بنجاح للسجل الطبي!` : `Patient (${created.full_name}) registered successfully!`);
    
    // Reset Form
    setFullName('');
    setPhone('');
    setNationalId('');
    setMedicalAlerts('');
    setAllergies('');
    setEmergencyContact('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#082930]/80 border border-slate-200 dark:border-[#15606e]/30 shadow-sm">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#15606e] dark:text-cyan-300" />
            {t('patient_registry_title')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('patient_registry_sub')} (إجمالي المرضى المسجلين: {patients.length})
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#15606e] hover:bg-[#0e4a55] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-cyan-300" />
          <span>{t('register_patient')}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#15606e]"
          />
        </div>

        <select
          value={bloodFilter}
          onChange={e => setBloodFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-xs font-bold text-slate-900 dark:text-cyan-300"
        >
          <option value="all">{t('all_blood_types')}</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-xs font-bold text-slate-900 dark:text-cyan-300"
        >
          <option value="all">{lang === 'ar' ? 'جميع فروع العيادة' : 'All Clinic Branches'}</option>
          {doctorInfo.branches.map(b => (
            <option key={b.id} value={b.id}>
              {lang === 'ar' ? b.city_ar : b.city_en}
            </option>
          ))}
        </select>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#082930]/80 border border-slate-200 dark:border-[#15606e]/30 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{patient.full_name}</h3>
                <div className="text-[11px] text-slate-500 font-mono">الرقم القومي: {patient.national_id}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
                {patient.blood_type}
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{patient.age} سنة ({patient.gender === 'Female' ? 'أنثى' : 'ذكر'})</span>
                <span className="text-slate-300">|</span>
                <Phone className="w-3.5 h-3.5 text-slate-400 inline" />
                <span className="font-mono">{patient.phone}</span>
              </div>

              {patient.medical_alerts && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{patient.medical_alerts}</span>
                </div>
              )}

              {patient.allergies && patient.allergies !== 'None' && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400">
                  <strong>حساسية أدوية:</strong> {patient.allergies}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onViewPatientDossier(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#051c22] text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-200 transition"
                >
                  {t('dossier')}
                </button>

                <button
                  onClick={() => onOpenSoapEditor(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#15606e] text-white font-bold text-xs flex items-center gap-1 hover:bg-[#0e4a55] transition"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{t('soap')}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm(lang === 'ar' ? `هل أنت تأكد من حذف المريض (${patient.full_name})؟` : `Delete patient ${patient.full_name}?`)) {
                    deletePatient(patient.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Patient Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#082930]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#082930] border border-slate-200 dark:border-[#15606e]/40 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#15606e]" />
                {t('register_patient')}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">اسم المريضة بالكامل *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="مثال: سارة أحمد المنصور"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#15606e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">رقم التليفون *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#15606e]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">الرقم القومي (14 رقم) *</label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    placeholder="293xxxxxxxxxxx"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#15606e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">العمر</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">فصيلة الدم</label>
                  <select
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white font-bold"
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
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">الفرع المفضل</label>
                  <select
                    value={preferredBranch}
                    onChange={e => setPreferredBranch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white font-bold"
                  >
                    {doctorInfo.branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {lang === 'ar' ? b.city_ar : b.city_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">التشخيص الحالي / التنبيهات الطبية</label>
                <input
                  type="text"
                  value={medicalAlerts}
                  onChange={e => setMedicalAlerts(e.target.value)}
                  placeholder="مثال: تحضير للحقن المجهري، حمل في الأسبوع 12، تكيس مبيضين"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">حساسية الأدوية (Allergies)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="مثال: البنسلين، الأسبرين..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">بيانات الطوارئ والزوج</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="الاسم ورقم تليفون الطوارئ"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#051c22] border border-slate-200 dark:border-[#15606e]/30 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 font-bold">
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#15606e] hover:bg-[#0e4a55] text-white font-black shadow">
                  حفظ وتسجيل المريضة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
