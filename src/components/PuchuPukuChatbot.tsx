import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart, Volume2, Bot, User, RefreshCw, Smile } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export const PuchuPukuChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Nomoshkar! I am Puchu, and this is my glowing mug friend Puku! 🍵💖 Welcome to our sunny Bangladeshi courtyard. Whether you're practicing Pre-K numbers, learning Bengali words, or looking for a warm tea-break sticker for a coworker, we are so happy to explore together!",
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      const assistantReply = data.reply || "Puku's heart glows warm golden-pink! 'Ding-ling! We are always here to share tea and learning with you!'";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: assistantReply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'assistant',
          text: "Puchu smiles gently and pours warm tea: 'Grandma always says, good things take patience. Let us take a deep breath together!'",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const presetPrompts = [
    '🍵 Coworker kindness quote',
    '🔢 US Pre-K Counting lesson',
    '💖 Why does Puku glow?',
    '🌿 Bengali word of the day',
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Puchu & Puku AI Companion"
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 hover:from-emerald-800 hover:to-amber-800 text-white font-semibold shadow-xl hover:shadow-2xl transition duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400"
        >
          <div className="relative">
            <span className="text-xl">🍵</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 absolute -top-1 -right-1 fill-rose-400 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-serif tracking-wide hidden sm:inline">
            Chat with Puchu & Puku
          </span>
          <span className="sm:hidden text-xs font-serif font-bold">Chat</span>
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[80vh] h-[580px] bg-white rounded-3xl shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white p-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-xl shadow-inner relative overflow-hidden shrink-0">
                <span>🍵</span>
                <Heart className="w-3 h-3 text-rose-500 absolute -top-0.5 -right-0.5 fill-rose-500 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Puchu & Puku Companion</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <p className="text-[11px] text-emerald-200">
                  Pre-K Educator & Workplace Kindness Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(messages.slice(0, 1))}
                title="Restart Chat"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2.5 bg-amber-50/80 border-b border-amber-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] shrink-0">
            {presetPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-white text-stone-700 hover:bg-emerald-100 hover:text-emerald-900 border border-amber-300 font-medium whitespace-nowrap transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                      isUser ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <span>🍵</span>}
                  </div>

                  <div
                    className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs relative group ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-xs'
                        : 'bg-white text-stone-800 border border-amber-200/80 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className="mt-2 text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold transition"
                        title="Speak reply"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? 'text-rose-500 animate-pulse' : ''}`} />
                        <span>{speakingId === msg.id ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 text-xs">
                  <span>🍵</span>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-amber-200 text-xs text-stone-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="font-serif text-emerald-800">Puku is warming up tea...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-amber-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Pre-K lessons, stickers, or Bengali words..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
