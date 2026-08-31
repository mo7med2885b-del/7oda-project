import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Appointment, MedicalRecord, Invoice, Expense, AuditLog, AppointmentStatus } from '../types';
import { translations, Language } from '../utils/i18n';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';

type UserRole = 'Admin' | 'Doctor' | 'Receptionist' | 'Accountant';
type ThemeMode = 'light' | 'dark';
type PortalMode = 'admin' | 'patient';

interface ClinicContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  invoices: Invoice[];
  expenses: Expense[];
  auditLogs: AuditLog[];
  
  // Patient CRUD
  addPatient: (patient: Omit<Patient, 'id' | 'created_at'>) => Patient;
  updatePatient: (id: string, updated: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Appointment CRUD
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => boolean;

  // EHR / Medical Records
  addMedicalRecord: (rec: Omit<MedicalRecord, 'id' | 'created_at'>) => MedicalRecord;

  // Invoices & Expenses
  addInvoice: (inv: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['payment_status'], paidAmount?: number) => void;
  addExpense: (exp: Omit<Expense, 'id' | 'created_at'>) => Expense;
  deleteExpense: (id: string) => void;

  // Audit Logs
  logAudit: (action: string, entityType: string, entityId: string, details?: Record<string, any>) => void;

  // Helper getters
  getPatientById: (id: string) => Patient | undefined;
  getMedicalRecordsByPatient: (patientId: string) => MedicalRecord[];
  getInvoicesByPatient: (patientId: string) => Invoice[];
  resetToSeedData: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'MOHAMED_HOSNY_CLINIC_STORE_V3';

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('clinic_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('clinic_lang');
    return (saved as Language) || 'ar';
  });

  const [portalMode, setPortalModeState] = useState<PortalMode>(() => {
    const saved = localStorage.getItem('clinic_portal_mode');
    return (saved as PortalMode) || 'admin';
  });

  const [userRole, setUserRole] = useState<UserRole>('Admin');

  const safeParse = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch (err) {
      console.warn(`Fallback to default seed for ${key}`, err);
      return fallback;
    }
  };

  const [patients, setPatients] = useState<Patient[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_patients`, INITIAL_PATIENTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_appointments`, INITIAL_APPOINTMENTS)
  );

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_records`, INITIAL_MEDICAL_RECORDS)
  );

  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_invoices`, INITIAL_INVOICES)
  );

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_expenses`, INITIAL_EXPENSES)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    safeParse(`${LOCAL_STORAGE_KEY}_logs`, INITIAL_AUDIT_LOGS)
  );

  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    localStorage.setItem('clinic_portal_mode', mode);
  };

  useEffect(() => {
    localStorage.setItem('clinic_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('clinic_lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_records`, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const logAudit = (action: string, entityType: string, entityId: string, details?: Record<string, any>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user_id: `usr-${userRole.toLowerCase()}-1`,
      user_role: userRole,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addPatient = (patData: Omit<Patient, 'id' | 'created_at'>) => {
    const newPatient: Patient = {
      ...patData,
      id: `pat-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    logAudit('Create Patient', 'Patient', newPatient.id, { name: newPatient.full_name });
    return newPatient;
  };

  const updatePatient = (id: string, updated: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    logAudit('Update Patient', 'Patient', id, updated);
  };

  const deletePatient = (id: string) => {
    const p = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    logAudit('Delete Patient', 'Patient', id, { name: p?.full_name });
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'created_at'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    logAudit('Schedule Appointment', 'Appointment', newApt.id, { patient: newApt.patient_name, date: newApt.appointment_date });
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    logAudit('Update Appointment Status', 'Appointment', id, { status });
  };

  const rescheduleAppointment = (id: string, date: string, startTime: string, endTime: string): boolean => {
    const aptToMove = appointments.find(a => a.id === id);
    if (!aptToMove) return false;

    const conflict = appointments.some(
      a =>
        a.id !== id &&
        a.appointment_date === date &&
        a.status !== 'Cancelled' &&
        ((startTime >= a.start_time && startTime < a.end_time) || (endTime > a.start_time && endTime <= a.end_time))
    );

    if (conflict) {
      alert(`Conflict Detected! Doctor already has an active appointment on ${date} between ${startTime} and ${endTime}.`);
      return false;
    }

    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, appointment_date: date, start_time: startTime, end_time: endTime } : a))
    );
    logAudit('Reschedule Appointment', 'Appointment', id, { date, startTime, endTime });
    return true;
  };

  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id' | 'created_at'>) => {
    const newRec: MedicalRecord = {
      ...recData,
      id: `rec-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setMedicalRecords(prev => [newRec, ...prev]);
    logAudit('Create SOAP Note', 'MedicalRecord', newRec.id, { diagnosis: newRec.diagnosis });
    return newRec;
  };

  const addInvoice = (invData: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>) => {
    const count = invoices.length + 1;
    const invNum = `INV-2026-${count.toString().padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoice_number: invNum,
      created_at: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);
    logAudit('Create Invoice', 'Invoice', newInv.id, { invoice_number: invNum, amount: newInv.total_amount });
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['payment_status'], paidAmount?: number) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const newPaid = paidAmount !== undefined ? paidAmount : status === 'Paid' ? inv.total_amount : inv.paid_amount;
          return { ...inv, payment_status: status, paid_amount: newPaid };
        }
        return inv;
      })
    );
    logAudit('Update Invoice Payment', 'Invoice', id, { status, paidAmount });
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'created_at'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
    logAudit('Log Operating Expense', 'Expense', newExp.id, { category: newExp.category, amount: newExp.amount });
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAudit('Delete Expense', 'Expense', id);
  };

  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getMedicalRecordsByPatient = (patientId: string) => medicalRecords.filter(r => r.patient_id === patientId);
  const getInvoicesByPatient = (patientId: string) => invoices.filter(i => i.patient_id === patientId);

  const resetToSeedData = () => {
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setInvoices(INITIAL_INVOICES);
    setExpenses(INITIAL_EXPENSES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  return (
    <ClinicContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        t,
        portalMode,
        setPortalMode,
        userRole,
        setUserRole,
        patients,
        appointments,
        medicalRecords,
        invoices,
        expenses,
        auditLogs,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        addMedicalRecord,
        addInvoice,
        updateInvoiceStatus,
        addExpense,
        deleteExpense,
        logAudit,
        getPatientById,
        getMedicalRecordsByPatient,
        getInvoicesByPatient,
        resetToSeedData
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
