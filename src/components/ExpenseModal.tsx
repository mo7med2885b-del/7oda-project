import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { ExpenseCategory } from '../types';
import { X, DollarSign } from 'lucide-react';

interface ExpenseModalProps {
  onClose: () => void;
}

const CATEGORY_LABEL: Record<ExpenseCategory, { en: string; ar: string }> = {
  'Staff Salaries': { en: 'Staff Salaries', ar: 'رواتب الموظفين' },
  'Medical Supplies': { en: 'Medical Supplies', ar: 'مستلزمات طبية' },
  Utilities: { en: 'Utilities', ar: 'مرافق (كهرباء/مياه)' },
  Rent: { en: 'Rent', ar: 'إيجار' },
  'Equipment Maintenance': { en: 'Equipment Maintenance', ar: 'صيانة الأجهزة' },
  Marketing: { en: 'Marketing', ar: 'تسويق' },
  'Software & IT': { en: 'Software & IT', ar: 'برمجيات وتقنية' },
  Miscellaneous: { en: 'Miscellaneous', ar: 'متنوعة' }
};

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose }) => {
  const { addExpense, lang } = useClinic();
  const isAr = lang === 'ar';

  const [category, setCategory] = useState<ExpenseCategory>('Medical Supplies');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [vendor, setVendor] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  const field =
    'w-full min-h-[44px] p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15';
  const label = 'block text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-1.5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !vendor) {
      alert(isAr ? 'الوصف والمبلغ والمورّد حقول إلزامية.' : 'Description, amount, and vendor are required.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    addExpense({
      category,
      description,
      amount: Number(amount),
      payment_method: paymentMethod,
      vendor,
      receipt_url: receiptUrl,
      expense_date: todayStr
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#C6D2E2] dark:border-white/10 pb-3">
          <h3 className="text-xl font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-500" aria-hidden="true" />
            {isAr ? 'تسجيل مصروف تشغيلي' : 'Record Clinic Operating Expense (Outflow)'}
          </h3>
          <button
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="min-w-[44px] min-h-[44px] rounded-lg text-[#7C7C7C] hover:text-rose-500 hover:bg-rose-500/10 transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className={label} htmlFor="exp-cat">{isAr ? 'فئة المصروف *' : 'Expense Category *'}</label>
            <select id="exp-cat" value={category} onChange={e => setCategory(e.target.value as any)} className={`${field} font-bold`}>
              {(Object.keys(CATEGORY_LABEL) as ExpenseCategory[]).map(c => (
                <option key={c} value={c}>{isAr ? CATEGORY_LABEL[c].ar : CATEGORY_LABEL[c].en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} htmlFor="exp-desc">{isAr ? 'الوصف *' : 'Description *'}</label>
            <input
              id="exp-desc"
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={isAr ? 'مثال: مستلزمات تعقيم وقفازات' : 'e.g., Autoclave pouches & sterile gloves restock'}
              className={field}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="exp-amount">{isAr ? 'المبلغ (ج.م) *' : 'Amount (EGP) *'}</label>
              <input
                id="exp-amount"
                type="number"
                required
                min={0}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className={`${field} font-mono font-bold`}
                dir="ltr"
              />
            </div>

            <div>
              <label className={label} htmlFor="exp-method">{isAr ? 'طريقة الدفع' : 'Payment Method'}</label>
              <select id="exp-method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={field}>
                <option value="Credit Card">{isAr ? 'بطاقة ائتمان' : 'Credit Card'}</option>
                <option value="Bank Transfer">{isAr ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                <option value="Cash">{isAr ? 'نقدي' : 'Cash'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="exp-vendor">{isAr ? 'اسم المورّد *' : 'Vendor / Supplier Name *'}</label>
            <input
              id="exp-vendor"
              type="text"
              required
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              placeholder={isAr ? 'مثال: الجمهورية للمستلزمات الطبية' : 'e.g., Al-Gomhoria Medical Supplies'}
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor="exp-receipt">{isAr ? 'رابط صورة الإيصال (اختياري)' : 'Receipt Image URL (Optional)'}</label>
            <input
              id="exp-receipt"
              type="text"
              value={receiptUrl}
              onChange={e => setReceiptUrl(e.target.value)}
              placeholder="https://..."
              className={field}
              dir="ltr"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#C6D2E2] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-lg text-[#7C7C7C] dark:text-slate-400 font-semibold hover:text-[#2C3137] dark:hover:text-white transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-xl bg-rose-500 text-white font-black shadow-lg hover:bg-rose-600 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
            >
              {isAr ? 'تسجيل المصروف' : 'Record Expense Outflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
