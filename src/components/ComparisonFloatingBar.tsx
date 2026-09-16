import React from 'react';
import { Scale, ArrowLeftRight, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ProjectIdea } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ComparisonFloatingBarProps {
  selectedProjects: ProjectIdea[];
  onOpenComparison: () => void;
  onClearComparison: () => void;
  onRemoveProject: (id: string) => void;
}

export const ComparisonFloatingBar: React.FC<ComparisonFloatingBarProps> = ({
  selectedProjects,
  onOpenComparison,
  onClearComparison,
  onRemoveProject,
}) => {
  const { t, isRTL } = useLanguage();

  if (selectedProjects.length === 0) return null;

  const count = selectedProjects.length;
  const canCompare = count >= 2;

  return (
    <aside
      aria-label={t('compare_drawer_title')}
      id="bar-comparison-dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-stone-700/80 p-3 sm:px-4 sm:py-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left info & chips */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scale className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-100">
                {t('compare_bar_title')} {count} {count === 1 ? t('compare_project_singular') : t('compare_projects_plural')}
              </span>
              {!canCompare && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  {t('compare_bar_min')}
                </span>
              )}
            </div>

            {/* Project miniature chips */}
            <div className="flex items-center gap-1.5 mt-1 overflow-x-auto scrollbar-none max-w-xs sm:max-w-sm">
              {selectedProjects.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 whitespace-nowrap"
                >
                  <span className="truncate max-w-[90px]">{p.title}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveProject(p.id)}
                    className="text-stone-400 hover:text-white"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClearComparison}
            className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            {t('compare_clear_all')}
          </button>

          <button
            type="button"
            id="btn-dock-open-comparison"
            onClick={onOpenComparison}
            disabled={!canCompare}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              canCompare
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            }`}
          >
            <span>{t('compare_bar_view_btn')}</span>
            {isRTL ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
