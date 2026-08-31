import { Patient, Appointment, MedicalRecord, Invoice, Expense, AuditLog } from '../types';

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const NEXT_DAY = new Date(Date.now() + 172800000).toISOString().split('T')[0];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    full_name: 'سارة أحمد المنصور (Sarah Ahmed)',
    phone: '01012345678',
    national_id: '29304151234567',
    age: 32,
    gender: 'Female',
    blood_type: 'A+',
    medical_alerts: 'فرط تحفيز المبيض السابق (Previous OHSS Risk) | حساسية البنسلين',
    allergies: 'Penicillin, Latex',
    emergency_contact: 'أحمد المنصور (زوج) - 01099887766',
    created_at: YESTERDAY
  },
  {
    id: 'pat-102',
    full_name: 'مريم محمود الشناوي (Maryam El-Shennawy)',
    phone: '01123456789',
    national_id: '29608201234568',
    age: 29,
    gender: 'Female',
    blood_type: 'O+',
    medical_alerts: 'تكيس المبيضين الشديد (PCOS) | خمول الغدة الدرقية',
    allergies: 'Sulfa drugs',
    emergency_contact: 'محمود الشناوي - 01155443322',
    created_at: TODAY
  },
  {
    id: 'pat-103',
    full_name: 'داليا يوسف النجار (Dalia El-Naggar)',
    phone: '01234567890',
    national_id: '29012051234569',
    age: 36,
    gender: 'Female',
    blood_type: 'B+',
    medical_alerts: 'بطانة الرحم المهاجرة (Endometriosis Grade III)',
    allergies: 'None',
    emergency_contact: 'يوسف النجار - 01222334455',
    created_at: YESTERDAY
  },
  {
    id: 'pat-104',
    full_name: 'رانيا سمير الخولي (Rania El-Kholy)',
    phone: '01066778899',
    national_id: '29403101234570',
    age: 34,
    gender: 'Female',
    blood_type: 'AB+',
    medical_alerts: 'حمل بالأسابيع 24 (Antenatal Care - Week 24) | ضغط حمل خفيف',
    allergies: 'None',
    emergency_contact: 'سمير الخولي - 01033221100',
    created_at: TODAY
  },
  {
    id: 'pat-105',
    full_name: 'نهى طارق عبد الفتاح (Noha Tarek)',
    phone: '01022334455',
    national_id: '29711011234571',
    age: 27,
    gender: 'Female',
    blood_type: 'O-',
    medical_alerts: 'تحضير للحقن المجهري (ICSI Protocol Preparation)',
    allergies: 'Aspirin',
    emergency_contact: 'طارق عبد الفتاح - 01044556677',
    created_at: TODAY
  },
  {
    id: 'pat-106',
    full_name: 'هدى مصطفى رضوان (Hoda Radwan)',
    phone: '01511223344',
    national_id: '28905051234572',
    age: 39,
    gender: 'Female',
    blood_type: 'A-',
    medical_alerts: 'عقم ثانوي لمدة 5 سنوات (Secondary Infertility 5y)',
    allergies: 'Iodine Contrast',
    emergency_contact: 'مصطفى رضوان - 01566778899',
    created_at: YESTERDAY
  },
  {
    id: 'pat-107',
    full_name: 'ياسمين حسن زكي (Yasmine Zaki)',
    phone: '01088990011',
    national_id: '29801011234573',
    age: 31,
    gender: 'Female',
    blood_type: 'B-',
    medical_alerts: 'استئصال ألياف رحمية بالمنظار سابقاً (Laparoscopic Myomectomy)',
    allergies: 'None',
    emergency_contact: 'حسن زكي - 01077665544',
    created_at: TODAY
  },
  {
    id: 'pat-108',
    full_name: 'إيمان فاروق الصاوي (Eman El-Sawy)',
    phone: '01199887766',
    national_id: '29107121234574',
    age: 35,
    gender: 'Female',
    blood_type: 'O+',
    medical_alerts: 'نجاح أطفال الأنابيب - حامل بالشهر الثالث (Post-IVF Twin Pregnancy W12)',
    allergies: 'Pollen',
    emergency_contact: 'فاروق الصاوي - 01133445566',
    created_at: YESTERDAY
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-201',
    patient_id: 'pat-101',
    patient_name: 'سارة أحمد المنصور (Sarah Ahmed)',
    appointment_date: TODAY,
    start_time: '09:00',
    end_time: '09:30',
    status: 'Completed',
    reason: 'متابعة تنشيط التبويض والحقن المجهري (Follicular Ultrasound Scan)',
    type: 'ICSI Protocol'
  },
  {
    id: 'apt-202',
    patient_id: 'pat-102',
    patient_name: 'مريم محمود الشناوي (Maryam El-Shennawy)',
    appointment_date: TODAY,
    start_time: '09:30',
    end_time: '10:00',
    status: 'In Consultation',
    reason: 'مراجعة تحاليل الهرمونات وتكيس المبيضين (PCOS & Hormone Panel Review)',
    type: 'Infertility Followup'
  },
  {
    id: 'apt-203',
    patient_id: 'pat-103',
    patient_name: 'داليا يوسف النجار (Dalia El-Naggar)',
    appointment_date: TODAY,
    start_time: '10:00',
    end_time: '10:30',
    status: 'Waiting',
    reason: 'سونار رباعي الأبعاد وفحص بطانة الرحم (4D Pelvic Scan)',
    type: 'Ultrasound'
  },
  {
    id: 'apt-204',
    patient_id: 'pat-104',
    patient_name: 'رانيا سمير الخولي (Rania El-Kholy)',
    appointment_date: TODAY,
    start_time: '10:30',
    end_time: '11:00',
    status: 'Waiting',
    reason: 'متابعة الحمل الدورية الأسبوع 24 (Antenatal Care Routine Check)',
    type: 'Obstetrics'
  },
  {
    id: 'apt-205',
    patient_id: 'pat-105',
    patient_name: 'نهى طارق عبد الفتاح (Noha Tarek)',
    appointment_date: TODAY,
    start_time: '11:30',
    end_time: '12:00',
    status: 'Scheduled',
    reason: 'استشارة رئيسية لتجهيز دورة أطفال الأنابيب (IVF Cycle Counseling)',
    type: 'Consultation'
  },
  {
    id: 'apt-206',
    patient_id: 'pat-106',
    patient_name: 'هدى مصطفى رضوان (Hoda Radwan)',
    appointment_date: TOMORROW,
    start_time: '10:00',
    end_time: '10:30',
    status: 'Scheduled',
    reason: 'فحص منظار الرحم التشخيصي (Diagnostic Hysteroscopy Followup)',
    type: 'Laparoscopy'
  },
  {
    id: 'apt-207',
    patient_id: 'pat-107',
    patient_name: 'ياسمين حسن زكي (Yasmine Zaki)',
    appointment_date: TOMORROW,
    start_time: '11:00',
    end_time: '11:30',
    status: 'Scheduled',
    reason: 'متابعة ما بعد جراحة استئصال الألياف (Post-op Check)',
    type: 'Gynecological Surgery'
  },
  {
    id: 'apt-208',
    patient_id: 'pat-108',
    patient_name: 'إيمان فاروق الصاوي (Eman El-Sawy)',
    appointment_date: NEXT_DAY,
    start_time: '12:00',
    end_time: '12:30',
    status: 'Scheduled',
    reason: 'متابعة حمل التوأم ونبض الجنين بالسونار (Twin Pregnancy Fetal Wellbeing)',
    type: 'High-Risk OB'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-301',
    patient_id: 'pat-101',
    doctor_id: 'dr-mohamed-hosny',
    subjective: 'المريضة تشكو من تأخر الحمل الثانوي لمدة سنتين. تم بدء بروتوكول التنشيط الفائق المباشر.',
    objective: 'السونار المهبلي يظهر 6 بويضات في المبيض الأيمن وحجم الأجربة 18 ملم. بطانة الرحم 9.5 ملم triple-line.',
    assessment: 'استجابة ممتازة لتنشيط المبيضين في دورة الحقن المجهري (ICSI Stimulation Phase).',
    plan: 'اعطاء إبرة تفجير البويضات HCG 10000 IU وتحديد موعد سحب البويضات بعد 36 ساعة.',
    diagnosis: 'Primary Infertility - Controlled Ovarian Hyperstimulation',
    prescription: [
      { medication_name: 'Choriomon 10000 IU Trigger Inj', dosage: 'Single dose SC', frequency: 'Once at 10:00 PM', duration: '1 day' },
      { medication_name: 'Prontogest 400mg Suppositories', dosage: '1 suppository', frequency: 'Twice daily', duration: '14 days' }
    ],
    vitals: { bp: '120/80', pulse: '76', weight: '64kg', temp: '36.8C' },
    created_at: TODAY
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-401',
    invoice_number: 'INV-2026-001',
    patient_id: 'pat-101',
    patient_name: 'سارة أحمد المنصور (Sarah Ahmed)',
    items: [
      { description: 'دفعة دورة الحقن المجهري وسحب البويضات (ICSI Cycle & Oocyte Retrieval)', quantity: 1, unit_price: 15000, total: 15000 },
      { description: 'فحص سونار متابعة التبويض (Follicular Tracking UltraSound)', quantity: 1, unit_price: 500, total: 500 }
    ],
    total_amount: 15500,
    paid_amount: 15500,
    payment_status: 'Paid',
    payment_method: 'Credit Card',
    created_at: TODAY
  },
  {
    id: 'inv-402',
    invoice_number: 'INV-2026-002',
    patient_id: 'pat-102',
    patient_name: 'مريم محمود الشناوي (Maryam El-Shennawy)',
    items: [
      { description: 'كشف استشاري وفحص سونار رباعي الأبعاد (Consultation & 4D Scan)', quantity: 1, unit_price: 800, total: 800 },
      { description: 'تحاليل ملف الخصوبة الشامل (Fertility Lab Panel)', quantity: 1, unit_price: 1400, total: 1400 }
    ],
    total_amount: 2200,
    paid_amount: 1200,
    payment_status: 'Partially Paid',
    payment_method: 'Cash',
    created_at: TODAY
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-501',
    category: 'مستلزمات معمل أطفال الأنابيب (IVF Lab Supplies)',
    description: 'شراء وسائط زراعة الأجنة والوسائط المغذية (Embryo Culture Media & Pipettes)',
    amount: 8500,
    expense_date: TODAY,
    created_by: 'Dr. Mohamed Hosny',
    created_at: TODAY
  },
  {
    id: 'exp-502',
    category: 'صيانة وتطهير الأجهزة الطبية',
    description: 'تعقيم وتطهير غرفة عمليات المناظير وجهاز السونار',
    amount: 1200,
    expense_date: TODAY,
    created_by: 'Dr. Mohamed Hosny',
    created_at: TODAY
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-601',
    user_id: 'usr-admin-1',
    user_role: 'Admin',
    action: 'SYSTEM_STARTUP',
    entity_type: 'System',
    entity_id: 'sys-1',
    details: { message: 'Dr. Mohamed Hosny Clinic EHR & Financial Engine Initialized' },
    timestamp: TODAY
  }
];
