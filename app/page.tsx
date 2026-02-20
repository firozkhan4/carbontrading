"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const CREDITS = [
  { id: 1, name: "Amazon Rainforest Reserve", location: "Brazil", type: "Forestry", tonnes: 100, price: 2045, change: +3.2, verified: "Verra VCS", img: "🌳", rare: true, desc: "Protecting 4,200 hectares of primary rainforest in Pará state with critical biodiversity." },
  { id: 2, name: "Saharan Solar Farm", location: "Morocco", type: "Renewable", tonnes: 250, price: 1578, change: -1.1, verified: "Gold Standard", img: "☀️", rare: false, desc: "800MW solar installation powering 600,000+ homes with zero-emission clean energy." },
  { id: 3, name: "Himalayan Glacier Guard", location: "Nepal", type: "Blue Carbon", tonnes: 75, price: 3424, change: +7.8, verified: "ACR", img: "🏔️", rare: true, desc: "Preserving glacial ecosystems and protecting downstream freshwater supply." },
  { id: 4, name: "Mangrove Restoration", location: "Indonesia", type: "Blue Carbon", tonnes: 180, price: 2689, change: +1.5, verified: "Verra VCS", img: "🌊", rare: false, desc: "Restoring 1,800 hectares of coastal mangrove forest across Kalimantan." },
  { id: 5, name: "Wind Farm Collective", location: "Denmark", type: "Renewable", tonnes: 500, price: 1194, change: -0.4, verified: "Gold Standard", img: "💨", rare: false, desc: "Offshore wind project generating 1.2GW of renewable electricity annually." },
  { id: 6, name: "Patagonia Peat Preserve", location: "Chile", type: "Soil Carbon", tonnes: 60, price: 4593, change: +12.1, verified: "ACR", img: "🌿", rare: true, desc: "Protecting ancient peatlands storing 10,000+ years of accumulated carbon." },
];

const STATS = [
  { label: "Total Volume (24h)", value: "₹35.1 Cr", sub: "+18.3%", icon: "📈", positive: true },
  { label: "Active NFTs", value: "12,847", sub: "● Live Now", icon: "🔴", positive: true },
  { label: "CO₂ Offset", value: "1.8M t", sub: "All time", icon: "🌍", positive: null },
  { label: "Avg Price / Tonne", value: "₹2,371", sub: "+2.1%", icon: "💹", positive: true },
];

const TYPES = ["All", "Forestry", "Renewable", "Blue Carbon", "Soil Carbon"];

