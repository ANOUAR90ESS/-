/**
 * استوديو صور المنتج: معالجة تعمل بالكامل في متصفح المستخدم.
 *
 * الهدف ليس فلاتر تجميلية، بل إصلاح العيوب الثلاثة التي تُفسد صور المنتجات
 * المصوّرة بالهاتف على طاولة المطبخ: إضاءة صفراء من لمبة المنزل، صورة معتمة
 * لا تستغل المدى الكامل، وخلفية رمادية باهتة بدل بيضاء نظيفة.
 */

export interface StudioSettings {
  brightness: number;   // -100..100
  contrast: number;     // -100..100
  saturation: number;   // -100..100
  warmth: number;       // -100..100
  whiteBackground: number; // 0..100 — قوة تنظيف الخلفية الفاتحة
  autoWhiteBalance: boolean;
  autoLevels: boolean;
}

export interface StudioPreset {
  id: string;
  label: string;
  hint: string;
  settings: StudioSettings;
}

export const DEFAULT_SETTINGS: StudioSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  whiteBackground: 0,
  autoWhiteBalance: true,
  autoLevels: true
};

export const PRESETS: StudioPreset[] = [
  {
    id: 'food',
    label: 'طعام وحلويات',
    hint: 'ألوان دافئة وتشبع أعلى ليبدو الطعام شهياً',
    settings: {
      brightness: 8, contrast: 14, saturation: 22, warmth: 10,
      whiteBackground: 25, autoWhiteBalance: true, autoLevels: true
    }
  },
  {
    id: 'handmade',
    label: 'منتجات يدوية',
    hint: 'إبراز الملمس والتفاصيل دون مبالغة في الألوان',
    settings: {
      brightness: 6, contrast: 18, saturation: 8, warmth: 4,
      whiteBackground: 40, autoWhiteBalance: true, autoLevels: true
    }
  },
  {
    id: 'clothing',
    label: 'ملابس وأقمشة',
    hint: 'ألوان أمينة للقماش حتى لا يشتكي الزبون من اختلاف اللون',
    settings: {
      brightness: 10, contrast: 8, saturation: 4, warmth: -2,
      whiteBackground: 45, autoWhiteBalance: true, autoLevels: true
    }
  },
  {
    id: 'accessories',
    label: 'إكسسوارات ومجوهرات',
    hint: 'خلفية بيضاء نظيفة وتباين حاد يبرز اللمعان',
    settings: {
      brightness: 12, contrast: 24, saturation: 6, warmth: 0,
      whiteBackground: 60, autoWhiteBalance: true, autoLevels: true
    }
  }
];

export const FORMATS = [
  { id: 'square', label: 'مربع (منشور)', width: 1080, height: 1080 },
  { id: 'portrait', label: 'طولي (منشور)', width: 1080, height: 1350 },
  { id: 'story', label: 'ستوري وريلز', width: 1080, height: 1920 }
];

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * توازن الأبيض بطريقة "العالم الرمادي": متوسط الصورة يجب أن يكون رمادياً.
 * هذا ما يزيل الصفرة الناتجة عن لمبات المنزل الصفراء.
 * التصحيح مقيّد حتى لا ينقلب على صورة فيها لون واحد غالب بشكل مقصود.
 */
const applyWhiteBalance = (data: Uint8ClampedArray): void => {
  let sumR = 0, sumG = 0, sumB = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
  }
  const meanR = sumR / pixels;
  const meanG = sumG / pixels;
  const meanB = sumB / pixels;
  const meanAll = (meanR + meanG + meanB) / 3;
  if (meanAll < 1) return;

  // تقييد المعامل بين 0.8 و1.25 لتفادي انقلاب الألوان
  const limit = (factor: number) => Math.min(1.25, Math.max(0.8, factor));
  const fR = limit(meanAll / (meanR || 1));
  const fG = limit(meanAll / (meanG || 1));
  const fB = limit(meanAll / (meanB || 1));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp255(data[i] * fR);
    data[i + 1] = clamp255(data[i + 1] * fG);
    data[i + 2] = clamp255(data[i + 2] * fB);
  }
};

/**
 * تمديد المستويات: يجعل أغمق نقطة سوداً وأفتح نقطة بيضاء.
 * يُحسب على الإضاءة لا على كل قناة منفصلة، حفاظاً على أمانة الألوان.
 */
