import {
  MonthResult,
  ProjectIdea,
  SimConfig,
  SimDecision,
  SimEvent,
  SimEventEffects,
  SimState,
  SimVerdict
} from '../types';
import { SIM_EVENTS } from '../data/simulatorEvents';

export const TOTAL_MONTHS = 12;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** يبني إعدادات المحاكاة من الاقتصاديات الحقيقية المخزّنة لكل مشروع. */
export const buildConfig = (project: ProjectIdea, startingCash = 100): SimConfig => ({
  projectId: project.id,
  projectTitle: project.title,
  unitName: project.unitEconomics.unitName,
  basePrice: project.unitEconomics.salePrice,
  baseCost: project.unitEconomics.costPerUnit,
  baseDemand: project.unitEconomics.unitsPerMonth,
  startingCash,
  // مصاريف ثابتة صغيرة: أدوات، اشتراكات، تنقل — تُدفع سواء بعت أم لا
  fixedMonthlyCost: Math.max(8, Math.round(project.unitEconomics.salePrice * 0.25)),
  // سقف ما تستطيع إنتاجه أو خدمته بنفسك شهرياً — الوقت قيد حقيقي لا المال وحده
  baseCapacity: Math.max(1, Math.round(project.unitEconomics.unitsPerMonth * 1.3)),
  // المنتجات الغذائية لا يمكن تخزينها للشهر التالي
  perishable: project.category === 'food-crafts'
});

export const createInitialState = (config: SimConfig): SimState => ({
  config,
  month: 1,
  cash: config.startingCash,
  inventory: 0,
  reputation: 50,
  capacity: config.baseCapacity,
  extraFixedCost: 0,
  demandBonus: 0,
  history: [],
  pendingEvent: null,
  status: 'playing'
});

/** يسحب حدثاً مناسباً للشهر الحالي، ولا يكرر حدثاً وقع من قبل. */
export const drawEvent = (state: SimState): SimEvent | null => {
  if (Math.random() > 0.62) return null;

  const usedIds = state.history
    .map((h) => h.eventTitle)
    .filter((t): t is string => Boolean(t));

  const pool = SIM_EVENTS.filter(
    (e) => (e.minMonth ?? 1) <= state.month && !usedIds.includes(e.title)
  );
  if (pool.length === 0) return null;

  const picked = pool[Math.floor(Math.random() * pool.length)];

  // الطلبية الكبيرة تُحسب من حجم المشروع نفسه لا برقم ثابت
  if (picked.id === 'bulk-order-discount') {
    const units = Math.max(3, Math.round(state.config.baseDemand * 0.8));
    const pricePerUnit = Math.max(
      state.config.baseCost * 1.12,
      Math.round(state.config.basePrice * 0.62 * 100) / 100
    );
    return { ...picked, effects: { ...picked.effects, bulkOrder: { units, pricePerUnit } } };
  }

  return picked;
};

/**
 * أقصى كمية يستطيع اللاعب إنتاجها فعلاً: يحدها نقده وطاقته الشهرية معاً.
 * الطاقة هي القيد الذي يجهله المبتدئ — المال وحده لا يصنع وقتاً إضافياً.
 */
export const maxAffordableUnits = (
  state: SimState,
  marketingSpend: number,
  unitCost: number
): number => {
  const spendable = state.cash - marketingSpend - monthlyFixedCost(state);
  if (spendable <= 0 || unitCost <= 0) return 0;
  return Math.min(Math.floor(spendable / unitCost), state.capacity);
};

/** المصاريف الثابتة شاملةً أي التزام دائم قبله اللاعب (مساعد، إيجار ركن). */
export const monthlyFixedCost = (state: SimState): number =>
  state.config.fixedMonthlyCost + state.extraFixedCost;

/** تكلفة الوحدة بعد أثر الحدث الفعّال هذا الشهر. */
export const effectiveUnitCost = (
  config: SimConfig,
  event: SimEvent | null,
  accepted: boolean
): number => {
  const effects = resolveEffects(event, accepted);
  return Math.round(config.baseCost * (effects.costMultiplier ?? 1) * 100) / 100;
};

const resolveEffects = (event: SimEvent | null, accepted: boolean): SimEventEffects => {
  if (!event) return {};
  if (event.kind === 'choice') {
    return accepted ? event.effects : event.declineEffects ?? {};
  }
  return event.effects;
};

