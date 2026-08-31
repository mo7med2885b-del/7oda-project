# AGENTS.md - AI Agent & Architecture Memory

## 📌 Project Overview
**Dr. Mohamed Hosny Ali Clinical Operations & Public Portal Platform**
An enterprise-grade, dual-portal web application for Obstetrics, Gynecology, Infertility, ICSI (Haqn Mejhary), and IVF procedures. Serving 4 branches across Egypt (Cairo, Mansoura, Damietta, Port Said).

---

## 🛠️ Technology Stack
- **Framework**: React 18+ (TypeScript), Vite
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **Design System**: Deep Forest Emerald & Luxury Gold Palette
  - Primary Deep Green: `#00473e`
  - Emerald Accent: `#00cb87`
  - Dark Emerald Background: `#00261c` / `#001c15`
  - Sand Cream Light Mode: `#f5f2eb` / `#ece7de`
- **Icons**: Lucide React (`lucide-react`)
- **AI Integration**: Featherless AI Engine (OpenAI-compatible client at `https://api.featherless.ai/v1`)
  - Active Model String: `Qwen/Qwen3-8B`
- **State Management**: React Context (`ClinicContext.tsx`) with automatic `localStorage` persistence and fallback initial seed dataset.
- **Routing**: Client-side URL Hash Routing (`/#patient`, `/#dashboard`, `/#calendar`, `/#patients`, `/#financials`, `/#audit`).

---

## 🏛️ Application Architecture & Key Modules

### 1. Dual Portal System
- **Doctor Admin Portal (`portalMode === 'admin'`)**:
  - Full EHR (Electronic Health Records), Smart Calendar, Financial Hub, AI Triage, Audit Logs, and AI Chat Assistant.
- **Public Patient Portal (`portalMode === 'patient'`)**:
  - Interactive appointment booking checkout engine across the 4 clinic branches with live procedure pricing, promo code support (`HOSNY10`), and digital appointment ticket generation.

### 2. URL Hash Routing Map
- `/#patient` → Public Patient Landing Page & Appointment Checkout
- `/#dashboard` → Doctor Executive Dashboard & KPIs
- `/#calendar` → Smart Conflict-Free Calendar & Visual Slot Picker
- `/#patients` → EHR Patient Registry & Patient Dossiers
- `/#financials` → Invoicing, Discounts, Expense Tracking & Financial Hub
- `/#audit` → System Security & Action Audit Logs

---

## 📅 Smart Calendar & Slot Picker Engine
- **Visual Slot Picker**:
  - 🟢 **Green Slots (`متاح`)**: Open time slots available for booking.
  - 🔴 **Red Slots (`مشغول`)**: Booked/taken slots automatically disabled to prevent conflict.
- **Date Range**: Unlimited date selection via native HTML date picker + horizontal scrollable day chips (from Aug 30, 2026 onwards).
- **Financial & Discount Control**:
  - Base Fee input (`قيمة الكشف / الإجراء`).
  - Discount Amount input (`قيمة الخصم`).
  - **Mandatory Discount Reason (`سبب الخصم`)**: Enforced when discount > 0.
  - Quick New Patient Registration directly inside the booking modal.

---

## 🏥 Clinic Branches & Location Data
1. **Cairo Branch (القاهرة)**:
   - Well Care Mall, 5th Settlement, New Cairo (مول well care التجمع الخامس).
2. **Mansoura Branch (المنصورة)**:
   - Pearl Tower, Station Square (برج اللؤلؤة ميدان المحطة).
3. **Damietta Branch (دمياط)**:
   - Kafr Saad, above Ouf Ceramics (كفر سعد أعلى سيراميك عوف).
4. **Port Said Branch (بورسعيد)**:
   - Royal Fertility Center (مركز رويال للخصوبة).

---

## 🤖 AI Assistant (Featherless AI Engine)
- File: `src/utils/aiEngine.ts`
- Base URL: `https://api.featherless.ai/v1`
- Model: `Qwen/Qwen3-8B`
- Uses: Clinical decision support, SOAP note summaries, triage protocols, financial analytics, and interactive doctor assistant drawer.

---

## ⚙️ Essential Developer Commands
```powershell
# Run Development Server
npm run dev

# Build Production Bundle
npm run build

# Git One-Liner Commit & Push
git add .
git commit -m "feat: <description>"
git push origin main
```
