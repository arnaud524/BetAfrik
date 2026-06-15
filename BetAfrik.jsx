import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0A0E1A",
  surface: "#111827",
  card: "#1A2235",
  border: "#1E2D45",
  accent: "#F5A623",
  accentDark: "#C47D0E",
  green: "#00C853",
  red: "#FF3D57",
  text: "#E8EDF5",
  muted: "#6B7A99",
  highlight: "#243049",
};

const SPORTS = [
  { id: "foot", label: "⚽ Football", icon: "⚽" },
  { id: "basket", label: "🏀 Basket", icon: "🏀" },
  { id: "tennis", label: "🎾 Tennis", icon: "🎾" },
  { id: "rugby", label: "🏉 Rugby", icon: "🏉" },
];

const MATCHES = [
  {
    id: 1, sport: "foot", league: "AFCON 2026", time: "18:00",
    home: "Sénégal", away: "Maroc", homeOdd: 2.10, drawOdd: 3.20, awayOdd: 3.50,
    live: true, score: "1 - 0",
  },
  {
    id: 2, sport: "foot", league: "CAN U23", time: "20:30",
    home: "Nigeria", away: "Ghana", homeOdd: 1.85, drawOdd: 3.40, awayOdd: 4.10,
    live: false, score: null,
  },
  {
    id: 3, sport: "foot", league: "Liga Africaine", time: "21:00",
    home: "Al Ahly", away: "Wydad", homeOdd: 1.60, drawOdd: 3.50, awayOdd: 5.00,
    live: false, score: null,
  },
  {
    id: 4, sport: "basket", league: "NBA Africa", time: "22:00",
    home: "Lagos Lions", away: "Cairo Kings", homeOdd: 1.75, drawOdd: null, awayOdd: 2.10,
    live: true, score: "68 - 71",
  },
  {
    id: 5, sport: "tennis", league: "Roland Garros", time: "14:00",
    home: "Djokovic", away: "Alcaraz", homeOdd: 2.20, drawOdd: null, awayOdd: 1.70,
    live: false, score: null,
  },
  {
    id: 6, sport: "rugby", league: "Afrique du Sud", time: "16:00",
    home: "Springboks", away: "Kenya", homeOdd: 1.15, drawOdd: 12.00, awayOdd: 7.50,
    live: false, score: null,
  },
];

const PAYMENTS = ["Orange Money", "Wave", "MTN MoMo", "Moov Money", "CinetPay"];

function OddButton({ label, value, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? COLORS.accent : COLORS.highlight,
        border: `1px solid ${selected ? COLORS.accent : COLORS.border}`,
        color: selected ? "#0A0E1A" : COLORS.text,
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
        transition: "all 0.2s",
        fontWeight: selected ? 700 : 500,
        minWidth: 70,
        fontSize: 13,
      }}
    >
      <div style={{ fontSize: 10, color: selected ? "#0A0E1A" : COLORS.muted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </button>
  );
}

function MatchCard({ match, onBet, betSlip }) {
  const isInSlip = (type) => betSlip.some(b => b.matchId === match.id && b.type === type);

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: COLORS.muted, background: COLORS.highlight, padding: "2px 8px", borderRadius: 20 }}>
            {match.league}
          </span>
          {match.live && (
            <span style={{ fontSize: 11, color: COLORS.green, background: "#00C85322", padding: "2px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, display: "inline-block", animation: "pulse 1.5s infinite" }} />
              LIVE {match.score}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: COLORS.muted }}>{match.time}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{match.home}</div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 12 }}>VS</div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{match.away}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <OddButton label="1" value={match.homeOdd} selected={isInSlip("home")} onClick={() => onBet(match, "home", match.homeOdd)} />
        {match.drawOdd && <OddButton label="N" value={match.drawOdd} selected={isInSlip("draw")} onClick={() => onBet(match, "draw", match.drawOdd)} />}
        <OddButton label="2" value={match.awayOdd} selected={isInSlip("away")} onClick={() => onBet(match, "away", match.awayOdd)} />
      </div>
    </div>
  );
}

