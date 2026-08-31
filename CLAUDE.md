# CLAUDE.md - Project Knowledge Base & Developer Guidelines

## 🚫 Strict Agent Rules
- **NEVER open the browser autonomously.** Only launch a browser session when the USER explicitly instructs it.
- Always ask the user before using any browser automation tool.

## 📋 Project Summary
**Project**: Dr. Mohamed Hosny Ali Clinical Operations & Public Patient Portal  
**Domain**: Obstetrics, Gynecology, ICSI (Haqn Mejhary), IVF, Laparoscopy & Fetal Medicine  
**Language**: Dual Arabic (primary RTL) & English (LTR)

---

## 📁 Key File Structure
```
7oda project/
├── index.html                    # Entry HTML & Font preloads
├── package.json                  # Dependencies & scripts
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Main layout, URL hash router & modal manager
│   ├── index.css                 # Global CSS tokens & Tailwind imports
│   ├── assets/
│   │   └── images.ts             # Doctor photo & clinic logo assets
│   ├── context/
│   │   └── ClinicContext.tsx     # Global state provider & localStorage sync
│   ├── data/
│   │   └── seedData.ts           # Seed dataset for patients, appointments, invoices
│   ├── types/
│   │   └── index.ts              # TypeScript interface definitions
│   ├── utils/
│   │   ├── aiEngine.ts           # Featherless AI client (Model: Qwen/Qwen3-8B)
│   │   └── i18n.ts               # Arabic/English translations & doctor bio info
│   └── components/
│       ├── Header.tsx            # Sticky top bar & portal switcher
│       ├── Sidebar.tsx           # Navigation sidebar (Admin mode)
│       ├── ExecutiveDashboard.tsx# Doctor KPIs, analytics & quick actions
│       ├── DoctorProfileLanding.tsx# Patient Public Portal & interactive checkout
│       ├── SmartCalendar.tsx     # Conflict-free calendar & visual slot picker
│       ├── PatientRegistry.tsx   # EHR Patient table & dossier trigger
│       ├── FinancialHub.tsx      # Revenue, invoices, expenses & discounts
│       ├── PatientDossierModal.tsx # EHR patient medical records & history
│       ├── SoapNoteEditorModal.tsx# Clinical SOAP notes editor
│       ├── InvoiceModal.tsx      # Invoice creation modal
│       ├── ExpenseModal.tsx      # Expense recording modal
│       ├── AiTriageModal.tsx     # AI patient symptom triage
│       ├── AiFinancialAdvisorModal.tsx # AI financial ledger advisor
│       ├── FeatherlessAiChatDrawer.tsx # Floating AI assistant drawer
│       └── PortalSelectorModal.tsx     # Initial portal selection modal
├── AGENTS.md                     # Agent memory & architecture guide
└── CLAUDE.md                     # Project Knowledge Base (This file)
```

---

## 🎨 Design Rules & Color Palette
- **Deep Forest Emerald Theme**:
  - Primary Background (Dark): `#00261c`
  - Secondary Container (Dark): `#001c15`
  - Primary Brand Green: `#00473e`
  - Accent Neon Emerald: `#00cb87`
  - Light Background: `#f5f2eb` / `#ece7de`
- **Typography**: Modern Arabic Font stack with fallbacks.
- **RTL Support**: Native right-to-left layout for Arabic (`dir="rtl"`).

---

## 🚀 Key Features & Rules

1. **Featherless AI Engine**:
   - Always use model `Qwen/Qwen3-8B`.
   - Endpoint: `https://api.featherless.ai/v1/chat/completions`.

2. **Smart Calendar Booking**:
   - Green buttons (`متاح`) indicate open time slots.
   - Red buttons (`مشغول`) indicate booked slots.
   - Base price (`قيمة الكشف`), discount amount (`قيمة الخصم`), and mandatory discount reason (`سبب الخصم`) are saved to appointments and invoices.

3. **Patient Public Portal**:
   - Interactive checkout experience with procedure selection, branch selector, date/time slot picker, and promo code support (`HOSNY10`).

4. **URL Hash Routing**:
   - Supported hashes: `#patient`, `#dashboard`, `#calendar`, `#patients`, `#financials`, `#audit`.

---

## 🔧 Workflows & Commands
```powershell
# Development
npm run dev

# Build
npm run build

# Single Consolidated Git Push Command
git add .
git commit -m "feat: update clinic platform features"
git push origin main
```
