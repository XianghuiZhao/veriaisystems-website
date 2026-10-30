// VeriAI Systems — Hero + Home Page

const { useState } = React;

function SectionLabel({ children, dark }) {
  return (
    <p style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
      color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16
    }}>{children}</p>
  );
}

function Hero({ dark, onNavigate }) {
  const fg1 = dark ? '#f1f5f9' : '#0f172a';
  const fg3 = dark ? '#64748b' : '#64748b';
  const fg4 = dark ? '#3b82f6' : '#2563eb';

  return (
    <header style={{ paddingTop: 112, paddingBottom: 80, padding: '112px 24px 80px' }}>
      <div style={{ maxWidth: 896, margin: '0 auto' }}>

        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 12px', borderRadius: 9999,
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          marginBottom: 32
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s ease-in-out infinite' }}></span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b82f6', letterSpacing: '0.15em' }}>DETERMINISTIC VALIDATION ACTIVE</span>
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)',
          letterSpacing: '-0.025em', lineHeight: 1.12, color: fg1,
          maxWidth: 680, marginBottom: 24, textWrap: 'balance'
        }}>
          VeriCore.One
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: dark ? '#94a3b8' : '#64748b', maxWidth: 560, lineHeight: 1.6, marginBottom: 32
        }}>
          Requirements-based, signal-driven verification for automotive systems.
          Deterministic. Traceable. Fully local.
        </p>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: fg4, marginBottom: 6 }}>
          Natural language → Structured DSL → Deterministic Validation
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: dark ? '#334155' : '#94a3b8', marginBottom: 40 }}>
          Processed locally · No cloud · No black-box inference
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Btn onClick={() => onNavigate('platform')}>Explore Platform</Btn>
          <Btn ghost dark={dark} onClick={() => onNavigate('products')}>View Products</Btn>
        </div>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: dark ? '#1e293b' : '#cbd5e1', marginTop: 40 }}>
          From requirement to verification — without ambiguity.
        </p>
      </div>
    </header>
  );
}

function Btn({ children, ghost, dark, onClick }) {
  const [hov, setHov] = useState(false);
  const base = {
    padding: '10px 20px', borderRadius: 4, fontSize: 14, fontWeight: 500,
    fontFamily: "'Inter', sans-serif", cursor: 'pointer', border: 'none',
    transition: 'background .15s, border-color .15s, color .15s'
  };
  if (ghost) {
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ ...base, background: 'transparent',
          border: `1px solid ${hov ? '#3b82f6' : (dark ? '#334155' : '#cbd5e1')}`,
          color: hov ? (dark ? '#fff' : '#0f172a') : (dark ? '#cbd5e1' : '#334155')
        }}>{children}</button>
    );
  }
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, background: hov ? '#3b82f6' : '#2563eb', color: '#fff' }}>{children}</button>
  );
}

Object.assign(window, { Hero, Btn, SectionLabel });