function BetSlip({ betSlip, onRemove, onClear, balance, onConfirm }) {
  const [stake, setStake] = useState("");
  const [mode, setMode] = useState("combined");
  const totalOdd = betSlip.reduce((acc, b) => acc * b.odd, 1);
  const gain = stake ? (parseFloat(stake) * totalOdd).toFixed(0) : "—";

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, position: "sticky", top: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ color: COLORS.accent, margin: 0, fontSize: 15, fontWeight: 700 }}>🎫 Coupon ({betSlip.length})</h3>
        {betSlip.length > 0 && (
          <button onClick={onClear} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", fontSize: 12 }}>Vider</button>
        )}
      </div>

      {betSlip.length === 0 ? (
        <div style={{ textAlign: "center", color: COLORS.muted, padding: "30px 0", fontSize: 13 }}>
          Sélectionnez des cotes pour parier
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["combined", "simple"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "6px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? COLORS.accent : COLORS.highlight,
                color: mode === m ? "#0A0E1A" : COLORS.muted,
                fontWeight: 600, fontSize: 12,
              }}>
                {m === "combined" ? "Combiné" : "Simple"}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
            {betSlip.map(b => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 600 }}>{b.home} vs {b.away}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{b.label}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: COLORS.accent, fontWeight: 700 }}>{b.odd}</span>
                  <button onClick={() => onRemove(b.id)} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.highlight, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
              <span>Cote totale</span>
              <span style={{ color: COLORS.accent, fontWeight: 700 }}>{totalOdd.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted }}>
              <span>Solde disponible</span>
              <span style={{ color: COLORS.green }}>{balance.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: 10 }}>
            <input
              type="number"
              placeholder="Mise (FCFA)"
              value={stake}
              onChange={e => setStake(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: `1px solid ${COLORS.border}`, background: COLORS.surface,
                color: COLORS.text, fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>

          {stake && (
            <div style={{ background: "#00C85318", border: `1px solid ${COLORS.green}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.muted, fontSize: 12 }}>Gain potentiel</span>
              <span style={{ color: COLORS.green, fontWeight: 700 }}>{parseInt(gain).toLocaleString()} FCFA</span>
            </div>
          )}

          <button
            onClick={() => onConfirm(parseFloat(stake))}
            disabled={!stake || parseFloat(stake) <= 0}
            style={{
              width: "100%", padding: 12, borderRadius: 10, border: "none",
              background: stake ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.highlight,
              color: stake ? "#0A0E1A" : COLORS.muted,
              fontWeight: 700, fontSize: 14, cursor: stake ? "pointer" : "not-allowed",
            }}
          >
            Valider le pari
          </button>
        </>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000AA", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, maxWidth: 420, width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" }}>×</button>
        <h2 style={{ color: COLORS.text, margin: "0 0 20px", fontSize: 18 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function AuthForm({ mode, onAuth, onSwitch }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, background: COLORS.card,
    color: COLORS.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box",
  };

  return (
    <div>
      {mode === "register" && (
        <input style={inputStyle} placeholder="Nom complet" value={form.name} onChange={handle("name")} />
      )}
      <input style={inputStyle} placeholder="Numéro de téléphone" value={form.phone} onChange={handle("phone")} />
      <input style={inputStyle} type="password" placeholder="Mot de passe" value={form.password} onChange={handle("password")} />
      {mode === "register" && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 6 }}>Moyen de paiement préféré</label>
          <select style={{ ...inputStyle, marginBottom: 0 }}>
            {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}
      <button
        onClick={() => onAuth(form)}
        style={{
          width: "100%", padding: 12, borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
          color: "#0A0E1A", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 12,
        }}
      >
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>
      <div style={{ textAlign: "center", fontSize: 13, color: COLORS.muted }}>
        {mode === "login" ? "Pas de compte ? " : "Déjà inscrit ? "}
        <span onClick={onSwitch} style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}>
          {mode === "login" ? "S'inscrire" : "Se connecter"}
        </span>
      </div>
    </div>
  );
}

function DepositModal({ onClose, onDeposit, balance }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(PAYMENTS[0]);
  const [step, setStep] = useState(1);

  const handleDeposit = () => {
    onDeposit(parseFloat(amount));
    setStep(2);
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {PAYMENTS.map(p => (
              <button key={p} onClick={() => setMethod(p)} style={{
                padding: "6px 12px", borderRadius: 20, border: `1px solid ${method === p ? COLORS.accent : COLORS.border}`,
                background: method === p ? COLORS.accent + "22" : COLORS.card,
                color: method === p ? COLORS.accent : COLORS.muted,
                cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}>{p}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[1000, 2000, 5000, 10000].map(v => (
              <button key={v} onClick={() => setAmount(String(v))} style={{
                flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
                background: amount === String(v) ? COLORS.accent + "22" : COLORS.card,
                color: amount === String(v) ? COLORS.accent : COLORS.text,
                cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}>{v.toLocaleString()}</button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Autre montant (FCFA)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text, fontSize: 14, boxSizing: "border-box", marginBottom: 12 }}
          />
          <button onClick={handleDeposit} disabled={!amount} style={{
            width: "100%", padding: 12, borderRadius: 10, border: "none",
            background: amount ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.highlight,
            color: "#0A0E1A", fontWeight: 700, fontSize: 14, cursor: amount ? "pointer" : "not-allowed",
          }}>
            Déposer via {method}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Dépôt réussi !</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 16 }}>
            {parseInt(amount).toLocaleString()} FCFA ajoutés via {method}
          </div>
          <div style={{ color: COLORS.text, fontWeight: 700 }}>Nouveau solde : {balance.toLocaleString()} FCFA</div>
          <button onClick={onClose} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.accent, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
            Continuer à parier
          </button>
        </div>
      )}
    </div>
  );
}

export default function BetAfrik() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(25000);
  const [sport, setSport] = useState("foot");
  const [betSlip, setBetSlip] = useState([]);
  const [modal, setModal] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [liveScores, setLiveScores] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveScores(prev => {
        const updated = { ...prev };
        MATCHES.filter(m => m.live).forEach(m => {
          if (!updated[m.id]) updated[m.id] = m.score;
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBet = (match, type, odd) => {
    if (!user) { setModal("auth"); return; }
    const label = type === "home" ? match.home : type === "away" ? match.away : "Nul";
    const existing = betSlip.find(b => b.matchId === match.id);
    if (existing) {
      if (existing.type === type) {
        setBetSlip(betSlip.filter(b => b.matchId !== match.id));
      } else {
        setBetSlip(betSlip.map(b => b.matchId === match.id ? { ...b, type, odd, label } : b));
      }
    } else {
      setBetSlip([...betSlip, { id: Date.now(), matchId: match.id, home: match.home, away: match.away, type, odd, label }]);
    }
  };

  const handleConfirm = (stake) => {
    if (stake > balance) { showToast("Solde insuffisant", "error"); return; }
    const totalOdd = betSlip.reduce((a, b) => a * b.odd, 1);
    const gain = parseFloat((stake * totalOdd).toFixed(0));
    setBalance(prev => prev - stake);
    const entry = { id: Date.now(), date: new Date().toLocaleDateString("fr"), bets: [...betSlip], stake, odd: totalOdd.toFixed(2), gain, status: "En cours" };
    setHistory(prev => [entry, ...prev]);
    setBetSlip([]);
    showToast(`Pari de ${stake.toLocaleString()} FCFA validé ! Gain potentiel : ${gain.toLocaleString()} FCFA`);
    setModal(null);
  };

  const handleAuth = (form) => {
    setUser({ name: form.name || "Joueur", phone: form.phone });
    setModal(null);
    showToast(`Bienvenue ${form.name || "sur BetAfrik"} ! 🎉`);
  };

  const handleDeposit = (amount) => {
    setBalance(prev => prev + amount);
  };

  const filteredMatches = MATCHES.filter(m => m.sport === sport);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Inter', sans-serif", color: COLORS.text }}>
      <style>{`
        * { box-sizing: border-box; }
        input, select { outline: none; }
        input::placeholder { color: #6B7A99; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 4px; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? COLORS.red : COLORS.green,
          color: "#fff", padding: "12px 20px", borderRadius: 10, zIndex: 1000,
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px #0006",
          animation: "slideIn 0.3s ease",
        }}>{toast.msg}</div>
      )}

      {/* HEADER */}
      <header style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🦁</span>
            <span style={{ fontWeight: 900, fontSize: 20, color: COLORS.accent, letterSpacing: -0.5 }}>BetAfrik</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <>
                <div style={{ background: COLORS.highlight, padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer" }} onClick={() => setModal("deposit")}>
                  <span style={{ color: COLORS.muted, marginRight: 4 }}>💳</span>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>{balance.toLocaleString()} FCFA</span>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#0A0E1A", cursor: "pointer" }} onClick={() => setActiveTab("profile")}>
                  {user.name[0].toUpperCase()}
                </div>
              </>
            ) : (
              <button onClick={() => { setAuthMode("login"); setModal("auth"); }} style={{
                padding: "8px 18px", borderRadius: 20, border: "none",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                color: "#0A0E1A", fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}>Connexion</button>
            )}
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {[
            { id: "home", label: "🏠 Accueil" },
            { id: "live", label: "🔴 Live" },
            { id: "history", label: "📋 Mes paris" },
            { id: "profile", label: "👤 Profil" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "14px 20px", border: "none", background: "none",
              color: activeTab === tab.id ? COLORS.accent : COLORS.muted,
              borderBottom: `2px solid ${activeTab === tab.id ? COLORS.accent : "transparent"}`,
              cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            }}>{tab.label}</button>
          ))}
        </div>
      </nav>

      {/* HERO BANNER */}
      {activeTab === "home" && (
        <div style={{
          background: `linear-gradient(135deg, #0F1E38 0%, #1A2D50 50%, #0F1E38 100%)`,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "24px 20px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>🌍 LA PLATEFORME DE PARIS #1 EN AFRIQUE</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: COLORS.text, lineHeight: 1.2 }}>
                Pariez. Gagnez.<br />
                <span style={{ color: COLORS.accent }}>Retirez en Mobile Money.</span>
              </h1>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { v: "50K+", l: "Joueurs actifs" },
                { v: "200+", l: "Matchs/jour" },
                { v: "x100", l: "Cote max" },
              ].map(s => (
                <div key={s.v} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.accent }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
            {!user && (
              <button onClick={() => { setAuthMode("register"); setModal("auth"); }} style={{
                padding: "12px 24px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                color: "#0A0E1A", fontWeight: 800, cursor: "pointer", fontSize: 14,
              }}>Créer un compte gratuit 🚀</button>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div>
              {/* SPORT FILTER */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
                {SPORTS.map(s => (
                  <button key={s.id} onClick={() => setSport(s.id)} style={{
                    padding: "8px 16px", borderRadius: 20,
                    border: `1px solid ${sport === s.id ? COLORS.accent : COLORS.border}`,
                    background: sport === s.id ? COLORS.accent + "22" : COLORS.card,
                    color: sport === s.id ? COLORS.accent : COLORS.muted,
                    cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                  }}>{s.label}</button>
                ))}
              </div>

              {/* LIVE BADGE */}
              {filteredMatches.some(m => m.live) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, animation: "pulse 1.5s infinite", display: "inline-block" }} />
                  <span style={{ color: COLORS.green, fontWeight: 700, fontSize: 13 }}>En direct maintenant</span>
                </div>
              )}

              {filteredMatches.map(match => (
                <MatchCard key={match.id} match={match} onBet={handleBet} betSlip={betSlip} />
              ))}

              {filteredMatches.length === 0 && (
                <div style={{ textAlign: "center", color: COLORS.muted, padding: "60px 0" }}>
                  Aucun match disponible pour ce sport
                </div>
              )}
            </div>

            {/* BET SLIP */}
            <BetSlip betSlip={betSlip} onRemove={id => setBetSlip(betSlip.filter(b => b.id !== id))} onClear={() => setBetSlip([])} balance={balance} onConfirm={handleConfirm} />
          </div>
        )}

        {/* LIVE TAB */}
        {activeTab === "live" && (
          <div>
            <h2 style={{ color: COLORS.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.green, animation: "pulse 1.5s infinite", display: "inline-block" }} />
              Matchs en direct
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
              <div>
                {MATCHES.filter(m => m.live).map(match => (
                  <MatchCard key={match.id} match={match} onBet={handleBet} betSlip={betSlip} />
                ))}
              </div>
              <BetSlip betSlip={betSlip} onRemove={id => setBetSlip(betSlip.filter(b => b.id !== id))} onClear={() => setBetSlip([])} balance={balance} onConfirm={handleConfirm} />
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            <h2 style={{ color: COLORS.text, marginBottom: 20 }}>📋 Mes paris</h2>
            {!user ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                <div style={{ marginBottom: 16 }}>Connectez-vous pour voir vos paris</div>
                <button onClick={() => { setAuthMode("login"); setModal("auth"); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.accent, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>Se connecter</button>
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <div>Aucun pari pour le moment. Commencez à parier !</div>
              </div>
            ) : (
              history.map(h => (
                <div key={h.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: COLORS.muted }}>{h.date}</span>
                    <span style={{ fontSize: 12, color: COLORS.accent, background: COLORS.accent + "22", padding: "2px 10px", borderRadius: 20 }}>{h.status}</span>
                  </div>
                  {h.bets.map((b, i) => (
                    <div key={i} style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}>
                      ▸ {b.home} vs {b.away} — <span style={{ color: COLORS.accent }}>{b.label} @ {b.odd}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 20, marginTop: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
                    <div><span style={{ color: COLORS.muted, fontSize: 12 }}>Mise </span><span style={{ color: COLORS.text, fontWeight: 700 }}>{h.stake.toLocaleString()} FCFA</span></div>
                    <div><span style={{ color: COLORS.muted, fontSize: 12 }}>Cote </span><span style={{ color: COLORS.accent, fontWeight: 700 }}>x{h.odd}</span></div>
                    <div><span style={{ color: COLORS.muted, fontSize: 12 }}>Gain pot. </span><span style={{ color: COLORS.green, fontWeight: 700 }}>{h.gain.toLocaleString()} FCFA</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ color: COLORS.text, marginBottom: 20 }}>👤 Mon profil</h2>
            {!user ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <button onClick={() => { setAuthMode("login"); setModal("auth"); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.accent, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>Se connecter</button>
              </div>
            ) : (
              <>
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#0A0E1A", fontSize: 22 }}>{user.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
                      <div style={{ color: COLORS.muted, fontSize: 13 }}>{user.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Solde", value: `${balance.toLocaleString()} FCFA`, color: COLORS.green },
                      { label: "Paris placés", value: history.length, color: COLORS.accent },
                    ].map(s => (
                      <div key={s.label} style={{ background: COLORS.highlight, borderRadius: 10, padding: 14 }}>
                        <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ color: s.color, fontWeight: 700, fontSize: 18 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setModal("deposit")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                    💳 Déposer
                  </button>
                  <button onClick={() => { setUser(null); setBetSlip([]); showToast("Déconnexion réussie"); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${COLORS.red}`, background: "none", color: COLORS.red, fontWeight: 700, cursor: "pointer" }}>
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal === "auth" && (
        <Modal title={authMode === "login" ? "Connexion" : "Créer un compte"} onClose={() => setModal(null)}>
          <AuthForm mode={authMode} onAuth={handleAuth} onSwitch={() => setAuthMode(authMode === "login" ? "register" : "login")} />
        </Modal>
      )}
      {modal === "deposit" && (
        <Modal title="Déposer des fonds" onClose={() => setModal(null)}>
          <DepositModal onClose={() => setModal(null)} onDeposit={handleDeposit} balance={balance} />
        </Modal>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "20px 16px", marginTop: 40, textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>
            🦁 <strong style={{ color: COLORS.accent }}>BetAfrik</strong> — Plateforme de paris sécurisée 🌍 Afrique
          </div>
          <div style={{ color: COLORS.muted, fontSize: 11 }}>
            18+ · Jouez responsable · Licence : Autorité Nationale des Jeux · Paiements via Mobile Money
          </div>
        </div>
      </footer>
    </div>
  );
}
