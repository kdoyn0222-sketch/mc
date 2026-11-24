import React from 'react';
import { Flame, ThermometerSun, Clock, MapPin, Navigation, Smartphone } from 'lucide-react';
import { GENERATED_IMAGES } from '../data/menuData';
import { CONGESTION_LABELS, SERVICE_LABELS } from '../data/labels';
import { StoreLocation } from '../types/menu';

interface BestBurgerAndDeliveryProps {
  activeStore: StoreLocation;
  easyReadMode: boolean;
  onOpenStoreLocator: () => void;
  onScrollToCatalog: () => void;
}

const CRAFT_PILLARS = [
  {
    number: '01',
    title: '글레이즈 번 열 보존력 강화',
    metric: '+5초 더 깊은 토스팅',
    description:
      '글레이즈드 번과 참깨 번을 더 높은 온도에서 5초 길게 토스팅해 겉면에 얇은 캐러멜 막을 형성하고, 버거의 온기와 쫄깃한 식감을 오래 유지합니다.',
    easyRead:
      '빵을 5초 더 구워서 버거가 식거나 소스에 눅눅해지지 않고 끝까지 따뜻하고 폭신해요.',
  },
  {
    number: '02',
    title: '그릴 양파 시어링 & 풍부한 육즙',
    metric: '소량 소분 그릴 조리',
    description:
      '패티를 적은 수량씩 나눠 굽고, 그릴 위 고기 위에 다진 양파를 바로 올려 함께 구워 소고기 본연의 깊은 육즙과 달콤한 양파 풍미를 가둡니다.',
    easyRead:
      '고기 패티를 조금씩 굽고 양파를 함께 올려 구워서 육즙이 훨씬 진하고 촉촉해요.',
  },
  {
    number: '03',
    title: '17.5°C 치즈 멜팅 포인트',
    metric: '17.5°C 사전 온도 제어',
    description:
      '조리 전 체다 치즈를 정확히 17.5°C로 템퍼링해 패티 위에 얹는 순간 잔열만으로도 가장 부드럽고 먹음직스럽게 녹아내리도록 설계했습니다.',
    easyRead:
      '치즈를 미리 17.5°C로 맞춰 두어 뜨거운 고기 위에서 먹음직스럽게 사르르 녹아내려요.',
  },
];

