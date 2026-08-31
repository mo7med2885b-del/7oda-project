import React, { useState, useEffect, useRef } from 'react';
import { callFeatherlessAi, buildClinicSystemPrompt, FeatherlessChatMessage } from '../utils/aiEngine';
import { useClinic } from '../context/ClinicContext';
import { Sparkles, Send, X, Bot, User, RefreshCw } from 'lucide-react';

interface FeatherlessAiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatherlessAiChatDrawer: React.FC<FeatherlessAiChatDrawerProps> = ({ isOpen, onClose }) => {
  const { lang, appointments } = useClinic();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [messages, setMessages] = useState<FeatherlessChatMessage[]>([
    {
      role: 'assistant',
      content: lang === 'ar'
        ? `مرحباً د. محمد حسني 👨‍⚕️! أنا مساعدك الطبي الذكي. لدي رؤية كاملة لجدول مواعيدك اليوم. كيف يمكنني مساعدتك؟`
        : `Welcome Dr. Mohamed Hosny 👨‍⚕️! I have full real-time access to today's appointments. How can I assist you?`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

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
      const todayDateStr = new Date().toISOString().split('T')[0];
      const systemPrompt = buildClinicSystemPrompt(appointments, todayDateStr);

      const fullPayload: FeatherlessChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...newMessages.slice(-8)
      ];

      const aiReply = await callFeatherlessAi(fullPayload);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiReply }
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال بالمساعد الطبي.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#082930] border-l border-cyan-400/30 shadow-2xl flex flex-col text-white transition-all transform duration-300">
      {/* Clean Drawer Header */}
      <div className="p-4 bg-[#051c22] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-cyan-300">
              {lang === 'ar' ? 'المساعد الطبي الذكي' : 'Clinical AI Co-Pilot'}
            </h3>
            <p className="text-[11px] text-slate-300">
              {lang === 'ar' ? 'عيادات د. محمد حسني علي' : 'Dr. Mohamed Hosny Clinic'}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-2.5 bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-between border-b border-rose-500/30">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg('')}>✕</button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-2.5 leading-relaxed ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#15606e] text-cyan-300 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#15606e] text-white font-medium rounded-tr-none'
                  : 'bg-[#051c22] border border-cyan-500/20 text-slate-100 rounded-tl-none shadow'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#00e599] text-slate-950 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="font-mono text-[11px]">{lang === 'ar' ? 'جارِ التحقق من الجدول والرد...' : 'Checking calendar & replying...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#051c22] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={lang === 'ar' ? 'اكتب سؤالك (مثال: ايه مواعيد النهاردة)...' : 'Type a question (e.g., today\'s schedule)...'}
          className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="p-2.5 rounded-xl bg-[#00e599] hover:bg-[#00c985] text-slate-950 font-black disabled:opacity-50 transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
