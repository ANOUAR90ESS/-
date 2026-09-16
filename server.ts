import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

// AI Custom Feasibility & Project Strategy Generator
  app.post("/api/generate-plan", async (req, res) => {
    const { 
      projectTitle, 
      category, 
      budget, 
      hoursPerDay, 
      skills, 
      locationPreference, 
      targetAudience 
    } = req.body;

    const title = projectTitle?.trim() || "مشروع منزلي مصغر ومربح";
    const userBudget = budget || "أقل من 50 دولار";
    const userHours = hoursPerDay || "2 - 3 ساعات يومياً";
    const userSkills = skills || "التواصل الجيد والإنترنت والتنظيم";
    const userLocation = locationPreference || "من المنزل";

    // Helper: generate highly tailored plan if AI models are experiencing 503 spikes or unavailable
    const buildSmartPlan = () => {
      const isDigital = category?.includes("رقمي") || title.includes("سوشيال") || title.includes("تصميم") || title.includes("محتوى") || userLocation.includes("الإنترنت");
      const isFoodOrCraft = category?.includes("حرف") || category?.includes("طعام") || title.includes("أكل") || title.includes("شمع") || title.includes("طبخ") || title.includes("حلويات");
      const isService = category?.includes("خدمات") || title.includes("تنظيف") || title.includes("غسيل") || title.includes("تنسيق") || title.includes("ترتيب");

      let startupCost = "$30 - $70 (رسوم أولية وتغليف بسيط)";
      let monthlyProfit = "$450 - $1,250 شهرياً مع التفرغ الجزئي";
      let breakEven = "10 إلى 18 يوماً";
      let targetMarket = "العملاء المحليون والمتابعون المهتمون بالجودة والسرعة عبر السوشيال ميديا وواتساب للأعمال.";
      let pricing = "اعتمد تسعيراً مبنياً على القيمة المضافة مع هامش ربح 60% إلى 70%، وقدم باقة دخول ترويجية لأول 5 عملاء.";

      let quickSteps = [
        `تحديد العرض المميز لمشروع (${title}) وإعداد نموذج أو عينة أولية مصورة بجودة عالية.`,
        "إنشاء حساب مخصص للأعمال على إنستغرام وتيك توك وتجهيز رابط واتساب مباشر.",
        "نشر أول 3 منشورات وفيديوهات قصيرة توثق حل المشكلة وقيمة الخدمة/المنتج.",
        "مراسلة أول 10 إلى 20 عميل محتمل أو معارف لعرض تجربة خاصة بسعر افتتاحي."
      ];

      let weeklyRoadmap = [
        { week: "الأسبوع 1", task: `التجهيز الكامل، حصر المستلزمات بأقل من ${userBudget}، وتصوير العينات.` },
        { week: "الأسبوع 2", task: "إطلاق الحساب وبدء نشر المحتوى وجذب أول 3 مشترين وتقييمات إيجابية." },
        { week: "الأسبوع 3", task: "تنفيذ الطلبيات ومتابعة العملاء والحصول على توصيات وشهادات رضا (Testimonials)." },
        { week: "الأسبوع 4", task: "حساب صافي الأرباح وإعادة استثمار جزء منها في تحسين الأدوات وتوسيع الانتشار." }
      ];

      let riskMitigation = [
        "العمل بنظام الطلب المسبق (Pre-order) لتفادي شراء مواد غير مستخدمة.",
        "الاعتماد على التسويق بالمحتوى العضوي وتوصيات الزبائن لتفادي تكاليف الإعلانات الباهظة.",
        "طلب عربون مقدماً بنسبة 40-50% لتأكيد جدية كل زبون وتغطية المصاريف المباشرة."
      ];

      if (isDigital) {
        startupCost = "0$ - 20$ (استخدام الهاتف أو الحاسوب واشتراكات مجانية/رمزية)";
        monthlyProfit = "$500 - $1,800 شهرياً";
        breakEven = "3 إلى 7 أيام من أول عميل";
        targetMarket = "أصحاب المتاجر والمشاريع الناشئة وصناع المحتوى والباحثون عن حلول سريعة.";
        pricing = "حدد سعراً ثابتاً لكل مهمة أو باقة شهرية تبدأ من $75-$150 للمشروع الصغير، مع طلب 50% دفعة مقدمة.";
        quickSteps = [
          `تجهيز بورتفوليو بسيط (نماذج أعمال سابقة أو نماذج تجريبية في مجال ${title}).`,
          "البحث في مجتمعات الأعمال والمتاجر المحلية التي تعاني من ضعف المحتوى ومراسلتهم بحل عملي.",
          "تقديم تدقيق أو عينة مجانية لأول عميلين لبناء الثقة ونيل توصيات موثقة.",
          "جدولة مهام العمل يومياً بمعدل " + userHours + " لضمان التسليم في الموعد المحدد."
        ];
      } else if (isFoodOrCraft) {
        startupCost = "$40 - $120 (خامات أولية وتغليف احترافي وملصقات خاصة)";
        monthlyProfit = "$400 - $1,100 شهرياً";
        breakEven = "14 إلى 21 يوماً";
        targetMarket = "العائلات، المهتمون بالهدايا، زبائن المناسبات والضيافة في نطاق مدينتك.";
        pricing = "احسب تكلفة الخامات بدقة + تكلفة التغليف واضرب في 2.5 إلى 3 لتحديد سعر البيع الرابح.";
      } else if (isService) {
        startupCost = "$25 - $60 (أدوات عمل أولية ومواد تنظيف أو تجهيز)";
        monthlyProfit = "$600 - $1,500 شهرياً";
        breakEven = "أول أسبوع من بدء تقديم الخدمة";
        targetMarket = "سكان الأحياء السكنية المجاورة وأصحاب السيارات وملاك المنازل المشغولون.";
      }

      return {
        title: title,
        summary: `خطة عمل تنفيذية لمشروع (${title}) ترتكز على إمكانياتك (${userSkills}) وتستثمر ${userHours} لتحقيق دخل متنامٍ بأقل مخاطرة مالية.`,
        targetMarket,
        estimatedStartupCost: startupCost,
        expectedMonthlyProfit: monthlyProfit,
        breakEvenDays: breakEven,
        quickSteps,
        weeklyRoadmap,
        riskMitigation,
        pricingAdvice: pricing
      };
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ plan: buildSmartPlan() });
    }

    // Helper to race API call with timeout
    const withTimeout = <T>(promise: Promise<T>, ms = 6500): Promise<T> => {
      let timer: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request timed out")), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
    };

    // Try multiple models in case of high demand / 503 spike on specific versions
    const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `أنت خبير ومستشار عالمي في ريادة الأعمال وتأسيس المشاريع الصغيرة والمربحة (Micro-enterprises & Lean Startups).
المستخدم يبحث عن أفكار مشاريع سهلة ومربحة وخطة عمل واقعية مبسطة وسريعة التنفيذ.
بيانات المستخدم والمشروع:
- اسم أو فكرة المشروع: ${title}
- التصنيف: ${category || "خدمي أو تجاري مصغر أو رقمي من المنزل"}
- الميزانية المتاحة: ${userBudget}
- الساعات المتاحة يومياً: ${userHours}
- المهارات والخبرات: ${userSkills}
- مكان العمل المفضل: ${userLocation}
- الفئة المستهدفة: ${targetAudience || "عامة الجمهور والمهتمين بالخدمات السريعة"}

المطلوب: توليد دراسة جدوى وخطة عمل إطلاق سريعة ومختصرة وعملية جداً باللغة العربية بتنسيق JSON حصراً بدون أي كود ماركداون خارج الـ JSON.
يجب أن يكون الـ JSON بالبنية التالية تماماً:
{
  "title": "اسم جذاب ومحدد للمشروع",
  "summary": "ملخص تنفيذي مقنع في جملتين حول سبب نجاح هذا المشروع وسهولة جني الأرباح منه",
  "targetMarket": "وصف العميل المستهدف بدقة وأين تجده",
  "estimatedStartupCost": "تفصيل التكلفة المبدئية التقديرية بدقة",
  "expectedMonthlyProfit": "الربح الصافي المتوقع شهرياً بالدولار أو العملة المحلية",
  "breakEvenDays": "المدة المتوقعة لاسترداد رأس المال",
  "quickSteps": [
    "خطوة 1 مفصلة وعملية في أول 48 ساعة",
    "خطوة 2 للتسويق وجلب أول زبون",
    "خطوة 3 لتنفيذ الخدمة/المنتج باحترافية",
    "خطوة 4 للمحافظة على العميل والتوسع"
  ],
  "weeklyRoadmap": [
    { "week": "الأسبوع 1", "task": "مهمة إنجاز الأسبوع الأول" },
    { "week": "الأسبوع 2", "task": "مهمة إنجاز الأسبوع الثاني" },
    { "week": "الأسبوع 3", "task": "مهمة إنجاز الأسبوع الثالث" },
    { "week": "الأسبوع 4", "task": "مهمة إنجاز الأسبوع الرابع" }
  ],
  "riskMitigation": [
    "نصيحة أمان 1 لتجنب الخسارة",
    "نصيحة أمان 2 لتقليل التكاليف",
    "نصيحة أمان 3 لضمان الجودة"
  ],
  "pricingAdvice": "نصيحة تسعير ذكية لحساب السعر وهامش الربح دون حرق الأسعار"
}`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: "أنت مستشار استثماري ودراسات جدوى ريادية للمشاريع الصغيرة والمتناهية الصغر. أجب بصيغة JSON نقية ومباشرة بدون مقدمات أو علامات إضافية.",
            responseMimeType: "application/json"
          }
        });

        const response: any = await withTimeout(generatePromise, 7000);

        const responseText = response.text || "{}";
        let planJson;
        try {
          planJson = JSON.parse(responseText.trim());
        } catch (e) {
          const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          planJson = JSON.parse(cleaned);
        }

        if (planJson && planJson.title && planJson.summary) {
          return res.json({ plan: planJson });
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} attempt failed (e.g. 503 spike or timeout), trying next candidate:`, err?.message || err);
        lastError = err;
        // Continue to next candidate model
      }
    }

    // If all models encountered temporary 503 spikes or network errors,
    // gracefully return the tailored smart plan so user is NEVER blocked
    console.info("Falling back to pre-calculated tailored business plan due to API demand spike:", lastError?.message);
    return res.json({ 
      plan: buildSmartPlan(),
      note: "تم تجهيز دراسة الجدوى بالاعتماد على خوارزمية الجدوى الذكية نظراً للضغط المؤقت على خوادم الذكاء الاصطناعي."
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
