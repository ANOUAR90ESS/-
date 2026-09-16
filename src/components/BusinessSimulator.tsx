import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Gamepad2,
  Play,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Heart,
  Zap,
  AlertTriangle,
  Check,
  Copy,
  RotateCcw,
  ChevronLeft,
  Trophy,
  Skull,
  Factory,
  Megaphone,
  Tag
} from 'lucide-react';
import { ProjectIdea, SimState, MonthResult } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';
import {
  TOTAL_MONTHS,
  buildConfig,
  createInitialState,
  drawEvent,
  runMonth,
  maxAffordableUnits,
  effectiveUnitCost,
  monthlyFixedCost,
  forecastDemandBand,
  buildVerdict
} from '../lib/simulatorEngine';

interface BusinessSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTING_CASH = 100;

const BAND_STYLES: Record<string, string> = {
  'ضعيف جداً': 'bg-rose-100 text-rose-800 border-rose-200',
  'ضعيف': 'bg-amber-100 text-amber-800 border-amber-200',
  'متوسط': 'bg-stone-100 text-stone-700 border-stone-200',
  'مرتفع': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'مرتفع جداً': 'bg-emerald-200 text-emerald-900 border-emerald-300'
};

export const BusinessSimulator: React.FC<BusinessSimulatorProps> = ({ isOpen, onClose }) => {
  const [state, setState] = useState<SimState | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [produce, setProduce] = useState<number>(0);
  const [marketing, setMarketing] = useState<number>(0);
  const [acceptEvent, setAcceptEvent] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<MonthResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

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

  const startGame = (project: ProjectIdea) => {
    const config = buildConfig(project, STARTING_CASH);
    const fresh = createInitialState(config);
    const withEvent = { ...fresh, pendingEvent: drawEvent(fresh) };
    setState(withEvent);
    setPrice(config.basePrice);
    setProduce(0);
    setMarketing(0);
    setAcceptEvent(false);
    setLastResult(null);
  };

  const unitCost = state
    ? effectiveUnitCost(state.config, state.pendingEvent, acceptEvent)
    : 0;
  const maxUnits = state ? maxAffordableUnits(state, marketing, unitCost) : 0;
  const fixedCost = state ? monthlyFixedCost(state) : 0;

  const band = state
    ? forecastDemandBand(state.config, price, marketing, state.reputation)
    : 'متوسط';

  const margin = state && price > 0 ? Math.round(((price - unitCost) / price) * 100) : 0;

  // تكلفة القرار الحالي: ما سيخرج من نقدك هذا الشهر مهما بعت
  const committed = state ? Math.round(produce * unitCost + marketing + fixedCost) : 0;

  const playMonth = () => {
    if (!state) return;
    const { result, nextState } = runMonth(state, {
      price,
      produceUnits: produce,
      marketingSpend: marketing,
      acceptedEvent: acceptEvent
    });
    const advanced =
      nextState.status === 'playing'
        ? { ...nextState, pendingEvent: drawEvent(nextState) }
        : nextState;
    setState(advanced);
    setLastResult(result);
    setProduce(0);
    setMarketing(0);
    setAcceptEvent(false);
  };

  const verdict = useMemo(
    () => (state && state.status !== 'playing' ? buildVerdict(state) : null),
    [state]
  );

  const copyShare = () => {
    if (!verdict) return;
    navigator.clipboard.writeText(verdict.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // المشاريع ذات الاقتصاديات الأوضح تصلح للمحاكاة أكثر من غيرها
  const playableProjects = PROJECT_IDEAS.slice(0, 9);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4">
      <div
        id="modal-business-simulator"
        role="dialog"
        aria-modal="true"
        aria-label="محاكي المشروع"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-4"
      >
        {/* الترويسة */}
        <div className="p-5 border-b border-stone-200 bg-gradient-to-l from-violet-950 via-stone-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              <Gamepad2 className="w-3.5 h-3.5" />
              تعلّم دون أن تخسر ديناراً
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">محاكي المشروع</h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-lg">
              أدِر مشروعاً لمدة 12 شهراً افتراضياً. سعّر، أنتج، سوّق، وواجه ما يواجهه أصحاب
              المشاريع فعلاً — ثم اقرأ تقريراً بما أخطأت فيه، بمال افتراضي لا حقيقي.
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

          {/* ============ اختيار المشروع ============ */}
          {!state && (
            <div className="p-5 space-y-4">
              <div className="p-4 bg-stone-900 text-white rounded-xl flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[11px] text-stone-400 block">رأس مالك الافتراضي</span>
                  <span className="text-xl font-extrabold text-emerald-400">${STARTING_CASH}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">المدة</span>
                  <span className="text-sm font-bold">12 شهراً</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">الهدف</span>
                  <span className="text-sm font-bold">تنجو وتربح دون أن تفلس</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-stone-900">أي مشروع تريد أن تدير؟</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {playableProjects.map((project) => (
                  <button
                    key={project.id}
                    id={`btn-sim-project-${project.id}`}
                    onClick={() => startGame(project)}
                    className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-violet-300 hover:bg-violet-50/40 transition-colors text-right space-y-2"
                  >
                    <span className="text-xs font-bold text-stone-900 block leading-snug">
                      {project.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        تكلفة الوحدة ${project.unitEconomics.costPerUnit}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        سعرها المعتاد ${project.unitEconomics.salePrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {project.unitEconomics.unitName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============ اللعب ============ */}
          {state && state.status === 'playing' && (
            <div className="p-5 space-y-5">
              {/* لوحة المؤشرات */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="p-3 bg-stone-900 text-white rounded-xl">
                  <span className="text-[10px] text-stone-400 block">الشهر</span>
                  <span className="text-sm font-extrabold">
                    {state.month} <span className="text-stone-400 font-normal">/ {TOTAL_MONTHS}</span>
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> نقدك
                  </span>
                  <span className="text-sm font-extrabold text-emerald-900">
                    ${Math.round(state.cash)}
                  </span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Package className="w-3 h-3" /> مخزونك
                  </span>
                  <span className="text-sm font-extrabold text-stone-900">{state.inventory}</span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> سمعتك
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      state.reputation >= 60
                        ? 'text-emerald-700'
                        : state.reputation >= 35
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {state.reputation}
                  </span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Factory className="w-3 h-3" /> طاقتك
                  </span>
                  <span className="text-sm font-extrabold text-stone-900">{state.capacity}</span>
                </div>
              </div>

              {/* نتيجة الشهر الماضي */}
              {lastResult && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    lastResult.profit >= 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    {lastResult.profit >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                    )}
                    نتيجة الشهر {lastResult.month}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">الطلب</span>
                      <span className="font-bold text-stone-900">{lastResult.demand}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">بعت</span>
                      <span className="font-bold text-stone-900">{lastResult.sold}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">طلب ضائع</span>
                      <span
                        className={`font-bold ${
                          lastResult.lostSales > 0 ? 'text-rose-700' : 'text-stone-900'
                        }`}
                      >
                        {lastResult.lostSales}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">الربح</span>
                      <span
                        className={`font-bold ${
                          lastResult.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        ${Math.round(lastResult.profit)}
                      </span>
                    </div>
                  </div>
                  {lastResult.spoiled > 0 && (
                    <p className="text-[11px] text-rose-800 font-semibold">
                      تلفت {lastResult.spoiled} وحدة لم تُبَع — الإنتاج الزائد في المنتجات القابلة للتلف خسارة مباشرة.
                    </p>
                  )}
                  {lastResult.lostSales > 0 && (
                    <p className="text-[11px] text-amber-800">
                      خسرت {lastResult.lostSales} طلباً لأن ما لديك لم يكفِ. الزبون الذي لا يجد لا ينتظر.
                    </p>
                  )}
                </div>
              )}

              {/* الحدث */}
              {state.pendingEvent && (
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-violet-600" />
                    {state.pendingEvent.title}
                  </span>
                  <p className="text-xs text-violet-900 leading-relaxed">
                    {state.pendingEvent.description}
                  </p>
                  {state.pendingEvent.kind === 'choice' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        id="btn-sim-event-accept"
                        onClick={() => setAcceptEvent(true)}
                        className={`px-3.5 py-2 text-[11px] font-bold rounded-xl border transition-colors ${
                          acceptEvent
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white text-violet-900 border-violet-300 hover:bg-violet-100'
                        }`}
                      >
                        {state.pendingEvent.acceptLabel}
                      </button>
                      <button
                        id="btn-sim-event-decline"
                        onClick={() => setAcceptEvent(false)}
                        className={`px-3.5 py-2 text-[11px] font-bold rounded-xl border transition-colors ${
                          !acceptEvent
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {state.pendingEvent.declineLabel}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* القرارات */}
              <div className="space-y-4 border-t border-stone-200 pt-4">
                <h3 className="text-sm font-bold text-stone-900">قرارات الشهر {state.month}</h3>

                {/* السعر */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-violet-600" />
                      سعر بيع الوحدة
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">${price}</span>
                  </div>
                  <input
                    id="input-sim-price"
                    type="range"
                    min={Math.max(1, Math.round(unitCost * 0.5))}
                    max={Math.round(state.config.basePrice * 2)}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">
                      تكلفة الوحدة ${unitCost} · هامشك{' '}
                      <strong className={margin <= 0 ? 'text-rose-700' : 'text-emerald-700'}>
                        {margin}%
                      </strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border font-bold ${BAND_STYLES[band]}`}>
                      الطلب المتوقع: {band}
                    </span>
                  </div>
                  {margin <= 0 && (
                    <p className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      سعرك لا يغطي تكلفتك — كل وحدة تبيعها تزيد خسارتك.
                    </p>
                  )}
                </div>

                {/* الإنتاج */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5 text-violet-600" />
                      كم وحدة تنتج هذا الشهر؟
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">{produce}</span>
                  </div>
                  <input
                    id="input-sim-produce"
                    type="range"
                    min={0}
                    max={Math.max(1, maxUnits)}
                    step={1}
                    value={Math.min(produce, maxUnits)}
                    onChange={(e) => setProduce(Number(e.target.value))}
                    className="w-full accent-violet-600"
                    disabled={maxUnits === 0}
                  />
                  <p className="text-[11px] text-stone-500">
                    أقصى ما تستطيع: <strong>{maxUnits}</strong> وحدة
                    {maxUnits === state.capacity
                      ? ' (سقف طاقتك الشهرية)'
                      : ' (نقدك لا يكفي لأكثر)'}
                    . تكلفة الإنتاج ${Math.round(produce * unitCost)}
                  </p>
                </div>

                {/* التسويق */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5 text-violet-600" />
                      ميزانية التسويق
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">${marketing}</span>
                  </div>
                  <input
                    id="input-sim-marketing"
                    type="range"
                    min={0}
                    max={Math.max(10, Math.round(state.cash * 0.5))}
                    step={1}
                    value={marketing}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setMarketing(next);
                      // النقد المتاح للإنتاج يتغير بتغير التسويق
                      setProduce((prev) =>
                        Math.min(prev, maxAffordableUnits(state, next, unitCost))
                      );
                    }}
                    className="w-full accent-violet-600"
                  />
                  <p className="text-[11px] text-stone-500">
                    التسويق يرفع الطلب بعوائد متناقصة — مضاعفته لا تضاعف مبيعاتك.
                  </p>
                </div>

                {/* ملخص الالتزام */}
                <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-stone-600">
                    سيخرج من نقدك هذا الشهر مهما بعت:{' '}
                    <strong className="text-stone-900">${committed}</strong>
                    <span className="text-stone-500">
                      {' '}(إنتاج ${Math.round(produce * unitCost)} + تسويق ${marketing} + ثابتة ${fixedCost})
                    </span>
                  </span>
                  <span
                    className={`font-bold ${
                      committed > state.cash ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    يتبقى ${Math.round(state.cash - committed)}
                  </span>
                </div>

                <button
                  id="btn-sim-play-month"
                  onClick={playMonth}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  نفّذ الشهر {state.month}
                </button>
              </div>

              {/* سجل الأشهر */}
              {state.history.length > 0 && (
                <div className="space-y-2 border-t border-stone-200 pt-4">
                  <h4 className="text-xs font-bold text-stone-700">سجل الأشهر السابقة</h4>
                  <div className="space-y-1">
                    {state.history.map((m) => (
                      <div
                        key={m.month}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-[11px]"
                      >
                        <span className="font-bold text-stone-700 shrink-0">ش{m.month}</span>
                        <span className="text-stone-500 flex-1 truncate">
                          سعر ${m.price} · باع {m.sold} · طلب {m.demand}
                          {m.eventTitle ? ` · ${m.eventTitle}` : ''}
                        </span>
                        <span
                          className={`font-bold shrink-0 ${
                            m.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {m.profit >= 0 ? '+' : ''}${Math.round(m.profit)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ التقرير النهائي ============ */}
          {state && state.status !== 'playing' && verdict && (
            <div className="p-5 space-y-5">
              <div
                className={`p-5 rounded-xl text-white space-y-3 ${
                  state.status === 'bankrupt'
                    ? 'bg-gradient-to-l from-rose-950 to-stone-900'
                    : 'bg-gradient-to-l from-emerald-950 to-stone-900'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                  {state.status === 'bankrupt' ? (
                    <>
                      <Skull className="w-3.5 h-3.5" /> انتهت المحاكاة بالإفلاس
                    </>
                  ) : (
                    <>
                      <Trophy className="w-3.5 h-3.5" /> أكملت 12 شهراً
                    </>
                  )}
                </span>
                <h3 className="text-base font-extrabold leading-snug">{verdict.headline}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-stone-400 block">بدأت بـ</span>
                    <span className="text-sm font-bold">${STARTING_CASH}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block">انتهيت بـ</span>
                    <span
                      className={`text-sm font-extrabold ${
                        verdict.finalCash >= STARTING_CASH ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      ${Math.round(verdict.finalCash)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block">صافي الربح</span>
                    <span className="text-sm font-bold">${Math.round(verdict.totalProfit)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block">أفضل شهر</span>
                    <span className="text-sm font-bold">الشهر {verdict.bestMonth}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-stone-900">ماذا تعلّمت من هذه السنة؟</h4>
                {verdict.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed">{lesson}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-stone-200 pt-4">
                <h4 className="text-xs font-bold text-stone-700">سجل السنة كاملاً</h4>
                <div className="space-y-1">
                  {state.history.map((m) => (
                    <div
                      key={m.month}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-[11px]"
                    >
                      <span className="font-bold text-stone-700 shrink-0">ش{m.month}</span>
                      <span className="text-stone-500 flex-1 truncate">
                        سعر ${m.price} · أنتج {m.produced} · باع {m.sold} · سمعة {m.reputationAfter}
                      </span>
                      <span
                        className={`font-bold shrink-0 ${
                          m.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {m.profit >= 0 ? '+' : ''}${Math.round(m.profit)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  id="btn-sim-restart"
                  onClick={() => setState(null)}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  جرّب مشروعاً آخر
                </button>
                <button
                  onClick={copyShare}
                  className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      تم نسخ النتيجة
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      انسخ نتيجتك وشاركها
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {state && state.status === 'playing' && (
          <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <button
              onClick={() => setState(null)}
              className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              إنهاء المحاكاة والبدء من جديد
            </button>
            <span className="text-[11px] text-stone-500">
              مال افتراضي بالكامل — لا مخاطرة حقيقية
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
