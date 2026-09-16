import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { generateIdeasFromAssets, AssetSelection } from "./src/data/assetCombos";

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

    /**
     * يستخرج رقم الميزانية من نص عربي حر ("أقل من 50 دولار"، "$100 - $350"، "20").
     * يأخذ أكبر رقم مذكور لأنه عادةً سقف الميزانية لا أرضيتها.
     */
    const parseBudget = (text: string): number | null => {
      const numbers = (text.match(/\d+(?:[.,]\d+)?/g) || [])
        .map((n) => parseFloat(n.replace(",", "")))
        .filter((n) => !isNaN(n) && n < 100000);
      if (numbers.length === 0) return /بدون|صفر|لا أملك/.test(text) ? 0 : null;
      return Math.max(...numbers);
    };

    const budgetCeiling = parseBudget(userBudget);

    /**
     * يبني نطاق تكلفة لا يتجاوز ميزانية المستخدم أبداً.
     * إن كانت ميزانيته أقل من التكلفة النموذجية للنشاط، يُقال له ذلك صراحةً
     * مع بديل واقعي — لا أن تُعطى له أرقام تناقض ما كتبه.
     */
    const budgetedCost = (typicalMin: number, typicalMax: number, note: string): string => {
      if (budgetCeiling === null) return `$${typicalMin} - $${typicalMax} (${note})`;
      if (budgetCeiling === 0) {
        return `$0 — ابدأ بنظام الطلب المسبق: حصّل ثمن أول طلب قبل شراء أي شيء، فيموّل الزبون مكوّناتك.`;
      }
      if (budgetCeiling < typicalMin) {
        const starter = Math.max(1, Math.round(budgetCeiling * 0.8));
        return `$${starter} من أصل ميزانيتك ($${budgetCeiling}) — وهي أقل من التكلفة المعتادة لهذا النشاط (حوالي $${typicalMin}). ابدأ بنصف الكمية وبنظام الطلب المسبق، وأعد استثمار ربح أول طلبية بدل الاقتراض.`;
      }
      const low = Math.max(0, Math.round(Math.min(typicalMin, budgetCeiling * 0.45)));
      const high = Math.round(Math.min(typicalMax, budgetCeiling));
      return `$${low} - $${high} (${note}) — ضمن ميزانيتك المحددة $${budgetCeiling}`;
    };

    // Helper: generate highly tailored plan if AI models are experiencing 503 spikes or unavailable
    const buildSmartPlan = () => {
      const isDigital = category?.includes("رقمي") || title.includes("سوشيال") || title.includes("تصميم") || title.includes("محتوى") || userLocation.includes("الإنترنت");
      const isFoodOrCraft = category?.includes("حرف") || category?.includes("طعام") || title.includes("أكل") || title.includes("شمع") || title.includes("طبخ") || title.includes("حلويات");
      const isService = category?.includes("خدمات") || title.includes("تنظيف") || title.includes("غسيل") || title.includes("تنسيق") || title.includes("ترتيب");

      let startupCost = budgetedCost(30, 70, "رسوم أولية وتغليف بسيط");
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
        startupCost = budgetedCost(0, 20, "استخدام الهاتف أو الحاسوب واشتراكات رمزية");
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
        startupCost = budgetedCost(40, 120, "خامات أولية وتغليف وملصقات");
        monthlyProfit = "$400 - $1,100 شهرياً";
        breakEven = "14 إلى 21 يوماً";
        targetMarket = "العائلات، المهتمون بالهدايا، زبائن المناسبات والضيافة في نطاق مدينتك.";
        pricing = "احسب تكلفة الخامات بدقة + تكلفة التغليف واضرب في 2.5 إلى 3 لتحديد سعر البيع الرابح.";
      } else if (isService) {
        startupCost = budgetedCost(25, 60, "أدوات عمل أولية ومواد تجهيز");
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

    // Candidate models in order of speed, reliability, and availability
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
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

قيود إلزامية لا تخالفها:
1. التكلفة المبدئية يجب ألا تتجاوز ميزانية المستخدم المذكورة أعلاه إطلاقاً. إن كانت ميزانيته لا تكفي للنشاط، قل ذلك صراحةً واقترح بداية أصغر بنظام الطلب المسبق — لا تعطه رقماً يناقض ما كتبه.
2. اربط الخطوات بمهاراته (${userSkills}) ومكان عمله (${userLocation}) وساعاته (${userHours}) تحديداً، لا بنصائح عامة تصلح لأي شخص.
3. لا تقترح "أنشئ حساب إنستغرام وانشر 3 منشورات" كخطوة أولى إن لم تكن الأنسب فعلاً لهذا النشاط بالذات.

المطلوب: توليد دراسة جدوى وخطة عمل إطلاق سريعة ومختصرة وعملية جداً باللغة العربية بتنسيق JSON حصراً بدون أي كود ماركداون خارج الـ JSON.
يجب أن يكون الـ JSON بالبنية التالية تماماً:
{
  "title": "اسم جذاب ومحدد للمشروع",
  "summary": "ملخص تنفيذي مقنع في جملتين حول سبب نجاح هذا المشروع وسهولة جني الأرباح منه",
  "targetMarket": "وصف العميل المستهدف بدقة وأين تجده",
  "estimatedStartupCost": "التكلفة المبدئية ضمن ميزانية المستخدم المذكورة، أو تنبيه صريح إن كانت ميزانيته لا تكفي",
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

        const response: any = await withTimeout(generatePromise, 10000);

        const responseText = response.text || "{}";
        let planJson;
        try {
          planJson = JSON.parse(responseText.trim());
        } catch (e) {
          const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
          planJson = JSON.parse(cleaned);
        }

        if (planJson && planJson.title && planJson.summary) {
          return res.json({ plan: planJson });
        }
      } catch (err: any) {
        lastError = err;
        // Proceed gracefully to next candidate model
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

  // Asset Scanner: generate bespoke ideas from the combination of assets a user owns
  app.post("/api/scan-assets", async (req, res) => {
    const { selections, city, hoursPerWeek, workStyle } = req.body as {
      selections?: AssetSelection[];
      city?: string;
      hoursPerWeek?: string;
      workStyle?: string;
    };

    const safeSelections: AssetSelection[] = Array.isArray(selections)
      ? selections
          .filter((s) => s && typeof s.label === "string" && s.label.trim().length > 0)
          .slice(0, 30)
          .map((s) => ({
            label: s.label.trim().slice(0, 80),
            keys: Array.isArray(s.keys) ? s.keys.slice(0, 6) : []
          }))
      : [];

    if (safeSelections.length === 0) {
      return res.status(400).json({ error: "لم يتم تحديد أي أصل." });
    }

    const userCity = (city || "").trim().slice(0, 60);
    const userHours = (hoursPerWeek || "10 - 15 ساعة أسبوعياً").slice(0, 60);
    const userStyle = (workStyle || "لا يهم").slice(0, 60);
    const assetList = safeSelections.map((s) => s.label).join("، ");

    // شبكة الأمان: تركيبات محلية تعمل دون أي اتصال
    const localIdeas = () => generateIdeasFromAssets(safeSelections, 4);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        ideas: localIdeas(),
        note: "تم توليد الأفكار بمحرّك التركيبات المحلي."
      });
    }

    const withTimeout = <T>(promise: Promise<T>, ms = 9000): Promise<T> => {
      let timer: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request timed out")), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
    };

    const prompt = `أنت مستشار ريادة أعمال متخصص في المشاريع المصغّرة في العالم العربي.
مهمتك ليست اقتراح أفكار عامة معروفة، بل اكتشاف أفكار تنشأ تحديداً من **تركيبة** الأصول التي يملكها هذا الشخص.

الأصول التي يملكها فعلاً: ${assetList}
المدينة أو البيئة: ${userCity || "غير محددة"}
الوقت المتاح: ${userHours}
أسلوب العمل المفضل: ${userStyle}

قواعد صارمة:
1. كل فكرة يجب أن تنشأ من دمج أصلين أو أكثر من قائمته. اذكر في assetCombo الأصول المستخدمة بنصها كما ورد أعلاه.
2. لا تقترح فكرة يستطيع أي شخص تنفيذها دون أصوله — الميزة يجب أن تكون نابعة مما يملكه هو.
3. اذكر في honestWeakness عيباً حقيقياً صريحاً لكل فكرة، لا تجمّل.
4. التكاليف والأرباح بالدولار وبأرقام واقعية لمشروع مصغّر، لا وعود مبالغ فيها.
5. أجب بصيغة JSON نقية فقط بدون أي نص خارجها.

البنية المطلوبة:
{
  "ideas": [
    {
      "title": "عنوان محدد للفكرة",
      "assetCombo": ["الأصل الأول", "الأصل الثاني"],
      "whyYou": "لماذا هذا الشخص تحديداً قادر على هذه الفكرة بسبب تركيبة أصوله، وما الميزة التي يمنحها له الدمج",
      "whoPays": "من سيدفع بالضبط وأين يوجد",
      "firstStepToday": "خطوة واحدة عملية قابلة للتنفيذ اليوم",
      "startupCost": "التكلفة المبدئية بالدولار",
      "monthlyPotential": "الدخل الشهري الواقعي المتوقع بالدولار",
      "timeToFirstIncome": "المدة حتى أول دخل",
      "honestWeakness": "العيب أو الخطر الحقيقي في هذه الفكرة بصراحة",
      "scaleUp": "كيف تكبر الفكرة بعد نجاحها الأول"
    }
  ]
}
اكتب 4 أفكار مختلفة تماماً عن بعضها.`;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction:
              "أنت مستشار مشاريع مصغّرة. تكتشف الفرص من تركيبة أصول الشخص لا من قوائم جاهزة. أجب بـ JSON نقي فقط.",
            responseMimeType: "application/json"
          }
        });

        const response: any = await withTimeout(generatePromise, 12000);
        const responseText = response.text || "{}";

        let parsed;
        try {
          parsed = JSON.parse(responseText.trim());
        } catch {
          const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        }

        const rawIdeas = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.ideas)
          ? parsed.ideas
          : [];

        if (rawIdeas.length > 0) {
          const ideas = rawIdeas.slice(0, 4).map((idea: any, i: number) => ({
            id: `ai-${Date.now()}-${i}`,
            title: idea.title || idea.project_name || "فكرة مخصصة",
            assetCombo: Array.isArray(idea.assetCombo) ? idea.assetCombo.slice(0, 4) : [],
            whyYou: idea.whyYou || idea.description || "",
            whoPays: idea.whoPays || "",
            firstStepToday: idea.firstStepToday || "",
            startupCost: idea.startupCost || "غير محدد",
            monthlyPotential: idea.monthlyPotential || "غير محدد",
            timeToFirstIncome: idea.timeToFirstIncome || "غير محدد",
            honestWeakness: idea.honestWeakness || "",
            scaleUp: idea.scaleUp || ""
          }));
          return res.json({ ideas });
        }
      } catch (err: any) {
        lastError = err;
        // Proceed gracefully to next candidate model
      }
    }

    console.info("Falling back to local combination engine for asset scan:", lastError?.message);
    return res.json({
      ideas: localIdeas(),
      note: "تم توليد الأفكار بمحرّك التركيبات المحلي نظراً لضغط مؤقت على خوادم الذكاء الاصطناعي."
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
