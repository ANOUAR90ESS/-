import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Bot, 
  Compass, 
  Calculator,
  ArrowUpDown,
  Zap,
  Radar,
  Gamepad2,
  Scale,
  Star,
  Camera
} from 'lucide-react';
import { ProjectIdea, ProjectCategory } from './types';
import { PROJECT_IDEAS, CATEGORIES_CONFIG } from './data/projectsData';
import { calculateProjectRating, CalculatedRating } from './data/ratingsData';
import { useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProfitCalculator } from './components/ProfitCalculator';
import { AiPlanGenerator } from './components/AiPlanGenerator';
import { IdeaMatchmakerQuiz } from './components/IdeaMatchmakerQuiz';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { EmergencyCashMode } from './components/EmergencyCashMode';
import { AssetScanner } from './components/AssetScanner';
import { BusinessSimulator } from './components/BusinessSimulator';
import { ProjectComparisonDrawer } from './components/ProjectComparisonDrawer';
import { ComparisonFloatingBar } from './components/ComparisonFloatingBar';
import { ProductPhotoStudio } from './components/ProductPhotoStudio';

export default function App() {
  const { t, isRTL, language, getLocalizedProject } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [sortBy, setSortBy] = useState<'profit' | 'capital' | 'speed' | 'rating'>('rating');

  // Modals & Drawers state
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<ProjectIdea | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const [selectedProjectForCalc, setSelectedProjectForCalc] = useState<ProjectIdea | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);

  const [selectedProjectForAi, setSelectedProjectForAi] = useState<ProjectIdea | null>(null);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [aiSeedTitle, setAiSeedTitle] = useState<string | null>(null);

  // Localized projects list
  const localizedProjects = useMemo(() => {
    return PROJECT_IDEAS.map((p) => getLocalizedProject(p));
  }, [getLocalizedProject, language]);

  // Ratings state persisted in localStorage
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('user_project_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleRateProject = (projectId: string, score: number) => {
    setUserRatings((prev) => {
      const updated = { ...prev, [projectId]: score };
      try {
        localStorage.setItem('user_project_ratings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Calculated ratings map for all projects
  const calculatedRatings = useMemo(() => {
    const map: Record<string, CalculatedRating> = {};
    for (const project of PROJECT_IDEAS) {
      map[project.id] = calculateProjectRating(project.id, userRatings);
    }
    return map;
  }, [userRatings]);

  // Comparison state (IDs of projects selected for comparison)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('selected_compare_projects');
      return saved ? JSON.parse(saved) : ['social-media-management', 'gift-boxes-packaging'];
    } catch {
      return ['social-media-management', 'gift-boxes-packaging'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('selected_compare_projects', JSON.stringify(selectedForCompare));
    } catch (e) {
      console.error(e);
    }
  }, [selectedForCompare]);

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 5) {
        alert(t('compare_max_alert'));
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((item) => item !== id));
  };

  const handleAddToCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 5) {
        alert(t('compare_max_alert'));
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const selectedProjectsForCompare = useMemo(() => {
    return selectedForCompare
      .map((id) => localizedProjects.find((p) => p.id === id))
      .filter((p): p is ProjectIdea => Boolean(p));
  }, [selectedForCompare, localizedProjects]);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_project_ideas');
      return saved ? JSON.parse(saved) : ['social-media-management', 'digital-products-templates'];
    } catch {
      return ['social-media-management', 'digital-products-templates'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('saved_project_ideas', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  // Category labels map
  const categoryLabels: Record<string, string> = {
    all: t('cat_all'),
    'zero-capital': t('cat_zero_capital'),
    'home-based': t('cat_home_based'),
    digital: t('cat_digital'),
    services: t('cat_services'),
    'food-crafts': t('cat_food_crafts'),
    'micro-commerce': t('cat_micro_commerce'),
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return localizedProjects.filter((p) => {
      // Category filter
      if (selectedCategory === 'zero-capital' && p.capitalRange.min > 0) return false;
      if (selectedCategory === 'home-based' && !p.workLocation.includes('المنزل') && !p.workLocation.toLowerCase().includes('home')) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'zero-capital' && selectedCategory !== 'home-based') {
        if (p.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.shortDescription.toLowerCase().includes(q) || p.detailedDescription.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const inReqs = p.requirements.some((r) => r.toLowerCase().includes(q));
        return inTitle || inDesc || inTags || inReqs;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        const rA = calculatedRatings[a.id]?.average || 0;
        const rB = calculatedRatings[b.id]?.average || 0;
        if (rB !== rA) return rB - rA;
        return (calculatedRatings[b.id]?.count || 0) - (calculatedRatings[a.id]?.count || 0);
      }
      if (sortBy === 'profit') {
        return b.monthlyProfitRange.max - a.monthlyProfitRange.max;
      }
      if (sortBy === 'capital') {
        return a.capitalRange.min - b.capitalRange.min;
      }
      if (sortBy === 'speed') {
        return a.timeToRevenue.localeCompare(b.timeToRevenue);
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, calculatedRatings, localizedProjects]);

  // Handlers for launching modals with a specific project
  const handleViewDetails = (project: ProjectIdea) => {
    setSelectedProjectForDetail(project);
    setIsDetailOpen(true);
  };

  const handleOpenCalculator = (project?: ProjectIdea) => {
    setSelectedProjectForCalc(project || null);
    setIsCalcOpen(true);
  };

  const handleOpenAiPlanner = (project?: ProjectIdea) => {
    setSelectedProjectForAi(project || null);
    setAiSeedTitle(null);
    setIsAiOpen(true);
  };

  // فكرة مولّدة من ماسح الأصول: لا تقابلها بطاقة مشروع في قاعدة البيانات
  const handleGeneratePlanForIdea = (ideaTitle: string) => {
    setSelectedProjectForAi(null);
    setAiSeedTitle(ideaTitle);
    setIsAiOpen(true);
  };

  const activeDetailProject = selectedProjectForDetail 
    ? (localizedProjects.find(p => p.id === selectedProjectForDetail.id) || getLocalizedProject(selectedProjectForDetail))
    : null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-['Cairo',system-ui,sans-serif]">
      {/* Sticky Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenCalculator={() => handleOpenCalculator()}
        onOpenAiPlanner={() => handleOpenAiPlanner()}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenEmergencyCash={() => setIsEmergencyOpen(true)}
        onOpenAssetScanner={() => setIsScannerOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        comparisonCount={selectedForCompare.length}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenPhotoStudio={() => setIsStudioOpen(true)}
      />

      {/* Hero Section */}
      {/* شريط الدخل العاجل: لمن لا يبحث عن مشروع بل عن مال هذا الأسبوع */}
      <button
        id="btn-strip-emergency"
        onClick={() => setIsEmergencyOpen(true)}
        className="w-full bg-rose-950 hover:bg-rose-900 text-white border-b border-rose-900 transition-colors group"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2.5 text-xs sm:text-sm">
          <Zap className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-bold">{t('strip_emergency_question')}</span>
          <span className="text-rose-200 hidden sm:inline">
            {t('strip_emergency_sub')}
          </span>
          <span className="font-bold text-rose-300 underline underline-offset-4 group-hover:text-white transition-colors shrink-0">
            {t('strip_emergency_btn')}
          </span>
        </div>
      </button>

      <section className="bg-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('hero_badge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
                {t('hero_title')}
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {t('hero_desc')}
              </p>
            </div>

            {/* Quick Action CTA Box */}
            <div className="w-full lg:w-auto bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 flex flex-col sm:flex-row items-center gap-4">
              <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  {t('hero_quiz_callout')}
                </span>
                <p className="text-xs text-stone-300">
                  {t('hero_quiz_sub')}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                <button
                  id="btn-hero-quiz"
                  onClick={() => setIsQuizOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>{t('hero_btn_quiz')}</span>
                </button>
                <button
                  id="btn-hero-compare"
                  onClick={() => setIsComparisonOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 border border-stone-600"
                >
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>{t('hero_btn_compare')} ({selectedForCompare.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Core Criteria Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">{t('hero_stat_zero_capex')}</span>
                <span className="text-stone-400 text-[11px]">{t('hero_stat_zero_capex_desc')}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">{t('hero_stat_high_margins')}</span>
                <span className="text-stone-400 text-[11px]">{t('hero_stat_high_margins_desc')}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">{t('hero_stat_speed_payback')}</span>
                <span className="text-stone-400 text-[11px]">{t('hero_stat_speed_payback_desc')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Category Navigation Tabs & Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                id={`tab-category-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id as ProjectCategory)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{categoryLabels[cat.id as ProjectCategory] || cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-stone-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              {t('sort_label')}
            </span>
            <select
              id="select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rating">{t('sort_rating')}</option>
              <option value="profit">{t('sort_profit')}</option>
              <option value="capital">{t('sort_capital')}</option>
              <option value="speed">{t('sort_speed')}</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Comparison shortcut */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>
              {t('results_showing')} <strong>{filteredProjects.length}</strong> {t('results_ideas')}
            </span>
            {sortBy === 'rating' && (
              <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-medium">
                {t('results_sorted_by_rating')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {searchQuery && (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                {t('results_search_for')} "{searchQuery}"
              </span>
            )}
            {selectedForCompare.length >= 2 && (
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{t('results_view_compare')} ({selectedForCompare.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-6">
            <Lightbulb className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {t('search_empty_title')}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {t('search_empty_desc')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
            >
              {t('search_empty_btn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
                onCalculate={() => handleOpenCalculator(project)}
                onGeneratePlan={() => handleOpenAiPlanner(project)}
                ratingInfo={calculatedRatings[project.id] || { average: 4.8, count: 50, userRating: null }}
                onRate={handleRateProject}
                isSelectedForCompare={selectedForCompare.includes(project.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}

        {/* قسم ماسح الأصول: من كتالوج إلى محرّك أفكار */}
        <section className="bg-white rounded-2xl border border-indigo-200 p-6 sm:p-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 inline-flex items-center gap-1.5">
              <Radar className="w-3.5 h-3.5 text-indigo-600" />
              {t('scanner_box_badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-950 leading-snug">
              {t('scanner_box_title')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {t('scanner_box_desc')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-700">
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 font-semibold">{t('scanner_pill_car')}</span>
              <span className="text-indigo-500 font-bold">+</span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 font-semibold">{t('scanner_pill_students')}</span>
              <span className="text-indigo-500 font-bold">=</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 font-bold text-indigo-900">
                {t('scanner_pill_result')}
              </span>
            </div>
            <div className="pt-2">
              <button
                id="btn-section-scanner"
                onClick={() => setIsScannerOpen(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Radar className="w-4 h-4" />
                <span>{t('scanner_btn_start')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* استوديو صور المنتج: أول مخرَج ملموس يخرج به المستخدم */}
        <section className="bg-white rounded-2xl border border-sky-200 p-6 sm:p-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-sky-600" />
              استوديو صور المنتج
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-950 leading-snug">
              صورتك الرديئة هي سبب عدم بيعك — لا سعرك ولا منتجك
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              صوّر منتجك على طاولة مطبخك، وارفع الصورة هنا: نصحّح الإضاءة، ونزيل صفرة لمبة المنزل،
              ونبيّض الخلفية، ونخرجها بالمقاس الصحيح لإنستغرام — جاهزة للتنزيل والنشر خلال ثوانٍ.
              كل ذلك يجري داخل متصفحك، وصورتك لا تُرفع إلى أي خادم.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-700">
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 font-semibold">مقارنة قبل/بعد</span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 font-semibold">4 أنواع منتجات</span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 font-semibold">منشور وستوري وريلز</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800">بلا إنترنت وبلا رفع</span>
            </div>
            <div className="pt-2">
              <button
                id="btn-section-photo-studio"
                onClick={() => setIsStudioOpen(true)}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>حسّن صورة منتجك الآن</span>
              </button>
            </div>
          </div>
        </section>

        {/* قسم محاكي المشروع: التعلّم قبل الخسارة */}
        <section className="bg-gradient-to-l from-violet-950 via-stone-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-violet-900/50 shadow-md">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold text-violet-300 bg-violet-500/15 px-2.5 py-1 rounded-full border border-violet-500/30 inline-flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              {t('sim_box_badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {t('sim_box_title')}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {t('sim_box_desc')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-300">
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">{t('sim_pill_safe')}</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">{t('sim_pill_events')}</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">{t('sim_pill_report')}</span>
            </div>
            <div className="pt-2">
              <button
                id="btn-section-simulator"
                onClick={() => setIsSimulatorOpen(true)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t('sim_btn_start')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* AI Banner Prompt Section */}
        <section className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/50 inline-flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              {t('banner_ai_badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {t('banner_ai_title')}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {t('banner_ai_desc')}
            </p>
            <div className="pt-2">
              <button
                id="btn-banner-ai"
                onClick={() => handleOpenAiPlanner()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('banner_ai_btn')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pro Tips: 4 Golden Rules for Easy & Profitable Business Success */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-bold text-stone-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              {t('rules_title')}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {t('rules_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{t('rule_1_title')}</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {t('rule_1_desc')}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{t('rule_2_title')}</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {t('rule_2_desc')}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{t('rule_3_title')}</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {t('rule_3_desc')}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{t('rule_4_title')}</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {t('rule_4_desc')}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Floating Comparison Bottom Dock */}
      <ComparisonFloatingBar
        selectedProjects={selectedProjectsForCompare}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onClearComparison={handleClearCompare}
        onRemoveProject={handleRemoveFromCompare}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-800">
          {t('footer_copy')}
        </p>
        <p>
          {t('footer_sub')}
        </p>
      </footer>

      {/* Modals & Slide-overs */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedProjectForDetail ? favorites.includes(selectedProjectForDetail.id) : false}
        onToggleFavorite={toggleFavorite}
        onOpenCalculatorWithProject={handleOpenCalculator}
        onOpenAiPlannerWithProject={handleOpenAiPlanner}
        ratingInfo={selectedProjectForDetail ? (calculatedRatings[selectedProjectForDetail.id] || { average: 4.8, count: 50, userRating: null }) : undefined}
        onRate={handleRateProject}
        isSelectedForCompare={selectedProjectForDetail ? selectedForCompare.includes(selectedProjectForDetail.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      <ProjectComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedProjects={selectedProjectsForCompare}
        allProjects={localizedProjects}
        onRemoveProject={handleRemoveFromCompare}
        onAddProject={handleAddToCompare}
        onClearAll={handleClearCompare}
        onOpenCalculator={handleOpenCalculator}
        onOpenDetails={handleViewDetails}
        onOpenAiPlan={handleOpenAiPlanner}
        ratings={calculatedRatings}
      />

      <ProfitCalculator
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        initialProject={selectedProjectForCalc}
      />

      <AiPlanGenerator
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialProject={selectedProjectForAi}
        seedTitle={aiSeedTitle}
      />

      <IdeaMatchmakerQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProject={handleViewDetails}
      />

      <ProductPhotoStudio
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />

      <BusinessSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <AssetScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onGeneratePlanFor={handleGeneratePlanForIdea}
      />

      <EmergencyCashMode
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSelectProject={handleViewDetails}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onClearFavorites={clearFavorites}
        onSelectProject={handleViewDetails}
        onOpenCalculatorWithProject={handleOpenCalculator}
      />

    </div>
  );
}