export const BestBurgerAndDelivery: React.FC<BestBurgerAndDeliveryProps> = ({
  activeStore,
  easyReadMode,
  onOpenStoreLocator,
  onScrollToCatalog,
}) => {
  return (
    <>
      {/* Section 7A: Best Burger Craft */}
      <section
        id="best-burger-story"
        className="py-14 lg:py-20 bg-[#F8F6F2] border-b border-[#1E1E1E]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#1E1E1E]/10 bg-[#1E1E1E] flex flex-col">
              <img
                src={GENERATED_IMAGES.bestBurgerGrill}
                alt="베스트 버거 고온 그릴에서 시어링되는 순쇠고기 패티와 녹은 치즈"
                referrerPolicy="no-referrer"
                className="w-full h-72 lg:h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs font-bold text-[#DA291C] mb-1.5 keep-all">
                  베스트 버거 스토리
                </p>
                <h2
                  className="font-display font-extrabold text-[#1E1E1E] tracking-tight keep-all"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
                >
                  더 맛있어진 버거, 주방에서 바뀐 3가지 원칙
                </h2>
                <p
                  className={`mt-3 text-[#1E1E1E]/75 keep-all ${
                    easyReadMode ? 'easy-read-text' : 'text-sm sm:text-base max-w-2xl'
                  }`}
                >
                  {easyReadMode
                    ? '맥도날드 코리아는 빵 굽기, 양파와 고기 굽기, 17.5°C 치즈 온도 관리를 바꿔서 버거를 더 뜨겁고 촉촉하게 만들어요.'
                    : '한국 맥도날드의 모든 주방은 글로벌 베스트 버거 기준에 맞춰 글레이즈 번 토스팅, 양파 시어링, 17.5°C 치즈 멜팅 공정을 정밀하게 관리합니다.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CRAFT_PILLARS.map((pillar, idx) => (
                  <div
                    key={pillar.number}
                    className="rounded-2xl bg-white border border-[#1E1E1E]/10 p-5 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono-num font-bold text-[#DA291C] mb-2">
                        <span>{pillar.number}</span>
                        {idx === 0 && <Flame className="w-4 h-4 text-[#DA291C]" />}
                        {idx === 1 && <ThermometerSun className="w-4 h-4 text-[#FFBC0D]" />}
                        {idx === 2 && <Clock className="w-4 h-4 text-[#1E1E1E]" />}
                      </div>
                      <h3 className="font-display text-base font-extrabold text-[#1E1E1E] keep-all">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] font-mono-num font-semibold text-[#1E1E1E]/55 mt-0.5">
                        {pillar.metric}
                      </p>
                    </div>
                    <p
                      className={`text-[#1E1E1E]/80 leading-relaxed keep-all ${
                        easyReadMode ? 'text-sm font-medium' : 'text-xs'
                      }`}
                    >
                      {easyReadMode ? pillar.easyRead : pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7B: Dark Charcoal (#1E1E1E) McDelivery & M-Order */}
      <section
        id="mcdelivery-app"
        className="py-14 lg:py-20 bg-[#1E1E1E] text-white"
      >
        <div
          id="store-locator-hub"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-[#FFBC0D] tracking-wide mb-2 keep-all">
                  맥딜리버리 &amp; M오더 스마트 픽업
                </p>
                <h2
                  className="font-display font-extrabold text-white tracking-tight keep-all"
                  style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.65rem)', textWrap: 'balance' }}
                >
                  줄 서지 않는 M오더 픽업과 따뜻한 맥딜리버리
                </h2>
                <p
                  className={`mt-3 text-white/80 keep-all ${
                    easyReadMode ? 'easy-read-text' : 'text-sm sm:text-base'
                  }`}
                >
                  {easyReadMode
                    ? '자주 가는 매장을 선택하면 예상 대기 시간, 주문 가능한 메뉴, 해피밀 장난감 재고를 바로 확인할 수 있어요.'
                    : '선호 매장을 설정하면 해당 매장의 실시간 조리 예상 시간, 맥런치 적용 여부, 판매 가능한 메뉴와 해피밀 토이 재고가 사이트 전체에 즉시 연동됩니다.'}
                </p>
              </div>

              <div className="rounded-2xl bg-white/6 border border-white/15 p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#FFBC0D]">
                      현재 선택된 매장
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-0.5 keep-all">
                      {activeStore.name}
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5 keep-all">
                      {activeStore.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-white/60 block">
                      실시간 M오더 준비 시간
                    </span>
                    <span className="font-mono-num text-xl font-extrabold text-[#FFBC0D]">
                      약 {activeStore.pickupMinutes}분
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs font-semibold text-white/85">
                  <span>
                    매장 혼잡도:{' '}
                    <strong className="text-[#FFBC0D]">
                      {CONGESTION_LABELS[activeStore.congestion]}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    제공 서비스:{' '}
                    {activeStore.services.map((s) => SERVICE_LABELS[s]).join(' / ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenStoreLocator}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFBC0D] hover:bg-[#eab000] text-[#1E1E1E] text-sm font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="keep-all">가까운 매장 찾기</span>
                </button>

                <button
                  type="button"
                  onClick={onScrollToCatalog}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/18 text-white text-sm font-bold border border-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-[#FFBC0D] shrink-0" />
                  <span className="keep-all">주문 가능 메뉴 보기</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-white/12 relative">
                <img
                  src={GENERATED_IMAGES.mcDeliveryTable}
                  alt="맥딜리버리로 안전하게 포장된 버거와 후렌치 후라이, 아이스 커피"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-96 object-cover"
                />
                <div className="bg-gradient-to-t from-black/85 via-black/30 to-transparent absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#FFBC0D]">
                      {activeStore.services.includes('McDelivery')
                        ? '맥딜리버리 주문 가능 매장'
                        : '매장 식사 & 테이크아웃 전용 매장'}
                    </p>
                    <p className="text-sm font-semibold text-white keep-all">
                      {activeStore.name.replace('맥도날드 ', '')} 보온 안심 패키징 출발
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenStoreLocator}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#DA291C] hover:bg-[#b81f14] text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>매장 변경</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
