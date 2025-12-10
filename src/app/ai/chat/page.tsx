"use client";

import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { useJjjUser } from "@/providers/UserProvider";
import { apiFetch } from "@/lib/apiClient";
import LoginPrompt from "@/components/LoginPrompt";
import { useToast } from "@/components/ToastProvider";
import { ChevronDown, Plus, Mic, Volume2, Menu, Send, Sparkles } from "lucide-react";
import ChatActionsTray from "@/components/chat/ChatActionsTray";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function AiChatPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { user, loading: userLoading } = useJjjUser();
  const toast = useToast();
  
  const { replyLength, showTimestamps, fontSize, reducedMotion, defaultLanguage, theme } = settings;

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not logged in (only after loading is complete)
  if (!user || !user.email) {
    return <LoginPrompt title="Sign in to use AI Chat" message="Please sign in with your email to start chatting with JJJ AI." />;
  }

  const fontSizeClass =
    fontSize === "small"
      ? "text-xs"
      : fontSize === "large"
      ? "text-base"
      : "text-sm";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isSubmittingRef = useRef(false);

  // Suggested prompts for mobile
  const suggestedPrompts = [
    { title: "Automated invoicing", subtitle: "system for businesses" },
    { title: "Payment gateway", subtitle: "integration with Razorpay" },
    { title: "AI content creation", subtitle: "for social media posts" },
    { title: "Data analysis", subtitle: "and visualization tools" },
  ];

  // Smooth scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  // Focus textarea on mount (mobile)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // Don't auto-focus on mobile to avoid keyboard popup
    } else {
      textareaRef.current?.focus();
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    
    // Prevent double submission
    if (!trimmed || isLoading || isSubmittingRef.current) return;

    setError(null);
    isSubmittingRef.current = true;
    setIsLoading(true);

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      role: "user",
      content: trimmed,
      createdAt: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const aiMessageId = `assistant-${Date.now()}-${Math.random()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      const res = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          replyLength: replyLength,
          defaultLanguage: defaultLanguage,
        }),
      }, user?.userId);

      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Failed to get reply";
        try {
          const data = JSON.parse(text);
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      const replyText: string =
        typeof data.reply === "string"
          ? data.reply
          : "Sorry, I could not understand the response.";

      if (!replyText || !replyText.trim()) {
        setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
        throw new Error("No response received from AI. Please try again.");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: replyText.trim() }
            : msg
        )
      );
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }

  function clearConversation() {
    if (isLoading) return; // Prevent clearing while loading
    setMessages([]);
    setError(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleClear() {
    clearConversation();
  }

  function setComposerText(text: string) {
    setInput(text);
    // Auto-focus after setting text
    setTimeout(() => {
      focusComposer();
    }, 50);
  }

  function focusComposer() {
    textareaRef.current?.focus();
    // Scroll to bottom to show input
    scrollToBottom();
  }

  function handleQuickAction(actionId: string) {
    setIsActionsOpen(false);
    switch (actionId) {
      case 'new-chat':
        clearConversation();
        break;
      case 'rewrite':
        setComposerText('Rewrite and improve this text: ');
        break;
      case 'summarise':
        setComposerText('Summarise this text in simple points: ');
        break;
      case 'explain':
        setComposerText('Explain this concept in simple terms: ');
        break;
      case 'translate':
        setComposerText('Translate this text to [language]: ');
        break;
      case 'code-help':
        setComposerText('Help me with this code: ');
        break;
      case 'yt-script':
        setComposerText('Create a YouTube video script about: ');
        break;
      case 'short-video':
        setComposerText('Give me short video/reel ideas about: ');
        break;
      case 'blog-post':
        setComposerText('Write a blog article about: ');
        break;
      case 'social-post':
        setComposerText('Create a social media post about: ');
        break;
      case 'email':
        setComposerText('Write a professional email about: ');
        break;
      case 'headlines':
        setComposerText('Generate catchy headlines for: ');
        break;
      case 'analyze-data':
        setComposerText('Analyze this data and provide insights: ');
        break;
      case 'research':
        setComposerText('Research and explain this topic: ');
        break;
      case 'compare':
        setComposerText('Compare these options and their pros/cons: ');
        break;
      case 'brainstorm':
        setComposerText('Brainstorm creative ideas for: ');
        break;
      default:
        break;
    }
  }

  function handleSuggestedPrompt(prompt: string) {
    setInput(prompt);
    setError(null);
    // Auto-focus textarea after a short delay
    setTimeout(() => {
      textareaRef.current?.focus();
      // Scroll to bottom to show input
      scrollToBottom();
    }, 100);
  }

  const hasMessages = messages.length > 0;

  return (
    <main className="flex flex-col min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-120px] h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-slate-800/80 bg-[#020617]/95 backdrop-blur-sm px-4 pt-3 pb-2 flex-shrink-0 md:px-4 md:pt-3 md:pb-2">
        {/* Mobile: Hamburger menu */}
        <div className="flex items-center gap-2 md:gap-2">
          <button className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {/* Empty space for alignment */}
        <div className="flex-1"></div>
        {/* Icons - Removed refresh, user icon, and JJJ AI button as per requirements */}
      </div>

      {/* Scrollable messages area */}
      <section className="flex-1 overflow-y-auto px-4 pb-4 md:px-4 md:pb-4" ref={listRef}>
        {!hasMessages ? (
          // Empty state - Mobile & Desktop
          <div className="flex h-full flex-col items-center justify-center px-4">
            {/* Desktop: Centered text */}
            <div className="hidden md:block mb-8 text-center">
              <h1 className="mb-2 text-2xl font-semibold text-slate-100">
                What are you working on?
              </h1>
              <p className="text-sm text-slate-400">
                Ask me anything, I'm here to help!
              </p>
            </div>
            {/* Mobile: Suggested prompts */}
            <div className="md:hidden w-full max-w-md overflow-x-hidden">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt.title + " " + prompt.subtitle)}
                    className="flex-shrink-0 rounded-xl bg-slate-900/70 border border-slate-800/80 px-4 py-3 text-left hover:bg-slate-900/90 hover:border-sky-500/30 transition-all backdrop-blur-sm"
                  >
                    <div className="font-semibold text-slate-100 text-sm mb-0.5">
                      {prompt.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {prompt.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Messages - Mobile & Desktop
          <div className="mx-auto w-full max-w-3xl px-3 md:px-4 py-4 md:py-8">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`group mb-4 md:mb-6 flex gap-3 md:gap-4 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white text-xs md:text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                    JJJ
                  </div>
                )}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-2.5 md:px-4 md:py-3 ${fontSizeClass} ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                      : "bg-slate-900/70 border border-slate-800/80 text-slate-100 backdrop-blur-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed break-words">
                    {m.content || (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 delay-75" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 delay-150" />
                      </span>
                    )}
                  </div>
                  {showTimestamps && m.createdAt && (
                    <p className="mt-2 text-[10px] opacity-60 text-slate-400">{m.createdAt}</p>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs md:text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages.length > 0 && (
              <div className="mb-4 md:mb-6 flex gap-3 md:gap-4">
                <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white text-xs md:text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                  JJJ
                </div>
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 px-3 py-2.5 md:px-4 md:py-3 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 delay-75" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mx-auto w-full max-w-3xl px-3 md:px-4 pb-4">
            <div className="rounded-lg bg-red-900/20 border border-red-900/50 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-red-400">
              {error}
            </div>
          </div>
        )}
      </section>

      {/* Bottom input + mini footer */}
      <footer className="border-t border-slate-800 bg-[#020617] flex-shrink-0">
        <div className="px-4 pt-2 pb-1 md:px-4 md:pt-2 md:pb-1">
          {/* Actions Tray */}
          <div className="relative mb-2">
            <ChatActionsTray
              isOpen={isActionsOpen}
              onClose={() => setIsActionsOpen(false)}
              onActionClick={handleQuickAction}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
            <div className="relative flex items-end gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-sky-500/30 transition-colors">
              <button
                type="button"
                onClick={() => setIsActionsOpen((v) => !v)}
                className="p-2.5 md:p-3 text-slate-400 hover:text-sky-400 transition-colors"
                title="Quick actions"
              >
                <Plus className="h-5 w-5" />
              </button>
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-2.5 md:py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-[200px]"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading && !isSubmittingRef.current) {
                      handleSubmit(e);
                    }
                  }
                }}
                disabled={isLoading}
              />
              <div className="flex items-center gap-0.5 md:gap-1 p-1.5 md:p-2">
                <button
                  type="button"
                  className="p-1.5 md:p-2 text-slate-400 hover:text-sky-400 transition-colors"
                  title="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </button>
                {input.trim() ? (
                  <button
                    type="submit"
                    disabled={isLoading || isSubmittingRef.current}
                    className="p-1.5 md:p-2 text-sky-400 hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="p-1.5 md:p-2 text-slate-400 hover:text-sky-400 transition-colors"
                    title="Voice output"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <p className="hidden md:block mt-1 text-center text-xs text-slate-500">
              JJJ AI can make mistakes. Check important info.
            </p>
          </form>
        </div>

        {/* Mini policy row */}
        <div className="px-4 pb-3 text-[10px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 md:text-xs">
          <span>© {new Date().getFullYear()} JJJ AI Studio</span>
          <a href="/contact" className="underline-offset-2 hover:underline">
            Contact Us
          </a>
          <a href="/terms" className="underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </a>
          <a href="/privacy" className="underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          <a href="/refund" className="underline-offset-2 hover:underline">
            Refund &amp; Cancellation Policy
          </a>
        </div>
      </footer>
    </main>
  );
}
