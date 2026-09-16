import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Key, 
  Calculator, 
  Sparkles, 
  Users, 
  Clock, 
  MapPin,
  Bookmark
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectDetailModalProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCalculatorWithProject: (project: ProjectIdea) => void;
  onOpenAiPlannerWithProject: (project: ProjectIdea) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenCalculatorWithProject,
  onOpenAiPlannerWithProject,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-project-details"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-start justify-between gap-4 bg-stone-50/50">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                {project.badge}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-stone-200/70 text-stone-700">
                سهولة التنفيذ: {project.easeLevel}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-100 text-teal-800">
                هامش الربح: {project.profitMargin}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(project.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title={isFavorite ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-stone-700">
          
          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-100/70 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block mb-0.5">رأس المال التقريبي</span>
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {project.capitalRange.label}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">الربح الشهري المتوقع</span>
              <span className="font-bold text-emerald-800 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {project.monthlyProfitRange.label}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">مكان وساعات العمل</span>
              <span className="font-semibold text-stone-800 block">
                {project.workLocation} ({project.dailyHours})
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">سرعة جني الأرباح</span>
              <span className="font-semibold text-stone-800 block">
                خلال {project.timeToRevenue}
              </span>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              لماذا هذا المشروع سهل ومربح للغاية؟
            </h3>
            <p className="leading-relaxed text-stone-600">
              {project.detailedDescription}
            </p>
          </div>

          {/* Unit Economics Simulation */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <h4 className="font-bold text-emerald-950 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                نموذج أرباح الوحدة الواقعي (Unit Economics)
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenCalculatorWithProject(project);
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                تعديل وحساب هذه الأرقام في الحاسبة &larr;
              </button>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed mb-3">
              {project.unitEconomics.exampleExplanation}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">تكلفة الوحدة</span>
                <span className="font-bold text-stone-900">${project.unitEconomics.costPerUnit}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">سعر البيع المقترح</span>
                <span className="font-bold text-emerald-700">${project.unitEconomics.salePrice}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="text-stone-500 block text-[11px]">صافي ربح القطعة</span>
                <span className="font-bold text-emerald-800">
                  ${project.unitEconomics.salePrice - project.unitEconomics.costPerUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ما تحتاجه بالضبط للبدء اليوم
            </h3>
            <ul className="space-y-2">
              {project.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Steps */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5">
              خطة التنفيذ في 4 خطوات عملية
            </h3>
            <div className="space-y-2.5">
              {project.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing & Getting First Clients */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-700" />
              استراتيجية جلب أول 10 زبائن
            </h3>
            <div className="space-y-2">
              {project.marketingStrategy.map((strat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{strat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips & Risk Mitigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <Key className="w-4 h-4 text-amber-700" />
                سر النجاح ومضاعفة الأرباح
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">
                {project.secretToSuccess}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                تجنب المخاطر والخسارة
              </span>
              <p className="text-xs text-rose-950 leading-relaxed">
                {project.potentialRisksAndFix}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCalculatorWithProject(project);
              }}
              className="px-4 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-emerald-700" />
              حاسبة أرباح المشروع
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAiPlannerWithProject(project);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            توليد خطة إطلاق مخصصة بالذكاء الاصطناعي
          </button>
        </div>

      </div>
    </div>
  );
};
