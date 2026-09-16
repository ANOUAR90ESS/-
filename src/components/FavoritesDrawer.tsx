import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ChevronLeft, 
  Calculator, 
  Sparkles, 
  DollarSign 
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onSelectProject: (project: ProjectIdea) => void;
  onOpenCalculatorWithProject: (project: ProjectIdea) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onClearFavorites,
  onSelectProject,
  onOpenCalculatorWithProject,
}) => {
  if (!isOpen) return null;

  const favoriteProjects = PROJECT_IDEAS.filter((p) => favorites.includes(p.id));

  // Compute minimum combined profit potential
  const minCombinedProfit = favoriteProjects.reduce(
    (acc, cur) => acc + cur.monthlyProfitRange.min,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        id="drawer-favorites"
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-r border-stone-200 animate-slideLeft"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-500" />
            <h2 className="text-base font-bold text-stone-900">
              المشاريع المحفوظة ({favoriteProjects.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {favoriteProjects.length > 0 && (
              <button
                onClick={onClearFavorites}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="مسح الكل"
              >
                مسح الكل
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs text-stone-700">
          {favoriteProjects.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="font-bold text-stone-800 text-sm mb-1">
                لا توجد مشاريع في المفضلة حتى الآن
              </p>
              <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
                اضغط على أيقونة الإشارة المرجعية على أي فكرة مشروع لحفظها هنا ومقارنتها لاحقاً.
              </p>
            </div>
          ) : (
            <>
              {/* Potential Metric Box */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 block">إجمالي العائد المحتمل شهرياً:</span>
                  <span className="font-extrabold text-emerald-950 text-sm">
                    يفوق ${minCombinedProfit} شهرياً
                  </span>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg">
                  {favoriteProjects.length} أفكار
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {favoriteProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/90 hover:border-emerald-300 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-stone-900 text-xs leading-snug">
                        {proj.title}
                      </h4>
                      <button
                        onClick={() => onToggleFavorite(proj.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="إزالة من المفضلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>رأس المال: {proj.capitalRange.label}</span>
                      <span className="font-bold text-emerald-700">
                        {proj.monthlyProfitRange.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProject(proj);
                        }}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg font-semibold text-stone-800 text-[11px] flex items-center justify-center gap-1"
                      >
                        <span>التفاصيل</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenCalculatorWithProject(proj);
                        }}
                        className="p-1.5 bg-white hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-700 rounded-lg text-[11px]"
                        title="حساب الأرباح"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
