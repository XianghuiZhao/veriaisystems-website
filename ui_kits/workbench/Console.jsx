// VeriCore Workbench — Bottom Console (day/night aware)
const { useState, useRef, useEffect } = React;

const INITIAL_LOG = [
  { id: 1,  t: '00:00:00.000', level: 'INFO',  src: 'Engine',   msg: 'VeriCore Engine v2.4 initialised' },
  { id: 2,  t: '00:00:00.012', level: 'INFO',  src: 'Loader',   msg: 'Loading session: CAN_HIL_Run_004' },
  { id: 3,  t: '00:00:00.018', level: 'INFO',  src: 'Adapter',  msg: 'CAN adapter: candump format detected (DBC: vehicle_v3.dbc)' },
  { id: 4,  t: '00:00:00.031', level: 'INFO',  src: 'Adapter',  msg: '6 signals mapped: vehicle_speed, brake_pressure, engine_rpm, throttle_pos, collision_alert, CAN_Bus_0' },
  { id: 5,  t: '00:00:00.045', level: 'INFO',  src: 'Loader',   msg: '12 rules loaded from safety_v4.vdsl' },
  { id: 6,  t: '00:00:00.046', level: 'INFO',  src: 'Engine',   msg: 'Baseline mode: OFF · Optimisation mode: OFF' },
  { id: 7,  t: '00:00:00.050', level: 'INFO',  src: 'Engine',   msg: 'Ready. Awaiting run command.' },
];

const RUN_LOG = [
  { level: 'INFO',  src: 'Engine',  msg: 'Run started — evaluating 12 rules against 5000ms signal window' },
  { level: 'INFO',  src: 'Engine',  msg: '[Safety_Critical] Emergency_Response: evaluating IF conditions…' },
  { level: 'INFO',  src: 'Engine',  msg: '[Safety_Critical] Emergency_Response: conditions MET at t=2100ms' },
  { level: 'INFO',  src: 'Engine',  msg: '[Safety_Critical] Emergency_Response: ASSERT brake_pressure>80.0 → 91.4 bar in 25ms → PASS' },
  { level: 'PASS',  src: 'Verdict', msg: 'Emergency_Response → PASS (STRONG, 25ms, t=2125ms)' },
  { level: 'INFO',  src: 'Engine',  msg: '[Safety_Critical] Speed_Limit_Zone: vehicle_speed=45.2 within zone_limit=50.0 → PASS' },
  { level: 'PASS',  src: 'Verdict', msg: 'Speed_Limit_Zone → PASS (STRONG)' },
  { level: 'WARN',  src: 'Engine',  msg: '[Safety_Critical] Collision_Override: steering_input signal stale (last seen 2847ms ago)' },
  { level: 'WARN',  src: 'Verdict', msg: 'Collision_Override → UNKNOWN (WEAK) — signal quality insufficient' },
  { level: 'INFO',  src: 'Engine',  msg: '[Safety_Critical] Brake_Latency_Check: brake_cmd ACTIVE at t=2100ms, awaiting brake_pressure…' },
  { level: 'ERROR', src: 'Engine',  msg: '[Safety_Critical] Brake_Latency_Check: WITHIN 100ms exceeded — brake_pressure=18.2 bar at t=2318ms' },
  { level: 'FAIL',  src: 'Verdict', msg: 'Brake_Latency_Check → FAIL (STRONG, 218ms, t=2318ms) ← THRESHOLD EXCEEDED' },
  { level: 'PASS',  src: 'Verdict', msg: 'Seatbelt_Interlock → PASS (STRONG)' },
  { level: 'PASS',  src: 'Verdict', msg: 'Bus_Timeout_Detection → PASS (STRONG)' },
  { level: 'PASS',  src: 'Verdict', msg: 'DLC_Validation → PASS (STRONG)' },
  { level: 'WARN',  src: 'Verdict', msg: 'CRC_Error_Rate → UNKNOWN (WEAK) — frame count below threshold' },
  { level: 'PASS',  src: 'Verdict', msg: 'Engine_Startup_Sequence → PASS (STRONG, 340ms)' },
  { level: 'PASS',  src: 'Verdict', msg: 'Throttle_Response → PASS (STRONG, 80ms)' },
  { level: 'INFO',  src: 'Engine',  msg: 'Idle_Recovery / Overheat_Protection: skipped (signals not present in window)' },
  { level: 'INFO',  src: 'Engine',  msg: 'Run complete: 7 PASS · 1 FAIL · 2 UNKNOWN · 2 PENDING — 1.2ms total' },
];

