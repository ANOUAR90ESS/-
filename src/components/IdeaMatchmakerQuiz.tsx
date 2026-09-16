import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  RefreshCcw 
} from 'lucide-react';
import { ProjectIdea } from '../types';
import { PROJECT_IDEAS } from '../data/projectsData';

interface IdeaMatchmakerQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectIdea) => void;
}

export const IdeaMatchmakerQuiz: React.FC<IdeaMatchmakerQuizProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState({
    capital: '',
    time: '',
    skill: '',
    location: '',
  });

  const [matchedProjects, setMatchedProjects] = useState<ProjectIdea[]>([]);

  if (!isOpen) return null;

  const calculateMatches = () => {
    // Scoring system
    const scored = PROJECT_IDEAS.map((proj) => {
      let score = 0;

      // Capital match
      if (answers.capital === 'zero') {
        if (proj.capitalRange.min === 0) score += 4;
        else if (proj.capitalRange.min <= 50) score += 1;
      } else if (answers.capital === 'low') {
        if (proj.capitalRange.min <= 100) score += 3;
      } else {
        score += 2; // Any capital
      }

      // Skill match
      if (answers.skill === 'digital' && proj.category === 'digital') score += 4;
      if (answers.skill === 'crafts' && proj.category === 'food-crafts') score += 4;
      if (answers.skill === 'services' && proj.category === 'services') score += 4;
      if (answers.skill === 'commerce' && proj.category === 'micro-commerce') score += 4;

      // Location match
      if (answers.location === 'online' && proj.workLocation.includes('المنزل بالكامل')) score += 3;
      if (answers.location === 'home_prep' && (proj.workLocation.includes('المنزل') || proj.workLocation.includes('مطبخ'))) score += 3;
      if (answers.location === 'mobile' && proj.workLocation.includes('ميداني')) score += 3;

      return { proj, score };
    });

    scored.sort((a, b) => b.score - a.score);
    setMatchedProjects(scored.slice(0, 3).map((s) => s.proj));
    setStep(5); // Show results
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ capital: '', time: '', skill: '', location: '' });
    setMatchedProjects([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-quiz"
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                اختبار تحديد المشروع الأنسب لك
              </h2>
              <p className="text-xs text-stone-500">
                4 أسئلة سريعة لاكتشاف الفكرة المتوافقة مع ظروفك وميزانيتك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Steps */}
        <div className="p-5 text-xs text-stone-700 space-y-4">
          
          {step < 5 && (
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold mb-2">
              <span>السؤال {step} من 4</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-5 h-1.5 rounded-full transition-colors ${
                      s <= step ? 'bg-emerald-600' : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Question 1: Capital */}
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                1. كم رأس المال المتاح لديك حالياً للبدء؟
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'zero', title: '0$ لا أملك أي رأس مال', desc: 'أريد مشاريع تعتمد فقط على هاتفي أو مهارتي الشخصية' },
                  { id: 'low', title: 'ميزانية بسيطة ($30 - $100)', desc: 'لشراء عينات أو تغليف بسيط أو أدوات أولية' },
                  { id: 'medium', title: 'ميزانية مرنة ($100 - $300+)', desc: 'لشراء معدات خفيفة أو بضائع سريعة الدوران' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, capital: opt.id });
                      setStep(2);
                    }}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      answers.capital === opt.id 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900 block text-xs mb-0.5">{opt.title}</span>
                      <span className="text-stone-500 text-[11px]">{opt.desc}</span>
                    </div>
                    {answers.capital === opt.id && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Time */}
          {step === 2 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                2. كم ساعة يمكنك تخصيصها للمشروع يومياً؟
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'minimal', title: 'ساعة إلى ساعتين يومياً', desc: 'دخل إضافي خفيف بجانب دراستي أو وظيفتي الأساسية' },
                  { id: 'part_time', title: '2 إلى 4 ساعات يومياً', desc: 'التزام جزئي مستمر لتحقيق دخل شهري مجزٍ' },
                  { id: 'full_time', title: 'تفرغ شبه كامل (5+ ساعات)', desc: 'أريد بناء مشروعي التجاري الأساسي والانطلاق بقوة' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, time: opt.id });
                      setStep(3);
                    }}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      answers.time === opt.id 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900 block text-xs mb-0.5">{opt.title}</span>
                      <span className="text-stone-500 text-[11px]">{opt.desc}</span>
                    </div>
                    {answers.time === opt.id && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Skills */}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                3. ما هو المجال الأقرب لاهتماماتك ومهاراتك؟
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'digital', title: 'الإنترنت، السوشيال ميديا والتصميم', desc: 'كتابة، تعديل صور، إدارة صفحات، منتجات رقمية' },
                  { id: 'crafts', title: 'الطبخ، المأكولات، وصناعة الحرف اليدوية', desc: 'تجهيز وجبات، خلطات بهارات، شموع عطرية' },
                  { id: 'services', title: 'التواصل المباشر وتقديم الخدمات العملية', desc: 'تنسيق هدايا، ترتيب منازل، غسيل سيارات متنقل' },
                  { id: 'commerce', title: 'التجارة المصغرة وإعادة البيع', desc: 'اختيار منتجات تريند وتغليفها وتوصيلها' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, skill: opt.id });
                      setStep(4);
                    }}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      answers.skill === opt.id 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900 block text-xs mb-0.5">{opt.title}</span>
                      <span className="text-stone-500 text-[11px]">{opt.desc}</span>
                    </div>
                    {answers.skill === opt.id && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Location */}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                4. أين تفضل أن تباشر عملك؟
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'online', title: 'من المنزل بالكامل 100% عبر الإنترنت', desc: 'دون الحاجة لمقابلة أحد أو شحن بضائع فعلية' },
                  { id: 'home_prep', title: 'من المنزل مع شحن أو توصيل منتجات مادية', desc: 'صناعة وتجهيز طلبيات في المنزل وتوصيلها للزبائن' },
                  { id: 'mobile', title: 'ميداني مرن أو تقديم خدمات في محيطي', desc: 'زيارة مواقع العملاء أو تقديم خدمات متنقلة' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      answers.location = opt.id;
                      calculateMatches();
                    }}
                    className="w-full text-right p-3.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-all flex items-start justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block text-xs mb-0.5">{opt.title}</span>
                      <span className="text-stone-500 text-[11px]">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Display */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <h3 className="text-sm font-bold text-emerald-950">
                  أفضل 3 مشاريع متطابقة مع إمكانياتك تماماً!
                </h3>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  بناءً على ميزانيتك، وقتك، وميولك الشخصية
                </p>
              </div>

              <div className="space-y-2.5">
                {matchedProjects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-emerald-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-stone-900 text-xs">{proj.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500">
                        <span>رأس المال: {proj.capitalRange.label}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{proj.monthlyProfitRange.label}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProject(proj);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors border border-emerald-200 shrink-0 text-xs flex items-center gap-1"
                    >
                      <span>عرض الخطة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                إعادة الاختبار
              </button>
            </div>
          )}

        </div>

        {/* Back Button for Steps */}
        {step > 1 && step < 5 && (
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              السؤال السابق
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
