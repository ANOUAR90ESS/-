import { AssetGroup } from '../types';

/**
 * كتالوج الأصول: ما يملكه المستخدم فعلاً الآن.
 * كل خيار يحمل مفاتيح تصنيف (keys) يستخدمها مولّد التركيبات لبناء أفكار مخصصة.
 */
export const ASSET_GROUPS: AssetGroup[] = [
  {
    id: 'equipment',
    label: 'معدات وأدوات تملكها',
    hint: 'أي شيء ملموس في بيتك يمكن أن يعمل من أجلك',
    icon: 'Wrench',
    options: [
      { label: 'سيارة', keys: ['vehicle'] },
      { label: 'دراجة نارية', keys: ['vehicle'] },
      { label: 'حاسوب', keys: ['computer'] },
      { label: 'هاتف بكاميرا جيدة', keys: ['camera'] },
      { label: 'كاميرا احترافية', keys: ['camera'] },
      { label: 'ماكينة خياطة', keys: ['sewing'] },
      { label: 'أدوات نجارة أو صيانة', keys: ['repair'] },
      { label: 'طابعة', keys: ['printer'] },
      { label: 'أدوات تنظيف', keys: ['cleaning'] },
      { label: 'معدات مطبخ جيدة', keys: ['kitchen'] },
      { label: 'ماكينة قهوة', keys: ['kitchen', 'coffee'] }
    ]
  },
  {
    id: 'space',
    label: 'مكان ومساحة',
    hint: 'المساحة الفارغة أصل نائم يمكن إيقاظه',
    icon: 'Home',
    options: [
      { label: 'مطبخ منزلي', keys: ['kitchen'] },
      { label: 'غرفة فارغة', keys: ['space'] },
      { label: 'جراج أو مستودع', keys: ['storage'] },
      { label: 'حديقة أو سطح', keys: ['garden'] },
      { label: 'ركن في محل عائلي', keys: ['shop'] },
      { label: 'سكن قرب جامعة', keys: ['near-students'] },
      { label: 'سكن قرب سوق أو شارع تجاري', keys: ['near-market'] }
    ]
  },
  {
    id: 'time',
    label: 'وقتك المتاح',
    hint: 'متى تستطيع العمل فعلاً دون أن تخلّ بالتزاماتك',
    icon: 'Clock',
    options: [
      { label: 'ساعات الصباح', keys: ['time-morning'] },
      { label: 'ساعات المساء', keys: ['time-evening'] },
      { label: 'عطلة نهاية الأسبوع', keys: ['time-weekend'] },
      { label: 'وقت متقطع بين المهام', keys: ['time-gaps'] }
    ]
  },
  {
    id: 'skills',
    label: 'مهارات تتقنها',
    hint: 'حتى المهارة التي تعتبرها عادية يدفع غيرك مقابلها',
    icon: 'Sparkles',
    options: [
      { label: 'لغة أجنبية', keys: ['skill-language'] },
      { label: 'تصميم', keys: ['skill-design'] },
      { label: 'كتابة وصياغة', keys: ['skill-writing'] },
      { label: 'تصوير ومونتاج', keys: ['skill-media'] },
      { label: 'طبخ أو حلويات', keys: ['skill-cook'] },
      { label: 'خياطة وتفصيل', keys: ['sewing'] },
      { label: 'تدريس مادة دراسية', keys: ['skill-teach'] },
      { label: 'إصلاح أجهزة إلكترونية', keys: ['repair'] },
      { label: 'حلاقة أو مكياج', keys: ['skill-beauty'] },
      { label: 'برمجة', keys: ['skill-code'] },
      { label: 'محاسبة وحسابات', keys: ['skill-accounting'] },
      { label: 'قيادة سيارة', keys: ['vehicle'] }
    ]
  },
  {
    id: 'network',
    label: 'شبكة علاقاتك',
    hint: 'من تعرفهم هم أول سوق لك — وأرخص قناة تسويق',
    icon: 'Users',
    options: [
      { label: 'أقارب أو معارف في التجارة', keys: ['network-business'] },
      { label: 'أصدقاء طلاب', keys: ['network-students'] },
      { label: 'معارف في شركات ومكاتب', keys: ['network-offices'] },
      { label: 'مجموعة واتساب نشطة', keys: ['audience'] },
      { label: 'جيران كثر أعرفهم', keys: ['network-neighbors'] }
    ]
  },
  {
    id: 'digital',
    label: 'أصول رقمية',
    hint: 'حتى 300 متابع محلي أثمن من 10 آلاف متابع عشوائي',
    icon: 'Smartphone',
    options: [
      { label: 'حساب بمتابعين', keys: ['audience'] },
      { label: 'قناة يوتيوب أو تيك توك', keys: ['audience', 'skill-media'] },
      { label: 'قائمة أرقام زبائن سابقين', keys: ['customer-list'] },
      { label: 'خبرة في بيع أونلاين', keys: ['ecommerce'] }
    ]
  }
];
