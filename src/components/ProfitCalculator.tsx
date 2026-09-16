import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Target, 
  Clock, 
  RefreshCcw,
  Check,
  BarChart3,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ProjectIdea } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext';

interface ProfitCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectIdea | null;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  isOpen,
  onClose,
  initialProject,
}) => {
  const { t, language, isRTL, getLocalizedProject } = useLanguage();

  const localizedProjects = useMemo(() => {
    return PROJECT_IDEAS.map((p) => getLocalizedProject(p));
  }, [getLocalizedProject]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProject ? initialProject.id : localizedProjects[0].id
  );

  const [salePrice, setSalePrice] = useState<number>(25);
  const [costPerUnit, setCostPerUnit] = useState<number>(5);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(40);
  const [fixedCosts, setFixedCosts] = useState<number>(30); // monthly ads, phone, tools
  const [startupCapital, setStartupCapital] = useState<number>(100);

  // When initialProject changes or modal opens with one, populate
  useEffect(() => {
    if (initialProject) {
      setSelectedProjectId(initialProject.id);
      loadProjectValues(initialProject);
    }
  }, [initialProject, isOpen]);

  const loadProjectValues = (proj: ProjectIdea) => {
    setSalePrice(proj.unitEconomics.salePrice);
    setCostPerUnit(proj.unitEconomics.costPerUnit);
    setMonthlyUnits(proj.unitEconomics.unitsPerMonth);
    setStartupCapital(proj.capitalRange.min > 0 ? proj.capitalRange.min : 20);
    setFixedCosts(25);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    const found = localizedProjects.find((p) => p.id === id);
    if (found) {
      loadProjectValues(found);
    }
  };

  // Calculations
  const grossRevenue = salePrice * monthlyUnits;
  const variableCosts = costPerUnit * monthlyUnits;
  const totalMonthlyExpenses = variableCosts + fixedCosts;
  const netMonthlyProfit = grossRevenue - totalMonthlyExpenses;
  const profitMarginPercent = grossRevenue > 0 
    ? Math.round((netMonthlyProfit / grossRevenue) * 100) 
    : 0;

  // Breakeven analysis
  const contributionMarginPerUnit = salePrice - costPerUnit;
  const breakevenUnits = contributionMarginPerUnit > 0 
    ? Math.ceil(fixedCosts / contributionMarginPerUnit) 
    : 0;

  // Payback period for startup capital
  const paybackMonths = netMonthlyProfit > 0 
    ? (startupCapital / netMonthlyProfit).toFixed(1) 
    : t('calc_not_available');

  // 6-Month Growth Projections & Recharts configuration
  type GrowthScenario = 'realistic' | 'conservative' | 'aggressive';
  type ChartView = 'monthly' | 'cumulative';

  const [growthScenario, setGrowthScenario] = useState<GrowthScenario>('realistic');
  const [chartView, setChartView] = useState<ChartView>('monthly');

  const scenarioMultipliers: Record<GrowthScenario, number[]> = {
    conservative: [0.45, 0.60, 0.75, 0.90, 1.05, 1.20],
    realistic: [0.55, 0.75, 1.00, 1.25, 1.50, 1.75],
    aggressive: [0.70, 1.05, 1.45, 1.90, 2.40, 3.00],
  };

  const projectionData = useMemo(() => {
    const multipliers = scenarioMultipliers[growthScenario];
    let runningCumulative = 0;

    return multipliers.map((mult, idx) => {
      const monthNumber = idx + 1;
      const units = Math.max(1, Math.round(monthlyUnits * mult));
      const revenue = Math.round(units * salePrice);
      const expenses = Math.round((units * costPerUnit) + fixedCosts);
      const profit = revenue - expenses;
      runningCumulative += profit;

      return {
        name: `${t('calc_month_prefix')} ${monthNumber}`,
        monthNumber,
        units,
        revenue,
        expenses,
        profit,
        cumulativeProfit: runningCumulative,
        startupCapitalLine: startupCapital,
      };
    });
  }, [monthlyUnits, salePrice, costPerUnit, fixedCosts, startupCapital, growthScenario, t]);

  const total6MonthRevenue = useMemo(
    () => projectionData.reduce((acc, p) => acc + p.revenue, 0),
    [projectionData]
  );
  const total6MonthProfit = useMemo(
    () => projectionData.reduce((acc, p) => acc + p.profit, 0),
    [projectionData]
  );
  const paybackMonthFound = useMemo(() => {
    const found = projectionData.find((p) => p.cumulativeProfit >= startupCapital);
    return found ? found.monthNumber : null;
  }, [projectionData, startupCapital]);

  const month6Profit = projectionData[projectionData.length - 1]?.profit || 0;
  const month1Profit = projectionData[0]?.profit || 1;
  const growthPercent = month1Profit > 0 
    ? Math.round(((month6Profit - month1Profit) / Math.abs(month1Profit)) * 100) 
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-profit-calculator"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {t('calc_modal_title')}
              </h2>
              <p className="text-xs text-stone-500">
                {t('calc_modal_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            aria-label={t('modal_close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Preset Project Selector */}
          <div className="p-3.5 bg-stone-100/80 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="preset-select" className="font-semibold text-stone-800 shrink-0">
              {t('calc_preset_label')}
            </label>
            <select
              id="preset-select"
              value={selectedProjectId}
              onChange={handleSelectChange}
              className="w-full sm:w-auto flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {localizedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Input Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sale Price */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  {t('calc_sale_price')}
                </label>
                <span className="font-bold text-emerald-700 text-sm">${salePrice}</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                {t('calc_sale_price_hint')}
              </span>
            </div>

            {/* Cost Per Unit */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  {t('calc_cost_unit')}
                </label>
                <span className="font-bold text-rose-600 text-sm">${costPerUnit}</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="0.5"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                {t('calc_cost_unit_hint')}
              </span>
            </div>

            {/* Monthly Units Sold */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  {t('calc_monthly_units')}
                </label>
                <span className="font-bold text-stone-900 text-sm">{monthlyUnits} {t('calc_unit_orders')}</span>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                step="1"
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                {language === 'ar' 
                  ? `معدل ${Math.round(monthlyUnits / 30 * 10) / 10} طلب يومياً`
                  : `Avg. ${Math.round(monthlyUnits / 30 * 10) / 10} orders per day`}
              </span>
            </div>

            {/* Fixed Costs */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  {t('calc_fixed_costs')}
                </label>
                <span className="font-bold text-stone-900 text-sm">${fixedCosts}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="w-full accent-stone-700 cursor-pointer"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                {t('calc_fixed_costs_hint')}
              </span>
            </div>

            {/* Startup Capital */}
            <div className="sm:col-span-2 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  {t('calc_startup_capital')}
                </label>
                <span className="font-bold text-stone-900 text-sm">${startupCapital}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={startupCapital}
                onChange={(e) => setStartupCapital(Number(e.target.value))}
                className="w-full accent-stone-700 cursor-pointer"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                {t('calc_startup_capital_hint')}
              </span>
            </div>

          </div>

          {/* Real-time Calculation Dashboard */}
          <div className="p-4 bg-emerald-950 text-white rounded-2xl shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {t('calc_results_title')}
              </span>
              <span className="text-xs bg-emerald-900 px-2.5 py-1 rounded-full border border-emerald-700 text-emerald-200">
                {t('calc_margin_label')} {profitMarginPercent}%
              </span>
            </div>

            {/* Main Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">{t('calc_gross_revenue')}</span>
                <span className="text-base font-bold text-white">${grossRevenue}</span>
              </div>

              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">{t('calc_total_expenses')}</span>
                <span className="text-base font-bold text-rose-300">${totalMonthlyExpenses}</span>
              </div>

              <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700">
                <span className="text-[11px] text-emerald-200 block mb-1">{t('calc_net_profit')}</span>
                <span className={`text-base font-extrabold ${netMonthlyProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                  ${netMonthlyProfit}
                </span>
              </div>

              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">{t('calc_breakeven')}</span>
                <span className="text-base font-bold text-amber-300">{breakevenUnits} {t('calc_sales_unit')}</span>
              </div>
            </div>

            {/* Narrative Insight */}
            <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200 leading-relaxed flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {netMonthlyProfit > 0 ? (
                  language === 'ar' ? (
                    <>
                      بتحقيق <strong>{monthlyUnits} مبيعات شهرياً</strong>، ستجني ربحاً صافياً قدره <strong>${netMonthlyProfit}</strong>، 
                      وتسترد رأس مالك المبدئي بالكامل خلال <strong>{paybackMonths} أشهر</strong> فقط.
                      تحتاج لبيع <strong>{breakevenUnits} وحدات شهرياً</strong> فقط لتغطية كافة مصاريفك دون أي خسارة!
                    </>
                  ) : (
                    <>
                      By achieving <strong>{monthlyUnits} sales per month</strong>, you will yield a net profit of <strong>${netMonthlyProfit}</strong>, 
                      and recover your setup capital within <strong>{paybackMonths} months</strong>.
                      You only need <strong>{breakevenUnits} units/month</strong> to break even and cover all overhead!
                    </>
                  )
                ) : (
                  language === 'ar' ? (
                    <>
                      تنبيه: التكاليف الحالية أعلى من الإيرادات. يُنصح برفع سعر البيع أو خفض التكلفة المباشرة لتأمين هامش ربح مريح.
                    </>
                  ) : (
                    <>
                      Notice: Operating expenses currently exceed revenues. Consider adjusting the retail price or lowering direct unit costs.
                    </>
                  )
                )}
              </span>
            </div>
          </div>

          {/* 6-Month Income Growth Projection Section with Recharts */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
            {/* Section Header & View Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    {t('calc_growth_title')}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      {t('calc_interactive_badge')}
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {t('calc_growth_subtitle')}
                  </p>
                </div>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto text-[11px]">
                <button
                  type="button"
                  onClick={() => setChartView('monthly')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    chartView === 'monthly'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('calc_tab_monthly')}
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('cumulative')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    chartView === 'cumulative'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('calc_tab_cumulative')}
                </button>
              </div>
            </div>

            {/* Growth Scenario Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
              <span className="font-semibold text-stone-700">{t('calc_scenario_label')}</span>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { key: 'conservative', label: t('calc_scenario_conservative') },
                    { key: 'realistic', label: t('calc_scenario_realistic') },
                    { key: 'aggressive', label: t('calc_scenario_aggressive') },
                  ] as const
                ).map((sc) => (
                  <button
                    key={sc.key}
                    type="button"
                    onClick={() => setGrowthScenario(sc.key)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      growthScenario === sc.key
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* The Recharts Graph Container */}
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'monthly' ? (
                  <AreaChart
                    data={projectionData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(val) => `$${val}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0]?.payload;
                          return (
                            <div className="bg-stone-900/95 text-white border border-stone-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2 backdrop-blur-md min-w-[175px]">
                              <div className="border-b border-stone-800 pb-1.5 flex items-center justify-between gap-3">
                                <span className="font-bold text-stone-100">{label}</span>
                                {dataPoint && (
                                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded font-medium">
                                    {dataPoint.units} {t('calc_sales_unit')}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                {payload.map((entry, idx) => (
                                  <div
                                    key={`entry-${idx}`}
                                    className="flex items-center justify-between gap-3 text-[11px]"
                                  >
                                    <span className="flex items-center gap-1.5 text-stone-300">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      {entry.name}
                                    </span>
                                    <span className="font-bold text-stone-100 font-mono dir-ltr">
                                      ${Number(entry.value || 0).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                      formatter={(val) => <span className="text-stone-700 text-xs">{val}</span>}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name={t('calc_chart_rev')}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name={t('calc_chart_profit')}
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#profitGrad)"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name={t('calc_chart_expenses')}
                      stroke="#f43f5e"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </AreaChart>
                ) : (
                  <AreaChart
                    data={projectionData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="cumProfitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(val) => `$${val}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0]?.payload;
                          return (
                            <div className="bg-stone-900/95 text-white border border-stone-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2 backdrop-blur-md min-w-[185px]">
                              <div className="border-b border-stone-800 pb-1.5 flex items-center justify-between gap-3">
                                <span className="font-bold text-stone-100">{label}</span>
                                {dataPoint && (
                                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded font-medium">
                                    {dataPoint.units} {t('calc_sales_unit')}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                {payload.map((entry, idx) => (
                                  <div
                                    key={`entry-${idx}`}
                                    className="flex items-center justify-between gap-3 text-[11px]"
                                  >
                                    <span className="flex items-center gap-1.5 text-stone-300">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      {entry.name}
                                    </span>
                                    <span className="font-bold text-stone-100 font-mono dir-ltr">
                                      ${Number(entry.value || 0).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                      formatter={(val) => <span className="text-stone-700 text-xs">{val}</span>}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeProfit"
                      name={t('calc_chart_cum_profit')}
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#cumProfitGrad)"
                    />
                    <Line
                      type="monotone"
                      dataKey="startupCapitalLine"
                      name={t('calc_chart_invested')}
                      stroke="#d97706"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Projection Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t('calc_stat_6m_profit')}</span>
                <span className={`text-sm font-bold ${total6MonthProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  ${total6MonthProfit.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t('calc_stat_6m_revenue')}</span>
                <span className="text-sm font-bold text-blue-700">
                  ${total6MonthRevenue.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t('calc_stat_month6')}</span>
                <span className="text-sm font-bold text-stone-800 flex items-center justify-center gap-1">
                  ${month6Profit.toLocaleString()}
                  {growthPercent > 0 && (
                    <span className="text-[9px] text-emerald-600 font-semibold flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      +{growthPercent}%
                    </span>
                  )}
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t('calc_stat_payback')}</span>
                <span className="text-sm font-bold text-amber-700 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {paybackMonthFound ? `${t('calc_month_prefix')} ${paybackMonthFound}` : t('calc_after_6m')}
                </span>
              </div>
            </div>

            {/* Projection Insight note */}
            <p className="text-[11px] text-stone-500 leading-relaxed bg-stone-50/70 p-2.5 rounded-lg border border-stone-200/60">
              {language === 'ar' ? (
                <>💡 <strong>كيف تبنى التوقعات:</strong> تبدأ بنسبة انطلاق أولية في الشهر الأول (~50% من طاقتك المستهدفة)، ثم تتصاعد تدريجياً بفعل توصيات الزبائن (Word of Mouth)، تكرار الشراء من العملاء الدائمين، وتطوير أساليب التسويق.</>
              ) : (
                <>💡 <strong>How projections work:</strong> You start with an initial ramp-up in Month 1 (~50% of monthly target capacity), steadily increasing through organic word-of-mouth, recurring repeat clients, and refined customer acquisition.</>
              )}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors"
          >
            {t('calc_close_btn')}
          </button>
        </div>

      </div>
    </div>
  );
};
