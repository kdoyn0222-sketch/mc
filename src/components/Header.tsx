import React, { useState } from 'react';
import {
  MapPin,
  Scale,
  Menu,
  X,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { StoreLocation } from '../types/menu';

interface HeaderProps {
  activeStore: StoreLocation;
  compareCount: number;
  easyReadMode: boolean;
  onToggleEasyRead: () => void;
  onOpenStoreLocator: () => void;
  onOpenCompareDrawer: () => void;
  onOrderNow: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'signature-hero', label: '시그니처' },
  { id: 'quick-finder', label: '버거 뽑기' },
  { id: 'menu-catalog', label: '전체 메뉴' },
  { id: 'best-burger-story', label: '베스트 버거' },
  { id: 'mcdelivery-app', label: '맥딜리버리' },
  { id: 'store-locator-hub', label: '매장 찾기' },
];

export const GoldenArchesLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-7' }) => (
  <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
    <path
      d="M7 52 C7 24, 15 6, 22 6 C28 6, 32 22, 32 36 C32 22, 36 6, 42 6 C49 6, 57 24, 57 52 L48 52 C48 29, 44 15, 41 15 C38 15, 35 28, 35 48 L29 48 C29 28, 26 15, 23 15 C20 15, 16 29, 16 52 Z"
      fill="#FFBC0D"
    />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  activeStore,
  compareCount,
  easyReadMode,
  onToggleEasyRead,
  onOpenStoreLocator,
  onOpenCompareDrawer,
  onOrderNow,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  const shortStoreName = activeStore.name.replace(/^맥도날드\s+/i, '');

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-16 md:h-20 bg-[#1E1E1E] text-white border-b border-white/10 shadow-sm">
        <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('signature-hero')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFBC0D] rounded-md py-1"
          >
            <GoldenArchesLogo className="w-8 h-7 shrink-0" />
            <span className="font-display text-lg md:text-xl font-extrabold tracking-tight text-white keep-all whitespace-nowrap">
              맥도날드
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="주요 내비게이션"
            className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-white/85"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="relative py-1.5 hover:text-[#FFBC0D] transition-colors duration-150 whitespace-nowrap shrink-0 keep-all cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#FFBC0D] after:transition-all after:duration-150"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions & Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenStoreLocator}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer max-w-[155px]"
              title={`선택된 매장: ${activeStore.name}`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFBC0D] shrink-0" />
              <span className="truncate keep-all">{shortStoreName}</span>
            </button>

            <button
              type="button"
              onClick={onToggleEasyRead}
              aria-pressed={easyReadMode}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                easyReadMode
                  ? 'bg-[#FFBC0D] text-[#1E1E1E]'
                  : 'bg-white/10 text-white/90 hover:bg-white/15'
              }`}
              title="쉬운 글 · 큰 글씨 모드 전환"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="keep-all whitespace-nowrap">
                {easyReadMode ? '쉬운 글 켜짐' : '쉬운 글'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCompareDrawer}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={`영양성분 비교함 열기 (${compareCount}개 메뉴)`}
            >
              <Scale className="w-3.5 h-3.5 text-[#FFBC0D] shrink-0" />
              <span className="hidden sm:inline keep-all">비교함</span>
              <span className="font-mono-num px-1.5 py-0.5 rounded bg-[#FFBC0D] text-[#1E1E1E] text-[11px] font-bold leading-none">
                {compareCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onOrderNow}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DA291C] hover:bg-[#B81F14] text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="keep-all">주문하기</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 text-white cursor-pointer"
              aria-label={mobileMenuOpen ? '내비게이션 메뉴 닫기' : '내비게이션 메뉴 열기'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#1E1E1E] border-b border-white/15 px-4 py-4 shadow-xl">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-[#FFBC0D] transition-colors keep-all whitespace-nowrap cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStoreLocator();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FFBC0D]" />
                <span className="truncate">{shortStoreName}</span>
              </button>
              <button
                type="button"
                onClick={onToggleEasyRead}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  easyReadMode ? 'bg-[#FFBC0D] text-[#1E1E1E]' : 'bg-white/10 text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{easyReadMode ? '쉬운 글 켜짐' : '쉬운 글'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 h-13 bg-[#1E1E1E] border-t border-white/15 px-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenStoreLocator}
          className="flex-1 min-w-0 inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md bg-white/10 text-xs font-medium text-white truncate cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FFBC0D] shrink-0" />
          <span className="truncate keep-all">{shortStoreName}</span>
        </button>
        <button
          type="button"
          onClick={onOpenCompareDrawer}
          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-white/10 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-[#FFBC0D]" />
          <span className="font-mono-num">{compareCount}</span>
        </button>
        <button
          type="button"
          onClick={onOrderNow}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#DA291C] text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>주문하기</span>
        </button>
      </div>
    </>
  );
};
