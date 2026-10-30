// VeriCore Workbench — Toolbar (v2: high-visibility controls + day/night toggle)
const { useState } = React;

const MENUS = {
  File:  ['New Session', 'Open Log File…', 'Import DBC…', '—', 'Save Session', 'Export Report…', '—', 'Preferences'],
  View:  ['Signal Overview', 'Rule Tree', 'Evidence Panel', '—', 'Zoom In', 'Zoom Out', 'Fit to Window'],
  Run:   ['Run All Rules', 'Run Selected', 'Stop', '—', 'Baseline Run', 'Optimization Run', '—', 'Clear Results'],
  Tools: ['DSL Validator', 'DBC Browser', 'Signal Mapper', 'CAN Replay Config', '—', 'Engine Settings'],
  Help:  ['Documentation', 'DSL Reference', '—', 'About VeriAI Systems']
};

function Toolbar({ running, onRun, onStop, onReset, stats, dark, onToggleDark }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [hovMenu,  setHovMenu]  = useState(null);

  const bg     = dark ? '#0a0f1a' : '#f1f5f9';
  const border = dark ? '#1e293b' : '#cbd5e1';
  const menuFg = dark ? '#94a3b8' : '#475569';
  const menuHovBg = dark ? '#1e293b' : '#e2e8f0';
  const logoFg = dark ? '#f1f5f9' : '#0f172a';

  return (
    <div style={{
      height: 48, background: bg, borderBottom: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', flexShrink: 0,
      userSelect: 'none', position: 'relative', zIndex: 100,
      transition: 'background .2s, border-color .2s'
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', borderRight: `1px solid ${border}`, height: '100%'
      }}>
        <div style={{ width: 22, height: 22, background: '#2563eb', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: logoFg, letterSpacing: '0.06em' }}>
          VeriCore <span style={{ color: '#3b82f6' }}>Workbench</span>
        </span>
      </div>

      {/* Menu bar */}
      <div style={{ display: 'flex', height: '100%' }}>
        {Object.keys(MENUS).map(menu => (
          <div key={menu} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
              onMouseEnter={() => { setHovMenu(menu); if (openMenu) setOpenMenu(menu); }}
              onMouseLeave={() => setHovMenu(null)}
              style={{
                height: '100%', padding: '0 11px',
                background: openMenu === menu || hovMenu === menu ? menuHovBg : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: openMenu === menu ? (dark ? '#e2e8f0' : '#0f172a') : menuFg,
                transition: 'background .1s, color .1s'
              }}>{menu}</button>

            {openMenu === menu && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 200,
                background: dark ? '#0f172a' : '#fff',
                border: `1px solid ${border}`, borderRadius: 6,
                padding: '4px 0', minWidth: 200,
                boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 4px 20px rgba(0,0,0,0.15)'
              }} onMouseLeave={() => setOpenMenu(null)}>
                {MENUS[menu].map((item, i) => item === '—'
                  ? <div key={i} style={{ height: 1, background: border, margin: '4px 0' }} />
                  : <button key={i}
                      onClick={() => {
                        if (item === 'Run All Rules') onRun();
                        if (item === 'Stop') onStop();
                        if (item === 'Clear Results') onReset();
                        setOpenMenu(null);
                      }}
                      style={{
                        display: 'block', width: '100%', padding: '6px 16px', textAlign: 'left',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        color: dark ? '#94a3b8' : '#475569'
                      }}
                      onMouseEnter={e => { e.target.style.background = menuHovBg; e.target.style.color = dark ? '#e2e8f0' : '#0f172a'; }}
                      onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = dark ? '#94a3b8' : '#475569'; }}
                    >{item}</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Run controls ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 16px', borderLeft: `1px solid ${border}`, marginLeft: 4, height: '100%'
      }}>
        {/* Run All */}
        <ActionBtn
          label="▶  Run All"
          onClick={onRun}
          disabled={running}
          baseColor="#16a34a"
          hovColor="#22c55e"
          activeColor="#15803d"
          disabledBg={dark ? '#0d2015' : '#d1fae5'}
          disabledFg={dark ? '#1a4a2a' : '#6ee7b7'}
          dark={dark}
        />
        {/* Stop */}
        <ActionBtn
          label="■  Stop"
          onClick={onStop}
          disabled={!running}
          baseColor="#dc2626"
          hovColor="#ef4444"
          activeColor="#b91c1c"
          disabledBg={dark ? 'transparent' : '#fee2e2'}
          disabledFg={dark ? '#6b2a2a' : '#fca5a5'}
          disabledBorder={dark ? '#4a1c1c' : '#fecaca'}
          dark={dark}
        />
        {/* Reset */}
        <ActionBtn
          label="↺  Reset"
          onClick={onReset}
          disabled={false}
          baseColor="#d97706"
          hovColor="#f59e0b"
          activeColor="#b45309"
          disabledBg="transparent"
          disabledFg="#475569"
          dark={dark}
        />
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', marginLeft: 'auto',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10
      }}>
        {running && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6', marginRight: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1s ease-in-out infinite' }}></div>
            <span style={{ fontSize: 9, letterSpacing: '0.12em', fontWeight: 700 }}>RUNNING</span>
          </div>
        )}
        <StatChip label="PASS"    value={stats.pass}    color="#22c55e" dark={dark} />
        <StatChip label="FAIL"    value={stats.fail}    color="#f87171" dark={dark} />
        <StatChip label="UNKN"    value={stats.unknown} color="#f59e0b" dark={dark} />
        <div style={{ color: dark ? '#1e293b' : '#cbd5e1', borderLeft: `1px solid ${border}`, paddingLeft: 10, marginLeft: 2, fontSize: 9, color: dark ? '#334155' : '#94a3b8' }}>
          CAN_HIL_Run_004
        </div>

        {/* Day/Night toggle */}
        <ThemeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      {openMenu && <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setOpenMenu(null)} />}
    </div>
  );
}

