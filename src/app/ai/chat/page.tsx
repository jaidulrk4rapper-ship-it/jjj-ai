"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-provider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function AiChatPage() {
  const {
    replyLength,
    showTimestamps,
    fontSize,
    reducedMotion,
    defaultLang,
    theme,
  } = useSettings();

  const fontSizeClass =
    fontSize === "small"
      ? "text-xs"
      : fontSize === "large"
      ? "text-base"
      : "text-sm";

  const containerBg =
    theme === "light"
      ? "bg-white/95 border-zinc-200"
      : "bg-black/70 border-[#1A1A1A]";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
              content:
                    "Hello 👋 I'm JJJ AI's chat assistant. Feel free to ask me anything – I'm here to help!",
      createdAt: "", // Will be set in useEffect to avoid hydration mismatch
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  // Set initial timestamp on client side only
  useEffect(() => {
    setMessages((prev) => {
      if (prev[0]?.id === "welcome-1" && !prev[0]?.createdAt) {
        return [
          {
            ...prev[0],
            createdAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      }
      return prev;
    });
  }, []);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: now,
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create AI message placeholder for streaming
    const aiMessageId = `assistant-${Date.now()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add empty AI message for streaming
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });

      if (!res.ok) {
        // Try to get error message
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

      // Handle non-streaming response (simpler and more reliable)
      const data = await res.json();
      const replyText: string =
        typeof data.reply === "string"
          ? data.reply
          : "Sorry, I could not understand the response.";

      if (!replyText || !replyText.trim()) {
        // Remove empty message if no content received
        setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
        throw new Error("No response received from AI. Please try again.");
      }

      // Update AI message with the reply
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: replyText }
            : msg
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      // Remove the empty AI message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content:
                    "Chat cleared ✅. Feel free to ask me anything, I'm here to help!",
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setError(null);
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">JJJ AI Chat</h1>
        <p className="text-sm text-zinc-600 dark:text-gray-400">
          ChatGPT style conversation – ask anything in one continuous chat.
        </p>
      </div>

      {/* Chat container card */}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.35, ease: "easeOut" }}
        className={`flex-1 flex flex-col rounded-2xl border ${containerBg} shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden`}
      >
        {/* Messages list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${fontSizeClass} ${
                  m.role === "user"
                    ? "bg-sky-600 text-white rounded-br-sm shadow-[0_0_26px_rgba(56,189,248,0.6)]"
                    : "bg-[#0A0A0A] text-gray-100 border border-[#1A1A1A] rounded-bl-sm shadow-[0_0_20px_rgba(15,23,42,0.7)]"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wide mb-1 opacity-70">
                  {m.role === "user" ? "You" : "JJJ AI"}
                </p>
                <div>{m.content}</div>
                {showTimestamps && (
                  <p className="mt-1 text-[10px] opacity-60">{m.createdAt}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && !reducedMotion && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] px-3 py-2 text-xs text-gray-300 shadow-[0_0_18px_rgba(0,0,0,0.9)]">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                JJJ AI is thinking…
              </div>
            </div>
          )}
          {isLoading && reducedMotion && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] px-3 py-2 text-xs text-gray-300">
                JJJ AI is thinking…
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 pb-1 text-xs text-red-400 border-t border-red-900/40 bg-red-950/20">
            {error}
          </div>
        )}

        {/* Input area – ChatGPT style bottom bar */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-xl dark:border-[#1A1A1A] dark:bg-black/90"
        >
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              className="flex-1 max-h-32 min-h-[44px] resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-[#050505] dark:border-[#1A1A1A] dark:text-gray-100 dark:placeholder:text-gray-600"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // SHIFT + ENTER → new line (allowed)
                if (e.key === "Enter" && e.shiftKey) {
                  return; // allow newline
                }

                // ENTER → Send message
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSubmit(e);
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 hover:shadow-[0_0_18px_rgba(56,189,248,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending…" : "Send"}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-gray-500">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear chat
            </button>
            <span>JJJ AI · Experimental chat</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
