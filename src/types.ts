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
