import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Patient, Appointment, MedicalRecord, Invoice, Expense, AuditLog, AppointmentStatus, PatientAttachment, AttachmentCategory } from '../types';
import { translations, Language } from '../utils/i18n';
import { supabase, ATTACHMENTS_BUCKET } from '../utils/supabaseClient';

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
  loading: boolean;
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  invoices: Invoice[];
  expenses: Expense[];
  auditLogs: AuditLog[];
  attachments: PatientAttachment[];

  // Patient CRUD
  addPatient: (patient: Omit<Patient, 'id' | 'created_at'>) => Promise<Patient | undefined>;
  updatePatient: (id: string, updated: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;

  // Appointment CRUD
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => Promise<Appointment | undefined>;
  updateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => Promise<boolean>;

  // EHR / Medical Records
  addMedicalRecord: (rec: Omit<MedicalRecord, 'id' | 'created_at'>) => Promise<MedicalRecord | undefined>;

  // Invoices & Expenses
  addInvoice: (inv: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>) => Promise<Invoice | undefined>;
  updateInvoiceStatus: (id: string, status: Invoice['payment_status'], paidAmount?: number) => Promise<void>;
  addExpense: (exp: Omit<Expense, 'id' | 'created_at'>) => Promise<Expense | undefined>;
  deleteExpense: (id: string) => Promise<void>;

  // Attachments (prescription images, lab reports, etc.)
  uploadAttachment: (patientId: string, file: File, category?: AttachmentCategory, medicalRecordId?: string) => Promise<PatientAttachment | undefined>;
  deleteAttachment: (id: string) => Promise<void>;
  getAttachmentUrl: (filePath: string) => string;
  getAttachmentsByPatient: (patientId: string) => PatientAttachment[];

  // Audit Logs
  logAudit: (action: string, entityType: string, entityId: string, details?: Record<string, any>) => Promise<void>;

  // Helper getters
  getPatientById: (id: string) => Patient | undefined;
  getMedicalRecordsByPatient: (patientId: string) => MedicalRecord[];
  getInvoicesByPatient: (patientId: string) => Invoice[];
  refreshAll: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

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
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [attachments, setAttachments] = useState<PatientAttachment[]>([]);

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

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const [
      { data: patientsData },
      { data: appointmentsData },
      { data: recordsData },
      { data: invoicesData },
      { data: expensesData },
      { data: logsData },
      { data: attachmentsData }
    ] = await Promise.all([
      supabase.from('patients').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
      supabase.from('medical_records').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('created_at', { ascending: false }),
      supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200),
      supabase.from('patient_attachments').select('*').order('created_at', { ascending: false })
    ]);

    setPatients(patientsData || []);
    setAppointments(appointmentsData || []);
    setMedicalRecords(recordsData || []);
    setInvoices(invoicesData || []);
    setExpenses(expensesData || []);
    setAuditLogs(logsData || []);
    setAttachments(attachmentsData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const logAudit = async (action: string, entityType: string, entityId: string, details?: Record<string, any>) => {
    const newLog = {
      user_id: `usr-${userRole.toLowerCase()}-1`,
      user_role: userRole,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || null,
      timestamp: new Date().toISOString()
    };
    const { data, error } = await supabase.from('audit_logs').insert(newLog).select().single();
    if (!error && data) setAuditLogs(prev => [data, ...prev]);
  };

  const addPatient = async (patData: Omit<Patient, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('patients').insert(patData).select().single();
    if (error || !data) {
      console.error('addPatient failed', error);
      return undefined;
    }
    setPatients(prev => [data, ...prev]);
    logAudit('Create Patient', 'Patient', data.id, { name: data.full_name });
    return data;
  };

  const updatePatient = async (id: string, updated: Partial<Patient>) => {
    const { error } = await supabase.from('patients').update(updated).eq('id', id);
    if (error) {
      console.error('updatePatient failed', error);
      return;
    }
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    logAudit('Update Patient', 'Patient', id, updated);
  };

  const deletePatient = async (id: string) => {
    const p = patients.find(p => p.id === id);
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) {
      console.error('deletePatient failed', error);
      return;
    }
    setPatients(prev => prev.filter(p => p.id !== id));
    logAudit('Delete Patient', 'Patient', id, { name: p?.full_name });
  };

  const addAppointment = async (aptData: Omit<Appointment, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('appointments').insert(aptData).select().single();
    if (error || !data) {
      console.error('addAppointment failed', error);
      return undefined;
    }
    setAppointments(prev => [data, ...prev]);
    logAudit('Schedule Appointment', 'Appointment', data.id, { patient: data.patient_name, date: data.appointment_date });
    return data;
  };

  const updateAppointment = async (id: string, updated: Partial<Appointment>) => {
    const { error } = await supabase.from('appointments').update(updated).eq('id', id);
    if (error) {
      console.error('updateAppointment failed', error);
      return;
    }
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
    logAudit('Update Appointment Details', 'Appointment', id, updated);
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) {
      console.error('updateAppointmentStatus failed', error);
      return;
    }
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    logAudit('Update Appointment Status', 'Appointment', id, { status });
  };

  const rescheduleAppointment = async (id: string, date: string, startTime: string, endTime: string): Promise<boolean> => {
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

    const { error } = await supabase
      .from('appointments')
      .update({ appointment_date: date, start_time: startTime, end_time: endTime })
      .eq('id', id);
    if (error) {
      console.error('rescheduleAppointment failed', error);
      return false;
    }

    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, appointment_date: date, start_time: startTime, end_time: endTime } : a))
    );
    logAudit('Reschedule Appointment', 'Appointment', id, { date, startTime, endTime });
    return true;
  };

  const addMedicalRecord = async (recData: Omit<MedicalRecord, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('medical_records').insert(recData).select().single();
    if (error || !data) {
      console.error('addMedicalRecord failed', error);
      return undefined;
    }
    setMedicalRecords(prev => [data, ...prev]);
    logAudit('Create SOAP Note', 'MedicalRecord', data.id, { diagnosis: data.diagnosis });
    return data;
  };

  const addInvoice = async (invData: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>) => {
    const count = invoices.length + 1;
    const invNum = `INV-2026-${count.toString().padStart(3, '0')}`;
    const { data, error } = await supabase
      .from('invoices')
      .insert({ ...invData, invoice_number: invNum })
      .select()
      .single();
    if (error || !data) {
      console.error('addInvoice failed', error);
      return undefined;
    }
    setInvoices(prev => [data, ...prev]);
    logAudit('Create Invoice', 'Invoice', data.id, { invoice_number: invNum, amount: data.total_amount });
    return data;
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['payment_status'], paidAmount?: number) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const newPaid = paidAmount !== undefined ? paidAmount : status === 'Paid' ? inv.total_amount : inv.paid_amount;
    const { error } = await supabase.from('invoices').update({ payment_status: status, paid_amount: newPaid }).eq('id', id);
    if (error) {
      console.error('updateInvoiceStatus failed', error);
      return;
    }
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, payment_status: status, paid_amount: newPaid } : i)));
    logAudit('Update Invoice Payment', 'Invoice', id, { status, paidAmount });
  };

  const addExpense = async (expData: Omit<Expense, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('expenses').insert(expData).select().single();
    if (error || !data) {
      console.error('addExpense failed', error);
      return undefined;
    }
    setExpenses(prev => [data, ...prev]);
    logAudit('Log Operating Expense', 'Expense', data.id, { category: data.category, amount: data.amount });
    return data;
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      console.error('deleteExpense failed', error);
      return;
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAudit('Delete Expense', 'Expense', id);
  };

  const uploadAttachment = async (
    patientId: string,
    file: File,
    category: AttachmentCategory = 'prescription',
    medicalRecordId?: string
  ) => {
    const patient = patients.find(p => p.id === patientId);
    const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
    const baseLabel = category === 'prescription' ? 'prescription' : category;
    const displayName = patient
      ? `${patient.full_name}-${baseLabel}${ext ? '.' + ext : ''}`
      : file.name;
    const safeName = displayName.replace(/[^a-zA-Z0-9.\-_؀-ۿ]/g, '_');
    const filePath = `${patientId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(filePath, file);
    if (uploadError) {
      console.error('uploadAttachment failed', uploadError);
      alert('File upload failed: ' + uploadError.message);
      return undefined;
    }

    const { data, error } = await supabase
      .from('patient_attachments')
      .insert({
        patient_id: patientId,
        medical_record_id: medicalRecordId,
        category,
        file_name: displayName,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userRole
      })
      .select()
      .single();

    if (error || !data) {
      console.error('uploadAttachment record failed', error);
      return undefined;
    }

    setAttachments(prev => [data, ...prev]);
    logAudit('Upload Attachment', 'PatientAttachment', data.id, { patient_id: patientId, file_name: displayName, category });
    return data;
  };

  const deleteAttachment = async (id: string) => {
    const att = attachments.find(a => a.id === id);
    if (!att) return;
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove([att.file_path]);
    const { error } = await supabase.from('patient_attachments').delete().eq('id', id);
    if (error) {
      console.error('deleteAttachment failed', error);
      return;
    }
    setAttachments(prev => prev.filter(a => a.id !== id));
    logAudit('Delete Attachment', 'PatientAttachment', id, { file_name: att.file_name });
  };

  const getAttachmentUrl = (filePath: string) => {
    return supabase.storage.from(ATTACHMENTS_BUCKET).getPublicUrl(filePath).data.publicUrl;
  };

  const getAttachmentsByPatient = (patientId: string) => attachments.filter(a => a.patient_id === patientId);

  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getMedicalRecordsByPatient = (patientId: string) => medicalRecords.filter(r => r.patient_id === patientId);
  const getInvoicesByPatient = (patientId: string) => invoices.filter(i => i.patient_id === patientId);

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
        loading,
        patients,
        appointments,
        medicalRecords,
        invoices,
        expenses,
        auditLogs,
        attachments,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        addMedicalRecord,
        addInvoice,
        updateInvoiceStatus,
        addExpense,
        deleteExpense,
        uploadAttachment,
        deleteAttachment,
        getAttachmentUrl,
        getAttachmentsByPatient,
        logAudit,
        getPatientById,
        getMedicalRecordsByPatient,
        getInvoicesByPatient,
        refreshAll
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
