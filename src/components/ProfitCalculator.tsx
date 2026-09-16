import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Target, 
  Clock, 
  RefreshCcw,
  Check
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProject ? initialProject.id : PROJECT_IDEAS[0].id
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
    const found = PROJECT_IDEAS.find((p) => p.id === id);
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
    : 'غير متاح';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-profit-calculator"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                حاسبة الأرباح ونقطة التعادل التفاعلية
              </h2>
              <p className="text-xs text-stone-500">
                احسب إيراداتك، تكاليفك، وصافي أرباحك الواقعية قبل البدء
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Preset Project Selector */}
          <div className="p-3.5 bg-stone-100/80 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="preset-select" className="font-semibold text-stone-800 shrink-0">
              تعبئة تلقائية من أفكار المشاريع:
            </label>
            <select
              id="preset-select"
              value={selectedProjectId}
              onChange={handleSelectChange}
              className="w-full sm:w-auto flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PROJECT_IDEAS.map((p) => (
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
                  سعر بيع الوحدة أو الخدمة ($)
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
                ما يدفعه العميل مقابل المنتج أو الخدمة
              </span>
            </div>

            {/* Cost Per Unit */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  تكلفة الوحدة المباشرة ($)
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
                المواد الخام، التغليف، أو الشحن المباشر
              </span>
            </div>

            {/* Monthly Units Sold */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  المبيعات الشهرية المتوقعة
                </label>
                <span className="font-bold text-stone-900 text-sm">{monthlyUnits} وحدة/طلب</span>
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
                معدل {Math.round(monthlyUnits / 30 * 10) / 10} طلب يومياً
              </span>
            </div>

            {/* Fixed Costs */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  المصاريف الثابتة شهرياً ($)
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
                اشتراكات إنترنت، إعلانات ممولة، هاتف
              </span>
            </div>

            {/* Startup Capital */}
            <div className="sm:col-span-2 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-800">
                  رأس المال المبدئي للتجهيز ($)
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
                أدوات التأسيس الأولية (معدات، مخزون تجريبي، هوية بصرية)
              </span>
            </div>

          </div>

          {/* Real-time Calculation Dashboard */}
          <div className="p-4 bg-emerald-950 text-white rounded-2xl shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                النتائج المالية والجدوى المتوقعة
              </span>
              <span className="text-xs bg-emerald-900 px-2.5 py-1 rounded-full border border-emerald-700 text-emerald-200">
                هامش الربح الصافي: {profitMarginPercent}%
              </span>
            </div>

            {/* Main Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">إجمالي الإيرادات</span>
                <span className="text-base font-bold text-white">${grossRevenue}</span>
              </div>

              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">إجمالي المصاريف</span>
                <span className="text-base font-bold text-rose-300">${totalMonthlyExpenses}</span>
              </div>

              <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700">
                <span className="text-[11px] text-emerald-200 block mb-1">صافي الربح الشهري</span>
                <span className={`text-base font-extrabold ${netMonthlyProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                  ${netMonthlyProfit}
                </span>
              </div>

              <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/50">
                <span className="text-[11px] text-emerald-300 block mb-1">نقطة التعادل</span>
                <span className="text-base font-bold text-amber-300">{breakevenUnits} مبيعات</span>
              </div>
            </div>

            {/* Narrative Insight */}
            <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200 leading-relaxed flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {netMonthlyProfit > 0 ? (
                  <>
                    بتحقيق <strong>{monthlyUnits} مبيعات شهرياً</strong>، ستجني ربحاً صافياً قدره <strong>${netMonthlyProfit}</strong>، 
                    وتسترد رأس مالك المبدئي بالكامل خلال <strong>{paybackMonths} أشهر</strong> فقط.
                    تحتاج لبيع <strong>{breakevenUnits} وحدات شهرياً</strong> فقط لتغطية كافة مصاريفك دون أي خسارة!
                  </>
                ) : (
                  <>
                    تنبيه: التكاليف الحالية أعلى من الإيرادات. يُنصح برفع سعر البيع أو خفض التكلفة المباشرة لتأمين هامش ربح مريح.
                  </>
                )}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors"
          >
            إغلاق الحاسبة
          </button>
        </div>

      </div>
    </div>
  );
};
