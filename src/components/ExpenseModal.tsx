import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { ExpenseCategory } from '../types';
import { X, DollarSign, Upload } from 'lucide-react';

interface ExpenseModalProps {
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose }) => {
  const { addExpense } = useClinic();

  const [category, setCategory] = useState<ExpenseCategory>('Medical Supplies');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [vendor, setVendor] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !vendor) {
      alert('Description, amount, and vendor are required.');
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

    alert('Operating expense logged successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl dark:bg-[#00182e] bg-white border dark:border-[#00d9ff]/30 border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
          <h3 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-rose-400" />
            Record Clinic Operating Expense (Outflow)
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Expense Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white font-bold"
            >
              <option value="Staff Salaries">Staff Salaries</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Equipment Maintenance">Equipment Maintenance</option>
              <option value="Marketing">Marketing</option>
              <option value="Software & IT">Software & IT</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Description *</label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Autoclave pouches & sterile gloves restock"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Amount (EGP) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Vendor / Supplier Name *</label>
            <input
              type="text"
              required
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              placeholder="e.g., Al-Gomhoria Medical Supplies"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Receipt Image URL (Optional)</label>
            <input
              type="text"
              value={receiptUrl}
              onChange={e => setReceiptUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-extrabold shadow-lg hover:bg-rose-500 transition"
            >
              Record Expense Outflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
