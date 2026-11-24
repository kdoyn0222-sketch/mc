import React from 'react';
import { IngredientLayer, LayerVisualType } from '../types/menu';

interface BurgerArtworkProps {
  layers: IngredientLayer[];
  mode: 'thumbnail' | '2d' | '3d';
  selectedLayerId?: string | null;
  hoveredLayerId?: string | null;
  onSelectLayer?: (layer: IngredientLayer) => void;
  onHoverLayer?: (layerId: string | null) => void;
  easyReadMode?: boolean;
  burgerName: string;
}

const LAYER_HEIGHT_2D: Record<LayerVisualType, number> = {
  'sesame-bun-top': 44,
  'plain-bun-top': 42,
  'english-muffin-top': 34,
  'bun-middle': 22,
  'bun-bottom': 28,
  'english-muffin-bottom': 26,
  'beef-patty': 20,
  'thick-beef-patty': 28,
  'pork-bulgogi-patty': 22,
  'chicken-crispy-patty': 28,
  'shrimp-patty': 26,
  'egg-patty': 22,
  'sausage-patty': 22,
  'cheddar-cheese': 10,
  'bacon-protruding': 14,
  'bacon-strips': 12,
  'lettuce-shredded': 16,
  'lettuce-leaf': 16,
  'tomato-two': 14,
  'tomato-single': 13,
  pickles: 11,
  'onions-caramelized': 12,
  'onions-fresh': 11,
  'sauce-bigmac': 10,
  'sauce-1955': 10,
  'sauce-mayo': 10,
  'sauce-ketchup-mustard': 10,
  'sauce-chili-mayo': 10,
  'sauce-shrimp-onion': 10,
};

