"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  StarOff,
  AlertTriangle,
  Shield,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Sparkles,
  Eye,
  X,
  BarChart3,
  Crosshair,
  Activity,
  Zap,
  MessageCircle,
  ChevronLeft,
  ListChecks,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type OrderSide = "buy" | "sell";
type OrderType = "market" | "pending";
type TradeStatus = "open" | "pending" | "closed";

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  spread: number;
  category: string;
  favorite: boolean;
}

interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  lotSize: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  status: TradeStatus;
  pnl: number;
  openedAt: string;
  closedAt?: string;
  pendingPrice?: number;
}

interface DisciplineWarning {
  type: "overtrading" | "revenge" | "risk" | "streak";
  message: string;
  severity: "warning" | "danger";
}

interface MemoryWarning {
  pair: string;
  message: string;
  winRate: number;
  avgPnl: number;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const INITIAL_ASSETS: Asset[] = [
  { symbol: "EURUSD", name: "Euro / US Dollar", price: 1.08542, change: 0.00032, changePercent: 0.03, bid: 1.08540, ask: 1.08544, spread: 0.4, category: "Forex", favorite: true },
  { symbol: "GBPUSD", name: "Pound / US Dollar", price: 1.26318, change: -0.00145, changePercent: -0.11, bid: 1.26315, ask: 1.26321, spread: 0.6, category: "Forex", favorite: true },
  { symbol: "USDJPY", name: "US Dollar / Yen", price: 149.852, change: 0.234, changePercent: 0.16, bid: 149.850, ask: 149.854, spread: 0.4, category: "Forex", favorite: false },
  { symbol: "XAUUSD", name: "Gold / US Dollar", price: 2648.35, change: 12.45, changePercent: 0.47, bid: 2648.20, ask: 2648.50, spread: 30, category: "Metals", favorite: true },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", price: 97245.0, change: 1523.0, changePercent: 1.59, bid: 97240.0, ask: 97250.0, spread: 10, category: "Crypto", favorite: false },
  { symbol: "GBPJPY", name: "Pound / Yen", price: 189.325, change: -0.456, changePercent: -0.24, bid: 189.320, ask: 189.330, spread: 1.0, category: "Forex", favorite: false },
  { symbol: "AUDUSD", name: "Aussie / US Dollar", price: 0.65234, change: 0.00089, changePercent: 0.14, bid: 0.65232, ask: 0.65236, spread: 0.4, category: "Forex", favorite: false },
  { symbol: "US30", name: "Dow Jones 30", price: 43856.5, change: 125.5, changePercent: 0.29, bid: 43855.0, ask: 43858.0, spread: 3.0, category: "Indices", favorite: false },
  { symbol: "NAS100", name: "Nasdaq 100", price: 19542.8, change: -45.2, changePercent: -0.23, bid: 19542.0, ask: 19543.6, spread: 1.6, category: "Indices", favorite: false },
  { symbol: "ETHUSD", name: "Ethereum / US Dollar", price: 3456.20, change: 78.50, changePercent: 2.32, bid: 3455.50, ask: 3456.90, spread: 1.4, category: "Crypto", favorite: false },
];

const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: "trend", label: "Trend confirmed on HTF", checked: false },
  { id: "key-level", label: "At key support/resistance", checked: false },
  { id: "confluence", label: "2+ confluences present", checked: false },
  { id: "rr", label: "Risk:Reward ≥ 1:2", checked: false },
  { id: "risk", label: "Risk ≤ 2% of capital", checked: false },
  { id: "news", label: "No high-impact news ahead", checked: false },
];

const DEMO_BALANCE = 10000;

// ─── Utility ────────────────────────────────────────────────────────────────
function generateId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatPrice(price: number, symbol: string) {
  if (symbol.includes("JPY") || symbol === "US30" || symbol === "NAS100") return price.toFixed(1);
  if (symbol === "XAUUSD") return price.toFixed(2);
  if (symbol === "BTCUSD" || symbol === "ETHUSD") return price.toFixed(2);
  return price.toFixed(5);
}

