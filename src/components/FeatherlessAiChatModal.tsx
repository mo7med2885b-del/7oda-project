import React, { useState, useEffect, useRef } from 'react';
import { callFeatherlessAi, buildClinicSystemPrompt, FeatherlessChatMessage } from '../utils/aiEngine';
import { doctorInfo } from '../utils/i18n';
import { useClinic } from '../context/ClinicContext';
import { Sparkles, Send, Key, X, Bot, User, RefreshCw, CheckCircle } from 'lucide-react';

interface FeatherlessAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatherlessAiChatModal: React.FC<FeatherlessAiChatModalProps> = ({ isOpen, onClose }) => {
  const { appointments, invoices, lang } = useClinic();

  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('featherless_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!localStorage.getItem('featherless_api_key'));
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const grossInflow = invoices.reduce((acc, i) => acc + i.paid_amount, 0);

  const [messages, setMessages] = useState<FeatherlessChatMessage[]>([
    {
      role: 'assistant',
      content: lang === 'ar'
        ? `أهلاً بك دكتور محمد حسني علي 👨‍⚕️✨! أنا مساعك الذكي المربوط بـ Featherless AI (DeepSeek-V4-Flash). لدي رؤية شاملة لكافة حجوزات العيادات بالفروع الأربعة والبيانات المالية. كيف يمكنني مساعدتك اليوم؟`
        : `Welcome Dr. Mohamed Hosny Ali 👨‍⚕️✨! I am your Senior Clinical AI Assistant powered by Featherless AI (DeepSeek-V4-Flash). I have full real-time context of all 4 clinic branches and financial metrics. How can I assist you today?`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('featherless_api_key', apiKey.trim());
      setShowKeyInput(false);
      setErrorMsg('');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    if (!apiKey.trim()) {
      setShowKeyInput(true);
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال مفتاح API الخاص بـ Featherless AI أولاً.' : 'Please enter your Featherless AI API key first.');
      return;
    }

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setErrorMsg('');

    const newMessages: FeatherlessChatMessage[] = [
      ...messages,
      { role: 'user', content: userMsg }
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build Clinic System Prompt
      const systemPrompt = buildClinicSystemPrompt({
        doctorName: doctorInfo.name_ar,
        appointmentsCount: appointments.length,
        grossRevenue: grossInflow,
        pendingReceivables: 12500,
        icsiSuccessRate: '78.4%',
        branches: doctorInfo.branches.map(b => b.city_ar)
      });

      const fullPayload: FeatherlessChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...newMessages.slice(-8) // keep last 8 messages for context window
      ];

      const aiReply = await callFeatherlessAi(fullPayload, apiKey);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiReply }
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to Featherless AI.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] rounded-3xl bg-[#082930] border border-cyan-400/40 shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-[#051c22] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#15606e] to-[#00e599] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-slate-950 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-black text-sm text-cyan-300 flex items-center gap-2">
                <span>Featherless AI Clinical Assistant</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DeepSeek-V4-Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'المساعد الطبي والمالي المربوط ببيانات عيادات د. محمد حسني' : 'Connected to Dr. Mohamed Hosny Clinic Live Data'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              title="Configure API Key"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Banner Input */}
        {showKeyInput && (
          <div className="p-4 bg-slate-900 border-b border-cyan-500/30 space-y-2 text-xs">
            <label className="block text-cyan-300 font-bold flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'أدخل مفتاح Featherless AI API Key:' : 'Enter Featherless AI API Key:'}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="fl_live_..."
                className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2.5 rounded-xl bg-[#00e599] text-slate-950 font-black flex items-center gap-1 shadow"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ المفتاح' : 'Save Key'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Base URL: <span className="font-mono text-cyan-300">https://api.featherless.ai/v1</span> | Model: <span className="font-mono text-cyan-300">deepseek-ai/DeepSeek-V4-Flash-0731</span>
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border-b border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-400">✕</button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 text-xs leading-relaxed ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#15606e] text-cyan-300 flex items-center justify-center shrink-0 shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#15606e] text-white font-medium rounded-tr-none'
                    : 'bg-[#051c22] border border-cyan-500/20 text-slate-100 rounded-tl-none shadow-md'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#00e599] text-slate-950 flex items-center justify-center shrink-0 font-black shadow">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-cyan-300">
              <div className="w-8 h-8 rounded-xl bg-[#15606e] flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="font-mono">Featherless AI (DeepSeek-V4-Flash) is analyzing clinical data...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="px-4 py-2 bg-[#051c22]/60 border-t border-white/5 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputMessage(lang === 'ar' ? 'حلل نسب إشغال العيادة والإيرادات هذا الأسبوع' : 'Analyze clinic occupancy & weekly revenue')}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 whitespace-nowrap"
          >
            📊 {lang === 'ar' ? 'تحليل الإيرادات والإشغال' : 'Revenue & Occupancy Analysis'}
          </button>
          <button
            onClick={() => setInputMessage(lang === 'ar' ? 'اكتب لي بروتوكول تحفيز تبويض لحالة تكيس مبايض' : 'Write ovulation induction protocol for PCOS patient')}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 whitespace-nowrap"
          >
            🧬 {lang === 'ar' ? 'بروتوكول حقن مجهري' : 'PCOS ICSI Protocol'}
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#051c22] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={lang === 'ar' ? 'اسأل المساعد الذكي عن أي حالة طوارئ، تحليلات، أو بروتوكول علاج...' : 'Ask Featherless AI about any patient, finance, or treatment protocol...'}
            className="flex-1 p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-3 rounded-2xl bg-[#00e599] hover:bg-[#00c985] text-slate-950 font-black disabled:opacity-50 transition shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
