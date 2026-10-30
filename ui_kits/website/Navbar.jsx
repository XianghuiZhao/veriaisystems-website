// VeriAI Systems — Shared Components
// Navbar, Footer, shared primitives

const { useState, useEffect } = React;

// ── Logo ──────────────────────────────────────────────────────────
function LogoMark({ size = 28 }) {
  const r = Math.round(size * 0.14);
  return (
    <div style={{
      width: size, height: size, background: '#2563eb',
      borderRadius: r, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24"
           fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    </div>
  );
}

function Logo({ size = 'md', lightMode = false }) {
  const sizes = { sm: { mark: 22, font: 11 }, md: { mark: 28, font: 13 }, lg: { mark: 40, font: 16 } };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <LogoMark size={s.mark} />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        fontSize: s.font, letterSpacing: '0.10em',
        color: lightMode ? '#0f172a' : '#f1f5f9'
      }}>
        VeriAI <span style={{ color: lightMode ? '#2563eb' : '#3b82f6' }}>Systems</span>
      </span>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ page, onNavigate, dark, onToggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 56,
        background: dark ? 'rgba(10,15,26,0.95)' : 'rgba(255,255,255,0.92)',
        borderBottom: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'background .2s, border-color .2s'
      }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo dark={!dark} lightMode={!dark} />
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 28 }}>
          {['platform', 'products'].map(p => (
            <button key={p} onClick={() => onNavigate(p)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '0.05em', textTransform: 'capitalize',
              color: page === p ? (dark ? '#f1f5f9' : '#0f172a') : (dark ? '#64748b' : '#64748b'),
              transition: 'color .15s'
            }}>{p}</button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
            {['EN', 'DE', '中文'].map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span style={{ color: dark ? '#1e293b' : '#cbd5e1' }}>/</span>}
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: i === 0 ? '#3b82f6' : (dark ? '#64748b' : '#94a3b8'), padding: '0 2px' }}>{l}</button>
              </React.Fragment>
            ))}
          </div>
          <IconBtn onClick={onToggleDark} dark={dark}>
            {dark
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </IconBtn>
          <IconBtn dark={dark} onClick={() => onNavigate('gate')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </IconBtn>
        </div>
      </nav>
    </>
  );
}

function IconBtn({ children, onClick, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 4, border: 'none', cursor: 'pointer',
        background: hov ? (dark ? '#1e293b' : '#f1f5f9') : 'transparent',
        color: hov ? (dark ? '#cbd5e1' : '#334155') : (dark ? '#64748b' : '#94a3b8'),
        transition: 'background .15s, color .15s'
      }}>
      {React.cloneElement(children, { style: { ...children.props.style, width: 14, height: 14 } })}
    </button>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer({ dark, onNavigate }) {
  const border = dark ? '#1e293b' : '#e2e8f0';
  const fg3 = dark ? '#64748b' : '#94a3b8';
  const fg4 = dark ? '#334155' : '#cbd5e1';
  return (
    <footer style={{
      borderTop: `1px solid ${border}`,
      background: dark ? '#0a0f1a' : '#fff',
      padding: '48px 24px 32px',
      transition: 'background .2s'
    }}>
      <div style={{ maxWidth: 896, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          <div>
            <Logo lightMode={!dark} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: fg3, marginTop: 10 }}>VeriCore.One · Automotive Verification</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: fg4, marginTop: 4 }}>Active Development</p>
          </div>
          <div style={{ display: 'flex', gap: 48 }}>
            {[
              { title: 'Navigation', links: [['Platform', 'platform'], ['Products', 'products']] },
              { title: 'Legal', links: [['Legal Notice', 'impressum'], ['Privacy Policy', 'privacy']] }
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: fg4, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{col.title}</p>
                {col.links.map(([label, target]) => (
                  <button key={label} onClick={() => onNavigate(target)} style={{
                    display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: fg3,
                    padding: 0, marginBottom: 8, transition: 'color .15s'
                  }}>{label}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: fg4 }}>© 2026 VeriAI Systems</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: fg4 }}>VeriCore.One — advancing software verification and validation.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Export ────────────────────────────────────────────────────────
Object.assign(window, { Logo, LogoMark, Navbar, Footer, IconBtn });