function renderLayerShape(
  type: LayerVisualType,
  y: number,
  h: number,
  isHighlighted: boolean,
  is3DPlate = false
) {
  const cx = 140;
  const strokeColor = isHighlighted ? '#FFBC0D' : 'rgba(30,30,30,0.16)';
  const strokeW = isHighlighted ? 2.6 : 1;

  switch (type) {
    case 'sesame-bun-top':
      return (
        <g>
          <path
            d={`M 36 ${y + h} C 36 ${y + 4}, 78 ${y}, ${cx} ${y} C 202 ${y}, 244 ${y + 4}, 244 ${y + h} Q ${cx} ${y + h + 4}, 36 ${y + h} Z`}
            fill="#E6A14A"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 48 ${y + h - 6} C 56 ${y + 10}, 92 ${y + 6}, ${cx} ${y + 6} C 188 ${y + 6}, 224 ${y + 10}, 232 ${y + h - 6}`}
            fill="none"
            stroke="#F4C77B"
            strokeWidth="4"
            opacity="0.55"
          />
          {/* Sesame Seeds */}
          {[
            [92, 13],
            [118, 9],
            [144, 11],
            [170, 10],
            [195, 16],
            [74, 22],
            [105, 20],
            [134, 19],
            [162, 21],
            [188, 25],
            [212, 26],
            [62, 30],
            [122, 30],
            [154, 31],
          ].map(([sx, sy], i) => (
            <ellipse
              key={i}
              cx={sx}
              cy={y + sy}
              rx="3.4"
              ry="1.9"
              transform={`rotate(${i % 2 === 0 ? -18 : 20} ${sx} ${y + sy})`}
              fill="#FFF4D6"
            />
          ))}
        </g>
      );

    case 'plain-bun-top':
      return (
        <g>
          <path
            d={`M 40 ${y + h} C 40 ${y + 4}, 82 ${y}, ${cx} ${y} C 198 ${y}, 240 ${y + 4}, 240 ${y + h} Q ${cx} ${y + h + 4}, 40 ${y + h} Z`}
            fill="#EEA850"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 58 ${y + 16} Q ${cx} ${y + 6}, 222 ${y + 16}`}
            fill="none"
            stroke="#FAD394"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      );

    case 'english-muffin-top':
      return (
        <g>
          <rect
            x="48"
            y={y}
            width="184"
            height={h}
            rx="14"
            fill="#E3B36D"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="54" y={y + 3} width="172" height={h * 0.4} rx="8" fill="#F2CA8A" opacity="0.65" />
          {[75, 102, 132, 164, 196].map((mx, i) => (
            <circle key={i} cx={mx} cy={y + 10 + (i % 2) * 5} r="1.5" fill="#C78A3B" />
          ))}
        </g>
      );

    case 'english-muffin-bottom':
      return (
        <g>
          <rect
            x="48"
            y={y}
            width="184"
            height={h}
            rx="10"
            fill="#D49E54"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="52" y={y + 2} width="176" height="5" rx="3" fill="#EAC17D" />
        </g>
      );

    case 'bun-middle':
      return (
        <g>
          <rect
            x="40"
            y={y}
            width="200"
            height={h}
            rx="9"
            fill="#E8B268"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <line x1="46" y1={y + 4} x2="234" y2={y + 4} stroke="#C98338" strokeWidth="2" opacity="0.55" />
          <line x1="46" y1={y + h - 4} x2="234" y2={y + h - 4} stroke="#C98338" strokeWidth="2" opacity="0.55" />
        </g>
      );

    case 'bun-bottom':
      return (
        <g>
          <path
            d={`M 38 ${y} L 242 ${y} L 236 ${y + h - 7} Q ${cx} ${y + h + 4}, 44 ${y + h - 7} Z`}
            fill="#D89242"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="40" y={y} width="200" height="5" rx="2" fill="#ECC07D" />
        </g>
      );

    case 'beef-patty':
      return (
        <g>
          <rect
            x="34"
            y={y}
            width="212"
            height={h}
            rx="10"
            fill="#693926"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="40" y={y + 3} width="200" height={h - 8} rx="7" fill="#7C4630" opacity="0.5" />
          {[62, 96, 134, 174, 208].map((ox, i) => (
            <circle key={i} cx={ox} cy={y + h / 2} r="2.2" fill="#F2DEC0" opacity="0.85" />
          ))}
        </g>
      );

    case 'thick-beef-patty':
      return (
        <g>
          <rect
            x="30"
            y={y}
            width="220"
            height={h}
            rx="12"
            fill="#592D1D"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 42 ${y + 6} Q 140 ${y + 2}, 238 ${y + 6}`}
            stroke="#884B34"
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          {[70, 110, 150, 195].map((gx, i) => (
            <line
              key={i}
              x1={gx}
              y1={y + 5}
              x2={gx + 10}
              y2={y + h - 5}
              stroke="#3C1B10"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.65"
            />
          ))}
        </g>
      );

    case 'pork-bulgogi-patty':
      return (
        <g>
          <rect
            x="35"
            y={y}
            width="210"
            height={h}
            rx="10"
            fill="#4B2514"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Glossy garlic-soy bulgogi glaze highlight */}
          <path
            d={`M 46 ${y + 5} C 85 ${y + 2}, 185 ${y + 2}, 232 ${y + 6}`}
            stroke="#9B5326"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path
            d={`M 62 ${y + h - 4} Q 95 ${y + h + 5}, 118 ${y + h - 4} M 162 ${y + h - 4} Q 186 ${y + h + 4}, 212 ${y + h - 4}`}
            fill="#3B1A0C"
          />
        </g>
      );

    case 'chicken-crispy-patty':
      return (
        <g>
          <path
            d={`M 32 ${y + 8} Q 40 ${y}, 60 ${y + 2} Q 90 ${y - 2}, 120 ${y + 2} Q 160 ${y - 3}, 198 ${y + 2} Q 230 ${y}, 248 ${y + 8} L 245 ${y + h - 6} Q 220 ${y + h + 2}, 180 ${y + h - 2} Q 140 ${y + h + 2}, 98 ${y + h - 2} Q 54 ${y + h + 2}, 34 ${y + h - 6} Z`}
            fill="#D97E26"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {[56, 86, 118, 152, 184, 214].map((cxp, i) => (
            <circle key={i} cx={cxp} cy={y + 10 + (i % 2) * 7} r="2.8" fill="#F3B562" opacity="0.85" />
          ))}
        </g>
      );

    case 'shrimp-patty':
      return (
        <g>
          <rect
            x="34"
            y={y}
            width="212"
            height={h}
            rx="11"
            fill="#E69235"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Panko crumbs & pink shrimp flecks */}
          {[55, 92, 128, 166, 205].map((sx, i) => (
            <ellipse
              key={i}
              cx={sx}
              cy={y + h / 2 + (i % 2 === 0 ? -2 : 2)}
              rx="6"
              ry="3.2"
              fill="#F79B7C"
              opacity="0.85"
            />
          ))}
          {[72, 110, 148, 186, 222].map((px, i) => (
            <circle key={i} cx={px} cy={y + 7} r="1.8" fill="#FFE0A3" />
          ))}
        </g>
      );

    case 'egg-patty':
      return (
        <g>
          <rect
            x="48"
            y={y}
            width="184"
            height={h}
            rx="10"
            fill="#FFF7DF"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <ellipse cx={cx} cy={y + h / 2} rx="42" ry={h / 2 - 3} fill="#FFCE3A" opacity="0.9" />
        </g>
      );

    case 'sausage-patty':
      return (
        <g>
          <rect
            x="44"
            y={y}
            width="192"
            height={h}
            rx="10"
            fill="#7B4631"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {[72, 112, 152, 192].map((hx, i) => (
            <circle key={i} cx={hx} cy={y + h / 2} r="1.8" fill="#4E2A1B" />
          ))}
        </g>
      );

    case 'cheddar-cheese':
      return (
        <g>
          <polygon
            points={`36,${y} 244,${y} 236,${y + h - 2} 194,${y + h + 7} 152,${y + h - 1} 102,${y + h + 6} 44,${y + h - 1}`}
            fill="#FFBC0D"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>
      );

    case 'bacon-protruding':
      return (
        <g>
          {/* Protruding left & right crispy grilled bacon strips signature to 1955 Burger */}
          <path
            d={`M 14 ${y + 3} Q 75 ${y - 3}, 145 ${y + 3} Q 210 ${y + 8}, 266 ${y + 2} L 264 ${y + h} Q 205 ${y + h + 4}, 140 ${y + h - 1} Q 70 ${y + h - 5}, 16 ${y + h} Z`}
            fill="#A83226"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 22 ${y + 6} Q 80 ${y + 2}, 144 ${y + 6} Q 204 ${y + 10}, 256 ${y + 5}`}
            fill="none"
            stroke="#F2B1A4"
            strokeWidth="2.5"
            opacity="0.78"
          />
          <path
            d={`M 18 ${y + 10} Q 88 ${y + 14}, 152 ${y + 9} Q 215 ${y + 5}, 262 ${y + 11}`}
            fill="none"
            stroke="#731C14"
            strokeWidth="2"
            opacity="0.65"
          />
        </g>
      );

    case 'bacon-strips':
      return (
        <g>
          <path
            d={`M 36 ${y + 2} Q 95 ${y - 2}, 145 ${y + 3} Q 195 ${y + 7}, 244 ${y + 2} L 242 ${y + h} Q 190 ${y + h + 2}, 140 ${y + h - 1} Q 85 ${y + h - 3}, 38 ${y + h} Z`}
            fill="#B53B2E"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 46 ${y + 6} Q 110 ${y + 3}, 234 ${y + 6}`}
            fill="none"
            stroke="#F0B6A8"
            strokeWidth="2.2"
            opacity="0.75"
          />
        </g>
      );

    case 'lettuce-shredded':
      return (
        <g>
          <path
            d={`M 32 ${y + 7} Q 50 ${y}, 68 ${y + 6} Q 86 ${y}, 104 ${y + 6} Q 124 ${y - 1}, 142 ${y + 6} Q 160 ${y}, 178 ${y + 6} Q 198 ${y - 1}, 216 ${y + 6} Q 234 ${y}, 248 ${y + 7} L 245 ${y + h - 2} Q 220 ${y + h + 4}, 190 ${y + h - 2} Q 156 ${y + h + 4}, 122 ${y + h - 2} Q 86 ${y + h + 4}, 54 ${y + h - 2} Z`}
            fill="#78BA3E"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 45 ${y + 8} Q 90 ${y + 4}, 135 ${y + 9} Q 185 ${y + 4}, 235 ${y + 8}`}
            fill="none"
            stroke="#A5DB6B"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      );

    case 'lettuce-leaf':
      return (
        <g>
          <path
            d={`M 28 ${y + 6} C 64 ${y - 2}, 100 ${y + 8}, 140 ${y + 2} C 180 ${y - 3}, 218 ${y + 7}, 252 ${y + 5} L 248 ${y + h} C 204 ${y + h + 5}, 168 ${y + h - 3}, 138 ${y + h + 2} C 96 ${y + h + 5}, 62 ${y + h - 2}, 32 ${y + h} Z`}
            fill="#6BAE36"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
        </g>
      );

    case 'tomato-two':
      return (
        <g>
          <rect
            x="40"
            y={y}
            width="95"
            height={h}
            rx="6"
            fill="#DA291C"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect
            x="145"
            y={y}
            width="95"
            height={h}
            rx="6"
            fill="#DA291C"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="48" y={y + 3} width="79" height="3" rx="1.5" fill="#F27266" opacity="0.7" />
          <rect x="153" y={y + 3} width="79" height="3" rx="1.5" fill="#F27266" opacity="0.7" />
        </g>
      );

    case 'tomato-single':
      return (
        <g>
          <rect
            x="46"
            y={y}
            width="188"
            height={h}
            rx="6"
            fill="#DA291C"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect x="56" y={y + 3} width="168" height="3" rx="1.5" fill="#F27266" opacity="0.7" />
        </g>
      );

    case 'pickles':
      return (
        <g>
          <rect
            x="52"
            y={y}
            width="74"
            height={h}
            rx="5"
            fill="#4F842F"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <rect
            x="154"
            y={y}
            width="74"
            height={h}
            rx="5"
            fill="#4F842F"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <line x1="60" y1={y + 4} x2="118" y2={y + 4} stroke="#88BC5E" strokeWidth="2" />
          <line x1="162" y1={y + 4} x2="220" y2={y + 4} stroke="#88BC5E" strokeWidth="2" />
        </g>
      );

    case 'onions-caramelized':
      return (
        <g>
          <path
            d={`M 44 ${y + 6} Q 75 ${y}, 105 ${y + 6} Q 140 ${y + 11}, 175 ${y + 5} Q 208 ${y}, 236 ${y + 6} L 234 ${y + h} Q 140 ${y + h + 3}, 46 ${y + h} Z`}
            fill="#B57B3A"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d={`M 60 ${y + 5} Q 100 ${y + 2}, 140 ${y + 7} Q 180 ${y + 10}, 220 ${y + 5}`}
            fill="none"
            stroke="#E5B77E"
            strokeWidth="2"
          />
        </g>
      );

    case 'onions-fresh':
      return (
        <g>
          <rect x="50" y={y + 2} width="52" height={h - 4} rx="4" fill="#F8F4EC" stroke="#D1C7B7" strokeWidth="1" />
          <rect x="112" y={y} width="56" height={h} rx="5" fill="#4F842F" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="178" y={y + 2} width="52" height={h - 4} rx="4" fill="#F8F4EC" stroke="#D1C7B7" strokeWidth="1" />
        </g>
      );

    case 'sauce-bigmac':
    case 'sauce-1955':
    case 'sauce-mayo':
    case 'sauce-ketchup-mustard':
    case 'sauce-chili-mayo':
    case 'sauce-shrimp-onion': {
      const fillMap: Record<string, string> = {
        'sauce-bigmac': '#F2B863',
        'sauce-1955': '#96341F',
        'sauce-mayo': '#FAF0D1',
        'sauce-ketchup-mustard': '#D9381E',
        'sauce-chili-mayo': '#EB6944',
        'sauce-shrimp-onion': '#F29D52',
      };
      const accentMap: Record<string, string> = {
        'sauce-bigmac': '#FFE0A3',
        'sauce-1955': '#C45339',
        'sauce-mayo': '#FFFFFF',
        'sauce-ketchup-mustard': '#FFBC0D',
        'sauce-chili-mayo': '#FFF1CF',
        'sauce-shrimp-onion': '#FAD0A2',
      };
      return (
        <g>
          <path
            d={`M 48 ${y + 2} Q 95 ${y + h + 3}, 140 ${y + 3} Q 185 ${y + h + 3}, 232 ${y + 2} L 228 ${y + h - 1} Q 185 ${y + h + 5}, 140 ${y + h - 1} Q 95 ${y + h + 5}, 52 ${y + h - 1} Z`}
            fill={fillMap[type]}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {!is3DPlate && (
            <path
              d={`M 62 ${y + 5} Q 100 ${y + 8}, 140 ${y + 5} Q 180 ${y + 8}, 218 ${y + 5}`}
              fill="none"
              stroke={accentMap[type]}
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      );
    }

    default:
      return null;
  }
}