function formatPnl(pnl: number) {
  const sign = pnl >= 0 ? "+" : "";
  return `${sign}$${pnl.toFixed(2)}`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ─── Chart Component (Mock) ────────────────────────────────────────────────
function MockChart({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Generate initial candlestick-like path
    const points: number[] = [];
    let y = 50;
    for (let i = 0; i < 120; i++) {
      y += (Math.random() - 0.48) * 3;
      y = Math.max(10, Math.min(90, y));
      points.push(y);
    }
    pointsRef.current = points;
  }, [symbol]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const isUp = change >= 0;

    function draw() {
      if (!ctx || !canvas) return;
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(148,163,184,0.06)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = (h / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let i = 1; i < 8; i++) {
        const x = (w / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const pts = pointsRef.current;
      if (pts.length < 2) return;

      // Animate last point
      const shift = Math.sin(frame * 0.03) * 1.5;
      const animPts = [...pts];
      animPts[animPts.length - 1] += shift;

      // Draw candlesticks
      const barW = w / animPts.length;
      for (let i = 1; i < animPts.length; i++) {
        const x = i * barW;
        const open = (animPts[i - 1] / 100) * h;
        const close = (animPts[i] / 100) * h;
        const up = close < open;
        const high = Math.min(open, close) - Math.random() * 4;
        const low = Math.max(open, close) + Math.random() * 4;

        // Wick
        ctx.strokeStyle = up ? "rgba(20,184,166,0.5)" : "rgba(239,68,68,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, high);
        ctx.lineTo(x, low);
        ctx.stroke();

        // Body
        ctx.fillStyle = up ? "rgba(20,184,166,0.8)" : "rgba(239,68,68,0.8)";
        const bodyTop = Math.min(open, close);
        const bodyH = Math.max(Math.abs(close - open), 1);
        ctx.fillRect(x - barW * 0.35, bodyTop, barW * 0.7, bodyH);
      }

      // Price line
      const lastY = (animPts[animPts.length - 1] / 100) * h;
      ctx.strokeStyle = isUp ? "rgba(20,184,166,0.4)" : "rgba(239,68,68,0.4)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, lastY);
      ctx.lineTo(w, lastY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price label
      ctx.fillStyle = isUp ? "#14b8a6" : "#ef4444";
      ctx.fillRect(w - 72, lastY - 10, 72, 20);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(formatPrice(price, symbol), w - 36, lastY + 4);

      frame++;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [symbol, price, change]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Main Terminal ──────────────────────────────────────────────────────────
export default function TerminalPage() {
  // ── State ──
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [lotSize, setLotSize] = useState("0.01");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [pendingPrice, setPendingPrice] = useState("");
  const [bottomTab, setBottomTab] = useState<TradeStatus>("open");
  const [balance, setBalance] = useState(DEMO_BALANCE);
  const [equity, setEquity] = useState(DEMO_BALANCE);
  const [watchlistFilter, setWatchlistFilter] = useState("All");
  const [watchlistSearch, setWatchlistSearch] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [showCoachHint, setShowCoachHint] = useState(false);
  const [coachMessage, setCoachMessage] = useState("");
  const [disciplineWarnings, setDisciplineWarnings] = useState<DisciplineWarning[]>([]);
  const [memoryWarning, setMemoryWarning] = useState<MemoryWarning | null>(null);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [pendingExecution, setPendingExecution] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"chart" | "watchlist" | "order">("chart");
  const [showMobilePositions, setShowMobilePositions] = useState(false);

  const selectedAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];

  // ── Price Simulation ──
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const volatility = a.category === "Crypto" ? 0.001 : a.category === "Metals" ? 0.0003 : a.category === "Indices" ? 0.0002 : 0.00008;
          const delta = (Math.random() - 0.5) * a.price * volatility;
          const newPrice = Math.max(0.00001, a.price + delta);
          const spreadHalf = a.spread / 2 / (a.symbol.includes("JPY") || a.symbol === "US30" || a.symbol === "NAS100" ? 10 : 100000);
          return {
            ...a,
            price: newPrice,
            bid: newPrice - spreadHalf,
            ask: newPrice + spreadHalf,
            change: a.change + delta,
            changePercent: ((a.change + delta) / (a.price - a.change)) * 100,
          };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // ── Update open trades PnL ──
  useEffect(() => {
    setTrades((prev) => {
      let totalPnl = 0;
      const updated = prev.map((t) => {
        if (t.status !== "open") return t;
        const asset = assets.find((a) => a.symbol === t.symbol);
        if (!asset) return t;
        const currentPrice = t.side === "buy" ? asset.bid : asset.ask;
        const pipValue = t.symbol.includes("JPY") ? 0.01 : t.symbol === "XAUUSD" ? 0.01 : t.symbol === "BTCUSD" || t.symbol === "ETHUSD" ? 0.01 : t.symbol === "US30" || t.symbol === "NAS100" ? 0.1 : 0.0001;
        const pips = t.side === "buy"
          ? (currentPrice - t.entryPrice) / pipValue
          : (t.entryPrice - currentPrice) / pipValue;
        const pnl = pips * t.lotSize * 10;

        // Check SL/TP
        let status: TradeStatus = "open";
        let closedAt: string | undefined;
        if (t.stopLoss && t.side === "buy" && currentPrice <= t.stopLoss) {
          status = "closed";
          closedAt = new Date().toISOString();
        } else if (t.stopLoss && t.side === "sell" && currentPrice >= t.stopLoss) {
          status = "closed";
          closedAt = new Date().toISOString();
        } else if (t.takeProfit && t.side === "buy" && currentPrice >= t.takeProfit) {
          status = "closed";
          closedAt = new Date().toISOString();
        } else if (t.takeProfit && t.side === "sell" && currentPrice <= t.takeProfit) {
          status = "closed";
          closedAt = new Date().toISOString();
        }

        if (status === "open") totalPnl += pnl;
        return { ...t, currentPrice, pnl, status, closedAt: closedAt || t.closedAt };
      });

      // Check pending orders
      const finalTrades = updated.map((t) => {
        if (t.status !== "pending" || !t.pendingPrice) return t;
        const asset = assets.find((a) => a.symbol === t.symbol);
        if (!asset) return t;
        const triggered =
          (t.side === "buy" && asset.ask <= t.pendingPrice) ||
          (t.side === "sell" && asset.bid >= t.pendingPrice);
        if (triggered) {
          return {
            ...t,
            status: "open" as TradeStatus,
            entryPrice: t.pendingPrice,
            currentPrice: t.side === "buy" ? asset.bid : asset.ask,
          };
        }
        return t;
      });

      setEquity(DEMO_BALANCE + totalPnl);
      return finalTrades;
    });
  }, [assets]);

  // ── Erek-X Intelligence ──
  const checkDiscipline = useCallback(() => {
    const warnings: DisciplineWarning[] = [];
    const openCount = trades.filter((t) => t.status === "open").length;
    const recentClosed = trades.filter(
      (t) => t.status === "closed" && t.closedAt && Date.now() - new Date(t.closedAt).getTime() < 300000
    );
    const recentLosses = recentClosed.filter((t) => t.pnl < 0);

    if (openCount >= 3) {
      warnings.push({ type: "overtrading", message: `You have ${openCount} open trades. Consider managing existing positions first.`, severity: "warning" });
    }
    if (openCount >= 5) {
      warnings.push({ type: "overtrading", message: `${openCount} open positions is excessive. High exposure risk detected.`, severity: "danger" });
    }
    if (recentLosses.length >= 2) {
      warnings.push({ type: "revenge", message: `${recentLosses.length} losses in last 5 min. Possible revenge trading — take a break.`, severity: "danger" });
    }
    const totalRisk = trades.filter((t) => t.status === "open").reduce((sum, t) => sum + Math.abs(t.pnl), 0);
    if (totalRisk > balance * 0.05) {
      warnings.push({ type: "risk", message: `Open risk exceeds 5% of balance. Consider reducing exposure.`, severity: "danger" });
    }

    return warnings;
  }, [trades, balance]);

  const checkMemory = useCallback(
    (symbol: string): MemoryWarning | null => {
      const symbolTrades = trades.filter((t) => t.symbol === symbol && t.status === "closed");
      if (symbolTrades.length < 2) return null;
      const wins = symbolTrades.filter((t) => t.pnl > 0).length;
      const winRate = (wins / symbolTrades.length) * 100;
      const avgPnl = symbolTrades.reduce((sum, t) => sum + t.pnl, 0) / symbolTrades.length;

      if (winRate < 40) {
        return {
          pair: symbol,
          message: `Your win rate on ${symbol} is only ${winRate.toFixed(0)}%. Consider reviewing your strategy for this pair.`,
          winRate,
          avgPnl,
        };
      }
      return null;
    },
    [trades]
  );

  const getCoachHint = useCallback(() => {
    const checkedCount = checklist.filter((c) => c.checked).length;
    const asset = selectedAsset;

    if (checkedCount < 3) {
      return "Complete your pre-trade checklist before entering. Discipline separates pros from gamblers.";
    }
    if (Math.abs(asset.changePercent) > 1) {
      return `${asset.symbol} is showing ${asset.changePercent > 0 ? "strong bullish" : "strong bearish"} momentum (${asset.changePercent.toFixed(2)}%). Wait for a pullback or confirm trend continuation.`;
    }
    if (orderSide === "buy" && asset.changePercent < -0.3) {
      return "Buying into a declining market? Make sure you have strong reversal signals and proper risk management.";
    }
    if (orderSide === "sell" && asset.changePercent > 0.3) {
      return "Selling into a rally? Counter-trend trades need extra confirmation. Check for exhaustion signals.";
    }
    return "Setup looks reasonable. Ensure your stop loss is at a logical level and stick to your plan.";
  }, [checklist, selectedAsset, orderSide]);

  // ── Execute Trade ──
  const executeTrade = () => {
    const asset = selectedAsset;
    const lots = parseFloat(lotSize);
    if (isNaN(lots) || lots <= 0) return;

    const sl = stopLoss ? parseFloat(stopLoss) : null;
    const tp = takeProfit ? parseFloat(takeProfit) : null;

    if (orderType === "market") {
      const entry = orderSide === "buy" ? asset.ask : asset.bid;
      const trade: Trade = {
        id: generateId(),
        symbol: asset.symbol,
        side: orderSide,
        type: "market",
        lotSize: lots,
        entryPrice: entry,
        currentPrice: entry,
        stopLoss: sl,
        takeProfit: tp,
        status: "open",
        pnl: 0,
        openedAt: new Date().toISOString(),
      };
      setTrades((prev) => [trade, ...prev]);
      setBottomTab("open");
    } else {
      const pp = parseFloat(pendingPrice);
      if (isNaN(pp) || pp <= 0) return;
      const trade: Trade = {
        id: generateId(),
        symbol: asset.symbol,
        side: orderSide,
        type: "pending",
        lotSize: lots,
        entryPrice: 0,
        currentPrice: asset.price,
        stopLoss: sl,
        takeProfit: tp,
        status: "pending",
        pnl: 0,
        openedAt: new Date().toISOString(),
        pendingPrice: pp,
      };
      setTrades((prev) => [trade, ...prev]);
      setBottomTab("pending");
    }

    // Reset
    setStopLoss("");
    setTakeProfit("");
    setPendingPrice("");
    setShowDisciplineModal(false);
    setPendingExecution(false);
    setShowChecklist(false);
  };

  const handlePlaceOrder = () => {
    const warnings = checkDiscipline();
    const memWarn = checkMemory(selectedSymbol);
    setDisciplineWarnings(warnings);
    setMemoryWarning(memWarn);

    if (warnings.length > 0 || memWarn) {
      setShowDisciplineModal(true);
      setPendingExecution(true);
    } else {
      executeTrade();
    }
  };

  const closeTrade = (tradeId: string) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === tradeId ? { ...t, status: "closed" as TradeStatus, closedAt: new Date().toISOString() } : t
      )
    );
  };

  const cancelPending = (tradeId: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== tradeId));
  };

  const toggleFavorite = (symbol: string) => {
    setAssets((prev) => prev.map((a) => (a.symbol === symbol ? { ...a, favorite: !a.favorite } : a)));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  // ── Filtered Data ──
  const categories = ["All", "Favorites", "Forex", "Metals", "Crypto", "Indices"];
  const filteredAssets = assets.filter((a) => {
    const matchCat = watchlistFilter === "All" || (watchlistFilter === "Favorites" ? a.favorite : a.category === watchlistFilter);
    const matchSearch = !watchlistSearch || a.symbol.toLowerCase().includes(watchlistSearch.toLowerCase()) || a.name.toLowerCase().includes(watchlistSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const openTrades = trades.filter((t) => t.status === "open");
  const pendingTrades = trades.filter((t) => t.status === "pending");
  const closedTrades = trades.filter((t) => t.status === "closed");
  const filteredTrades = bottomTab === "open" ? openTrades : bottomTab === "pending" ? pendingTrades : closedTrades;
  const totalOpenPnl = openTrades.reduce((s, t) => s + t.pnl, 0);
  const checkedCount = checklist.filter((c) => c.checked).length;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-50 overflow-hidden select-none">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between border-b border-slate-800/60 bg-[#0a0e1a]/95 backdrop-blur-sm px-3 py-1.5 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent hidden sm:inline">
                Erek-X
              </span>
            </div>
          </a>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 hidden sm:inline">Terminal</span>
          <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">DEMO</span>
        </div>

        {/* Asset Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100">{selectedAsset.symbol}</span>
            <span className={`text-xs font-mono font-semibold ${selectedAsset.change >= 0 ? "text-teal-400" : "text-red-400"}`}>
              {formatPrice(selectedAsset.price, selectedAsset.symbol)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${selectedAsset.changePercent >= 0 ? "bg-teal-500/15 text-teal-400" : "bg-red-500/15 text-red-400"}`}>
              {selectedAsset.changePercent >= 0 ? "+" : ""}{selectedAsset.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-3">
            <div>
              <span className="text-slate-500">Balance: </span>
              <span className="font-mono text-slate-200">${balance.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500">Equity: </span>
              <span className={`font-mono ${equity >= balance ? "text-teal-400" : "text-red-400"}`}>${equity.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500">P&L: </span>
              <span className={`font-mono font-semibold ${totalOpenPnl >= 0 ? "text-teal-400" : "text-red-400"}`}>
                {formatPnl(totalOpenPnl)}
              </span>
            </div>
          </div>
          {/* Checklist badge */}
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all text-[10px] font-medium ${
              checkedCount === checklist.length
                ? "border-teal-500/40 bg-teal-500/10 text-teal-400"
                : checkedCount > 0
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-slate-700 bg-slate-800/50 text-slate-400"
            }`}
          >
            <ListChecks className="h-3 w-3" />
            <span>{checkedCount}/{checklist.length}</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Tab Switcher ── */}
      <div className="flex md:hidden border-b border-slate-800/60 bg-[#0a0e1a]/80">
        {(["chart", "watchlist", "order"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobilePanel(tab)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
              mobilePanel === tab ? "text-teal-400 border-b-2 border-teal-400" : "text-slate-500"
            }`}
          >
            {tab === "order" ? "Trade" : tab}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chart Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${mobilePanel !== "chart" ? "hidden md:flex" : "flex"}`}>
          {/* Chart toolbar */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-800/40 bg-[#070b14]">
            <div className="flex items-center gap-1">
              {["M1", "M5", "M15", "H1", "H4", "D1"].map((tf) => (
                <button
                  key={tf}
                  className="px-2 py-0.5 text-[10px] font-medium rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors"><Crosshair className="h-3.5 w-3.5" /></button>
              <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors"><BarChart3 className="h-3.5 w-3.5" /></button>
              <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors"><Activity className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>B: <span className="text-teal-400 font-mono">{formatPrice(selectedAsset.bid, selectedAsset.symbol)}</span></span>
              <span>A: <span className="text-red-400 font-mono">{formatPrice(selectedAsset.ask, selectedAsset.symbol)}</span></span>
              <span>Sp: <span className="text-slate-400 font-mono">{selectedAsset.spread.toFixed(1)}</span></span>
            </div>
          </div>

          {/* Chart canvas */}
          <div className="flex-1 relative bg-[#060a12] min-h-0">
            <MockChart symbol={selectedAsset.symbol} price={selectedAsset.price} change={selectedAsset.change} />

            {/* Checklist Overlay */}
            {showChecklist && (
              <div className="absolute top-3 left-3 z-10 w-72 bg-[#0c1020]/95 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-400" />
                    <span className="text-xs font-semibold text-slate-200">Pre-Trade Checklist</span>
                  </div>
                  <button onClick={() => setShowChecklist(false)} className="text-slate-500 hover:text-slate-300">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3 space-y-1.5">
                  {checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs transition-all ${
                        item.checked
                          ? "bg-teal-500/10 border border-teal-500/30 text-teal-300"
                          : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {item.checked ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-800/60">
                  <div className={`text-[10px] font-medium ${checkedCount === checklist.length ? "text-teal-400" : "text-amber-400"}`}>
                    {checkedCount === checklist.length ? "All checks passed — ready to trade" : `${checklist.length - checkedCount} items remaining`}
                  </div>
                </div>
              </div>
            )}

            {/* AI Coach Hint */}
            {showCoachHint && coachMessage && (
              <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-80 z-10 bg-[#0c1020]/95 backdrop-blur-md border border-teal-500/30 rounded-xl shadow-2xl">
                <div className="flex items-start gap-2.5 p-3">
                  <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center mt-0.5">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">AI Coach</span>
                      <button onClick={() => setShowCoachHint(false)} className="text-slate-500 hover:text-slate-300">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{coachMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Bottom Trades Panel ── */}
          <div className="border-t border-slate-800/60 bg-[#070b14] flex-shrink-0">
            {/* Tabs + Toggle on mobile */}
            <div className="flex items-center justify-between px-3 border-b border-slate-800/40">
              <div className="flex items-center gap-0.5">
                {(["open", "pending", "closed"] as const).map((tab) => {
                  const count = tab === "open" ? openTrades.length : tab === "pending" ? pendingTrades.length : closedTrades.length;
                  return (
                    <button
                      key={tab}
                      onClick={() => { setBottomTab(tab); setShowMobilePositions(true); }}
                      className={`px-3 py-2 text-[11px] font-medium capitalize transition-colors relative ${
                        bottomTab === tab ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {tab}
                      {count > 0 && (
                        <span className={`ml-1 text-[9px] px-1 py-0 rounded-full ${
                          bottomTab === tab ? "bg-teal-500/20 text-teal-400" : "bg-slate-700/50 text-slate-500"
                        }`}>
                          {count}
                        </span>
                      )}
                      {bottomTab === tab && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />}
                    </button>
                  );
                })}
              </div>
              {/* Mobile: balance row */}
              <div className="flex md:hidden items-center gap-2 text-[10px]">
                <span className="text-slate-500">Eq:</span>
                <span className={`font-mono ${equity >= balance ? "text-teal-400" : "text-red-400"}`}>${equity.toFixed(2)}</span>
              </div>
            </div>

            {/* Trades Table */}
            <div className="max-h-36 overflow-y-auto scrollbar-thin">
              {filteredTrades.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-xs text-slate-600">
                  No {bottomTab} trades
                </div>
              ) : (
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800/30">
                      <th className="text-left px-3 py-1.5 font-medium">Symbol</th>
                      <th className="text-left px-2 py-1.5 font-medium">Side</th>
                      <th className="text-right px-2 py-1.5 font-medium">Lots</th>
                      <th className="text-right px-2 py-1.5 font-medium hidden sm:table-cell">Entry</th>
                      <th className="text-right px-2 py-1.5 font-medium hidden sm:table-cell">Current</th>
                      <th className="text-right px-2 py-1.5 font-medium hidden md:table-cell">SL</th>
                      <th className="text-right px-2 py-1.5 font-medium hidden md:table-cell">TP</th>
                      <th className="text-right px-2 py-1.5 font-medium">P&L</th>
                      <th className="text-right px-3 py-1.5 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.map((t) => (
                      <tr key={t.id} className="border-b border-slate-800/20 hover:bg-slate-800/20 transition-colors">
                        <td className="px-3 py-1.5 font-medium text-slate-200">{t.symbol}</td>
                        <td className="px-2 py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            t.side === "buy" ? "bg-teal-500/15 text-teal-400" : "bg-red-500/15 text-red-400"
                          }`}>
                            {t.side}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-300">{t.lotSize.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-400 hidden sm:table-cell">
                          {t.status === "pending" ? formatPrice(t.pendingPrice || 0, t.symbol) : formatPrice(t.entryPrice, t.symbol)}
                        </td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-400 hidden sm:table-cell">{formatPrice(t.currentPrice, t.symbol)}</td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-500 hidden md:table-cell">{t.stopLoss ? formatPrice(t.stopLoss, t.symbol) : "—"}</td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-500 hidden md:table-cell">{t.takeProfit ? formatPrice(t.takeProfit, t.symbol) : "—"}</td>
                        <td className={`px-2 py-1.5 text-right font-mono font-semibold ${t.pnl >= 0 ? "text-teal-400" : "text-red-400"}`}>
                          {t.status === "pending" ? "—" : formatPnl(t.pnl)}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {t.status === "open" && (
                            <button
                              onClick={() => closeTrade(t.id)}
                              className="text-[9px] px-2 py-0.5 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors font-medium"
                            >
                              Close
                            </button>
                          )}
                          {t.status === "pending" && (
                            <button
                              onClick={() => cancelPending(t.id)}
                              className="text-[9px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 hover:bg-slate-700 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          {t.status === "closed" && (
                            <span className="text-[9px] text-slate-600">{t.closedAt ? formatTime(t.closedAt) : ""}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Watchlist + Order ── */}
        <div className={`w-full md:w-80 lg:w-[340px] flex-shrink-0 border-l border-slate-800/60 bg-[#070b14] flex flex-col overflow-hidden ${
          mobilePanel === "chart" ? "hidden md:flex" : mobilePanel === "watchlist" || mobilePanel === "order" ? "flex" : "hidden md:flex"
        }`}>
          {/* Watchlist (visible on desktop always, mobile when tab selected) */}
          <div className={`flex-1 flex flex-col min-h-0 overflow-hidden ${mobilePanel === "order" ? "hidden md:flex" : "flex"}`}>
            {/* Search */}
            <div className="px-3 pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={watchlistSearch}
                  onChange={(e) => setWatchlistSearch(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWatchlistFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                    watchlistFilter === cat
                      ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                      : "text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-800/40"
                  }`}
                >
                  {cat === "Favorites" ? "★ Fav" : cat}
                </button>
              ))}
            </div>

            {/* Asset List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredAssets.map((a) => (
                <button
                  key={a.symbol}
                  onClick={() => { setSelectedSymbol(a.symbol); if (mobilePanel === "watchlist") setMobilePanel("chart"); }}
                  className={`w-full flex items-center justify-between px-3 py-2 border-b border-slate-800/20 transition-all hover:bg-slate-800/30 ${
                    a.symbol === selectedSymbol ? "bg-teal-500/5 border-l-2 border-l-teal-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(a.symbol); }}
                      className="text-slate-600 hover:text-amber-400 transition-colors flex-shrink-0"
                    >
                      {a.favorite ? <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> : <StarOff className="h-3 w-3" />}
                    </button>
                    <div className="text-left min-w-0">
                      <div className="text-[11px] font-semibold text-slate-200">{a.symbol}</div>
                      <div className="text-[9px] text-slate-500 truncate">{a.name}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] font-mono font-medium text-slate-200">{formatPrice(a.price, a.symbol)}</div>
                    <div className={`text-[9px] font-mono ${a.changePercent >= 0 ? "text-teal-400" : "text-red-400"}`}>
                      {a.changePercent >= 0 ? "+" : ""}{a.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Order Ticket ── */}
          <div className={`border-t border-slate-800/60 bg-[#0a0e1a] flex-shrink-0 ${mobilePanel === "watchlist" ? "hidden md:block" : "block"}`}>
            <div className="px-3 pt-3 pb-2">
              {/* Side Toggle */}
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => setOrderSide("buy")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    orderSide === "buy"
                      ? "bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                      : "bg-slate-800/60 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Buy
                  </span>
                </button>
                <button
                  onClick={() => setOrderSide("sell")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    orderSide === "sell"
                      ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      : "bg-slate-800/60 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5" /> Sell
                  </span>
                </button>
              </div>

              {/* Market / Pending Toggle */}
              <div className="flex gap-1 mb-3 p-0.5 bg-slate-800/40 rounded-lg">
                <button
                  onClick={() => setOrderType("market")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold transition-all ${
                    orderType === "market" ? "bg-slate-700 text-slate-200 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType("pending")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold transition-all ${
                    orderType === "pending" ? "bg-slate-700 text-slate-200 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Pending
                </button>
              </div>

              {/* Price (for pending) */}
              {orderType === "pending" && (
                <div className="mb-2">
                  <label className="text-[10px] text-slate-500 mb-1 block">Pending Price</label>
                  <input
                    type="number"
                    step="any"
                    value={pendingPrice}
                    onChange={(e) => setPendingPrice(e.target.value)}
                    placeholder={formatPrice(selectedAsset.price, selectedAsset.symbol)}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              )}

              {/* Lot Size */}
              <div className="mb-2">
                <label className="text-[10px] text-slate-500 mb-1 block">Lot Size</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLotSize((v) => Math.max(0.01, parseFloat(v) - 0.01).toFixed(2))}
                    className="p-1.5 bg-slate-800/60 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-xs font-mono text-center text-slate-200 focus:outline-none focus:border-teal-500/50"
                  />
                  <button
                    onClick={() => setLotSize((v) => (parseFloat(v) + 0.01).toFixed(2))}
                    className="p-1.5 bg-slate-800/60 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Quick lots */}
                <div className="flex gap-1 mt-1.5">
                  {["0.01", "0.05", "0.10", "0.50", "1.00"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLotSize(l)}
                      className={`flex-1 py-1 rounded text-[9px] font-mono transition-all ${
                        lotSize === l
                          ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                          : "bg-slate-800/30 text-slate-500 border border-transparent hover:bg-slate-800/60"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* SL / TP */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Stop Loss</label>
                  <input
                    type="number"
                    step="any"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Take Profit</label>
                  <input
                    type="number"
                    step="any"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>

              {/* AI Coach Button */}
              <button
                onClick={() => {
                  setCoachMessage(getCoachHint());
                  setShowCoachHint(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[10px] font-medium hover:bg-teal-500/10 transition-all"
              >
                <Sparkles className="h-3 w-3" />
                Ask AI Coach
              </button>

              {/* Execute Button */}
              <button
                onClick={handlePlaceOrder}
                className={`w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                  orderSide === "buy"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] active:scale-[0.98]"
                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] active:scale-[0.98]"
                }`}
              >
                {orderSide === "buy" ? "Buy" : "Sell"} {selectedAsset.symbol}
              </button>

              {/* Price display */}
              <div className="flex justify-between mt-2 text-[10px]">
                <span className="text-slate-500">
                  at {orderType === "pending" ? "pending" : orderSide === "buy" ? "ask" : "bid"}:
                </span>
                <span className="font-mono text-slate-300">
                  {orderType === "pending"
                    ? pendingPrice || "—"
                    : formatPrice(orderSide === "buy" ? selectedAsset.ask : selectedAsset.bid, selectedAsset.symbol)
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Discipline Warning Modal ── */}
      {showDisciplineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0c1020] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800/60 bg-gradient-to-r from-amber-500/10 to-red-500/10">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">Erek-X Discipline Guard</div>
                <div className="text-[10px] text-slate-400">Review before proceeding</div>
              </div>
            </div>

            {/* Warnings */}
            <div className="px-5 py-4 space-y-3 max-h-60 overflow-y-auto">
              {disciplineWarnings.map((w, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                    w.severity === "danger"
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  }`}
                >
                  <Shield className={`h-4 w-4 flex-shrink-0 mt-0.5 ${w.severity === "danger" ? "text-red-400" : "text-amber-400"}`} />
                  <p className="text-xs text-slate-300 leading-relaxed">{w.message}</p>
                </div>
              ))}

              {memoryWarning && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg border bg-purple-500/10 border-purple-500/30">
                  <Brain className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{memoryWarning.message}</p>
                    <div className="flex gap-3 mt-1.5 text-[10px]">
                      <span className="text-purple-400">Win Rate: {memoryWarning.winRate.toFixed(0)}%</span>
                      <span className={memoryWarning.avgPnl >= 0 ? "text-teal-400" : "text-red-400"}>
                        Avg P&L: {formatPnl(memoryWarning.avgPnl)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Status */}
              <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                checkedCount === checklist.length
                  ? "bg-teal-500/10 border-teal-500/30"
                  : "bg-slate-800/40 border-slate-700/40"
              }`}>
                <ListChecks className={`h-4 w-4 flex-shrink-0 mt-0.5 ${checkedCount === checklist.length ? "text-teal-400" : "text-slate-500"}`} />
                <p className="text-xs text-slate-300">
                  Checklist: {checkedCount}/{checklist.length} completed
                  {checkedCount < checklist.length && " — consider completing before trading"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 px-5 py-4 border-t border-slate-800/60">
              <button
                onClick={() => { setShowDisciplineModal(false); setPendingExecution(false); }}
                className="flex-1 py-2.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel Trade
              </button>
              <button
                onClick={executeTrade}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-white transition-all ${
                  orderSide === "buy"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
