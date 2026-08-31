import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateFinancialAdvisorInsights } from '../utils/aiEngine';
import { X, Sparkles, AlertTriangle, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

interface AiFinancialAdvisorModalProps {
  onClose: () => void;
}

export const AiFinancialAdvisorModal: React.FC<AiFinancialAdvisorModalProps> = ({ onClose }) => {
  const { invoices, expenses } = useClinic();
  const insights = generateFinancialAdvisorInsights(invoices, expenses);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl dark:bg-[#00182e] bg-white border dark:border-[#00d9ff]/40 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#00101f] via-[#00182e] to-[#00284c] text-white flex items-center justify-between border-b border-[#00d9ff]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00d9ff] to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">
                AI Feature 2: Executive Financial Advisor
              </h2>
              <p className="text-xs text-cyan-300">Mohamed Hosny Clinic Cash Flow & Profitability Audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Executive Overview Box */}
          <div className="p-4 rounded-xl bg-[#00101f] border border-[#00d9ff]/30 space-y-2">
            <div className="text-[10px] font-bold text-[#00d9ff] uppercase tracking-wider">
              Cash Flow Executive Summary
            </div>
            <div className="text-sm font-semibold text-white leading-relaxed">{insights.cash_flow_summary}</div>
          </div>

          {/* Warnings & Leakage */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Expense Leakage & Collection Risks</span>
            </h4>
            <div className="space-y-2">
              {insights.leakage_warnings.map((w, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Forecast (Next Month)</span>
            </h4>
            <p className="text-emerald-200 font-semibold">{insights.revenue_projections}</p>
          </div>

          {/* Growth Action Plan */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
              Recommended Financial Optimization Steps
            </h4>
            <div className="space-y-2">
              {insights.growth_recommendations.map((rec, i) => (
                <div key={i} className="p-3 rounded-xl dark:bg-[#00101f] bg-slate-50 border border-slate-200 dark:border-[#00d9ff]/20 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00d9ff] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-200 text-slate-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-slate-950 font-black text-xs"
          >
            Close Financial Report
          </button>
        </div>
      </div>
    </div>
  );
};
