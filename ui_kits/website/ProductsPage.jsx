// VeriAI Systems — Products Page

const { useState } = React;

const PRODUCTS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
    title: 'Real-Time Signal Validation',
    desc: 'Validate live CAN and UART signals against DSL rules in real time.',
    tags: 'CAN · UART · Live',
    page: 'product-realtime'
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Simulation Validation',
    desc: 'Software-in-the-loop behavioral validation against DSL-defined specifications.',
    tags: 'SIL · Model · Early Validation',
    page: 'product-sim'
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></svg>,
    title: 'HIL Testing',
    desc: 'Hardware-in-the-loop closed-loop ECU testing with deterministic rule evaluation.',
    tags: 'HIL · ECU · Hardware',
    page: 'product-hil'
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Log Replay & Analysis',
    desc: 'Replay CAN candump, CSV timelines, and UART logs against rule sets.',
    tags: 'CAN · CSV · UART · Regression',
    page: 'product-log'
  }
];

function ProductCard({ product, dark, onNavigate }) {
  const [hov, setHov] = useState(false);
  const border = dark ? '#1e293b' : '#e2e8f0';
  return (
    <div onClick={() => onNavigate(product.page)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: 24, borderRadius: 12, cursor: 'pointer',
        border: `1px solid ${hov ? 'rgba(59,130,246,0.4)' : border}`,
        background: hov ? (dark ? 'rgba(15,23,42,0.5)' : 'rgba(59,130,246,0.03)') : (dark ? 'transparent' : '#fff'),
        transition: 'border-color .2s, background .2s'
      }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, marginBottom: 16,
        background: hov ? '#2563eb' : 'rgba(59,130,246,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? '#fff' : '#3b82f6', transition: 'background .2s, color .2s'
      }}>
        <svg style={{ width: 14, height: 14 }}>{product.icon.props.children}</svg>
      </div>
      <h3 style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
        color: hov ? (dark ? '#fff' : '#2563eb') : (dark ? '#e2e8f0' : '#0f172a'),
        marginBottom: 8, transition: 'color .2s'
      }}>{product.title}</h3>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', lineHeight: 1.65, marginBottom: 12 }}>{product.desc}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: dark ? '#334155' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.tags}</p>
    </div>
  );
}

function ProductsPage({ dark, onNavigate }) {
  const border = dark ? '#1e293b' : '#e2e8f0';
  const fg1 = dark ? '#f1f5f9' : '#0f172a';
  const fg3 = dark ? '#64748b' : '#64748b';
  const fg5 = dark ? '#334155' : '#94a3b8';
  return (
    <main style={{ paddingTop: 56 }}>
      {/* Header */}
      <header style={{ padding: '56px 24px 48px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Products</p>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', color: fg1, marginBottom: 12 }}>VeriCore.One capabilities.</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: fg3, maxWidth: 520, lineHeight: 1.65 }}>
            Signal-based validation tools for embedded systems teams. Additional application domains are under evaluation for future releases.
          </p>
        </div>
      </header>

      {/* Engineering domain */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 4, height: 20, background: '#3b82f6', borderRadius: 9999 }}></div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Engineering Validation</p>
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, color: fg1, marginBottom: 4, paddingLeft: 16 }}>Signal-based validation tools for embedded systems engineers.</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: fg5, paddingLeft: 16, marginBottom: 32 }}>Independent products · Deployable separately · No compliance dependency</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {PRODUCTS.map(p => <ProductCard key={p.title} product={p} dark={dark} onNavigate={onNavigate} />)}
          </div>
        </div>
      </section>

      {/* Future */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 4, height: 20, background: '#f59e0b', borderRadius: 9999 }}></div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Future Applications</p>
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, color: fg1, paddingLeft: 16, marginBottom: 12 }}>Additional domains under evaluation.</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: fg3, paddingLeft: 16 }}>
            Compliance validation and further application domains are under evaluation for future releases.
          </p>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { ProductsPage, ProductCard, Btn: window.Btn });
