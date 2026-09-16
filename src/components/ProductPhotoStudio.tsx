import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  Upload,
  Download,
  RotateCcw,
  Sun,
  Contrast,
  Droplet,
  Thermometer,
  Eraser,
  Check,
  Lightbulb,
  ImageIcon,
  Loader2
} from 'lucide-react';
import {
  StudioSettings,
  DEFAULT_SETTINGS,
  PRESETS,
  FORMATS,
  processPixels,
  drawCovered
} from '../lib/imageStudio';

interface ProductPhotoStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_SIZE = 520;
const MAX_SOURCE = 1800;

export const ProductPhotoStudio: React.FC<ProductPhotoStudioProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<StudioSettings>(PRESETS[0].settings);
  const [activePreset, setActivePreset] = useState<string>(PRESETS[0].id);
  const [formatId, setFormatId] = useState<string>('square');
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [compare, setCompare] = useState<number>(100);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const format = FORMATS.find((f) => f.id === formatId) || FORMATS[0];

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

  /** يعيد رسم المعاينة بالمقاس والإعدادات الحالية. */
  const render = useCallback(() => {
    const source = sourceRef.current;
    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;
    if (!source || !beforeCanvas || !afterCanvas) return;

    const ratio = format.height / format.width;
    const w = PREVIEW_SIZE;
    const h = Math.round(PREVIEW_SIZE * ratio);

    [beforeCanvas, afterCanvas].forEach((canvas) => {
      canvas.width = w;
      canvas.height = h;
    });

    const beforeCtx = beforeCanvas.getContext('2d');
    const afterCtx = afterCanvas.getContext('2d', { willReadFrequently: true });
    if (!beforeCtx || !afterCtx) return;

    drawCovered(beforeCtx, source, source.width, source.height, w, h);
    drawCovered(afterCtx, source, source.width, source.height, w, h);

    const imageData = afterCtx.getImageData(0, 0, w, h);
    processPixels(imageData.data, settings);
    afterCtx.putImageData(imageData, 0, 0);
  }, [settings, format]);

  useEffect(() => {
    if (hasImage) render();
  }, [hasImage, render]);

  const loadFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('الملف المختار ليس صورة. اختر صورة بصيغة JPG أو PNG.');
      return;
    }
    setIsBusy(true);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // تصغير المصدر يجعل المعالجة فورية على الهواتف الضعيفة
        const scale = Math.min(1, MAX_SOURCE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorMsg('تعذّر فتح الصورة في هذا المتصفح.');
          setIsBusy(false);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        sourceRef.current = canvas;
        setHasImage(true);
        setCompare(100);
        setIsBusy(false);
      };
      img.onerror = () => {
        setErrorMsg('تعذّر قراءة هذه الصورة. جرّب صورة أخرى.');
        setIsBusy(false);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      setErrorMsg('تعذّر قراءة الملف.');
      setIsBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setSettings(preset.settings);
  };

  const updateSetting = (key: keyof StudioSettings, value: number | boolean) => {
    setActivePreset('custom');
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /** التصدير يعالج بالمقاس الكامل لا بمقاس المعاينة. */
  const download = () => {
    const source = sourceRef.current;
    if (!source) return;

    const canvas = document.createElement('canvas');
    canvas.width = format.width;
    canvas.height = format.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    drawCovered(ctx, source, source.width, source.height, format.width, format.height);
    const imageData = ctx.getImageData(0, 0, format.width, format.height);
    processPixels(imageData.data, settings);
    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `صورة-منتج-${format.id}-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const reset = () => {
    sourceRef.current = null;
    setHasImage(false);
    setSettings(PRESETS[0].settings);
    setActivePreset(PRESETS[0].id);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  const sliders: {
    key: keyof StudioSettings;
    label: string;
    icon: React.ReactNode;
    min: number;
    max: number;
  }[] = [
    { key: 'brightness', label: 'الإضاءة', icon: <Sun className="w-3.5 h-3.5" />, min: -60, max: 60 },
    { key: 'contrast', label: 'التباين', icon: <Contrast className="w-3.5 h-3.5" />, min: -50, max: 60 },
    { key: 'saturation', label: 'حيوية الألوان', icon: <Droplet className="w-3.5 h-3.5" />, min: -50, max: 60 },
    { key: 'warmth', label: 'الدفء', icon: <Thermometer className="w-3.5 h-3.5" />, min: -40, max: 40 },
    { key: 'whiteBackground', label: 'تنظيف الخلفية', icon: <Eraser className="w-3.5 h-3.5" />, min: 0, max: 100 }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4">
      <div
        id="modal-photo-studio"
        role="dialog"
        aria-modal="true"
        aria-label="استوديو صور المنتج"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-4"
      >
        <div className="p-5 border-b border-stone-200 bg-gradient-to-l from-sky-950 via-stone-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
              <Camera className="w-3.5 h-3.5" />
              يعمل داخل هاتفك — صورتك لا تُرفع لأي خادم
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">استوديو صور المنتج</h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
              صوّر منتجك على طاولة مطبخك، واخرج بصورة نظيفة جاهزة للنشر: إضاءة مصحّحة،
              صفرة اللمبة مُزالة، خلفية مبيّضة، وبالمقاس الصحيح لإنستغرام.
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
          {!hasImage ? (
            <div className="p-5 space-y-5">
              <button
                id="btn-studio-upload"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-14 border-2 border-dashed border-stone-300 rounded-2xl hover:border-sky-400 hover:bg-sky-50/40 transition-colors flex flex-col items-center gap-3"
              >
                {isBusy ? (
                  <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-stone-400" />
                )}
                <span className="text-sm font-bold text-stone-900">اختر صورة منتجك</span>
                <span className="text-xs text-stone-500">
                  صورة من هاتفك مباشرة — JPG أو PNG
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) loadFile(file);
                  e.target.value = '';
                }}
              />

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  ثلاث نصائح ترفع جودة الصورة قبل أن تصوّر
                </span>
                <ul className="space-y-1 text-[11px] text-amber-900 leading-relaxed">
                  <li>• صوّر بجانب نافذة نهاراً، وأطفئ لمبة السقف — ضوء النافذة أفضل من أي استوديو منزلي.</li>
                  <li>• لا تستخدم الفلاش أبداً: يسطّح المنتج ويصنع ظلاً قاسياً خلفه.</li>
                  <li>• ضع ورقة بيضاء أو قماشاً أبيض خلف المنتج وتحته — هذا وحده يصنع نصف الفرق.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
              {/* المعاينة */}
              <div className="space-y-3">
                <div className="relative bg-stone-100 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center">
                  <canvas
                    ref={beforeCanvasRef}
                    className="max-w-full h-auto block"
                    style={{ maxHeight: '54vh' }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${100 - compare}%)` }}
                  >
                    <canvas
                      ref={afterCanvasRef}
                      className="max-w-full h-auto block"
                      style={{ maxHeight: '54vh' }}
                    />
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
                    بعد
                  </span>
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-white">
                    قبل
                  </span>
                </div>

                <div className="space-y-1">
                  <input
                    id="input-studio-compare"
                    type="range"
                    min={0}
                    max={100}
                    value={compare}
                    onChange={(e) => setCompare(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <p className="text-[11px] text-stone-500 text-center">
                    حرّك الشريط لمقارنة صورتك الأصلية بالنتيجة
                  </p>
                </div>
              </div>

              {/* التحكم */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-900">نوع منتجك</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        id={`btn-studio-preset-${preset.id}`}
                        onClick={() => applyPreset(preset.id)}
                        title={preset.hint}
                        className={`px-2.5 py-2 text-[11px] font-bold rounded-xl border transition-colors ${
                          activePreset === preset.id
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {activePreset !== 'custom' && (
                    <p className="text-[11px] text-stone-500">
                      {PRESETS.find((p) => p.id === activePreset)?.hint}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 border-t border-stone-200 pt-3">
                  {sliders.map((slider) => (
                    <div key={slider.key} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-stone-700 flex items-center gap-1.5">
                          {slider.icon}
                          {slider.label}
                        </span>
                        <span className="text-stone-500 font-mono">
                          {settings[slider.key] as number}
                        </span>
                      </div>
                      <input
                        id={`input-studio-${slider.key}`}
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        value={settings[slider.key] as number}
                        onChange={(e) => updateSetting(slider.key, Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-stone-200 pt-3">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    مقاس النشر
                  </span>
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      id={`btn-studio-format-${f.id}`}
                      onClick={() => setFormatId(f.id)}
                      className={`w-full px-3 py-2 text-[11px] font-bold rounded-xl border transition-colors flex items-center justify-between ${
                        formatId === f.id
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className="opacity-70">
                        {f.width}×{f.height}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 border-t border-stone-200 pt-3">
                  <button
                    id="btn-studio-download"
                    onClick={download}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    نزّل الصورة جاهزة
                  </button>
                  <button
                    onClick={reset}
                    className="w-full py-2 bg-white border border-stone-300 text-stone-700 text-[11px] font-bold rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    صورة أخرى
                  </button>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    المعالجة تجري داخل متصفحك بالكامل. صورتك لا تُرسل إلى أي خادم ولا تُحفظ في أي مكان.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
