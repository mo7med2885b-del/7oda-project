import React, { useState, useEffect, useRef } from 'react';
import { callFeatherlessAi, buildClinicSystemPrompt, FeatherlessChatMessage } from '../utils/aiEngine';
import { useClinic } from '../context/ClinicContext';
import { Sparkles, Send, X, Bot, User, RefreshCw } from 'lucide-react';

interface FeatherlessAiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
}

export const FeatherlessAiChatDrawer: React.FC<FeatherlessAiChatDrawerProps> = ({ isOpen, onClose, initialPrompt }) => {
  const { lang, appointments } = useClinic();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [messages, setMessages] = useState<FeatherlessChatMessage[]>([
    {
      role: 'assistant',
      content: lang === 'ar'
        ? `مرحباً د. محمد حسني 👨‍⚕️! أنا مساعدك الطبي الذكي. لدي رؤية كاملة لجدول مواعيدك اليوم وقاعدة بيانات العيادة. كيف يمكنني مساعدتك؟`
        : `Welcome Dr. Mohamed Hosny 👨‍⚕️! I have full real-time access to today's appointments and clinic records. How can I assist you?`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedPrompt = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Initial Prompt Auto-Execution
  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt !== lastProcessedPrompt.current) {
      lastProcessedPrompt.current = initialPrompt;
      sendQuery(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    setErrorMsg('');
    const newMessages: FeatherlessChatMessage[] = [
      ...messages,
      { role: 'user', content: queryText }
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    const msg = inputMessage.trim();
    setInputMessage('');
    sendQuery(msg);
  };

  // Helper to Render Markdown (Bold, Lists, Headers) inside AI Chat Bubbles
  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-xs text-[#00cb87] mt-1.5 mb-1">{parseBold(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-extrabold text-xs text-[#00cb87] mt-2 mb-1">{parseBold(line.replace('## ', ''))}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="font-black text-sm text-[#00cb87] mt-2 mb-1">{parseBold(line.replace('# ', ''))}</h2>;
      }

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim())) {
        const listContent = line.trim().replace(/^(\*|-|\d+\.)\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 pr-2 rtl:pr-2 rtl:pl-0">
            <span className="text-[#00cb87] font-bold shrink-0">•</span>
            <span>{parseBold(listContent)}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }

      return <div key={idx} className="my-0.5 leading-relaxed">{parseBold(line)}</div>;
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-[#00cb87]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#00261c] border-l border-[#00cb87]/30 shadow-2xl flex flex-col text-white transition-all transform duration-300">
      {/* Clean Drawer Header */}
      <div className="p-4 bg-[#001c15] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00cb87] text-slate-950 flex items-center justify-center font-bold shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#00cb87]">
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
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#00473e] text-[#00cb87] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-[#00473e] text-white font-medium rounded-tr-none'
                  : 'bg-[#001c15] border border-[#00cb87]/20 text-slate-100 rounded-tl-none shadow'
              }`}
            >
              {msg.role === 'assistant' ? renderMarkdownContent(msg.content) : msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#00cb87] text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#00cb87] p-2 bg-[#001c15] rounded-xl border border-[#00cb87]/20 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="font-mono text-[11px]">{lang === 'ar' ? 'جارِ التحليل والرد بالذكاء الاصطناعي...' : 'AI analyzing request...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#001c15] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={lang === 'ar' ? 'اكتب سؤالك (مثال: تحليل الملف أو المواعيد)...' : 'Type your query here...'}
          className="flex-1 p-2.5 rounded-xl bg-[#00261c] border border-[#00cb87]/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00cb87]"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="p-2.5 rounded-xl bg-[#00cb87] hover:bg-[#00b074] text-slate-950 font-black disabled:opacity-50 transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
