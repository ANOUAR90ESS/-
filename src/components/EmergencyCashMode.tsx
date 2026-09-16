import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Zap,
  Clock,
  Target,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  MapPin,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Plus,
  Trash2,
  PartyPopper,
  Timer,
  Sparkles
} from 'lucide-react';
import {
  FastCashAssetKey,
  FastCashPlay,
  EarningEntry,
  EmergencyCashState,
  ProjectIdea
} from '../types';
import { FAST_CASH_ASSETS, FAST_CASH_PLAYS } from '../data/fastCashPlays';
import { PROJECT_IDEAS } from '../data/projectsData';

interface EmergencyCashModeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectIdea) => void;
}

const STORAGE_KEY = 'emergency_cash_state';

const DEFAULT_STATE: EmergencyCashState = {
  ownedAssets: ['phone'],
  hoursToday: 4,
  targetAmount: 100,
  deadlineHours: 72,
  activePlayId: null,
  doneTasks: {},
  earnings: []
};

const DEADLINES = [
  { hours: 48, label: 'خلال 48 ساعة', hint: 'عاجل جداً' },
  { hours: 72, label: 'خلال 3 أيام', hint: 'الأكثر واقعية' },
  { hours: 168, label: 'خلال أسبوع', hint: 'خيارات أوسع' }
];

const HOURS_OPTIONS = [2, 4, 6, 9];

const loadState = (): EmergencyCashState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_STATE;
  }
};