const LEVEL_COLOR = { INFO: '#64748b', PASS: '#22c55e', FAIL: '#f87171', WARN: '#f59e0b', ERROR: '#f87171', DEBUG: '#475569' };
const LEVEL_BG_DARK  = { PASS: 'rgba(34,197,94,0.05)', FAIL: 'rgba(248,113,113,0.06)', WARN: 'rgba(245,158,11,0.05)', ERROR: 'rgba(248,113,113,0.06)' };
const LEVEL_BG_LIGHT = { PASS: 'rgba(34,197,94,0.06)', FAIL: 'rgba(248,113,113,0.07)', WARN: 'rgba(245,158,11,0.06)', ERROR: 'rgba(248,113,113,0.07)' };

let logId = INITIAL_LOG.length + 1;
function mkEntry(entry) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ms  = String(now.getMilliseconds()).padStart(3, '0');
  return { ...entry, id: logId++, t: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${ms}` };
}

function ConsolePane({ height, logs, onClear, dark }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ block: 'nearest' });
  }, [logs]);

  const bg       = dark ? '#06090f' : '#f1f5f9';
  const border   = dark ? '#1e293b' : '#e2e8f0';
  const rowBorder= dark ? '#060b14' : '#e8edf3';
  const tFg      = dark ? '#1e293b' : '#cbd5e1';
  const srcFg    = dark ? '#334155' : '#94a3b8';
  const filterFg = dark ? '#334155' : '#94a3b8';
  const inputFg  = dark ? '#64748b' : '#475569';
  const headerFg = dark ? '#475569' : '#94a3b8';

  const panelH = collapsed ? 32 : height;
  const LEVEL_BG = dark ? LEVEL_BG_DARK : LEVEL_BG_LIGHT;

  const filtered = logs.filter(e => {
    if (filter !== 'ALL' && e.level !== filter) return false;
    if (search && !e.msg.toLowerCase().includes(search.toLowerCase()) && !e.src.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ height: panelH, flexShrink: 0, background: bg, borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', transition: 'height .2s ease, background .2s', overflow: 'hidden' }}>
      <div style={{ height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderBottom: collapsed ? 'none' : `1px solid ${border}` }}>
        <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#475569' : '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: 9, height: 9, transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform .15s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: headerFg, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Console</span>
        {!collapsed && (
          <>
            <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
              {['ALL', 'PASS', 'FAIL', 'WARN', 'INFO'].map(lv => (
                <button key={lv} onClick={() => setFilter(lv)} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  padding: '2px 7px', borderRadius: 3, border: 'none', cursor: 'pointer',
                  background: filter === lv ? (dark ? '#1e293b' : '#e2e8f0') : 'transparent',
                  color: filter === lv ? (LEVEL_COLOR[lv] || (dark ? '#94a3b8' : '#334155')) : filterFg,
                  transition: 'background .1s, color .1s'
                }}>{lv}</button>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ marginLeft: 8, background: 'transparent', border: `1px solid ${border}`, borderRadius: 3, padding: '2px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: inputFg, outline: 'none', width: 160 }} />
            <button onClick={onClear} style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: filterFg, background: 'none', border: `1px solid ${border}`, borderRadius: 3, padding: '2px 7px', cursor: 'pointer' }}>Clear</button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: dark ? '#1e293b' : '#cbd5e1' }}>{filtered.length} entries</span>
          </>
        )}
      </div>

      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
          {filtered.map(e => (
            <div key={e.id} style={{ display: 'flex', gap: 10, padding: '2px 12px', background: LEVEL_BG[e.level] || 'transparent', borderBottom: `1px solid ${rowBorder}`, alignItems: 'baseline' }}>
              <span style={{ color: tFg, flexShrink: 0, fontSize: 10 }}>{e.t}</span>
              <span style={{ color: LEVEL_COLOR[e.level] || filterFg, fontWeight: 700, flexShrink: 0, width: 42, fontSize: 9 }}>{e.level}</span>
              <span style={{ color: srcFg, flexShrink: 0, width: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 9 }}>{e.src}</span>
              <span style={{ color: e.level === 'FAIL' || e.level === 'ERROR' ? '#f87171' : e.level === 'PASS' ? '#22c55e' : e.level === 'WARN' ? '#f59e0b' : (dark ? '#64748b' : '#475569'), lineHeight: 1.5 }}>{e.msg}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ConsolePane, INITIAL_LOG, RUN_LOG, mkEntry });