/**
 * توقّع الطلب: السعر هو المحرك الأقوى، يليه التسويق ثم السمعة.
 * مرونة 1.6 تعني أن رفع السعر 20% يقتطع نحو ثلث الطلب — وهو ما يعجز المبتدئ عن توقعه.
 */
const computeDemand = (
  config: SimConfig,
  price: number,
  marketingSpend: number,
  reputation: number,
  demandMultiplier: number,
  permanentBonus = 0
): number => {
  const priceRatio = Math.max(0.2, price / config.basePrice);
  const priceEffect = clamp(Math.pow(priceRatio, -1.6), 0.05, 2.4);

  const marketingBase = Math.max(5, config.basePrice * config.baseDemand * 0.05);
  const marketingEffect = clamp(1 + 0.8 * Math.sqrt(marketingSpend / marketingBase), 1, 2.3);

  const reputationEffect = 0.6 + (reputation / 100) * 0.8;

  // تذبذب طبيعي للسوق ±12%
  const noise = 0.88 + Math.random() * 0.24;

  const demand =
    config.baseDemand *
    (1 + permanentBonus) *
    priceEffect *
    marketingEffect *
    reputationEffect *
    demandMultiplier *
    noise;

  return Math.max(0, Math.round(demand));
};

/**
 * السمعة تُبنى بالوفاء بالطلب وتُهدم بالعجز عنه.
 * تُقاس بنسبة ما لبّيته من الطلب لا بالكمية المفقودة، حتى يستطيع من يبيع
 * كل إنتاجه أن يرفع سمعته بدل أن يُعاقَب على نجاحه.
 */
const computeReputation = (
  current: number,
  demand: number,
  sold: number,
  price: number,
  config: SimConfig,
  eventDelta: number,
  atCapacity: boolean
): number => {
  let rep = current + eventDelta;

  if (demand > 0) {
    const fulfillment = sold / demand;
    if (fulfillment >= 0.95) rep += 6;
    else if (fulfillment >= 0.8) rep += 2;
    else {
      const penalty = fulfillment >= 0.5 ? 5 : 12;
      // من استنفد طاقته كلها لم يقصّر — "ممتلئ" ليس كـ"مُهمِل"
      rep -= atCapacity ? Math.min(3, penalty / 2) : penalty;
    }
  } else if (sold === 0) {
    // شهر بلا طلب ولا بيع: الناس تنساك ببطء
    rep -= 2;
  }

  if (price > config.basePrice * 1.35) {
    rep -= 5;
  }
  if (price < config.basePrice * 0.9 && sold > 0) {
    rep += 2;
  }

  return Math.round(clamp(rep, 0, 100));
};

