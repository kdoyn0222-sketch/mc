import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, SlidersHorizontal, RotateCw, Dices } from 'lucide-react';
import { MenuItem } from '../types/menu';
import { SIGNATURE_SEVEN_BURGERS } from '../data/menuData';
import { CATEGORY_LABELS, PORTION_LABELS } from '../data/labels';
import { BurgerArtwork } from './BurgerArtwork';

interface QuickFinderMatcherProps {
  easyReadMode: boolean;
  onViewIn3D: (burger: MenuItem) => void;
  onOpenDetailModal: (burger: MenuItem) => void;
}

type GachaPool = 'all' | 'beef' | 'non-beef';
type GachaPhase = 'idle' | 'turning' | 'dropping' | 'opening' | 'revealed';

interface CapsuleStyle {
  topColor: string;
  accentColor: string;
  label: string;
  pitch: string;
}

const CAPSULE_STYLES: Record<string, CapsuleStyle> = {
  'big-mac': {
    topColor: '#DA291C',
    accentColor: '#FFBC0D',
    label: '레드 클래식 캡슐',
    pitch: '고민될 땐 역시 실패 없는 3단 번의 정석! 오늘 한 끼는 빅맥으로 확정입니다.',
  },
  '1955-burger': {
    topColor: '#8F2D1D',
    accentColor: '#F3D2A2',
    label: '스모키 브라운 캡슐',
    pitch: '치즈 없이 깊은 훈제 바비큐와 구운 양파, 베이컨 2줄의 묵직한 한 방이 당기는 날!',
  },
  'double-bulgogi': {
    topColor: '#4E2A1A',
    accentColor: '#FFBC0D',
    label: '단짠 골드 캡슐',
    pitch: '부드러운 브리오슈 번 사이로 흐르는 마늘 간장 불고기 패티 2장의 확실한 만족감!',
  },
  'double-quarter-pounder': {
    topColor: '#1E1E1E',
    accentColor: '#FFBC0D',
    label: '블랙 헤비급 캡슐',
    pitch: '오늘만큼은 고기로 꽉 채우고 싶을 때! 226g 순쇠고기와 더블 치즈의 압도적 볼륨.',
  },
  'bacon-tomato-deluxe': {
    topColor: '#E34E2E',
    accentColor: '#76B843',
    label: '디럭스 칠리 캡슐',
    pitch: '베이컨, 토마토, 스위트 칠리·마요까지 다채로운 식감과 맛을 한 번에 즐겨보세요.',
  },
  'mcspicy-shanghai': {
    topColor: '#E87722',
    accentColor: '#FFF3D1',
    label: '스파이시 오렌지 캡슐',
    pitch: '바삭한 100% 통닭가슴살의 알싸한 매콤함으로 기분까지 깔끔하게 전환해 보세요!',
  },
  'supreme-shrimp': {
    topColor: '#F28B50',
    accentColor: '#FFF7E6',
    label: '탱글 코랄 캡슐',
    pitch: '부담 없는 432 kcal에 톡톡 터지는 통새우 식감! 가볍고 바삭한 오늘의 픽입니다.',
  },
};

const DOME_BALLS = [
  { id: 'big-mac', cx: 74, cy: 112, r: 22, color: '#DA291C', rot: -16, anim: 'a' },
  { id: 'double-quarter-pounder', cx: 120, cy: 116, r: 22, color: '#1E1E1E', rot: 12, anim: 'b' },
  { id: 'mcspicy-shanghai', cx: 166, cy: 112, r: 22, color: '#E87722', rot: -8, anim: 'a' },
  { id: 'double-bulgogi', cx: 94, cy: 76, r: 21, color: '#FFBC0D', rot: 22, anim: 'b' },
  { id: 'bacon-tomato-deluxe', cx: 144, cy: 78, r: 21, color: '#E34E2E', rot: -20, anim: 'a' },
  { id: 'supreme-shrimp', cx: 118, cy: 48, r: 20, color: '#F28B50', rot: 8, anim: 'b' },
  { id: '1955-burger', cx: 78, cy: 58, r: 19, color: '#8F2D1D', rot: -12, anim: 'a' },
];

