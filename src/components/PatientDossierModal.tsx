import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { printInvoice } from '../utils/pdfGenerator';
import { X, Calendar, FileText, DollarSign, Printer, AlertTriangle, Shield, Upload, File } from 'lucide-react';

interface PatientDossierModalProps {
  patientId: string;
  onClose: () => void;
  onOpenSoapEditor: (patientId: string, appointmentId?: string) => void;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({ patientId, onClose, onOpenSoapEditor }) => {
  const { getPatientById, getMedicalRecordsByPatient, getInvoicesByPatient, appointments } = useClinic();

  const patient = getPatientById(patientId);
  const records = getMedicalRecordsByPatient(patientId);
  const invoices = getInvoicesByPatient(patientId);
  const patientAppointments = appointments.filter(a => a.patient_id === patientId);

  const [activeTab, setActiveTab] = useState<'visits' | 'prescriptions' | 'billing' | 'labs'>('visits');
  const [labFiles, setLabFiles] = useState<{ id: string; name: string; date: string; size: string }[]>([
    { id: 'lab-1', name: 'Comprehensive Blood Count & Lipid Panel.pdf', date: '2026-08-15', size: '1.2 MB' },
    { id: 'lab-2', name: 'Echocardiogram Diagnostic Scan.pdf', date: '2026-07-20', size: '3.4 MB' }
  ]);

  if (!patient) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLabFiles(prev => [
        {
          id: `lab-${Date.now()}`,
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl dark:bg-[#00182e] bg-white border dark:border-[#00d9ff]/30 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-[#00d9ff]/20">
          <div>
            <div className="text-xs text-[#00d9ff] font-bold uppercase tracking-wider">
              Patient Electronic Health Record (EHR) Dossier
            </div>
            <h2 className="text-2xl font-black">{patient.full_name}</h2>
            <div className="text-xs text-slate-300 font-mono mt-1">
              National ID: {patient.national_id} | Phone: {patient.phone} | Age: {patient.age}y ({patient.gender}) | Blood: {patient.blood_type}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Medical Alert Banner if exists */}
        {patient.allergies && patient.allergies !== 'None' && (
          <div className="bg-rose-500/10 border-b border-rose-500/30 px-6 py-2 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>CRITICAL MEDICAL ALLERGY: {patient.allergies}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 px-6 pt-4 border-b dark:border-slate-800 border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-3 border-b-2 flex items-center gap-2 ${
              activeTab === 'visits' ? 'border-[#00d9ff] text-[#00d9ff]' : 'border-transparent text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Visit History ({patientAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3 border-b-2 flex items-center gap-2 ${
              activeTab === 'prescriptions' ? 'border-[#00d9ff] text-[#00d9ff]' : 'border-transparent text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescriptions ({records.reduce((acc, r) => acc + (r.prescription_json?.length || 0), 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-3 border-b-2 flex items-center gap-2 ${
              activeTab === 'billing' ? 'border-[#00d9ff] text-[#00d9ff]' : 'border-transparent text-slate-400'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Invoices & Billing ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 border-b-2 flex items-center gap-2 ${
              activeTab === 'labs' ? 'border-[#00d9ff] text-[#00d9ff]' : 'border-transparent text-slate-400'
            }`}
          >
            <File className="w-4 h-4" />
            <span>Lab Reports & Attachments ({labFiles.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Tab 1: Visits & SOAP Notes */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white">Chronological Encounters</h4>
                <button
                  onClick={() => onOpenSoapEditor(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#00d9ff] text-slate-950 font-extrabold text-xs"
                >
                  + Add New SOAP Encounter
                </button>
              </div>

              {records.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl dark:border-slate-800">
                  No SOAP clinical records added yet.
                </div>
              ) : (
                records.map(rec => (
                  <div key={rec.id} className="p-4 rounded-xl dark:bg-[#00101f] bg-slate-50 border dark:border-[#00d9ff]/20 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-2">
                      <span className="font-mono text-[#00d9ff] font-bold">{rec.created_at.split('T')[0]}</span>
                      <span className="font-bold dark:text-white text-slate-900">{rec.diagnosis}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <strong className="text-slate-400 block uppercase tracking-wider text-[9px]">Subjective</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5">{rec.soap_subjective}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block uppercase tracking-wider text-[9px]">Objective</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5">{rec.soap_objective}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block uppercase tracking-wider text-[9px]">Assessment</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5">{rec.soap_assessment}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block uppercase tracking-wider text-[9px]">Plan</strong>
                        <p className="dark:text-slate-200 text-slate-800 mt-0.5 whitespace-pre-line">{rec.soap_plan}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Prescription Log</h4>
              {records.flatMap(r => r.prescription_json || []).length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl dark:border-slate-800">
                  No active prescriptions recorded.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {records.flatMap(r =>
                    (r.prescription_json || []).map(p => (
                      <div key={p.id} className="p-3 rounded-xl dark:bg-[#00101f] bg-slate-50 border border-slate-200 dark:border-[#00d9ff]/20">
                        <div className="font-bold text-[#00d9ff] text-sm">{p.medication} ({p.dosage})</div>
                        <div className="text-slate-400 mt-1">Frequency: {p.frequency} | Duration: {p.duration}</div>
                        <div className="text-slate-500 italic mt-1">{p.instructions}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Billing & Invoices */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Patient Invoices & Payment Ledger</h4>
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl dark:border-slate-800">
                  No billing invoices issued for this patient.
                </div>
              ) : (
                <div className="space-y-2">
                  {invoices.map(inv => (
                    <div key={inv.id} className="p-3.5 rounded-xl dark:bg-[#00101f] bg-slate-50 border border-slate-200 dark:border-[#00d9ff]/20 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-[#00d9ff]">{inv.invoice_number}</div>
                        <div className="text-slate-400 text-[10px]">Issued: {inv.created_at.split('T')[0]} | Method: {inv.payment_method}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <div className="font-bold text-slate-900 dark:text-white">EGP {inv.total_amount.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-500 font-bold">{inv.payment_status}</div>
                        </div>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:text-[#00d9ff]"
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
                <h4 className="font-bold text-slate-900 dark:text-white">Lab Diagnostics & Scans</h4>
                <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 font-bold text-slate-900 dark:text-white hover:text-[#00d9ff] cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#00d9ff]" />
                  <span>Upload Document / Lab PDF</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                </label>
              </div>

              <div className="space-y-2">
                {labFiles.map(file => (
                  <div key={file.id} className="p-3 rounded-xl dark:bg-[#00101f] bg-slate-50 border border-slate-200 dark:border-[#00d9ff]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-[#00d9ff]" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{file.name}</div>
                        <div className="text-slate-400 text-[10px]">Uploaded: {file.date} | Size: {file.size}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Opening preview for document: ${file.name}`)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 text-[#00d9ff] font-bold text-xs"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
