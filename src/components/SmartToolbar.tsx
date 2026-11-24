import React from 'react';
import { Clock, Sun, Flame, Eye, Filter } from 'lucide-react';
import { ActiveTimePeriod, TimeZoneMode } from '../types/menu';

interface SmartToolbarProps {
  timeZoneMode: TimeZoneMode;
  activePeriod: ActiveTimePeriod;
  detectedTimeLabel: string;
  orderableOnly: boolean;
  easyReadMode: boolean;
  onChangeTimeZoneMode: (mode: TimeZoneMode) => void;
  onToggleOrderableOnly: () => void;
  onToggleEasyRead: () => void;
}

const PERIOD_DETAILS: Record<
  ActiveTimePeriod,
  {
    label: string;
    windowText: string;
    easyNote: string;
    bannerBg: string;
    accentText: string;
  }
> = {
  mcmorning: {
    label: '맥모닝 운영 시간',
    windowText: '04:00 – 10:30',
    easyNote: '지금은 아침 메뉴만 주문할 수 있어요. 일반 버거는 오전 10시 30분부터 주문돼요.',
    bannerBg: 'bg-[#FFF5D6] border-[#FFBC0D]',
    accentText: 'text-[#8C5A00]',
  },
  mclunch: {
    label: '맥런치 할인 시간',
    windowText: '10:30 – 14:00',
    easyNote: '지금은 인기 버거 세트를 점심 할인 가격으로 주문할 수 있어요.',
    bannerBg: 'bg-[#FFF0EE] border-[#DA291C]/35',
    accentText: 'text-[#DA291C]',
  },
  regular: {
    label: '일반 메뉴 운영 시간',
    windowText: '14:00 – 04:00',
    easyNote: '모든 시그니처 버거와 해피밀, 사이드 메뉴를 주문할 수 있어요.',
    bannerBg: 'bg-white border-[#1E1E1E]/12',
    accentText: 'text-[#1E1E1E]',
  },
};

export const SmartToolbar: React.FC<SmartToolbarProps> = ({
  timeZoneMode,
  activePeriod,
  detectedTimeLabel,
  orderableOnly,
  easyReadMode,
  onChangeTimeZoneMode,
  onToggleOrderableOnly,
  onToggleEasyRead,
}) => {
  const details = PERIOD_DETAILS[activePeriod];

  return (
    <div className="pt-16 md:pt-20 bg-[#F8F6F2] border-b border-[#1E1E1E]/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div
          className={`rounded-xl border px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 transition-colors duration-200 ${details.bannerBg}`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold keep-all whitespace-nowrap ${details.accentText}`}
            >
              {activePeriod === 'mcmorning' && <Sun className="w-4 h-4 text-[#D99100]" />}
              {activePeriod === 'mclunch' && <Flame className="w-4 h-4 text-[#DA291C]" />}
              {activePeriod === 'regular' && <Clock className="w-4 h-4 text-[#1E1E1E]" />}
              <span>{details.label}</span>
            </span>
            <span className="text-xs font-mono-num text-[#1E1E1E]/65 whitespace-nowrap">
              {details.windowText} · {timeZoneMode === 'auto' ? `현재 ${detectedTimeLabel}` : '시간대 체험'}
            </span>
            {easyReadMode && (
              <span className="text-xs font-semibold text-[#1E1E1E] keep-all">
                — {details.easyNote}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center p-0.5 rounded-lg bg-[#1E1E1E]/8 border border-[#1E1E1E]/10"
              role="group"
              aria-label="시간대별 메뉴 전환"
            >
              {(
                [
                  { id: 'auto', label: '자동' },
                  { id: 'mcmorning', label: '맥모닝' },
                  { id: 'mclunch', label: '맥런치' },
                  { id: 'regular', label: '일반' },
                ] as { id: TimeZoneMode; label: string }[]
              ).map((tab) => {
                const isActive = timeZoneMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChangeTimeZoneMode(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? tab.id === 'mclunch'
                          ? 'bg-[#DA291C] text-white shadow-xs'
                          : tab.id === 'mcmorning'
                          ? 'bg-[#FFBC0D] text-[#1E1E1E] shadow-xs'
                          : 'bg-[#1E1E1E] text-white shadow-xs'
                        : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onToggleOrderableOnly}
              aria-pressed={orderableOnly}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                orderableOnly
                  ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                  : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/15 hover:border-[#1E1E1E]/35'
              }`}
            >
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span className="keep-all">지금 주문 가능만 보기</span>
            </button>

            <button
              type="button"
              onClick={onToggleEasyRead}
              aria-pressed={easyReadMode}
              className={`md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                easyReadMode
                  ? 'bg-[#FFBC0D] text-[#1E1E1E] border-[#1E1E1E]'
                  : 'bg-white text-[#1E1E1E] border-[#1E1E1E]/15'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>쉬운 글</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
