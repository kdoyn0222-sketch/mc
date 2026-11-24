export type TimeZoneMode = 'auto' | 'mcmorning' | 'mclunch' | 'regular';
export type ActiveTimePeriod = 'mcmorning' | 'mclunch' | 'regular';

export type MenuCategory =
  | 'All'
  | 'Beef'
  | 'Chicken'
  | 'Seafood'
  | 'Bulgogi'
  | 'McMorning'
  | 'Happy Meal';

export type AllergenType =
  | 'Egg'
  | 'Milk'
  | 'Soy'
  | 'Wheat'
  | 'Beef'
  | 'Pork'
  | 'Chicken'
  | 'Shrimp'
  | 'Tomato';

export type SortOption = 'popular' | 'protein' | 'calories' | 'price';

export type PortionLevel = 'Light Bite' | 'Standard Meal' | 'Heavy Two-Hand Burger';

export type AppetiteChoice = 'light' | 'balanced' | 'filling';
export type ProteinChoice = 'beef' | 'chicken-shrimp' | 'pork';
export type FlavorChoice = 'classic' | 'spicy' | 'smoky';

export type LayerVisualType =
  | 'sesame-bun-top'
  | 'plain-bun-top'
  | 'bun-middle'
  | 'bun-bottom'
  | 'beef-patty'
  | 'thick-beef-patty'
  | 'pork-bulgogi-patty'
  | 'chicken-crispy-patty'
  | 'shrimp-patty'
  | 'egg-patty'
  | 'sausage-patty'
  | 'english-muffin-top'
  | 'english-muffin-bottom'
  | 'cheddar-cheese'
  | 'bacon-protruding'
  | 'bacon-strips'
  | 'lettuce-shredded'
  | 'lettuce-leaf'
  | 'tomato-two'
  | 'tomato-single'
  | 'pickles'
  | 'onions-caramelized'
  | 'onions-fresh'
  | 'sauce-bigmac'
  | 'sauce-1955'
  | 'sauce-mayo'
  | 'sauce-ketchup-mustard'
  | 'sauce-chili-mayo'
  | 'sauce-shrimp-onion';

export interface IngredientLayer {
  id: string;
  name: string;
  shortTag: string;
  easyReadLabel: string;
  description: string;
  origin: string;
  color: string;
  visualType: LayerVisualType;
  removable: boolean;
  deltaCalories: number;
  deltaSodium: number;
  deltaProtein: number;
  weightGrams: number;
}

export interface SmartSidePairing {
  id: string;
  name: string;
  easyReadName: string;
  reason: string;
  price: number;
  calories: number;
  protein: number;
  sodium: number;
}

export interface HappySnackItem {
  id: string;
  name: string;
  easyReadName: string;
  price: number;
  calories: number;
  protein: number;
  sodium: number;
}

export interface HappyMealToyWave {
  wave: 'Wave 1' | 'Wave 2';
  title: string;
  releaseWindow: string;
  ageGroup: '3-5' | '6+';
  ageLabel: string;
  description: string;
  easyReadDescription: string;
  characters: string[];
}

export interface NutritionFacts {
  weightGrams: number;
  calories: number;
  protein: number;
  sodium: number;
  saturatedFat: number;
  sugar: number;
}

export interface MenuItem {
  id: string;
  name: string;
  koreanSubtitle: string;
  isSignatureSeven: boolean;
  category: Exclude<MenuCategory, 'All'>;
  popularityRank: number;
  availablePeriods: ActiveTimePeriod[];
  priceSingle: number;
  priceSet: number;
  priceMcLunch?: number;
  portionLevel: PortionLevel;
  satietyPercent: number;
  triviaNote: string;
  matcherProfile: {
    appetite: AppetiteChoice[];
    protein: ProteinChoice;
    flavor: FlavorChoice[];
  };
  smartSidePairings: SmartSidePairing[];
  tagline: string;
  easyReadSummary: string;
  originSummary: string;
  allergens: AllergenType[];
  nutrition: NutritionFacts;
  layers: IngredientLayer[];
  realPhotoComparison?: string;
}

export type StoreService = '24H' | 'Drive-Thru' | 'McCafé' | 'Parking' | 'McDelivery';
export type StoreRegion =
  | 'All'
  | 'Seoul'
  | 'Gyeonggi / Incheon'
  | 'Busan'
  | 'Daegu / Daejeon / Gwangju'
  | 'Jeju';

export type CongestionStatus = 'Smooth' | 'Moderate' | 'Busy';

export interface StoreLocation {
  id: string;
  name: string;
  region: Exclude<StoreRegion, 'All'>;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  seoulX?: number;
  seoulY?: number;
  services: StoreService[];
  congestion: CongestionStatus;
  pickupMinutes: number;
  happyMealToyStock: number;
  isSpecialStore: boolean;
  mcMorningAvailable: boolean;
  mcLunchAvailable: boolean;
  unavailableItemIds: string[];
}

export interface ComparisonEntry {
  uid: string;
  itemId: string;
  name: string;
  mealType: 'single' | 'set' | 'mclunch';
  portionLevel: PortionLevel;
  weightGrams: number;
  calories: number;
  protein: number;
  sodium: number;
  saturatedFat: number;
  sugar: number;
  price: number;
  customizationsSummary: string;
  category: Exclude<MenuCategory, 'All'>;
}