const applyAutoLevels = (data: Uint8ClampedArray): void => {
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[lum]++;
  }

  const total = data.length / 4;
  const cut = total * 0.005; // تجاهل 0.5% من كل طرف (ضوضاء ونقاط شاذة)

  let low = 0;
  let acc = 0;
  while (low < 255 && acc + histogram[low] < cut) {
    acc += histogram[low];
    low++;
  }

  let high = 255;
  acc = 0;
  while (high > 0 && acc + histogram[high] < cut) {
    acc += histogram[high];
    high--;
  }

  if (high - low < 20) return; // الصورة أصلاً ممتدة أو مسطّحة بشكل متعمّد

  // تقييد التمديد: صورة ضيقة المدى جداً ستُضاعف أضعافاً وتحترق ألوانها
  // لو تُرك المعامل بلا سقف. 2.2 يصحّح الصور المعتمة دون أن يفقدها تدرّجها.
  const scale = Math.min(2.2, 255 / (high - low));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp255((data[i] - low) * scale);
    data[i + 1] = clamp255((data[i + 1] - low) * scale);
    data[i + 2] = clamp255((data[i + 2] - low) * scale);
  }
};

/**
 * دفع البكسلات الفاتحة نحو الأبيض النقي عبر تدرّج ناعم.
 * يحوّل مفرش المطبخ الرمادي الباهت إلى خلفية بيضاء نظيفة دون قصّ حواف المنتج.
 */
const applyWhiteBackground = (data: Uint8ClampedArray, strength: number): void => {
  if (strength <= 0) return;
  const amount = strength / 100;
  const threshold = 185; // ما فوقها يُعتبر خلفية فاتحة

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum <= threshold) continue;
    // تدرّج ناعم بين العتبة والأبيض بدل قطع حاد يترك حافة مصطنعة
    const ramp = Math.min(1, (lum - threshold) / (255 - threshold));
    const push = amount * ramp;
    data[i] = clamp255(data[i] + (255 - data[i]) * push);
    data[i + 1] = clamp255(data[i + 1] + (255 - data[i + 1]) * push);
    data[i + 2] = clamp255(data[i + 2] + (255 - data[i + 2]) * push);
  }
};

const applyToneAndColor = (
  data: Uint8ClampedArray,
  settings: StudioSettings
): void => {
  const brightness = settings.brightness * 1.6;
  const contrastFactor =
    (259 * (settings.contrast * 1.2 + 255)) / (255 * (259 - settings.contrast * 1.2));
  const satFactor = 1 + settings.saturation / 100;
  const warmth = settings.warmth * 0.45;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] + brightness;
    let g = data[i + 1] + brightness;
    let b = data[i + 2] + brightness;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    if (satFactor !== 1) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lum + (r - lum) * satFactor;
      g = lum + (g - lum) * satFactor;
      b = lum + (b - lum) * satFactor;
    }

    if (warmth !== 0) {
      r += warmth;
      b -= warmth;
    }

    data[i] = clamp255(r);
    data[i + 1] = clamp255(g);
    data[i + 2] = clamp255(b);
  }
};

/** يطبّق سلسلة المعالجة كاملة على بيانات البكسل في مكانها. */
export const processPixels = (
  data: Uint8ClampedArray,
  settings: StudioSettings
): void => {
  if (settings.autoWhiteBalance) applyWhiteBalance(data);
  if (settings.autoLevels) applyAutoLevels(data);
  applyToneAndColor(data, settings);
  applyWhiteBackground(data, settings.whiteBackground);
};

/** قياسات تُستخدم للتحقق من أن المعالجة حسّنت الصورة فعلاً. */
export const measure = (data: Uint8ClampedArray) => {
  let sumR = 0, sumG = 0, sumB = 0, sumLum = 0;
  let min = 255, max = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sumLum += lum;
    if (lum < min) min = lum;
    if (lum > max) max = lum;
  }
  return {
    meanR: sumR / pixels,
    meanG: sumG / pixels,
    meanB: sumB / pixels,
    meanLum: sumLum / pixels,
    range: max - min,
    colorCast: Math.max(sumR, sumG, sumB) / pixels - Math.min(sumR, sumG, sumB) / pixels
  };
};

/**
 * يرسم الصورة داخل إطار بالمقاس المطلوب مع قصّ من المنتصف،
 * لأن المنتج يكون في وسط الكادر في 95% من صور الهواتف.
 */
export const drawCovered = (
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): void => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const dx = (targetWidth - drawWidth) / 2;
  const dy = (targetHeight - drawHeight) / 2;

  ctx.drawImage(source, dx, dy, drawWidth, drawHeight);
};
