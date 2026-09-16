import React from 'react';
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  Calculator, 
  Sparkles, 
  Zap, 
  Scale, 
  Check 
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { CalculatedRating } from '../data/ratingsData';
import { StarRating } from './StarRating';
import { useLanguage } from '../context/LanguageContext';

interface ProjectCardProps {
  project: ProjectIdea;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (project: ProjectIdea) => void;
  onCalculate: (project: ProjectIdea) => void;
  onGeneratePlan: (project: ProjectIdea) => void;
  ratingInfo: CalculatedRating;
  onRate: (projectId: string, score: number) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onCalculate,
  onGeneratePlan,
  ratingInfo,
  onRate,
  isSelectedForCompare,
  onToggleCompare,
}) => {
  const { t, isRTL } = useLanguage();

  const getEaseBadge = (ease: string) => {
    switch (ease) {
      case 'سهل جداً':
      case 'Very Easy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'سهل':
      case 'Easy':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group ${
        isSelectedForCompare
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-300'
      }`}
    >
      {/* Top Header Card */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getEaseBadge(project.easeLevel)}`}>
              {project.easeLevel}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-stone-100 text-stone-700 border border-stone-200">
              {t('margin_prefix')} {project.profitMargin}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Toggle Button */}
            <button
              type="button"
              id={`btn-compare-${project.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(project.id);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                isSelectedForCompare
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title={isSelectedForCompare ? t('compare_clear_btn') : t('card_compare_add')}
            >
              {isSelectedForCompare ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Scale className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px]">{isSelectedForCompare ? t('card_compare_selected') : t('card_compare_add')}</span>
            </button>

            {/* Favorite Bookmark Button */}
            <button
              id={`btn-fav-${project.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(project.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
              }`}
              title={isFavorite ? t('card_fav_remove') : t('card_fav_add')}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug mb-1.5">
          {project.title}
        </h3>

        {/* Interactive Star Rating */}
        <div className="mb-2.5 pb-1">
          <StarRating
            rating={ratingInfo.average}
            count={ratingInfo.count}
            userRating={ratingInfo.userRating}
            onRate={(score) => onRate(project.id, score)}
            size="sm"
            interactive={true}
          />
        </div>

        {/* Short Summary */}
        <p className="text-xs leading-relaxed text-stone-600 line-clamp-2 mb-4">
          {project.shortDescription}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50/80 rounded-xl border border-stone-100 mb-3 text-xs">
          <div>
            <span className="text-[11px] text-stone-500 block mb-0.5">{t('card_capital_req')}</span>
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-stone-400" />
              {project.capitalRange.label}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block mb-0.5">{t('card_monthly_profit')}</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              {project.monthlyProfitRange.label}
            </span>
          </div>
        </div>

        {/* Attributes Tags */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400" />
            {project.workLocation}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            {project.dailyHours} {t('card_daily_hours')}
          </span>
          <span className="text-emerald-700 font-medium">
            {t('card_first_revenue')} {project.timeToRevenue}
          </span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          id={`btn-details-${project.id}`}
          onClick={() => onViewDetails(project)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-950 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-center gap-1 shadow-2xs"
        >
          <span>{t('card_view_study')}</span>
          {isRTL ? (
            <ChevronLeft className="w-3.5 h-3.5 text-emerald-700" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            id={`btn-calc-${project.id}`}
            onClick={() => onCalculate(project)}
            title={t('card_btn_calc_title')}
            className="p-2 text-stone-600 hover:text-emerald-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors"
          >
            <Calculator className="w-4 h-4" />
          </button>

          <button
            id={`btn-plan-${project.id}`}
            onClick={() => onGeneratePlan(project)}
            title={t('card_btn_ai_title')}
            className="p-2 text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-200 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
