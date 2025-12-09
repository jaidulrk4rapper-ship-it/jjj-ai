"use client";

import { useJjjUser } from "@/providers/UserProvider";
import LoginPrompt from "@/components/LoginPrompt";

import { useState, useRef, useEffect } from "react";

const ALLOWED_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
type AllowedVoice = (typeof ALLOWED_VOICES)[number];

type PresetId = "youtube" | "podcast" | "story" | "announcement" | "custom";

interface TTSPreset {
  id: PresetId;
  label: string;
  description: string;
  defaultVoice: AllowedVoice;
  defaultRate: number;
}

const TTS_PRESETS: TTSPreset[] = [
  {
    id: "youtube",
    label: "YouTube Explainer",
    description: "Fast, energetic tone for tutorials and explainers.",
    defaultVoice: "nova",
    defaultRate: 1.1,
  },
  {
    id: "podcast",
    label: "Podcast Deep",
    description: "Relaxed, deeper tone for podcasts.",
    defaultVoice: "onyx",
    defaultRate: 0.95,
  },
  {
    id: "story",
    label: "Storytelling",
    description: "Warm, narrative style for stories.",
    defaultVoice: "fable",
    defaultRate: 1.0,
  },
  {
    id: "announcement",
    label: "Announcement",
    description: "Clear, bright tone for alerts and announcements.",
    defaultVoice: "echo",
    defaultRate: 1.15,
  },
  {
    id: "custom",
    label: "Custom",
    description: "Use your own voice & speed.",
    defaultVoice: "alloy",
    defaultRate: 1.0,
  },
];

interface TTSHistoryItem {
  id: string;
  text: string;
  voice: AllowedVoice;
  createdAt: string;
  url: string;
}

interface TTSUsageInfo {
  ok: boolean;
  plan: "free" | "pro";
  todayClips: number;
  dailyLimit: number;
  maxChars: number;
}

