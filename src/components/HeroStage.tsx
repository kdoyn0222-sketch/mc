import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Image as ImageIcon,
  Box,
  SlidersHorizontal,
  Scale,
  Check,
  X,
  Info,
  Gauge,
} from 'lucide-react';
import {
  ActiveTimePeriod,
  IngredientLayer,
  MenuItem,
  StoreLocation,
} from '../types/menu';
import { SIGNATURE_SEVEN_BURGERS } from '../data/menuData';
import { ALLERGEN_LABELS, CATEGORY_LABELS, PORTION_LABELS } from '../data/labels';
import { BurgerArtwork } from './BurgerArtwork';

export type HeroVisualMode = '2d' | 'spec' | '3d';

interface HeroStageProps {
  activeBurger: MenuItem;
  visualMode: HeroVisualMode;
  activeStore: StoreLocation;
  activePeriod: ActiveTimePeriod;
  easyReadMode: boolean;
  isCompared: boolean;
  onSelectBurger: (burger: MenuItem) => void;
  onChangeVisualMode: (mode: HeroVisualMode) => void;
  onOpenDetailModal: (burger: MenuItem) => void;
  onToggleCompare: (burger: MenuItem) => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({
  activeBurger,
  visualMode,
  activeStore,
  activePeriod,
  easyReadMode,
  isCompared,
  onSelectBurger,
  onChangeVisualMode,
  onOpenDetailModal,
  onToggleCompare,
}) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<IngredientLayer | null>(
    activeBurger.layers[1] || activeBurger.layers[0]
  );
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [layerToastVisible, setLayerToastVisible] = useState(false);

  const handleBurgerPick = (burger: MenuItem) => {
    onSelectBurger(burger);
    setSelectedLayer(burger.layers[1] || burger.layers[0]);
    setLayerToastVisible(false);
    setSelectorOpen(false);
  };

  const handleLayerSelect = (layer: IngredientLayer) => {
    setSelectedLayer(layer);
    setLayerToastVisible(true);
  };

  const isUnavailableAtStore = activeStore.unavailableItemIds.includes(activeBurger.id);
  const isMcLunchActive = activePeriod === 'mclunch' && !!activeBurger.priceMcLunch;
  const isMorningPeriod = activePeriod === 'mcmorning';

