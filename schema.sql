-- Mohamed Hosny Clinic Management & Financial Intelligence Platform
-- PostgreSQL / Supabase Schema Definition with Row-Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    national_id VARCHAR(50) UNIQUE NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_type VARCHAR(10) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    medical_alerts TEXT,
    allergies TEXT,
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(30) CHECK (status IN ('Waiting', 'In Consultation', 'Completed', 'Cancelled', 'No-Show')) DEFAULT 'Waiting',
    reason VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Initial Assessment', 'Follow-up', 'Procedure', 'Emergency')) DEFAULT 'Initial Assessment',
    ai_brief TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MEDICAL RECORDS / SOAP NOTES TABLE
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    chief_complaint TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    soap_subjective TEXT,
    soap_objective TEXT,
    soap_assessment TEXT,
    soap_plan TEXT,
    prescription_json JSONB DEFAULT '[]'::jsonb,
    vitals JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INVOICES TABLE (INFLOW)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(30) CHECK (payment_status IN ('Draft', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled')) DEFAULT 'Draft',
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'Credit Card', 'Bank Transfer', 'Insurance Split', 'Multiple')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date DATE
);

-- 5. INVOICE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- 6. EXPENSES TABLE (OUTFLOW)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) CHECK (category IN ('Staff Salaries', 'Medical Supplies', 'Utilities', 'Rent', 'Equipment Maintenance', 'Marketing', 'Software & IT', 'Miscellaneous')) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    receipt_url TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_role VARCHAR(50) NOT NULL DEFAULT 'Admin',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full read/write access (RBAC handles fine-grained view controls in frontend)
CREATE POLICY "Authenticated users full access on patients" ON public.patients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on medical_records" ON public.medical_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on invoices" ON public.invoices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on invoice_items" ON public.invoice_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on expenses" ON public.expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access on audit_logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');
