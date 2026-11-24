import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveTimePeriod,
  ComparisonEntry,
  MenuItem,
  StoreLocation,
  TimeZoneMode,
} from './types/menu';
import { SIGNATURE_SEVEN_BURGERS } from './data/menuData';
import { STORE_LOCATIONS } from './data/storeData';
import { Header, GoldenArchesLogo } from './components/Header';
import { SmartToolbar } from './components/SmartToolbar';
import { HeroStage, HeroVisualMode } from './components/HeroStage';
import { QuickFinderMatcher } from './components/QuickFinderMatcher';
import { MenuCatalog } from './components/MenuCatalog';
import { BurgerDetailModal } from './components/BurgerDetailModal';
import { CompareDrawer } from './components/CompareDrawer';
import { BestBurgerAndDelivery } from './components/BestBurgerAndDelivery';
import { StoreLocatorModal } from './components/StoreLocatorModal';

function detectLocalPeriod(now: Date): ActiveTimePeriod {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= 240 && minutes < 630) return 'mcmorning';
  if (minutes >= 630 && minutes < 840) return 'mclunch';
  return 'regular';
}

function formatClock(now: Date): string {
  return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function App() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [timeZoneMode, setTimeZoneMode] = useState<TimeZoneMode>('auto');
  const [orderableOnly, setOrderableOnly] = useState(false);
  const [easyReadMode, setEasyReadMode] = useState(false);

  const [activeBurger, setActiveBurger] = useState<MenuItem>(SIGNATURE_SEVEN_BURGERS[0]);
  const [heroVisualMode, setHeroVisualMode] = useState<HeroVisualMode>('2d');

  const [activeStore, setActiveStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);

  const [detailModalItem, setDetailModalItem] = useState<MenuItem | null>(null);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [compareEntries, setCompareEntries] = useState<ComparisonEntry[]>([]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const activePeriod: ActiveTimePeriod = useMemo(() => {
    if (timeZoneMode === 'auto') return detectLocalPeriod(now);
    return timeZoneMode;
  }, [timeZoneMode, now]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, elementPosition - headerOffset),
      behavior: 'smooth',
    });
  };

  const handleViewIn3D = (item: MenuItem) => {
    setDetailModalItem(null);
    setActiveBurger(item);
    setHeroVisualMode('3d');
    setTimeout(() => scrollToSection('signature-hero'), 60);
  };

  const handleToggleCompare = (item: MenuItem) => {
    setCompareEntries((prev) => {
      const existing = prev.find(
        (e) => e.itemId === item.id && e.customizationsSummary === '공식 기본 레시피'
      );
      if (existing) {
        return prev.filter((e) => e.uid !== existing.uid);
      }
      const isMcLunch =
        activePeriod === 'mclunch' && !!item.priceMcLunch && activeStore.mcLunchAvailable;
      const newEntry: ComparisonEntry = {
        uid: `${item.id}-std-${Date.now()}`,
        itemId: item.id,
        name: item.name,
        mealType: isMcLunch ? 'mclunch' : 'single',
        portionLevel: item.portionLevel,
        weightGrams: item.nutrition.weightGrams,
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        sodium: item.nutrition.sodium,
        saturatedFat: item.nutrition.saturatedFat,
        sugar: item.nutrition.sugar,
        price: isMcLunch && item.priceMcLunch ? item.priceMcLunch : item.priceSingle,
        customizationsSummary: '공식 기본 레시피',
        category: item.category,
      };
      if (prev.length >= 2) {
        return [prev[1], newEntry];
      }
      return [...prev, newEntry];
    });
  };

  const handleAddCustomizedToCompare = (entry: ComparisonEntry) => {
    setCompareEntries((prev) => {
      if (prev.length >= 2) {
        return [prev[1], entry];
      }
      return [...prev, entry];
    });
  };

  const comparedItemIds = useMemo(
    () => compareEntries.map((e) => e.itemId),
    [compareEntries]
  );

  return (
    <div
      className={`min-h-screen bg-[#F8F6F2] text-[#1E1E1E] pb-16 sm:pb-0 ${
        easyReadMode ? 'easy-read-active' : ''
      }`}
    >
      <Header
        activeStore={activeStore}
        compareCount={compareEntries.length}
        easyReadMode={easyReadMode}
        onToggleEasyRead={() => setEasyReadMode((prev) => !prev)}
        onOpenStoreLocator={() => setStoreLocatorOpen(true)}
        onOpenCompareDrawer={() => setCompareDrawerOpen((prev) => !prev)}
        onOrderNow={() => setDetailModalItem(activeBurger)}
        onNavigateSection={scrollToSection}
      />

      <main>
        <SmartToolbar
          timeZoneMode={timeZoneMode}
          activePeriod={activePeriod}
          detectedTimeLabel={formatClock(now)}
          orderableOnly={orderableOnly}
          easyReadMode={easyReadMode}
          onChangeTimeZoneMode={setTimeZoneMode}
          onToggleOrderableOnly={() => setOrderableOnly((prev) => !prev)}
          onToggleEasyRead={() => setEasyReadMode((prev) => !prev)}
        />

        <HeroStage
          activeBurger={activeBurger}
          visualMode={heroVisualMode}
          activeStore={activeStore}
          activePeriod={activePeriod}
          easyReadMode={easyReadMode}
          isCompared={comparedItemIds.includes(activeBurger.id)}
          onSelectBurger={setActiveBurger}
          onChangeVisualMode={setHeroVisualMode}
          onOpenDetailModal={setDetailModalItem}
          onToggleCompare={handleToggleCompare}
        />

        <QuickFinderMatcher
          easyReadMode={easyReadMode}
          onViewIn3D={handleViewIn3D}
          onOpenDetailModal={setDetailModalItem}
        />

        <MenuCatalog
          activePeriod={activePeriod}
          activeStore={activeStore}
          orderableOnly={orderableOnly}
          easyReadMode={easyReadMode}
          comparedIds={comparedItemIds}
          onOpenDetailModal={setDetailModalItem}
          onToggleCompare={handleToggleCompare}
        />

        <BestBurgerAndDelivery
          activeStore={activeStore}
          easyReadMode={easyReadMode}
          onOpenStoreLocator={() => setStoreLocatorOpen(true)}
          onScrollToCatalog={() => scrollToSection('menu-catalog')}
        />
      </main>

      <footer className="bg-[#151515] text-white/70 border-t border-white/10 py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <GoldenArchesLogo className="w-7 h-6 shrink-0" />
            <div>
              <p className="font-display text-sm font-bold text-white keep-all">
                맥도날드 코리아 시그니처 메뉴 &amp; 매장 찾기
              </p>
              <p className="text-xs text-white/55 mt-0.5 keep-all">
                영양성분 정보는 한국맥도날드 공식 표준 레시피 기준입니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => scrollToSection('signature-hero')}
              className="hover:text-[#FFBC0D] cursor-pointer whitespace-nowrap"
            >
              시그니처 7종
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('quick-finder')}
              className="hover:text-[#FFBC0D] cursor-pointer whitespace-nowrap"
            >
              버거 뽑기
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('menu-catalog')}
              className="hover:text-[#FFBC0D] cursor-pointer whitespace-nowrap"
            >
              전체 메뉴
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('best-burger-story')}
              className="hover:text-[#FFBC0D] cursor-pointer whitespace-nowrap"
            >
              베스트 버거
            </button>
            <button
              type="button"
              onClick={() => setStoreLocatorOpen(true)}
              className="hover:text-[#FFBC0D] cursor-pointer whitespace-nowrap"
            >
              매장 찾기
            </button>
          </div>
        </div>
      </footer>

      {detailModalItem && (
        <BurgerDetailModal
          item={detailModalItem}
          activePeriod={activePeriod}
          activeStore={activeStore}
          easyReadMode={easyReadMode}
          onClose={() => setDetailModalItem(null)}
          onViewIn3D={handleViewIn3D}
          onAddCustomizedToCompare={handleAddCustomizedToCompare}
        />
      )}

      <CompareDrawer
        open={compareDrawerOpen}
        entries={compareEntries}
        onClose={() => setCompareDrawerOpen(false)}
        onRemoveEntry={(uid) =>
          setCompareEntries((prev) => prev.filter((e) => e.uid !== uid))
        }
        onClearAll={() => setCompareEntries([])}
      />

      <StoreLocatorModal
        open={storeLocatorOpen}
        activeStore={activeStore}
        onClose={() => setStoreLocatorOpen(false)}
        onSelectPreferredStore={setActiveStore}
      />
    </div>
  );
}
