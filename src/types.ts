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
