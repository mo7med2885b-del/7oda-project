export type Gender = 'Male' | 'Female' | 'Other';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  national_id: string;
  age: number;
  gender: Gender;
  blood_type: BloodType;
  medical_alerts: string;
  allergies: string;
  emergency_contact: string;
  created_at: string;
}

export type AppointmentStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No-Show' | 'Scheduled';
export type AppointmentType = 'Initial Assessment' | 'Follow-up' | 'Procedure' | 'Emergency';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone?: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: AppointmentStatus;
  reason: string;
  type: string;
  ai_brief?: string;
  medicine_price_details?: string;
  created_at: string;
}

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Vitals {
  bp?: string;
  hr?: string;
  temp?: string;
  weight?: string;
  spo2?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  appointment_id?: string;
  doctor_id?: string;
  chief_complaint?: string;
  diagnosis: string;
  // Either SOAP fields or legacy fields
  soap_subjective?: string;
  soap_objective?: string;
  soap_assessment?: string;
  soap_plan?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  prescription_json?: PrescriptionItem[];
  prescription?: Array<Record<string, string>>;
  vitals?: Vitals | Record<string, string>;
  created_at: string;
}

export type PaymentStatus = 'Draft' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Bank Transfer' | 'Insurance Split' | 'Multiple';

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  total_price?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  appointment_id?: string;
  issue_date?: string;
  due_date?: string;
  subtotal?: number;
  discount?: number;
  discount_amount?: number;
  discount_reason?: string;
  tax?: number;
  total_amount: number;
  net_amount?: number;
  paid_amount: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  items: InvoiceItem[];
  created_at: string;
}

export type ExpenseCategory =
  | 'Staff Salaries'
  | 'Medical Supplies'
  | 'Utilities'
  | 'Rent'
  | 'Equipment Maintenance'
  | 'Marketing'
  | 'Software & IT'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  payment_method?: string;
  vendor?: string;
  receipt_url?: string;
  expense_date: string;
  created_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_role: 'Admin' | 'Doctor' | 'Receptionist' | 'Accountant';
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface AiClinicalBrief {
  summary: string;
  previous_visits_highlights: string[];
  allergies_warning: string;
  chief_complaint: string;
  recommended_focus: string[];
}

export interface AiFinancialInsight {
  cash_flow_summary: string;
  net_profit_margin: string;
  leakage_warnings: string[];
  revenue_projections: string;
  growth_recommendations: string[];
}

export interface AiTriageResult {
  diagnosis: string;
  optimal_interval_days: number;
  recommended_followup_date: string;
  whatsapp_message: string;
  care_instructions: string[];
}
