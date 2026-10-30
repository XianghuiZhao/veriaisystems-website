// VeriCore Workbench — Signal / Timeline Canvas
const { useState, useRef, useEffect, useCallback } = React;

// ── Signal data generation ─────────────────────────────────────
function generateSignals() {
  const N = 500; // samples
  const duration = 5000; // ms
  const dt = duration / N;

  const speed = [], collision = [], brake = [], rpm = [], throttle = [], canBus = [];

  for (let i = 0; i < N; i++) {
    const t = i * dt;
    // vehicle_speed: ramp up to ~45 km/h, then emergency brake after collision
    const preSpeed = Math.min(45, t * 12) + Math.sin(t * 0.8) * 0.4;
    const postSpeed = t > 2125 ? Math.max(0, preSpeed - (t - 2125) * 0.12) : preSpeed;
    speed.push({ t, v: Math.max(0, postSpeed) });

    // collision_alert: HIGH at t=2100ms
    collision.push({ t, v: t >= 2100 && t <= 4200 ? 1 : 0 });

    // brake_pressure: spikes at t=2125ms (25ms after collision)
    const brakePeak = t >= 2125 ? Math.min(92, (t - 2125) * 0.7) : (t > 1800 ? Math.max(0, (t - 1800) * 0.03) : 0);
    brake.push({ t, v: Math.max(0, brakePeak + (Math.random() * 0.5)) });

    // engine_rpm: follows speed roughly
    const rpmVal = postSpeed * 90 + 800 + Math.sin(t * 1.2) * 50;
    rpm.push({ t, v: Math.max(750, rpmVal) });

    // throttle: 0-100%, drops when brake applied
    const thr = t < 2100 ? Math.min(65, t * 18) : Math.max(0, 65 - (t - 2100) * 0.2);
    throttle.push({ t, v: Math.max(0, Math.min(100, thr + Math.sin(t * 2) * 1)) });

    // CAN bus activity (digital noise)
    canBus.push({ t, v: (Math.sin(t * 15) > 0.3) ? 1 : 0 });
  }

  return { speed, collision, brake, rpm, throttle, canBus };
}

const SIG_DATA = generateSignals();

const SIGNAL_DEFS = [
  { id: 'vehicle_speed',    label: 'vehicle_speed',    unit: 'km/h', min: 0,    max: 80,   color: '#3b82f6', type: 'analog',  data: SIG_DATA.speed,     format: v => v.toFixed(1) },
  { id: 'brake_pressure',   label: 'brake_pressure',   unit: 'bar',  min: 0,    max: 100,  color: '#f87171', type: 'analog',  data: SIG_DATA.brake,     format: v => v.toFixed(1) },
  { id: 'engine_rpm',       label: 'engine_rpm',       unit: 'RPM',  min: 0,    max: 6000, color: '#a78bfa', type: 'analog',  data: SIG_DATA.rpm,       format: v => Math.round(v).toString() },
  { id: 'throttle',         label: 'throttle_pos',     unit: '%',    min: 0,    max: 100,  color: '#f59e0b', type: 'analog',  data: SIG_DATA.throttle,  format: v => v.toFixed(0) },
  { id: 'collision_alert',  label: 'collision_alert',  unit: '',     min: 0,    max: 1,    color: '#22c55e', type: 'digital', data: SIG_DATA.collision, format: v => v ? 'HIGH' : 'LOW' },
  { id: 'can_bus_0',        label: 'CAN_Bus_0',        unit: '',     min: 0,    max: 1,    color: '#60a5fa', type: 'digital', data: SIG_DATA.canBus,    format: v => v ? 'HI' : 'LO' },
];

const TOTAL_MS = 5000;
const LANE_H_ANALOG  = 68;
const LANE_H_DIGITAL = 36;
const LABEL_W = 140;
const RULER_H = 24;

function getLaneH(sig) { return sig.type === 'digital' ? LANE_H_DIGITAL : LANE_H_ANALOG; }

function getValueAt(sig, tMs) {
  const d = sig.data;
  if (!d || d.length === 0) return 0;
  const idx = Math.min(d.length - 1, Math.floor((tMs / TOTAL_MS) * d.length));
  return d[idx]?.v ?? 0;
}

