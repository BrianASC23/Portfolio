'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { Brain, Code, Send, Sparkles, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Sprite configuration                                               */
/* ------------------------------------------------------------------ */

const SPRITE_SRC = '/sprites/Sprite_Bot.png';
const FRAME_W = 689;
const FRAME_H = 751;
const DISPLAY_H = 80;

/* ------------------------------------------------------------------ */
/*  Agent configuration                                                */
/* ------------------------------------------------------------------ */

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  icon: React.ElementType;
  gradient: string;
}

const AI_AGENTS: Agent[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    role: 'Advanced Reasoning',
    avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&h=80&fit=crop',
    status: 'online',
    icon: Sparkles,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'claude',
    name: 'Claude 3.5',
    role: 'Creative Writing',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop',
    status: 'online',
    icon: Brain,
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    role: 'Multimodal Analysis',
    avatar: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=80&h=80&fit=crop',
    status: 'busy',
    icon: Zap,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    role: 'Code Assistant',
    avatar: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=80&h=80&fit=crop',
    status: 'online',
    icon: Code,
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
];

/* ------------------------------------------------------------------ */
/*  Mock responses                                                     */
/* ------------------------------------------------------------------ */

const MOCK_RESPONSES = [
  "Greetings, traveler! I'm Brian's familiar — a construct of code and curiosity. How may I assist you on your quest?",
  'Ah, an excellent question! Brian has journeyed through full-stack alchemy, AI sorcery, and systems engineering. What realm interests you?',
  'The guild master is currently seeking summer 2026 quests. Feel free to send a raven via the Contact page!',
  "I sense great curiosity in you. Brian's projects span from RAG-powered advisors to custom heap allocators. Shall I elaborate?",
  "My apologies — my crystal ball is still being calibrated. When the backend enchantment is complete, I'll have much wiser answers!",
  'Fun fact: this very portfolio was forged with Next.js 15, Tailwind, and a dash of medieval flair. Quite the brew!',
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  role: 'user' | 'bot';
  text: string;
  streaming?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 300, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10, x: -10 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const defaultAgent = AI_AGENTS[0] as Agent;
  const [selectedAgent, setSelectedAgent] = useState<string>(defaultAgent.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hail, adventurer! I'm Brian's familiar. Ask me anything about his quests, skills, or projects.",
    },
  ]);
  const [input, setInput] = useState('');
  const [talking, setTalking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamAbort = useRef(false);

  const currentAgent = AI_AGENTS.find((a) => a.id === selectedAgent) ?? defaultAgent;

  // Auto-scroll to bottom when a message is added
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length is an intentional trigger
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const streamResponse = useCallback((text: string) => {
    streamAbort.current = false;
    setTalking(true);

    setMessages((prev) => [...prev, { role: 'bot', text: '', streaming: true }]);

    let i = 0;
    const interval = setInterval(() => {
      if (streamAbort.current) {
        clearInterval(interval);
        setTalking(false);
        return;
      }

      i++;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'bot') {
          updated[updated.length - 1] = {
            ...last,
            text: text.slice(0, i),
            streaming: i < text.length,
          };
        }
        return updated;
      });

      if (i >= text.length) {
        clearInterval(interval);
        setTalking(false);
      }
    }, 30);
  }, []);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);

    const response =
      MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)] ?? MOCK_RESPONSES[0] ?? '';
    setTimeout(() => streamResponse(response), 800);
  }

  return (
    <>
      {/* ---- Chat widget panel ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 w-[380px] overflow-hidden rounded-2xl border border-[var(--color-border)]/40 bg-[var(--color-bg)]/60 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
            style={{ bottom: 160, right: 24 }}
          >
            {/* Header */}
            <div className="relative border-b border-[var(--color-border)]/40 bg-[var(--color-bg-inset)]/30 p-4 overflow-hidden">
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-50',
                  currentAgent.gradient,
                )}
              />
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-[var(--color-bg)] shadow-sm">
                      <AvatarImage src={currentAgent.avatar} alt={currentAgent.name} />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--color-bg)]',
                        currentAgent.status === 'online'
                          ? 'bg-emerald-500'
                          : currentAgent.status === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-slate-400',
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-fg)]">
                      {currentAgent.name}
                    </h3>
                    <span className="text-xs text-[var(--color-fg-muted)]">
                      {currentAgent.role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-[var(--color-bg)]/50"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Agent Selector */}
            <div className="border-b border-[var(--color-border)]/40 p-3">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-full border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 text-lg font-medium h-auto hover:bg-transparent px-2 py-6 cursor-pointer">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-[var(--color-bg)]/90 border-[var(--color-border)]/40">
                  {AI_AGENTS.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <SelectItem
                        key={agent.id}
                        value={agent.id}
                        className="cursor-pointer focus:bg-[var(--color-accent)]/10"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                              agent.gradient,
                            )}
                          >
                            <Icon className="h-4 w-4 text-[var(--color-fg)]/80" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-medium">{agent.name}</span>
                            <span className="text-[10px] text-[var(--color-fg-muted)]">
                              {agent.role}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex h-[320px] flex-col gap-4 overflow-y-auto p-4 bg-gradient-to-b from-[var(--color-bg)]/20 to-[var(--color-bg)]/40"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={`msg-${msg.role}-${i}-${msg.text.slice(0, 20)}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse self-end')}
                >
                  {msg.role === 'bot' ? (
                    <Avatar className="h-8 w-8 shrink-0 border border-[var(--color-border)]/40 shadow-sm">
                      <AvatarImage src={currentAgent.avatar} />
                      <AvatarFallback className="bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 shrink-0 border border-[var(--color-border)]/40 shadow-sm">
                      <AvatarFallback className="bg-[var(--color-accent)] text-white font-semibold text-xs">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      'flex max-w-[85%] flex-col gap-1',
                      msg.role === 'user' && 'items-end',
                    )}
                  >
                    {msg.role === 'bot' && (
                      <span className="text-xs font-medium text-[var(--color-fg-muted)]">
                        {currentAgent.name}
                      </span>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                        msg.role === 'user'
                          ? 'rounded-tr-none bg-[var(--color-accent)] text-white shadow-md'
                          : 'rounded-tl-none bg-[var(--color-bg-inset)] backdrop-blur-sm border border-[var(--color-border)]/20',
                      )}
                    >
                      {msg.text}
                      {msg.streaming && (
                        <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-[var(--color-accent)]" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-[var(--color-border)]/40 bg-[var(--color-bg)]/60 p-3 backdrop-blur-md">
              <form
                className="relative flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${currentAgent.name}...`}
                  className="flex-1 rounded-full border border-[var(--color-border)]/40 bg-[var(--color-bg)]/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-accent)]/50 focus:bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[var(--color-accent-hi)]"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Sprite button ---- */}
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="chatbot-sprite fixed z-50 cursor-pointer border-0 bg-transparent p-0 transition-transform duration-200 hover:-translate-y-1"
        style={{ bottom: 88, right: 24 }}
      >
        <div
          className={`chatbot-sprite-frame${talking ? ' talking' : ''}`}
          style={{
            width: DISPLAY_H * (FRAME_W / FRAME_H),
            height: DISPLAY_H,
            backgroundImage: `url(${SPRITE_SRC})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            backgroundSize: `${DISPLAY_H * (FRAME_W / FRAME_H) * 2}px ${DISPLAY_H}px`,
            imageRendering: 'pixelated',
          }}
        />
      </button>
    </>
  );
}
