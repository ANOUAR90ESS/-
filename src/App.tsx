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
  Zap
} from 'lucide-react';
import { ProjectIdea, ProjectCategory } from './types';
import { PROJECT_IDEAS, CATEGORIES_CONFIG } from './data/projectsData';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProfitCalculator } from './components/ProfitCalculator';
import { AiPlanGenerator } from './components/AiPlanGenerator';
import { IdeaMatchmakerQuiz } from './components/IdeaMatchmakerQuiz';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { EmergencyCashMode } from './components/EmergencyCashMode';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [sortBy, setSortBy] = useState<'profit' | 'capital' | 'speed'>('profit');

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

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return PROJECT_IDEAS.filter((p) => {
      // Category filter
      if (selectedCategory === 'zero-capital' && p.capitalRange.min > 0) return false;
      if (selectedCategory === 'home-based' && !p.workLocation.includes('المنزل')) return false;
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
  }, [selectedCategory, searchQuery, sortBy]);

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
    setIsAiOpen(true);
  };

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
          <span className="font-bold">لا تبحث عن مشروع بل عن مال هذا الأسبوع؟</span>
          <span className="text-rose-200 hidden sm:inline">
            مسارات تُدرّ دخلاً خلال 72 ساعة بصفر رأس مال
          </span>
          <span className="font-bold text-rose-300 underline underline-offset-4 group-hover:text-white transition-colors shrink-0">
            ابدأ الآن
          </span>
        </div>
      </button>

      <section className="bg-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دليل عملي شامل لبدء مشروع مربح اليوم</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
                أفكار مشاريع سهلة، منخفضة المخاطر، وبأرباح مجزية
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                اكتشف 12+ فكرة استثمارية مصغرة تم انتقاؤها بعناية: برؤوس أموال تبدأ من $0 وحتى $150، 
                وهوامش ربح تتراوح بين 50% إلى 95%، مع دراسات جدوى وخطوات تنفيذ واقعية.
              </p>
            </div>

            {/* Quick Action CTA Box */}
            <div className="w-full lg:w-auto bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="text-right flex-1">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  محتار في اختيار الفكرة المناسبة؟
                </span>
                <p className="text-xs text-stone-300">
                  أجب عن 4 أسئلة سريعة لاقتراح المشروع الأنسب لميزانيتك ووقتك
                </p>
              </div>
              <button
                id="btn-hero-quiz"
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>بدء اختبار المشروع الأنسب</span>
              </button>
            </div>
          </div>

          {/* 3 Core Criteria Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">تكلفة تأسيس شبه منعدمة</span>
                <span className="text-stone-400 text-[11px]">تبدأ من هاتفك دون الحاجة لقروض أو التزامات</span>
              </div>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">هوامش ربح مرتفعة (60%+)</span>
                <span className="text-stone-400 text-[11px]">مشاريع خدمية ورقمية ذات عائد صافٍ مباشر</span>
              </div>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-200 block">سرعة جني أول دخل</span>
                <span className="text-stone-400 text-[11px]">استرداد التكاليف خلال 3 إلى 14 يوماً من الإطلاق</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Category Navigation Tabs */}
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
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-stone-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              الترتيب:
            </span>
            <select
              id="select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="profit">الأعلى ربحاً شهرياً</option>
              <option value="capital">الأقل تكلفة للبدء</option>
              <option value="speed">الأسرع في جني الأرباح</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Active Filter info */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            يتم عرض <strong>{filteredProjects.length}</strong> فكرة مشروع متوافقة
          </span>
          {searchQuery && (
            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
              نتائج البحث عن: "{searchQuery}"
            </span>
          )}
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-6">
            <Lightbulb className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">
              لم يتم العثور على أفكار تطابق بحثك
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              جرب كلمات بحث أخرى أو اختر تصنيفاً عاماً لتصفح جميع المشاريع المتاحة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
            >
              عرض جميع المشاريع
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
              />
            ))}
          </div>
        )}

        {/* AI Banner Prompt Section */}
        <section className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/50 inline-flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              مساعد ريادة الأعمال بالذكاء الاصطناعي
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              لديك فكرة أخرى خاصة بك وتريد دراسة جدوى لها في ثوانٍ؟
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              استخدم نموذج الذكاء الاصطناعي المدمج لتحليل فكرتك، تقدير التكاليف، 
              وتحديد خطة إطلاق في 7 أيام مع خطوات استقطاب أول زبون دون إنفاق باهظ.
            </p>
            <div className="pt-2">
              <button
                id="btn-banner-ai"
                onClick={() => handleOpenAiPlanner()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>توليد دراسة جدوى مخصصة الآن</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pro Tips: 4 Golden Rules for Easy & Profitable Business Success */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-bold text-stone-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              4 قواعد ذهبية لضمان نجاح أي مشروع صغير وتفادي الخسارة
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              نصائح جوهرية من واقع تجارب رواد الأعمال والمشاريع المصغرة الرابحة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">ابدأ بنظام الطلب المسبق</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                لا تشترِ مخزوناً كبيراً من البداية. اعرض نماذج واضحة واطلب عربوناً مقدماً من العميل لتغطية تكاليف المواد وضمان الجدية.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">حل مشكلة واضحة</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                الناس يدفعون بسخاء لمن يوفر عليهم الوقت، الجهد، أو الإحراج (مثل تنظيم الخزائن، تنظيف السيارات عند الباب، أو السيرة الذاتية).
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">قوة التسويق بالمحتوى</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                فيديوهات كواليس التحضير (Behind The Scenes) وتوثيق النتائج الواقعية على تيك توك وإنستغرام تجلب آلاف الزبائن مجاناً دون إعلانات.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-sm">إعادة استثمار أول أرباح</h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                في أول 3 إلى 6 أشهر، أعد استثمار 40% من صافي ربحك في تحسين التغليف، شراء أدوات أسرع، وتوسيع سلة المنتجات لزيادة الدخل.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-800">
          منصة أفكار مشاريع سهلة ومربحة &copy; 2026
        </p>
        <p>
          دليلك التفاعلي لدراسات الجدوى السريعة، حاسبة الأرباح، ونماذج العمل الناجحة
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
      />

      <IdeaMatchmakerQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProject={handleViewDetails}
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
