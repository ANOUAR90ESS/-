import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Copy, 
  Check, 
  Loader2, 
  FileText 
} from 'lucide-react';
import { ProjectIdea, BusinessPlanResult } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';

interface AiPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectIdea | null;
}

export const AiPlanGenerator: React.FC<AiPlanGeneratorProps> = ({
  isOpen,
  onClose,
  initialProject,
}) => {
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('خدمات ومشاريع رقمية من المنزل');
  const [budget, setBudget] = useState<string>('أقل من 50 دولار (أو بدون رأس مال)');
  const [hoursPerDay, setHoursPerDay] = useState<string>('2 - 3 ساعات يومياً');
  const [skills, setSkills] = useState<string>('استخدام الهاتف والإنترنت، والتواصل الجيد');
  const [locationPreference, setLocationPreference] = useState<string>('من المنزل بالكامل');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<BusinessPlanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialProject) {
      setProjectTitle(initialProject.title);
      setCategory(initialProject.badge);
      setBudget(initialProject.capitalRange.label);
      setHoursPerDay(initialProject.dailyHours);
      setSkills(initialProject.requirements.slice(0, 2).join('، '));
      setLocationPreference(initialProject.workLocation);
    } else if (!projectTitle) {
      setProjectTitle('مشروع إدارة صفحات السوشيال ميديا والتسويق للمحلات المحلية');
    }
  }, [initialProject, isOpen]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectTitle,
          category,
          budget,
          hoursPerDay,
          skills,
          locationPreference,
          targetAudience: 'المستهلكون وأصحاب الأعمال المحليون والجمهور عبر السوشيال ميديا',
        }),
      });

      const data = await response.json().catch(() => null);

      if (data && data.plan) {
        setGeneratedPlan(data.plan);
      } else {
        throw new Error(data?.details || data?.error || 'حدث ضغط مؤقت في خادم الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMsg(err.message || 'تعذر توليد الخطة حالياً، يرجى إعادة المحاولة.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    const textToCopy = `خطة عمل ودراسة جدوى: ${generatedPlan.title}
الملخص: ${generatedPlan.summary}
الجمهور المستهدف: ${generatedPlan.targetMarket}
التكلفة المتوقعة: ${generatedPlan.estimatedStartupCost}
الربح الشهري المتوقع: ${generatedPlan.expectedMonthlyProfit}
فترة استرداد رأس المال: ${generatedPlan.breakEvenDays}

خطوات البدء السريعة:
${generatedPlan.quickSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

خطة الأسابيع الأربعة:
${generatedPlan.weeklyRoadmap.map((w) => `${w.week}: ${w.task}`).join('\n')}

نصائح لتجنب المخاطر:
${generatedPlan.riskMitigation.map((r) => `- ${r}`).join('\n')}

نصيحة التسعير: ${generatedPlan.pricingAdvice}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-ai-plan-generator"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center border border-emerald-500/30">
              <Bot className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                دراسة الجدوى وخطة الإطلاق الذكية (Gemini AI)
                <span className="text-[10px] font-semibold bg-emerald-700/70 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600">
                  خطة 7 أيام
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90">
                صمم خطة عمل ودراسة جدوى مخصصة حسب ميزانيتك ووقتك المتاح
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-800/80 text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Input Form */}
          <form onSubmit={handleGenerate} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
            
            <div>
              <label htmlFor="input-project-title" className="block font-bold text-stone-800 mb-1">
                فكرة أو اسم المشروع المقترح:
              </label>
              <input
                id="input-project-title"
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="مثلاً: متجر هدايا منسقة، إدارة حسابات تيك توك، صناعة شموع عطرية..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-budget" className="block font-bold text-stone-800 mb-1">
                  الميزانية المتاحة لديك:
                </label>
                <select
                  id="input-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="0$ (بدون أي رأس مال إطلاقاً)">0$ (بدون أي رأس مال إطلاقاً)</option>
                  <option value="أقل من 50 دولار">أقل من 50 دولار (رأس مال رمزي)</option>
                  <option value="50$ - 150$">50$ - 150$</option>
                  <option value="200$ - 500$">200$ - 500$</option>
                </select>
              </div>

              <div>
                <label htmlFor="input-hours" className="block font-bold text-stone-800 mb-1">
                  ساعات العمل اليومية المتاحة:
                </label>
                <select
                  id="input-hours"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ساعة واحدة يومياً (وقت جزئي خفيف)">ساعة واحدة يومياً (وقت جزئي خفيف)</option>
                  <option value="2 - 3 ساعات يومياً">2 - 3 ساعات يومياً</option>
                  <option value="4 - 5 ساعات يومياً">4 - 5 ساعات يومياً</option>
                  <option value="تفرغ كامل (6+ ساعات)">تفرغ كامل (6+ ساعات)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-location" className="block font-bold text-stone-800 mb-1">
                  مكان العمل المفضل:
                </label>
                <select
                  id="input-location"
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="من المنزل عبر الإنترنت بالكامل">من المنزل عبر الإنترنت بالكامل</option>
                  <option value="من مطبخ أو ورشة المنزل">من مطبخ أو ورشة المنزل</option>
                  <option value="ميداني مرن أو تقديم خدمات متنقلة">ميداني مرن أو تقديم خدمات متنقلة</option>
                </select>
              </div>

              <div>
                <label htmlFor="input-skills" className="block font-bold text-stone-800 mb-1">
                  أبرز مهاراتك أو اهتماماتك:
                </label>
                <input
                  id="input-skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="مثلاً: تصميم كانفا، طهي، لباقة في الحديث، ترتيب وتنظيم..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                id="btn-submit-ai-plan"
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ تحليل الجدوى وهيكلة الخطة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد دراسة الجدوى وخطة الإطلاق</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {/* Result Display */}
          {generatedPlan && (
            <div className="space-y-5 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm animate-fadeIn">
              
              {/* Result Header & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3.5">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    خطة تنفيذية مخصصة
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {generatedPlan.title}
                  </h3>
                </div>

                <button
                  onClick={handleCopy}
                  className="self-start sm:self-auto px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-xs border border-stone-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم نسخ الخطة!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>نسخ الخطة بالكامل</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs leading-relaxed text-stone-700">
                <span className="font-bold text-stone-900 block mb-1">الملخص التنفيذي:</span>
                {generatedPlan.summary}
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <span className="text-stone-500 text-[11px] block mb-0.5">التكلفة المبدئية</span>
                  <span className="font-bold text-stone-900 text-xs">{generatedPlan.estimatedStartupCost}</span>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <span className="text-stone-500 text-[11px] block mb-0.5">الربح الشهري المتوقع</span>
                  <span className="font-bold text-emerald-800 text-xs">{generatedPlan.expectedMonthlyProfit}</span>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <span className="text-stone-500 text-[11px] block mb-0.5">استرداد رأس المال</span>
                  <span className="font-bold text-stone-900 text-xs">{generatedPlan.breakEvenDays}</span>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <span className="font-bold text-stone-900 block mb-1 text-xs">
                  العملاء المستهدفون بدقة:
                </span>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {generatedPlan.targetMarket}
                </p>
              </div>

              {/* Quick Launch Steps (48 Hours) */}
              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  خطوات الإطلاق السريعة (خلال أول 48 ساعة):
                </h4>
                <div className="space-y-1.5">
                  {generatedPlan.quickSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-stone-50 rounded-lg text-xs">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-stone-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Roadmap */}
              <div>
                <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-700" />
                  خطة الإنجاز للأشهر الأولى (خريطة طريق 4 أسابيع):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedPlan.weeklyRoadmap.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <span className="font-bold text-emerald-900 block text-[11px] mb-1">
                        {item.week}
                      </span>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {item.task}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Mitigation & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block text-xs mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    تجنب المخاطر وضمان الأمان
                  </span>
                  <ul className="space-y-1 text-[11px] text-amber-950">
                    {generatedPlan.riskMitigation.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-950 block text-xs mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    استراتيجية التسعير الذكي
                  </span>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    {generatedPlan.pricingAdvice}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
