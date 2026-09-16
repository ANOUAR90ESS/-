import React, { useMemo } from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  Sparkles, 
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { CalculatedRating } from '../data/ratingsData';
import { StarRating } from './StarRating';
import { useLanguage } from '../context/LanguageContext';

interface ProjectComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjects: ProjectIdea[];
  allProjects: ProjectIdea[];
  onRemoveProject: (id: string) => void;
  onAddProject: (id: string) => void;
  onClearAll: () => void;
  onOpenCalculator: (project: ProjectIdea) => void;
  onOpenDetails: (project: ProjectIdea) => void;
  onOpenAiPlan: (project: ProjectIdea) => void;
  ratings: Record<string, CalculatedRating>;
}

export const ProjectComparisonDrawer: React.FC<ProjectComparisonDrawerProps> = ({
  isOpen,
  onClose,
  selectedProjects,
  allProjects,
  onRemoveProject,
  onAddProject,
  onClearAll,
  onOpenCalculator,
  onOpenDetails,
  onOpenAiPlan,
  ratings,
}) => {
  const { t, isRTL, language } = useLanguage();

  if (!isOpen) return null;

  // Unselected projects that can be added
  const availableToAdd = useMemo(() => {
    const selectedIds = new Set(selectedProjects.map((p) => p.id));
    return allProjects.filter((p) => !selectedIds.has(p.id));
  }, [selectedProjects, allProjects]);

  // Compute best in class metrics
  const minCapital = useMemo(() => {
    if (selectedProjects.length === 0) return 0;
    return Math.min(...selectedProjects.map((p) => p.capitalRange.min));
  }, [selectedProjects]);

  const maxProfit = useMemo(() => {
    if (selectedProjects.length === 0) return 0;
    return Math.max(...selectedProjects.map((p) => p.monthlyProfitRange.max));
  }, [selectedProjects]);

  const easiestEase = useMemo(() => {
    const easeRanks: Record<string, number> = {
      'سهل جداً': 3,
      'Very Easy': 3,
      'سهل': 2,
      'Easy': 2,
      'متوسط': 1,
      'Moderate': 1,
    };
    if (selectedProjects.length === 0) return '';
    let best = selectedProjects[0];
    let bestRank = easeRanks[best.easeLevel] || 0;
    for (const p of selectedProjects) {
      const rank = easeRanks[p.easeLevel] || 0;
      if (rank > bestRank) {
        best = p;
        bestRank = rank;
      }
    }
    return best.id;
  }, [selectedProjects]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div 
        id="drawer-project-comparison"
        className={`relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden ${isRTL ? 'border-r' : 'border-l'} border-stone-200`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  {t('compare_drawer_title')}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedProjects.length} {t('compare_projects_selected')}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {t('compare_drawer_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedProjects.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('compare_clear_all')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label={t('modal_close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Add Project Bar if there are remaining projects */}
        {availableToAdd.length > 0 && selectedProjects.length < 5 && (
          <div className="px-4 py-2.5 bg-stone-100/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600 font-medium">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('compare_add_another')}</span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onAddProject(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 max-w-xs"
            >
              <option value="" disabled>{t('compare_select_placeholder')}</option>
              {availableToAdd.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.capitalRange.label})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Comparison Content */}
        {selectedProjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {t('compare_empty_title')}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mb-4">
              {t('compare_empty_desc')}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {t('compare_back_btn')}
            </button>
          </div>
        ) : selectedProjects.length === 1 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50/50">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {t('compare_need_two_title')}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mb-4 leading-relaxed">
              {language === 'ar' ? (
                <>لقد اخترت <strong>"{selectedProjects[0].title}"</strong>. اختر مشروعاً إضافياً على الأقل من القائمة المنسدلة أعلاه أو من الصفحة الرئيسية لتفعيل جدول المقارنة التفصيلي.</>
              ) : (
                <>You selected <strong>"{selectedProjects[0].title}"</strong>. Select at least one more business to activate the side-by-side comparison table.</>
              )}
            </p>
            {availableToAdd.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                {availableToAdd.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onAddProject(p.id)}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-emerald-400 rounded-xl text-xs font-medium text-stone-700 hover:text-emerald-800 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Quick Highlights Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-200/80 text-emerald-900 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-emerald-800 font-semibold block">{t('compare_min_capital')}</span>
                  <span className="font-bold text-emerald-950">
                    {selectedProjects.find((p) => p.capitalRange.min === minCapital)?.title}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-200/80 text-blue-900 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-blue-800 font-semibold block">{t('compare_max_profit')}</span>
                  <span className="font-bold text-blue-950">
                    {selectedProjects.find((p) => p.monthlyProfitRange.max === maxProfit)?.title}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-amber-800 font-semibold block">{t('compare_easiest')}</span>
                  <span className="font-bold text-amber-950">
                    {selectedProjects.find((p) => p.id === easiestEase)?.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Side-by-Side Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-2xs">
              <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'} border-collapse min-w-[650px]`}>
                <thead>
                  <tr className="bg-stone-50/90 border-b border-stone-200">
                    <th className={`p-3.5 font-bold text-stone-500 w-36 sm:w-44 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('compare_criteria')}
                    </th>
                    {selectedProjects.map((project) => (
                      <th key={project.id} className={`p-3.5 font-bold text-stone-900 ${isRTL ? 'text-right' : 'text-left'} min-w-[200px]`}>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                              {project.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveProject(project.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-200/60 transition-colors shrink-0"
                              title={t('compare_remove_title')}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600 border border-stone-200">
                            {project.badge}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {/* Row 1: Startup Capital */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{t('compare_row_capital')}</span>
                    </td>
                    {selectedProjects.map((p) => {
                      const isBest = p.capitalRange.min === minCapital;
                      return (
                        <td key={p.id} className={`p-3.5 ${isBest ? 'bg-emerald-50/30 font-bold' : ''}`}>
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-stone-900 block">
                              {p.capitalRange.label}
                            </span>
                            {isBest && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                                <Award className="w-3 h-3" />
                                {t('compare_badge_lowest_capital')}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Expected Monthly Profit */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>{t('compare_row_profit')}</span>
                    </td>
                    {selectedProjects.map((p) => {
                      const isBest = p.monthlyProfitRange.max === maxProfit;
                      const annualMin = p.monthlyProfitRange.min * 12;
                      const annualMax = p.monthlyProfitRange.max * 12;
                      return (
                        <td key={p.id} className={`p-3.5 ${isBest ? 'bg-blue-50/30 font-bold' : ''}`}>
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-emerald-700 block">
                              {p.monthlyProfitRange.label}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {t('compare_annual_est')}: ${annualMin.toLocaleString()} - ${annualMax.toLocaleString()}
                            </span>
                            {isBest && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-md">
                                <Award className="w-3 h-3" />
                                {t('compare_badge_highest_profit')}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: Difficulty / Ease */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{t('compare_row_ease')}</span>
                    </td>
                    {selectedProjects.map((p) => {
                      const isEasiest = p.id === easiestEase;
                      const isVeryEasy = p.easeLevel === 'سهل جداً' || p.easeLevel === 'Very Easy';
                      const isEasy = p.easeLevel === 'سهل' || p.easeLevel === 'Easy';
                      const easeClass = 
                        isVeryEasy
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : isEasy
                          ? 'bg-teal-100 text-teal-800 border-teal-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200';
                      return (
                        <td key={p.id} className={`p-3.5 ${isEasiest ? 'bg-amber-50/30' : ''}`}>
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${easeClass}`}>
                              {p.easeLevel}
                            </span>
                            {isEasiest && (
                              <span className="block text-[10px] text-amber-700 font-semibold">
                                {t('compare_badge_easiest')}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 4: Speed to first revenue */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <span>{t('compare_row_speed')}</span>
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 font-semibold text-stone-800">
                        {p.timeToRevenue}
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Community Rating */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60">
                      {t('compare_row_rating')}
                    </td>
                    {selectedProjects.map((p) => {
                      const ratingInfo = ratings[p.id] || { average: 4.7, count: 40, userRating: null };
                      return (
                        <td key={p.id} className="p-3.5">
                          <StarRating
                            rating={ratingInfo.average}
                            count={ratingInfo.count}
                            userRating={ratingInfo.userRating}
                            interactive={false}
                            size="sm"
                          />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 6: Profit Margin */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60">
                      {t('compare_row_margin')}
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 font-bold text-teal-800">
                        {p.profitMargin}
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Location & Daily Hours */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      <span>{t('compare_row_location_hours')}</span>
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 text-stone-600">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-stone-800 block">{p.workLocation}</span>
                          <span className="text-[11px] text-stone-500 block">{p.dailyHours} {t('card_daily_hours')}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 8: Unit Economics */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60">
                      {t('compare_row_unit_economics')}
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 text-stone-600">
                        <div className="space-y-1 bg-stone-50 p-2 rounded-lg border border-stone-200/80">
                          <div className="font-semibold text-stone-800">{p.unitEconomics.unitName}</div>
                          <div className="text-[11px] text-stone-600">
                            {language === 'ar' ? (
                              `تكلفة: $${p.unitEconomics.costPerUnit} • بيع: $${p.unitEconomics.salePrice}`
                            ) : (
                              `Cost: $${p.unitEconomics.costPerUnit} • Sale: $${p.unitEconomics.salePrice}`
                            )}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            {language === 'ar' ? (
                              `المطلوب شهرياً: ${p.unitEconomics.unitsPerMonth} عملية بيع`
                            ) : (
                              `Monthly target: ${p.unitEconomics.unitsPerMonth} units`
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 9: Requirements */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60">
                      {t('compare_row_requirements')}
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 text-stone-600">
                        <ul className="space-y-1">
                          {p.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Row 10: Secret to Success */}
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3.5 font-semibold text-stone-700 bg-stone-50/60">
                      {t('compare_row_secret')}
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5 text-stone-600">
                        <p className="text-[11px] leading-relaxed italic bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 text-stone-800">
                          "{p.secretToSuccess}"
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Row 11: Action CTA Buttons */}
                  <tr className="bg-stone-50/80">
                    <td className="p-3.5 font-semibold text-stone-700">
                      {t('compare_row_actions')}
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3.5">
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenDetails(p);
                            }}
                            className="w-full py-1.5 px-2 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-800 hover:text-emerald-900 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <span>{t('compare_btn_details')}</span>
                            {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCalculator(p);
                            }}
                            className="w-full py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Calculator className="w-3 h-3 text-emerald-600" />
                            <span>{t('compare_btn_calc')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenAiPlan(p);
                            }}
                            className="w-full py-1.5 px-2 bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>{t('compare_btn_ai')}</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Insight Note */}
            <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 border border-stone-200 flex items-center justify-between gap-3">
              <p>
                {t('compare_tip')}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-stone-800 text-white font-bold rounded-lg hover:bg-stone-900 text-xs shrink-0 transition-colors"
              >
                {t('compare_close_btn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