// ── Prominent action button ──────────────────────────────────────
function ActionBtn({ label, onClick, disabled, baseColor, hovColor, activeColor, disabledBg, disabledFg, disabledBorder, dark }) {
  const [hov, setHov] = useState(false);
  const [active, setActive] = useState(false);

  const bg = disabled ? disabledBg : active ? activeColor : hov ? hovColor : baseColor;
  const fg = disabled ? disabledFg : '#ffffff';
  const borderColor = disabled ? (disabledBorder || `${disabledFg}44`) : (active ? activeColor : hovColor);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => { setHov(false); setActive(false); }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        height: 32, padding: '0 14px', borderRadius: 5,
        border: `1px solid ${borderColor}`,
        background: bg, color: fg,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
        letterSpacing: '0.04em', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 4,
        transition: 'background .12s, border-color .12s, color .12s',
        outline: 'none',
        boxShadow: !disabled && !active ? `0 0 0 0 ${baseColor}00` : 'none',
        transform: active && !disabled ? 'scale(0.97)' : 'scale(1)',
      }}
      onFocus={e => { if (!disabled) e.target.style.boxShadow = `0 0 0 2px ${baseColor}55`; }}
      onBlur={e  => { e.target.style.boxShadow = 'none'; }}
    >{label}</button>
  );
}

function StatChip({ label, value, color, dark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
      <span style={{ color: dark ? '#334155' : '#94a3b8' }}>{label}</span>
      <span style={{
        background: `${color}22`, border: `1px solid ${color}44`,
        color, borderRadius: 3, padding: '1px 6px', fontWeight: 700, fontSize: 10
      }}>{value}</span>
    </div>
  );
}

function ThemeToggle({ dark, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        marginLeft: 10,
        height: 32, padding: '0 12px',
        borderRadius: 6,
        border: `1px solid ${hov ? '#3b82f6' : (dark ? '#334155' : '#94a3b8')}`,
        background: dark ? (hov ? '#1e293b' : '#0f172a') : (hov ? '#dbeafe' : '#e2e8f0'),
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 7,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
        color: dark ? (hov ? '#e2e8f0' : '#94a3b8') : (hov ? '#1d4ed8' : '#475569'),
        letterSpacing: '0.06em',
        transition: 'background .15s, border-color .15s, color .15s'
      }}
    >
      {dark ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          NIGHT
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          </svg>
          DAY
        </>
      )}
    </button>
  );
}

Object.assign(window, { Toolbar });
