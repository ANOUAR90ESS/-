import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Key, 
  Calculator, 
  Sparkles, 
  Users, 
  Clock, 
  MapPin,
  Bookmark,
  Scale,
  Check
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { CalculatedRating } from '../data/ratingsData';
import { StarRating } from './StarRating';
import { useLanguage } from '../context/LanguageContext';

interface ProjectDetailModalProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCalculatorWithProject: (project: ProjectIdea) => void;
  onOpenAiPlannerWithProject: (project: ProjectIdea) => void;
  ratingInfo?: CalculatedRating;
  onRate?: (projectId: string, score: number) => void;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenCalculatorWithProject,
  onOpenAiPlannerWithProject,
  ratingInfo,
  onRate,
  isSelectedForCompare = false,
  onToggleCompare,
}) => {
  const { t, isRTL, getLocalizedProject } = useLanguage();
  if (!isOpen || !project) return null;
  const activeProject = getLocalizedProject(project);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-project-details"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-start justify-between gap-4 bg-stone-50/50">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                {activeProject.badge}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-stone-200/70 text-stone-700">
                {t('modal_ease')} {activeProject.easeLevel}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-100 text-teal-800">
                {t('modal_profit_margin')} {activeProject.profitMargin}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              {activeProject.title}
            </h2>

            {/* Rating Display & Interactive stars in modal */}
            {ratingInfo && (
              <div className="pt-0.5">
                <StarRating
                  rating={ratingInfo.average}
                  count={ratingInfo.count}
                  userRating={ratingInfo.userRating}
                  onRate={onRate ? (score) => onRate(activeProject.id, score) : undefined}
                  size="md"
                  interactive={!!onRate}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(activeProject.id)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isSelectedForCompare
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title={isSelectedForCompare ? t('compare_clear_btn') : t('card_compare_add')}
              >
                {isSelectedForCompare ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Scale className="w-3.5 h-3.5" />
                )}
                <span>{isSelectedForCompare ? t('card_compare_selected') : t('card_compare_add')}</span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(activeProject.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title={isFavorite ? t('card_fav_remove') : t('card_fav_add')}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label={t('modal_close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-stone-700">
          
          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-100/70 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block mb-0.5">{t('modal_approx_capital')}</span>
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {activeProject.capitalRange.label}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">{t('modal_expected_profit')}</span>
              <span className="font-bold text-emerald-800 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {activeProject.monthlyProfitRange.label}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">{t('modal_location_hours')}</span>
              <span className="font-semibold text-stone-800 block">
                {activeProject.workLocation} ({activeProject.dailyHours} {t('card_daily_hours')})
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">{t('modal_speed')}</span>
              <span className="font-semibold text-stone-800 block">
                {t('modal_within')} {activeProject.timeToRevenue}
              </span>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('modal_why_easy')}
            </h3>
            <p className="leading-relaxed text-stone-600">
              {activeProject.detailedDescription}
            </p>
          </div>

          {/* Unit Economics Simulation */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <h4 className="font-bold text-emerald-950 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                {t('modal_unit_economics_title')}
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenCalculatorWithProject(activeProject);
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                {t('modal_calc_link')} &rarr;
              </button>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed mb-3">
              {activeProject.unitEconomics.exampleExplanation}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">{t('modal_unit_cost')}</span>
                <span className="font-bold text-stone-900">${activeProject.unitEconomics.costPerUnit}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">{t('modal_sale_price')}</span>
                <span className="font-bold text-emerald-700">${activeProject.unitEconomics.salePrice}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">{t('modal_unit_profit')}</span>
                <span className="font-bold text-emerald-800">
                  ${activeProject.unitEconomics.salePrice - activeProject.unitEconomics.costPerUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('modal_requirements_title')}
            </h3>
            <ul className="space-y-2">
              {activeProject.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Steps */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5">
              {t('modal_steps_title')}
            </h3>
            <div className="space-y-2.5">
              {activeProject.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing & Getting First Clients */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-700" />
              {t('modal_marketing_title')}
            </h3>
            <div className="space-y-2">
              {activeProject.marketingStrategy.map((strat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{strat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips & Risk Mitigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <Key className="w-4 h-4 text-amber-700" />
                {t('modal_secret_title')}
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">
                {activeProject.secretToSuccess}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                {t('modal_risks_title')}
              </span>
              <p className="text-xs text-rose-950 leading-relaxed">
                {activeProject.potentialRisksAndFix}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCalculatorWithProject(activeProject);
              }}
              className="px-4 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-emerald-700" />
              {t('modal_btn_calc')}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAiPlannerWithProject(activeProject);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            {t('modal_btn_ai')}
          </button>
        </div>

      </div>
    </div>
  );
};
