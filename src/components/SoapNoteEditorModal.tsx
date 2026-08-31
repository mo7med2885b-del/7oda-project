import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateSoapFromRoughNotes } from '../utils/aiEngine';
import { X, Sparkles, FileText, Plus, Trash2 } from 'lucide-react';

interface SoapNoteEditorModalProps {
  patientId: string;
  appointmentId?: string;
  onClose: () => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

export const SoapNoteEditorModal: React.FC<SoapNoteEditorModalProps> = ({ patientId, appointmentId, onClose, onOpenAiPrompt }) => {
  const { getPatientById, addMedicalRecord } = useClinic();
  const patient = getPatientById(patientId);

  const [roughNotes, setRoughNotes] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Form Fields
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');

  // Vitals
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState('72');
  const [temp, setTemp] = useState('36.6°C');
  const [weight, setWeight] = useState('75 kg');
  const [spo2, setSpo2] = useState('99%');

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<
    { id: string; medication: string; dosage: string; frequency: string; duration: string; instructions: string }[]
  >([
    {
      id: 'p-1',
      medication: 'Amoxicillin/Clavulanate 1g',
      dosage: '1000mg',
      frequency: 'Every 12 hours',
      duration: '7 days',
      instructions: 'Take after food'
    }
  ]);

  if (!patient) return null;

  const handleRunAiScribe = () => {
    if (!roughNotes.trim()) {
      alert('Please enter rough doctor bullet points or voice transcript text first.');
      return;
    }

    setIsAiProcessing(true);
    setTimeout(() => {
      const generated = generateSoapFromRoughNotes(roughNotes, patient.full_name);
      setChiefComplaint(generated.chief_complaint);
      setDiagnosis(generated.diagnosis);
      setSoapSubjective(generated.soap_subjective);
      setSoapObjective(generated.soap_objective);
      setSoapAssessment(generated.soap_assessment);
      setSoapPlan(generated.soap_plan);
      if (generated.prescription_json) {
        setPrescriptions(generated.prescription_json);
      }
      setIsAiProcessing(false);
    }, 600);
  };

  const handleAskAiAssistant = () => {
    if (!onOpenAiPrompt) return;
    const prompt = `أحتاج مساعدة كلينيكية في صياغة روشتة وملاحظات SOAP للمريضة: ${patient.full_name}\n• الشكوى: ${chiefComplaint || roughNotes || 'متابعة عادية'}\n• التشخيص: ${diagnosis || 'متابعة كلينيكية'}\nاقترح الجرعات والعلاجات المناسبة للحقن المجهري أو النساء والتوليد.`;
    onOpenAiPrompt(prompt);
    onClose();
  };

  const handleAddRxRow = () => {
    setPrescriptions(prev => [
      ...prev,
      {
        id: `rx-${Date.now()}`,
        medication: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '5 days',
        instructions: ''
      }
    ]);
  };

  const handleRemoveRxRow = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint || !diagnosis) {
      alert('Chief complaint and diagnosis are required.');
      return;
    }

    addMedicalRecord({
      patient_id: patientId,
      appointment_id: appointmentId,
      chief_complaint: chiefComplaint,
      diagnosis,
      soap_subjective: soapSubjective,
      soap_objective: soapObjective,
      soap_assessment: soapAssessment,
      soap_plan: soapPlan,
      prescription_json: prescriptions.filter(p => p.medication.trim() !== ''),
      vitals: { bp, hr, temp, weight, spo2 }
    });

