// VeriCore Workbench — Rule Explorer (day/night aware)
const { useState } = React;

const VERDICT_COLOR = {
  PASS: '#22c55e', FAIL: '#f87171', UNKNOWN: '#f59e0b',
  WEAK: '#94a3b8', RUNNING: '#3b82f6', PENDING: '#475569'
};

const RULE_GROUPS = [
  {
    id: 'safety', label: 'Safety_Critical', domain: 'engineering',
    rules: [
      { id: 'r1',  name: 'Emergency_Response',    status: 'PASS',    signals: ['vehicle_speed','collision_alert','brake_pressure'], duration: '25ms',  confidence: 'STRONG' },
      { id: 'r2',  name: 'Speed_Limit_Zone',      status: 'PASS',    signals: ['vehicle_speed','zone_limit'],                       duration: '—',     confidence: 'STRONG' },
      { id: 'r3',  name: 'Collision_Override',    status: 'UNKNOWN', signals: ['collision_alert','steering_input'],                 duration: '—',     confidence: 'WEAK'   },
      { id: 'r4',  name: 'Brake_Latency_Check',   status: 'FAIL',    signals: ['brake_cmd','brake_pressure'],                      duration: '218ms', confidence: 'STRONG' },
      { id: 'r5',  name: 'Seatbelt_Interlock',    status: 'PASS',    signals: ['seatbelt_status','door_lock'],                     duration: '—',     confidence: 'STRONG' },
    ]
  },
  {
    id: 'can', label: 'CAN_Signal_Integrity', domain: 'engineering',
    rules: [
      { id: 'r6',  name: 'Bus_Timeout_Detection', status: 'PASS',    signals: ['can_bus_0','can_bus_1'], duration: '—', confidence: 'STRONG' },
      { id: 'r7',  name: 'DLC_Validation',         status: 'PASS',    signals: ['can_bus_0'],            duration: '—', confidence: 'STRONG' },
      { id: 'r8',  name: 'CRC_Error_Rate',         status: 'UNKNOWN', signals: ['can_bus_1'],            duration: '—', confidence: 'WEAK'   },
    ]
  },
  {
    id: 'ecu', label: 'ECU_Behavioral', domain: 'engineering',
    rules: [
      { id: 'r9',  name: 'Engine_Startup_Sequence', status: 'PASS',    signals: ['engine_rpm','throttle'], duration: '340ms', confidence: 'STRONG' },
      { id: 'r10', name: 'Throttle_Response',        status: 'PASS',    signals: ['throttle','vehicle_speed'], duration: '80ms', confidence: 'STRONG' },
      { id: 'r11', name: 'Idle_Recovery',            status: 'PENDING', signals: ['engine_rpm'],            duration: '—', confidence: '—' },
      { id: 'r12', name: 'Overheat_Protection',      status: 'PENDING', signals: ['engine_temp'],           duration: '—', confidence: '—' },
    ]
  }
];

function VerdictBadge({ status, small }) {
  const color = VERDICT_COLOR[status] || '#475569';
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: small ? 8 : 9, fontWeight: 700, color,
      background: `${color}18`, border: `1px solid ${color}33`,
      borderRadius: 3, padding: small ? '1px 4px' : '1px 6px',
      letterSpacing: '0.05em', flexShrink: 0,
      animation: status === 'RUNNING' ? 'pulse 1s ease-in-out infinite' : 'none'
    }}>{status}</span>
  );
}

function RuleRow({ rule, selected, onClick, dark }) {
  const [hov, setHov] = useState(false);
  const selBg  = dark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.10)';
  const hovBg  = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  const textFg = selected ? (dark ? '#e2e8f0' : '#0f172a') : (dark ? '#94a3b8' : '#475569');
  return (
    <div onClick={() => onClick(rule)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 12px 5px 28px', cursor: 'pointer',
        background: selected ? selBg : hov ? hovBg : 'transparent',
        borderLeft: selected ? '2px solid #2563eb' : '2px solid transparent',
        transition: 'background .1s'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: VERDICT_COLOR[rule.status] || '#334155' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: textFg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rule.name}</span>
      </div>
      <VerdictBadge status={rule.status} small />
    </div>
  );
}

function GroupHeader({ group, open, onToggle, dark }) {
  const [hov, setHov] = useState(false);
  const passCount = group.rules.filter(r => r.status === 'PASS').length;
  const failCount = group.rules.filter(r => r.status === 'FAIL').length;
  const borderColor = dark ? '#0d1525' : '#e2e8f0';
  const hovBg = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
  return (
    <div onClick={onToggle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', cursor: 'pointer', background: hov ? hovBg : 'transparent', borderBottom: `1px solid ${borderColor}` }}>
      <svg style={{ width: 9, height: 9, color: dark ? '#475569' : '#94a3b8', flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
           viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.15em', flex: 1 }}>{group.label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#22c55e' }}>{passCount}✓</span>
      {failCount > 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#f87171' }}>{failCount}✗</span>}
    </div>
  );
}

function PanelBtn({ title, icon, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 18, height: 18, borderRadius: 3, border: 'none', cursor: 'pointer',
        background: hov ? (dark ? '#1e293b' : '#e2e8f0') : 'transparent',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: hov ? (dark ? '#94a3b8' : '#475569') : (dark ? '#334155' : '#94a3b8'),
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
  );
}

function RuleExplorer({ selectedRule, onSelectRule, rules, panelWidth, dark }) {
  const [openGroups, setOpenGroups] = useState({ safety: true, can: true, ecu: true });
  const [search, setSearch] = useState('');
  const toggle = id => setOpenGroups(g => ({ ...g, [id]: !g[id] }));

  const bg        = dark ? '#080d18' : '#f8fafc';
  const border    = dark ? '#1e293b' : '#e2e8f0';
  const headerBg  = dark ? '#06090f' : '#f1f5f9';
  const inputBg   = dark ? '#0d1525' : '#fff';
  const inputFg   = dark ? '#94a3b8' : '#475569';
  const footerFg  = dark ? '#334155' : '#94a3b8';

  const filtered = rules.map(g => ({
    ...g, rules: g.rules.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(g => !search || g.rules.length > 0);

  return (
    <div style={{ width: panelWidth, flexShrink: 0, background: bg, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background .2s' }}>
      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: `1px solid ${border}`, background: headerBg, flexShrink: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: dark ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Rule Explorer</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <PanelBtn title="Expand All" icon="+" dark={dark} />
          <PanelBtn title="Filter FAIL" icon="⚠" dark={dark} />
        </div>
      </div>

      <div style={{ padding: '8px 10px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 11, height: 11, color: dark ? '#334155' : '#94a3b8' }}
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter rules…"
            style={{ width: '100%', background: inputBg, border: `1px solid ${border}`, borderRadius: 4,
              padding: '5px 8px 5px 24px', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: inputFg, outline: 'none' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(group => (
          <div key={group.id}>
            <GroupHeader group={group} open={openGroups[group.id]} onToggle={() => toggle(group.id)} dark={dark} />
            {openGroups[group.id] && group.rules.map(rule => (
              <RuleRow key={rule.id} rule={rule} selected={selectedRule?.id === rule.id} onClick={onSelectRule} dark={dark} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${border}`, padding: '6px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: footerFg, display: 'flex', justifyContent: 'space-between', flexShrink: 0, background: headerBg }}>
        <span>{rules.reduce((s, g) => s + g.rules.length, 0)} rules</span>
        <span>VeriCore DSL v2.4</span>
      </div>
    </div>
  );
}

Object.assign(window, { RuleExplorer, RULE_GROUPS, VERDICT_COLOR });
