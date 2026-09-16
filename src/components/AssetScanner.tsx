import React, { useState, useEffect } from 'react';
import {
  X,
  Radar,
  Loader2,
  Plus,
  Check,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  Wallet,
  Users,
  Rocket,
  Bookmark,
  Trash2,
  Bot,
  MapPin
} from 'lucide-react';
import { AssetScanResult, ScannedIdea } from '../types';
import { ASSET_GROUPS } from '../data/assetCatalog';
import { keysFromFreeText, AssetSelection } from '../data/assetCombos';

interface AssetScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePlanFor: (ideaTitle: string) => void;
}

const SAVED_KEY = 'saved_scanned_ideas';

const HOURS_CHOICES = ['أقل من 5 ساعات أسبوعياً', '5 - 10 ساعات أسبوعياً', '10 - 20 ساعة أسبوعياً', 'أكثر من 20 ساعة'];
const STYLE_CHOICES = ['أحب التعامل المباشر مع الناس', 'أفضّل العمل خلف الشاشة', 'لا يهم'];

export const AssetScanner: React.FC<AssetScannerProps> = ({
  isOpen,
  onClose,
  onGeneratePlanFor
}) => {
  const [step, setStep] = useState<'inventory' | 'results'>('inventory');
  const [selected, setSelected] = useState<AssetSelection[]>([]);
  const [customAsset, setCustomAsset] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>(HOURS_CHOICES[1]);
  const [workStyle, setWorkStyle] = useState<string>(STYLE_CHOICES[2]);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<AssetScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [savedIdeas, setSavedIdeas] = useState<ScannedIdea[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedIdeas));
    } catch (e) {
      console.error(e);
    }
  }, [savedIdeas]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const isSelected = (label: string) => selected.some((s) => s.label === label);

  const toggleAsset = (label: string, keys: string[]) => {
    setSelected((prev) =>
      prev.some((s) => s.label === label)
        ? prev.filter((s) => s.label !== label)
        : [...prev, { label, keys }]
    );
  };

  const addCustomAsset = () => {
    const label = customAsset.trim();
    if (!label || isSelected(label)) return;
    // النص الحر يمر عبر مطابقة الكلمات المفتاحية ليشارك في بناء التركيبات
    setSelected((prev) => [...prev, { label, keys: keysFromFreeText(label) }]);
    setCustomAsset('');
  };

  const runScan = async () => {
    if (selected.length === 0) return;
    setIsScanning(true);
    setErrorMsg(null);
    setStep('results');

    try {
      const response = await fetch('/api/scan-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: selected, city, hoursPerWeek, workStyle })
      });

      const data = await response.json().catch(() => null);

      if (data && Array.isArray(data.ideas) && data.ideas.length > 0) {
        setResult({
          id: `${Date.now()}`,
          createdAt: Date.now(),
          assets: selected.map((s) => s.label),
          city,
          ideas: data.ideas,
          note: data.note
        });
      } else {
        throw new Error(data?.error || 'تعذّر توليد أفكار من أصولك الحالية.');
      }
    } catch (err: any) {
      console.error('Asset scan failed:', err);
      setErrorMsg(err.message || 'تعذّر الاتصال بالخادم، حاول مرة أخرى.');
    } finally {
      setIsScanning(false);
    }
  };

  const saveIdea = (idea: ScannedIdea) => {
    setSavedIdeas((prev) =>
      prev.some((i) => i.title === idea.title) ? prev : [idea, ...prev]
    );
  };

  const removeSavedIdea = (title: string) => {
    setSavedIdeas((prev) => prev.filter((i) => i.title !== title));
  };

  const isSaved = (idea: ScannedIdea) => savedIdeas.some((i) => i.title === idea.title);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4">
      <div
        id="modal-asset-scanner"
        role="dialog"
        aria-modal="true"
        aria-label="ماسح الأصول"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-4"
      >
        {/* الترويسة */}
        <div className="p-5 border-b border-stone-200 bg-gradient-to-l from-indigo-950 via-stone-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Radar className="w-3.5 h-3.5" />
              محرّك أفكار لا قائمة جاهزة
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">ماسح الأصول</h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-lg">
              لا تبحث في قائمة أفكار الآخرين. أخبرنا بما تملكه فعلاً الآن — وسنولّد أفكاراً
              تنشأ من <strong className="text-white">تركيبة أصولك أنت</strong>، غير موجودة في أي قائمة.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 border border-white/15 text-stone-200 hover:bg-white/20 transition-colors shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 text-sm text-stone-700">

          {/* ============ جرد الأصول ============ */}
          {step === 'inventory' && (
            <div className="p-5 space-y-6">
              {savedIdeas.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    لديك {savedIdeas.length} فكرة محفوظة من مسح سابق
                  </span>
                  <button
                    onClick={() => {
                      setResult({
                        id: 'saved',
                        createdAt: Date.now(),
                        assets: [],
                        city: '',
                        ideas: savedIdeas
                      });
                      setStep('results');
                    }}
                    className="text-[11px] font-bold text-amber-800 underline underline-offset-4 hover:text-amber-950"
                  >
                    اعرضها
                  </button>
                </div>
              )}

              {ASSET_GROUPS.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{group.label}</h3>
                    <p className="text-[11px] text-stone-500">{group.hint}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const active = isSelected(option.label);
                      return (
                        <button
                          key={option.label}
                          onClick={() => toggleAsset(option.label, option.keys)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* أصل مخصص */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-900">تملك شيئاً آخر لم نذكره؟</h3>
                <div className="flex items-center gap-2">
                  <input
                    id="input-custom-asset"
                    type="text"
                    value={customAsset}
                    onChange={(e) => setCustomAsset(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAsset();
                      }
                    }}
                    placeholder="مثال: أخي يملك شاحنة صغيرة، أو عندي رخصة قيادة شاحنات"
                    className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addCustomAsset}
                    className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors shrink-0"
                    aria-label="إضافة أصل"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* السياق */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200">
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    مدينتك أو بيئتك
                  </span>
                  <input
                    id="input-scan-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: حي سكني في الدار البيضاء"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    وقتك الأسبوعي
                  </span>
                  <select
                    id="select-scan-hours"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {HOURS_CHOICES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    أسلوبك المفضل
                  </span>
                  <select
                    id="select-scan-style"
                    value={workStyle}
                    onChange={(e) => setWorkStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {STYLE_CHOICES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* ============ النتائج ============ */}
          {step === 'results' && (
            <div className="p-5 space-y-5">
              {isScanning && (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-stone-900">نفحص تركيبات أصولك...</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    الفكرة الجيدة لا تأتي من أصل واحد، بل من دمج أصلين لا يجمعهما أحد عادة.
                  </p>
                </div>
              )}

              {!isScanning && errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <p className="text-xs text-rose-900 font-semibold">{errorMsg}</p>
                  <button
                    onClick={runScan}
                    className="text-[11px] font-bold text-rose-800 underline underline-offset-4"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              {!isScanning && result && (
                <>
                  {result.assets.length > 0 && (
                    <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2">
                      <span className="text-[11px] text-stone-400 block">
                        أفكار مبنية على {result.assets.length} أصلاً تملكه
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.assets.map((a) => (
                          <span
                            key={a}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.note && (
                    <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-[11px] text-stone-600">
                      {result.note}
                    </div>
                  )}

                  {result.ideas.map((idea, index) => (
                    <div
                      key={idea.id || index}
                      className="border border-stone-200 rounded-xl overflow-hidden bg-white"
                    >
                      {/* تركيبة الأصول التي صنعت الفكرة */}
                      {idea.assetCombo.length > 0 && (
                        <div className="px-4 py-2.5 bg-indigo-50 border-b border-indigo-100 flex flex-wrap items-center gap-1.5">
                          {idea.assetCombo.map((asset, i) => (
                            <React.Fragment key={`${asset}-${i}`}>
                              {i > 0 && <span className="text-indigo-400 font-bold text-xs">+</span>}
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-900 border border-indigo-200">
                                {asset}
                              </span>
                            </React.Fragment>
                          ))}
                          <span className="text-indigo-400 font-bold text-xs">=</span>
                        </div>
                      )}

                      <div className="p-4 space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-stone-900 leading-snug flex-1">
                            {idea.title}
                          </h3>
                          <button
                            onClick={() =>
                              isSaved(idea) ? removeSavedIdea(idea.title) : saveIdea(idea)
                            }
                            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                              isSaved(idea)
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
                            }`}
                            aria-label={isSaved(idea) ? 'محفوظة' : 'حفظ الفكرة'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved(idea) ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-500 block mb-1">
                            لماذا أنت تحديداً؟
                          </span>
                          <p className="text-xs text-stone-800 leading-relaxed">{idea.whyYou}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                            <span className="text-stone-500 flex items-center gap-1 mb-0.5">
                              <Wallet className="w-3 h-3" />
                              التكلفة
                            </span>
                            <span className="font-bold text-stone-900 leading-tight block">
                              {idea.startupCost}
                            </span>
                          </div>
                          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span className="text-emerald-700 flex items-center gap-1 mb-0.5">
                              <TrendingUp className="w-3 h-3" />
                              الدخل المتوقع
                            </span>
                            <span className="font-bold text-emerald-900 leading-tight block">
                              {idea.monthlyPotential}
                            </span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                            <span className="text-stone-500 flex items-center gap-1 mb-0.5">
                              <Clock className="w-3 h-3" />
                              أول دخل
                            </span>
                            <span className="font-bold text-stone-900 leading-tight block">
                              {idea.timeToFirstIncome}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div>
                            <span className="font-bold text-stone-500 flex items-center gap-1.5 mb-0.5">
                              <Users className="w-3.5 h-3.5" />
                              من يدفع لك
                            </span>
                            <p className="text-stone-800 leading-relaxed">{idea.whoPays}</p>
                          </div>

                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-0.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              خطوتك اليوم
                            </span>
                            <p className="text-emerald-900 leading-relaxed">{idea.firstStepToday}</p>
                          </div>

                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              العيب الصريح في هذه الفكرة
                            </span>
                            <p className="text-amber-900 leading-relaxed">{idea.honestWeakness}</p>
                          </div>

                          <div>
                            <span className="font-bold text-stone-500 flex items-center gap-1.5 mb-0.5">
                              <Rocket className="w-3.5 h-3.5" />
                              كيف تكبر بعد النجاح الأول
                            </span>
                            <p className="text-stone-800 leading-relaxed">{idea.scaleUp}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onGeneratePlanFor(idea.title);
                            onClose();
                          }}
                          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Bot className="w-4 h-4 text-emerald-400" />
                          حوّلها إلى دراسة جدوى كاملة
                        </button>
                      </div>
                    </div>
                  ))}

                  {result.ideas.length === 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      لم نجد تركيبة قوية من أصولك الحالية. ارجع وأضف أصولاً أخرى — خصوصاً مهاراتك وشبكة علاقاتك.
                    </div>
                  )}

                  {result.id === 'saved' && savedIdeas.length > 0 && (
                    <button
                      onClick={() => setSavedIdeas([])}
                      className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف كل الأفكار المحفوظة
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* شريط التنقل */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {step === 'inventory' ? (
            <>
              <span className="text-[11px] text-stone-500">
                {selected.length === 0
                  ? 'اختر أصلين على الأقل لتظهر التركيبات'
                  : `${selected.length} أصل محدد`}
              </span>
              <button
                id="btn-run-asset-scan"
                onClick={runScan}
                disabled={selected.length === 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <Radar className="w-4 h-4" />
                ولّد أفكاراً من أصولي
                <ArrowLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('inventory')}
                className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                عدّل أصولي
              </button>
              {!isScanning && result && result.id !== 'saved' && (
                <button
                  onClick={runScan}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline underline-offset-4"
                >
                  ولّد أفكاراً أخرى من نفس الأصول
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
