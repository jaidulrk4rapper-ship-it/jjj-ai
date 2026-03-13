"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Brain,
  Eye,
  Activity,
  Clock,
  Star,
  AlertTriangle,
  BarChart3,
  Flame,
  Snowflake,
  ChevronLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Bias = "bullish" | "bearish" | "neutral";
type Volatility = "low" | "medium" | "high";
type Session = "tokyo" | "london" | "newyork" | "overlap" | "off";

interface FocusPair {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  bias: Bias;
  volatility: Volatility;
  score: number; // 0-100 focus score
  reason: string;
}

interface SessionInfo {
  name: string;
  active: boolean;
  opens: string;
  closes: string;
  bias: Bias;
  mood: string;
  icon: typeof Clock;
}

interface VolatilityItem {
  symbol: string;
  atr: number;
  atrPercent: number;
  level: Volatility;
  trend: "rising" | "falling" | "stable";
}

interface AISuggestion {
  symbol: string;
  action: "watch" | "prepare" | "avoid";
  reason: string;
  confidence: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
function getSessionNow(): Session {
  const utcH = new Date().getUTCHours();
  if (utcH >= 0 && utcH < 8) return "tokyo";
  if (utcH >= 7 && utcH < 9) return "overlap";
  if (utcH >= 8 && utcH < 16) return "london";
  if (utcH >= 13 && utcH < 17) return "overlap";
  if (utcH >= 13 && utcH < 22) return "newyork";
  return "off";
}

function generateFocusPairs(): FocusPair[] {
  return [
    { symbol: "EURUSD", name: "Euro / Dollar", price: 1.08542, changePercent: 0.12, bias: "bullish", volatility: "medium", score: 87, reason: "Clean trend on H4, testing key resistance" },
    { symbol: "GBPUSD", name: "Pound / Dollar", price: 1.26318, changePercent: -0.08, bias: "neutral", volatility: "medium", score: 72, reason: "Ranging near support, wait for breakout" },
    { symbol: "XAUUSD", name: "Gold", price: 2648.35, changePercent: 0.47, bias: "bullish", volatility: "high", score: 91, reason: "Strong momentum, safe-haven demand rising" },
    { symbol: "USDJPY", name: "Dollar / Yen", price: 149.852, changePercent: 0.16, bias: "bearish", volatility: "high", score: 78, reason: "Near intervention zone, BoJ rhetoric hawkish" },
    { symbol: "BTCUSD", name: "Bitcoin", price: 97245.0, changePercent: 1.59, bias: "bullish", volatility: "high", score: 83, reason: "Breakout above 96k, strong volume" },
    { symbol: "NAS100", name: "Nasdaq 100", price: 19542.8, changePercent: -0.23, bias: "bearish", volatility: "medium", score: 68, reason: "Divergence on RSI, earnings pressure" },
  ];
}

function generateSessions(): SessionInfo[] {
  const current = getSessionNow();
  return [
    { name: "Tokyo", active: current === "tokyo", opens: "00:00", closes: "08:00", bias: "neutral", mood: "Quiet accumulation, JPY pairs active", icon: Clock },
    { name: "London", active: current === "london" || current === "overlap", opens: "08:00", closes: "16:00", bias: "bullish", mood: "High liquidity, trend-setting moves", icon: Activity },
    { name: "New York", active: current === "newyork" || current === "overlap", opens: "13:00", closes: "22:00", bias: "bearish", mood: "Data-driven volatility, USD reactive", icon: BarChart3 },
  ];
}

function generateVolatility(): VolatilityItem[] {
  return [
    { symbol: "XAUUSD", atr: 28.5, atrPercent: 1.08, level: "high", trend: "rising" },
    { symbol: "BTCUSD", atr: 1845, atrPercent: 1.9, level: "high", trend: "rising" },
    { symbol: "USDJPY", atr: 0.92, atrPercent: 0.61, level: "high", trend: "stable" },
    { symbol: "GBPJPY", atr: 1.45, atrPercent: 0.77, level: "medium", trend: "falling" },
    { symbol: "EURUSD", atr: 0.0058, atrPercent: 0.53, level: "medium", trend: "stable" },
    { symbol: "AUDUSD", atr: 0.0041, atrPercent: 0.63, level: "medium", trend: "rising" },
    { symbol: "NAS100", atr: 185, atrPercent: 0.95, level: "medium", trend: "falling" },
    { symbol: "GBPUSD", atr: 0.0062, atrPercent: 0.49, level: "low", trend: "falling" },
  ];
}

function generateAISuggestions(): AISuggestion[] {
  return [
    { symbol: "XAUUSD", action: "prepare", reason: "Momentum aligned with fundamentals. Wait for pullback to 2635 zone for entry.", confidence: 88 },
    { symbol: "EURUSD", action: "watch", reason: "Approaching 1.0870 resistance. Breakout or rejection will define next move.", confidence: 75 },
    { symbol: "BTCUSD", action: "watch", reason: "Strong break above 96k but extended. Look for retest of breakout level.", confidence: 72 },
    { symbol: "USDJPY", action: "avoid", reason: "Intervention risk near 150. Unpredictable moves likely. Stay on sidelines.", confidence: 85 },
    { symbol: "NAS100", action: "prepare", reason: "RSI divergence forming. Short setup possible if 19450 breaks.", confidence: 70 },
  ];
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function BiasIcon({ bias }: { bias: Bias }) {
  if (bias === "bullish") return <TrendingUp className="h-3.5 w-3.5 text-teal-400" />;
  if (bias === "bearish") return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

function biasColor(bias: Bias) {
  if (bias === "bullish") return "text-teal-400";
  if (bias === "bearish") return "text-red-400";
  return "text-slate-400";
}

function biasBg(bias: Bias) {
  if (bias === "bullish") return "bg-teal-500/10 border-teal-500/30";
  if (bias === "bearish") return "bg-red-500/10 border-red-500/30";
  return "bg-slate-500/10 border-slate-500/30";
}

function volColor(level: Volatility) {
  if (level === "high") return "text-amber-400";
  if (level === "medium") return "text-teal-400";
  return "text-slate-400";
}

function volBg(level: Volatility) {
  if (level === "high") return "bg-amber-500/10 border-amber-500/30";
  if (level === "medium") return "bg-teal-500/10 border-teal-500/30";
  return "bg-slate-500/10 border-slate-500/30";
}

function actionColor(action: AISuggestion["action"]) {
  if (action === "prepare") return "text-teal-400 bg-teal-500/10 border-teal-500/30";
  if (action === "watch") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-red-400 bg-red-500/10 border-red-500/30";
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function MarketFocusPage() {
  const [focusPairs, setFocusPairs] = useState<FocusPair[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [volatility, setVolatility] = useState<VolatilityItem[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [lastRefresh, setLastRefresh] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setFocusPairs(generateFocusPairs());
      setSessions(generateSessions());
      setVolatility(generateVolatility());
      setSuggestions(generateAISuggestions());
      setLastRefresh(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentSession = getSessionNow();
  const overallMood: Bias = focusPairs.filter((p) => p.bias === "bullish").length > focusPairs.length / 2 ? "bullish" : focusPairs.filter((p) => p.bias === "bearish").length > focusPairs.length / 2 ? "bearish" : "neutral";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-[#0a0e1a]/95 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-1.5 group">
                <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </a>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                  <Eye className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-100">Market Focus</h1>
                  <p className="text-[10px] text-slate-500">Erek-X Intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastRefresh && <span className="text-[10px] text-slate-500">Updated {lastRefresh}</span>}
              <button
                onClick={loadData}
                disabled={refreshing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700/50 bg-slate-800/30 text-[10px] text-slate-400 hover:text-teal-400 hover:border-teal-500/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Market Mood Summary */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${biasBg(overallMood)}`}>
              <BiasIcon bias={overallMood} />
              <span className={biasColor(overallMood)}>
                Market {overallMood === "bullish" ? "Risk-On" : overallMood === "bearish" ? "Risk-Off" : "Mixed"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/40 bg-slate-800/30 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {currentSession === "tokyo" && "Tokyo Session"}
              {currentSession === "london" && "London Session"}
              {currentSession === "newyork" && "New York Session"}
              {currentSession === "overlap" && "Session Overlap"}
              {currentSession === "off" && "Off-Hours"}
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">DEMO</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── Top Focus Pairs ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-200">Top Focus Pairs</h2>
            <span className="text-[10px] text-slate-500">Ranked by AI focus score</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {focusPairs
              .sort((a, b) => b.score - a.score)
              .map((pair) => (
                <div
                  key={pair.symbol}
                  className="bg-[#0a0e1a] border border-slate-800/60 rounded-xl p-4 hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{pair.symbol}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${pair.changePercent >= 0 ? "bg-teal-500/15 text-teal-400" : "bg-red-500/15 text-red-400"}`}>
                        {pair.changePercent >= 0 ? "+" : ""}{pair.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    {/* Focus Score */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pair.score >= 80 ? "bg-teal-400" : pair.score >= 60 ? "bg-amber-400" : "bg-slate-500"}`}
                          style={{ width: `${pair.score}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${pair.score >= 80 ? "text-teal-400" : pair.score >= 60 ? "text-amber-400" : "text-slate-500"}`}>
                        {pair.score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium capitalize ${biasBg(pair.bias)}`}>
                      <BiasIcon bias={pair.bias} />
                      <span className={biasColor(pair.bias)}>{pair.bias}</span>
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium capitalize ${volBg(pair.volatility)}`}>
                      {pair.volatility === "high" ? <Flame className="h-2.5 w-2.5" /> : pair.volatility === "low" ? <Snowflake className="h-2.5 w-2.5" /> : <Activity className="h-2.5 w-2.5" />}
                      <span className={volColor(pair.volatility)}>{pair.volatility}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{pair.reason}</p>
                </div>
              ))}
          </div>
        </section>

        {/* ── Session Bias / Market Mood ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-200">Session Bias</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sessions.map((s) => (
              <div
                key={s.name}
                className={`bg-[#0a0e1a] border rounded-xl p-4 transition-all ${
                  s.active ? "border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.08)]" : "border-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                    {s.active && (
                      <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <BiasIcon bias={s.bias} />
                </div>
                <div className="text-[10px] text-slate-500 mb-2 font-mono">{s.opens} – {s.closes} UTC</div>
                <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border w-fit font-medium capitalize ${biasBg(s.bias)}`}>
                  <span className={biasColor(s.bias)}>{s.bias}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{s.mood}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Volatility Snapshot ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-200">Volatility Snapshot</h2>
            <span className="text-[10px] text-slate-500">ATR-based (14-period)</span>
          </div>
          <div className="bg-[#0a0e1a] border border-slate-800/60 rounded-xl overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate-800/40 text-slate-500">
                  <th className="text-left px-4 py-2.5 font-medium">Pair</th>
                  <th className="text-right px-3 py-2.5 font-medium">ATR</th>
                  <th className="text-right px-3 py-2.5 font-medium hidden sm:table-cell">ATR %</th>
                  <th className="text-center px-3 py-2.5 font-medium">Level</th>
                  <th className="text-center px-4 py-2.5 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {volatility.map((v) => (
                  <tr key={v.symbol} className="border-b border-slate-800/20 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-200">{v.symbol}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-300">{v.atr}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-400 hidden sm:table-cell">{v.atrPercent.toFixed(2)}%</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium capitalize ${volBg(v.level)}`}>
                        {v.level === "high" ? <Flame className="h-2.5 w-2.5" /> : v.level === "low" ? <Snowflake className="h-2.5 w-2.5" /> : <Activity className="h-2.5 w-2.5" />}
                        <span className={volColor(v.level)}>{v.level}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-[10px] font-medium capitalize ${v.trend === "rising" ? "text-amber-400" : v.trend === "falling" ? "text-teal-400" : "text-slate-500"}`}>
                        {v.trend === "rising" ? "↑" : v.trend === "falling" ? "↓" : "→"} {v.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── AI Suggested Watchlist ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-200">AI Suggested Watchlist</h2>
            <span className="text-[10px] text-slate-500">Erek-X Intelligence</span>
          </div>
          <div className="space-y-2.5">
            {suggestions.map((s) => (
              <div
                key={s.symbol}
                className="bg-[#0a0e1a] border border-slate-800/60 rounded-xl p-4 hover:border-teal-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-slate-100">{s.symbol}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold uppercase ${actionColor(s.action)}`}>
                        {s.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{s.reason}</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <div className="relative h-10 w-10">
                      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="14" fill="none"
                          stroke={s.confidence >= 80 ? "#14b8a6" : s.confidence >= 60 ? "#f59e0b" : "#64748b"}
                          strokeWidth="3"
                          strokeDasharray={`${(s.confidence / 100) * 88} 88`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-200">
                        {s.confidence}
                      </span>
                    </div>
                    <span className="text-[8px] text-slate-500">conf.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-600">
            Erek-X Market Focus is AI-generated analysis for educational purposes. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
