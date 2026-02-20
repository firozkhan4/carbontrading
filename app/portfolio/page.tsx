"use client";
import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const HOLDINGS = [
  {
    id: 1, name: "Amazon Rainforest Reserve", type: "Forestry", location: "Brazil", img: "🌳", verified: "Verra VCS", rare: true,
    qty: 3, buyPrice: 1820, currentPrice: 2045, co2: 100, acquired: "12 Jan 2025", status: "Active"
  },
  {
    id: 2, name: "Himalayan Glacier Guard", type: "Blue Carbon", location: "Nepal", img: "🏔️", verified: "ACR", rare: true,
    qty: 1, buyPrice: 2900, currentPrice: 3424, co2: 75, acquired: "28 Feb 2025", status: "Active"
  },
  {
    id: 3, name: "Mangrove Restoration", type: "Blue Carbon", location: "Indonesia", img: "🌊", verified: "Verra VCS", rare: false,
    qty: 2, buyPrice: 2750, currentPrice: 2689, co2: 180, acquired: "5 Mar 2025", status: "Active"
  },
  {
    id: 4, name: "Saharan Solar Farm", type: "Renewable", location: "Morocco", img: "☀️", verified: "Gold Standard", rare: false,
    qty: 4, buyPrice: 1620, currentPrice: 1578, co2: 250, acquired: "19 Mar 2025", status: "Active"
  },
  {
    id: 5, name: "Patagonia Peat Preserve", type: "Soil Carbon", location: "Chile", img: "🌿", verified: "ACR", rare: true,
    qty: 1, buyPrice: 3800, currentPrice: 4593, co2: 60, acquired: "2 Apr 2025", status: "Retired"
  },
];

const TRANSACTIONS = [
  { id: "TXN-8821", type: "Buy", name: "Amazon Rainforest Reserve", qty: 2, price: 1820, date: "12 Jan 2025", hash: "0x3f4a...9d2c", status: "Confirmed" },
  { id: "TXN-8834", type: "Buy", name: "Amazon Rainforest Reserve", qty: 1, price: 1820, date: "15 Jan 2025", hash: "0x7b2e...1a8f", status: "Confirmed" },
  { id: "TXN-8901", type: "Buy", name: "Himalayan Glacier Guard", qty: 1, price: 2900, date: "28 Feb 2025", hash: "0x9c1d...4e7a", status: "Confirmed" },
  { id: "TXN-9012", type: "Buy", name: "Mangrove Restoration", qty: 2, price: 2750, date: "5 Mar 2025", hash: "0x2e8f...7b3c", status: "Confirmed" },
  { id: "TXN-9134", type: "Buy", name: "Saharan Solar Farm", qty: 4, price: 1620, date: "19 Mar 2025", hash: "0x5a3b...0d1e", status: "Confirmed" },
  { id: "TXN-9241", type: "Buy", name: "Patagonia Peat Preserve", qty: 1, price: 3800, date: "2 Apr 2025", hash: "0x1c7d...8f4a", status: "Confirmed" },
  { id: "TXN-9388", type: "Retire", name: "Patagonia Peat Preserve", qty: 1, price: 4593, date: "18 Apr 2025", hash: "0x6e2a...3c9b", status: "Confirmed" },
];

const CHART_DATA = [
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
  { month: "Jan", value: 3640 * 100 },
  { month: "Feb", value: 3640 * 100 + 2900 * 100 },
  { month: "Mar", value: 3640 * 100 + 2900 * 100 + 5500 * 100 + 6480 * 100 },
  { month: "Apr", value: 4 * 3 * 2045 * 100 + 3424 * 100 + 2689 * 2 * 100 + 1578 * 4 * 100 + 4593 * 100 },
];

const TYPE_COLORS: Record<string, string> = {
  "Forestry": "#2dcc70",
  "Blue Carbon": "#3ab5f5",
  "Renewable": "#f5c842",
  "Soil Carbon": "#c87a2d",
};

// ─── COMPUTED ────────────────────────────────────────────────────────────────

