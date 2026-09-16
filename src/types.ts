export type ProjectCategory = 
  | 'all'
  | 'zero-capital'
  | 'home-based'
  | 'services'
  | 'digital'
  | 'food-crafts'
  | 'micro-commerce';

export type EaseLevel = 'سهل جداً' | 'سهل' | 'متوسط';

export interface UnitEconomics {
  costPerUnit: number;
  salePrice: number;
  unitName: string;
  unitsPerMonth: number;
  exampleExplanation: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  category: ProjectCategory;
  badge: string;
  shortDescription: string;
  detailedDescription: string;
  capitalRange: {
    min: number;
    max: number;
    label: string;
  };
  monthlyProfitRange: {
    min: number;
    max: number;
    label: string;
  };
  profitMargin: string;
  easeLevel: EaseLevel;
  timeToRevenue: string;
  workLocation: string;
  dailyHours: string;
  requirements: string[];
  actionSteps: string[];
  marketingStrategy: string[];
  secretToSuccess: string;
  potentialRisksAndFix: string;
  unitEconomics: UnitEconomics;
  tags: string[];
}

export interface BusinessPlanResult {
  title: string;
  summary: string;
  targetMarket: string;
  estimatedStartupCost: string;
  expectedMonthlyProfit: string;
  breakEvenDays: string;
  quickSteps: string[];
  weeklyRoadmap: { week: string; task: string }[];
  riskMitigation: string[];
  pricingAdvice: string;
}

/* ---------- وضع "أحتاج دخلاً هذا الأسبوع" ---------- */

export type FastCashAssetKey =
  | 'phone'
  | 'laptop'
  | 'vehicle'
  | 'kitchen'
  | 'cleaning-tools'
  | 'physical'
  | 'design-skill'
  | 'writing-skill'
  | 'teaching-skill'
  | 'social-following'
  | 'unused-items';

export interface FastCashAsset {
  key: FastCashAssetKey;
  label: string;
  hint: string;
  icon: string;
}

export interface FastCashTask {
  id: string;
  when: string;
  task: string;
}

export interface FastCashTemplate {
  label: string;
  text: string;
}

export interface FastCashPlay {
  id: string;
  title: string;
  hook: string;
  requiredAssets: FastCashAssetKey[];
  capital: number;
  firstIncomeHours: number;
  payout: { min: number; max: number; unit: string };
  effort: 'خفيف' | 'متوسط' | 'مجهود بدني';
  whoPays: string;
  whereToFind: string[];
  priceScript: string;
  timeline: FastCashTask[];
  templates: FastCashTemplate[];
  warning: string;
  linkedProjectId?: string;
}

export interface EarningEntry {
  id: string;
  amount: number;
  note: string;
  at: number;
}

export interface EmergencyCashState {
  ownedAssets: FastCashAssetKey[];
  hoursToday: number;
  targetAmount: number;
  deadlineHours: number;
  activePlayId: string | null;
  doneTasks: Record<string, string[]>;
  earnings: EarningEntry[];
}

/* ---------- ماسح الأصول: توليد أفكار من تركيبة ما تملكه ---------- */

export interface AssetOption {
  label: string;
  keys: string[];
}

export interface AssetGroup {
  id: string;
  label: string;
  hint: string;
  icon: string;
  options: AssetOption[];
}

export interface ScannedIdea {
  id: string;
  title: string;
  assetCombo: string[];
  whyYou: string;
  whoPays: string;
  firstStepToday: string;
  startupCost: string;
  monthlyPotential: string;
  timeToFirstIncome: string;
  honestWeakness: string;
  scaleUp: string;
}

export interface AssetScanResult {
  id: string;
  createdAt: number;
  assets: string[];
  city: string;
  ideas: ScannedIdea[];
  note?: string;
}

/* ---------- محاكي المشروع: 12 شهراً افتراضية ---------- */

export interface SimConfig {
  projectId: string;
  projectTitle: string;
  unitName: string;
  basePrice: number;
  baseCost: number;
  baseDemand: number;
  startingCash: number;
  fixedMonthlyCost: number;
  baseCapacity: number;
  perishable: boolean;
}

export interface SimEventEffects {
  costMultiplier?: number;
  demandMultiplier?: number;
  reputationDelta?: number;
  cashDelta?: number;
  bulkOrder?: { units: number; pricePerUnit: number };
  /* آثار دائمة تستمر لبقية السنة */
  capacityMultiplier?: number;
  extraFixedCost?: number;
  permanentDemandBonus?: number;
}

export interface SimEvent {
  id: string;
  title: string;
  description: string;
  kind: 'auto' | 'choice';
  acceptLabel?: string;
  declineLabel?: string;
  effects: SimEventEffects;
  declineEffects?: SimEventEffects;
  minMonth?: number;
}

export interface SimDecision {
  price: number;
  produceUnits: number;
  marketingSpend: number;
  acceptedEvent?: boolean;
}

export interface MonthResult {
  month: number;
  price: number;
  produced: number;
  demand: number;
  sold: number;
  lostSales: number;
  revenue: number;
  productionCost: number;
  marketingSpend: number;
  fixedCost: number;
  profit: number;
  cashAfter: number;
  inventoryAfter: number;
  spoiled: number;
  reputationAfter: number;
  capacityAfter: number;
  eventTitle?: string;
  eventOutcome?: string;
}

export interface SimState {
  config: SimConfig;
  month: number;
  cash: number;
  inventory: number;
  reputation: number;
  capacity: number;
  extraFixedCost: number;
  demandBonus: number;
  history: MonthResult[];
  pendingEvent: SimEvent | null;
  status: 'playing' | 'finished' | 'bankrupt';
}

export interface SimVerdict {
  headline: string;
  finalCash: number;
  totalProfit: number;
  bestMonth: number;
  worstMonth: number;
  lessons: string[];
  shareText: string;
}