export default function TextToSpeechPage() {
  const { user, loading: userLoading } = useJjjUser();
  
  // Show login prompt if user is not logged in
  if (!userLoading && (!user || !user.email)) {
    return <LoginPrompt title="Sign in to use Text-to-Speech" message="Please sign in with your email to generate audio from text." />;
  }

  const [text, setText] = useState("");
  const [voice, setVoice] = useState<AllowedVoice>("alloy");
  const [preset, setPreset] = useState<PresetId>("custom");
  const [charLimit] = useState(500); // Fallback limit
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TTSHistoryItem[]>([]);
  const [usage, setUsage] = useState<TTSUsageInfo | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load usage on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/usage/tts");
        if (!res.ok) {
          throw new Error("Failed to load usage");
        }
        const data = (await res.json()) as TTSUsageInfo;
        if (!cancelled && data.ok) {
          setUsage(data);
        }
      } catch {
        // Fail silently - usage info is optional
      } finally {
        if (!cancelled) setUsageLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("jjjai_tts_history");
      if (!raw) return;
      const parsed = JSON.parse(raw) as TTSHistoryItem[];
      if (Array.isArray(parsed)) {
        setHistory(parsed.slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (history.length === 0) {
      localStorage.removeItem("jjjai_tts_history");
      return;
    }
    localStorage.setItem("jjjai_tts_history", JSON.stringify(history));
  }, [history]);

  // Update playback rate when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const applyPreset = (id: PresetId) => {
    setPreset(id);
    const p = TTS_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setVoice(p.defaultVoice);
    setPlaybackRate(p.defaultRate);
  };

  const handleVoiceChange = (newVoice: AllowedVoice) => {
    setVoice(newVoice);
    setPreset("custom");
  };

  const handlePlaybackRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    setPreset("custom");
  };

  const buildDownloadName = (voice: AllowedVoice, createdAt?: string) => {
    const timestamp = createdAt ? new Date(createdAt) : new Date();
    const iso = timestamp.toISOString().replace(/[:.]/g, "-").slice(0, -5); // Remove milliseconds
    return `jjjai-tts-${voice}-${iso}.mp3`;
  };

  const handleSpeak = async () => {
    const trimmed = text.trim();
    const effectiveCharLimit = usage?.maxChars ?? charLimit;

    if (!trimmed) {
      setError("Please enter some text");
      return;
    }
    if (trimmed.length > effectiveCharLimit) {
      setError(`Text is too long. Max ${effectiveCharLimit} characters for your plan.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, voice }),
      });

      if (!res.ok) {
        let msg = `TTS failed with status ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
          // Update usage if backend returned updated info
          if (data?.todayClips !== undefined && data?.dailyLimit !== undefined) {
            setUsage((prev) =>
              prev
                ? { ...prev, todayClips: data.todayClips, dailyLimit: data.dailyLimit }
                : prev
            );
          }
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Update usage from response headers
      const todayClipsHeader = res.headers.get("X-TTS-Today");
      if (todayClipsHeader && usage) {
        setUsage((prev) =>
          prev
            ? { ...prev, todayClips: parseInt(todayClipsHeader, 10) }
            : prev
        );
      }

      // Reload usage to get accurate count
      try {
        const usageRes = await fetch("/api/usage/tts");
        if (usageRes.ok) {
          const usageData = (await usageRes.json()) as TTSUsageInfo;
          if (usageData.ok) {
            setUsage(usageData);
          }
        }
      } catch {
        // Ignore usage reload errors
      }

      const now = new Date().toISOString();
      setHistory((prev) => {
        const entry: TTSHistoryItem = {
          id: `${now}-${Math.random().toString(36).slice(2)}`,
          text: trimmed.slice(0, 120),
          voice,
          url,
          createdAt: now,
        };
        const next = [entry, ...prev];
        return next.slice(0, 5); // keep last 5
      });
    } catch (err: any) {
      setError(err?.message || "OpenAI TTS failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = buildDownloadName(voice);
    a.click();
  };

  const effectiveCharLimit = usage?.maxChars ?? charLimit;
  const length = text.length;
  const percent = Math.min(100, (length / effectiveCharLimit) * 100);
  const barColor =
    percent < 70 ? "bg-green-500" : percent < 90 ? "bg-yellow-500" : "bg-red-500";
  const approxTokens = Math.max(1, Math.round(length / 4));

  return (
    <main className="flex flex-col min-h-screen bg-black text-gray-100">
      <div className="mx-auto w-full max-w-5xl px-3 py-3 md:px-4 md:py-6 lg:px-8 lg:py-8 flex-1 flex flex-col overflow-hidden">
        <div className="max-w-sm mx-auto w-full md:max-w-none flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="mb-3 md:mb-4 flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-semibold text-white">Text to Speech</h1>
            <p className="text-xs md:text-sm text-gray-400">
              Convert your text into natural speech using OpenAI TTS.
            </p>
          </div>

          {/* Main card - Scrollable on mobile */}
          <div className="flex-1 overflow-y-auto pb-20 md:pb-4">
            <div className="rounded-2xl border border-[#1A1A1A] bg-black/70 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl p-3 md:p-4 lg:p-5 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Left column – Text input */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-300">Text</label>
          <textarea
            rows={10}
            className="w-full resize-none rounded-xl border border-[#1A1A1A] bg-[#050505] px-3 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Type or paste the text you want to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Character counter + limit bar */}
          <div className="mt-2">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Characters: {length} / {effectiveCharLimit}</span>
              {length > effectiveCharLimit && (
                <span className="text-red-400">Limit exceeded</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Approx tokens: {approxTokens} (rough estimate, not exact billing)
            </p>
          </div>

          {/* Presets */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Presets</span>
              {preset !== "custom" && (
                <button
                  type="button"
                  className="text-[11px] text-blue-400 hover:text-blue-300"
                  onClick={() => setPreset("custom")}
                >
                  Reset to custom
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {TTS_PRESETS.filter((p) => p.id !== "custom").map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1 rounded-full text-[11px] border ${
                    preset === p.id
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {preset !== "custom" && (
              <p className="mt-1 text-[11px] text-gray-400">
                {TTS_PRESETS.find((p) => p.id === preset)?.description}
              </p>
            )}
          </div>

          {/* Voice dropdown */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">Voice</label>
            <select
              value={voice}
              onChange={(e) => handleVoiceChange(e.target.value as AllowedVoice)}
              className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-sm mb-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="alloy">Alloy (neutral)</option>
              <option value="echo">Echo (bright)</option>
              <option value="fable">Fable (story)</option>
              <option value="onyx">Onyx (deep)</option>
              <option value="nova">Nova (energetic)</option>
              <option value="shimmer">Shimmer (warm)</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Usage info */}
          {usage && (
            <div className="mt-3 text-[11px] text-gray-300 bg-white/5 border border-white/10 rounded-md px-3 py-2">
              <div className="flex justify-between">
                <span>Plan: <span className="font-semibold capitalize">{usage.plan}</span></span>
                <span>
                  Today: {usage.todayClips} / {usage.dailyLimit} clips
                </span>
              </div>
              <div className="mt-1">
                Max {usage.maxChars} characters per request for this plan.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSpeak}
              disabled={loading || !text.trim() || text.trim().length > effectiveCharLimit}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Audio"
              )}
            </button>
            {audioUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg border border-[#1A1A1A] bg-[#050505] px-3 py-2 text-xs text-gray-300 hover:bg-[#111111]"
              >
                Download MP3
              </button>
            )}
          </div>
        </div>

        {/* Right column – Audio player & history */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#1A1A1A] bg-[#050505]/70 p-4 text-sm text-gray-200">
          {/* Audio player with speed control */}
          {audioUrl && (
            <div className="mt-4 space-y-2">
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full rounded-lg border border-[#1A1A1A] bg-black"
              />

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span>Speed</span>
                <input
                  type="range"
                  min={0.75}
                  max={1.5}
                  step={0.05}
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span>{playbackRate.toFixed(2)}x</span>
              </div>
            </div>
          )}

          {!audioUrl && (
            <div className="mt-3 p-4 rounded-lg border border-[#1A1A1A] bg-[#050505]/50">
              <p className="text-xs text-gray-400 text-center">
                Generated audio will appear here
              </p>
            </div>
          )}

          {/* History list (last 5 clips) */}
          {history.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium mb-2 text-gray-300">Recent clips</h3>
              <div className="space-y-2 text-xs">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white/5 rounded-md px-3 py-2"
                  >
                    <div className="flex-1 pr-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase whitespace-nowrap">
                          {item.voice}
                        </span>
                        <span className="text-gray-300 truncate">
                          {item.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 whitespace-nowrap"
                        onClick={() => {
                          setText(item.text);
                        }}
                      >
                        Use text
                      </button>
                      <button
                        type="button"
                        className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 whitespace-nowrap"
                        onClick={() => {
                          setAudioUrl(item.url);
                          setPlaybackRate(1);
                        }}
                      >
                        Play
                      </button>
                      <button
                        type="button"
                        className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 whitespace-nowrap"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = item.url;
                          a.download = buildDownloadName(item.voice, item.createdAt);
                          a.click();
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
