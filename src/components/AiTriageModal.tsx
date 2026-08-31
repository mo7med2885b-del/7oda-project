import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateSmartTriageAndFollowup } from '../utils/aiEngine';
import { X, Sparkles, MessageSquare, Copy, Check, Calendar, HeartPulse } from 'lucide-react';

interface AiTriageModalProps {
  patientId: string;
  onClose: () => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

export const AiTriageModal: React.FC<AiTriageModalProps> = ({ patientId, onClose, onOpenAiPrompt }) => {
  const { getPatientById, getMedicalRecordsByPatient } = useClinic();
  const patient = getPatientById(patientId);
  const records = getMedicalRecordsByPatient(patientId);
  const lastRecord = records[0];

  const [copied, setCopied] = useState(false);
  const [customDiagnosis, setCustomDiagnosis] = useState(lastRecord ? lastRecord.diagnosis : 'متابعة الحقن المجهري');

  if (!patient) return null;

  const triage = generateSmartTriageAndFollowup(patient, customDiagnosis);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(triage.whatsapp_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAiDrawer = () => {
    if (!onOpenAiPrompt) return;
    const prompt = `قم بتحليل حالة المريضة ورأيك الكلينيكي بخصوص المتابعة والفرز:\n• المريضة: ${patient.full_name}\n• التشخيص الحالي: ${customDiagnosis}\n• موعد المتابعة المقترح: ${triage.recommended_followup_date} (${triage.optimal_interval_days} أيام)\n• نص رسالة المتابعة: "${triage.whatsapp_message}"\nما هي النصائح الكلينيكية الإضافية لمتابعة حالة المريضة؟`;
    onOpenAiPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl dark:bg-[#00261c] bg-[#f5f2eb] border dark:border-[#00cb87]/40 border-[#e3ded5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#001c15] text-white flex items-center justify-between border-b border-[#00cb87]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00cb87] text-slate-950 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">
                Smart Triage & WhatsApp Follow-up
              </h2>
              <p className="text-xs text-[#00cb87]">Automated Interval Calculator & Patient Reminder Drafter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
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
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/30 text-[#122620] dark:text-white font-bold"
            />
          </div>

          {/* Optimal Interval Recommendation Card */}
          <div className="p-4 rounded-xl bg-[#001c15] border border-[#00cb87]/40 space-y-2">
            <div className="text-[10px] font-bold text-[#00cb87] uppercase tracking-wider flex items-center gap-1.5">
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
              <span className="px-3 py-1 rounded-full bg-[#00cb87]/20 text-[#00cb87] border border-[#00cb87]/30 text-xs font-bold">
                Optimal Recovery
              </span>
            </div>
          </div>

          {/* Personalized WhatsApp Message Drafter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#122620] dark:text-white flex items-center gap-1.5">
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
              className="w-full p-3 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-slate-800 dark:text-emerald-300 font-mono text-[11px] leading-relaxed"
            />
          </div>

          {/* Care Instructions */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#122620] dark:text-white flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#00cb87]" />
              <span>Tailored Patient Care Instructions</span>
            </h4>
            <div className="space-y-1.5">
              {triage.care_instructions.map((inst, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 dark:text-slate-300 text-slate-800">
                  • {inst}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#001c15] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(triage.whatsapp_message)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>إرسال عبر واتساب</span>
            </a>
            {onOpenAiPrompt && (
              <button
                onClick={handleAskAiDrawer}
                className="px-3.5 py-2 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs shadow transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحليل الحالة في الشات</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
