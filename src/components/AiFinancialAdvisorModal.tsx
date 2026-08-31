import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateFinancialAdvisorInsights } from '../utils/aiEngine';
import { X, Sparkles, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface AiFinancialAdvisorModalProps {
  onClose: () => void;
  onOpenAiPrompt?: (prompt: string) => void;
}

export const AiFinancialAdvisorModal: React.FC<AiFinancialAdvisorModalProps> = ({ onClose, onOpenAiPrompt }) => {
  const { invoices, expenses } = useClinic();
  const insights = generateFinancialAdvisorInsights(invoices, expenses);

  const handleAskAiDrawer = () => {
    if (!onOpenAiPrompt) return;
    const prompt = `قم بتحليل الأداء المالي والسيولة النقدية لعيادات د. محمد حسني:\n• ملخص التدفق النقدي: ${insights.cash_flow_summary}\n• توقعات الإيرادات: ${insights.revenue_projections}\nقدم توصيات عملية مفصلة بالخطوات لزيادة الإيرادات وترشيد المصروفات.`;
    onOpenAiPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl rounded-2xl dark:bg-[#00261c] bg-[#f5f2eb] border dark:border-[#00cb87]/40 border-[#00473e]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#001c15] text-white flex items-center justify-between border-b border-[#00cb87]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00cb87] flex items-center justify-center text-slate-950 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Executive Financial Advisor
              </h2>
              <p className="text-xs text-[#00cb87] font-bold">Mohamed Hosny Clinic Cash Flow & Profitability Audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Executive Overview Box */}
          <div className="p-4 rounded-2xl bg-[#001c15] border border-[#00cb87]/40 space-y-2 text-white shadow-md">
            <div className="text-[10px] font-bold text-[#00cb87] uppercase tracking-wider">
              Cash Flow Executive Summary
            </div>
            <div className="text-sm font-bold text-white leading-relaxed font-mono" dir="ltr">
              {insights.cash_flow_summary}
            </div>
          </div>

          {/* Warnings & Leakage */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Expense Leakage & Collection Risks</span>
            </h4>
            <div className="space-y-2">
              {insights.leakage_warnings.map((w, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-200 font-bold leading-relaxed">
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Projections (High Contrast Crisp Emerald Card) */}
          <div className="p-4.5 rounded-2xl bg-[#00473e] text-white border border-[#00cb87]/50 shadow-md space-y-2">
            <h4 className="font-extrabold text-[#00cb87] flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-4 h-4 text-[#00cb87]" />
              <span>Revenue Forecast (Next Month)</span>
            </h4>
            <p className="text-white font-bold text-xs leading-relaxed" dir="ltr">
              {insights.revenue_projections}
            </p>
          </div>

          {/* Growth Action Plan */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#122620] dark:text-white text-xs">
              Recommended Financial Optimization Steps
            </h4>
            <div className="space-y-2">
              {insights.growth_recommendations.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-xl dark:bg-[#001c15] bg-white border border-[#e3ded5] dark:border-[#00cb87]/20 flex items-start gap-2.5 shadow-sm" dir="ltr">
                  <CheckCircle className="w-4.5 h-4.5 text-[#00cb87] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-100 text-[#122620] font-bold text-xs leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-[#001c15] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onOpenAiPrompt && (
            <button
              onClick={handleAskAiDrawer}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>متابعة التحليل بالتفصيل في الشات</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition text-center"
          >
            إغلاق التقرير
          </button>
        </div>
      </div>
    </div>
  );
};
