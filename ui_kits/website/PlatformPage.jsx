// VeriAI Systems — Platform Page

const { useState, useRef, useEffect } = React;

const STEPS = [
  { num: '01', title: 'Natural Language Requirements', desc: 'Describe expected system behavior in plain language. No formal specification syntax required. English, German, or Chinese.' },
  { num: '02', title: 'Structured DSL Transformation', desc: 'Requirements are parsed into deterministic DSL rules through controlled transformation logic. No ambiguity, no interpretation gaps, no black-box processing.' },
  { num: '03', title: 'Deterministic Validation', desc: 'Rules execute against real-world signal data — CAN, CSV, UART. Every validation produces a traceable, reproducible result with full audit trail.' }
];

const CAPABILITIES = [
  { icon: 'cpu', title: 'VeriCore Engine', desc: 'Every rule evaluation produces the same result given the same input. No probabilistic behavior, no runtime variance. Suitable for safety-critical environments.' },
  { icon: 'activity', title: 'Signal-Based Rule Evaluation', desc: 'Validation rules operate directly on signal timelines — CAN, CSV, UART — not on code or test stubs. Real system behavior is the ground truth.' },
  { icon: 'hard-drive', title: 'Local Execution', desc: 'The platform runs entirely on-premise. No cloud dependency, no data transmission, no external services required.' },
  { icon: 'repeat', title: 'Reproducible Validation Workflows', desc: 'Baseline and optimized runs produce comparable, auditable results. Full trace for every pass/fail decision.' }
];

const PARADIGM = [
  { icon: 'terminal', title: 'DSL: The Unified Interface', desc: 'Expressing complex system logic as verifiable rules. The bridge between human requirement and machine verification.' },
  { icon: 'zap', title: 'VeriCore Engine', desc: 'Eliminating uncertainty. Every requirement is validated against real-time signals with microsecond precision.' },
  { icon: 'layers', title: 'Requirement Provenance', desc: 'Direct traceability from signal-level validation back to high-level requirements. Every pass/fail has a behavioral root cause.' },
  { icon: 'database', title: 'Multi-source Replay', desc: 'Replay CAN logs, CSV timelines, and UART traces through a unified adapter framework.' },
  { icon: 'bar-chart-2', title: 'Validation Optimization', desc: 'Metrics-driven selection engine targets 30–50% reduction in execution cost while retaining critical defect detection.' },
  { icon: 'alert-circle', title: 'Signal Quality Diagnostics', desc: 'Distinguishes system failures from data-quality issues. UNKNOWN and WEAK verdicts prevent false failures.' }
];

const FAQ = [
  { q: 'Do I need to write DSL manually?', a: 'No. VeriCore.One transforms natural language requirements into executable DSL automatically through controlled transformation logic.' },
  { q: 'How is this different from traditional testing?', a: 'Traditional testing validates implementations. VeriCore.One validates system behavior directly from requirements — against real-world signal conditions.' },
  { q: 'How does the DSL integrate with existing toolchains?', a: 'The DSL is an abstraction layer mappable to existing test environments, simulation frameworks, or real hardware interfaces.' },
  { q: 'What signal types are supported?', a: 'CAN, Ethernet, and analog signals. The platform validates cross-signal dependencies and temporal behavior across heterogeneous multi-signal environments.' },
  { q: 'Simulation or real hardware?', a: 'Both. Consistent validation logic regardless of execution environment — simulation models or real-world hardware signal inputs.' },
  { q: 'Does the platform rely on cloud-based AI?', a: 'No. All processing is local. This ensures deterministic behavior, reproducibility, and suitability for safety-critical environments.' }
];

function IconSvg({ name }) {
  const icons = {
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></>,
    activity: <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>,
    'hard-drive': <><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></>,
    repeat: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
    terminal: <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    'bar-chart-2': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    'alert-circle': <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    'check-circle': <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>
  };
  return <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

function ParadigmCard({ item, dark }) {
  const [hov, setHov] = useState(false);
  const border = dark ? '#1e293b' : '#e2e8f0';
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: 20, borderRadius: 12, cursor: 'default',
      border: `1px solid ${hov ? 'rgba(59,130,246,0.4)' : border}`,
      background: dark ? 'transparent' : '#fff', transition: 'border-color .2s'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, marginBottom: 18,
        background: hov ? '#2563eb' : 'rgba(59,130,246,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? '#fff' : '#3b82f6', transition: 'background .2s, color .2s'
      }}>
        <IconSvg name={item.icon} />
      </div>
      <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: dark ? '#e2e8f0' : '#0f172a', marginBottom: 8 }}>{item.title}</h3>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
    </div>
  );
}