/** ينفّذ شهراً واحداً ويعيد النتيجة والحالة الجديدة. */
export const runMonth = (
  state: SimState,
  decision: SimDecision
): { result: MonthResult; nextState: SimState } => {
  const { config, pendingEvent } = state;
  const accepted = decision.acceptedEvent ?? false;
  const effects = resolveEffects(pendingEvent, accepted);

  const unitCost = effectiveUnitCost(config, pendingEvent, accepted);
  // لا يمكن تجاوز الطاقة الشهرية مهما بلغ النقد
  const produced = clamp(Math.floor(decision.produceUnits), 0, state.capacity);
  const marketingSpend = Math.max(0, Math.round(decision.marketingSpend));
  const price = Math.max(0.5, decision.price);

  const demand = computeDemand(
    config,
    price,
    marketingSpend,
    state.reputation,
    effects.demandMultiplier ?? 1,
    state.demandBonus
  );

  const available = state.inventory + produced;
  const sold = Math.min(demand, available);
  const lostSales = Math.max(0, demand - sold);

  // الطلبية الكبيرة تُلبّى من الفائض بعد البيع العادي
  let bulkUnits = 0;
  let bulkRevenue = 0;
  if (effects.bulkOrder && effects.bulkOrder.units > 0) {
    bulkUnits = Math.min(effects.bulkOrder.units, available - sold);
    bulkRevenue = bulkUnits * effects.bulkOrder.pricePerUnit;
  }

  const revenue = Math.round((sold * price + bulkRevenue) * 100) / 100;
  const productionCost = Math.round(produced * unitCost * 100) / 100;
  const cashDelta = effects.cashDelta ?? 0;

  const fixedCost = monthlyFixedCost(state);
  const profit =
    Math.round((revenue - productionCost - marketingSpend - fixedCost + cashDelta) * 100) / 100;

  const cashAfter = Math.round((state.cash + profit) * 100) / 100;

  let inventoryAfter = available - sold - bulkUnits;
  let spoiled = 0;
  if (config.perishable && inventoryAfter > 0) {
    spoiled = inventoryAfter;
    inventoryAfter = 0;
  }

  // آثار دائمة يقبلها اللاعب مرة وتلازمه بقية السنة
  const nextCapacity = Math.round(state.capacity * (effects.capacityMultiplier ?? 1));
  const nextExtraFixedCost = state.extraFixedCost + (effects.extraFixedCost ?? 0);
  const nextDemandBonus = state.demandBonus + (effects.permanentDemandBonus ?? 0);

  const reputationAfter = computeReputation(
    state.reputation,
    demand,
    sold,
    price,
    config,
    effects.reputationDelta ?? 0,
    produced >= state.capacity
  );

  let eventOutcome: string | undefined;
  if (pendingEvent) {
    if (pendingEvent.kind === 'choice') {
      eventOutcome = accepted ? 'قبلت العرض' : 'رفضت العرض';
      if (accepted && bulkUnits > 0) {
        eventOutcome = `قبلت الطلبية وسلّمت ${bulkUnits} وحدة منها`;
      } else if (accepted && effects.bulkOrder && bulkUnits === 0) {
        eventOutcome = 'قبلت الطلبية لكن لم يتبقَ لديك مخزون لتسليمها';
      }
    } else {
      eventOutcome = 'أثّر على نتائج الشهر';
    }
  }

  const result: MonthResult = {
    month: state.month,
    price: Math.round(price * 100) / 100,
    produced,
    demand,
    sold: sold + bulkUnits,
    lostSales,
    revenue,
    productionCost,
    marketingSpend,
    fixedCost,
    profit,
    cashAfter,
    inventoryAfter,
    spoiled,
    reputationAfter,
    capacityAfter: nextCapacity,
    eventTitle: pendingEvent?.title,
    eventOutcome
  };

  const finished = state.month >= TOTAL_MONTHS;
  const bankrupt = cashAfter < 0;

  const nextState: SimState = {
    ...state,
    month: finished ? state.month : state.month + 1,
    cash: cashAfter,
    inventory: inventoryAfter,
    reputation: reputationAfter,
    capacity: nextCapacity,
    extraFixedCost: nextExtraFixedCost,
    demandBonus: nextDemandBonus,
    history: [...state.history, result],
    pendingEvent: null,
    status: bankrupt ? 'bankrupt' : finished ? 'finished' : 'playing'
  };

  return { result, nextState };
};

/** مؤشر نوعي للطلب المتوقع: يوجّه اللاعب دون أن يحل عنه المسألة. */
export const forecastDemandBand = (
  config: SimConfig,
  price: number,
  marketingSpend: number,
  reputation: number
): 'ضعيف جداً' | 'ضعيف' | 'متوسط' | 'مرتفع' | 'مرتفع جداً' => {
  const priceRatio = Math.max(0.2, price / config.basePrice);
  const priceEffect = clamp(Math.pow(priceRatio, -1.6), 0.05, 2.4);
  const marketingBase = Math.max(5, config.basePrice * config.baseDemand * 0.05);
  const marketingEffect = clamp(1 + 0.8 * Math.sqrt(marketingSpend / marketingBase), 1, 2.3);
  const reputationEffect = 0.6 + (reputation / 100) * 0.8;
  const ratio = priceEffect * marketingEffect * reputationEffect;

  if (ratio < 0.45) return 'ضعيف جداً';
  if (ratio < 0.8) return 'ضعيف';
  if (ratio < 1.25) return 'متوسط';
  if (ratio < 1.8) return 'مرتفع';
  return 'مرتفع جداً';
};

