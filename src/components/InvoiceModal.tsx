import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { PaymentMethod, PaymentStatus } from '../types';
import { X, Plus, Trash2, DollarSign } from 'lucide-react';

interface InvoiceModalProps {
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose }) => {
  const { patients, appointments, addInvoice } = useClinic();

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState<{ id: string; description: string; quantity: number; unit_price: number }[]>([
    { id: '1', description: 'Consultation & Specialist Examination', quantity: 1, unit_price: 500 }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
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

    alert('Invoice created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl dark:bg-[#00182e] bg-white border dark:border-[#00d9ff]/30 border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
          <h3 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#00d9ff]" />
            Issue New Patient Invoice
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Select Patient *</label>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white font-bold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Insurance Split">Insurance Split</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white font-bold"
              >
                <option value="Paid">Paid (Full)</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Draft">Draft / Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Discount (EGP)</label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Itemized Services Breakdown */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold dark:text-white">Itemized Services & Diagnostics</h4>
              <button type="button" onClick={addItemRow} className="text-[#00d9ff] font-bold text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            {items.map(item => (
              <div key={item.id} className="grid grid-cols-6 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Service description"
                  value={item.description}
                  onChange={e => {
                    const v = e.target.value;
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, description: v } : i)));
                  }}
                  className="col-span-3 p-2 rounded bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, quantity: v } : i)));
                  }}
                  className="p-2 rounded bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unit_price}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, unit_price: v } : i)));
                  }}
                  className="p-2 rounded bg-slate-50 dark:bg-[#00101f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <button type="button" onClick={() => removeItemRow(item.id)} className="text-rose-400 justify-self-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#00101f] flex items-center justify-between font-mono text-sm">
            <span className="font-bold text-slate-500">Total Invoice Amount:</span>
            <span className="font-black text-[#00d9ff]">EGP {totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#00d9ff] text-slate-950 font-black shadow-lg"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
