'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import Image from 'next/image';
import { BRAND } from '@/lib/brand';

type Message = { role: 'user' | 'assistant'; text: string };

const GREETING_TEXT = 'Hi 👋 How can I help you today?';
const GREETING: Message = {
  role: 'assistant',
  text: GREETING_TEXT,
};

function TypingDots({ className = 'text-white' }: { className?: string }) {
  return (
    <span className={`inline-flex gap-1 items-center ${className}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-90 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
      <span className="w-2 h-2 rounded-full bg-current opacity-90 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
      <span className="w-2 h-2 rounded-full bg-current opacity-90 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
    </span>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const [bubbleTyping, setBubbleTyping] = useState(true);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // First load: show typing then greeting in the floating bubble
  useEffect(() => {
    const t = setTimeout(() => {
      setBubbleTyping(false);
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const openChat = () => {
    setShowGreetingBubble(false);
    setBubbleDismissed(true);
    if (messages.length === 0) setMessages([GREETING]);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const closeChat = () => {
    setIsOpen(false);
    setShowGreetingBubble(true);
    setBubbleTyping(false);
  };

  const dismissBubbleOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleDismissed(true);
    setShowGreetingBubble(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => (prev.length === 0 ? [GREETING] : prev).concat({ role: 'user', text }));
    setLoading(true);
    try {
      const history = messages
        .filter((m) => m.role !== 'assistant' || m.text !== GREETING_TEXT)
        .map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Sorry, I couldn't get a response. ${msg} Please try again or contact us via the Contact page.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showFloatingBubble = showGreetingBubble && !bubbleDismissed && !isOpen;

  return (
    <>
      {/* Floating area: typing bubble + avatar (single icon) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-end gap-0">
          {/* Greeting bubble: shows typing dots then greeting text */}
          {showFloatingBubble && (
            <div
              className="relative mr-3 rounded-2xl px-4 py-3 shadow-xl text-white max-w-[260px]"
              style={{ background: '#1a1a1a' }}
              role="button"
              tabIndex={0}
              onClick={openChat}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openChat();
              }}
            >
              <button
                onClick={dismissBubbleOnly}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="pr-6 pt-1 min-h-[24px]">
                {bubbleTyping ? <TypingDots /> : GREETING_TEXT}
              </div>
              <div
                className="absolute -right-2 bottom-5 w-4 h-4 rotate-45"
                style={{ background: '#1a1a1a' }}
                aria-hidden
              />
            </div>
          )}

          <div className="flex flex-col items-end gap-3">
            <a
              href="https://wa.me/917310400944"
              target="_blank"
              rel="noopener noreferrer"
              className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden shadow-xl ring-2 ring-black/10 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Chat on WhatsApp"
            >
              <Image
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                fill
                className="object-cover"
                sizes="48px"
              />
            </a>

            {/* Avatar (single) */}
            <button
              onClick={openChat}
              className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xl ring-2 ring-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:ring-2 hover:ring-(--leaf-500) transition-all"
              style={{ borderColor: 'var(--leaf-200)' }}
              aria-label="Open chat"
            >
              <Image
                src="/farmer.jpg"
                alt="Chat"
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"
                title="Online"
              />
            </button>
          </div>
        </div>
      )}

      {/* Full chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl shadow-2xl border-2 overflow-hidden flex flex-col bg-white" style={{ maxHeight: '70vh', borderColor: 'var(--leaf-200)' }}>
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))' }}>
            <span className="font-semibold">{BRAND.shortName}</span>
            <button onClick={closeChat} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[40vh] scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <div
                    className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2 text-sm text-white"
                    style={{ backgroundColor: 'var(--leaf-600)' }}
                  >
                    {m.text}
                  </div>
                ) : (
                  <div className="relative max-w-[90%]">
                    <div
                      className="rounded-3xl rounded-tl-md border px-4 py-3 text-[17px] leading-7 text-gray-900 shadow-sm"
                      style={{ backgroundColor: '#ffffff', borderColor: '#e6e8eb' }}
                    >
                      <p className="mb-1 text-xs font-medium text-gray-500">{BRAND.shortName} Support</p>
                      <p>{m.text}</p>
                    </div>
                    <span
                      className="absolute left-[-6px] top-4 h-3 w-3 rotate-45 border-b border-l bg-white"
                      style={{ borderColor: '#e6e8eb' }}
                      aria-hidden
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 rounded-2xl rounded-bl-md px-4 py-2 text-sm flex items-center gap-1">
                  <TypingDots className="text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t" style={{ borderColor: 'var(--leaf-100)' }}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, orders..."
                className="flex-1 rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--leaf-200)' }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl p-2.5 text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--leaf-500)' }}
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
