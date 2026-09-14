import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { PaymentMethod, PaymentStatus } from '../types';
import { X, Plus, Trash2, DollarSign } from 'lucide-react';

interface InvoiceModalProps {
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose }) => {
  const { patients, addInvoice, lang } = useClinic();
  const isAr = lang === 'ar';

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState<{ id: string; description: string; quantity: number; unit_price: number }[]>([
    { id: '1', description: isAr ? 'كشف واستشارة طبية' : 'Consultation & Specialist Examination', quantity: 1, unit_price: 500 }
  ]);

  const selectedPatient = patients.find(p => p.id === patientId);

  const addItemRow = () => {
    setItems(prev => [...prev, { id: `item-${Date.now()}`, description: '', quantity: 1, unit_price: 250 }]);
  };

  const removeItemRow = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.quantity * curr.unit_price, 0);
  const totalAmount = Math.max(0, subtotal - discount);

  const field =
    'w-full min-h-[44px] p-2.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] border border-[#C6D2E2] dark:border-[#6AB8FF]/25 text-sm text-[#2C3137] dark:text-white focus:outline-none focus:border-[#6AB8FF] focus:ring-4 focus:ring-[#6AB8FF]/15';
  const label = 'block text-xs font-semibold text-[#2C3137] dark:text-slate-200 mb-1.5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert(isAr ? 'يرجى اختيار مريضة.' : 'Please select a patient.');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    addInvoice({
      patient_id: patientId,
      patient_name: selectedPatient.full_name,
      subtotal,
      discount,
      tax: 0,
      total_amount: totalAmount,
      paid_amount: paymentStatus === 'Paid' ? totalAmount : paymentStatus === 'Partially Paid' ? Math.round(totalAmount / 2) : 0,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      items: items.map(i => ({
        id: i.id,
        description: i.description,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        total_price: i.quantity * i.unit_price
      })),
      due_date: dueDate.toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#2C3137] border border-[#C6D2E2] dark:border-[#6AB8FF]/30 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#C6D2E2] dark:border-white/10 pb-3">
          <h3 className="text-xl font-bold text-[#2C3137] dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#6AB8FF]" aria-hidden="true" />
            {isAr ? 'إصدار فاتورة جديدة' : 'Issue New Patient Invoice'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="inv-patient">{isAr ? 'اختر المريضة *' : 'Select Patient *'}</label>
              <select id="inv-patient" value={patientId} onChange={e => setPatientId(e.target.value)} className={`${field} font-bold`}>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label} htmlFor="inv-method">{isAr ? 'طريقة الدفع' : 'Payment Method'}</label>
              <select id="inv-method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className={field}>
                <option value="Cash">{isAr ? 'نقدي' : 'Cash'}</option>
                <option value="Credit Card">{isAr ? 'بطاقة ائتمان' : 'Credit Card'}</option>
                <option value="Bank Transfer">{isAr ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                <option value="Insurance Split">{isAr ? 'تأمين' : 'Insurance Split'}</option>
              </select>
            </div>

            <div>
              <label className={label} htmlFor="inv-status">{isAr ? 'حالة الدفع' : 'Payment Status'}</label>
              <select id="inv-status" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as any)} className={`${field} font-bold`}>
                <option value="Paid">{isAr ? 'مدفوعة بالكامل' : 'Paid (Full)'}</option>
                <option value="Partially Paid">{isAr ? 'مدفوعة جزئياً' : 'Partially Paid'}</option>
                <option value="Draft">{isAr ? 'معلقة' : 'Draft / Pending'}</option>
              </select>
            </div>

            <div>
              <label className={label} htmlFor="inv-discount">{isAr ? 'الخصم (ج.م)' : 'Discount (EGP)'}</label>
              <input
                id="inv-discount"
                type="number"
                min={0}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className={field}
                dir="ltr"
              />
            </div>
          </div>

          {/* Itemized Services Breakdown */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#2C3137] dark:text-white">{isAr ? 'بنود الفاتورة' : 'Itemized Services & Diagnostics'}</h4>
              <button
                type="button"
                onClick={addItemRow}
                className="min-h-[44px] px-3 rounded-lg text-[#6AB8FF] font-bold text-sm flex items-center gap-1.5 hover:bg-[#6AB8FF]/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6AB8FF]"
              >
                <Plus className="w-4 h-4" aria-hidden="true" /> {isAr ? 'إضافة بند' : 'Add Line Item'}
              </button>
            </div>

            {items.map(item => (
              <div key={item.id} className="grid grid-cols-3 sm:grid-cols-6 gap-2 items-center">
                <input
                  type="text"
                  placeholder={isAr ? 'وصف الخدمة' : 'Service description'}
                  value={item.description}
                  onChange={e => {
                    const v = e.target.value;
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, description: v } : i)));
                  }}
                  className={`${field} col-span-3`}
                />
                <input
                  type="number"
                  placeholder={isAr ? 'العدد' : 'Qty'}
                  value={item.quantity}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, quantity: v } : i)));
                  }}
                  className={`${field} font-mono`}
                  dir="ltr"
                />
                <input
                  type="number"
                  placeholder={isAr ? 'السعر' : 'Price'}
                  value={item.unit_price}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, unit_price: v } : i)));
                  }}
                  className={`${field} font-mono`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => removeItemRow(item.id)}
                  aria-label={isAr ? 'حذف البند' : 'Remove item'}
                  className="min-w-[44px] min-h-[44px] rounded-lg text-rose-500 hover:bg-rose-500/10 justify-self-center flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FCFDFF] dark:bg-[#22262B] flex items-center justify-between font-mono text-sm">
            <span className="font-bold text-[#7C7C7C] dark:text-slate-400">{isAr ? 'إجمالي الفاتورة:' : 'Total Invoice Amount:'}</span>
            <span className="font-black text-[#6AB8FF]" dir="ltr">EGP {totalAmount.toFixed(2)}</span>
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
              className="min-h-[44px] px-5 rounded-xl bg-[#6AB8FF] hover:bg-[#4FA5F5] text-white font-black shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6AB8FF]/30"
            >
              {isAr ? 'إصدار الفاتورة' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