export const BurgerArtwork: React.FC<BurgerArtworkProps> = ({
  layers,
  mode,
  selectedLayerId,
  hoveredLayerId,
  onSelectLayer,
  onHoverLayer,
  easyReadMode = false,
  burgerName,
}) => {
  if (mode === 'thumbnail' || mode === '2d') {
    const gap = mode === 'thumbnail' ? 2 : 3;
    let currentY = 18;
    const positionedLayers = layers.map((layer) => {
      const h = LAYER_HEIGHT_2D[layer.visualType] || 18;
      const y = currentY;
      currentY += h + gap;
      return { layer, y, h };
    });
    const totalHeight = currentY + 18;

    return (
      <svg
        viewBox={`0 0 280 ${totalHeight}`}
        className={
          mode === 'thumbnail'
            ? 'w-full h-36 object-contain select-none'
            : 'w-full max-w-[330px] max-h-[340px] mx-auto select-none drop-shadow-[0_12px_20px_rgba(30,30,30,0.12)]'
        }
        role="img"
        aria-label={`${burgerName} 2D 레이어 일러스트`}
      >
        {/* Ground shadow */}
        <ellipse cx="140" cy={totalHeight - 10} rx="92" ry="7" fill="rgba(30,30,30,0.10)" />

        {positionedLayers.map(({ layer, y, h }) => {
          const isHighlighted =
            mode === '2d' && (selectedLayerId === layer.id || hoveredLayerId === layer.id);
          return (
            <g
              key={layer.id}
              onClick={mode === '2d' ? () => onSelectLayer?.(layer) : undefined}
              onMouseEnter={mode === '2d' ? () => onHoverLayer?.(layer.id) : undefined}
              onMouseLeave={mode === '2d' ? () => onHoverLayer?.(null) : undefined}
              className={mode === '2d' ? 'cursor-pointer transition-transform duration-150' : undefined}
              style={{
                transform: isHighlighted ? 'translateY(-3px) scale(1.02)' : undefined,
                transformOrigin: '140px center',
              }}
            >
              {renderLayerShape(layer.visualType, y, h, isHighlighted)}
            </g>
          );
        })}
      </svg>
    );
  }

  // 3D Exploded View Mode:
  // Generous 54px vertical pitch per layer, 3D stack positioned cleanly in its dedicated left/center lane,
  // while the independent right-hand DOM container (z-40) displays numbered recipe badges, color dots,
  // ingredient short tags, and horizontal connector guide lines so zero text ever overlaps graphics.
  const pitch = 54;
  const stageHeight = layers.length * pitch + 24;

  return (
    <div
      className="relative w-full flex items-start justify-between gap-2 sm:gap-4"
      style={{ minHeight: `${stageHeight}px` }}
    >
      {/* Left/Center Dedicated Graphic Lane for 3D Burger Stack (shifted cleanly away from right label lane) */}
      <div
        className="relative w-[50%] sm:w-[48%] shrink-0 stage-3d-perspective"
        style={{ height: `${stageHeight}px` }}
        aria-label={`${burgerName} 3D 분해 버거 레이어`}
      >
        {layers.map((layer, index) => {
          const isHighlighted = selectedLayerId === layer.id || hoveredLayerId === layer.id;
          const topPx = index * pitch + 8;
          const h = Math.min(34, LAYER_HEIGHT_2D[layer.visualType] || 20);

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onSelectLayer?.(layer)}
              onMouseEnter={() => onHoverLayer?.(layer.id)}
              onMouseLeave={() => onHoverLayer?.(null)}
              aria-label={`${index + 1}번 레이어: ${layer.name}`}
              className="absolute left-0 right-0 flex items-center justify-center focus:outline-none group"
              style={{
                top: `${topPx}px`,
                height: '44px',
                zIndex: isHighlighted ? 35 : layers.length - index + 10,
              }}
            >
              <div
                className="layer-3d-plate w-full max-w-[225px] flex items-center justify-center"
                style={{
                  transform: isHighlighted
                    ? 'rotateX(36deg) rotateZ(-4deg) translateY(-5px) scale(1.07)'
                    : 'rotateX(48deg) rotateZ(-8deg)',
                  filter: isHighlighted
                    ? 'drop-shadow(0 12px 18px rgba(218, 41, 28, 0.25))'
                    : 'drop-shadow(0 7px 9px rgba(30, 30, 30, 0.14))',
                }}
              >
                <svg viewBox="0 0 280 54" className="w-full h-12 overflow-visible">
                  {renderLayerShape(layer.visualType, Math.max(4, (44 - h) / 2), h, isHighlighted, true)}
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Independent Right-Hand Recipe Labels DOM Container (z-40) — zero overlap */}
      <div
        className="relative z-40 w-[50%] sm:w-[52%] shrink-0"
        style={{ height: `${stageHeight}px` }}
      >
        {layers.map((layer, index) => {
          const isHighlighted = selectedLayerId === layer.id || hoveredLayerId === layer.id;
          const topPx = index * pitch + 8;

          return (
            <div
              key={layer.id}
              className="absolute left-0 right-0 flex items-center"
              style={{ top: `${topPx}px`, height: '44px' }}
            >
              {/* Horizontal Connector Guide Line */}
              <div
                className={`hidden sm:block h-[1.5px] w-5 md:w-8 shrink-0 transition-colors duration-150 ${
                  isHighlighted ? 'bg-[#DA291C]' : 'bg-[#1E1E1E]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => onSelectLayer?.(layer)}
                onMouseEnter={() => onHoverLayer?.(layer.id)}
                onMouseLeave={() => onHoverLayer?.(null)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                  isHighlighted
                    ? 'bg-[#FFFDF7] border-[#DA291C] shadow-sm -translate-x-0.5'
                    : 'bg-white/95 border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30'
                }`}
              >
                {/* Layer Number Badge */}
                <span
                  className={`w-5 h-5 rounded-md text-[11px] font-mono-num font-bold flex items-center justify-center shrink-0 ${
                    isHighlighted
                      ? 'bg-[#DA291C] text-white'
                      : 'bg-[#1E1E1E]/8 text-[#1E1E1E]'
                  }`}
                >
                  {index + 1}
                </span>

                {/* Color Dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                  style={{ backgroundColor: layer.color }}
                />

                {/* Ingredient Short Tag */}
                <span className="text-xs sm:text-[13px] font-semibold text-[#1E1E1E] truncate keep-all">
                  {easyReadMode ? layer.easyReadLabel : layer.shortTag}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