function DemoPanel({ dark }) {
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(false);
  const border = dark ? '#1e293b' : '#e2e8f0';
  const panelBg = dark ? 'rgba(15,23,42,0.6)' : '#f8fafc';

  function run() {
    if (running) return;
    setRunning(true); setShown(false);
    setTimeout(() => { setRunning(false); setShown(true); }, 1800);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 16 }}>
      {/* DSL Input */}
      <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', background: dark ? 'transparent' : '#fff' }}>
        <div style={{ padding: '8px 16px', borderBottom: `1px solid ${border}`, background: panelBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Requirement_Input</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: dark ? '#334155' : '#94a3b8' }}>VeriCore DSL v2.4</span>
        </div>
        <div style={{ padding: '20px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.8 }}>
          {[
            [<span style={{ color: '#a78bfa', fontStyle: 'italic' }}>// "If speed &gt; 30 and collision risk → brake within 150ms"</span>],
            [<span><span style={{ color: '#a78bfa', fontWeight: 700 }}>RULE</span><span style={{ color: '#93c5fd' }}> "Emergency_Response"</span></span>],
            [<span><span style={{ color: '#a78bfa', fontWeight: 700 }}>IF</span><span style={{ color: dark ? '#cbd5e1' : '#334155' }}> vehicle_speed &gt; 30.0</span></span>],
            [<span><span style={{ color: '#a78bfa', fontWeight: 700 }}>AND</span><span style={{ color: dark ? '#cbd5e1' : '#334155' }}> collision_alert == </span><span style={{ color: '#f87171' }}>TRUE</span></span>],
            [<span style={{ color: '#a78bfa', fontWeight: 700 }}>THEN</span>],
            [<span>&nbsp;&nbsp;<span style={{ color: '#fcd34d', fontWeight: 700 }}>ASSERT</span><span style={{ color: dark ? '#cbd5e1' : '#334155' }}> brake_pressure &gt; 80.0</span></span>],
            [<span>&nbsp;&nbsp;<span style={{ color: '#fcd34d', fontWeight: 700 }}>WITHIN</span><span style={{ color: dark ? '#cbd5e1' : '#334155' }}> 150ms</span></span>],
            [<span style={{ color: '#a78bfa', fontWeight: 700 }}>END</span>],
          ].map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: dark ? '#334155' : '#cbd5e1', width: 16, textAlign: 'right', flexShrink: 0, fontSize: 10 }}>{i + 1}</span>
              <span>{line[0]}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: dark ? '#334155' : '#cbd5e1', width: 16, textAlign: 'right', fontSize: 10 }}>9</span>
            <span style={{ display: 'inline-block', width: 7, height: 14, background: '#3b82f6', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }}></span>
          </div>
        </div>
      </div>

      {/* Engine Output */}
      <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', background: dark ? 'transparent' : '#fff', position: 'relative' }}>
        {running && (
          <div style={{ position: 'absolute', inset: 0, background: dark ? 'rgba(10,15,26,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 36, height: 36, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Engine: Evaluating Cross-Signal Dependencies...</p>
          </div>
        )}
        <div style={{ padding: '8px 16px', borderBottom: `1px solid ${border}`, background: panelBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: dark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Real-Time_Behavior_Validation</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s ease-in-out infinite' }}></span>
        </div>
        <div style={{ padding: 24 }}>
          <svg viewBox="0 0 400 100" style={{ width: '100%', height: 80, marginBottom: 24, overflow: 'visible' }}>
            <line x1="0" y1="85" x2="400" y2="85" stroke={dark ? '#1e293b' : '#e2e8f0'} strokeWidth="1"/>
            <path d="M0 85 L120 85 L120 35 L280 35 L280 85 L400 85" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset={shown || !running ? '0' : '1000'} style={{ transition: shown ? 'stroke-dashoffset 2s ease' : 'none' }}/>
            <path d="M0 85 L145 85 L145 18 L300 18 L300 85 L400 85" fill="none" stroke="#f87171" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset={shown || !running ? '0' : '1000'} style={{ transition: shown ? 'stroke-dashoffset 2s ease 0.4s' : 'none' }}/>
            <line x1="120" y1="0" x2="120" y2="85" stroke={dark ? '#334155' : '#cbd5e1'} strokeDasharray="4"/>
            <line x1="145" y1="0" x2="145" y2="85" stroke={dark ? '#334155' : '#cbd5e1'} strokeDasharray="4"/>
            <text x="125" y="12" fontFamily="monospace" fontSize="9" fill="#60a5fa">Δt = 25ms</text>
          </svg>
          <div style={{
            padding: 16, borderRadius: 12, opacity: shown ? 1 : 0,
            background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'flex-start', gap: 16,
            transition: 'opacity 0.5s'
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
              <IconSvg name="check-circle" />
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Behavior Verified</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#64748b', lineHeight: 1.65 }}>
                REQUIREMENT "Emergency_Response" MET.<br/>
                Observed reaction time 25ms &lt; threshold 150ms.<br/>
                Confidence: STRONG · Verdict: PASS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformPage({ dark, onNavigate }) {
  const border = dark ? '#1e293b' : '#e2e8f0';
  const fg1 = dark ? '#f1f5f9' : '#0f172a';
  const fg3 = dark ? '#64748b' : '#64748b';
  const altBg = dark ? 'transparent' : '#f8fafc';
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoShown, setDemoShown] = useState(false);

  function runDemo() {
    if (demoRunning) return;
    setDemoRunning(true); setDemoShown(false);
    setTimeout(() => { setDemoRunning(false); setDemoShown(true); }, 1800);
  }

  return (
    <main style={{ paddingTop: 56 }}>

      {/* Page Header */}
      <header style={{ padding: '56px 24px 48px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Platform</p>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', color: fg1, marginBottom: 12 }}>VeriCore.One — Automotive Verification</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: fg3, maxWidth: 560, lineHeight: 1.65 }}>
            Deterministic. Local. Traceable. From natural language requirement to executable validation — without black-box processing.
          </p>
        </div>
      </header>

      {/* How it works */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>How it works</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 40 }}>Three steps from requirement to verdict.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                padding: 28,
                borderRight: i < 2 ? `1px solid ${border}` : 'none',
                background: dark ? 'transparent' : '#fff'
              }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>{step.num}</p>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: dark ? '#e2e8f0' : '#0f172a', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}`, background: altBg }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Capabilities</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 40 }}>Core platform capabilities.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
            {CAPABILITIES.map((cap, i) => (
              <div key={i} style={{ display: 'flex', gap: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <IconSvg name={cap.icon} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: dark ? '#e2e8f0' : '#0f172a', marginBottom: 8 }}>{cap.title}</h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', lineHeight: 1.65 }}>{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paradigm */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Paradigm</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 8 }}>The Validation Paradigm</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: fg3, marginBottom: 36, maxWidth: 480, lineHeight: 1.65 }}>An integrated environment for translating requirements into verifiable system truth.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PARADIGM.map((item, i) => <ParadigmCard key={i} item={item} dark={dark} />)}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}`, background: altBg }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Demo</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 10 }}>Executable Requirement Demo</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <span>Requirement</span><span style={{ opacity: .5 }}>→</span>
                <span>DSL</span><span style={{ opacity: .5 }}>→</span>
                <span>Validation</span><span style={{ opacity: .5 }}>→</span>
                <span>Verdict</span>
              </div>
            </div>
            <Btn onClick={runDemo}>▶ Verify Behavior</Btn>
          </div>
          <DemoPanel dark={dark} />
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Engineering Philosophy</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 40 }}>Modern systems are defined by behavior, not code.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: dark ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Traditional Testing</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
                Validates specific implementations and unit-level functions. Often disconnected from high-level system requirements, leading to coverage gaps in complex interactions.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>VeriCore.One Paradigm</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: dark ? '#cbd5e1' : '#334155', lineHeight: 1.7, fontWeight: 500, marginBottom: 16 }}>
                Validates system-level behavior defined directly by requirements. The deterministic engine ensures the physical world behaves exactly as specified in the rule world.
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: dark ? '#475569' : '#94a3b8', lineHeight: 1.65, borderLeft: '2px solid rgba(59,130,246,0.3)', paddingLeft: 16 }}>
                System Boundary: The system observes and validates signals, but does not control or intrude upon the environment itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}`, background: altBg }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>FAQ</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 40 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px' }}>
            {FAQ.map((item, i) => (
              <div key={i}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: i % 2 === 0 ? '#3b82f6' : (dark ? '#cbd5e1' : '#334155'), marginBottom: 8 }}>{item.q}</h3>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', lineHeight: 1.65 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Contact</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em', color: fg1, marginBottom: 8 }}>Get in touch</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: dark ? '#334155' : '#94a3b8', marginBottom: 36 }}>Direct channels — no forms, no intermediaries.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
            {[
              { label: 'Engineering inquiries', desc: 'Technical questions, validation system, DSL, integration.', email: 'engineering@veriai-systems.com' },
              { label: 'General inquiries', desc: 'Partnerships, early access requests, general information.', email: 'info@veriai-systems.com' }
            ].map((c, i) => (
              <div key={i} style={{ padding: 20, border: `1px solid ${border}`, borderRadius: 12, background: dark ? 'rgba(15,23,42,0.3)' : '#f8fafc' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: i === 0 ? '#3b82f6' : (dark ? '#475569' : '#94a3b8'), textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>{c.label}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>{c.desc}</p>
                <a href={`mailto:${c.email}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: dark ? '#cbd5e1' : '#334155', textDecoration: 'none' }}>{c.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

Object.assign(window, { PlatformPage });