const totalInvested = HOLDINGS.reduce((s, h) => s + h.buyPrice * h.qty * 100, 0);
const totalCurrentVal = HOLDINGS.reduce((s, h) => s + h.currentPrice * h.qty * 100, 0);
const totalPnL = totalCurrentVal - totalInvested;
const totalPnLPct = ((totalPnL / totalInvested) * 100).toFixed(2);
const totalCO2 = HOLDINGS.reduce((s, h) => s + h.co2 * h.qty, 0);
const totalNFTs = HOLDINGS.reduce((s, h) => s + h.qty, 0);
const retiredNFTs = HOLDINGS.filter(h => h.status === "Retired").reduce((s, h) => s + h.qty, 0);

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtCr = (n: number) => n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(2)} Cr` : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(2)} L` : fmt(n);

// allocation by type
const allocation = Object.entries(
  HOLDINGS.reduce((acc, h) => {
    const val = h.currentPrice * h.qty * 100;
    acc[h.type] = (acc[h.type] || 0) + val;
    return acc;
  }, {} as Record<string, number>)
).map(([type, val]) => ({ type, val, pct: ((val / totalCurrentVal) * 100).toFixed(1) }))
  .sort((a, b) => b.val - a.val);

// ─── MINI CHART ──────────────────────────────────────────────────────────────

