import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { printInvoice } from '../utils/pdfGenerator';
import { X, Calendar, FileText, DollarSign, Printer, AlertTriangle, Upload, File, Sparkles } from 'lucide-react';

interface PatientDossierModalProps {
  patientId: string;
  onClose: () => void;
  onOpenSoapEditor: (patientId: string, appointmentId?: string) => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({ patientId, onClose, onOpenSoapEditor, onOpenAiPrompt }) => {
  const { getPatientById, getMedicalRecordsByPatient, getInvoicesByPatient, appointments, getAttachmentsByPatient, uploadAttachment, deleteAttachment, getAttachmentUrl } = useClinic();

  const patient = getPatientById(patientId);
  const records = getMedicalRecordsByPatient(patientId);
  const invoices = getInvoicesByPatient(patientId);
  const patientAppointments = appointments.filter(a => a.patient_id === patientId);
  const patientAttachments = getAttachmentsByPatient(patientId);
  const prescriptionImages = patientAttachments.filter(a => a.category === 'prescription');
  const labFiles = patientAttachments.filter(a => a.category === 'lab_report' || a.category === 'scan' || a.category === 'other');

  const [activeTab, setActiveTab] = useState<'visits' | 'prescriptions' | 'billing' | 'labs'>('visits');
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [uploadingLab, setUploadingLab] = useState(false);
  const [viewingAttachmentId, setViewingAttachmentId] = useState<string | null>(prescriptionImages[0]?.id || null);

  if (!patient) return null;

  const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPrescription(true);
    await uploadAttachment(patientId, file, 'prescription');
    setUploadingPrescription(false);
    e.target.value = '';
  };

