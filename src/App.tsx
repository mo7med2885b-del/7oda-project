import React, { useState, useEffect } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { NavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
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
import { LoginScreen } from './components/LoginScreen';
import { UserManagementModal } from './components/UserManagementModal';
import { Sparkles } from 'lucide-react';

// Map URL pathname → (portalMode, tab)
const PATH_MAP: Record<string, { mode: 'admin' | 'patient'; tab: NavTab }> = {
  '/welcome':    { mode: 'patient',  tab: 'dashboard' },
  '/patient':    { mode: 'patient',  tab: 'dashboard' }, // legacy alias -> /welcome
  '/dashboard':  { mode: 'admin',    tab: 'dashboard' },
  '/admin':      { mode: 'admin',    tab: 'dashboard' },
  '/calendar':   { mode: 'admin',    tab: 'calendar' },
  '/patients':   { mode: 'admin',    tab: 'patients' },
  '/financials': { mode: 'admin',    tab: 'financials' },
  '/audit':      { mode: 'admin',    tab: 'audit' },
};

const navigate = (path: string) => {
  window.history.pushState(null, '', path);
};

const ClinicAppContent: React.FC = () => {
  const { portalMode, setPortalMode, session, currentProfile, authLoading, can } = useClinic();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Modals state
  const [showPortalSelectorModal, setShowPortalSelectorModal] = useState<boolean>(() => {
    const path = window.location.pathname;
    const hasRoute = Object.keys(PATH_MAP).includes(path);
    return !localStorage.getItem('clinic_portal_mode') && !hasRoute;
  });

  const [dossierPatientId, setDossierPatientId] = useState<string | null>(null);
  const [soapModalData, setSoapModalData] = useState<{ patientId: string; appointmentId?: string } | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAiAdvisorModal, setShowAiAdvisorModal] = useState(false);
  const [triagePatientId, setTriagePatientId] = useState<string | null>(null);
  const [aiDrawerState, setAiDrawerState] = useState<{ isOpen: boolean; initialPrompt: string | null }>({
    isOpen: false,
    initialPrompt: null
  });

  // Sync state from URL pathname on load & popstate (back/forward)
  useEffect(() => {
    const syncFromPath = () => {
      const path = window.location.pathname;
      const route = PATH_MAP[path];
      if (route) {
        setPortalMode(route.mode);
        setActiveTab(route.tab);
      }
    };
    syncFromPath();
    window.addEventListener('popstate', syncFromPath);
    return () => window.removeEventListener('popstate', syncFromPath);
  }, [setPortalMode]);

  // Update URL whenever portalMode or activeTab changes
  useEffect(() => {
    const targetPath = portalMode === 'patient' ? '/welcome' : `/${activeTab}`;
    if (window.location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [portalMode, activeTab]);

  const handleOpenAiPrompt = (promptText: string) => {
    setAiDrawerState({ isOpen: true, initialPrompt: promptText });
  };

  const handleSelectPortalMode = (mode: 'admin' | 'patient') => {
    setPortalMode(mode);
    setShowPortalSelectorModal(false);
    navigate(mode === 'patient' ? '/welcome' : '/dashboard');
  };

  const switchTab = (tab: NavTab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  // Redirect away from any tab this role can't access
  useEffect(() => {
    if (!currentProfile) return;
    if (activeTab === 'financials' && !can('view_financials')) setActiveTab('dashboard');
    if (activeTab === 'audit' && !can('view_audit_logs')) setActiveTab('dashboard');
  }, [activeTab, currentProfile, can]);

  // The patient portal is public; the admin side requires signing in.
  if (portalMode === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#DAE3EE] dark:bg-[#2C3137]">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading...</div>
        </div>
      );
    }
    if (!session || !currentProfile) {
      return <LoginScreen />;
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors relative pb-16 md:pb-0 ${
        portalMode === 'admin'
          ? 'dark:bg-[#2C3137] bg-[#DAE3EE]'
          : 'bg-clinical-cream dark:bg-[#0d1b28]'
      }`}
    >
      {portalMode === 'admin' && (
        <TopNav
          activeTab={activeTab}
          setActiveTab={switchTab}
          onOpenAiFinancialAdvisor={() => setShowAiAdvisorModal(true)}
          onOpenNewAppointment={() => switchTab('calendar')}
          onOpenNewInvoice={() => setShowInvoiceModal(true)}
          onOpenNewExpense={() => setShowExpenseModal(true)}
          onOpenUserManagement={() => setShowUserManagement(true)}
        />
      )}

      <div className="flex flex-1">
        <main
          className={
            portalMode === 'patient'
              ? 'flex-1 w-full overflow-y-auto'
              : 'flex-1 p-3 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full'
          }
        >
          {portalMode === 'patient' ? (
            <DoctorProfileLanding />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard
                  onOpenNewAppointment={() => switchTab('calendar')}
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
                  onOpenNewAppointment={() => switchTab('calendar')}
                  onOpenTriageModal={patientId => setTriagePatientId(patientId)}
                />
              )}
              {activeTab === 'audit' && <AuditLogsView />}
            </>
          )}
        </main>
      </div>

      {/* Floating AI Assistant (Admin only) */}
      {portalMode === 'admin' && (
        <button
          onClick={() => setAiDrawerState(prev => ({ isOpen: !prev.isOpen, initialPrompt: null }))}
          className="fixed bottom-[74px] md:bottom-6 right-3 md:right-6 z-30 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#6AB8FF] text-slate-950 font-black text-xs shadow-2xl border border-[#4FA5F5] flex items-center gap-2 hover:scale-105 transition transform"
        >
          <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
          <span>المساعد الذكي</span>
        </button>
      )}

      {showUserManagement && <UserManagementModal onClose={() => setShowUserManagement(false)} />}

      {showPortalSelectorModal && <PortalSelectorModal onSelectPortal={handleSelectPortalMode} />}

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