  return (
    <section
      id="signature-hero"
      className="bg-[#F8F6F2] border-b border-[#1E1E1E]/10 py-8 lg:py-12"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Collapsible 7-Burger Selector Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setSelectorOpen((prev) => !prev)}
            aria-expanded={selectorOpen}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#1E1E1E]/15 hover:border-[#DA291C] text-sm font-bold text-[#1E1E1E] shadow-xs transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2 keep-all text-left">
              <Layers className="w-4 h-4 text-[#DA291C] shrink-0" />
              <span>
                버거를 선택해 2D 일러스트와 3D 분해 뷰를 확인하세요
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#DA291C] whitespace-nowrap shrink-0">
              <span>{activeBurger.name}</span>
              {selectorOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {/* Unfolded 7-Burger Grid Selector */}
          {selectorOpen && (
            <div className="mt-3 p-4 rounded-2xl bg-white border border-[#1E1E1E]/12 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#1E1E1E]/65 keep-all">
                  맥도날드 코리아 공식 시그니처 7종 레시피 — 원하는 버거를 클릭하면 레이어 뷰가 전환됩니다
                </p>
                <button
                  type="button"
                  onClick={() => setSelectorOpen(false)}
                  className="p-1 rounded-md text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/5 cursor-pointer"
                  aria-label="버거 선택 창 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {SIGNATURE_SEVEN_BURGERS.map((burger) => {
                  const isCurrent = burger.id === activeBurger.id;
                  return (
                    <button
                      key={burger.id}
                      type="button"
                      onClick={() => handleBurgerPick(burger)}
                      className={`group p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#FFF9E6] border-[#FFBC0D] ring-2 ring-[#FFBC0D]/40'
                          : 'bg-[#F8F6F2] border-[#1E1E1E]/10 hover:border-[#DA291C] hover:bg-white'
                      }`}
                    >
                      <div className="h-20 flex items-center justify-center mb-2">
                        <BurgerArtwork
                          layers={burger.layers}
                          mode="thumbnail"
                          burgerName={burger.name}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E1E1E] leading-snug keep-all">
                          {burger.name}
                        </p>
                        <p className="text-[11px] font-mono-num text-[#1E1E1E]/60 mt-0.5">
                          {burger.nutrition.calories} kcal · {burger.priceSingle.toLocaleString()}원
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Active Signature Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1E1E1E]/65">
                <span className="text-[#DA291C] font-bold">시그니처 컬렉션</span>
                <span aria-hidden="true">·</span>
                <span>{CATEGORY_LABELS[activeBurger.category]}</span>
                <span aria-hidden="true">·</span>
                <span>{activeBurger.layers.length}개 정교한 레이어</span>
                <span aria-hidden="true">·</span>
                <span>{PORTION_LABELS[activeBurger.portionLevel]}</span>
              </div>

              <h1
                className="font-display font-extrabold text-[#1E1E1E] tracking-tight leading-[1.08] keep-all"
                style={{
                  fontSize: 'clamp(2.25rem, 3.8vw, 3.35rem)',
                  textWrap: 'balance',
                }}
              >
                {activeBurger.name}
              </h1>

              <p className="text-sm font-medium text-[#1E1E1E]/60 keep-all">
                {activeBurger.koreanSubtitle} · {activeBurger.originSummary}
              </p>

              {/* Store & Time-Period Status Callout */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                {isUnavailableAtStore ? (
                  <span className="text-[#DA291C]">
                    {activeStore.name} (특수 매장) 미판매 메뉴
                  </span>
                ) : isMorningPeriod ? (
                  <span className="text-[#8C5A00]">
                    오전 10시 30분부터 주문 가능 (현재 맥모닝 시간)
                  </span>
                ) : isMcLunchActive ? (
                  <span className="text-[#DA291C]">
                    {activeStore.name} 맥런치 할인 적용 중 ·{' '}
                    {(activeBurger.priceSet - (activeBurger.priceMcLunch || activeBurger.priceSet)).toLocaleString()}원 절약
                  </span>
                ) : (
                  <span className="text-[#1D6B3A]">
                    {activeStore.name} 즉시 주문 가능 · M오더 약 {activeStore.pickupMinutes}분 소요
                  </span>
                )}
              </div>

              <p
                className={`leading-relaxed text-[#1E1E1E]/85 keep-all ${
                  easyReadMode
                    ? 'easy-read-text bg-white p-4 rounded-xl border-2 border-[#1E1E1E]'
                    : 'text-base max-w-xl'
                }`}
              >
                {easyReadMode ? activeBurger.easyReadSummary : activeBurger.tagline}
              </p>
            </div>

            {/* Clean Tabular Nutrition & Price Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className={`p-3.5 rounded-xl bg-white border ${
                  easyReadMode ? 'easy-read-badge' : 'border-[#1E1E1E]/10'
                }`}
              >
                <span className="block text-[11px] font-semibold text-[#1E1E1E]/60">
                  열량
                </span>
                <span className="font-mono-num text-lg font-bold text-[#1E1E1E]">
                  {activeBurger.nutrition.calories}
                </span>
                <span className="text-xs text-[#1E1E1E]/60 ml-1">kcal</span>
              </div>

              <div
                className={`p-3.5 rounded-xl bg-white border ${
                  easyReadMode ? 'easy-read-badge' : 'border-[#1E1E1E]/10'
                }`}
              >
                <span className="block text-[11px] font-semibold text-[#1E1E1E]/60">
                  단백질
                </span>
                <span className="font-mono-num text-lg font-bold text-[#1E1E1E]">
                  {activeBurger.nutrition.protein}
                </span>
                <span className="text-xs text-[#1E1E1E]/60 ml-1">g</span>
              </div>

              <div
                className={`p-3.5 rounded-xl bg-white border ${
                  easyReadMode ? 'easy-read-badge' : 'border-[#1E1E1E]/10'
                }`}
              >
                <span className="block text-[11px] font-semibold text-[#1E1E1E]/60">
                  단품
                </span>
                <span className="font-mono-num text-lg font-bold text-[#1E1E1E]">
                  {activeBurger.priceSingle.toLocaleString()}원
                </span>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  isMcLunchActive
                    ? 'bg-[#FFF0EE] border-[#DA291C]'
                    : 'bg-white border-[#1E1E1E]/10'
                } ${easyReadMode ? 'easy-read-badge' : ''}`}
              >
                <span
                  className={`block text-[11px] font-semibold ${
                    isMcLunchActive ? 'text-[#DA291C]' : 'text-[#1E1E1E]/60'
                  }`}
                >
                  {isMcLunchActive ? '맥런치 세트' : '일반 세트'}
                </span>
                <span
                  className={`font-mono-num text-lg font-bold ${
                    isMcLunchActive ? 'text-[#DA291C]' : 'text-[#1E1E1E]'
                  }`}
                >
                  {(
                    (isMcLunchActive ? activeBurger.priceMcLunch : activeBurger.priceSet) ||
                    activeBurger.priceSet
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>

            {/* Hero Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenDetailModal(activeBurger)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#DA291C] hover:bg-[#B81F14] text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span className="keep-all">커스텀 및 주문하기</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleCompare(activeBurger)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCompared
                    ? 'bg-[#1E1E1E] text-[#FFBC0D] border-[#1E1E1E]'
                    : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/20 hover:border-[#1E1E1E]'
                }`}
              >
                {isCompared ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <Scale className="w-4 h-4 shrink-0" />
                )}
                <span className="keep-all">
                  {isCompared ? '비교함에 담김' : '+ 영양 비교 담기'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Lightweight 3-Mode Visual Stage */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative z-50 flex flex-wrap items-center justify-between gap-2 mb-3">
              <div
                className="inline-flex items-center p-1 rounded-xl bg-white border border-[#1E1E1E]/12 shadow-xs"
                role="tablist"
                aria-label="버거 비주얼 스테이지 모드"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={visualMode === '2d'}
                  onClick={() => onChangeVisualMode('2d')}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    visualMode === '2d'
                      ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                      : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>2D 일러스트</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={visualMode === 'spec'}
                  onClick={() => onChangeVisualMode('spec')}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    visualMode === 'spec'
                      ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                      : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>실물 사진 / 스펙 &amp; 포만감 게이지</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={visualMode === '3d'}
                  onClick={() => onChangeVisualMode('3d')}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    visualMode === '3d'
                      ? 'bg-[#DA291C] text-white'
                      : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 shrink-0" />
                  <span>3D 분해 뷰</span>
                </button>
              </div>

              <span className="text-xs font-medium text-[#1E1E1E]/55 keep-all">
                {visualMode === 'spec'
                  ? '원산지, 중량 및 포만감 지수'
                  : '각 재료를 클릭해 상세 레시피를 확인하세요'}
              </span>
            </div>

            {/* Stage Canvas */}
            <div className="relative rounded-2xl bg-white border border-[#1E1E1E]/10 p-5 sm:p-7 shadow-xs overflow-hidden">
              {visualMode === '2d' && (
                <div className="flex flex-col items-center justify-center min-h-[380px]">
                  <BurgerArtwork
                    layers={activeBurger.layers}
                    mode="2d"
                    selectedLayerId={selectedLayer?.id}
                    hoveredLayerId={hoveredLayerId}
                    onSelectLayer={handleLayerSelect}
                    onHoverLayer={setHoveredLayerId}
                    easyReadMode={easyReadMode}
                    burgerName={activeBurger.name}
                  />
                </div>
              )}

              {visualMode === '3d' && (
                <div className="w-full">
                  <BurgerArtwork
                    layers={activeBurger.layers}
                    mode="3d"
                    selectedLayerId={selectedLayer?.id}
                    hoveredLayerId={hoveredLayerId}
                    onSelectLayer={handleLayerSelect}
                    onHoverLayer={setHoveredLayerId}
                    easyReadMode={easyReadMode}
                    burgerName={activeBurger.name}
                  />
                </div>
              )}

              {visualMode === 'spec' && (
                <div className="space-y-5">
                  {/* Visual Portion & Satiety Meter */}
                  <div className="rounded-xl bg-[#FFFDF4] border border-[#FFBC0D] p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1E1E]">
                        <Gauge className="w-4 h-4 text-[#DA291C]" />
                        <span>중량 &amp; 포만감 게이지</span>
                      </span>
                      <span className="font-mono-num text-xs font-extrabold text-[#DA291C]">
                        {PORTION_LABELS[activeBurger.portionLevel]} · {activeBurger.nutrition.weightGrams}g (포만감 {activeBurger.satietyPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[#1E1E1E]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FFBC0D] to-[#DA291C] transition-all duration-300"
                        style={{ width: `${activeBurger.satietyPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-[#1E1E1E]/55">
                      <span>가벼운 한 끼 (&lt;170g)</span>
                      <span>표준 정식 (~225g)</span>
                      <span>묵직한 투핸드 (265g+)</span>
                    </div>
                  </div>

                  {activeBurger.realPhotoComparison ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="rounded-xl overflow-hidden border border-[#1E1E1E]/10 bg-[#F8F6F2]">
                        <img
                          src={activeBurger.realPhotoComparison}
                          alt={`${activeBurger.name} 실제 스튜디오 비교 사진`}
                          referrerPolicy="no-referrer"
                          className="w-full h-56 object-cover"
                        />
                        <div className="px-3 py-2 text-xs font-semibold text-[#1E1E1E]/75 bg-white border-t border-[#1E1E1E]/10">
                          스튜디오 실물 사진 · {activeBurger.name}
                        </div>
                      </div>
                      <div className="rounded-xl border border-[#1E1E1E]/10 bg-[#F8F6F2] p-4 flex flex-col items-center justify-center h-full">
                        <div className="h-44 flex items-center justify-center">
                          <BurgerArtwork
                            layers={activeBurger.layers}
                            mode="thumbnail"
                            burgerName={activeBurger.name}
                          />
                        </div>
                        <p className="text-xs font-semibold text-[#1E1E1E]/70 mt-2 text-center">
                          {activeBurger.layers.length}단 레이어 설계도 (총 중량 {activeBurger.nutrition.weightGrams}g)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#F8F6F2] rounded-xl p-4 border border-[#1E1E1E]/10">
                      <div className="flex justify-center">
                        <BurgerArtwork
                          layers={activeBurger.layers}
                          mode="thumbnail"
                          burgerName={activeBurger.name}
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#DA291C]">
                            공식 원재료 &amp; 중량 스펙 카드
                          </span>
                          <span className="font-mono-num text-xs font-bold text-[#1E1E1E]">
                            총 중량 {activeBurger.nutrition.weightGrams}g
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#1E1E1E] keep-all">
                          {activeBurger.originSummary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-xs text-[#1E1E1E]/65 font-semibold mr-1">
                            알레르기 유발 물질:
                          </span>
                          {activeBurger.allergens.map((allergen) => (
                            <span
                              key={allergen}
                              className="text-xs font-medium text-[#1E1E1E] px-2 py-0.5 rounded bg-white border border-[#1E1E1E]/12"
                            >
                              {ALLERGEN_LABELS[allergen]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Layer-by-Layer Origin & Weight Spec Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#1E1E1E]/15 text-[11px] font-bold text-[#1E1E1E]/60">
                          <th className="py-2 pr-3">#</th>
                          <th className="py-2 pr-3">재료 레이어</th>
                          <th className="py-2 pr-3">원산지 / 기준</th>
                          <th className="py-2 text-right">중량</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E1E]/8 text-xs">
                        {activeBurger.layers.map((layer, idx) => (
                          <tr key={layer.id} className="hover:bg-[#F8F6F2]/70">
                            <td className="py-2 pr-3 font-mono-num text-[#1E1E1E]/60">
                              {idx + 1}
                            </td>
                            <td className="py-2 pr-3 font-semibold text-[#1E1E1E] keep-all">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                                  style={{ backgroundColor: layer.color }}
                                />
                                {easyReadMode ? layer.easyReadLabel : layer.name}
                              </span>
                            </td>
                            <td className="py-2 pr-3 text-[#1E1E1E]/70 keep-all">
                              {layer.origin}
                            </td>
                            <td className="py-2 text-right font-mono-num font-semibold text-[#1E1E1E]">
                              {layer.weightGrams}g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Layer Inspection Toast Notification Below Stage */}
            {layerToastVisible && selectedLayer && visualMode !== 'spec' && (
              <div
                role="status"
                className="mt-3 rounded-xl bg-[#1E1E1E] text-white px-4 py-3 flex items-start justify-between gap-3 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-4 h-4 rounded-full mt-0.5 shrink-0 border border-white/30"
                    style={{ backgroundColor: selectedLayer.color }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#FFBC0D] keep-all">
                      {easyReadMode ? selectedLayer.easyReadLabel : selectedLayer.name}
                    </p>
                    <p className="text-xs text-white/85 mt-0.5 keep-all">
                      {selectedLayer.description} · 원산지: {selectedLayer.origin} ({selectedLayer.weightGrams}g)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLayerToastVisible(false)}
                  className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer shrink-0"
                  aria-label="재료 알림 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {!layerToastVisible && visualMode !== 'spec' && (
              <div className="mt-3 px-3 py-2 rounded-xl bg-white/70 border border-[#1E1E1E]/8 flex items-center gap-2 text-xs text-[#1E1E1E]/70">
                <Info className="w-3.5 h-3.5 text-[#DA291C] shrink-0" />
                <span className="keep-all">
                  팁: 버거의 각 층을 클릭하거나 마우스를 올리면 원산지, 중량, 레시피 상세 설명을 볼 수 있습니다.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
