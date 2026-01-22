
"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bot, Mic, ArrowLeft } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Message } from '../types';

const aiService = new GeminiService();

const ChatContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isConfirmMode = searchParams.get('confirm') === 'true';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConfirmMode) {
      setMessages([
        { id: 'u1', role: 'user', text: '로맨틱한 데이트 코스 추천해줘' },
        {
          id: '1',
          role: 'assistant',
          text: '네, 동명동 위주로 로맨틱한 코스를 제안해 드릴게요!',
          isDecisionPoint: true
        }
      ]);
    } else {
      setMessages([
        { id: '1', role: 'assistant', text: '안녕하세요! 어떤 여행을 도와드릴까요?' }
      ]);
    }
  }, [isConfirmMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev.map(m => ({ ...m, isDecisionPoint: false })), userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.processRequest(input);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', text: '오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FDFDFD] flex flex-col font-['Inter'] overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-[100] border-b border-gray-50 shadow-sm">
        <button onClick={() => router.push('/survey')} className="p-1 -ml-1 text-gray-400">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">AI 가이드</h1>
        <div className="w-8" />
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 hide-scrollbar pb-60">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            {m.role === 'assistant' && (
              <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center shadow-lg mb-3">
                <Bot size={22} className="text-white" />
              </div>
            )}

            <div className={`p-5 rounded-[2rem] text-[15px] font-bold leading-relaxed max-w-[85%] shadow-sm ${m.role === 'user'
              ? 'bg-[#E9F1FF] text-[#1E6BFF] rounded-tr-none'
              : 'bg-[#F2F2F2] text-gray-800 rounded-tl-none'
              }`}>
              {m.text}
            </div>

            {/* Decision Point Card - Exact Image Match */}
            {m.isDecisionPoint && (
              <div className="mt-14 w-full bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-fade-in text-center z-10">
                <h4 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">이대로 코스를 생성할까요?</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/map')}
                    className="py-5 bg-[#1E6BFF] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all leading-tight"
                  >
                    네, 코스 생성하기<br />(종료)
                  </button>
                  <button
                    onClick={() => setMessages(prev => prev.map(msg => ({ ...msg, isDecisionPoint: false })))}
                    className="py-5 bg-[#A8A8A8] text-white rounded-2xl font-black text-sm active:scale-95 transition-all leading-tight"
                  >
                    아니요, 더 이야기할래요<br />(계속)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="p-4 bg-gray-50 rounded-2xl self-start animate-pulse text-xs font-bold text-gray-400">생각 중...</div>}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white absolute bottom-24 left-0 right-0 z-[110] border-t border-gray-50">
        <div className="flex items-center border-2 border-gray-100 rounded-[2rem] px-6 py-4 transition-all focus-within:border-blue-300">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="프롬프트를 입력하세요..."
            className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-base"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all shrink-0 ml-2"
          >
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ChatScreen = () => (
  <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center font-bold">대화창을 불러오는 중...</div>}>
    <ChatContent />
  </Suspense>
);
