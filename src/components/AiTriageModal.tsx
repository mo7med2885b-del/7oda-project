import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateSmartTriageAndFollowup } from '../utils/aiEngine';
import { X, Sparkles, MessageSquare, Copy, Check, Calendar, HeartPulse } from 'lucide-react';

interface AiTriageModalProps {
  patientId: string;
  onClose: () => void;
}

export const AiTriageModal: React.FC<AiTriageModalProps> = ({ patientId, onClose }) => {
  const { getPatientById, getMedicalRecordsByPatient } = useClinic();
  const patient = getPatientById(patientId);
  const records = getMedicalRecordsByPatient(patientId);
  const lastRecord = records[0];

  const [copied, setCopied] = useState(false);
  const [customDiagnosis, setCustomDiagnosis] = useState(lastRecord ? lastRecord.diagnosis : 'Essential Primary Hypertension');

  if (!patient) return null;

  const triage = generateSmartTriageAndFollowup(patient, customDiagnosis);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(triage.whatsapp_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl dark:bg-[#00182e] bg-white border dark:border-[#00d9ff]/40 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#00101f] via-[#00182e] to-[#00284c] text-white flex items-center justify-between border-b border-[#00d9ff]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00d9ff] to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">
                AI Feature 3: Smart Triage & WhatsApp Follow-up
              </h2>
              <p className="text-xs text-cyan-300">Automated Interval Calculator & Patient Reminder Drafter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Target Diagnosis / Protocol</label>
            <input
              type="text"
              value={customDiagnosis}
              onChange={e => setCustomDiagnosis(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/30 text-slate-900 dark:text-white font-bold"
            />
          </div>

          {/* Optimal Interval Recommendation Card */}
          <div className="p-4 rounded-xl bg-[#00101f] border border-[#00d9ff]/40 space-y-2">
            <div className="text-[10px] font-bold text-[#00d9ff] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>AI Recommended Follow-up Interval</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black font-mono text-white">
                  {triage.optimal_interval_days} Days <span className="text-xs text-slate-400 font-normal">Interval</span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Recommended Date: <strong>{triage.recommended_followup_date}</strong>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Optimal Recovery
              </span>
            </div>
          </div>

          {/* Personalized WhatsApp Message Drafter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Generated Personalized WhatsApp Reminder</span>
              </h4>
              <button
                onClick={handleCopyWhatsApp}
                className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-bold text-xs flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              readOnly
              value={triage.whatsapp_message}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-800 dark:text-emerald-300 font-mono text-[11px] leading-relaxed"
            />
          </div>

          {/* Care Instructions */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#00d9ff]" />
              <span>Tailored Patient Care Instructions</span>
            </h4>
            <div className="space-y-1.5">
              {triage.care_instructions.map((inst, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 dark:text-slate-300 text-slate-800">
                  • {inst}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <a
            href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(triage.whatsapp_message)}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Direct WhatsApp Chat</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
          >
            Close Triage
          </button>
        </div>
      </div>
    </div>
  );
};