function SparkLine({ data, color = "#2dcc70" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 200, H = 48;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(" ");
  const fill = `${pts} ${W},${H} 0,${H}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// portfolio value history (simple numbers)
const portfolioHistory = [0, 0, 0, 3_64_000, 6_57_000, 24_83_000, 28_76_000];

// ─── DONUT ────────────────────────────────────────────────────────────────────

function Donut({ slices }: { slices: { label: string; pct: number; color: string }[] }) {
  const R = 56, cx = 70, cy = 70, stroke = 22;
  const circ = 2 * Math.PI * R;
  let cum = 0;
  const segs = slices.map(s => {
    const len = (s.pct / 100) * circ;
    const off = circ - cum;
    cum += len;
    return { ...s, len, off };
  });
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#112018" strokeWidth={stroke} />
      {segs.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={R} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${s.len} ${circ - s.len}`}
          strokeDashoffset={s.off}
          strokeLinecap="butt"
          style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px", transition: "stroke-dasharray 0.8s ease" }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#E6F4EC" fontSize="13" fontWeight="800" fontFamily="Plus Jakarta Sans">
        {totalNFTs}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#5a9a72" fontSize="9.5" fontFamily="JetBrains Mono">
        NFTs
      </text>
    </svg>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [tab, setTab] = useState<"holdings" | "transactions">("holdings");
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const donutSlices = allocation.map(a => ({
    label: a.type, pct: parseFloat(a.pct), color: TYPE_COLORS[a.type] ?? "#888",
  }));

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#06100A", minHeight: "100vh", color: "#E6F4EC", lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; background: #0a1810; }
        ::-webkit-scrollbar-thumb { background: #1e4030; border-radius: 6px; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes ringPop { 0%{transform:scale(1);opacity:0.7;} 100%{transform:scale(2.4);opacity:0;} }
        @keyframes barGrow { from{transform:scaleY(0);} to{transform:scaleY(1);} }
        @keyframes shimmer { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }

        .fade-up { animation: fadeUp 0.5s ease both; }

        .nav-link { color:#6aad86; cursor:pointer; font-size:14px; font-weight:600; transition:color 0.2s; }
        .nav-link:hover { color:#2dcc70; }
        .nav-link.active { color:#2dcc70; border-bottom: 2px solid #2dcc70; padding-bottom: 2px; }

        .btn-primary {
          background: linear-gradient(135deg,#2dcc70,#1da856);
          color: #031508; font-weight:700; font-size:14px;
          border:none; border-radius:12px; padding:12px 24px;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
          transition:filter 0.2s,transform 0.15s;
        }
        .btn-primary:hover { filter:brightness(1.1); transform:scale(1.02); }

        .btn-ghost {
          background:transparent; color:#6aad86; font-weight:600; font-size:14px;
          border:1.5px solid #1e3a28; border-radius:12px; padding:11px 22px;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s;
        }
        .btn-ghost:hover { border-color:#2dcc70; color:#2dcc70; background:#2dcc7010; }

        .btn-sm {
          background:transparent; color:#6aad86; font-weight:600; font-size:12px;
          border:1px solid #1e3a28; border-radius:8px; padding:7px 14px;
          cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s;
        }
        .btn-sm:hover { border-color:#2dcc70; color:#2dcc70; }
        .btn-sm.danger:hover { border-color:#e83350; color:#e83350; background:#e8335010; }

        .card-base {
          background:linear-gradient(160deg,#0d1f16 0%,#081209 100%);
          border:1.5px solid #162a1e; border-radius:22px;
        }

        .stat-card {
          background:linear-gradient(160deg,#0d1f16,#081209);
          border:1.5px solid #162a1e; border-radius:20px; padding:24px 26px;
          transition:border-color 0.22s, transform 0.22s;
        }
        .stat-card:hover { border-color:#2dcc7040; transform:translateY(-2px); }

        .mono { font-family:'JetBrains Mono',monospace; }

        .section-label {
          font-size:11px; font-weight:600; letter-spacing:2.5px; color:#2dcc70;
          text-transform:uppercase; font-family:'JetBrains Mono',monospace;
        }

        .info-box { background:#08110d; border-radius:13px; padding:14px 16px; border:1px solid #112018; }

        .row-item {
          display:grid; align-items:center;
          border-bottom:1px solid #0f1e14;
          transition:background 0.18s;
          padding: 18px 20px;
        }
        .row-item:hover { background:#0d1e1490; }
        .row-item:last-child { border-bottom:none; }

        .tag {
          display:inline-flex; align-items:center; gap:5px;
          border-radius:8px; padding:4px 10px;
          font-size:11px; font-weight:600;
          font-family:'JetBrains Mono',monospace; letter-spacing:0.3px;
        }

        .live-pulse { display:inline-block; width:8px; height:8px; background:#2dcc70; border-radius:50%; animation:pulse 1.4s ease-in-out infinite; }
        .live-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; }
        .live-ring::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; border:1.5px solid #2dcc70; animation:ringPop 1.7s ease-out infinite; }

        .rare-dot { display:inline-block; width:7px; height:7px; background:linear-gradient(135deg,#f5a623,#f8c842); border-radius:50%; box-shadow:0 0 8px #f5a62360; }

        .tab-btn {
          background:transparent; border:none; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600;
          padding:10px 24px; border-radius:10px; transition:all 0.2s; color:#5a9a72;
        }
        .tab-btn.active { background:#2dcc7015; color:#2dcc70; }
        .tab-btn:not(.active):hover { color:#8abea0; background:#0f1e14; }

        .progress-bar { height:6px; border-radius:100px; background:#112018; overflow:hidden; }
        .progress-fill { height:100%; border-radius:100px; transition:width 0.8s cubic-bezier(.4,0,.2,1); }

        .dot-grid {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:radial-gradient(#1a3a2518 1px,transparent 1px);
          background-size:32px 32px;
        }
        .mesh-bg {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(ellipse 65% 50% at 10% 5%, #0d3d2018 0%,transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 90%, #0a2a3a14 0%,transparent 50%),
            radial-gradient(ellipse 35% 35% at 50% 50%, #2dcc7005 0%,transparent 70%);
        }

        .bar-wrap { display:flex; align-items:flex-end; gap:6px; height:80px; }
        .bar { border-radius:6px 6px 0 0; transform-origin:bottom; animation:barGrow 0.7s ease both; min-width:20px; flex:1; transition:filter 0.2s; cursor:pointer; }
        .bar:hover { filter:brightness(1.3); }

        input[type="text"] {
          background:#0d1e15; border:1.5px solid #1e3a28; color:#E6F4EC;
          border-radius:12px; padding:10px 16px 10px 42px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          outline:none; width:230px; transition:border-color 0.2s;
        }
        input[type="text"]:focus { border-color:#2dcc70; }
        input[type="text"]::placeholder { color:#3a6650; }
      `}</style>

      <div className="dot-grid" />
      <div className="mesh-bg" />

      {/* ━━━ NAV ━━━ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(24px)",
        background: scrolled ? "rgba(6,16,10,0.94)" : "rgba(6,16,10,0.72)",
        borderBottom: "1px solid #122018",
        padding: "0 44px", height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#2dcc70,#1a8a4a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 22px #2dcc7040" }}>🌍</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.7px" }}>CARBONEX</div>
            <div className="mono" style={{ fontSize: 9.5, color: "#3a6650", letterSpacing: "2.5px" }}>NFT CARBON MARKET</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 38 }}>
          {["Market", "Portfolio", "Analytics", "Bridge"].map(item => (
            <span key={item} className={`nav-link ${item === "Portfolio" ? "active" : ""}`}>{item}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#3a6650" }}>🔍</span>
            <input type="text" placeholder="Search…" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0d1e15", border: "1.5px solid #1e3a28", borderRadius: 12, padding: "8px 16px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#1da856,#0d6632)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🦊</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E6F4EC" }}>0x3f4a…9d2c</div>
              <div className="mono" style={{ fontSize: 10, color: "#3a6650" }}>● Connected</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ━━━ MAIN ━━━ */}
      <main style={{ position: "relative", zIndex: 1, padding: "52px 44px 80px", maxWidth: 1340, margin: "0 auto" }}>

        {/* ─── PAGE HEADER ─── */}
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>My Dashboard</div>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1.8px", color: "#E6F4EC", marginBottom: 6 }}>Portfolio</h1>
            <p style={{ color: "#5a9a72", fontSize: 14, fontWeight: 500 }}>
              Wallet: <span className="mono" style={{ color: "#8abea0" }}>0x3f4a...9d2c</span> · Last updated 2 min ago
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost">⬇ Export Report</button>
            <button className="btn-primary">+ Buy More Credits</button>
          </div>
        </div>

        {/* ─── HERO STATS ROW ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 18, marginBottom: 28 }}>

          {/* Total Value – wide card */}
          <div className="stat-card fade-up" style={{ gridColumn: "1", animationDelay: "0s", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10.5, color: "#3a6650", letterSpacing: "1.5px", marginBottom: 10 }}>TOTAL PORTFOLIO VALUE</div>
                <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-2px", color: "#E6F4EC" }}>{fmtCr(totalCurrentVal)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: totalPnL >= 0 ? "#2dcc70" : "#ff5555" }}>
                    {totalPnL >= 0 ? "▲" : "▼"} {fmtCr(Math.abs(totalPnL))}
                  </span>
                  <span className="mono" style={{ fontSize: 12, color: totalPnL >= 0 ? "#2dcc70" : "#ff5555" }}>
                    ({parseFloat(totalPnLPct) >= 0 ? "+" : ""}{totalPnLPct}%)
                  </span>
                  <span style={{ fontSize: 12, color: "#5a9a72" }}>all time</span>
                </div>
              </div>
              <SparkLine data={portfolioHistory} color="#2dcc70" />
            </div>
            <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: "1px solid #122018" }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "#3a6650", marginBottom: 4 }}>INVESTED</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{fmtCr(totalInvested)}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "#3a6650", marginBottom: 4 }}>UNREALIZED P&L</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: totalPnL >= 0 ? "#2dcc70" : "#ff5555" }}>
                  {totalPnL >= 0 ? "+" : ""}{fmtCr(totalPnL)}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "#3a6650", marginBottom: 4 }}>BEST PERFORMER</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#2dcc70" }}>Patagonia 🌿 +20.9%</div>
              </div>
            </div>
          </div>

          {/* NFTs held */}
          <div className="stat-card fade-up" style={{ animationDelay: "0.08s" }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>🪙</div>
            <div className="mono" style={{ fontSize: 10.5, color: "#3a6650", letterSpacing: "1.5px", marginBottom: 10 }}>NFTs HELD</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1.2px", marginBottom: 8 }}>{totalNFTs}</div>
            <div className="mono" style={{ fontSize: 12, color: "#5a9a72" }}>{retiredNFTs} retired</div>
          </div>

          {/* CO2 offset */}
          <div className="stat-card fade-up" style={{ animationDelay: "0.12s" }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>🌍</div>
            <div className="mono" style={{ fontSize: 10.5, color: "#3a6650", letterSpacing: "1.5px", marginBottom: 10 }}>CO₂ OFFSET</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1.2px", marginBottom: 8 }}>{totalCO2.toLocaleString("en-IN")} t</div>
            <div className="mono" style={{ fontSize: 12, color: "#2dcc70" }}>≈ 3,400 flights ✈️</div>
          </div>

          {/* Impact score */}
          <div className="stat-card fade-up" style={{ animationDelay: "0.16s" }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>⭐</div>
            <div className="mono" style={{ fontSize: 10.5, color: "#3a6650", letterSpacing: "1.5px", marginBottom: 10 }}>IMPACT SCORE</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1.2px", marginBottom: 8 }}>94<span style={{ fontSize: 16, color: "#5a9a72" }}>/100</span></div>
            <div className="mono" style={{ fontSize: 12, color: "#f5a623" }}>Gold Tier 🏅</div>
          </div>
        </div>

        {/* ─── PORTFOLIO BREAKDOWN + ALLOCATION ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 28 }}>

          {/* Bar chart – monthly value */}
          <div className="card-base fade-up" style={{ padding: "28px 32px", animationDelay: "0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 6 }}>Portfolio Value</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#E6F4EC" }}>Monthly Growth</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["1M", "3M", "6M", "All"].map((p, i) => (
                  <button key={p} className="btn-sm" style={i === 3 ? { borderColor: "#2dcc70", color: "#2dcc70", background: "#2dcc7010" } : {}}>{p}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, marginBottom: 12 }}>
              {CHART_DATA.map((d, i) => {
                const maxVal = Math.max(...CHART_DATA.map(x => x.value));
                const h = maxVal ? Math.max((d.value / maxVal) * 100, d.value > 0 ? 6 : 0) : 0;
                return (
                  <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                      <div style={{
                        width: "100%", height: `${h}%`, minHeight: d.value > 0 ? 6 : 0,
                        background: i === CHART_DATA.length - 1
                          ? "linear-gradient(180deg,#2dcc70,#1da856)"
                          : "#1a3a28",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.6s ease",
                        animationDelay: `${i * 0.1}s`,
                        cursor: "pointer",
                        position: "relative",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.3)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.filter = ""; }}
                        title={d.value > 0 ? fmtCr(d.value) : "–"}
                      />
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: "#3a6650" }}>{d.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation donut */}
          <div className="card-base fade-up" style={{ padding: "28px 26px", animationDelay: "0.24s" }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Allocation</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E6F4EC", marginBottom: 22 }}>By Project Type</div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <Donut slices={donutSlices} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allocation.map(a => (
                <div key={a.type}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: TYPE_COLORS[a.type] ?? "#888", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#C6E8D4" }}>{a.type}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span className="mono" style={{ fontSize: 12, color: "#5a9a72" }}>{a.pct}%</span>
                      <span className="mono" style={{ fontSize: 12, color: "#8abea0", fontWeight: 600 }}>{fmtCr(a.val)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${a.pct}%`, background: TYPE_COLORS[a.type] ?? "#888", opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── IMPACT HIGHLIGHTS ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 36 }}>
          {[
            { icon: "🌳", label: "Trees Equivalent", value: "18,400", sub: "protected" },
            { icon: "✈️", label: "Flights Offset", value: "3,400", sub: "economy class" },
            { icon: "🏭", label: "Factories Offset", value: "12", sub: "for 1 year" },
            { icon: "🏅", label: "Impact Rank", value: "Top 5%", sub: "on CARBONEX" },
          ].map((s, i) => (
            <div key={i} className="fade-up" style={{ background: "linear-gradient(145deg,#0d1f16,#081209)", border: "1.5px solid #162a1e", borderRadius: 18, padding: "20px 22px", animationDelay: `${0.28 + i * 0.06}s` }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
              <div className="mono" style={{ fontSize: 10, color: "#3a6650", letterSpacing: "1px", marginBottom: 8 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.8px", color: "#E6F4EC", marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#5a9a72" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ─── TABS: HOLDINGS / TRANSACTIONS ─── */}
        <div className="card-base fade-up" style={{ animationDelay: "0.4s" }}>
          {/* Tab header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0", borderBottom: "1px solid #122018" }}>
            <div style={{ display: "flex", gap: 4 }}>
              <button className={`tab-btn ${tab === "holdings" ? "active" : ""}`} onClick={() => setTab("holdings")}>
                Holdings ({HOLDINGS.length})
              </button>
              <button className={`tab-btn ${tab === "transactions" ? "active" : ""}`} onClick={() => setTab("transactions")}>
                Transactions ({TRANSACTIONS.length})
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, paddingBottom: 16 }}>
              <button className="btn-sm">Sort ↕</button>
              <button className="btn-sm">Filter ▾</button>
            </div>
          </div>

          {/* ── HOLDINGS TAB ── */}
          {tab === "holdings" && (
            <div>
              {/* Column labels */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 140px", padding: "12px 20px 8px", borderBottom: "1px solid #0f1e14" }}>
                {["Asset", "Type", "Holdings", "Avg Buy", "Current", "P&L", ""].map((h, i) => (
                  <div key={i} className="mono" style={{ fontSize: 10, color: "#3a6650", letterSpacing: "1px", textAlign: i > 1 ? "right" : "left", paddingRight: i > 0 && i < 6 ? 12 : 0 }}>{h.toUpperCase()}</div>
                ))}
              </div>

              {HOLDINGS.map((h, i) => {
                const pnl = (h.currentPrice - h.buyPrice) * h.qty * 100;
                const pnlPct = (((h.currentPrice - h.buyPrice) / h.buyPrice) * 100).toFixed(1);
                const isPos = h.currentPrice >= h.buyPrice;
                return (
                  <div key={h.id} className="row-item fade-up"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 140px", animationDelay: `${0.44 + i * 0.06}s`, cursor: "pointer" }}
                    onMouseEnter={() => setHovered(h.id)} onMouseLeave={() => setHovered(null)}>

                    {/* Asset */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "#102018", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1px solid #1a3022", flexShrink: 0 }}>{h.img}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#E6F4EC" }}>{h.name}</span>
                          {h.rare && <span className="rare-dot" />}
                          {h.status === "Retired" && (
                            <span className="tag" style={{ background: "#3a1a0a", color: "#d4843a", fontSize: 10, padding: "2px 8px" }}>Retired</span>
                          )}
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: "#4a8860" }}>📍 {h.location} · {h.verified}</div>
                      </div>
                    </div>

                    {/* Type */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="tag" style={{ background: "#0f2018", color: TYPE_COLORS[h.type] ?? "#6aad86", border: `1px solid ${TYPE_COLORS[h.type] ?? "#6aad86"}30` }}>
                        {h.type}
                      </span>
                    </div>

                    {/* Holdings */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#E6F4EC" }}>{h.qty} NFT{h.qty > 1 ? "s" : ""}</div>
                      <div className="mono" style={{ fontSize: 11, color: "#5a9a72", marginTop: 2 }}>{h.co2 * h.qty} t CO₂</div>
                    </div>

                    {/* Avg Buy */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#C6E8D4" }}>₹{h.buyPrice.toLocaleString("en-IN")}</div>
                      <div className="mono" style={{ fontSize: 11, color: "#5a9a72" }}>per tonne</div>
                    </div>

                    {/* Current */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#E6F4EC" }}>₹{h.currentPrice.toLocaleString("en-IN")}</div>
                      <div className="mono" style={{ fontSize: 11, color: "#5a9a72" }}>{fmtCr(h.currentPrice * h.qty * 100)}</div>
                    </div>

                    {/* P&L */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: isPos ? "#2dcc70" : "#ff5555" }}>
                        {isPos ? "+" : ""}{fmtCr(pnl)}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: isPos ? "#2dcc70" : "#ff5555" }}>
                        {isPos ? "▲" : "▼"} {Math.abs(parseFloat(pnlPct))}%
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      {h.status !== "Retired" && (
                        <>
                          <button className="btn-sm">Sell</button>
                          <button className="btn-sm danger">Retire</button>
                        </>
                      )}
                      {h.status === "Retired" && (
                        <button className="btn-sm" style={{ cursor: "default", opacity: 0.5 }}>Certificate ↗</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TRANSACTIONS TAB ── */}
          {tab === "transactions" && (
            <div>
              {/* Col labels */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 120px", padding: "12px 20px 8px", borderBottom: "1px solid #0f1e14" }}>
                {["TX ID", "Asset", "Type", "Qty", "Amount", "Status"].map((h, i) => (
                  <div key={i} className="mono" style={{ fontSize: 10, color: "#3a6650", letterSpacing: "1px", textAlign: i > 1 ? "right" : "left", paddingRight: i > 0 && i < 5 ? 12 : 0 }}>{h.toUpperCase()}</div>
                ))}
              </div>

              {TRANSACTIONS.map((tx, i) => {
                const credit = HOLDINGS.find(h => h.name === tx.name);
                const typeColor = tx.type === "Buy" ? "#2dcc70" : tx.type === "Retire" ? "#f5a623" : "#ff5555";
                return (
                  <div key={tx.id} className="row-item fade-up"
                    style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 120px", animationDelay: `${0.44 + i * 0.05}s` }}>

                    {/* TX ID */}
                    <div>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: "#E6F4EC" }}>{tx.id}</div>
                      <div className="mono" style={{ fontSize: 10, color: "#4a7a60", marginTop: 2 }}>{tx.date}</div>
                    </div>

                    {/* Asset */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#102018", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid #1a3022", flexShrink: 0 }}>{credit?.img ?? "🌿"}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E6F4EC" }}>{tx.name}</div>
                        <div className="mono" style={{ fontSize: 10, color: "#5a9a72" }}>{tx.hash}</div>
                      </div>
                    </div>

                    {/* Type */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
                      <span className="tag" style={{ background: `${typeColor}14`, border: `1px solid ${typeColor}40`, color: typeColor }}>
                        {tx.type === "Buy" ? "↓ " : tx.type === "Retire" ? "♻ " : "↑ "}{tx.type}
                      </span>
                    </div>

                    {/* Qty */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#C6E8D4" }}>{tx.qty} NFT{tx.qty > 1 ? "s" : ""}</div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#E6F4EC" }}>{fmtCr(tx.price * tx.qty * 100)}</div>
                      <div className="mono" style={{ fontSize: 10, color: "#5a9a72" }}>₹{tx.price.toLocaleString("en-IN")}/t</div>
                    </div>

                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <span className="tag" style={{ background: "#2dcc7014", border: "1px solid #2dcc7030", color: "#2dcc70" }}>
                        ✓ {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── CERTIFICATE BANNER ─── */}
        <div className="fade-up" style={{ marginTop: 40, background: "linear-gradient(135deg,#0d1f16,#051208)", border: "1.5px solid #1e3a28", borderRadius: 24, padding: "36px 44px", display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: "0.5s" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>Carbon Retirement Certificate</div>
            <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", color: "#E6F4EC", marginBottom: 8 }}>
              You've Retired 60 Tonnes of CO₂
            </h3>
            <p style={{ color: "#7aaa90", fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
              Your Patagonia Peat Preserve NFT has been permanently retired on-chain. Download your verified carbon retirement certificate as proof of offset.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: "14px 28px" }}>📄 Download Certificate</button>
            <button className="btn-ghost" style={{ fontSize: 14 }}>Share on LinkedIn ↗</button>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid #122018", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#E6F4EC", marginBottom: 4 }}>CARBONEX</div>
            <div className="mono" style={{ fontSize: 11, color: "#3a6650" }}>© 2025 · NFT Carbon Credit Marketplace · India</div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Docs", "API", "Audit Report", "Twitter", "Discord", "Support"].map(l => (
              <span key={l} className="mono" style={{ fontSize: 12, color: "#3a6650", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2dcc70")}
                onMouseLeave={e => (e.currentTarget.style.color = "#3a6650")}>{l}</span>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
