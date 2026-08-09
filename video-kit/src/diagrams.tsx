import React from 'react';
import {interpolate} from 'remotion';

const ACCENT = '#4fc3f7';
const ACCENT2 = '#ffb74d';
const DIM = '#8899aa';

// S2·S5: 1602 LCD — 16x2 격자, 글자 스크롤
export const LcdDiagram: React.FC<{t: number; scroll?: boolean}> = ({t, scroll}) => {
  const text = 'ESP32 IoT Kit   ';
  const offset = scroll ? Math.floor(t * 2.5) % 16 : 0;
  const cols = 16;
  const cell = 44;
  const w = cols * cell + 60;
  return (
    <svg width={w} height={200} viewBox={`0 0 ${w} 200`}>
      <rect x={0} y={0} width={w} height={200} rx={16} fill="#0a3d1f" stroke="#1b5e20" strokeWidth={4} />
      <rect x={22} y={30} width={cols * cell + 16} height={140} rx={8} fill="#123f22" />
      {Array.from({length: cols}).map((_, i) => {
        const ch = scroll ? text[(i + offset) % text.length] : text[i] ?? ' ';
        const appear = interpolate(t, [0.2 + i * 0.08, 0.6 + i * 0.08], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <g key={i}>
            <rect x={30 + i * cell} y={40} width={cell - 6} height={56} rx={4} fill="#0e2f1a" />
            <rect x={30 + i * cell} y={104} width={cell - 6} height={56} rx={4} fill="#0e2f1a" />
            <text x={30 + i * cell + (cell - 6) / 2} y={80} textAnchor="middle" fontSize={34} fontFamily="monospace" fill="#7CFC9A" opacity={appear}>
              {ch}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// S3: 백라이트 → 액정 → 글자
export const BacklightDiagram: React.FC<{t: number}> = ({t}) => {
  const rays = 7;
  return (
    <svg width={900} height={260} viewBox="0 0 900 260">
      <rect x={20} y={40} width={90} height={180} rx={10} fill={ACCENT2} opacity={0.9} />
      <text x={65} y={140} textAnchor="middle" fontSize={26} fill="#3a2600" fontWeight={700} writingMode="tb">백라이트</text>
      {Array.from({length: rays}).map((_, i) => {
        const y = 60 + i * 24;
        const len = interpolate((t * 0.8 + i * 0.13) % 1, [0, 1], [0, 300]);
        const blocked = i % 2 === 0;
        return <line key={i} x1={120} y1={y} x2={120 + Math.min(len, blocked ? 260 : 300)} y2={y} stroke={ACCENT2} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
      })}
      <rect x={380} y={30} width={26} height={200} rx={6} fill={ACCENT} opacity={0.55} />
      <text x={393} y={255} textAnchor="middle" fontSize={22} fill={DIM}>액정</text>
      <g opacity={interpolate(t, [1.2, 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
        <rect x={520} y={40} width={340} height={180} rx={12} fill="#0a3d1f" stroke="#1b5e20" strokeWidth={3} />
        <text x={690} y={155} textAnchor="middle" fontSize={72} fontFamily="monospace" fill="#7CFC9A" fontWeight={700}>가</text>
      </g>
    </svg>
  );
};

// S4: 여러 가닥 vs I2C 2가닥
export const I2cDiagram: React.FC<{t: number}> = ({t}) => {
  const many = interpolate(t, [0, 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const two = interpolate(t, [1.5, 2.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={900} height={280} viewBox="0 0 900 280">
      <rect x={20} y={70} width={170} height={140} rx={12} fill="#263238" stroke={DIM} />
      <text x={105} y={145} textAnchor="middle" fontSize={28} fill="#eceff1" fontWeight={700}>ESP32</text>
      <g opacity={many * (1 - two * 0.8)}>
        {Array.from({length: 8}).map((_, i) => (
          <line key={i} x1={190} y1={85 + i * 15} x2={430} y2={85 + i * 15} stroke={DIM} strokeWidth={3} strokeDasharray="6 5" />
        ))}
        <text x={310} y={62} textAnchor="middle" fontSize={22} fill={DIM}>원래는 여러 가닥…</text>
      </g>
      <g opacity={two}>
        <line x1={190} y1={120} x2={640} y2={120} stroke={ACCENT} strokeWidth={8} strokeLinecap="round" />
        <line x1={190} y1={165} x2={640} y2={165} stroke={ACCENT2} strokeWidth={8} strokeLinecap="round" />
        <text x={415} y={108} textAnchor="middle" fontSize={24} fill={ACCENT} fontWeight={700}>SDA</text>
        <text x={415} y={198} textAnchor="middle" fontSize={24} fill={ACCENT2} fontWeight={700}>SCL</text>
      </g>
      <rect x={640} y={70} width={230} height={140} rx={12} fill="#0a3d1f" stroke="#1b5e20" strokeWidth={3} />
      <text x={755} y={132} textAnchor="middle" fontSize={26} fill="#7CFC9A" fontWeight={700}>1602 LCD</text>
      <text x={755} y={168} textAnchor="middle" fontSize={20} fill="#5fa878">I2C 변환기</text>
    </svg>
  );
};

// S6·S8: 서보 혼 회전
export const ServoDiagram: React.FC<{t: number; sweep?: boolean; steps?: boolean}> = ({t, sweep, steps}) => {
  let angle: number;
  if (steps) {
    const seq = [0, 90, 180];
    angle = seq[Math.floor(t / 1.6) % 3];
  } else if (sweep) {
    const phase = (t * 0.45) % 2;
    angle = phase < 1 ? phase * 180 : (2 - phase) * 180;
  } else {
    angle = interpolate(t, [0.3, 2.2], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  const rad = ((180 - angle) * Math.PI) / 180;
  const cx = 320, cy = 210, r = 150;
  const hx = cx + r * Math.cos(rad);
  const hy = cy - r * Math.sin(rad);
  return (
    <svg width={720} height={280} viewBox="0 0 720 280">
      <path d={`M ${cx - 170} ${cy} A 170 170 0 0 1 ${cx + 170} ${cy}`} fill="none" stroke="#37474f" strokeWidth={3} strokeDasharray="5 7" />
      <text x={cx - 195} y={cy + 8} fontSize={24} fill={DIM}>180°</text>
      <text x={cx + 178} y={cy + 8} fontSize={24} fill={DIM}>0°</text>
      <text x={cx - 16} y={cy - 178} fontSize={24} fill={DIM}>90°</text>
      <rect x={cx - 70} y={cy - 10} width={140} height={80} rx={10} fill="#1565c0" />
      <rect x={cx - 90} y={cy + 18} width={180} height={20} rx={6} fill="#0d47a1" />
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={ACCENT2} strokeWidth={14} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill="#eceff1" />
      <text x={560} y={140} fontSize={64} fill={ACCENT2} fontWeight={800} textAnchor="middle">{Math.round(angle)}°</text>
      <text x={560} y={185} fontSize={22} fill={DIM} textAnchor="middle">현재 각도</text>
    </svg>
  );
};

// S7: PWM 파형 — 펄스 폭 강조
export const PwmDiagram: React.FC<{t: number}> = ({t}) => {
  const w = interpolate(Math.sin(t * 1.1), [-1, 1], [0.5, 2.5]);
  const angle = Math.round(((w - 0.5) / 2) * 180);
  const periodPx = 260;
  const highPx = (w / 20) * periodPx * 6;
  const y0 = 150, y1 = 60;
  let d = `M 30 ${y0}`;
  for (let i = 0; i < 3; i++) {
    const x = 30 + i * periodPx;
    d += ` L ${x} ${y0} L ${x} ${y1} L ${x + highPx} ${y1} L ${x + highPx} ${y0} L ${x + periodPx} ${y0}`;
  }
  return (
    <svg width={900} height={300} viewBox="0 0 900 300">
      <path d={d} fill="none" stroke={ACCENT} strokeWidth={6} strokeLinejoin="round" />
      <line x1={30} y1={y1} x2={30 + highPx} y2={y1} stroke={ACCENT2} strokeWidth={10} strokeLinecap="round" />
      <text x={30 + highPx / 2} y={44} textAnchor="middle" fontSize={26} fill={ACCENT2} fontWeight={700}>
        펄스 폭 {w.toFixed(1)}ms
      </text>
      <line x1={30} y1={200} x2={290} y2={200} stroke={DIM} strokeWidth={2} />
      <text x={160} y={230} textAnchor="middle" fontSize={22} fill={DIM}>주기 20ms (50Hz)</text>
      <text x={640} y={225} fontSize={30} fill="#eceff1">→ 각도 <tspan fill={ACCENT2} fontWeight={800} fontSize={44}>{angle}°</tspan></text>
    </svg>
  );
};

// S9: 시험 포인트 카드
export const QuizDiagram: React.FC<{t: number}> = ({t}) => {
  const a = interpolate(t, [0.2, 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = interpolate(t, [5.5, 6.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={1100} height={300} viewBox="0 0 1100 300">
      <g opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
        <rect x={10} y={20} width={520} height={250} rx={16} fill="#132a3d" stroke={ACCENT} strokeWidth={2} />
        <text x={40} y={70} fontSize={28} fill={ACCENT} fontWeight={800}>Q1 · LCD</text>
        <text x={40} y={120} fontSize={26} fill="#eceff1">lcd.backlight() 를 지우면?</text>
        <text x={40} y={185} fontSize={24} fill={ACCENT2}>→ 백라이트가 안 켜져서</text>
        <text x={40} y={222} fontSize={24} fill={ACCENT2}>글자가 나와도 화면이 어둡다</text>
      </g>
      <g opacity={b} transform={`translate(0 ${(1 - b) * 30})`}>
        <rect x={570} y={20} width={520} height={250} rx={16} fill="#132a3d" stroke={ACCENT} strokeWidth={2} />
        <text x={600} y={70} fontSize={28} fill={ACCENT} fontWeight={800}>Q2 · 서보</text>
        <text x={600} y={120} fontSize={26} fill="#eceff1">180→0 for문을 지우면?</text>
        <text x={600} y={185} fontSize={24} fill={ACCENT2}>→ 되돌아오는 동작이 사라지고</text>
        <text x={600} y={222} fontSize={24} fill={ACCENT2}>180° 도달 후 다시 0°에서 시작</text>
      </g>
    </svg>
  );
};
