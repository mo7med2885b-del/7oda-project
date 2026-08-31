# Mohamed Hosny Clinic Management & Financial Intelligence Platform

Enterprise-grade Clinic Management and Financial Intelligence Platform built with Next.js / Vite React, TypeScript, Tailwind CSS, Zustand, and Supabase RLS.

## Features Overview

1. **Executive Daily Command Center (Today's Overview)**
   - Metrics: Scheduled, Completed, Waiting, No-Show, Today's Gross Inflow, Pending Payments, Operating Expenses.
   - Live Patient Queue Board with 1-click status transitions.
   - 1-Click AI Patient Briefing (3-bullet summary, allergies warning, recommended doctor focus).

2. **Patient Data & Electronic Health Record (EHR)**
   - Full CRUD registry (Full Name, Phone, Age, Gender, Blood Type, Medical Alerts, Emergency Contact, National ID).
   - Patient Profile Dossier: Chronological visits, lab reports, prescriptions log, linked invoices, file uploads.
   - Smart SOAP Editor with AI Doctor Scribe & Auto-SOAP Transformer.

3. **Financial Hub & Billing Management**
   - Invoicing & Billing (Inflow): Itemized services, multi-method payment, printable branded PDF invoice export.
   - Expense & Outflow Ledger: Staff Salaries, Supplies, Utilities, Rent, Maintenance.
   - Financial Analytics & AI Financial Advisor Insights (cash flow leakage warnings, revenue projections).

4. **Smart Scheduling & Calendar Engine**
   - Slot duration presets (15m Follow-up, 45m Initial, 60m Procedure).
   - Automatic conflict detection algorithm preventing overlapping appointments.
   - AI Smart Triage & Personalized WhatsApp/SMS follow-up drafter.

5. **PostgreSQL Supabase Database Schema & RLS**
   - Full relational schema in `schema.sql` with tables for `patients`, `appointments`, `medical_records`, `invoices`, `invoice_items`, `expenses`, and `audit_logs`.

---

## How to Run locally

### Option 1: Instant Local Browser View (No Node/npm installation needed)
Simply open `index.html` directly in your web browser:
```
file:///c:/Users/mo7me/Documents/7oda project/index.html
```

### Option 2: Run via Vite Dev Server on Port 9323
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local server on port 9323:
   ```bash
   npm run dev
   ```
3. Open in your browser:
   ```
   http://localhost:9323/
   ```

---

## Git Initialization
To initialize Git repo on main branch:
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit - Mohamed Hosny Clinic Platform"
```
