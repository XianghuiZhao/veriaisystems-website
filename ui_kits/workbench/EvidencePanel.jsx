// VeriCore Workbench — Evidence Panel (day/night aware)
const { useState } = React;

const EVIDENCE_DATA = {
  r1: {
    rule: 'Emergency_Response', verdict: 'PASS', confidence: 'STRONG',
    execTime: '1.2ms', evalAt: '2125ms',
    conditions: [
      { expr: 'vehicle_speed > 30.0', observed: '45.2 km/h', result: 'PASS', detail: 'Signal sampled at t=2100ms' },
      { expr: 'collision_alert == TRUE', observed: 'HIGH at t=2100ms', result: 'PASS', detail: 'Rising edge detected' },
    ],
    assertions: [
      { expr: 'brake_pressure > 80.0', observed: '91.4 bar', result: 'PASS', timing: '25ms (< 150ms threshold)', detail: 'Within WITHIN window' },
    ],
    trace: [
      { t: '2100ms', msg: 'IF condition evaluated: vehicle_speed=45.2 > 30.0 → TRUE' },
      { t: '2100ms', msg: 'IF condition evaluated: collision_alert=TRUE → TRUE' },
      { t: '2100ms', msg: 'THEN block entered. Awaiting ASSERT…' },
      { t: '2125ms', msg: 'ASSERT brake_pressure > 80.0 → 91.4 bar → PASS' },
      { t: '2125ms', msg: 'WITHIN 150ms: elapsed 25ms → SATISFIED' },
      { t: '2125ms', msg: 'Verdict: PASS · Confidence: STRONG' },
    ]
  },
  r4: {
    rule: 'Brake_Latency_Check', verdict: 'FAIL', confidence: 'STRONG',
    execTime: '0.9ms', evalAt: '2318ms',
    conditions: [
      { expr: 'brake_cmd == ACTIVE', observed: 'ACTIVE at t=2100ms', result: 'PASS', detail: 'Command issued at t=2100ms' },
    ],
    assertions: [
      { expr: 'brake_pressure > 40.0', observed: '18.2 bar', result: 'FAIL', timing: '218ms (> 100ms threshold)', detail: 'WITHIN 100ms violated' },
    ],
    trace: [
      { t: '2100ms', msg: 'IF condition: brake_cmd=ACTIVE → TRUE' },
      { t: '2100ms', msg: 'THEN block entered. Awaiting ASSERT…' },
      { t: '2200ms', msg: 'WITHIN window 100ms exceeded. brake_pressure=18.2 bar' },
      { t: '2318ms', msg: 'ASSERT brake_pressure > 40.0 → 18.2 bar → FAIL' },
      { t: '2318ms', msg: 'Verdict: FAIL · Confidence: STRONG' },
    ]
  },
  r3: {
    rule: 'Collision_Override', verdict: 'UNKNOWN', confidence: 'WEAK',
    execTime: '1.4ms', evalAt: '3100ms',
    conditions: [
      { expr: 'collision_alert == TRUE', observed: 'HIGH at t=2100ms', result: 'PASS', detail: 'Signal present' },
      { expr: 'steering_input != NEUTRAL', observed: 'No signal data', result: 'UNKNOWN', detail: 'Signal absent / stale' },
    ],
    assertions: [],
    trace: [
      { t: '2100ms', msg: 'IF collision_alert=TRUE → TRUE' },
      { t: '2100ms', msg: 'IF steering_input: signal stale (last seen > 500ms ago)' },
      { t: '3100ms', msg: 'Timeout: WEAK signal quality for steering_input' },
      { t: '3100ms', msg: 'Verdict: UNKNOWN · Confidence: WEAK' },
    ]
  }
};

const RESULT_COLOR = { PASS: '#22c55e', FAIL: '#f87171', UNKNOWN: '#f59e0b', WEAK: '#94a3b8' };

function ConditionRow({ cond, dark }) {
  const color = RESULT_COLOR[cond.result] || '#64748b';
  const border = dark ? '#0d1525' : '#e2e8f0';
  const fg3 = dark ? '#475569' : '#94a3b8';
  const fg4 = dark ? '#64748b' : '#64748b';
  const fg5 = dark ? '#334155' : '#94a3b8';
  return (
    <div style={{ padding: '6px 0', borderBottom: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: dark ? '#94a3b8' : '#334155', flex: 1 }}>{cond.expr}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>{cond.result}</span>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: fg3 }}>
        observed: <span style={{ color: fg4 }}>{cond.observed}</span>
      </div>
      {cond.timing && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginTop: 2, color }}>
          timing: <span>{cond.timing}</span>
        </div>
      )}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: fg5, marginTop: 2 }}>{cond.detail}</div>
    </div>
  );
}

