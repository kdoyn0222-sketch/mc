import React, { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  ShieldAlert,
  Scale,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';
import {
  ActiveTimePeriod,
  AllergenType,
  MenuCategory,
  MenuItem,
  SortOption,
  StoreLocation,
} from '../types/menu';
import {
  GENERATED_IMAGES,
  HAPPY_MEAL_TOY_WAVES,
  MENU_ITEMS,
} from '../data/menuData';
import { ALLERGEN_LABELS, CATEGORY_LABELS, PORTION_LABELS } from '../data/labels';
import { BurgerArtwork } from './BurgerArtwork';

interface MenuCatalogProps {
  activePeriod: ActiveTimePeriod;
  activeStore: StoreLocation;
  orderableOnly: boolean;
  easyReadMode: boolean;
  comparedIds: string[];
  onOpenDetailModal: (item: MenuItem) => void;
  onToggleCompare: (item: MenuItem) => void;
}

const CATEGORIES: MenuCategory[] = [
  'All',
  'Beef',
  'Chicken',
  'Seafood',
  'Bulgogi',
  'McMorning',
  'Happy Meal',
];

const ALLERGENS: AllergenType[] = [
  'Egg',
  'Milk',
  'Soy',
  'Wheat',
  'Beef',
  'Pork',
  'Chicken',
  'Shrimp',
  'Tomato',
];

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  activePeriod,
  activeStore,
  orderableOnly,
  easyReadMode,
  comparedIds,
  onOpenDetailModal,
  onToggleCompare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [allergenDrawerOpen, setAllergenDrawerOpen] = useState(false);
  const [excludedAllergens, setExcludedAllergens] = useState<AllergenType[]>([]);
  const [selectedToyWave, setSelectedToyWave] = useState<'Wave 1' | 'Wave 2'>('Wave 1');
  const [agePreview, setAgePreview] = useState<'3-5' | '6+'>('3-5');

  const toggleAllergen = (allergen: AllergenType) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const isItemOrderableNow = (item: MenuItem) => {
    if (activeStore.unavailableItemIds.includes(item.id)) return false;
    if (item.category === 'McMorning' && !activeStore.mcMorningAvailable) return false;
    return item.availablePeriods.includes(activePeriod);
  };

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (orderableOnly && !isItemOrderableNow(item)) return false;
      if (excludedAllergens.length > 0) {
        const hasExcluded = item.allergens.some((a) => excludedAllergens.includes(a));
        if (hasExcluded) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'protein':
          return b.nutrition.protein - a.nutrition.protein;
        case 'calories':
          return a.nutrition.calories - b.nutrition.calories;
        case 'price':
          return a.priceSingle - b.priceSingle;
        case 'popular':
        default:
          return a.popularityRank - b.popularityRank;
      }
    });
  }, [selectedCategory, orderableOnly, excludedAllergens, sortBy, activePeriod, activeStore]);

  const activeToyWaveObj =
    HAPPY_MEAL_TOY_WAVES.find((w) => w.wave === selectedToyWave) || HAPPY_MEAL_TOY_WAVES[0];

  const getStoreAvailabilityStatus = (item: MenuItem) => {
    if (activeStore.unavailableItemIds.includes(item.id)) {
      return {
        label: '특수 매장 미판매',
        tone: 'text-[#DA291C]',
        available: false,
      };
    }
    if (item.category === 'McMorning' && !activeStore.mcMorningAvailable) {
      return {
        label: '특수 매장 맥모닝 미판매',
        tone: 'text-[#DA291C]',
        available: false,
      };
    }
    if (!item.availablePeriods.includes(activePeriod)) {
      return {
        label:
          item.category === 'McMorning'
            ? '맥모닝 전용 (04:00–10:30)'
            : '오전 10시 30분 이후 판매',
        tone: 'text-[#8C5A00]',
        available: false,
      };
    }
    if (activePeriod === 'mclunch' && item.priceMcLunch && activeStore.mcLunchAvailable) {
      return {
        label: '맥런치 할인 적용 중',
        tone: 'text-[#DA291C]',
        available: true,
      };
    }
    return {
      label: `${activeStore.name.replace('맥도날드 ', '')} 주문 가능`,
      tone: 'text-[#1D6B3A]',
      available: true,
    };
  };

  return (
    <section
      id="menu-catalog"
      className="py-12 lg:py-16 bg-white border-b border-[#1E1E1E]/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs font-bold text-[#DA291C] mb-1.5 keep-all">
              인터랙티브 메뉴 카탈로그
            </p>
            <h2
              className="font-display font-extrabold text-[#1E1E1E] tracking-tight keep-all"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              시그니처 버거, 맥모닝 &amp; 해피밀 한눈에 보기
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8F6F2] border border-[#1E1E1E]/12">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#1E1E1E]/60 shrink-0" />
              <label htmlFor="catalog-sort" className="sr-only">
                메뉴 정렬 기준
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-[#1E1E1E] focus:outline-none cursor-pointer"
              >
                <option value="popular">정렬: 인기순</option>
                <option value="protein">정렬: 고단백순</option>
                <option value="calories">정렬: 저칼로리순</option>
                <option value="price">정렬: 낮은 가격순</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setAllergenDrawerOpen((prev) => !prev)}
              aria-expanded={allergenDrawerOpen}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                excludedAllergens.length > 0
                  ? 'bg-[#DA291C] text-white border-[#DA291C]'
                  : 'bg-[#F8F6F2] text-[#1E1E1E] border-[#1E1E1E]/15 hover:border-[#1E1E1E]/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="keep-all">
                알레르기 성분 제외
                {excludedAllergens.length > 0 ? ` (${excludedAllergens.length})` : ''}
              </span>
              {allergenDrawerOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 mb-5"
          role="tablist"
          aria-label="메뉴 카테고리"
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                    : 'bg-[#F8F6F2] text-[#1E1E1E]/75 hover:bg-[#1E1E1E]/8 hover:text-[#1E1E1E]'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>

        {allergenDrawerOpen && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F8F6F2] border border-[#1E1E1E]/12">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-xs font-bold text-[#1E1E1E] keep-all">
                제외할 알레르기 유발 성분을 선택하면 해당 메뉴가 목록에서 숨겨집니다:
              </p>
              {excludedAllergens.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExcludedAllergens([])}
                  className="text-xs font-bold text-[#DA291C] hover:underline cursor-pointer"
                >
                  전체 해제 ({excludedAllergens.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => {
                const active = excludedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#DA291C] text-white border-[#DA291C]'
                        : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/15 hover:border-[#DA291C]'
                    }`}
                  >
                    {active ? `제외: ${ALLERGEN_LABELS[allergen]}` : ALLERGEN_LABELS[allergen]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Happy Meal Toy Preview Tab / Showcase */}
        {selectedCategory === 'Happy Meal' && (
          <div className="mb-8 rounded-2xl border border-[#FFBC0D] bg-[#FFFDF4] p-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 rounded-xl overflow-hidden border border-[#1E1E1E]/10 bg-white">
                <img
                  src={GENERATED_IMAGES.happyMealToys}
                  alt="이달의 해피밀 토이 콜렉터 세트"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 object-cover"
                />
              </div>
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C5A00]">
                    <Sparkles className="w-4 h-4 text-[#DA291C]" />
                    <span>이달의 해피밀 토이 프리뷰</span>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#1E1E1E]">
                    {activeStore.name.replace('맥도날드 ', '')} 재고:{' '}
                    <span className="text-[#DA291C]">{activeStore.happyMealToyStock}개 남음</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex p-1 rounded-lg bg-[#1E1E1E]/8">
                    {(['Wave 1', 'Wave 2'] as const).map((wave) => (
                      <button
                        key={wave}
                        type="button"
                        onClick={() => {
                          setSelectedToyWave(wave);
                          setAgePreview(wave === 'Wave 1' ? '3-5' : '6+');
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedToyWave === wave
                            ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                            : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                        }`}
                      >
                        {wave === 'Wave 1' ? '1차 토이 (증정 중)' : '2차 토이 (출시 예정)'}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex p-1 rounded-lg bg-white border border-[#1E1E1E]/12">
                    <button
                      type="button"
                      onClick={() => setAgePreview('3-5')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        agePreview === '3-5'
                          ? 'bg-[#FFBC0D] text-[#1E1E1E]'
                          : 'text-[#1E1E1E]/70'
                      }`}
                    >
                      만 3~5세 프리뷰
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgePreview('6+')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        agePreview === '6+'
                          ? 'bg-[#FFBC0D] text-[#1E1E1E]'
                          : 'text-[#1E1E1E]/70'
                      }`}
                    >
                      만 6세 이상 프리뷰
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E1E1E] keep-all">
                    {activeToyWaveObj.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#1E1E1E]/60 mt-0.5">
                    {activeToyWaveObj.releaseWindow} ·{' '}
                    {agePreview === '3-5'
                      ? '둥근 안전 모서리 마감 & 작은 분리 부품 없음'
                      : '인터랙티브 조립 부품 & 컬렉터 전용 진열 스탠드 포함'}
                  </p>
                  <p className="text-sm text-[#1E1E1E]/85 mt-2 keep-all">
                    {easyReadMode
                      ? activeToyWaveObj.easyReadDescription
                      : activeToyWaveObj.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1E1E1E]/75">
                  <span className="text-[#1E1E1E]/55">포함 구성품:</span>
                  {activeToyWaveObj.characters.map((char, idx) => (
                    <React.Fragment key={char}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span>{char}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl bg-[#F8F6F2] border border-[#1E1E1E]/10 p-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-[#1E1E1E] keep-all">
              현재 선택하신 시간대와 알레르기 조건에 맞는 메뉴가 없습니다.
            </p>
            <p className="text-sm text-[#1E1E1E]/65 keep-all">
              알레르기 제외 필터를 초기화하거나 상단의 시간대 모드를 변경해 보세요.
            </p>
            {excludedAllergens.length > 0 && (
              <button
                type="button"
                onClick={() => setExcludedAllergens([])}
                className="px-4 py-2 rounded-lg bg-[#1E1E1E] text-white text-xs font-bold cursor-pointer"
              >
                알레르기 필터 초기화
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const status = getStoreAvailabilityStatus(item);
              const isCompared = comparedIds.includes(item.id);
              const isMcLunch = activePeriod === 'mclunch' && !!item.priceMcLunch && activeStore.mcLunchAvailable;

              return (
                <article
                  key={item.id}
                  className={`group rounded-2xl border bg-[#F8F6F2] p-5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
                    status.available
                      ? 'border-[#1E1E1E]/12'
                      : 'border-[#1E1E1E]/10 opacity-85'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-2">
                      <span className="text-[#1E1E1E]/60">
                        {CATEGORY_LABELS[item.category]} · {item.layers.length}단 구성
                      </span>
                      <span className={`${status.tone} text-right keep-all`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white border border-[#1E1E1E]/8 py-4 px-3 mb-4 flex items-center justify-center">
                      <BurgerArtwork
                        layers={item.layers}
                        mode="thumbnail"
                        burgerName={item.name}
                      />
                    </div>

                    <h3 className="font-display text-lg font-extrabold text-[#1E1E1E] keep-all">
                      {item.name}
                    </h3>
                    <p className="text-xs font-medium text-[#1E1E1E]/55 mt-0.5 keep-all">
                      {item.koreanSubtitle}
                    </p>
                    <p
                      className={`mt-2 text-sm text-[#1E1E1E]/80 line-clamp-2 keep-all ${
                        easyReadMode ? 'easy-read-text' : ''
                      }`}
                    >
                      {easyReadMode ? item.easyReadSummary : item.tagline}
                    </p>

                    {/* Visual Portion Indicator */}
                    <div className="mt-3 pt-2.5 border-t border-[#1E1E1E]/8 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-[#1E1E1E]/65">
                          {PORTION_LABELS[item.portionLevel]}
                        </span>
                        <span className="font-mono-num text-[#1E1E1E]/75">
                          {item.nutrition.weightGrams}g
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1E1E1E]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#FFBC0D]"
                          style={{ width: `${item.satietyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1E1E1E]/10 space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono-num text-base font-extrabold text-[#1E1E1E]">
                          {item.priceSingle.toLocaleString()}원
                        </span>
                        <span className="text-xs font-mono-num text-[#1E1E1E]/65">
                          세트 {item.priceSet.toLocaleString()}원
                        </span>
                        {item.priceMcLunch && (
                          <span
                            className={`text-xs font-mono-num font-bold ${
                              isMcLunch ? 'text-[#DA291C]' : 'text-[#1E1E1E]/55'
                            }`}
                          >
                            런치 {item.priceMcLunch.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-mono-num text-xs font-semibold ${
                          easyReadMode
                            ? 'px-2 py-0.5 rounded bg-white border border-[#1E1E1E] text-[#1E1E1E]'
                            : 'text-[#1E1E1E]/70'
                        }`}
                      >
                        {item.nutrition.calories} kcal · 단백질 {item.nutrition.protein}g
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDetailModal(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#DA291C] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span>상세 스펙 &amp; 커스터마이징</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleCompare(item)}
                        className={`inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isCompared
                            ? 'bg-[#FFBC0D] text-[#1E1E1E] border-[#1E1E1E]'
                            : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/18 hover:border-[#1E1E1E]'
                        }`}
                      >
                        {isCompared ? (
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Scale className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{isCompared ? '담김' : '+ 비교'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
