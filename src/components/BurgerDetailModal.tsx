import React, { useMemo, useState } from 'react';
import {
  X,
  Box,
  Minus,
  Check,
  Scale,
  ShoppingBag,
  Sparkles,
  BookOpen,
  Gauge,
  Utensils,
} from 'lucide-react';
import {
  ActiveTimePeriod,
  ComparisonEntry,
  MenuItem,
  StoreLocation,
} from '../types/menu';
import { HAPPY_SNACK_ITEMS } from '../data/menuData';
import { ALLERGEN_LABELS, CATEGORY_LABELS, PORTION_LABELS } from '../data/labels';
import { BurgerArtwork } from './BurgerArtwork';

interface BurgerDetailModalProps {
  item: MenuItem;
  activePeriod: ActiveTimePeriod;
  activeStore: StoreLocation;
  easyReadMode: boolean;
  onClose: () => void;
  onViewIn3D: (item: MenuItem) => void;
  onAddCustomizedToCompare: (entry: ComparisonEntry) => void;
}

const SET_SIDE_NUTRITION = {
  calories: 485,
  protein: 4,
  sodium: 230,
  saturatedFat: 2.5,
  sugar: 29,
};

export const BurgerDetailModal: React.FC<BurgerDetailModalProps> = ({
  item,
  activePeriod,
  activeStore,
  easyReadMode,
  onClose,
  onViewIn3D,
  onAddCustomizedToCompare,
}) => {
  const [removedLayerIds, setRemovedLayerIds] = useState<string[]>([]);
  const [mealType, setMealType] = useState<'single' | 'set' | 'mclunch'>(
    activePeriod === 'mclunch' && item.priceMcLunch ? 'mclunch' : 'single'
  );
  const [selectedPairingIds, setSelectedPairingIds] = useState<string[]>([]);
  const [selectedSnackIds, setSelectedSnackIds] = useState<string[]>([]);
  const [orderPlacedReceipt, setOrderPlacedReceipt] = useState<string | null>(null);
  const [compareAddedFeedback, setCompareAddedFeedback] = useState(false);

  const toggleRemoveLayer = (layerId: string) => {
    setRemovedLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const togglePairing = (pairingId: string) => {
    setSelectedPairingIds((prev) =>
      prev.includes(pairingId) ? prev.filter((id) => id !== pairingId) : [...prev, pairingId]
    );
  };

  const toggleSnack = (snackId: string) => {
    setSelectedSnackIds((prev) =>
      prev.includes(snackId) ? prev.filter((id) => id !== snackId) : [...prev, snackId]
    );
  };

  const liveMetrics = useMemo(() => {
    let calories = item.nutrition.calories;
    let protein = item.nutrition.protein;
    let sodium = item.nutrition.sodium;
    let saturatedFat = item.nutrition.saturatedFat;
    let sugar = item.nutrition.sugar;
    let price =
      mealType === 'mclunch' && item.priceMcLunch
        ? item.priceMcLunch
        : mealType === 'set'
        ? item.priceSet
        : item.priceSingle;

    item.layers.forEach((layer) => {
      if (removedLayerIds.includes(layer.id)) {
        calories += layer.deltaCalories;
        sodium += layer.deltaSodium;
        protein += layer.deltaProtein;
      }
    });

    if (mealType === 'set' || mealType === 'mclunch') {
      calories += SET_SIDE_NUTRITION.calories;
      protein += SET_SIDE_NUTRITION.protein;
      sodium += SET_SIDE_NUTRITION.sodium;
      saturatedFat += SET_SIDE_NUTRITION.saturatedFat;
      sugar += SET_SIDE_NUTRITION.sugar;
    }

    item.smartSidePairings.forEach((pair) => {
      if (selectedPairingIds.includes(pair.id)) {
        calories += pair.calories;
        protein += pair.protein;
        sodium += pair.sodium;
        price += pair.price;
      }
    });

    HAPPY_SNACK_ITEMS.forEach((snack) => {
      if (selectedSnackIds.includes(snack.id)) {
        calories += snack.calories;
        protein += snack.protein;
        sodium += snack.sodium;
        price += snack.price;
      }
    });

    return {
      calories: Math.max(0, calories),
      protein: Math.max(0, protein),
      sodium: Math.max(0, sodium),
      saturatedFat: Math.max(0, saturatedFat),
      sugar: Math.max(0, sugar),
      price,
    };
  }, [item, removedLayerIds, mealType, selectedPairingIds, selectedSnackIds]);

  const customizationsSummary = useMemo(() => {
    const parts: string[] = [];
    if (removedLayerIds.length > 0) {
      const names = item.layers
        .filter((l) => removedLayerIds.includes(l.id))
        .map((l) => `${l.shortTag} 제외`);
      parts.push(...names);
    }
    if (selectedPairingIds.length > 0) {
      const pairs = item.smartSidePairings
        .filter((p) => selectedPairingIds.includes(p.id))
        .map((p) => p.name);
      parts.push(...pairs);
    }
    if (selectedSnackIds.length > 0) {
      const snacks = HAPPY_SNACK_ITEMS.filter((s) => selectedSnackIds.includes(s.id)).map(
        (s) => s.name
      );
      parts.push(...snacks);
    }
    return parts.length > 0 ? parts.join(' · ') : '공식 기본 레시피';
  }, [item.layers, item.smartSidePairings, removedLayerIds, selectedPairingIds, selectedSnackIds]);

  const handleAddToCompare = () => {
    onAddCustomizedToCompare({
      uid: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      mealType,
      portionLevel: item.portionLevel,
      weightGrams: item.nutrition.weightGrams,
      calories: liveMetrics.calories,
      protein: liveMetrics.protein,
      sodium: liveMetrics.sodium,
      saturatedFat: liveMetrics.saturatedFat,
      sugar: liveMetrics.sugar,
      price: liveMetrics.price,
      customizationsSummary,
      category: item.category,
    });
    setCompareAddedFeedback(true);
    setTimeout(() => setCompareAddedFeedback(false), 1800);
  };

  const handleSimulateOrder = () => {
    const orderNumber = Math.floor(100 + Math.random() * 899);
    setOrderPlacedReceipt(
      `M오더 #${orderNumber} 접수 완료 · ${activeStore.name}에서 약 ${activeStore.pickupMinutes}분 후 픽업 가능`
    );
  };

  const isMcLunchAvailableNow = activePeriod === 'mclunch' && activeStore.mcLunchAvailable;
  const removableLayers = item.layers.filter((l) => l.removable);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-burger-title"
    >
      <div className="relative w-full max-w-4xl bg-[#F8F6F2] rounded-2xl border border-[#1E1E1E]/15 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Sticky Modal Header */}
        <div className="bg-white border-b border-[#1E1E1E]/10 px-5 sm:px-7 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-bold text-[#DA291C]">
              {CATEGORY_LABELS[item.category]} · 상세 스펙 &amp; 커스터마이징
            </p>
            <h2
              id="modal-burger-title"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#1E1E1E] keep-all"
            >
              {item.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewIn3D(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFBC0D] hover:bg-[#e5a800] text-[#1E1E1E] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Box className="w-4 h-4 shrink-0" />
              <span className="keep-all">3D 분해 뷰로 보기</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F8F6F2] hover:bg-[#1E1E1E]/10 text-[#1E1E1E] cursor-pointer"
              aria-label="버거 상세 모달 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Top Overview + Bite-Sized Origin Trivia Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white rounded-2xl border border-[#1E1E1E]/10 p-5">
            <div className="md:col-span-4 flex items-center justify-center bg-[#F8F6F2] rounded-xl p-4">
              <BurgerArtwork
                layers={item.layers.filter((l) => !removedLayerIds.includes(l.id))}
                mode="thumbnail"
                burgerName={item.name}
              />
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className={`text-sm text-[#1E1E1E]/85 keep-all ${easyReadMode ? 'easy-read-text' : ''}`}>
                {easyReadMode ? item.easyReadSummary : item.tagline}
              </p>

              {/* Bite-Sized Origin Trivia Card */}
              <div className="rounded-xl bg-[#FFFDF4] border border-[#FFBC0D] p-3 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-[#DA291C] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] font-extrabold text-[#8C5A00]">
                    한입 레시피 스토리
                  </span>
                  <p className="text-xs text-[#1E1E1E]/85 mt-0.5 leading-relaxed keep-all">
                    {item.triviaNote}
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold text-[#1E1E1E]/60 keep-all">
                원산지 정보: {item.originSummary}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-[#DA291C] mr-1">알레르기 유발 성분:</span>
                {item.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="px-2 py-0.5 rounded bg-[#F8F6F2] border border-[#1E1E1E]/12 font-semibold text-[#1E1E1E]"
                  >
                    {ALLERGEN_LABELS[allergen]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Portion & Satiety Meter + Live Nutrition Table */}
          <div className="bg-white rounded-2xl border border-[#1E1E1E]/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-[#1E1E1E] keep-all">
                포만감 게이지 &amp; 실시간 맞춤 영양성분
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA291C]">
                <Gauge className="w-4 h-4" />
                <span>
                  {PORTION_LABELS[item.portionLevel]} · 포만감 {item.satietyPercent}%
                </span>
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-[#1E1E1E]/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFBC0D] to-[#DA291C]"
                style={{ width: `${item.satietyPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: '열량', val: `${liveMetrics.calories}`, unit: 'kcal' },
                { label: '단백질', val: `${liveMetrics.protein}`, unit: 'g' },
                { label: '나트륨', val: `${liveMetrics.sodium}`, unit: 'mg' },
                { label: '포화지방', val: `${liveMetrics.saturatedFat}`, unit: 'g' },
                { label: '당류', val: `${liveMetrics.sugar}`, unit: 'g' },
                { label: '총 중량', val: `${item.nutrition.weightGrams}`, unit: 'g (버거)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl bg-[#F8F6F2] border border-[#1E1E1E]/8"
                >
                  <span className="block text-[11px] font-semibold text-[#1E1E1E]/60">
                    {stat.label}
                  </span>
                  <span className="font-mono-num text-base font-extrabold text-[#1E1E1E]">
                    {stat.val}
                  </span>
                  <span className="text-[11px] text-[#1E1E1E]/55 ml-1">{stat.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Recipe Ingredient Toggle (Removal Only) */}
          <div className="bg-white rounded-2xl border border-[#1E1E1E]/10 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-[#1E1E1E] keep-all">
                재료 빼기 (커스텀 레시피)
              </h3>
              <span className="text-xs font-medium text-[#1E1E1E]/55 keep-all">
                제외할 재료를 선택하면 순 열량과 나트륨이 자동 재계산됩니다 (추가 토핑 불가)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {removableLayers.map((layer) => {
                const isRemoved = removedLayerIds.includes(layer.id);
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => toggleRemoveLayer(layer.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isRemoved
                        ? 'bg-[#F8F6F2] border-[#1E1E1E]/10 opacity-65'
                        : 'bg-[#FFFDF6] border-[#FFBC0D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          isRemoved
                            ? 'border border-[#1E1E1E]/30 bg-white'
                            : 'bg-[#1E1E1E] text-[#FFBC0D]'
                        }`}
                      >
                        {!isRemoved ? <Check className="w-3.5 h-3.5" /> : <Minus className="w-3 h-3" />}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate keep-all ${
                          isRemoved ? 'line-through text-[#1E1E1E]/50' : 'text-[#1E1E1E]'
                        }`}
                      >
                        {easyReadMode ? layer.easyReadLabel : layer.name}
                      </span>
                    </div>
                    <span className="font-mono-num text-[11px] font-semibold text-[#1E1E1E]/60 shrink-0">
                      {layer.deltaCalories} kcal
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Side Pairing & Meal Deal Builder */}
          <div className="bg-white rounded-2xl border border-[#1E1E1E]/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-[#1E1E1E] keep-all">
                스마트 사이드 페어링 &amp; 세트 할인 빌더
              </h3>
              <span className="text-xs font-semibold text-[#1E1E1E]/60">
                {isMcLunchAvailableNow
                  ? '지금 맥런치 할인 시간입니다 (10:30–14:00)'
                  : '맥런치 할인은 10:30–14:00에 적용됩니다'}
              </span>
            </div>

            {/* Flavor-Matched Side Recommendations */}
            <div className="rounded-xl bg-[#FFF9E6] border border-[#FFBC0D] p-4 space-y-2.5">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C5A00]">
                <Utensils className="w-3.5 h-3.5 text-[#DA291C]" />
                <span>{item.name}와 잘 어울리는 추천 사이드 페어링</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.smartSidePairings.map((pair) => {
                  const active = selectedPairingIds.includes(pair.id);
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => togglePairing(pair.id)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                          : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/15 hover:border-[#DA291C]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold keep-all">
                          {easyReadMode ? pair.easyReadName : pair.name}
                        </span>
                        <span
                          className={`font-mono-num text-xs font-bold shrink-0 ${
                            active ? 'text-[#FFBC0D]' : 'text-[#DA291C]'
                          }`}
                        >
                          {pair.price === 0 ? '기본 포함' : `+${pair.price.toLocaleString()}원`}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-1 keep-all ${
                          active ? 'text-white/80' : 'text-[#1E1E1E]/65'
                        }`}
                      >
                        {pair.reason} · {pair.calories} kcal
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal Type Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMealType('single')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  mealType === 'single'
                    ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                    : 'bg-[#F8F6F2] text-[#1E1E1E] border-[#1E1E1E]/12'
                }`}
              >
                <p className="text-xs font-bold">버거 단품</p>
                <p className="font-mono-num text-base font-extrabold mt-0.5">
                  {item.priceSingle.toLocaleString()}원
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMealType('set')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  mealType === 'set'
                    ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                    : 'bg-[#F8F6F2] text-[#1E1E1E] border-[#1E1E1E]/12'
                }`}
              >
                <p className="text-xs font-bold">일반 세트 (+후렌치 후라이 M &amp; 음료)</p>
                <p className="font-mono-num text-base font-extrabold mt-0.5">
                  {item.priceSet.toLocaleString()}원
                </p>
              </button>

              {item.priceMcLunch && (
                <button
                  type="button"
                  onClick={() => setMealType('mclunch')}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    mealType === 'mclunch'
                      ? 'bg-[#DA291C] text-white border-[#DA291C]'
                      : 'bg-[#FFF0EE] text-[#1E1E1E] border-[#DA291C]/35'
                  }`}
                >
                  <p className="text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>맥런치 할인 세트</span>
                  </p>
                  <p className="font-mono-num text-base font-extrabold mt-0.5">
                    {item.priceMcLunch.toLocaleString()}원
                  </p>
                </button>
              )}
            </div>

            {/* Happy Snack Side Deals */}
            <div>
              <p className="text-xs font-bold text-[#1E1E1E]/75 mb-2">
                해피 스낵 사이드 추가 (선택 사항):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {HAPPY_SNACK_ITEMS.map((snack) => {
                  const active = selectedSnackIds.includes(snack.id);
                  return (
                    <button
                      key={snack.id}
                      type="button"
                      onClick={() => toggleSnack(snack.id)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#FFF9E6] border-[#FFBC0D] ring-1 ring-[#FFBC0D]'
                          : 'bg-[#F8F6F2] border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#1E1E1E] keep-all">
                        {easyReadMode ? snack.easyReadName : snack.name}
                      </p>
                      <p className="font-mono-num text-xs text-[#1E1E1E]/70 mt-1">
                        +{snack.price.toLocaleString()}원 · {snack.calories} kcal
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {orderPlacedReceipt && (
            <div className="rounded-xl bg-[#1D6B3A] text-white px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>{orderPlacedReceipt}</span>
              </div>
              <span className="font-mono-num text-xs font-bold">
                {liveMetrics.price.toLocaleString()}원
              </span>
            </div>
          )}
        </div>

        {/* Sticky Modal Footer */}
        <div className="bg-white border-t border-[#1E1E1E]/10 px-5 sm:px-7 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <p className="text-xs font-semibold text-[#1E1E1E]/60">
              실시간 예상 결제 금액 ({liveMetrics.calories} kcal)
            </p>
            <p className="font-mono-num text-xl font-extrabold text-[#1E1E1E]">
              {liveMetrics.price.toLocaleString()}원
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddToCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F8F6F2] hover:bg-[#1E1E1E]/10 border border-[#1E1E1E]/20 text-xs sm:text-sm font-bold text-[#1E1E1E] cursor-pointer whitespace-nowrap"
            >
              {compareAddedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-[#1D6B3A]" />
                  <span>비교함에 추가됨!</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>커스텀 구성 비교함에 담기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulateOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DA291C] hover:bg-[#B81F14] text-white text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>M오더 주문하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