    alert('SOAP Note and Rx generated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl dark:bg-[#00261c] bg-[#f5f2eb] border dark:border-[#00cb87]/30 border-[#e3ded5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-[#001c15] text-white flex items-center justify-between border-b border-[#00cb87]/20">
          <div>
            <div className="text-xs text-[#00cb87] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Smart Clinical SOAP Note Editor & AI Medical Scribe
            </div>
            <h2 className="text-xl font-black mt-1">Encounters for {patient.full_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* AI Feature 1 Widget: AI Scribe & Summarizer */}
          <div className="p-4 rounded-2xl bg-[#001c15] border border-[#00cb87]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00cb87]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-extrabold text-xs uppercase tracking-wider">
                  AI Doctor Scribe & Auto-SOAP Transformer
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onOpenAiPrompt && (
                  <button
                    type="button"
                    onClick={handleAskAiAssistant}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#00cb87] font-bold text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مساعدة الشات الذكي</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRunAiScribe}
                  disabled={isAiProcessing}
                  className="px-4 py-1.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  {isAiProcessing ? 'Transforming...' : 'Generate Structured SOAP'}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Paste rough doctor dictation or shorthand notes below. The AI engine will format it into Subjective, Objective, Assessment, Plan & Rx!
            </p>
            <textarea
              rows={2}
              value={roughNotes}
              onChange={e => setRoughNotes(e.target.value)}
              placeholder="e.g., Patient complaining of 4 days sore throat, high grade fever 38.5, enlarged tonsils with purulent exudate, no cough. Allergy to penicillin. Suspect acute streptococcal pharyngitis."
              className="w-full p-2.5 rounded-xl bg-[#00261c] text-white border border-[#00cb87]/30 focus:ring-2 focus:ring-[#00cb87]"
            />
          </div>

          {/* Vitals Input Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20">
            <div>
              <label className="text-slate-400 font-bold block text-[10px]">BP (mmHg)</label>
              <input type="text" value={bp} onChange={e => setBp(e.target.value)} className="w-full p-1 rounded bg-transparent border-b border-slate-300 dark:border-slate-700 font-mono font-bold dark:text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-bold block text-[10px]">Pulse (bpm)</label>
              <input type="text" value={hr} onChange={e => setHr(e.target.value)} className="w-full p-1 rounded bg-transparent border-b border-slate-300 dark:border-slate-700 font-mono font-bold dark:text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-bold block text-[10px]">Temp (°C)</label>
              <input type="text" value={temp} onChange={e => setTemp(e.target.value)} className="w-full p-1 rounded bg-transparent border-b border-slate-300 dark:border-slate-700 font-mono font-bold dark:text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-bold block text-[10px]">Weight (kg)</label>
              <input type="text" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-1 rounded bg-transparent border-b border-slate-300 dark:border-slate-700 font-mono font-bold dark:text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-bold block text-[10px]">SpO2 (%)</label>
              <input type="text" value={spo2} onChange={e => setSpo2(e.target.value)} className="w-full p-1 rounded bg-transparent border-b border-slate-300 dark:border-slate-700 font-mono font-bold dark:text-white" />
            </div>
          </div>

          {/* Chief Complaint & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-200 mb-1">Chief Complaint *</label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="Primary symptom or reason for visit"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-200 mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                placeholder="Primary ICD-10 or clinical assessment"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white font-bold"
              />
            </div>
          </div>

          {/* SOAP Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-300 mb-1">S - Subjective (Patient History & Symptoms)</label>
              <textarea
                rows={3}
                value={soapSubjective}
                onChange={e => setSoapSubjective(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-300 mb-1">O - Objective (Physical Exam & Labs)</label>
              <textarea
                rows={3}
                value={soapObjective}
                onChange={e => setSoapObjective(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-300 mb-1">A - Assessment (Evaluation & Severity)</label>
              <textarea
                rows={3}
                value={soapAssessment}
                onChange={e => setSoapAssessment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#122620] dark:text-slate-300 mb-1">P - Plan & Management Instructions</label>
              <textarea
                rows={3}
                value={soapPlan}
                onChange={e => setSoapPlan(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20 text-[#122620] dark:text-white"
              />
            </div>
          </div>

          {/* Rx Prescription Manager */}
          <div className="space-y-3 pt-3 border-t dark:border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#122620] dark:text-white">Rx Electronic Prescription</h4>
              <button
                type="button"
                onClick={handleAddRxRow}
                className="px-3 py-1 rounded-lg bg-[#00cb87]/10 text-[#00cb87] font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medication
              </button>
            </div>

            {prescriptions.map((rx) => (
              <div key={rx.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center p-2.5 rounded-xl bg-white dark:bg-[#001c15] border border-[#e3ded5] dark:border-[#00cb87]/20">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={rx.medication}
                  onChange={e => {
                    const val = e.target.value;
                    setPrescriptions(prev => prev.map(p => (p.id === rx.id ? { ...p, medication: val } : p)));
                  }}
                  className="sm:col-span-2 p-1.5 rounded bg-transparent border border-slate-300 dark:border-slate-700 font-bold dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={rx.dosage}
                  onChange={e => {
                    const val = e.target.value;
                    setPrescriptions(prev => prev.map(p => (p.id === rx.id ? { ...p, dosage: val } : p)));
                  }}
                  className="p-1.5 rounded bg-transparent border border-slate-300 dark:border-slate-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={rx.frequency}
                  onChange={e => {
                    const val = e.target.value;
                    setPrescriptions(prev => prev.map(p => (p.id === rx.id ? { ...p, frequency: val } : p)));
                  }}
                  className="p-1.5 rounded bg-transparent border border-slate-300 dark:border-slate-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={rx.duration}
                  onChange={e => {
                    const val = e.target.value;
                    setPrescriptions(prev => prev.map(p => (p.id === rx.id ? { ...p, duration: val } : p)));
                  }}
                  className="p-1.5 rounded bg-transparent border border-slate-300 dark:border-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRxRow(rx.id)}
                  className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black shadow-lg"
            >
              Save SOAP Record & Rx
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
