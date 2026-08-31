import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { printInvoice } from '../utils/pdfGenerator';
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Printer,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileText,
  Trash2
} from 'lucide-react';

interface FinancialHubProps {
  onOpenNewInvoice: () => void;
  onOpenNewExpense: () => void;
  onOpenAiAdvisor: () => void;
}

export const FinancialHub: React.FC<FinancialHubProps> = ({ onOpenNewInvoice, onOpenNewExpense, onOpenAiAdvisor }) => {
  const { invoices, expenses, updateInvoiceStatus, deleteExpense, t, lang } = useClinic();

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    return inv.patient_name.toLowerCase().includes(q) || inv.invoice_number.toLowerCase().includes(q);
  });

  const totalInflowPaid = invoices
    .filter(i => i.payment_status === 'Paid' || i.payment_status === 'Partially Paid')
    .reduce((acc, curr) => acc + curr.paid_amount, 0);

  const totalReceivables = invoices
    .filter(i => i.payment_status !== 'Paid' && i.payment_status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.total_amount - curr.paid_amount), 0);

  const totalOutflow = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalInflowPaid - totalOutflow;

  // Revenue Oversight & Anti-Theft Calculations
  const expectedRevenue = invoices
    .filter(i => i.payment_status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const totalDiscountsGiven = invoices
    .filter(i => i.payment_status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.discount_amount || 0), 0);

  const discountedInvoices = invoices.filter(
    i => (i.discount_amount || 0) > 0 && i.payment_status !== 'Cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#0284c7]" />
            {t('financial_hub_title')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('financial_hub_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAdvisor}
            className="px-4 py-2 rounded-xl bg-[#FF5F03] text-white font-black text-xs hover:brightness-110 shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('analyze_cash_flow')}</span>
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="px-3.5 py-2 rounded-xl bg-[#072c2c] text-white font-extrabold text-xs hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#FF5F03]" />
            <span>{t('new_invoice')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{t('total_inflow')}</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            EGP {totalInflowPaid.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{t('total_outflow')}</span>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            EGP {totalOutflow.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{t('net_profit')}</span>
          <div className={`text-2xl font-black font-mono ${netProfit >= 0 ? 'text-[#0284c7] dark:text-[#00d9ff]' : 'text-rose-600'}`}>
            EGP {netProfit.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{t('accounts_receivable')}</span>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            EGP {totalReceivables.toLocaleString()}
          </div>
        </div>
      </div>

      {/* REVENUE OVERSIGHT & AUDIT SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#00182e]/80 border-2 border-amber-200 dark:border-amber-900/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-amber-600 dark:text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {lang === 'ar' ? 'تدقيق الإيرادات والخصومات (Revenue Oversight)' : 'Revenue Oversight & Audit'}
          </h3>
          <div className="flex gap-4 text-xs font-bold font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="block text-[9px] uppercase text-slate-400">Expected (بدون خصم)</span>
              EGP {expectedRevenue.toLocaleString()}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <span className="block text-[9px] uppercase">Total Discrepancy / Discounts</span>
              - EGP {totalDiscountsGiven.toLocaleString()}
            </div>
          </div>
        </div>

        {discountedInvoices.length > 0 ? (
          <div className="overflow-x-auto border border-amber-100 dark:border-amber-900/30 rounded-xl">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-amber-50/50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                  <th className="py-2 px-3">Invoice</th>
                  <th className="py-2 px-3">Patient</th>
                  <th className="py-2 px-3 text-center">Expected Price</th>
                  <th className="py-2 px-3 text-center">Discount</th>
                  <th className="py-2 px-3">Discount Reason (Justification)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50 dark:divide-amber-900/20 text-xs">
                {discountedInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition">
                    <td className="py-2 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{inv.invoice_number}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{inv.patient_name}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 line-through">EGP {inv.total_amount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-mono font-black text-rose-500">- EGP {inv.discount_amount?.toFixed(2)}</td>
                    <td className="py-2 px-3 text-amber-800 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-amber-900/20">{inv.discount_reason || 'بدون سبب! (تحذير)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>لا توجد أي خصومات مسجلة. الإيرادات الفعلية تطابق الإيرادات المتوقعة تماماً.</span>
          </div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#00182e]/80 border border-slate-200 dark:border-[#00d9ff]/15 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('invoices_billing')}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#00d9ff]/15 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">{t('invoice_no')}</th>
                <th className="py-3 px-3">{t('patient_name')}</th>
                <th className="py-3 px-3">{t('method')}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t('total')}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t('paid')}</th>
                <th className="py-3 px-3 text-center">{t('status')}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-[#00284c]/50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#0284c7] dark:text-[#00d9ff]">{inv.invoice_number}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{inv.patient_name}</td>
                  <td className="py-3 px-3 text-slate-500">{inv.payment_method}</td>
                  <td className="py-3 px-3 text-right rtl:text-left font-mono font-bold">EGP {inv.total_amount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right rtl:text-left font-mono font-bold text-emerald-600">EGP {inv.paid_amount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right rtl:text-left">
                    <button
                      onClick={() => printInvoice(inv)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#00101f] text-slate-700 dark:text-slate-300 hover:text-[#0284c7]"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