export default function CarbonMarketplace() {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const filtered = filter === "All" ? CREDITS : CREDITS.filter(c => c.type === filter);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleWishlist = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#06100A", minHeight: "100vh", color: "#E6F4EC", lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; background: #0a1810; }
        ::-webkit-scrollbar-thumb { background: #1e4030; border-radius: 6px; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        @keyframes ticker  { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes ringPop { 0%{transform:scale(1);opacity:0.7;} 100%{transform:scale(2.4);opacity:0;} }

        .fade-up  { animation: fadeUp 0.55s ease both; }
        .float-card { animation: float 4s ease-in-out infinite; }
        .ticker-track { display:flex; animation:ticker 30s linear infinite; white-space:nowrap; }

        .card {
          background: linear-gradient(160deg, #0d1f16 0%, #081209 100%);
          border: 1.5px solid #162a1e;
          border-radius: 22px;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 24px 64px rgba(45,204,112,0.1); border-color: #2dcc70; }

        .btn-primary {
          background: linear-gradient(135deg, #2dcc70, #1da856);
          color: #031508;
          font-weight: 700;
          font-size: 14px;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: filter 0.2s, transform 0.15s;
          letter-spacing: 0.2px;
        }
        .btn-primary:hover { filter: brightness(1.1); transform: scale(1.02); }

        .btn-ghost {
          background: transparent;
          color: #6aad86;
          font-weight: 600;
          font-size: 14px;
          border: 1.5px solid #1e3a28;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: #2dcc70; color: #2dcc70; background: #2dcc7010; }

        .filter-btn {
          background: transparent;
          border: 1.5px solid #1e3a28;
          border-radius: 10px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #6aad86;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: #2dcc70; color: #2dcc70; }
        .filter-btn.active { background: #2dcc7018; border-color: #2dcc70; color: #2dcc70; }

        .mono { font-family: 'JetBrains Mono', monospace; }

        .nav-link {
          color: #6aad86;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #2dcc70; }

        input[type="text"] {
          background: #0d1e15;
          border: 1.5px solid #1e3a28;
          color: #E6F4EC;
          border-radius: 12px;
          padding: 11px 16px 11px 44px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          outline: none;
          width: 240px;
          transition: border-color 0.2s;
        }
        input[type="text"]:focus { border-color: #2dcc70; }
        input[type="text"]::placeholder { color: #3a6650; }

        .live-pulse { display:inline-block; width:8px; height:8px; background:#2dcc70; border-radius:50%; animation:pulse 1.4s ease-in-out infinite; }
        .live-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; }
        .live-ring::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; border:1.5px solid #2dcc70; animation:ringPop 1.7s ease-out infinite; }

        .rare-badge {
          position:absolute; top:14px; right:14px;
          background:linear-gradient(135deg,#f5a623,#f8c842);
          color:#1a0c00; font-size:10px; font-weight:800;
          border-radius:8px; padding:4px 10px; letter-spacing:0.8px;
          box-shadow:0 0 18px #f5a62340;
        }

        .wishlist-btn {
          width:40px; height:40px; border-radius:11px;
          border:1.5px solid #1e3a28; background:transparent;
          cursor:pointer; font-size:16px;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s;
        }
        .wishlist-btn:hover { border-color:#e8335080; background:#e8335015; transform:scale(1.08); }
        .wishlist-btn.on { border-color:#e83350; background:#e8335015; }

        .tag {
          display:inline-flex; align-items:center; gap:5px;
          border-radius:8px; padding:5px 11px;
          font-size:11px; font-weight:600;
          font-family:'JetBrains Mono', monospace;
          letter-spacing:0.3px;
        }

        .section-label {
          font-size:11px; font-weight:600; letter-spacing:2.5px;
          color:#2dcc70; text-transform:uppercase;
          font-family:'JetBrains Mono', monospace;
        }

        .stat-card {
          background:linear-gradient(160deg,#0d1e15,#081209);
          border:1.5px solid #162a1e; border-radius:20px; padding:26px 28px;
          transition:border-color 0.22s, transform 0.22s;
        }
        .stat-card:hover { border-color:#2dcc7040; transform:translateY(-2px); }

        .info-box {
          background:#08110d; border-radius:13px; padding:14px 16px;
          border:1px solid #112018;
        }

        .dot-grid {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:radial-gradient(#1a3a2518 1px,transparent 1px);
          background-size:32px 32px;
        }
        .mesh-bg {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(ellipse 70% 55% at 15% 8%, #0d3d2020 0%, transparent 55%),
            radial-gradient(ellipse 55% 45% at 85% 85%, #0a2a3a18 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 50% 50%, #2dcc7006 0%, transparent 70%);
        }
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
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#2dcc70,#1a8a4a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 22px #2dcc7040" }}>🌍</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.7px", color: "#E6F4EC" }}>CARBONEX</div>
            <div className="mono" style={{ fontSize: 9.5, color: "#3a6650", letterSpacing: "2.5px" }}>NFT CARBON MARKET</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 38 }}>
          {["Market", "Portfolio", "Analytics", "Bridge"].map(item => (
            <Link key={item} href={`${item.toLowerCase()}`} className="nav-link">{item}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#3a6650" }}>🔍</span>
            <input type="text" placeholder="Search credits…" />
          </div>
          <button className="btn-primary">Connect Wallet</button>
        </div>
      </nav>

      {/* ━━━ TICKER ━━━ */}
      <div style={{ background: "#2dcc7008", borderBottom: "1px solid #122018", padding: "10px 0", overflow: "hidden" }}>
        <div className="ticker-track" style={{ gap: 80 }}>
          {[...CREDITS, ...CREDITS].map((c, i) => (
            <span key={i} className="mono" style={{ fontSize: 12, color: "#5a9a72" }}>
              <span style={{ color: "#C6E8D4", fontWeight: 600 }}>{c.name}</span>
              <span style={{ marginLeft: 10, color: "#2dcc70", fontWeight: 600 }}>₹{c.price.toLocaleString("en-IN")}</span>
              <span style={{ marginLeft: 6, color: c.change > 0 ? "#2dcc70" : "#ff5555", fontWeight: 500 }}>
                {c.change > 0 ? "▲" : "▼"} {Math.abs(c.change)}%
              </span>
              <span style={{ marginLeft: 64, color: "#1e3a28" }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ━━━ MAIN ━━━ */}
      <main style={{ position: "relative", zIndex: 1, padding: "52px 44px 72px", maxWidth: 1340, margin: "0 auto" }}>

        {/* ─── HERO ─── */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center", marginBottom: 64 }}>
          {/* Copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#2dcc7012", border: "1px solid #2dcc7035", borderRadius: 100, padding: "8px 18px", marginBottom: 26 }}>
              <span className="live-ring"><span className="live-pulse" /></span>
              <span className="mono" style={{ fontSize: 11, color: "#2dcc70", letterSpacing: "1.5px" }}>LIVE MARKET · BLOCK #18,429,301</span>
            </div>

            <h1 style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.07, letterSpacing: "-2.5px", color: "#E6F4EC", marginBottom: 22 }}>
              Trade Carbon Credits<br />
              <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg,#2dcc70 0%,#7fff7f 55%,#c8ff80 100%)" }}>
                as NFTs.
              </span>
            </h1>

            <p style={{ color: "#8abea0", fontSize: 17, lineHeight: 1.78, maxWidth: 450, marginBottom: 34, fontWeight: 400 }}>
              India's first transparent, on-chain carbon credit marketplace.
              Buy, sell, and retire verified carbon offsets — priced in Indian Rupees with full provable impact.
            </p>

            <div style={{ display: "flex", gap: 14 }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>Explore Market →</button>
              <button className="btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }}>List Credits</button>
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 38, paddingTop: 32, borderTop: "1px solid #122018" }}>
              {[["₹350 Cr+", "Total Traded"], ["4,200+", "Verified Projects"], ["100%", "On-Chain"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#2dcc70", letterSpacing: "-0.8px" }}>{val}</div>
                  <div style={{ fontSize: 13, color: "#5a9a72", fontWeight: 500, marginTop: 3 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -2, background: "linear-gradient(135deg,#2dcc7028,#1a8a4a14)", borderRadius: 28, filter: "blur(32px)", zIndex: 0 }} />
            <div className="float-card" style={{ position: "relative", zIndex: 1, background: "linear-gradient(160deg,#102318,#07130a)", border: "1.5px solid #1e3a28", borderRadius: 26, padding: 34 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ fontSize: 56 }}>🌳</div>
                <div style={{ background: "#2dcc7014", border: "1px solid #2dcc7040", color: "#2dcc70", borderRadius: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600 }} className="mono">✓ VERIFIED VCS</div>
              </div>

              <div style={{ fontSize: 21, fontWeight: 700, color: "#E6F4EC", letterSpacing: "-0.4px", marginBottom: 6 }}>Amazon Rainforest Reserve</div>
              <div className="mono" style={{ color: "#5a9a72", fontSize: 12, marginBottom: 8 }}>📍 Pará, Brazil · Forestry</div>
              <div style={{ color: "#8abea0", fontSize: 14, lineHeight: 1.65, marginBottom: 26 }}>
                Protecting 4,200 hectares of primary rainforest with critical biodiversity and carbon storage.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 26 }}>
                {[["CO₂ Offset", "100 t"], ["Vintage", "2024"], ["Status", "Active"]].map(([label, val]) => (
                  <div key={label} className="info-box">
                    <div className="mono" style={{ fontSize: 9.5, color: "#3a6650", letterSpacing: "0.5px", marginBottom: 6 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#C6E8D4" }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1a3022", paddingTop: 22 }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: "#3a6650", letterSpacing: "1px", marginBottom: 5 }}>CURRENT PRICE</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#2dcc70", letterSpacing: "-1.2px" }}>
                    ₹2,045
                    <span style={{ fontSize: 14, color: "#5ddf8a", fontWeight: 600, marginLeft: 8 }}>▲ 3.2%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#5a9a72", marginTop: 3 }}>per tonne CO₂</div>
                </div>
                <button className="btn-primary" style={{ padding: "13px 26px", fontSize: 15 }}>Buy Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 60 }}>
          {STATS.map((s, i) => (
            <div key={i} className={`stat-card fade-up`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
              <div className="mono" style={{ fontSize: 10.5, color: "#3a6650", letterSpacing: "1.5px", marginBottom: 10 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.2px", color: "#E6F4EC", marginBottom: 8 }}>{s.value}</div>
              <div className="mono" style={{ fontSize: 12, color: s.positive ? "#2dcc70" : "#5a9a72", fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ─── LISTINGS ─── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>Carbon Credit NFTs</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1.2px", color: "#E6F4EC" }}>Live Listings</h2>
            <p style={{ color: "#5a9a72", fontSize: 14, marginTop: 5, fontWeight: 500 }}>{filtered.length} verified carbon credit NFTs available to buy</p>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`filter-btn ${filter === t ? "active" : ""}`}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {filtered.map((c, i) => (
            <div key={c.id} className="card fade-up" style={{ animationDelay: `${i * 0.07}s`, padding: 28 }}
              onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}>

              {c.rare && <div className="rare-badge">✦ RARE</div>}

              {hovered === c.id && (
                <div style={{ position: "absolute", top: "50%", left: "50%", width: 260, height: 260, transform: "translate(-50%,-50%)", background: "radial-gradient(circle,#2dcc700a 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
              )}

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 58, height: 58, borderRadius: 16, background: "#102018", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0, border: "1px solid #1a3022" }}>{c.img}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: "#E6F4EC", letterSpacing: "-0.3px", lineHeight: 1.3, marginBottom: 5 }}>{c.name}</div>
                    <div className="mono" style={{ color: "#4a8860", fontSize: 11 }}>📍 {c.location}</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13.5, color: "#8abea0", lineHeight: 1.68, marginBottom: 18 }}>{c.desc}</p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  <span className="tag" style={{ background: "#0f2018", color: "#6aad86" }}>{c.type}</span>
                  <span className="tag" style={{ background: "#2dcc7012", border: "1px solid #2dcc7030", color: "#2dcc70" }}>✓ {c.verified}</span>
                </div>

                {/* Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 22 }}>
                  {[["CO₂ Offset", `${c.tonnes} tonnes`], ["Vintage", "2024"]].map(([label, val]) => (
                    <div key={label} className="info-box">
                      <div className="mono" style={{ fontSize: 9.5, color: "#3a6650", letterSpacing: "0.5px", marginBottom: 6 }}>{label.toUpperCase()}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#C6E8D4" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Price + Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #152a1e", paddingTop: 20 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 9.5, color: "#3a6650", letterSpacing: "1px", marginBottom: 5 }}>PRICE PER TONNE</div>
                    <div style={{ fontSize: 23, fontWeight: 800, color: "#E6F4EC", letterSpacing: "-0.8px" }}>
                      ₹{c.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: 12, marginLeft: 7, color: c.change > 0 ? "#2dcc70" : "#ff5555", fontWeight: 600 }}>
                        {c.change > 0 ? "▲" : "▼"} {Math.abs(c.change)}%
                      </span>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: "#4a7a60", marginTop: 4 }}>
                      Total: ₹{(c.price * c.tonnes).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 9 }}>
                    <button
                      className={`wishlist-btn ${wishlist.includes(c.id) ? "on" : ""}`}
                      onClick={e => { e.stopPropagation(); toggleWishlist(c.id); }}
                      title="Watchlist">
                      {wishlist.includes(c.id) ? "❤️" : "🤍"}
                    </button>
                    <button className="btn-primary">Buy</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── IMPACT ─── */}
        <div style={{ marginTop: 68, background: "linear-gradient(145deg,#0d1f16 0%,#06110a 100%)", border: "1.5px solid #1a3a28", borderRadius: 30, padding: "52px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 14 }}>Real World Impact</div>
            <h3 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.12, color: "#E6F4EC", marginBottom: 18 }}>
              Every NFT = Verified<br />Carbon Reduction
            </h3>
            <p style={{ color: "#8abea0", fontSize: 16, lineHeight: 1.78, marginBottom: 30 }}>
              All carbon credits on CARBONEX are tokenized from real, verified offset projects — tracked on-chain with full transparency and immutable retirement records accessible to anyone.
            </p>
            <button className="btn-primary" style={{ fontSize: 15, padding: "14px 30px" }}>View Impact Dashboard →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["🌳", "2.1M", "Trees Protected"], ["🌊", "14,200 km²", "Ocean Restored"], ["☀️", "890 GWh", "Clean Energy"], ["🔬", "100%", "On-Chain Verified"]].map(([icon, val, label]) => (
              <div key={label} style={{ background: "#08120a", borderRadius: 20, padding: "26px 20px", textAlign: "center", border: "1px solid #152a1e" }}>
                <div style={{ fontSize: 34, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "#E6F4EC", letterSpacing: "-0.8px", marginBottom: 6 }}>{val}</div>
                <div className="mono" style={{ color: "#4a8860", fontSize: 10.5, letterSpacing: "0.5px" }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer style={{ marginTop: 68, paddingTop: 36, borderTop: "1px solid #122018", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#E6F4EC", marginBottom: 5 }}>CARBONEX</div>
            <div className="mono" style={{ fontSize: 11, color: "#3a6650" }}>© 2025 · NFT Carbon Credit Marketplace · India</div>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
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
