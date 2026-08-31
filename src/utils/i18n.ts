export type Language = 'en' | 'ar';

export const doctorInfo = {
  name_ar: "الدكتور محمد حسني علي",
  name_en: "Dr. Mohamed Hosny Ali",
  title_ar: "استشاري النساء والتوليد وعلاج العقم وجراحة المناظير | استشاري الحقن المجهري وأطفال الأنابيب",
  title_en: "Consultant of Obstetrics, Gynecology, Infertility & Laparoscopic Surgery | IVF & ICSI Specialist",
  credentials_ar: [
    "عضو الجامعة المصرية والأوروبية والأمريكية للخصوبة والعقم",
    "استشاري الجودة من الجامعة الأمريكية",
    "عضو الجمعية المصرية للتدخل الجراحي الدقيق"
  ],
  credentials_en: [
    "Member of the Egyptian, European (ESHRE) & American (ASRM) Societies for Reproductive Medicine & Infertility",
    "Healthcare Quality Consultant - American University",
    "Member of the Egyptian Society for Minimal Access Surgery (ESMAS)"
  ],
  stats: [
    { count: "+60", label_ar: "حالة أطفال أنابيب ناجحة", label_en: "Successful IVF Cases" },
    { count: "+60", label_ar: "حالة حقن مجهري ناجحة من أول مرة", label_en: "First-Time ICSI Successes" },
    { count: "+100", label_ar: "حالات شفيت من أمراض الرحم", label_en: "Uterine Disease Cures" },
    { count: "+60", label_ar: "ولادة ناجحة", label_en: "Successful Deliveries" }
  ],
  contact_phone: "01033188360",
  whatsapp_phone: "201033188360",
  branches: [
    {
      id: "cairo",
      city_ar: "القاهرة (التجمع الخامس)",
      city_en: "Cairo (New Cairo)",
      address_ar: "التجمع الخامس - شارع التسعين - مول Well Care بجوار مستشفى شفا خلف المستشفى الجوي",
      address_en: "Fifth Settlement, 90th St, Well Care Mall (Next to Shifa Hospital, behind Air Force Hospital)",
      phones: ["01033188360"]
    },
    {
      id: "mansoura",
      city_ar: "المنصورة",
      city_en: "Mansoura",
      address_ar: "ميدان المحطة, برج اللؤلؤة, أمام كبابجي الدعدع",
      address_en: "El-Mahatta Square, El-Lolow'a Tower (In front of DaaDaa)",
      phones: ["01023246936", "0502100466"]
    },
    {
      id: "damietta",
      city_ar: "دمياط (كفر سعد)",
      city_en: "Damietta (Kafr Saad)",
      address_ar: "تفتيش كفر سعد, أعلى سيراميك أولاد عوف, أمام صيدلية اليرموك",
      address_en: "Tafteesh Kafr Saad, above Awlad Ouf Ceramics (Opposite Al-Yarmouk Pharmacy)",
      phones: ["01068784626"]
    },
    {
      id: "portsaid",
      city_ar: "بورسعيد",
      city_en: "Port Said",
      address_ar: "فندق جراند أوتيل طرح البحر، الدور السابع - مركز رويال للخصوبة",
      address_en: "Grand Hotel Tarh El-Bahr, 7th Floor - Royal Fertility Center",
      phones: ["01032006352", "01024201018"]
    }
  ]
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    clinic_title: "Dr. Mohamed Hosny Ali",
    subtitle: "Consultant of Obstetrics, Gynecology, Infertility & IVF",
    enterprise_badge: "Enterprise",
    role_label: "Role",
    admin_role: "Admin",
    doctor_role: "Doctor (SOAP & AI Scribe)",
    receptionist_role: "Receptionist (Queue)",
    accountant_role: "Accountant (Ledger)",
    reset_data: "Reset Seed Data",
    theme_light: "Light",
    theme_dark: "Dark",
    search_placeholder: "Search patients by name, ID, phone...",

    // Navigation Tabs
    nav_command: "Command Center",
    nav_patients: "Patient Registry & EHR",
    nav_financials: "Financial Hub & Billing",
    nav_calendar: "Smart Calendar & Triage",
    nav_doctor_profile: "Doctor Profile & Branches",
    nav_audit: "Audit Security Logs",
    ai_financial_advisor_title: "AI Financial Advisor",
    ai_financial_advisor_desc: "Run automated cash flow leak detection & net margin projections.",
    analyze_cash_flow: "Analyze Cash Flow",

    // Doctor Profile & Branches Section
    dr_about_heading: "About Dr. Mohamed Hosny Ali",
    dr_specialties: "Obstetrics, Gynecology, ICSI, IVF & Laparoscopic Surgery Specialist",
    dr_credentials_title: "Academic Degrees & International Memberships",
    dr_branches_title: "Clinic Branches & Locations Across Egypt",
    dr_success_stories: "Verified Success Metrics",
    book_online_now: "Book Your Appointment Now",
    book_subtitle: "Submit your contact details and our medical coordination team will contact you.",
    name_field: "Full Name",
    phone_field: "Phone Number",
    branch_select: "Preferred Branch",
    submit_booking: "Confirm Booking Request",
    contact_via_whatsapp: "Contact via WhatsApp",

    // Executive Dashboard
    exec_header: "Executive Daily Command Center",
    exec_sub: "Today's Operational Dashboard",
    exec_desc: "Live patient queue monitoring, real-time cash flow & AI clinical assistant.",
    book_appointment: "Book Appointment",
    new_invoice: "New Invoice",
    record_expense: "Record Expense",
    queue_title: "Today's Patient Queue",
    scheduled_today: "Scheduled Today",
    waiting: "Waiting",
    active_exam: "In Exam",
    completed: "Completed",
    gross_inflow_today: "Today's Gross Inflow",
    pending_receivables: "Pending Receivables",
    today_expenses: "Today's Expenses",
    net_operating_cashflow: "Net Operating Cash Flow",
    avg_wait_time: "Avg Waiting Time",
    avg_consultation_time: "Avg Consultation Time",
    live_queue_board: "Live Patient Queue Board",
    slot: "Slot",
    patient_name: "Patient Name",
    reason: "Reason",
    status: "Status",
    actions: "Actions",
    ai_brief_btn: "AI Brief",
    start_exam: "Start Exam",
    finish_soap: "Finish & SOAP",
    ai_briefing_title: "1-Click AI Patient Briefing",
    allergies_alert: "Medical Alert / Allergy",
    ai_3bullet_title: "AI Executive 3-Bullet Briefing",
    recommended_focus: "Recommended Doctor Focus",
    launch_soap_editor: "Launch SOAP Clinical Editor",

    // Patient Registry
    patient_registry_title: "Patient Registry & EHR Dossier",
    patient_registry_sub: "Complete Electronic Health Records (EHR) management & medical alerts.",
    register_patient: "Register New Patient",
    blood_group: "Blood Group",
    all_blood_types: "All Blood Types",
    name_id: "Patient Name & ID",
    age_gender: "Age / Gender",
    phone_emergency: "Phone & Emergency",
    medical_alerts: "Medical Alerts / Allergies",
    no_allergies: "No known allergies",
    dossier: "Dossier",
    soap: "SOAP",

    // Financial Hub
    financial_hub_title: "Double-Entry Financial Hub & Cash Flow Engine",
    financial_hub_sub: "Track revenue inflows, operating expenses outflow & net margins.",
    total_inflow: "Total Revenue Inflow (Collected)",
    total_outflow: "Total Operating Outflow (Expenses)",
    net_profit: "Net Operating Profit / Loss",
    accounts_receivable: "Accounts Receivable (Pending)",
    invoices_billing: "Invoices & Billing",
    operating_expenses: "Operating Expenses",
    cashflow_analytics: "Cash Flow Analytics & AI",
    invoice_no: "Invoice # & Date",
    method: "Method",
    total: "Total",
    paid: "Paid",
    mark_paid: "Mark Paid",
    pdf_export: "Printable PDF",

    // Smart Calendar
    calendar_title: "Smart Scheduling & Conflict-Free Calendar",
    calendar_sub: "Automated conflict detection algorithm & slot presets.",
    ai_triage_btn: "AI Triage",
    reschedule: "Reschedule",

    // Language Switcher
    lang_toggle: "العربية"
  },
  ar: {
    clinic_title: "الدكتور محمد حسني علي",
    subtitle: "استشاري النساء والتوليد وعلاج العقم وجراحة المناظير والحقن المجهري",
    enterprise_badge: "المؤسسي الذكي",
    role_label: "الصلاحية",
    admin_role: "مدير النظام",
    doctor_role: "الطبيب (ملاحظات SOAP والذكاء الاصطناعي)",
    receptionist_role: "موظف الاستقبال (قائمة الانتظار)",
    accountant_role: "المحاسب (الدفتر المالي)",
    reset_data: "إعادة ضبط البيانات التجريبية",
    theme_light: "فاتح",
    theme_dark: "داكن",
    search_placeholder: "ابحث عن مريض بالاسم، الرقم القومي، أو الهاتف...",

    // Navigation Tabs
    nav_command: "مركز التحكم والعمليات",
    nav_patients: "سجل المرضى والملفات الطبية",
    nav_financials: "المستردات والتدفق النقدي",
    nav_calendar: "الجدول الذكي وفرز الحالات",
    nav_doctor_profile: "السيرة الذاتية وفروع العيادة",
    nav_audit: "سجل الأمان والتدقيق",
    ai_financial_advisor_title: "المستشار المالي الذكي",
    ai_financial_advisor_desc: "تشغيل التدقيق الآلي للتسرب المالي وتوقعات صافي الربح.",
    analyze_cash_flow: "تحليل التدفق النقدي",

    // Doctor Profile & Branches Section
    dr_about_heading: "تعرفي إلى الدكتور محمد حسني علي",
    dr_specialties: "استشاري النساء والتوليد وعلاج العقم وجراحة المناظير والحقن المجهري وأطفال الأنابيب",
    dr_credentials_title: "الشهادات والجمعيات الطبية العالمية",
    dr_branches_title: "فروع عيادات الدكتور محمد حسني علي بمصر",
    dr_success_stories: "إحصائيات ونسب النجاح الموثقة",
    book_online_now: "احجزي موعدك الآن مع أفضل دكتور أمراض نساء وحقن مجهري",
    book_subtitle: "سجلي بياناتك وسنعاود الاتصال بك لتأكيد الحجز.",
    name_field: "الاسم بالكامل",
    phone_field: "رقم التليفون",
    branch_select: "الفرع المطلوب",
    submit_booking: "تأكيد طلب الحجز الآن",
    contact_via_whatsapp: "التواصل المباشر عبر واتساب",

    // Executive Dashboard
    exec_header: "لوحة التحكم اليومية التنفيذية",
    exec_sub: "مؤشرات العمليات اليومية المباشرة",
    exec_desc: "متابعة قائمة المرضى المباشرة، التدفق النقدي والمساعد الطبي الذكي.",
    book_appointment: "حجز موعد جديد",
    new_invoice: "إصدار فاتورة",
    record_expense: "تسجيل مصروفات",
    queue_title: "قائمة انتظار اليوم",
    scheduled_today: "المواعيد المسجلة اليوم",
    waiting: "في الانتظار",
    active_exam: "قيد الفحص",
    completed: "مكتمل",
    gross_inflow_today: "إجمالي المقبوضات اليوم",
    pending_receivables: "المبالغ المتبقية (آجل)",
    today_expenses: "مصروفات التشغيل اليوم",
    net_operating_cashflow: "صافي التدفق النقدي التشغيلي",
    avg_wait_time: "متوسط وقت الانتظار",
    avg_consultation_time: "متوسط وقت الكشف",
    live_queue_board: "جدول قائمة انتظار المرضى المباشر",
    slot: "التوقيت",
    patient_name: "اسم المريض",
    reason: "سبب الزيارة",
    status: "الحالة",
    actions: "الإجراءات",
    ai_brief_btn: "ملخص الذكاء الاصطناعي",
    start_exam: "بدء الكشف",
    finish_soap: "إنهاء وتدوين SOAP",
    ai_briefing_title: "ملخص المريض الذكي بضغطة واحدة",
    allergies_alert: "تنبيه طبي / حساسية أدوية",
    ai_3bullet_title: "الملخص التنفيذي الطبي (3 نقاط)",
    recommended_focus: "التوصيات المقترحة للطبيب",
    launch_soap_editor: "فتح محرر ملاحظات SOAP الطبية",

    // Patient Registry
    patient_registry_title: "سجل المرضى والملف الطبي الإلكتروني (EHR)",
    patient_registry_sub: "إدارة السجلات الطبية الكاملة، الحساسية، والتنبيهات الطبية.",
    register_patient: "تسجيل مريض جديد",
    blood_group: "فصيلة الدم",
    all_blood_types: "جميع فصائل الدم",
    name_id: "اسم المريض والرقم القومي",
    age_gender: "العمر / الجنس",
    phone_emergency: "الهاتف والطوارئ",
    medical_alerts: "التنبيهات الطبية وحساسية الأدوية",
    no_allergies: "لا توجد حساسية معروفة",
    dossier: "الملف الكامل",
    soap: "ملاحظات SOAP",

    // Financial Hub
    financial_hub_title: "المركز المالي ومحرك التدفق النقدي ك مزدوج القيد",
    financial_hub_sub: "تتبع الإيرادات المقبوضة، المصروفات التشغيلية وصافي أرباح العيادة.",
    total_inflow: "إجمالي المقبوضات الإيرادية",
    total_outflow: "إجمالي المصروفات التشغيلية",
    net_profit: "صافي الربح / الخسارة التشغيلية",
    accounts_receivable: "المستحقات الآجلة (ذمم مدينة)",
    invoices_billing: "الفواتير والمستندات",
    operating_expenses: "مصروفات التشغيل",
    cashflow_analytics: "تحليلات الذكاء الاصطناعي المالي",
    invoice_no: "رقم الفاتورة والتاريخ",
    method: "طريقة الدفع",
    total: "الإجمالي",
    paid: "المدفوع",
    mark_paid: "تسديد بالكامل",
    pdf_export: "طباعة فاتورة PDF",

    // Smart Calendar
    calendar_title: "جدول المواعيد الذكي بدون تضارب",
    calendar_sub: "خوارزمية الفحص الآلي لمنع تضارب الحجوزات مع الأطباء.",
    ai_triage_btn: "توجيه ذكي",
    reschedule: "تعديل الموعد",

    // Language Switcher
    lang_toggle: "English"
  }
};