/** تقرير النهاية: ماذا فعلت، وأين أخطأت تحديداً. */
export const buildVerdict = (state: SimState): SimVerdict => {
  const { config, history } = state;
  const totalProfit = Math.round(history.reduce((sum, m) => sum + m.profit, 0) * 100) / 100;
  const finalCash = state.cash;

  const sortedByProfit = [...history].sort((a, b) => b.profit - a.profit);
  const bestMonth = sortedByProfit[0]?.month ?? 0;
  const worstMonth = sortedByProfit[sortedByProfit.length - 1]?.month ?? 0;

  const lessons: string[] = [];

  const belowCost = history.filter((m) => m.price <= config.baseCost);
  if (belowCost.length > 0) {
    lessons.push(
      `بعت بسعر لا يغطي تكلفة الوحدة في ${belowCost.length} ${belowCost.length === 1 ? 'شهر' : 'أشهر'}. كل وحدة بعتها في تلك الأشهر كانت تزيد خسارتك لا دخلك.`
    );
  }

  const totalLost = history.reduce((sum, m) => sum + m.lostSales, 0);
  if (totalLost > 0) {
    const lostValue = Math.round(totalLost * config.basePrice);
    lessons.push(
      `ضاع منك طلب على ${totalLost} ${config.unitName} لأن مخزونك نفد — أي ما قيمته $${lostValue} تقريباً. نفاد المخزون لا يؤجل البيع، بل يحوّل الزبون لغيرك.`
    );
  }

  const totalSpoiled = history.reduce((sum, m) => sum + m.spoiled, 0);
  if (totalSpoiled > 0) {
    lessons.push(
      `تلفت ${totalSpoiled} وحدة لم تُبَع. في المنتجات القابلة للتلف، الإنتاج الزائد خسارة مباشرة — والطلب المسبق هو الحل.`
    );
  }

  const totalMarketing = history.reduce((sum, m) => sum + m.marketingSpend, 0);
  const totalRevenue = history.reduce((sum, m) => sum + m.revenue, 0);
  if (totalRevenue > 0 && totalMarketing / totalRevenue > 0.3) {
    lessons.push(
      `أنفقت ${Math.round((totalMarketing / totalRevenue) * 100)}% من إيرادك على التسويق. فوق 20% تقريباً، يصبح الإعلان يأكل ربحك بدل أن يبنيه.`
    );
  }
  if (totalMarketing === 0) {
    lessons.push(
      'لم تنفق على التسويق ولو دولاراً واحداً طوال السنة. الجودة وحدها لا تُعرّف الناس بك — ولو خصصت نسبة صغيرة لرأيت الفرق.'
    );
  }

  const lowRepMonths = history.filter((m) => m.reputationAfter < 35);
  if (lowRepMonths.length >= 3) {
    lessons.push(
      `انخفضت سمعتك تحت 35 نقطة في ${lowRepMonths.length} أشهر. السمعة ليست رقماً تجميلياً — كل نقطة تفقدها تقتطع من طلب الشهر التالي.`
    );
  }

  const idleMonths = history.filter((m) => m.produced === 0 && m.sold === 0);
  if (idleMonths.length >= 2) {
    lessons.push(
      `مرّت ${idleMonths.length} أشهر بلا إنتاج ولا بيع، ومع ذلك دفعت مصاريفك الثابتة فيها. التوقف ليس مجانياً.`
    );
  }

  if (lessons.length === 0) {
    lessons.push(
      'أدرت السنة بانضباط: غطيت تكاليفك، لبّيت طلبك، ولم تحرق نقدك في الإعلان. هذا بالضبط ما يفعله أصحاب المشاريع الناجحون.'
    );
  }

  let headline: string;
  if (state.status === 'bankrupt') {
    headline = `أفلست في الشهر ${state.month}. الخبر الجيد أنك خسرت مالاً افتراضياً لا حقيقياً.`;
  } else if (totalProfit <= 0) {
    headline = 'أكملت السنة لكن بخسارة صافية. المشروع لم يمت، لكنه لم يُطعم صاحبه أيضاً.';
  } else if (finalCash >= config.startingCash * 4) {
    headline = 'سنة ممتازة. ضاعفت رأس مالك عدة مرات وبنيت مشروعاً قائماً بذاته.';
  } else if (finalCash >= config.startingCash * 1.5) {
    headline = 'سنة رابحة ومستقرة. نمت ببطء لكن بثبات، وهذه بداية سليمة.';
  } else {
    headline = 'نجوت بالكاد. ربحت شيئاً، لكن هامشك كان أضيق من أن يحتمل صدمة واحدة.';
  }

  const shareText = `جرّبت إدارة مشروع "${config.projectTitle}" لمدة 12 شهراً في محاكي المشاريع.
بدأت بـ $${config.startingCash} وانتهيت بـ $${Math.round(finalCash)}.
صافي الربح: $${Math.round(totalProfit)}
${headline}
جرّب أنت وشوف كم تصمد 👇`;

  return { headline, finalCash, totalProfit, bestMonth, worstMonth, lessons, shareText };
};
