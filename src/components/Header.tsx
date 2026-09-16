import React from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Calculator, 
  Bot, 
  Compass, 
  TrendingUp,
  Zap,
  Radar,
  Gamepad2 
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenCalculator: () => void;
  onOpenAiPlanner: () => void;
  onOpenQuiz: () => void;
  onOpenEmergencyCash: () => void;
  onOpenAssetScanner: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onOpenFavorites,
  onOpenCalculator,
  onOpenAiPlanner,
  onOpenQuiz,
  onOpenEmergencyCash,
  onOpenAssetScanner,
  onOpenSimulator,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-700/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  أفكار مشاريع سهلة ومربحة
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    دليل 2026
                  </span>
                </h1>
                <p className="text-xs text-stone-500">
                  مشاريع مجربة، منخفضة التكاليف، وهوامش ربح تفوق 60%
                </p>
              </div>
            </div>

            {/* Mobile Actions Quick Bar */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="btn-mobile-emergency"
                onClick={onOpenEmergencyCash}
                className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                aria-label="أحتاج دخلاً هذا الأسبوع"
              >
                <Zap className="w-5 h-5" />
              </button>
              <button
                id="btn-mobile-favorites"
                onClick={onOpenFavorites}
                className="relative p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="المفضلة"
              >
                <Bookmark className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="w-full md:max-w-md relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن فكرة، مهارة، أو نوع مشروع (مثل: من المنزل، بدون رأس مال)..."
              className="w-full pr-10 pl-4 py-2 text-sm bg-stone-100/90 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Interactive Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              id="btn-nav-emergency"
              onClick={onOpenEmergencyCash}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <Zap className="w-4 h-4 text-rose-600" />
              أحتاج دخلاً هذا الأسبوع
            </button>

            <button
              id="btn-nav-asset-scanner"
              onClick={onOpenAssetScanner}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
            >
              <Radar className="w-4 h-4 text-indigo-600" />
              ماسح الأصول
            </button>

            <button
              id="btn-nav-simulator"
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-violet-900 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors"
            >
              <Gamepad2 className="w-4 h-4 text-violet-600" />
              محاكي المشروع
            </button>

            <button
              id="btn-nav-quiz"
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              اختبار المشروع الأنسب
            </button>

            <button
              id="btn-nav-calc"
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200"
            >
              <Calculator className="w-4 h-4 text-emerald-700" />
              حاسبة الأرباح
            </button>

            <button
              id="btn-nav-ai"
              onClick={onOpenAiPlanner}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              دراسة جدوى بالذكاء الاصطناعي
            </button>

            <button
              id="btn-nav-favorites"
              onClick={onOpenFavorites}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200"
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              المفضلة
              {favoritesCount > 0 && (
                <span className="w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
