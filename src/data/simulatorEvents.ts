import { SimEvent } from '../types';

/**
 * أحداث المحاكاة: مواقف واقعية تواجه أي مشروع مصغّر.
 * بعضها يفرض نفسه (auto)، وبعضها قرار يتحمل اللاعب نتيجته (choice).
 */
export const SIM_EVENTS: SimEvent[] = [
  {
    id: 'material-price-spike',
    title: 'ارتفعت أسعار المواد الخام',
    description: 'مورّدك رفع أسعاره 25% هذا الشهر. تكلفة كل وحدة ستزيد — والسؤال: هل ترفع سعرك أم تتحمل الفرق من هامشك؟',
    kind: 'auto',
    effects: { costMultiplier: 1.25 }
  },
  {
    id: 'bulk-order-discount',
    title: 'طلبية كبيرة بسعر مخفّض',
    description: 'زبون يريد كمية كبيرة دفعة واحدة، لكن بسعر أقل من سعرك المعتاد بكثير. تقبل الكمية بهامش ضعيف، أم ترفض وتحتفظ بمستوى سعرك؟',
    kind: 'choice',
    acceptLabel: 'أقبل الطلبية',
    declineLabel: 'أرفض وأحافظ على سعري',
    effects: { bulkOrder: { units: 0, pricePerUnit: 0 }, reputationDelta: 3 },
    declineEffects: { reputationDelta: -1 },
    minMonth: 3
  },
  {
    id: 'competitor-opens',
    title: 'منافس فتح بجوارك',
    description: 'شخص بدأ نفس نشاطك في منطقتك وبسعر أقل. جزء من طلبك سيتحول إليه هذا الشهر.',
    kind: 'auto',
    effects: { demandMultiplier: 0.72 },
    minMonth: 4
  },
  {
    id: 'viral-video',
    title: 'فيديو انتشر بشكل غير متوقع',
    description: 'مقطع صوّرته عن عملك وصل لآلاف المشاهدات محلياً. الطلب سيقفز هذا الشهر — إن كان لديك ما يكفي لتلبيته.',
    kind: 'auto',
    effects: { demandMultiplier: 1.85, reputationDelta: 5 }
  },
  {
    id: 'season-peak',
    title: 'موسم مناسبات',
    description: 'اقترب موسم الأعياد والمناسبات، والطلب على منتجات مثل منتجك يرتفع بوضوح.',
    kind: 'auto',
    effects: { demandMultiplier: 1.5 },
    minMonth: 2
  },
  {
    id: 'bad-review',
    title: 'تقييم سلبي علني',
    description: 'زبونة غير راضية نشرت تجربتها في مجموعة الحي. سمعتك تضررت وسيظهر أثرها في الطلب.',
    kind: 'auto',
    effects: { reputationDelta: -14 },
    minMonth: 2
  },
  {
    id: 'equipment-breaks',
    title: 'تعطّلت إحدى أدواتك',
    description: 'أداة أساسية في عملك تعطلت وتحتاج إصلاحاً فورياً. المبلغ يُخصم من نقدك مهما كانت خطتك.',
    kind: 'auto',
    effects: { cashDelta: -45 },
    minMonth: 3
  },
  {
    id: 'hire-helper',
    title: 'فرصة توظيف مساعد',
    description: 'شخص يعرض مساعدتك بأجر شهري. سيرفع طاقتك الإنتاجية 60% لبقية السنة، لكن أجره يُدفع كل شهر سواء بعت أم لا.',
    kind: 'choice',
    acceptLabel: 'أوظّفه (التزام شهري دائم)',
    declineLabel: 'أكمل وحدي',
    effects: { capacityMultiplier: 1.6, extraFixedCost: 55, reputationDelta: 3 },
    declineEffects: {},
    minMonth: 4
  },
  {
    id: 'late-payment',
    title: 'زبون تأخر في الدفع',
    description: 'زبون استلم طلبه ولم يدفع بعد. جزء من إيرادك هذا الشهر لن يصلك في وقته.',
    kind: 'auto',
    effects: { cashDelta: -35 },
    minMonth: 3
  },
  {
    id: 'influencer-offer',
    title: 'عرض إعلان مدفوع',
    description: 'صاحب حساب محلي يعرض عليك إعلاناً مقابل مبلغ. قد يجلب طلباً كبيراً، وقد لا يجلب شيئاً — هذه طبيعة الإعلان.',
    kind: 'choice',
    acceptLabel: 'أدفع وأجرّب',
    declineLabel: 'أوفّر المبلغ',
    effects: { cashDelta: -60, demandMultiplier: 1.45 },
    declineEffects: {},
    minMonth: 2
  },
  {
    id: 'supplier-deal',
    title: 'عرض جملة من المورّد',
    description: 'مورّدك يعرض خصماً على المواد هذا الشهر مقابل الشراء بكمية أكبر. تكلفة وحدتك ستنخفض.',
    kind: 'auto',
    effects: { costMultiplier: 0.78 },
    minMonth: 2
  },
  {
    id: 'slow-month',
    title: 'شهر راكد',
    description: 'ركود عام في السوق هذا الشهر: رواتب متأخرة ومصاريف مدرسية. الناس تؤجل الشراء غير الضروري.',
    kind: 'auto',
    effects: { demandMultiplier: 0.65 },
    minMonth: 3
  },
  {
    id: 'referral-wave',
    title: 'موجة توصيات',
    description: 'زبائنك الراضون رشّحوك لمعارفهم. طلب إضافي جاءك بلا أي تكلفة تسويق.',
    kind: 'auto',
    effects: { demandMultiplier: 1.3, reputationDelta: 3 },
    minMonth: 3
  },
  {
    id: 'rent-a-corner',
    title: 'عرض ركن في محل قائم',
    description: 'صاحب محل يعرض عليك ركناً بإيجار شهري. يرفع طلبك 30% بشكل دائم لظهورك أمام المارّة، لكن الإيجار يُدفع كل شهر مهما كانت مبيعاتك.',
    kind: 'choice',
    acceptLabel: 'أستأجر الركن (إيجار شهري دائم)',
    declineLabel: 'أبقى بلا إيجار',
    effects: { permanentDemandBonus: 0.3, extraFixedCost: 45, reputationDelta: 5 },
    declineEffects: {},
    minMonth: 5
  }
];
