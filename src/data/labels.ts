import {
  AllergenType,
  CongestionStatus,
  MenuCategory,
  PortionLevel,
  StoreRegion,
  StoreService,
} from '../types/menu';

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  All: '전체',
  Beef: '비프',
  Chicken: '치킨',
  Seafood: '씨푸드',
  Bulgogi: '불고기',
  McMorning: '맥모닝',
  'Happy Meal': '해피밀',
};

export const ALLERGEN_LABELS: Record<AllergenType, string> = {
  Egg: '난류',
  Milk: '우유',
  Soy: '대두',
  Wheat: '밀',
  Beef: '쇠고기',
  Pork: '돼지고기',
  Chicken: '닭고기',
  Shrimp: '새우',
  Tomato: '토마토',
};

export const PORTION_LABELS: Record<PortionLevel, string> = {
  'Light Bite': '가벼운 한 끼',
  'Standard Meal': '표준 정식 버거',
  'Heavy Two-Hand Burger': '묵직한 투핸드 버거',
};

export const REGION_LABELS: Record<StoreRegion, string> = {
  All: '전체',
  Seoul: '서울',
  'Gyeonggi / Incheon': '경기 / 인천',
  Busan: '부산',
  'Daegu / Daejeon / Gwangju': '대구 / 대전 / 광주',
  Jeju: '제주',
};

export const SERVICE_LABELS: Record<StoreService, string> = {
  '24H': '24시간',
  'Drive-Thru': '드라이브 스루',
  McCafé: '맥카페',
  Parking: '주차 가능',
  McDelivery: '맥딜리버리',
};

export const CONGESTION_LABELS: Record<CongestionStatus, string> = {
  Smooth: '원활',
  Moderate: '보통',
  Busy: '혼잡',
};
