import React, { useMemo, useState } from 'react';
import {
  X,
  Search,
  MapPin,
  LocateFixed,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Store,
} from 'lucide-react';
import { StoreLocation, StoreRegion, StoreService } from '../types/menu';
import { haversineKm, STORE_LOCATIONS } from '../data/storeData';
import { CONGESTION_LABELS, REGION_LABELS, SERVICE_LABELS } from '../data/labels';

interface StoreLocatorModalProps {
  open: boolean;
  activeStore: StoreLocation;
  onClose: () => void;
  onSelectPreferredStore: (store: StoreLocation) => void;
}

const REGIONS: StoreRegion[] = [
  'All',
  'Seoul',
  'Gyeonggi / Incheon',
  'Busan',
  'Daegu / Daejeon / Gwangju',
  'Jeju',
];

const SERVICES: StoreService[] = [
  '24H',
  'Drive-Thru',
  'McCafé',
  'Parking',
  'McDelivery',
];

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({
  open,
  activeStore,
  onClose,
  onSelectPreferredStore,
}) => {
  const [regionFilter, setRegionFilter] = useState<StoreRegion>('All');
  const [keyword, setKeyword] = useState('');
  const [selectedServices, setSelectedServices] = useState<StoreService[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [previewStore, setPreviewStore] = useState<StoreLocation>(activeStore);
  const [mapZoom, setMapZoom] = useState<'national' | 'seoul'>('national');
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  const toggleService = (service: StoreService) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setUserCoords({ lat: 37.5665, lng: 126.978 });
      setGpsStatusMessage(
        '브라우저 위치 기능을 사용할 수 없어 서울 시청 기준 거리순으로 정렬했습니다.'
      );
      return;
    }

    setGpsLoading(true);
    setGpsStatusMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatusMessage('현재 GPS 위치에서 가장 가까운 매장순으로 정렬했습니다.');
        setGpsLoading(false);
      },
      () => {
        setUserCoords({ lat: 37.5665, lng: 126.978 });
        setGpsStatusMessage(
          '위치 권한이 거부되어 서울 중심 좌표를 기준으로 거리순 정렬했습니다.'
        );
        setGpsLoading(false);
      },
      { timeout: 6000 }
    );
  };

  const filteredStores = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const list = STORE_LOCATIONS.filter((store) => {
      if (regionFilter !== 'All' && store.region !== regionFilter) return false;
      if (
        q &&
        !store.name.toLowerCase().includes(q) &&
        !store.address.toLowerCase().includes(q) &&
        !REGION_LABELS[store.region].toLowerCase().includes(q)
      ) {
        return false;
      }
      if (selectedServices.length > 0) {
        const hasAll = selectedServices.every((svc) => store.services.includes(svc));
        if (!hasAll) return false;
      }
      return true;
    }).map((store) => ({
      ...store,
      distanceKm: userCoords
        ? haversineKm(userCoords.lat, userCoords.lng, store.lat, store.lng)
        : null,
    }));

    if (userCoords) {
      list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }
    return list;
  }, [regionFilter, keyword, selectedServices, userCoords]);

  const mapVisibleStores = useMemo(() => {
    if (mapZoom === 'seoul') {
      return filteredStores.filter((s) => s.seoulX !== undefined && s.seoulY !== undefined);
    }
    return filteredStores;
  }, [filteredStores, mapZoom]);

  const handleCopyAddress = async (store: StoreLocation) => {
    try {
      await navigator.clipboard.writeText(store.address);
      setCopiedAddressId(store.id);
      setTimeout(() => setCopiedAddressId(null), 1800);
    } catch {
      setCopiedAddressId(store.id);
      setTimeout(() => setCopiedAddressId(null), 1800);
    }
  };

  if (!open) return null;

  const getCongestionStyle = (status: StoreLocation['congestion']) => {
    if (status === 'Smooth') return 'text-[#1D6B3A] bg-[#E8F6EE]';
    if (status === 'Moderate') return 'text-[#8C5A00] bg-[#FFF5D6]';
    return 'text-[#DA291C] bg-[#FFF0EE]';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-locator-title"
    >
      <div className="w-full max-w-6xl bg-[#F8F6F2] rounded-2xl border border-[#1E1E1E]/15 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="bg-white border-b border-[#1E1E1E]/10 px-5 sm:px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-bold text-[#DA291C]">
              전국 맥도날드 매장 네트워크
            </p>
            <h2
              id="store-locator-title"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#1E1E1E] keep-all"
            >
              가까운 매장 찾기 &amp; 선호 매장 설정
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F8F6F2] hover:bg-[#1E1E1E]/10 text-[#1E1E1E] cursor-pointer"
            aria-label="매장 찾기 창 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white border-b border-[#1E1E1E]/10 px-5 sm:px-6 py-3.5 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[210px]">
              <Search className="w-4 h-4 text-[#1E1E1E]/45 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="매장명, 지역명 또는 도로명 주소를 입력하세요..."
                aria-label="매장 키워드 검색"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8F6F2] border border-[#1E1E1E]/12 text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#DA291C]"
              />
            </div>

            <button
              type="button"
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#DA291C] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              <LocateFixed className="w-3.5 h-3.5 text-[#FFBC0D]" />
              <span>{gpsLoading ? '위치 확인 중...' : '현재 GPS 위치로 찾기'}</span>
            </button>
          </div>

          {gpsStatusMessage && (
            <p className="text-xs font-medium text-[#1E1E1E]/70 keep-all">
              {gpsStatusMessage}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => {
                    setRegionFilter(region);
                    if (region === 'Seoul') setMapZoom('seoul');
                    else if (region !== 'All') setMapZoom('national');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    regionFilter === region
                      ? 'bg-[#FFBC0D] text-[#1E1E1E]'
                      : 'bg-[#F8F6F2] text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                  }`}
                >
                  {REGION_LABELS[region]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {SERVICES.map((svc) => {
                const active = selectedServices.includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => toggleService(svc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#DA291C] text-white border-[#DA291C]'
                        : 'bg-white text-[#1E1E1E]/75 border-[#1E1E1E]/15 hover:border-[#1E1E1E]'
                    }`}
                  >
                    {SERVICE_LABELS[svc]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#EAE5DC] border border-[#1E1E1E]/12 p-4 relative overflow-hidden min-h-[320px] flex flex-col justify-between">
              <div className="relative z-20 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1E1E1E] bg-white/90 px-2.5 py-1 rounded-md border border-[#1E1E1E]/10">
                  {mapZoom === 'seoul' ? '서울 권역 지도' : '대한민국 전국 지도'} ·{' '}
                  {mapVisibleStores.length}개 매장
                </span>
                <div className="inline-flex p-0.5 rounded-lg bg-white/90 border border-[#1E1E1E]/10">
                  <button
                    type="button"
                    onClick={() => setMapZoom('national')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      mapZoom === 'national'
                        ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                        : 'text-[#1E1E1E]/70'
                    }`}
                  >
                    전국 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom('seoul')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      mapZoom === 'seoul'
                        ? 'bg-[#1E1E1E] text-[#FFBC0D]'
                        : 'text-[#1E1E1E]/70'
                    }`}
                  >
                    서울 확대
                  </button>
                </div>
              </div>

              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                {mapZoom === 'national' ? (
                  <>
                    <path
                      d="M22,12 C34,10 50,8 56,16 C64,26 70,38 76,52 C82,66 84,74 75,78 C64,81 52,82 38,80 C24,78 18,70 18,58 C17,44 15,32 18,22 Z"
                      fill="#FAF8F4"
                      stroke="#CFC8BC"
                      strokeWidth="0.9"
                    />
                    <ellipse
                      cx="23"
                      cy="91"
                      rx="7"
                      ry="3.2"
                      fill="#FAF8F4"
                      stroke="#CFC8BC"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M28,25 L41,48 L65,57 L76,72 M41,48 L29,71"
                      stroke="#DDD6C8"
                      strokeWidth="0.7"
                      strokeDasharray="1.5 1.5"
                      fill="none"
                    />
                  </>
                ) : (
                  <>
                    <rect x="4" y="6" width="92" height="88" rx="8" fill="#FAF8F4" stroke="#CFC8BC" strokeWidth="0.8" />
                    <path
                      d="M6,44 Q28,55 48,49 Q70,44 94,54"
                      fill="none"
                      stroke="#B8D4E3"
                      strokeWidth="4.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15,20 L85,20 M15,75 L85,75 M48,12 L48,88"
                      stroke="#E7E1D6"
                      strokeWidth="0.6"
                    />
                  </>
                )}
              </svg>

              <div className="relative flex-1 min-h-[240px]">
                {mapVisibleStores.map((store) => {
                  const x = mapZoom === 'seoul' ? store.seoulX ?? store.mapX : store.mapX;
                  const y = mapZoom === 'seoul' ? store.seoulY ?? store.mapY : store.mapY;
                  const isPreview = previewStore.id === store.id;
                  const isPreferred = activeStore.id === store.id;

                  return (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => setPreviewStore(store)}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                      aria-label={`${store.name} 핀 선택`}
                    >
                      <span
                        className={`flex items-center justify-center rounded-full border-2 shadow-sm transition-transform ${
                          isPreview
                            ? 'w-7 h-7 bg-[#DA291C] border-white text-white scale-115 z-30'
                            : isPreferred
                            ? 'w-6 h-6 bg-[#FFBC0D] border-[#1E1E1E] text-[#1E1E1E]'
                            : 'w-5 h-5 bg-[#1E1E1E] border-white text-[#FFBC0D] hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold text-[#1E1E1E]/65">
                <span>핀을 클릭하면 대기 시간과 메뉴 현황을 볼 수 있습니다</span>
                <span>노란색 = 현재 선택</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#1E1E1E]/12 p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#DA291C]">
                    <Store className="w-3.5 h-3.5" />
                    <span>{REGION_LABELS[previewStore.region]}</span>
                    {previewStore.isSpecialStore && (
                      <span className="text-[#8C5A00]">· 특수 매장 (일부 메뉴 제외)</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-[#1E1E1E] mt-0.5 keep-all">
                    {previewStore.name}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap ${getCongestionStyle(
                    previewStore.congestion
                  )}`}
                >
                  {CONGESTION_LABELS[previewStore.congestion]} · 약 {previewStore.pickupMinutes}분
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-[#F8F6F2] rounded-xl px-3 py-2 border border-[#1E1E1E]/8">
                <span className="text-xs text-[#1E1E1E]/80 truncate keep-all">
                  {previewStore.address}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAddress(previewStore)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#1E1E1E]/15 text-[11px] font-bold text-[#1E1E1E] hover:border-[#1E1E1E] shrink-0 cursor-pointer"
                >
                  {copiedAddressId === previewStore.id ? (
                    <>
                      <Check className="w-3 h-3 text-[#1D6B3A]" />
                      <span>복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>주소 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#F8F6F2]">
                  <span className="block text-[10px] font-semibold text-[#1E1E1E]/60">
                    맥모닝
                  </span>
                  <span className="font-bold text-[#1E1E1E]">
                    {previewStore.mcMorningAvailable ? '판매 중' : '미판매'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F8F6F2]">
                  <span className="block text-[10px] font-semibold text-[#1E1E1E]/60">
                    맥런치
                  </span>
                  <span className="font-bold text-[#1E1E1E]">
                    {previewStore.mcLunchAvailable ? '적용 매장' : '일반가'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F8F6F2]">
                  <span className="block text-[10px] font-semibold text-[#1E1E1E]/60">
                    해피밀 토이 재고
                  </span>
                  <span className="font-mono-num font-bold text-[#DA291C]">
                    {previewStore.happyMealToyStock}개 남음
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#1E1E1E]/60 mr-1">길찾기:</span>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(previewStore.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#03C75A]/12 text-[#028A3E] font-bold hover:underline"
                >
                  <span>네이버 지도</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(previewStore.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFBC0D]/25 text-[#5C4300] font-bold hover:underline"
                >
                  <span>카카오맵</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${previewStore.lat},${previewStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E1E1E]/8 text-[#1E1E1E] font-bold hover:underline"
                >
                  <span>구글 지도</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectPreferredStore(previewStore);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#DA291C] hover:bg-[#B81F14] text-white text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
              >
                {activeStore.id === previewStore.id
                  ? '현재 선호 매장으로 설정됨'
                  : '선호 매장으로 설정하기'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-2.5">
            {filteredStores.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#1E1E1E]/10 p-8 text-center">
                <p className="font-bold text-[#1E1E1E]">조건에 맞는 매장을 찾지 못했습니다.</p>
                <p className="text-xs text-[#1E1E1E]/60 mt-1">
                  검색어나 서비스 필터를 초기화해 다시 검색해 보세요.
                </p>
              </div>
            ) : (
              filteredStores.map((store) => {
                const isSelected = previewStore.id === store.id;
                const isPreferred = activeStore.id === store.id;

                return (
                  <div
                    key={store.id}
                    onClick={() => setPreviewStore(store)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPreviewStore(store);
                      }
                    }}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#DA291C] shadow-sm'
                        : 'bg-white/80 border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-sm sm:text-base font-extrabold text-[#1E1E1E] keep-all">
                          {store.name}
                        </h4>
                        {isPreferred && (
                          <span className="text-[11px] font-bold text-[#DA291C]">
                            선호 매장
                          </span>
                        )}
                        {store.distanceKm !== null && (
                          <span className="font-mono-num text-xs font-bold text-[#1E1E1E]/65">
                            {store.distanceKm} km
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#1E1E1E]/70 truncate keep-all">
                        {store.address}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#1E1E1E]/65 pt-0.5">
                        <span>{store.services.map((s) => SERVICE_LABELS[s]).join(' · ')}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap ${getCongestionStyle(
                          store.congestion
                        )}`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>
                          {CONGESTION_LABELS[store.congestion]} ({store.pickupMinutes}분)
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPreferredStore(store);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isPreferred
                            ? 'bg-[#FFBC0D] text-[#1E1E1E]'
                            : 'bg-[#1E1E1E] hover:bg-[#DA291C] text-white'
                        }`}
                      >
                        {isPreferred ? '사용 중' : '매장 선택'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