  const handleLabFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLab(true);
    await uploadAttachment(patientId, file, 'lab_report');
    setUploadingLab(false);
    e.target.value = '';
  };

  const formatSize = (bytes?: number) => (bytes ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : '');

  const handleAiAnalysis = () => {
    if (!onOpenAiPrompt) return;
    const prompt = `قم بإجراء تحليل كلينيكي شامل ومباشر لملف المريضة:\n• الاسم: ${patient.full_name}\n• السن: ${patient.age} سنة (${patient.gender})\n• فصيلة الدم: ${patient.blood_type}\n• التنبيهات والحساسية: ${patient.allergies || 'لا يوجد'}\n• ملخص الزيارات السابقة: ${records.length} زيارات مسجلة بالروشتات والتشخيصات.\nأعطني أهم التوصيات الطبية والخطوات القادمة للمتابعة.`;
    onOpenAiPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl rounded-2xl dark:bg-[#2C3137] bg-[#DAE3EE] border dark:border-[#6AB8FF]/40 border-[#2C3137]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#22262B] text-white flex items-center justify-between border-b border-[#6AB8FF]/30">
          <div>
            <div className="text-[10px] sm:text-xs text-[#6AB8FF] font-bold uppercase tracking-wider">
              Patient Electronic Health Record (EHR) Dossier
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">{patient.full_name}</h2>
            <div className="text-[11px] sm:text-xs text-slate-300 font-mono mt-1" dir="ltr">
              ID: {patient.national_id} | Phone: {patient.phone} | Age: {patient.age}y ({patient.gender}) | Blood: {patient.blood_type}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenAiPrompt && (
              <button
                onClick={handleAiAnalysis}
                className="px-3 sm:px-4 py-2 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">تحليل الملف بالذكاء الاصطناعي</span>
                <span className="sm:hidden">تحليل AI</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Medical Alert Banner if exists */}
        {patient.allergies && patient.allergies !== 'None' && (
          <div className="bg-rose-500/15 border-b border-rose-500/40 px-4 sm:px-6 py-2 text-rose-950 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>CRITICAL MEDICAL ALLERGY: {patient.allergies}</span>
          </div>
        )}

        {/* Navigation Tabs (Scrollable on small screens) */}
        <div className="flex items-center gap-4 px-4 sm:px-6 pt-3 border-b dark:border-white/10 border-[#C6D2E2] text-xs font-bold overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'visits' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#6AB8FF]" />
            <span>Visit History ({patientAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'prescriptions' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 text-[#6AB8FF]" />
            <span>Prescriptions ({records.reduce((acc, r) => acc + (r.prescription_json?.length || 0), 0) + prescriptionImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'billing' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#6AB8FF]" />
            <span>Invoices & Billing ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'labs' ? 'border-[#6AB8FF] text-[#2C3137] dark:text-[#6AB8FF]' : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            <File className="w-4 h-4 text-[#6AB8FF]" />
            <span>Lab Reports & Attachments ({labFiles.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Tab 1: Visits & SOAP Notes */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2C3137] dark:text-white">Chronological Encounters</h4>
                <button
                  onClick={() => onOpenSoapEditor(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#6AB8FF] text-slate-950 font-black text-xs hover:bg-[#4FA5F5] transition"
                >
                  + Add New SOAP Encounter
                </button>
              </div>

              {records.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl dark:border-[#6AB8FF]/30 border-[#C6D2E2]">
                  No SOAP clinical records added yet.
                </div>
              ) : (
                records.map(rec => (
                  <div key={rec.id} className="p-4 rounded-2xl dark:bg-[#22262B] bg-white border dark:border-[#6AB8FF]/30 border-[#C6D2E2] space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b dark:border-white/10 border-[#C6D2E2] pb-2">
                      <span className="font-mono text-[#6AB8FF] font-bold" dir="ltr">{rec.created_at.split('T')[0]}</span>
                      <span className="font-bold dark:text-white text-[#2C3137]">{rec.diagnosis}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <strong className="text-[#2C3137] dark:text-[#6AB8FF] block uppercase tracking-wider text-[9px] font-extrabold">Subjective</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5 leading-relaxed">{rec.soap_subjective}</p>
                      </div>
                      <div>
                        <strong className="text-[#2C3137] dark:text-[#6AB8FF] block uppercase tracking-wider text-[9px] font-extrabold">Objective</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5 leading-relaxed">{rec.soap_objective}</p>
                      </div>
                      <div>
                        <strong className="text-[#2C3137] dark:text-[#6AB8FF] block uppercase tracking-wider text-[9px] font-extrabold">Assessment</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5 leading-relaxed">{rec.soap_assessment}</p>
                      </div>
                      <div>
                        <strong className="text-[#2C3137] dark:text-[#6AB8FF] block uppercase tracking-wider text-[9px] font-extrabold">Plan</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5 whitespace-pre-line leading-relaxed">{rec.soap_plan}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2C3137] dark:text-white">Prescription Log</h4>
                <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 font-bold text-[#2C3137] dark:text-white hover:text-[#6AB8FF] cursor-pointer flex items-center gap-1.5 transition">
                  <Upload className="w-4 h-4 text-[#6AB8FF]" />
                  <span>{uploadingPrescription ? 'Uploading...' : 'Upload Prescription Image'}</span>
                  <input type="file" onChange={handlePrescriptionUpload} className="hidden" accept="image/*,.pdf" disabled={uploadingPrescription} />
                </label>
              </div>

              {records.flatMap(r => r.prescription_json || []).length === 0 && prescriptionImages.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl dark:border-[#6AB8FF]/30 border-[#C6D2E2]">
                  No active prescriptions recorded.
                </div>
              ) : (
                <>
                  {prescriptionImages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                      {/* Left: file list */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {prescriptionImages.map(att => (
                          <div
                            key={att.id}
                            onClick={() => setViewingAttachmentId(att.id)}
                            className={`relative group p-2 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                              viewingAttachmentId === att.id
                                ? 'border-[#6AB8FF] bg-[#6AB8FF]/10'
                                : 'border-[#C6D2E2] dark:border-[#6AB8FF]/30 bg-white dark:bg-[#22262B]'
                            }`}
                          >
                            {att.mime_type?.startsWith('image/') ? (
                              <img src={getAttachmentUrl(att.file_path)} alt={att.file_name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#FCFDFF] dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <File className="w-5 h-5 text-[#6AB8FF]" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[11px] font-bold text-[#2C3137] dark:text-white">{att.file_name}</div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400" dir="ltr">{att.created_at.split('T')[0]} {formatSize(att.file_size)}</div>
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                if (viewingAttachmentId === att.id) setViewingAttachmentId(null);
                                deleteAttachment(att.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition shrink-0"
                              title="Delete"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Right: preview panel */}
                      <div className="rounded-2xl border border-[#C6D2E2] dark:border-[#6AB8FF]/30 bg-white dark:bg-[#22262B] p-3 flex items-center justify-center min-h-[280px]">
                        {(() => {
                          const active = prescriptionImages.find(a => a.id === viewingAttachmentId) || prescriptionImages[0];
                          if (!active) return null;
                          return active.mime_type?.startsWith('image/') ? (
                            <a href={getAttachmentUrl(active.file_path)} target="_blank" rel="noopener noreferrer" className="w-full">
                              <img src={getAttachmentUrl(active.file_path)} alt={active.file_name} className="max-h-96 w-full object-contain rounded-xl" />
                            </a>
                          ) : (
                            <a
                              href={getAttachmentUrl(active.file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center gap-2 text-[#6AB8FF] font-bold text-xs"
                            >
                              <File className="w-12 h-12" />
                              <span>{active.file_name}</span>
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Open document</span>
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {records.flatMap(r =>
                      (r.prescription_json || []).map(p => (
                        <div key={p.id} className="p-3.5 rounded-2xl dark:bg-[#22262B] bg-white border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-sm">
                          <div className="font-bold text-[#6AB8FF] text-sm">{p.medication} ({p.dosage})</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-1 font-mono text-[11px]" dir="ltr">Frequency: {p.frequency} | Duration: {p.duration}</div>
                          <div className="text-slate-500 dark:text-slate-400 italic mt-1">{p.instructions}</div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 3: Billing & Invoices */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#2C3137] dark:text-white">Patient Invoices & Payment Ledger</h4>
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl dark:border-[#6AB8FF]/30 border-[#C6D2E2]">
                  No billing invoices issued for this patient.
                </div>
              ) : (
                <div className="space-y-2">
                  {invoices.map(inv => (
                    <div key={inv.id} className="p-3.5 rounded-2xl dark:bg-[#22262B] bg-white border border-[#C6D2E2] dark:border-[#6AB8FF]/30 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="font-mono font-bold text-[#6AB8FF]">{inv.invoice_number}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[10px]" dir="ltr">Issued: {inv.created_at.split('T')[0]} | Method: {inv.payment_method}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono" dir="ltr">
                          <div className="font-bold text-[#2C3137] dark:text-white">EGP {inv.total_amount.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-500 font-bold">{inv.payment_status}</div>
                        </div>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="p-2 rounded-xl bg-[#FCFDFF] dark:bg-slate-800 text-[#2C3137] dark:text-white hover:text-[#6AB8FF] transition"
                          title="Print Official Branded PDF Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Labs */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2C3137] dark:text-white">Lab Diagnostics & Scans</h4>
                <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 font-bold text-[#2C3137] dark:text-white hover:text-[#6AB8FF] cursor-pointer flex items-center gap-1.5 transition">
                  <Upload className="w-4 h-4 text-[#6AB8FF]" />
                  <span>{uploadingLab ? 'Uploading...' : 'Upload Document / Lab PDF'}</span>
                  <input type="file" onChange={handleLabFileUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg" disabled={uploadingLab} />
                </label>
              </div>

              {labFiles.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl dark:border-[#6AB8FF]/30 border-[#C6D2E2]">
                  No lab reports or scans uploaded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {labFiles.map(file => (
                    <div key={file.id} className="p-3.5 rounded-2xl dark:bg-[#22262B] bg-white border border-[#C6D2E2] dark:border-[#6AB8FF]/30 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-[#6AB8FF]" />
                        <div>
                          <div className="font-bold text-[#2C3137] dark:text-white">{file.file_name}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[10px]" dir="ltr">Uploaded: {file.created_at.split('T')[0]} | Size: {formatSize(file.file_size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getAttachmentUrl(file.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#6AB8FF]/15 text-[#6AB8FF] font-bold text-xs hover:bg-[#6AB8FF] hover:text-slate-950 transition"
                        >
                          View Report
                        </a>
                        <button
                          onClick={() => deleteAttachment(file.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
