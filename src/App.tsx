import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DoctorProfileLanding } from './components/DoctorProfileLanding';
import { PatientRegistry } from './components/PatientRegistry';
import { FinancialHub } from './components/FinancialHub';
import { SmartCalendar } from './components/SmartCalendar';
import { AuditLogsView } from './components/AuditLogsView';
import { PatientDossierModal } from './components/PatientDossierModal';
import { SoapNoteEditorModal } from './components/SoapNoteEditorModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ExpenseModal } from './components/ExpenseModal';
import { AiFinancialAdvisorModal } from './components/AiFinancialAdvisorModal';
import { AiTriageModal } from './components/AiTriageModal';
import { PortalSelectorModal } from './components/PortalSelectorModal';
import { FeatherlessAiChatDrawer } from './components/FeatherlessAiChatDrawer';
import { Sparkles } from 'lucide-react';

const ClinicAppContent: React.FC = () => {
  const { portalMode, setPortalMode } = useClinic();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals state
  const [showPortalSelectorModal, setShowPortalSelectorModal] = useState<boolean>(() => {
    return !localStorage.getItem('clinic_portal_mode');
  });

  const [dossierPatientId, setDossierPatientId] = useState<string | null>(null);
  const [soapModalData, setSoapModalData] = useState<{ patientId: string; appointmentId?: string } | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAiAdvisorModal, setShowAiAdvisorModal] = useState(false);
  const [triagePatientId, setTriagePatientId] = useState<string | null>(null);

  // AI Drawer State with Prompt Support
  const [aiDrawerState, setAiDrawerState] = useState<{ isOpen: boolean; initialPrompt: string | null }>({
    isOpen: false,
    initialPrompt: null
  });

  const handleOpenAiPrompt = (promptText: string) => {
    setAiDrawerState({
      isOpen: true,
      initialPrompt: promptText
    });
  };

  const handleSelectPortalMode = (mode: 'admin' | 'patient') => {
    setPortalMode(mode);
    setShowPortalSelectorModal(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors relative pb-16 md:pb-0 ${
        portalMode === 'admin'
          ? 'dark:bg-[#00261c] bg-[#f5f2eb]'
          : 'dark:bg-[#001c15] bg-[#f5f2eb]'
      }`}
    >
      <Header />

      <div className="flex flex-1">
        {/* Render Sidebar only in Admin Mode */}
        {portalMode === 'admin' && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAiFinancialAdvisor={() => setShowAiAdvisorModal(true)}
          />
        )}

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {portalMode === 'patient' ? (
            <DoctorProfileLanding />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard
                  onOpenNewAppointment={() => setActiveTab('calendar')}
                  onOpenNewInvoice={() => setShowInvoiceModal(true)}
                  onOpenNewExpense={() => setShowExpenseModal(true)}
                  onOpenSoapNote={(patientId, appointmentId) => setSoapModalData({ patientId, appointmentId })}
                  onViewPatientProfile={patientId => setDossierPatientId(patientId)}
                  onOpenAiPrompt={handleOpenAiPrompt}
                />
              )}

              {activeTab === 'doctor_profile' && <DoctorProfileLanding />}

              {activeTab === 'patients' && (
                <PatientRegistry
                  onViewPatientDossier={patientId => setDossierPatientId(patientId)}
                  onOpenSoapEditor={patientId => setSoapModalData({ patientId })}
                  onOpenAiPrompt={handleOpenAiPrompt}
                />
              )}

              {activeTab === 'financials' && (
                <FinancialHub
                  onOpenNewInvoice={() => setShowInvoiceModal(true)}
                  onOpenNewExpense={() => setShowExpenseModal(true)}
                  onOpenAiAdvisor={() => setShowAiAdvisorModal(true)}
                />
              )}

              {activeTab === 'calendar' && (
                <SmartCalendar
                  onOpenNewAppointment={() => setActiveTab('calendar')}
                  onOpenTriageModal={patientId => setTriagePatientId(patientId)}
                />
              )}

              {activeTab === 'audit' && <AuditLogsView />}
            </>
          )}
        </main>
      </div>

      {/* Floating Featherless AI Action Launcher (Doctor Mode) */}
      {portalMode === 'admin' && (
        <button
          onClick={() => setAiDrawerState(prev => ({ isOpen: !prev.isOpen, initialPrompt: null }))}
          className="fixed bottom-[74px] md:bottom-6 right-3 md:right-6 z-30 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#00cb87] text-slate-950 font-black text-xs shadow-2xl border border-emerald-400 flex items-center gap-2 hover:scale-105 transition transform"
        >
          <Sparkles className="w-4 h-4 text-slate-950 animate-spin-slow" />
          <span>المساعد الذكي</span>
        </button>
      )}

      {/* Portal Initial Selector Screen */}
      {showPortalSelectorModal && <PortalSelectorModal onSelectPortal={handleSelectPortalMode} />}

      {/* Global Modals */}
      {dossierPatientId && (
        <PatientDossierModal
          patientId={dossierPatientId}
          onClose={() => setDossierPatientId(null)}
          onOpenSoapEditor={(patientId, appointmentId) => {
            setDossierPatientId(null);
            setSoapModalData({ patientId, appointmentId });
          }}
          onOpenAiPrompt={handleOpenAiPrompt}
        />
      )}

      {soapModalData && (
        <SoapNoteEditorModal
          patientId={soapModalData.patientId}
          appointmentId={soapModalData.appointmentId}
          onClose={() => setSoapModalData(null)}
          onOpenAiPrompt={handleOpenAiPrompt}
        />
      )}

      {showInvoiceModal && <InvoiceModal onClose={() => setShowInvoiceModal(false)} />}

      {showExpenseModal && <ExpenseModal onClose={() => setShowExpenseModal(false)} />}

      {showAiAdvisorModal && (
        <AiFinancialAdvisorModal
          onClose={() => setShowAiAdvisorModal(false)}
          onOpenAiPrompt={handleOpenAiPrompt}
        />
      )}

      <FeatherlessAiChatDrawer
        isOpen={aiDrawerState.isOpen}
        initialPrompt={aiDrawerState.initialPrompt}
        onClose={() => setAiDrawerState({ isOpen: false, initialPrompt: null })}
      />

      {triagePatientId && (
        <AiTriageModal
          patientId={triagePatientId}
          onClose={() => setTriagePatientId(null)}
          onOpenAiPrompt={handleOpenAiPrompt}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ClinicProvider>
      <ClinicAppContent />
    </ClinicProvider>
  );
};