function TraceRow({ entry, dark }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '3px 0', borderBottom: `1px solid ${dark ? '#060b14' : '#f1f5f9'}` }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: dark ? '#334155' : '#94a3b8', flexShrink: 0, width: 48 }}>{entry.t}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: dark ? '#64748b' : '#475569', lineHeight: 1.5 }}>{entry.msg}</span>
    </div>
  );
}

function SectionTitle({ children, dark }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: dark ? '#334155' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>{children}</div>;
}

function Meta({ label, value, color, dark }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: dark ? '#334155' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: color || (dark ? '#64748b' : '#475569') }}>{value}</div>
    </div>
  );
}

function VDict({ label }) {
  const color = RESULT_COLOR[label] || '#64748b';
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em' }}>{label}</span>
  );
}

function EvidencePanel({ selectedRule, panelWidth, dark }) {
  const [tab, setTab] = useState('verdict');

  const bg       = dark ? '#080d18' : '#f8fafc';
  const headerBg = dark ? '#06090f' : '#f1f5f9';
  const border   = dark ? '#1e293b' : '#e2e8f0';
  const fg1      = dark ? '#e2e8f0' : '#0f172a';
  const fg3      = dark ? '#64748b' : '#64748b';
  const emptyFg  = dark ? '#1e293b' : '#cbd5e1';

  const ev = selectedRule ? (EVIDENCE_DATA[selectedRule.id] || null) : null;

  return (
    <div style={{ width: panelWidth, flexShrink: 0, background: bg, borderLeft: `1px solid ${border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background .2s' }}>
      <div style={{ height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: `1px solid ${border}`, background: headerBg }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: dark ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Evidence</span>
        {ev && <VDict label={ev.verdict} />}
      </div>

      {!selectedRule && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: emptyFg, textAlign: 'center', lineHeight: 1.6 }}>Select a rule in the explorer to view evidence</p>
        </div>
      )}

      {selectedRule && !ev && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: dark ? '#334155' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              {selectedRule.status === 'PENDING' ? 'NOT YET RUN' : 'RUNNING…'}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: fg3 }}>{selectedRule.name}</div>
          </div>
        </div>
      )}

      {ev && (
        <>
          <div style={{ padding: '10px 12px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: dark ? '#334155' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Rule</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: fg1 }}>{ev.rule}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
              <Meta label="Evaluated at" value={ev.evalAt} dark={dark} />
              <Meta label="Exec time" value={ev.execTime} dark={dark} />
              <Meta label="Confidence" value={ev.confidence} color={ev.confidence === 'STRONG' ? '#22c55e' : '#f59e0b'} dark={dark} />
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, flexShrink: 0, background: headerBg }}>
            {['verdict', 'trace'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '7px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: tab === t ? (dark ? '#e2e8f0' : '#0f172a') : (dark ? '#475569' : '#94a3b8'),
                borderBottom: tab === t ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'color .15s'
              }}>{t}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
            {tab === 'verdict' && (
              <>
                {ev.conditions.length > 0 && (
                  <><SectionTitle dark={dark}>Conditions</SectionTitle>
                  {ev.conditions.map((c, i) => <ConditionRow key={i} cond={c} dark={dark} />)}</>
                )}
                {ev.assertions.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <SectionTitle dark={dark}>Assertions</SectionTitle>
                    {ev.assertions.map((a, i) => <ConditionRow key={i} cond={a} dark={dark} />)}
                  </div>
                )}
                {selectedRule?.signals?.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <SectionTitle dark={dark}>Referenced Signals</SectionTitle>
                    {selectedRule.signals.map(s => (
                      <div key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b82f6', padding: '3px 0', borderBottom: `1px solid ${dark ? '#0d1525' : '#f1f5f9'}` }}>
                        <span style={{ color: dark ? '#334155' : '#94a3b8' }}>→ </span>{s}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {tab === 'trace' && (
              <>
                <SectionTitle dark={dark}>Execution Trace</SectionTitle>
                {ev.trace.map((entry, i) => <TraceRow key={i} entry={entry} dark={dark} />)}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { EvidencePanel });