export const QuickFinderMatcher: React.FC<QuickFinderMatcherProps> = ({
  easyReadMode,
  onViewIn3D,
  onOpenDetailModal,
}) => {
  const [pool, setPool] = useState<GachaPool>('all');
  const [phase, setPhase] = useState<GachaPhase>('idle');
  const [dialTurns, setDialTurns] = useState(0);
  const [drawnBurger, setDrawnBurger] = useState<MenuItem | null>(null);
  const [history, setHistory] = useState<MenuItem[]>([]);
  const timersRef = useRef<number[]>([]);

  const poolItems = useMemo(() => {
    if (pool === 'beef') {
      return SIGNATURE_SEVEN_BURGERS.filter((b) => b.category === 'Beef');
    }
    if (pool === 'non-beef') {
      return SIGNATURE_SEVEN_BURGERS.filter((b) => b.category !== 'Beef');
    }
    return SIGNATURE_SEVEN_BURGERS;
  }, [pool]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleSpin = () => {
    if (phase === 'turning' || phase === 'dropping' || phase === 'opening') return;

    clearTimers();

    // Pick a random burger from active pool, avoiding immediate repeat when possible
    const candidates =
      poolItems.length > 1 && drawnBurger
        ? poolItems.filter((item) => item.id !== drawnBurger.id)
        : poolItems;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    setDialTurns((prev) => prev + 1);
    setPhase('turning');

    const t1 = window.setTimeout(() => {
      setDrawnBurger(picked);
      setPhase('dropping');
    }, 480);

    const t2 = window.setTimeout(() => {
      setPhase('opening');
    }, 920);

    const t3 = window.setTimeout(() => {
      setPhase('revealed');
      setHistory((prev) => [picked, ...prev.filter((b) => b.id !== picked.id)].slice(0, 4));
    }, 1220);

    timersRef.current = [t1, t2, t3];
  };

  const isBusy = phase === 'turning' || phase === 'dropping' || phase === 'opening';
  const activeCapsule = drawnBurger
    ? CAPSULE_STYLES[drawnBurger.id] || {
        topColor: '#DA291C',
        accentColor: '#FFBC0D',
        label: '시그니처 캡슐',
        pitch: drawnBurger.tagline,
      }
    : null;

  return (
    <section
      id="quick-finder"
      className="py-10 lg:py-14 bg-[#FFFDF8] border-b border-[#1E1E1E]/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs font-bold text-[#DA291C] mb-1 keep-all">
              미니 캡슐 버거 뽑기
            </p>
            <h2
              className="font-display font-extrabold text-[#1E1E1E] tracking-tight keep-all"
              style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.15rem)', textWrap: 'balance' }}
            >
              오늘 뭐 먹지? 랜덤 버거 뽑기
            </h2>
          </div>

          {/* Pool Filter Segmented Control */}
          <div
            className="inline-flex items-center p-1 rounded-xl bg-[#1E1E1E]/6 border border-[#1E1E1E]/10 self-start sm:self-auto"
            role="group"
            aria-label="뽑기 대상 버거 범위"
          >
            {(
              [
                { id: 'all', label: '전체 7종' },
                { id: 'beef', label: '비프 4종' },
                { id: 'non-beef', label: '치킨·새우·불고기' },
              ] as { id: GachaPool; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isBusy}
                onClick={() => setPool(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                  pool === opt.id
                    ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                    : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Tactile Mini Capsule Gacha Machine */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#1E1E1E]/12 p-5 sm:p-6 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between text-xs font-semibold text-[#1E1E1E]/60 mb-2">
              <span>시그니처 캡슐 머신</span>
              <span className="font-mono-num">대상 {poolItems.length}종</span>
            </div>

            {/* Interactive SVG Mini Gacha Machine */}
            <div className="relative w-full max-w-[270px] mx-auto my-2 flex flex-col items-center">
              <svg
                viewBox="0 0 240 315"
                className="w-full h-auto select-none drop-shadow-[0_10px_22px_rgba(30,30,30,0.10)]"
                role="img"
                aria-label="맥도날드 미니 버거 캡슐 뽑기 기계"
              >
                <defs>
                  <linearGradient id="domeGlass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
                    <stop offset="45%" stopColor="#F8F6F2" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#E4DFD5" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id="machineRed" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C12115" />
                    <stop offset="30%" stopColor="#DA291C" />
                    <stop offset="85%" stopColor="#DA291C" />
                    <stop offset="100%" stopColor="#B31D12" />
                  </linearGradient>
                  <clipPath id="domeClip">
                    <rect x="42" y="28" width="156" height="122" rx="52" />
                  </clipPath>
                </defs>

                {/* Base shadow */}
                <ellipse cx="120" cy="304" rx="86" ry="7" fill="rgba(30,30,30,0.12)" />

                {/* Top Cap Knob & Lid */}
                <rect x="104" y="8" width="32" height="10" rx="5" fill="#FFBC0D" stroke="#1E1E1E" strokeWidth="2" />
                <path
                  d="M66 28 C66 18, 86 15, 120 15 C154 15, 174 18, 174 28 Z"
                  fill="url(#machineRed)"
                  stroke="#1E1E1E"
                  strokeWidth="2.2"
                />

                {/* Glass Dome Chamber Backdrop */}
                <rect
                  x="42"
                  y="28"
                  width="156"
                  height="122"
                  rx="52"
                  fill="#FFFBF2"
                  stroke="#1E1E1E"
                  strokeWidth="2.4"
                />

                {/* Capsules Inside Glass Dome */}
                <g clipPath="url(#domeClip)">
                  {DOME_BALLS.map((ball) => {
                    const inPool = poolItems.some((item) => item.id === ball.id);
                    const animClass =
                      phase === 'turning'
                        ? ball.anim === 'a'
                          ? 'animate-gacha-tumble-a'
                          : 'animate-gacha-tumble-b'
                        : '';
                    return (
                      <g
                        key={ball.id}
                        className={animClass}
                        style={{
                          transformOrigin: `${ball.cx}px ${ball.cy}px`,
                          opacity: inPool ? 1 : 0.28,
                          transition: 'opacity 180ms ease',
                        }}
                      >
                        {/* Bottom cream half */}
                        <circle
                          cx={ball.cx}
                          cy={ball.cy}
                          r={ball.r}
                          fill="#FFF6E5"
                          stroke="#1E1E1E"
                          strokeWidth="1.8"
                        />
                        {/* Top colored half */}
                        <path
                          d={`M ${ball.cx - ball.r} ${ball.cy} A ${ball.r} ${ball.r} 0 0 1 ${ball.cx + ball.r} ${ball.cy} Z`}
                          fill={ball.color}
                          stroke="#1E1E1E"
                          strokeWidth="1.6"
                          transform={`rotate(${ball.rot} ${ball.cx} ${ball.cy})`}
                        />
                        {/* Center seam */}
                        <line
                          x1={ball.cx - ball.r + 1}
                          y1={ball.cy}
                          x2={ball.cx + ball.r - 1}
                          y2={ball.cy}
                          stroke="#1E1E1E"
                          strokeWidth="1.4"
                          transform={`rotate(${ball.rot} ${ball.cx} ${ball.cy})`}
                        />
                        {/* Crisp specular dot */}
                        <ellipse
                          cx={ball.cx - ball.r * 0.35}
                          cy={ball.cy - ball.r * 0.4}
                          rx="4"
                          ry="2.2"
                          fill="#FFFFFF"
                          opacity="0.7"
                        />
                      </g>
                    );
                  })}
                  {/* Glass overlay & vertical shine */}
                  <rect x="42" y="28" width="156" height="122" rx="52" fill="url(#domeGlass)" />
                  <path
                    d="M62 46 C54 64, 54 96, 62 126"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </g>

                {/* Collar Band */}
                <rect
                  x="48"
                  y="144"
                  width="144"
                  height="14"
                  rx="6"
                  fill="#FFBC0D"
                  stroke="#1E1E1E"
                  strokeWidth="2.2"
                />

                {/* Main Red Body */}
                <path
                  d="M48 158 L192 158 L200 286 C200 294, 193 298, 185 298 L55 298 C47 298, 40 294, 40 286 Z"
                  fill="url(#machineRed)"
                  stroke="#1E1E1E"
                  strokeWidth="2.4"
                />

                {/* Mini Golden Arches Mark on Body */}
                <path
                  d="M107 183 C107 173, 110 166, 113.5 166 C116.5 166, 118.5 172, 120 178 C121.5 172, 123.5 166, 126.5 166 C130 166, 133 173, 133 183 L129.2 183 C129.2 175, 127.6 170, 126 170 C124.5 170, 122.5 175, 122 181.5 L118 181.5 C117.5 175, 115.5 170, 114 170 C112.4 170, 110.8 175, 110.8 183 Z"
                  fill="#FFBC0D"
                />

                {/* Dial Plate + Interactive Crank Handle */}
                <g
                  onClick={handleSpin}
                  className={isBusy ? 'cursor-wait' : 'cursor-pointer'}
                  role="button"
                  tabIndex={0}
                  aria-label="뽑기 기계 레버 돌리기"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSpin();
                    }
                  }}
                >
                  <circle
                    cx="120"
                    cy="214"
                    r="26"
                    fill="#F8F6F2"
                    stroke="#1E1E1E"
                    strokeWidth="2.4"
                  />
                  <circle
                    cx="120"
                    cy="214"
                    r="20"
                    fill="#FFFFFF"
                    stroke="#D6CFC4"
                    strokeWidth="1.5"
                  />
                  {/* Rotating Turn Bar */}
                  <g
                    style={{
                      transformOrigin: '120px 214px',
                      transform: `rotate(${dialTurns * 360}deg)`,
                      transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <rect
                      x="101"
                      y="208"
                      width="38"
                      height="12"
                      rx="6"
                      fill="#FFBC0D"
                      stroke="#1E1E1E"
                      strokeWidth="2"
                    />
                    <circle cx="120" cy="214" r="3.5" fill="#1E1E1E" />
                  </g>
                </g>

                {/* Bottom Dispenser Chute Frame */}
                <rect
                  x="86"
                  y="250"
                  width="68"
                  height="40"
                  rx="11"
                  fill="#1E1E1E"
                  stroke="#1E1E1E"
                  strokeWidth="2"
                />
                <rect
                  x="92"
                  y="255"
                  width="56"
                  height="30"
                  rx="8"
                  fill="#2C2C2C"
                />
                {/* Chute Flap Accent */}
                <rect
                  x="95"
                  y="257"
                  width="50"
                  height="6"
                  rx="3"
                  fill="#444444"
                />

                {/* Dispensed Round Capsule Ball inside Chute */}
                {activeCapsule && (phase === 'dropping' || phase === 'opening' || phase === 'revealed') && (
                  <g
                    key={`capsule-${dialTurns}`}
                    className={phase === 'dropping' ? 'animate-gacha-drop' : ''}
                    style={{ transformOrigin: '120px 272px' }}
                  >
                    {phase === 'opening' || phase === 'revealed' ? (
                      <>
                        {/* Split Bottom Half */}
                        <g className="animate-gacha-crack-bottom" style={{ transformOrigin: '120px 274px' }}>
                          <path
                            d="M 104 274 A 16 16 0 0 0 136 274 Z"
                            fill="#FFF6E5"
                            stroke="#1E1E1E"
                            strokeWidth="1.8"
                          />
                        </g>
                        {/* Split Top Colored Half */}
                        <g className="animate-gacha-crack-top" style={{ transformOrigin: '120px 272px' }}>
                          <path
                            d="M 104 272 A 16 16 0 0 1 136 272 Z"
                            fill={activeCapsule.topColor}
                            stroke="#1E1E1E"
                            strokeWidth="1.8"
                          />
                        </g>
                        {/* Golden core gleam */}
                        <circle cx="120" cy="272" r="5" fill="#FFBC0D" />
                      </>
                    ) : (
                      <>
                        <circle
                          cx="120"
                          cy="272"
                          r="15"
                          fill="#FFF6E5"
                          stroke="#1E1E1E"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M 105 272 A 15 15 0 0 1 135 272 Z"
                          fill={activeCapsule.topColor}
                          stroke="#1E1E1E"
                          strokeWidth="1.6"
                        />
                        <line x1="105" y1="272" x2="135" y2="272" stroke="#1E1E1E" strokeWidth="1.5" />
                        <ellipse cx="114" cy="265" rx="3.2" ry="1.8" fill="#FFFFFF" opacity="0.75" />
                      </>
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* Main Primary Spin CTA */}
            <div className="w-full space-y-2.5 mt-2">
              <button
                type="button"
                onClick={handleSpin}
                disabled={isBusy}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#DA291C] hover:bg-[#B81F14] disabled:bg-[#1E1E1E] text-white text-sm font-extrabold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                <RotateCw className={`w-4 h-4 shrink-0 ${isBusy ? 'animate-spin' : ''}`} />
                <span>
                  {phase === 'turning'
                    ? '레버를 돌리는 중...'
                    : phase === 'dropping'
                    ? '캡슐이 굴러 나오는 중...'
                    : phase === 'opening'
                    ? '캡슐을 여는 중...'
                    : drawnBurger
                    ? '한 번 더 뽑기'
                    : '레버 돌려 버거 뽑기'}
                </span>
              </button>
              <p className="text-[11px] text-center text-[#1E1E1E]/55 keep-all">
                기계 가운데 노란 레버를 직접 눌러도 캡슐이 나옵니다
              </p>
            </div>
          </div>

          {/* Right: Capsule Reveal Stage */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-[#1E1E1E]/12 p-5 sm:p-7 flex flex-col justify-between">
            {phase === 'idle' && !drawnBurger && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 space-y-5">
                <div className="w-20 h-20 rounded-full border-2 border-[#1E1E1E] overflow-hidden shadow-xs relative">
                  <div className="h-1/2 bg-[#DA291C] border-b-2 border-[#1E1E1E]" />
                  <div className="h-1/2 bg-[#FFF6E5]" />
                  <div className="w-4 h-4 rounded-full bg-[#FFBC0D] border-2 border-[#1E1E1E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="space-y-2 max-w-md">
                  <p className="text-xs font-bold text-[#DA291C]">
                    캡슐 대기 중 · {poolItems.length}종 랜덤 추첨
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#1E1E1E] keep-all">
                    왼쪽 미니 뽑기 기계의 레버를 돌려보세요
                  </h3>
                  <p
                    className={`text-sm text-[#1E1E1E]/70 keep-all ${
                      easyReadMode ? 'easy-read-text' : ''
                    }`}
                  >
                    {easyReadMode
                      ? '버튼을 누르면 뽑기 기계에서 동그란 캡슐 하나가 나오고, 오늘 먹을 버거를 랜덤으로 추천해 드려요.'
                      : '레버를 돌리면 동그란 캡슐 하나가 배출구로 톡 떨어지며 오늘의 시그니처 버거를 랜덤으로 추천해 드립니다.'}
                  </p>
                </div>

                {/* Compact preview line of pool items */}
                <div className="pt-4 border-t border-[#1E1E1E]/8 w-full max-w-lg">
                  <p className="text-[11px] font-semibold text-[#1E1E1E]/55 mb-2">
                    현재 기계에 들어있는 버거 캡슐
                  </p>
                  <p className="text-xs font-semibold text-[#1E1E1E]/80 leading-relaxed keep-all">
                    {poolItems.map((b) => b.name).join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {isBusy && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 space-y-5">
                <div
                  className={`w-24 h-24 rounded-full border-2 border-[#1E1E1E] overflow-hidden relative shadow-sm ${
                    phase === 'dropping' ? 'animate-gacha-drop' : 'animate-gacha-tumble-a'
                  }`}
                >
                  <div
                    className="h-1/2 border-b-2 border-[#1E1E1E] transition-colors duration-200"
                    style={{ backgroundColor: activeCapsule?.topColor || '#DA291C' }}
                  />
                  <div className="h-1/2 bg-[#FFF6E5]" />
                  <div className="w-5 h-5 rounded-full bg-[#FFBC0D] border-2 border-[#1E1E1E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#DA291C]">
                    {phase === 'turning'
                      ? '찰칵! 레버 회전 중'
                      : phase === 'dropping'
                      ? '데구르르! 동그란 캡슐이 나왔습니다'
                      : '톡! 캡슐이 열리고 있습니다'}
                  </p>
                  <h3 className="font-display text-xl font-extrabold text-[#1E1E1E] keep-all">
                    {phase === 'turning'
                      ? '7가지 시그니처 캡슐을 섞고 있어요...'
                      : phase === 'dropping'
                      ? `${activeCapsule?.label || '랜덤 캡슐'} 당첨!`
                      : '오늘의 추천 버거를 공개합니다'}
                  </h3>
                </div>
              </div>
            )}

            {phase === 'revealed' && drawnBurger && activeCapsule && (
              <div key={`${drawnBurger.id}-${dialTurns}`} className="flex-1 flex flex-col justify-between animate-gacha-reveal space-y-5">
                {/* Top Metadata Line (Zero-pill discipline) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E1E1E]/10">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#1E1E1E]/40 shrink-0"
                      style={{
                        background: `linear-gradient(180deg, ${activeCapsule.topColor} 50%, #FFF6E5 50%)`,
                      }}
                    />
                    <span className="text-[#DA291C]">{activeCapsule.label} 당첨</span>
                    <span aria-hidden="true" className="text-[#1E1E1E]/35">·</span>
                    <span className="text-[#1E1E1E]/65">
                      {CATEGORY_LABELS[drawnBurger.category]}
                    </span>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#1E1E1E]">
                    {drawnBurger.nutrition.calories} kcal · 단품 {drawnBurger.priceSingle.toLocaleString()}원
                  </span>
                </div>

                {/* Burger Visual + Editorial Pitch */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-5 rounded-xl bg-[#F8F6F2] border border-[#1E1E1E]/8 p-4 flex flex-col items-center justify-center">
                    <BurgerArtwork
                      layers={drawnBurger.layers}
                      mode="thumbnail"
                      burgerName={drawnBurger.name}
                    />
                    <span className="mt-2 font-mono-num text-[11px] font-semibold text-[#1E1E1E]/60">
                      {drawnBurger.layers.length}단 레시피 · {drawnBurger.nutrition.weightGrams}g
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] tracking-tight keep-all">
                        {drawnBurger.name}
                      </h3>
                      <p className="text-xs font-medium text-[#1E1E1E]/55 mt-0.5">
                        {drawnBurger.koreanSubtitle} · 단백질 {drawnBurger.nutrition.protein}g
                      </p>
                    </div>

                    <p
                      className={`text-sm text-[#1E1E1E]/85 leading-relaxed keep-all ${
                        easyReadMode ? 'easy-read-text' : ''
                      }`}
                    >
                      {easyReadMode ? drawnBurger.easyReadSummary : activeCapsule.pitch}
                    </p>

                    {/* Satiety Meter */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#1E1E1E]/65">
                          분량: {PORTION_LABELS[drawnBurger.portionLevel]}
                        </span>
                        <span className="font-mono-num text-[#1E1E1E]">
                          포만감 {drawnBurger.satietyPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#1E1E1E]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FFBC0D] to-[#DA291C]"
                          style={{ width: `${drawnBurger.satietyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-[#1E1E1E]/10 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onViewIn3D(drawnBurger)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#DA291C] text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Box className="w-4 h-4 shrink-0" />
                    <span>3D 분해 뷰로 보기</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDetailModal(drawnBurger)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFBC0D] hover:bg-[#e5a800] text-[#1E1E1E] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 shrink-0" />
                    <span>상세 스펙 &amp; 주문</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSpin}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#1E1E1E]/10 border border-[#1E1E1E]/15 text-[#1E1E1E] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Dices className="w-4 h-4 shrink-0 text-[#DA291C]" />
                    <span>다시 뽑기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Recent Drawn Capsule History Footer */}
            {history.length > 0 && (
              <div className="mt-5 pt-3 border-t border-[#1E1E1E]/8 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#1E1E1E]/55 whitespace-nowrap">
                  최근 뽑은 캡슐:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {history.map((item) => {
                    const cap = CAPSULE_STYLES[item.id];
                    const isCurrent = drawnBurger?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          setDrawnBurger(item);
                          setPhase('revealed');
                        }}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isCurrent
                            ? 'bg-[#FFF5D6] text-[#1E1E1E]'
                            : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:bg-[#F8F6F2]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/25 shrink-0"
                          style={{ backgroundColor: cap?.topColor || '#DA291C' }}
                        />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