function buildPath(sig, visStart, visEnd, width, height, padY = 4) {
  const d = sig.data;
  if (!d.length) return '';
  const range = sig.max - sig.max * 0 + 0.001; // max - min
  const minV = sig.min;
  const maxV = sig.max;

  const pts = [];
  const startI = Math.floor((visStart / TOTAL_MS) * d.length);
  const endI   = Math.ceil((visEnd   / TOTAL_MS) * d.length);

  for (let i = startI; i <= Math.min(endI, d.length - 1); i++) {
    const t = d[i].t;
    const v = d[i].v;
    const x = ((t - visStart) / (visEnd - visStart)) * width;
    const norm = Math.max(0, Math.min(1, (v - minV) / (maxV - minV)));
    const y = height - padY - norm * (height - padY * 2);
    pts.push(`${i === startI ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

function buildDigitalPath(sig, visStart, visEnd, width, height) {
  const d = sig.data;
  if (!d.length) return '';
  const startI = Math.floor((visStart / TOTAL_MS) * d.length);
  const endI   = Math.ceil((visEnd   / TOTAL_MS) * d.length);
  const hiY = 6, loY = height - 6;
  const pts = [];
  let prev = null;
  for (let i = startI; i <= Math.min(endI, d.length - 1); i++) {
    const t = d[i].t;
    const v = d[i].v > 0.5 ? 1 : 0;
    const x = ((t - visStart) / (visEnd - visStart)) * width;
    const y = v ? hiY : loY;
    if (prev !== null && prev !== v) pts.push(`L${x.toFixed(1)},${(v ? loY : hiY)}`);
    if (i === startI) pts.push(`M${x.toFixed(1)},${y}`);
    else pts.push(`L${x.toFixed(1)},${y}`);
    prev = v;
  }
  return pts.join(' ');
}

// ── Lane component ─────────────────────────────────────────────
function SignalLane({ sig, visStart, visEnd, cursorMs, width, highlighted, dark }) {
  const h = getLaneH(sig);
  const cursorX = ((cursorMs - visStart) / (visEnd - visStart)) * width;
  const curVal  = getValueAt(sig, cursorMs);
  const path    = sig.type === 'digital'
    ? buildDigitalPath(sig, visStart, visEnd, width, h)
    : buildPath(sig, visStart, visEnd, width, h);

  const rowBorder  = dark ? '#0d1525' : '#e2e8f0';
  const labelBg    = highlighted ? 'rgba(37,99,235,0.08)' : (dark ? '#08101e' : '#f1f5f9');
  const labelBorder= dark ? '#1e293b' : '#e2e8f0';
  const labelFg    = highlighted ? (dark ? '#e2e8f0' : '#0f172a') : (dark ? '#64748b' : '#64748b');
  const unitFg     = dark ? '#475569' : '#94a3b8';
  const waveBg     = highlighted ? 'rgba(37,99,235,0.04)' : (dark ? '#080d18' : '#fafbfc');
  const gridStroke = dark ? '#0f1c2e' : '#edf2f7';
  const cursorStroke = dark ? '#ffffff22' : '#00000018';

  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${rowBorder}`, position: 'relative' }}>
      <div style={{
        width: LABEL_W, flexShrink: 0, padding: '4px 8px', borderRight: `1px solid ${labelBorder}`,
        background: labelBg,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 2, background: sig.color, borderRadius: 1, flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: labelFg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sig.label}</span>
        </div>
        <div style={{ paddingLeft: 13, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: sig.color }}>
          {sig.format(curVal)} <span style={{ fontSize: 9, fontWeight: 400, color: unitFg }}>{sig.unit}</span>
        </div>
      </div>

      {/* Waveform */}
      <div style={{ flex: 1, position: 'relative', height: h, background: waveBg }}>
        <svg width="100%" height={h} style={{ display: 'block', overflow: 'visible' }}
             viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="none">
          {sig.type === 'analog' && [0.25, 0.5, 0.75].map(p => (
            <line key={p} x1="0" y1={p * h} x2={width} y2={p * h} stroke={gridStroke} strokeWidth="1"/>
          ))}
          <path d={path} fill="none" stroke={sig.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
          {sig.type === 'analog' && path && (
            <path d={path + ` L${width},${h} L0,${h} Z`} fill={`${sig.color}12`}/>
          )}
          {cursorX >= 0 && cursorX <= width && (
            <>
              <line x1={cursorX} y1={0} x2={cursorX} y2={h} stroke={cursorStroke} strokeWidth="1"/>
              <circle cx={cursorX} cy={sig.type === 'digital'
                ? (curVal > 0.5 ? 6 : h - 6)
                : (h - 4 - (Math.max(0,Math.min(1,(curVal-sig.min)/(sig.max-sig.min)))) * (h - 8))
              } r="3" fill={sig.color} stroke="#080d18" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

// ── Ruler ──────────────────────────────────────────────────────
function TimeRuler({ visStart, visEnd, width, cursorMs, markers, dark }) {
  const range = visEnd - visStart;
  const tickStepMs = range > 3000 ? 500 : range > 1000 ? 200 : 100;
  const ticks = [];
  const firstTick = Math.ceil(visStart / tickStepMs) * tickStepMs;
  for (let t = firstTick; t <= visEnd; t += tickStepMs) ticks.push(t);
  const cursorX = ((cursorMs - visStart) / range) * width;

  const rulerBg    = dark ? '#06090f' : '#f1f5f9';
  const rulerBorder= dark ? '#1e293b' : '#e2e8f0';
  const tickMajor  = dark ? '#1e293b' : '#cbd5e1';
  const tickMinor  = dark ? '#0f1c2e' : '#e2e8f0';
  const tickLabel  = dark ? '#334155' : '#94a3b8';

  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${rulerBorder}`, flexShrink: 0 }}>
      <div style={{ width: LABEL_W, flexShrink: 0, background: rulerBg, borderRight: `1px solid ${rulerBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: tickLabel }}>ms</span>
      </div>
      <div style={{ flex: 1, height: RULER_H, position: 'relative', background: rulerBg, overflow: 'hidden' }}>
        <svg width="100%" height={RULER_H} style={{ display: 'block' }} viewBox={`0 0 ${width} ${RULER_H}`} preserveAspectRatio="none">
          {ticks.map(t => {
            const x = ((t - visStart) / range) * width;
            const major = t % (tickStepMs * 2) === 0;
            return (
              <g key={t}>
                <line x1={x} y1={major ? 8 : 14} x2={x} y2={RULER_H} stroke={major ? tickMajor : tickMinor} strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                {major && <text x={x + 3} y={14} fontFamily="JetBrains Mono, monospace" fontSize="8" fill={tickLabel}>{t}ms</text>}
              </g>
            );
          })}
          {cursorX >= 0 && (
            <>
              <line x1={cursorX} y1={0} x2={cursorX} y2={RULER_H} stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
              <polygon points={`${cursorX-5},0 ${cursorX+5},0 ${cursorX},8`} fill="#3b82f6"/>
              <text x={cursorX + 6} y={13} fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3b82f6" fontWeight="700">{Math.round(cursorMs)}ms</text>
            </>
          )}
          {markers.map(m => {
            const mx = ((m.t - visStart) / range) * width;
            return mx >= 0 && mx <= width ? (
              <g key={m.id}>
                <line x1={mx} y1={0} x2={mx} y2={RULER_H} stroke={m.color} strokeWidth="1" strokeDasharray="3,2" vectorEffect="non-scaling-stroke"/>
                <rect x={mx + 2} y={2} width={m.label.length * 5 + 4} height={11} rx="2" fill={`${m.color}33`}/>
                <text x={mx + 4} y={11} fontFamily="JetBrains Mono, monospace" fontSize="7" fill={m.color}>{m.label}</text>
              </g>
            ) : null;
          })}
        </svg>
      </div>
    </div>
  );
}

// ── Main Canvas ────────────────────────────────────────────────
function SignalCanvas({ selectedRule, playheadMs, running, dark }) {
  const [visStart, setVisStart] = useState(0);
  const [visEnd,   setVisEnd]   = useState(TOTAL_MS);
  const [cursorMs, setCursorMs] = useState(2125);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width - LABEL_W));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (running && playheadMs != null) setCursorMs(playheadMs);
  }, [playheadMs, running]);

  const waveW = Math.max(containerW, 400);

  function onMouseMove(e) {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - LABEL_W;
    const t = visStart + (relX / waveW) * (visEnd - visStart);
    setCursorMs(Math.max(visStart, Math.min(visEnd, t)));
  }

  function onWheelZoom(e) {
    e.preventDefault();
    const range = visEnd - visStart;
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const newRange = Math.max(500, Math.min(TOTAL_MS, range * factor));
    const mid = (visStart + visEnd) / 2;
    setVisStart(Math.max(0, mid - newRange / 2));
    setVisEnd(Math.min(TOTAL_MS, mid + newRange / 2));
  }

  const highlightedSigs = selectedRule?.signals || [];
  const markers = [
    { id: 'e1', t: 2100, color: '#f59e0b', label: 'TRIGGER' },
    { id: 'e2', t: 2125, color: '#22c55e', label: 'ASSERT' },
  ];

  const orderedSigs = [...SIGNAL_DEFS].sort((a, b) => {
    const aH = highlightedSigs.includes(a.id) ? 0 : 1;
    const bH = highlightedSigs.includes(b.id) ? 0 : 1;
    return aH - bH;
  });

  const canvasBg  = dark ? '#080d18' : '#fafbfc';
  const headerBg  = dark ? '#06090f' : '#f1f5f9';
  const border    = dark ? '#1e293b' : '#e2e8f0';
  const headerFg  = dark ? '#475569' : '#94a3b8';
  const zoomBtnFg = dark ? '#475569' : '#94a3b8';
  const windowFg  = dark ? '#334155' : '#94a3b8';
  const statusFg  = dark ? '#334155' : '#94a3b8';
  const valueFg   = dark ? '#64748b' : '#475569';
  const fileFg    = dark ? '#1e293b' : '#cbd5e1';

  return (
    <div ref={containerRef} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: canvasBg, overflow: 'hidden', minWidth: 0, transition: 'background .2s'
    }}>
      <div style={{ height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderBottom: `1px solid ${border}`, background: headerBg }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: headerFg, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Signal Timeline</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          {[
            { label: 'Fit', action: () => { setVisStart(0); setVisEnd(TOTAL_MS); } },
            { label: '2×',  action: () => { const m=(visStart+visEnd)/2, r=(visEnd-visStart)/2; setVisStart(Math.max(0,m-r/2)); setVisEnd(Math.min(TOTAL_MS,m+r/2)); } },
            { label: '½×',  action: () => { const m=(visStart+visEnd)/2, r=visEnd-visStart; setVisStart(Math.max(0,m-r)); setVisEnd(Math.min(TOTAL_MS,m+r)); } },
          ].map(b => (
            <button key={b.label} onClick={b.action} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: zoomBtnFg,
              background: 'none', border: `1px solid ${border}`, borderRadius: 3, padding: '2px 7px', cursor: 'pointer'
            }}>{b.label}</button>
          ))}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: windowFg, marginLeft: 4 }}>
            {Math.round(visEnd - visStart)}ms window
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)} onMouseMove={onMouseMove} onWheel={onWheelZoom}
          style={{ cursor: isDragging ? 'crosshair' : 'col-resize', userSelect: 'none' }}>
          <TimeRuler visStart={visStart} visEnd={visEnd} width={waveW} cursorMs={cursorMs} markers={markers} dark={dark} />
          {orderedSigs.map(sig => (
            <SignalLane key={sig.id} sig={sig} visStart={visStart} visEnd={visEnd}
              cursorMs={cursorMs} width={waveW} highlighted={highlightedSigs.includes(sig.id)} dark={dark} />
          ))}
        </div>
      </div>

      <div style={{ height: 22, flexShrink: 0, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: statusFg, background: headerBg }}>
        <span>Cursor: <span style={{ color: valueFg }}>{Math.round(cursorMs)}ms</span></span>
        <span>Window: <span style={{ color: valueFg }}>{Math.round(visStart)}–{Math.round(visEnd)}ms</span></span>
        <span>Scroll wheel to zoom · Drag to move cursor</span>
        <span style={{ marginLeft: 'auto', color: fileFg }}>CAN_HIL_Run_004.can</span>
      </div>
    </div>
  );
}

Object.assign(window, { SignalCanvas, SIGNAL_DEFS, getValueAt });