export const EmergencyCashMode: React.FC<EmergencyCashModeProps> = ({
  isOpen,
  onClose,
  onSelectProject
}) => {
  const [state, setState] = useState<EmergencyCashState>(loadState);
  const [step, setStep] = useState<'setup' | 'matches' | 'plan'>(
    loadState().activePlayId ? 'plan' : 'setup'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newEarning, setNewEarning] = useState<string>('');
  const [newEarningNote, setNewEarningNote] = useState<string>('');

  // حفظ الحالة تلقائياً حتى لا يفقد المستخدم خطته عند إغلاق الصفحة
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  // إغلاق بمفتاح Esc ومنع تمرير الصفحة خلف النافذة
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

  const toggleAsset = (key: FastCashAssetKey) => {
    setState((prev) => ({
      ...prev,
      ownedAssets: prev.ownedAssets.includes(key)
        ? prev.ownedAssets.filter((a) => a !== key)
        : [...prev.ownedAssets, key]
    }));
  };

  /**
   * الترتيب: المسارات المتاحة بأصولك أولاً، ثم الأسرع في جني أول دخل،
   * ثم الأعلى عائداً لكل مهمة.
   */
  const rankedPlays = useMemo(() => {
    return FAST_CASH_PLAYS
      .map((play) => {
        const missing = play.requiredAssets.filter(
          (a) => !state.ownedAssets.includes(a)
        );
        const midPayout = (play.payout.min + play.payout.max) / 2;
        const jobsNeeded = Math.max(1, Math.ceil(state.targetAmount / midPayout));
        return { play, missing, midPayout, jobsNeeded };
      })
      .filter((item) => item.play.firstIncomeHours <= state.deadlineHours)
      .sort((a, b) => {
        if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
        if (a.play.firstIncomeHours !== b.play.firstIncomeHours) {
          return a.play.firstIncomeHours - b.play.firstIncomeHours;
        }
        return b.midPayout - a.midPayout;
      });
  }, [state.ownedAssets, state.targetAmount, state.deadlineHours]);

  const readyPlays = rankedPlays.filter((p) => p.missing.length === 0);
  const nearlyPlays = rankedPlays.filter((p) => p.missing.length > 0).slice(0, 3);

  const activePlay: FastCashPlay | undefined = FAST_CASH_PLAYS.find(
    (p) => p.id === state.activePlayId
  );

  const collected = state.earnings.reduce((sum, e) => sum + e.amount, 0);
  const progressPct = Math.min(100, Math.round((collected / Math.max(1, state.targetAmount)) * 100));
  const reachedGoal = collected >= state.targetAmount && state.targetAmount > 0;

  const doneForActive = activePlay ? state.doneTasks[activePlay.id] || [] : [];

  const toggleTask = (playId: string, taskId: string) => {
    setState((prev) => {
      const current = prev.doneTasks[playId] || [];
      return {
        ...prev,
        doneTasks: {
          ...prev.doneTasks,
          [playId]: current.includes(taskId)
            ? current.filter((t) => t !== taskId)
            : [...current, taskId]
        }
      };
    });
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const addEarning = () => {
    const amount = parseFloat(newEarning);
    if (!amount || amount <= 0) return;
    const entry: EarningEntry = {
      id: `${Date.now()}`,
      amount,
      note: newEarningNote.trim() || 'تحصيل',
      at: Date.now()
    };
    setState((prev) => ({ ...prev, earnings: [entry, ...prev.earnings] }));
    setNewEarning('');
    setNewEarningNote('');
  };

  const removeEarning = (id: string) => {
    setState((prev) => ({ ...prev, earnings: prev.earnings.filter((e) => e.id !== id) }));
  };

  const startPlay = (playId: string) => {
    setState((prev) => ({ ...prev, activePlayId: playId }));
    setStep('plan');
  };

  const resetAll = () => {
    setState({ ...DEFAULT_STATE, ownedAssets: state.ownedAssets });
    setStep('setup');
  };

  const linkedProject = activePlay?.linkedProjectId
    ? PROJECT_IDEAS.find((p) => p.id === activePlay.linkedProjectId)
    : undefined;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4">
      <div
        id="modal-emergency-cash"
        role="dialog"
        aria-modal="true"
        aria-label="وضع أحتاج دخلاً هذا الأسبوع"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-4"
      >
        {/* ترويسة الوضع */}
        <div className="p-5 border-b border-stone-200 bg-gradient-to-l from-rose-950 via-stone-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <Zap className="w-3.5 h-3.5" />
              وضع الدخل العاجل
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
              أحتاج دخلاً هذا الأسبوع
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-lg">
              ليست مشاريع طويلة الأمد — بل مسارات تُدرّ مالاً خلال ساعات بصفر رأس مال تقريباً،
              بخطة بالساعة ورسائل جاهزة للإرسال.
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

        {/* المحتوى */}
        <div className="overflow-y-auto flex-1 text-sm text-stone-700">

          {/* ============ الخطوة 1: التهيئة ============ */}
          {step === 'setup' && (
            <div className="p-5 space-y-6">
              <div className="space-y-3">
                <label className="block">
                  <span className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-rose-600" />
                    كم تحتاج من المال؟
                  </span>
                  <span className="text-xs text-stone-500 block mb-2">
                    اكتب رقماً واقعياً ومحدداً — الهدف الغامض لا يُنجز.
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      id="input-target-amount"
                      type="number"
                      min={10}
                      value={state.targetAmount}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, targetAmount: Number(e.target.value) }))
                      }
                      className="w-full pr-10 pl-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  </div>
                  <div className="flex gap-1.5">
                    {[50, 100, 200, 400].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setState((prev) => ({ ...prev, targetAmount: amount }))}
                        className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-colors ${
                          state.targetAmount === amount
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Timer className="w-4 h-4 text-rose-600" />
                  متى تحتاجه؟
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {DEADLINES.map((d) => (
                    <button
                      key={d.hours}
                      onClick={() => setState((prev) => ({ ...prev, deadlineHours: d.hours }))}
                      className={`p-3 rounded-xl border text-right transition-colors ${
                        state.deadlineHours === d.hours
                          ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-200'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-stone-900">{d.label}</span>
                      <span className="block text-[11px] text-stone-500 mt-0.5">{d.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  كم ساعة تستطيع تفريغها يومياً؟
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {HOURS_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setState((prev) => ({ ...prev, hoursToday: h }))}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                        state.hoursToday === h
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {h === 9 ? '+8 ساعات' : `${h} ساعات`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  ما الذي تملكه الآن؟
                </span>
                <span className="text-xs text-stone-500 block">
                  اختر كل ما ينطبق عليك — المسارات تُرتّب بناءً على هذه الأصول تحديداً.
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {FAST_CASH_ASSETS.map((asset) => {
                    const selected = state.ownedAssets.includes(asset.key);
                    return (
                      <button
                        key={asset.key}
                        onClick={() => toggleAsset(asset.key)}
                        className={`p-3 rounded-xl border text-right transition-colors flex items-start gap-2.5 ${
                          selected
                            ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            selected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-stone-300'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <span>
                          <span className="block text-xs font-bold text-stone-900">{asset.label}</span>
                          <span className="block text-[11px] text-stone-500 mt-0.5">{asset.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============ الخطوة 2: المسارات المطابقة ============ */}
          {step === 'matches' && (
            <div className="p-5 space-y-5">
              <div className="p-4 bg-stone-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-stone-400 block">هدفك</span>
                  <span className="text-lg font-extrabold">${state.targetAmount}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">المهلة</span>
                  <span className="text-sm font-bold">
                    {DEADLINES.find((d) => d.hours === state.deadlineHours)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">وقتك اليومي</span>
                  <span className="text-sm font-bold">
                    {state.hoursToday === 9 ? '+8 ساعات' : `${state.hoursToday} ساعات`}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">مسارات متاحة لك</span>
                  <span className="text-sm font-bold text-emerald-400">{readyPlays.length} مسار</span>
                </div>
              </div>

              {readyPlays.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  لم تختر أصولاً كافية. ارجع خطوة إلى الوراء وحدد ما تملكه — حتى الهاتف وحده يفتح لك عدة مسارات.
                </div>
              )}

              <div className="space-y-3">
                {readyPlays.map(({ play, jobsNeeded, midPayout }, index) => (
                  <div
                    key={play.id}
                    className="border border-stone-200 rounded-xl p-4 space-y-3 hover:border-stone-300 transition-colors bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {index === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              الأنسب لحالتك
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            أول دخل خلال {play.firstIncomeHours} ساعة
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                            {play.effort}
                          </span>
                          {play.capital === 0 ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              بدون رأس مال
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              تكلفة بدء ~${play.capital}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">{play.title}</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">{play.hook}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                        <span className="text-stone-500 block">العائد المتوقع</span>
                        <span className="font-bold text-stone-900">
                          ${play.payout.min} - ${play.payout.max} {play.payout.unit}
                        </span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-emerald-700 block">للوصول إلى ${state.targetAmount}</span>
                        <span className="font-bold text-emerald-900">
                          تحتاج {jobsNeeded} {jobsNeeded === 1 ? 'مهمة' : 'مهمات'} تقريباً
                          <span className="font-normal text-emerald-700">
                            {' '}(بمعدل ${Math.round(midPayout)})
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      id={`btn-start-play-${play.id}`}
                      onClick={() => startPlay(play.id)}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-rose-400" />
                      ابدأ الخطة بالساعة
                    </button>
                  </div>
                ))}
              </div>

              {nearlyPlays.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-700">
                    مسارات قريبة منك — ينقصها شيء واحد فقط
                  </h4>
                  {nearlyPlays.map(({ play, missing }) => (
                    <div
                      key={play.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-800 block">{play.title}</span>
                        <span className="text-[11px] text-stone-500">
                          ينقصك:{' '}
                          {missing
                            .map((m) => FAST_CASH_ASSETS.find((a) => a.key === m)?.label || m)
                            .join('، ')}
                        </span>
                      </div>
                      <button
                        onClick={() => startPlay(play.id)}
                        className="text-[11px] font-bold text-stone-600 hover:text-stone-900 shrink-0 underline underline-offset-4"
                      >
                        اطّلع عليه
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ الخطوة 3: الخطة بالساعة ============ */}
          {step === 'plan' && activePlay && (
            <div className="p-5 space-y-5">
              {/* شريط التقدم نحو الهدف */}
              <div className="p-4 bg-stone-900 text-white rounded-xl space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <span className="text-xs text-stone-400 block mb-0.5">حصّلت حتى الآن</span>
                    <span className="text-2xl font-extrabold text-emerald-400">${collected}</span>
                    <span className="text-xs text-stone-400"> من أصل ${state.targetAmount}</span>
                  </div>
                  {reachedGoal && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <PartyPopper className="w-3.5 h-3.5" />
                      وصلت لهدفك
                    </span>
                  )}
                </div>
                <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>{progressPct}% من الهدف</span>
                  <span>
                    {doneForActive.length} / {activePlay.timeline.length} مهمة منجزة
                  </span>
                </div>
              </div>

              {/* عنوان المسار */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-stone-900 leading-snug">{activePlay.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{activePlay.hook}</p>
              </div>

              {/* من يدفع لك */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 block">من سيدفع لك؟</span>
                <p className="text-xs text-stone-800 leading-relaxed">{activePlay.whoPays}</p>
              </div>

              {/* الخطة بالساعة */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  خطتك بالساعة
                </h4>
                <div className="space-y-2">
                  {activePlay.timeline.map((task) => {
                    const done = doneForActive.includes(task.id);
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(activePlay.id, task.id)}
                        className={`w-full p-3 rounded-xl border text-right transition-colors flex items-start gap-3 ${
                          done
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            done
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-stone-300'
                          }`}
                        >
                          {done && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <span className="flex-1">
                          <span className="text-[11px] font-bold text-rose-700 block mb-0.5">
                            {task.when}
                          </span>
                          <span
                            className={`text-xs leading-relaxed block ${
                              done ? 'text-stone-500 line-through' : 'text-stone-800'
                            }`}
                          >
                            {task.task}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* أين تجد الزبائن */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  أين تجد أول زبون الآن
                </h4>
                <ul className="space-y-1.5">
                  {activePlay.whereToFind.map((place, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                      {place}
                    </li>
                  ))}
                </ul>
              </div>

              {/* الرسائل الجاهزة */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-600" />
                  رسائل جاهزة — انسخ وأرسل
                </h4>
                {activePlay.templates.map((tpl, i) => {
                  const key = `${activePlay.id}-${i}`;
                  return (
                    <div key={key} className="border border-stone-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 border-b border-stone-200">
                        <span className="text-[11px] font-bold text-stone-700">{tpl.label}</span>
                        <button
                          onClick={() => handleCopy(key, tpl.text)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 hover:text-stone-900 transition-colors"
                        >
                          {copiedKey === key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              تم النسخ
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              نسخ
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-['Cairo',system-ui,sans-serif]">
                        {tpl.text}
                      </pre>
                    </div>
                  );
                })}
              </div>

              {/* التسعير */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  كيف تسعّر دون أن تظلم نفسك
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">{activePlay.priceScript}</p>
              </div>

              {/* تحذير */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  انتبه لهذا
                </span>
                <p className="text-xs text-amber-900 leading-relaxed">{activePlay.warning}</p>
              </div>

              {/* سجل التحصيل */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-rose-600" />
                  سجّل ما حصّلته
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    id="input-earning-amount"
                    type="number"
                    min={1}
                    value={newEarning}
                    onChange={(e) => setNewEarning(e.target.value)}
                    placeholder="المبلغ"
                    className="w-24 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    id="input-earning-note"
                    type="text"
                    value={newEarningNote}
                    onChange={(e) => setNewEarningNote(e.target.value)}
                    placeholder="من أي زبون أو مهمة؟"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={addEarning}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shrink-0"
                    aria-label="إضافة تحصيل"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {state.earnings.length > 0 && (
                  <div className="space-y-1.5">
                    {state.earnings.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200"
                      >
                        <span className="text-xs text-stone-700 flex-1 truncate">{entry.note}</span>
                        <span className="text-xs font-bold text-emerald-700 shrink-0">
                          +${entry.amount}
                        </span>
                        <button
                          onClick={() => removeEarning(entry.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors shrink-0"
                          aria-label="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* التحويل إلى مشروع دائم */}
              {linkedProject && (
                <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    وماذا بعد أن تحلّ أزمتك؟
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    هذا المسار نفسه يمكن أن يتحول إلى مشروع دائم بدخل شهري متكرر:{' '}
                    <strong className="text-white">{linkedProject.title}</strong>
                  </p>
                  <button
                    onClick={() => {
                      onSelectProject(linkedProject);
                      onClose();
                    }}
                    className="mt-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    شاهد المشروع طويل الأمد
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* شريط التنقل السفلي */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {step === 'setup' && (
            <>
              <span className="text-[11px] text-stone-500">
                {state.ownedAssets.length} أصل محدد
              </span>
              <button
                id="btn-emergency-show-matches"
                onClick={() => setStep('matches')}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                أرِني ما أستطيع فعله الآن
                <ArrowLeft className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'matches' && (
            <>
              <button
                onClick={() => setStep('setup')}
                className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                تعديل بياناتي
              </button>
              <span className="text-[11px] text-stone-500 text-left">
                اختر مساراً واحداً وابدأ فوراً — التشتت بين ثلاثة مسارات يعني صفراً
              </span>
            </>
          )}

          {step === 'plan' && (
            <>
              <button
                onClick={() => setStep('matches')}
                className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                مسار آخر
              </button>
              <button
                onClick={resetAll}
                className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 transition-colors"
              >
                إعادة ضبط الخطة
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
