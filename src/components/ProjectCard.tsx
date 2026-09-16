import React from 'react';
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  Bookmark, 
  ChevronLeft, 
  Percent, 
  Calculator, 
  Sparkles,
  Zap
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectCardProps {
  project: ProjectIdea;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (project: ProjectIdea) => void;
  onCalculate: (project: ProjectIdea) => void;
  onGeneratePlan: (project: ProjectIdea) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onCalculate,
  onGeneratePlan,
}) => {
  const getEaseBadge = (ease: string) => {
    switch (ease) {
      case 'سهل جداً':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'سهل':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-300"
    >
      {/* Top Header Card */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getEaseBadge(project.easeLevel)}`}>
              {project.easeLevel}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-stone-100 text-stone-700 border border-stone-200">
              هامش الربح {project.profitMargin}
            </span>
          </div>

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
            title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2">
          {project.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs leading-relaxed text-stone-600 line-clamp-2 mb-4">
          {project.shortDescription}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50/80 rounded-xl border border-stone-100 mb-3 text-xs">
          <div>
            <span className="text-[11px] text-stone-500 block mb-0.5">رأس المال المطلوب</span>
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-stone-400" />
              {project.capitalRange.label}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block mb-0.5">الربح المتوقع شهرياً</span>
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
            {project.dailyHours} يومياً
          </span>
          <span className="text-emerald-700 font-medium">
            أول أرباح: {project.timeToRevenue}
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
          <span>دراسة الفكرة وخطة البدء</span>
          <ChevronLeft className="w-3.5 h-3.5 text-emerald-700" />
        </button>

        <div className="flex items-center gap-1">
          <button
            id={`btn-calc-${project.id}`}
            onClick={() => onCalculate(project)}
            title="حساب العائد وصافي الأرباح بالأرقام"
            className="p-2 text-stone-600 hover:text-emerald-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors"
          >
            <Calculator className="w-4 h-4" />
          </button>

          <button
            id={`btn-plan-${project.id}`}
            onClick={() => onGeneratePlan(project)}
            title="خطة عمل مخصصة بالذكاء الاصطناعي"
            className="p-2 text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-200 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
