export type Language = 'ar' | 'en';

export interface LocalizedProjectContent {
  title: string;
  badge: string;
  shortDescription: string;
  detailedDescription: string;
  capitalLabel: string;
  profitLabel: string;
  profitMargin: string;
  easeLevel: 'سهل جداً' | 'سهل' | 'متوسط' | 'Very Easy' | 'Easy' | 'Moderate';
  timeToRevenue: string;
  workLocation: string;
  dailyHours: string;
  requirements: string[];
  actionSteps: string[];
  marketingStrategy: string[];
  secretToSuccess: string;
  potentialRisksAndFix: string;
  unitEconomics: {
    unitName: string;
    exampleExplanation: string;
  };
  tags: string[];
}

export const PROJECT_TRANSLATIONS_EN: Record<string, LocalizedProjectContent> = {
  'social-media-management': {
    title: 'Social Media Management for Local Businesses',
    badge: 'Zero Capital • Rapid Returns',
    shortDescription: 'Manage Instagram and TikTok accounts for local restaurants, salons, clinics, and shops with content creation and customer care.',
    detailedDescription: 'Thousands of local businesses rely on social media to attract customers, yet owners lack the time to shoot, design, and reply. You can offer a monthly retainer including 3–4 posts weekly, stories, and direct message handling—generating steady recurring income.',
    capitalLabel: '$0 - $20',
    profitLabel: '$400 - $1,800/mo',
    profitMargin: '85% - 95%',
    easeLevel: 'Easy',
    timeToRevenue: '7 - 14 Days',
    workLocation: '100% Remote / From Home',
    dailyHours: '2 - 3 Hours',
    requirements: [
      'Smartphone or laptop with internet access',
      'Proficiency in accessible design tools like Canva',
      'Understanding Reels/TikTok algorithms and hook drafting',
      'Prompt, courteous customer messaging etiquette'
    ],
    actionSteps: [
      'Build a sample Instagram portfolio featuring 6 mock designs for a restaurant or salon.',
      'Target a specific local district and identify 30 shops with inactive or weak profiles.',
      'Reach out with a tailored message, free profile audit, and a complimentary gift story.',
      'Offer a promotional starter trial to your first two clients in exchange for reviews and a 3-month retainer.'
    ],
    marketingStrategy: [
      'Brief friendly in-person visits to local business owners or managers',
      'Polite, targeted direct messages on Instagram with a brief audit video showing quick wins',
      'Sharing actionable growth tips on LinkedIn and TikTok to build authority'
    ],
    secretToSuccess: 'Focus on driving measurable foot traffic and sales with clear promos and lightning-fast replies, rather than vanity follower metrics.',
    potentialRisksAndFix: 'Scope creep with demanding clients: set strict boundaries on revisions and communication hours in a written agreement.',
    unitEconomics: {
      unitName: 'Monthly Retainer Client',
      exampleExplanation: '4 clients at $250 each = $1,000/mo with minimal overhead (Canva Pro at ~$15).'
    },
    tags: ['Social Media', 'Marketing', 'Zero Capital', 'Remote Work', 'Monthly Retainer']
  },
  'gift-boxes-packaging': {
    title: 'Luxury Gift Box Packaging & Event Favors',
    badge: 'High Demand • 60% Margin',
    shortDescription: 'Curate and design elegant custom gift boxes and party favors for graduations, newborn arrivals, holidays, and celebrations.',
    detailedDescription: 'The custom gift market delivers exceptional margins because customers gladly pay for tasteful, ready-made gifts that eliminate the hassle of hunting and packaging. Operate on pre-orders with upfront deposits that fully fund material costs.',
    capitalLabel: '$50 - $150',
    profitLabel: '$500 - $2,200/mo',
    profitMargin: '55% - 70%',
    easeLevel: 'Very Easy',
    timeToRevenue: '3 - 7 Days',
    workLocation: 'From Home',
    dailyHours: '2 - 4 Hours',
    requirements: [
      'Artistic flair in color matching and ribbon styling',
      'Wholesale rigid boxes, satin ribbons, and premium wrapping paper',
      'Mini photo/card printer for personalized gift notes',
      'Clean lighting setup for high-aesthetic product photography'
    ],
    actionSteps: [
      'Buy 3 sample box styles and assemble 3 hero packages (Graduation, Newborn, Corporate/Executive).',
      'Film sensory ASMR packaging clips and showcase them across TikTok and Instagram Reels.',
      'Offer same-day local express delivery for last-minute gift emergencies as a competitive edge.',
      'Require a 50% upfront deposit to secure inventory and guarantee customer commitment.'
    ],
    marketingStrategy: [
      'Aesthetic TikTok and Reels highlighting satisfying unboxing and heartfelt emotions',
      'Exclusive holiday packages pitched directly to corporate offices and medical clinics',
      'Word-of-mouth incentives: slip a 15% discount card for the recipient’s next order inside every box'
    ],
    secretToSuccess: 'Small memorable touches—like a handwritten calligraphy note and signature fragrance mist inside the tissue paper—create viral loyalty.',
    potentialRisksAndFix: 'Fragile items damaged in transit: partner with dedicated couriers and use protective shredded kraft paper and bubble pillows.',
    unitEconomics: {
      unitName: 'Curated Gift Box',
      exampleExplanation: 'Selling 35 boxes at a $30 net margin each = $1,050 monthly profit.'
    },
    tags: ['Gifts', 'Packaging', 'Events', 'Home-Based', 'Pre-Order']
  },
  'digital-products-templates': {
    title: 'Digital Products & Ready-to-Use Templates',
    badge: 'Passive Income • 98% Margin',
    shortDescription: 'Design and sell bookkeeping Excel sheets, digital Notion planners, Canva social bundles, and interactive PDF guides.',
    detailedDescription: 'One of the most scalable business models: build the digital asset once and sell it thousands of times with zero inventory and zero fulfillment shipping costs. Instant automatic delivery via secure download links.',
    capitalLabel: '$0 - $30',
    profitLabel: '$300 - $2,500/mo',
    profitMargin: '95% - 99%',
    easeLevel: 'Very Easy',
    timeToRevenue: '4 - 10 Days',
    workLocation: '100% Remote / Laptop',
    dailyHours: '1 - 2 Hours',
    requirements: [
      'Laptop and basic spreadsheet or Canva design skills',
      'Free storefront account on platforms like Gumroad, Payhip, or Etsy',
      'Ability to solve a specific pain point (e.g. personal budget tracker, meal planner)'
    ],
    actionSteps: [
      'Choose a validated niche: personal financial budgeting, student revision planners, or salon price lists.',
      'Build a modern, intuitive template with a 2-minute video walkthrough explaining how to use it.',
      'Set up a digital storefront with mockups and instant download automation.',
      'Publish organic walkthrough videos demonstrating the problem your template solves.'
    ],
    marketingStrategy: [
      'Short tutorial videos showing "How I organize my monthly budget in 5 minutes"',
      'Giving away a simplified "Lite" version free in exchange for email newsletter signups',
      'Cross-promoting in relevant Reddit, Facebook, or Telegram professional communities'
    ],
    secretToSuccess: 'Keep templates clean, functional, and self-explanatory. Include pre-filled dummy examples so the buyer feels instant clarity.',
    potentialRisksAndFix: 'File piracy: include copyright notices, lock formula cells with passwords, and rely on regular template updates.',
    unitEconomics: {
      unitName: 'Digital Download Sale',
      exampleExplanation: '80 downloads at $15 with ~5% payment processing fees = $1,140 clean net profit.'
    },
    tags: ['Digital Products', 'Canva', 'Notion', 'Excel', 'Passive Income']
  },
  'mobile-car-detailing': {
    title: 'Mobile Waterless Car Detailing & Interior Care',
    badge: 'Fast Cash • High Ticket',
    shortDescription: 'Eco-friendly waterless car wash, deep upholstery cleaning, and interior sanitization at clients\' home or office parking.',
    detailedDescription: 'Car owners hate waiting in long wash queues. By bringing high-end waterless detailing and steam cleaning straight to their driveway or office parking lot, you provide unmatched convenience while saving liters of water.',
    capitalLabel: '$80 - $150',
    profitLabel: '$700 - $3,000/mo',
    profitMargin: '75% - 85%',
    easeLevel: 'Easy',
    timeToRevenue: '2 - 4 Days',
    workLocation: 'Mobile / Client Driveways',
    dailyHours: '3 - 5 Hours',
    requirements: [
      'Compact waterless wash concentrate and carnauba wax spray',
      'Pack of high-GSM plush microfiber towels and interior detailing brushes',
      'Portable cordless wet/dry car vacuum cleaner',
      'Car or scooter with storage box for portable gear'
    ],
    actionSteps: [
      'Purchase starter detailing chemicals and practice on your own or relatives\' vehicles.',
      'Capture compelling split-screen "Before & After" photos of grimy rims and stained upholstery.',
      'Distribute promotional door hangers in gated residential communities and office complexes.',
      'Offer a monthly subscription plan: 2 comprehensive details per month at a bundled rate.'
    ],
    marketingStrategy: [
      'High-contrast Before/After Reels with satisfying foam extraction footage',
      'Corporate parking lot partnerships: special bulk wash days for company employees',
      'Referral program: "Recommend a neighbor and receive 50% off your next detailing"'
    ],
    secretToSuccess: 'Punctuality and meticulous focus on overlooked spots (air vents, cup holders, glass streak-free shine) guarantee 5-star repeat bookings.',
    potentialRisksAndFix: 'Inclement weather: offer interior-only detailing packages or schedule covered garage visits during rain.',
    unitEconomics: {
      unitName: 'Full Detail Session',
      exampleExplanation: '30 cars monthly at $45 average ticket with $6 chemical cost = $1,170 monthly net profit.'
    },
    tags: ['Car Detailing', 'Mobile Service', 'Fast Cash', 'High Demand', 'Eco-Friendly']
  },
  'healthy-homemade-meals': {
    title: 'Healthy Meal Prep & Diet Subscriptions',
    badge: 'Recurring Income • High Retention',
    shortDescription: 'Cook and deliver weekly macro-balanced, clean meal packages for fitness enthusiasts, busy professionals, and diabetic diets.',
    detailedDescription: 'Healthy eating is the biggest challenge for busy urbanites. Preparing weekly customized lunch boxes (high-protein, keto, low-sodium) delivered fresh in insulated bags provides clients with health and provides you with guaranteed weekly upfront subscriptions.',
    capitalLabel: '$60 - $140',
    profitLabel: '$600 - $2,800/mo',
    profitMargin: '50% - 65%',
    easeLevel: 'Moderate',
    timeToRevenue: '5 - 10 Days',
    workLocation: 'Home Kitchen',
    dailyHours: '3 - 4 Hours (Batch Cooking)',
    requirements: [
      'Equipped home kitchen and food safety hygiene standards',
      'Digital food scale and airtight microwaveable meal containers',
      'Accurate calorie/macro calculation using free nutrition databases',
      'Clean refrigeration and thermal cooler bags for delivery'
    ],
    actionSteps: [
      'Design a compact 5-day menu with clear protein, carb, and calorie labels for each dish.',
      'Cook test portions, plate them cleanly, and photograph them under natural daylight.',
      'Target nearby gym members, personal trainers, and co-working office teams.',
      'Offer a 3-day introductory trial pack before locking in a monthly prepaid subscription.'
    ],
    marketingStrategy: [
      'Collaborate with local gym trainers by offering them a free weekly meal or referral commission',
      'Short videos revealing behind-the-scenes meal prep routines and ingredient freshness',
      'Client fitness transformation testimonials highlighting energy and weight goals'
    ],
    secretToSuccess: 'Flavor is king: people quit diets when food tastes bland. Master herbs, marinades, and flavorful low-calorie sauces.',
    potentialRisksAndFix: 'Food spoilage: operate strictly on pre-orders and prep ingredients on set batch-cooking days (e.g. Sundays & Wednesdays).',
    unitEconomics: {
      unitName: 'Weekly 5-Meal Subscription Pack',
      exampleExplanation: '15 weekly subscribers at $65/pack ($25 food cost) = $2,400 monthly gross profit.'
    },
    tags: ['Food', 'Health & Fitness', 'Subscriptions', 'Meal Prep', 'Home Kitchen']
  },
  'print-on-demand': {
    title: 'Niche Print-on-Demand Apparel & Merchandise',
    badge: 'Zero Inventory • Global Reach',
    shortDescription: 'Design catchy, niche t-shirts, tote bags, and mugs sold online while third-party printing facilities handle manufacturing and shipping.',
    detailedDescription: 'Zero inventory and zero manual shipping. You publish original typographic slogans and niche graphic illustrations. When a buyer places an order, the printing partner automatically prints the product and ships it directly with your branding.',
    capitalLabel: '$0 - $40',
    profitLabel: '$300 - $2,000/mo',
    profitMargin: '30% - 50%',
    easeLevel: 'Easy',
    timeToRevenue: '7 - 14 Days',
    workLocation: '100% Online',
    dailyHours: '1 - 3 Hours',
    requirements: [
      'Canva or Photoshop for creating 300 DPI high-res artwork',
      'Accounts on Printify/Printful integrated with Shopify or Etsy',
      'Keen eye for micro-niche culture (cat lovers, coders, coffee addicts, engineers)'
    ],
    actionSteps: [
      'Identify a passionate niche audience with shared slang or memes (e.g. marathon runners, book lovers).',
      'Design 10 minimalist, witty typographic graphics focused on pride and humor.',
      'Upload designs to mockups and connect to your chosen marketplace storefront.',
      'Generate organic momentum through niche community TikToks, Pinterest pins, and Reels.'
    ],
    marketingStrategy: [
      'TikTok and Instagram reels testing trendy sound trends with aesthetic apparel mockups',
      'Pinterest aesthetic boards linking directly to product checkouts',
      'Collaborating with micro-creators in exchange for free merchandise'
    ],
    secretToSuccess: 'Target micro-passions: generic designs fail, but a t-shirt speaking specifically to "Night-Shift Nurses" or "Mechanical Keyboard Nerds" converts rapidly.',
    potentialRisksAndFix: 'Slow printing/shipping times: partner only with top-rated fulfillment providers located close to your target buyers.',
    unitEconomics: {
      unitName: 'Printed Graphic Hoodie/Tee',
      exampleExplanation: 'Sell for $32, base printing and shipping is $18 = $14 net profit per item.'
    },
    tags: ['Print on Demand', 'E-commerce', 'Zero Inventory', 'Creative', 'Global']
  },
  'scented-candles-natural-soap': {
    title: 'Artisan Soy Candles & Organic Herbal Soaps',
    badge: 'Luxury Feel • 70% Margin',
    shortDescription: 'Handcraft natural soy wax candles and cold-process olive oil soaps with calming essential oils and eco-chic packaging.',
    detailedDescription: 'Self-care and aesthetic home ambiance have boomed. Clean-burning soy candles and chemical-free artisan soaps cost very little in bulk ingredients yet command premium retail prices as gifts and luxury decor items.',
    capitalLabel: '$70 - $140',
    profitLabel: '$450 - $1,900/mo',
    profitMargin: '65% - 75%',
    easeLevel: 'Moderate',
    timeToRevenue: '7 - 12 Days',
    workLocation: 'Home Studio',
    dailyHours: '2 - 3 Hours',
    requirements: [
      'Bulk 100% natural soy wax flakes and cotton/wooden wicks',
      'Pure therapeutic essential oils (Lavender, Vanilla, Sandalwood, Oud)',
      'Heatproof amber glass jars or ceramic vessels',
      'Kitchen thermometer and melting pitcher'
    ],
    actionSteps: [
      'Master temperature control: pour wax at optimal scent-retention temp (around 60°C).',
      'Create 3 signature scent blends with story-driven names (e.g., "Rainy Cabin", "Desert Amber").',
      'Design minimalist labels using matte kraft or waterproof paper.',
      'Pitch sample gift sets to boutique coffee shops, bookshops, and holiday bazaars.'
    ],
    marketingStrategy: [
      'ASMR pouring and wick-trimming videos emphasizing cozy relaxation vibes',
      'Seasonal holiday gift bundles (Eid, Mother’s Day, Winter collection)',
      'Placing consignment display testers on counters of local specialty cafes and floral shops'
    ],
    secretToSuccess: 'Scent throw and aesthetic jar design: people buy first with their eyes, but repeat purchases come from a room-filling cozy fragrance.',
    potentialRisksAndFix: 'Frosting or sinkholes on candle surface: pre-heat jars slightly before pouring and let candles cure slowly at room temp.',
    unitEconomics: {
      unitName: 'Signature Scented Jar Candle',
      exampleExplanation: 'Raw materials cost $4.50, retail price $18.00 = $13.50 net profit per candle.'
    },
    tags: ['Handmade', 'Candles', 'Crafts', 'Home Decor', 'Gifts']
  },
  'resume-portfolio-polishing': {
    title: 'Resume Polishing & LinkedIn Profile Revamp',
    badge: 'High Value • Zero Startup Cost',
    shortDescription: 'Transform amateur CVs and LinkedIn profiles into ATS-friendly, recruiter-magnetic career portfolios.',
    detailedDescription: 'Job seekers frequently miss out on interviews due to poorly formatted resumes that get rejected by Applicant Tracking Systems (ATS). If you have strong writing and formatting skills, you can unlock career opportunities for clients and charge premium rates for rapid turnarounds.',
    capitalLabel: '$0',
    profitLabel: '$400 - $2,100/mo',
    profitMargin: '98% - 100%',
    easeLevel: 'Easy',
    timeToRevenue: '3 - 7 Days',
    workLocation: '100% Remote / Laptop',
    dailyHours: '2 - 3 Hours',
    requirements: [
      'Laptop with Word, Google Docs, or Canva',
      'Strong grasp of action verbs, quantifiable achievements, and ATS keyword parsing',
      'Understanding of LinkedIn profile SEO and headline optimization'
    ],
    actionSteps: [
      'Redesign your own resume and LinkedIn profile to serve as an undeniable case study.',
      'Revamp two friends\' or colleagues\' CVs for free in exchange for glowing video testimonials.',
      'Publish daily LinkedIn breakdowns: "Before & After: How changing 3 bullet points doubled interview calls".',
      'Offer 24-to-48-hour express delivery tiers for urgent job application deadlines.'
    ],
    marketingStrategy: [
      'Active insightful commentary under posts of HR managers and hiring leaders on LinkedIn',
      'Free 3-minute resume video audits shared via Loom to demonstrate value upfront',
      'Partnering with student university clubs and career transition bootcamp graduates'
    ],
    secretToSuccess: 'Quantify everything: turn "managed a team" into "led a cross-functional team of 6, delivering $120k revenue uplift within 4 months".',
    potentialRisksAndFix: 'Client blames you if not immediately hired: explicitly frame your service as interview-access maximization rather than guaranteed employment.',
    unitEconomics: {
      unitName: 'Comprehensive Career Package (CV + LinkedIn)',
      exampleExplanation: '16 clients per month at $75 average package = $1,200 pure profit with $0 expense.'
    },
    tags: ['Career', 'Writing', 'LinkedIn', 'Zero Capital', 'Remote Service']
  },
  'spice-condiments-blends': {
    title: 'Artisan Spice Blends & Signature Condiments',
    badge: 'High Reorder Rate • Low Cost',
    shortDescription: 'Craft preservative-free custom spice rubs, infused chili oils, and signature barbecue sauces in branded shaker jars.',
    detailedDescription: 'Commercial spice mixes in supermarkets are often loaded with fillers, salt, and artificial anti-caking agents. Custom freshly roasted spice blends, gourmet chili oils, and secret burger sauces turn regular cooking into restaurant meals and foster loyal repeat customers.',
    capitalLabel: '$40 - $90',
    profitLabel: '$350 - $1,600/mo',
    profitMargin: '65% - 75%',
    easeLevel: 'Easy',
    timeToRevenue: '4 - 8 Days',
    workLocation: 'Home Kitchen',
    dailyHours: '1 - 3 Hours',
    requirements: [
      'Quality whole spices sourced from wholesale spice markets',
      'High-speed spice/coffee grinder and stainless steel mixing bowls',
      'Airtight glass shaker jars with dual-sifter lids',
      'Waterproof oil-resistant custom labels'
    ],
    actionSteps: [
      'Perfect 3 distinct hero blends: e.g. "Smoky BBQ Brisket Rub", "Crispy Fries Seasoning", and "Crispy Garlic Chili Oil".',
      'Host tasting sessions with family, friends, and neighborhood barbecue enthusiasts.',
      'Design neat labels listing ingredients, heat levels, and recommended recipe pairings.',
      'Supply sample jars to local butcher shops, burger food trucks, and weekend farmers\' markets.'
    ],
    marketingStrategy: [
      'Quick mouthwatering recipe videos showing ordinary meat/fries instantly elevated by your spice blend',
      'Bundle packs: "The Weekend Pitmaster Trio" as gift ideas for cooking enthusiasts',
      'Sampling stalls at neighborhood events or weekend community markets'
    ],
    secretToSuccess: 'Toast spices whole before grinding to unleash essential oils, creating an aromatic difference commercial supermarket jars can never match.',
    potentialRisksAndFix: 'Moisture clumping: add natural food-grade silica gel packs inside shipping boxes and instruct buyers to store in cool, dry spots.',
    unitEconomics: {
      unitName: 'Artisan Spice Jar (150g)',
      exampleExplanation: 'Raw spice & packaging cost $2.00, retail price $8.50 = $6.50 profit per jar.'
    },
    tags: ['Food', 'Cooking', 'Spices', 'Handmade', 'Repeat Purchases']
  },
  'niche-phone-accessories': {
    title: 'Curated Niche Phone Accessories & Direct Dispatch',
    badge: 'Daily Impulse Buys • High Velocity',
    shortDescription: 'Curate high-utility smartphone accessories: magnetic car mounts, ultra-fast cables, and aesthetic aesthetic cases with local delivery.',
    detailedDescription: 'Smartphone accessories are high-frequency impulse purchases. Rather than competing with massive generic stores, curate 4–5 proven problem-solving items (like 65W fast-charging car hubs or privacy screen guards) and offer swift same-day local delivery.',
    capitalLabel: '$70 - $150',
    profitLabel: '$450 - $2,200/mo',
    profitMargin: '55% - 70%',
    easeLevel: 'Very Easy',
    timeToRevenue: '2 - 5 Days',
    workLocation: 'From Home / Dispatch',
    dailyHours: '2 - 3 Hours',
    requirements: [
      'Small wholesale inventory of 3–4 high-demand tested tech accessories',
      'Simple online checkout page or WhatsApp Business catalogue',
      'Reliable agreement with local bike courier for express 2-to-4 hour delivery'
    ],
    actionSteps: [
      'Select accessories that solve annoying pains (e.g., indestructible braided cables or MagSafe power banks).',
      'Order a starter sample pack of 30 units from local wholesale technology markets.',
      'Film real-world stress test videos (drop test, speed charging comparison) for social channels.',
      'Promote same-day door-to-door delivery as your prime advantage over slow online marketplaces.'
    ],
    marketingStrategy: [
      'Direct demonstrations on TikTok: "Testing this wireless car charger on the bumpiest road"',
      'Local targeted Facebook & Instagram ads radius-targeted strictly to your city',
      'Bundle deals: "Buy 1 Fast Charger + Get Braided Heavy-Duty Cable for 50% Off"'
    ],
    secretToSuccess: 'Speed is the ultimate weapon: when someone’s phone cable snaps, waiting 4 days for shipping is painful. Offering delivery in 2 hours wins the order.',
    potentialRisksAndFix: 'Faulty electronic units: test every accessory batch before shipping and offer an immediate no-questions-asked 30-day replacement warranty.',
    unitEconomics: {
      unitName: 'Accessory Bundle Pack',
      exampleExplanation: 'Wholesale purchase $7.00, selling price $22.00 = $15.00 net margin per sale.'
    },
    tags: ['E-commerce', 'Tech Accessories', 'Fast Delivery', 'High Demand']
  },
  'home-organizing-decluttering': {
    title: 'Home Organizing & Wardrobe Decluttering',
    badge: 'Premium Lifestyle • $0 Capital',
    shortDescription: 'Declutter and organize closets, pantries, and kitchens into magazine-worthy, functional spaces for busy homeowners.',
    detailedDescription: 'Modern homes suffer from clutter fatigue. Busy families and executives lack the time or mental bandwidth to systematically organize pantries, closets, and kids\' toy rooms. Professional organizers earn premium hourly or project fees while requiring virtually zero starting capital.',
    capitalLabel: '$0 - $30',
    profitLabel: '$500 - $2,400/mo',
    profitMargin: '90% - 95%',
    easeLevel: 'Easy',
    timeToRevenue: '3 - 7 Days',
    workLocation: 'Client Homes (Local)',
    dailyHours: '3 - 4 Hours per session',
    requirements: [
      'Methodical spatial awareness and organizing methodology (KonMari or categorization bins)',
      'Label maker or neat handwritten chalkboard tags',
      'High sense of privacy, confidentiality, and respect for clients\' personal belongings'
    ],
    actionSteps: [
      'Perform a complete, magazine-style makeover on your own kitchen pantry or clothing wardrobe.',
      'Film a fast-paced time-lapse video of the transformation from chaotic mess to pristine order.',
      'Promote your services in local neighborhood community groups and mom associations.',
      'Offer a 2-hour introductory pantry organization session at a special promotional rate.'
    ],
    marketingStrategy: [
      'High-impact Before & After photos on Instagram showing color-coordinated and labeled shelves',
      'Tips & tricks videos: "3 rules to double your wardrobe space without buying new organizers"',
      'Cross-referrals with interior designers, real estate agents, and residential cleaning companies'
    ],
    secretToSuccess: 'Build sustainable systems tailored to the client’s lifestyle so the space remains organized months later, rather than unraveling the next day.',
    potentialRisksAndFix: 'Client feeling judged about their mess: always demonstrate warm empathy, explaining that clutter is natural and easy to solve.',
    unitEconomics: {
      unitName: 'Closet / Pantry Organization Session',
      exampleExplanation: '18 sessions monthly at $70 = $1,260 revenue, netting over $1,150 profit after minor transit costs.'
    },
    tags: ['Home Organizing', 'Premium Service', 'Zero Capital', 'Before & After', 'Lifestyle']
  },
  'online-tutoring-micro-courses': {
    title: 'Interactive Online Tutoring & Intensive Micro-Courses',
    badge: 'Zero Capital • Flexible Hours',
    shortDescription: 'Teach school subjects, languages, or practical software skills (coding, design, accounting) via Zoom or Google Meet.',
    detailedDescription: 'If you have mastered an academic subject (math, English, science) or a marketable skill (Canva, Excel, coding, video editing), parents and students are always ready to invest in simplified lessons and exam-oriented coaching.',
    capitalLabel: '$0 (Free)',
    profitLabel: '$400 - $2,200/mo',
    profitMargin: '98% - 100%',
    easeLevel: 'Very Easy',
    timeToRevenue: '3 - 7 Days',
    workLocation: '100% Online / Remote',
    dailyHours: '2 - 3 Evening Hours',
    requirements: [
      'Laptop or tablet with stylus for interactive whiteboard sketches',
      'High-speed stable internet and a quiet presentation space',
      'Engaging, simplified teaching style centered on solving practical past exam papers'
    ],
    actionSteps: [
      'Select the exact subject and academic stage you feel most confident teaching.',
      'Prepare a polished 45-minute demo lesson simplifying one of the trickiest curriculum topics.',
      'Announce the free demo masterclass in parent WhatsApp groups and school student forums.',
      'Enroll attendees into small monthly study cohorts (4–6 students per group for maximum engagement).'
    ],
    marketingStrategy: [
      'Free distribution of beautifully designed exam summary sheets with your contact number',
      'Student score improvements and parent thank-you notes as indisputable social proof',
      'Early-bird discounts for students booking an entire academic semester in advance'
    ],
    secretToSuccess: 'Consistent encouragement and periodic updates to parents regarding their child’s progress build an irreplaceable reputation.',
    potentialRisksAndFix: 'Student drop-off between exam seasons: offer summer transition bootcamps in conversational languages or digital creative skills.',
    unitEconomics: {
      unitName: 'Monthly Student Cohort (8 sessions)',
      exampleExplanation: '20 students across 4 small cohorts at $60 each = $1,200/mo with zero overhead.'
    },
    tags: ['Online Tutoring', 'Teaching', 'Zero Capital', 'Skills', 'Recurring Revenue']
  }
};

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    // Header & Brand
    app_title: 'أفكار مشاريع سهلة ومربحة',
    app_subtitle: 'مشاريع مجربة، منخفضة التكاليف، وهوامش ربح تفوق 60%',
    badge_year: 'دليل 2026',
    search_placeholder: 'ابحث عن فكرة، مهارة، أو نوع مشروع (مثل: من المنزل، بدون رأس مال)...',
    search_clear: 'مسح',
    nav_compare: 'المقارنة',
    nav_emergency: 'أحتاج دخلاً هذا الأسبوع',
    nav_scanner: 'ماسح الأصول',
    nav_simulator: 'محاكي المشروع',
    nav_quiz: 'اختبار المشروع الأنسب',
    nav_calc: 'حاسبة الأرباح',
    nav_ai: 'دراسة جدوى بالذكاء الاصطناعي',
    nav_favorites: 'المفضلة',
    nav_language: 'English',
    language_toggle_label: 'Switch to English',

    // Hero Section
    hero_badge: 'دليل الاستثمار المصغر والعمل الحر 2026',
    hero_title: 'ابدأ مشروعك الخاص بأقل من 100$، وحقق أول أرباحك خلال أيام',
    hero_desc: 'اكتشف 12+ فكرة استثمارية مصغرة تم انتقاؤها بعناية: برؤوس أموال تبدأ من $0 وحتى $150، وهوامش ربح تتراوح بين 50% إلى 95%، مع دراسات جدوى وخطوات تنفيذ واقعية.',
    hero_quiz_callout: 'محتار في اختيار الفكرة المناسبة؟',
    hero_quiz_sub: 'أجب عن 4 أسئلة سريعة أو قارن عدة أفكار جنباً إلى جنب لاختيار الأنسب',
    hero_btn_quiz: 'بدء اختبار المشروع الأنسب',
    hero_btn_compare: 'جدول مقارنة المشاريع',
    hero_btn_scanner: 'ولّد فكرة من أصولك أنت',
    hero_stat_capital: 'متوسط رأس المال',
    hero_stat_capital_val: 'أقل من $80',
    hero_stat_margin: 'هامش صافي الربح',
    hero_stat_margin_val: '65% - 95%',
    hero_stat_speed: 'سرعة أول دخل',
    hero_stat_speed_val: '3 - 14 يوماً',
    hero_stat_risk: 'مخاطرة الفشل المالي',
    hero_stat_risk_val: 'شبه معدومة (بدون ديون)',

    // Categories & Filter Tabs
    cat_all: 'جميع المشاريع',
    cat_zero_capital: 'بدون رأس مال (0$)',
    cat_home_based: 'من المنزل بالكامل',
    cat_digital: 'رقمية وعن بعد',
    cat_services: 'خدمية سريعة',
    cat_food_crafts: 'مأكولات وحرف يدوية',
    cat_micro_commerce: 'تجارة مصغرة وتوزيع',

    // Sort Dropdown
    sort_label: 'ترتيب حسب:',
    sort_rating: 'الأعلى تقييماً من المستخدمين ⭐',
    sort_profit: 'الأعلى ربحاً شهرياً',
    sort_capital: 'الأقل تكلفة للبدء',
    sort_speed: 'الأسرع في جني الأرباح',

    // Results Bar
    results_showing: 'يتم عرض',
    results_ideas: 'فكرة مشروع متوافقة',
    results_sorted_by_rating: 'مرتبة حسب تصويت وتقييمات المستخدمين',
    results_search_for: 'نتائج البحث عن:',
    results_view_compare: 'عرض المقارنة',

    // Project Cards
    card_capital_req: 'رأس المال المطلوب',
    card_monthly_profit: 'الربح المتوقع شهرياً',
    card_daily_hours: 'يومياً',
    card_first_revenue: 'أول أرباح:',
    card_view_study: 'دراسة الفكرة وخطة البدء',
    card_compare_add: 'مقارنة',
    card_compare_selected: 'محدد',
    card_btn_calc_title: 'حساب العائد وصافي الأرباح بالأرقام',
    card_btn_ai_title: 'خطة عمل مخصصة بالذكاء الاصطناعي',
    card_fav_add: 'حفظ في المفضلة',
    card_fav_remove: 'إزالة من المفضلة',
    margin_prefix: 'هامش',

    // Comparison Drawer & Floating Bar
    compare_drawer_title: 'جدول مقارنة المشاريع الاستثمارية',
    compare_drawer_subtitle: 'قارن بين رأس المال المطلوب، الأرباح المتوقعة، وسهولة التنفيذ لاختيار الأنسب لك',
    compare_floating_bar_title: 'مشاريع جاهزة للمقارنة',
    compare_bar_title: 'المقارنة:',
    compare_project_singular: 'مشروع',
    compare_projects_plural: 'مشاريع',
    compare_projects_selected: 'مشاريع محددة',
    compare_bar_min: 'اختر مشروعاً ثانياً على الأقل',
    compare_clear_all: 'مسح الكل',
    compare_bar_view_btn: 'عرض جدول المقارنة',
    compare_open_btn: 'عرض جدول المقارنة الشامل',
    compare_clear_btn: 'إفراغ',
    compare_add_more: 'إضافة مشروع للمقارنة',
    compare_add_another: 'أضف مشروعاً آخر للمقارنة:',
    compare_select_placeholder: 'اختر فكرة لإضافتها للمقارنة...',
    compare_back_btn: 'الرجوع واستعراض المشاريع',
    compare_need_two_title: 'اختر مشروعاً ثانياً للمقارنة',
    compare_min_capital: 'أقل رأس مال للبدء',
    compare_max_profit: 'الأعلى أرباحاً شهرياً',
    compare_easiest: 'الأسهل تنفيذاً',
    compare_criteria: 'معايير المقارنة',
    compare_remove_title: 'إزالة من المقارنة',
    compare_row_capital: 'رأس المال المطلوب',
    compare_badge_lowest_capital: 'الأوفر تكلفة للبدء',
    compare_row_profit: 'الربح الشهري المتوقع',
    compare_annual_est: 'تقدير سنوي',
    compare_badge_highest_profit: 'أعلى عائد شهري',
    compare_row_ease: 'صعوبة التنفيذ',
    compare_badge_easiest: 'الأسهل للمبتدئين',
    compare_row_speed: 'سرعة أول ربح',
    compare_row_rating: 'تقييم المستخدمين',
    compare_row_margin: 'هامش الربح الصافي',
    compare_row_location_hours: 'بيئة وساعات العمل',
    compare_row_unit_economics: 'اقتصاديات الوحدة',
    compare_row_requirements: 'أبرز المتطلبات',
    compare_row_secret: 'سر النجاح',
    compare_row_actions: 'إجراءات سريعة',
    compare_btn_details: 'دراسة الفكرة',
    compare_btn_calc: 'حساب الأرباح',
    compare_btn_ai: 'خطة ذكاء اصطناعي',
    compare_tip: '💡 نصيحة للمفاضلة: إذا كنت تبدأ للمرة الأولى ولديك ميزانية محدودة، اختر المشروع ذو رأس المال الأقل ودرجة السهولة الأعلى لاكتساب الثقة وتوليد أول تدفق نقدي سريع.',
    compare_close_btn: 'إغلاق المقارنة',
    compare_max_alert: 'يمكنك مقارنة حتى 5 مشاريع كحد أقصى في وقت واحد',
    compare_empty_title: 'لم تختر مشاريع للمقارنة بعد',
    compare_empty_desc: 'اضغط على زر "مقارنة" الموجود في بطاقة أي مشروع لوضعه جنباً إلى جنب وتقييم الربحية والجهد.',
    compare_col_metric: 'المعيار / المشروع',
    compare_col_category: 'التصنيف',
    compare_col_capital: 'رأس المال المطلوب',
    compare_col_profit: 'الربح الشهري المتوقع',
    compare_col_margin: 'هامش الربح',
    compare_col_ease: 'مستوى السهولة',
    compare_col_speed: 'سرعة أول دخل',
    compare_col_location: 'مكان العمل',
    compare_col_hours: 'ساعات العمل اليومية',
    compare_col_rating: 'تقييم المستخدمين',
    compare_col_unit_eco: 'نموذج الوحدة الاقتصادية',
    compare_col_actions: 'الإجراءات السريعة',

    // Profit Calculator
    calc_modal_title: 'حاسبة الأرباح ونقطة التعادل التفاعلية',
    calc_modal_subtitle: 'احسب إيراداتك، تكاليفك، وصافي أرباحك الواقعية وتوقعات النمو على مدار 6 أشهر',
    calc_preset_label: 'تعبئة تلقائية من أفكار المشاريع:',
    calc_sale_price: 'سعر بيع الوحدة أو الخدمة ($)',
    calc_sale_price_hint: 'ما يدفعه العميل مقابل المنتج أو الخدمة',
    calc_cost_unit: 'تكلفة الوحدة المباشرة ($)',
    calc_cost_unit_hint: 'المواد الخام، التغليف، أو الشحن المباشر',
    calc_monthly_units: 'المبيعات الشهرية المتوقعة',
    calc_unit_orders: 'وحدة/طلب',
    calc_fixed_costs: 'المصاريف الثابتة شهرياً ($)',
    calc_fixed_costs_hint: 'اشتراكات إنترنت، إعلانات ممولة، هاتف',
    calc_startup_capital: 'رأس المال المبدئي للتجهيز ($)',
    calc_startup_capital_hint: 'أدوات التأسيس الأولية (معدات، مخزون تجريبي، هوية بصرية)',
    calc_results_title: 'النتائج المالية والجدوى المتوقعة',
    calc_margin_label: 'هامش الربح الصافي:',
    calc_gross_revenue: 'إجمالي الإيرادات',
    calc_total_expenses: 'إجمالي المصاريف',
    calc_net_profit: 'صافي الربح الشهري',
    calc_breakeven: 'نقطة التعادل',
    calc_sales_unit: 'مبيعات',
    calc_growth_title: 'توقعات نمو الدخل على مدار 6 أشهر',
    calc_interactive_badge: 'رسم بياني تفاعلي',
    calc_growth_subtitle: 'محاكاة تطور المبيعات والأرباح مع اكتساب العملاء وتكرار الشراء',
    calc_tab_monthly: 'الإيرادات والأرباح الشهرية',
    calc_tab_cumulative: 'الأرباح التراكمية والاسترداد',
    calc_scenario_label: 'سيناريو النمو المتوقع:',
    calc_scenario_conservative: 'محافظ (تدرج حذر)',
    calc_scenario_realistic: 'واقعي (نمو طبيعي)',
    calc_scenario_aggressive: 'متسارع (تسويق نشط)',
    calc_stat_6m_profit: 'إجمالي أرباح 6 أشهر',
    calc_stat_6m_revenue: 'إجمالي الإيرادات المتوقعة',
    calc_stat_month6: 'الربح بالشهر السادس',
    calc_stat_payback: 'استرداد رأس المال',
    calc_month_prefix: 'الشهر',
    calc_after_6m: 'بعد 6 أشهر',
    calc_not_available: 'غير متاح',
    calc_close_btn: 'إغلاق الحاسبة',
    calc_chart_rev: 'إجمالي الإيرادات',
    calc_chart_profit: 'صافي الربح',
    calc_chart_expenses: 'المصاريف الإجمالية',
    calc_chart_cum_profit: 'الأرباح الصافية التراكمية',
    calc_chart_invested: 'رأس المال المستثمر',

    // Simulator promo section
    promo_sim_badge: 'محاكي ريادة الأعمال الافتراضي',
    promo_sim_title: 'اختبر قرارات مشروعك لـ 12 شهراً قبل أن تدفع دولاراً واحداً',
    promo_sim_desc: 'عش تجربة واقعية تفاعلية: حدد الأسعار، ميزانية الإعلانات، استجب للمفاجآت السوقية، وشاهد كشف الأرباح والخسائر شهراً بشهر لتتفادى الأخطاء الحقيقية.',
    promo_sim_btn: 'فتح محاكي المشروع',

    // Asset scanner promo section
    promo_scanner_badge: 'ابتكار أفكار من الواقع الشخصي',
    promo_scanner_title: 'لا تملك فكرة؟ ماسح الأصول يولد لك مشروعاً مما تملكه الآن',
    promo_scanner_desc: 'حدد ممتلكاتك الحالية (هاتف، سيارة، أدوات مطبخ، مهارات كتابة أو تصميم) وسيقترح النظام تركيبة استثمارية ذكية مصممة خصيصاً لك.',
    promo_scanner_btn: 'ابدأ مسح أصولك الآن',

    // Emergency Cash Strip
    strip_emergency_question: 'لا تبحث عن مشروع بل عن مال هذا الأسبوع؟',
    strip_emergency_sub: 'مسارات تُدرّ دخلاً خلال 72 ساعة بصفر رأس مال',
    strip_emergency_btn: 'ابدأ الآن',

    // Hero 3 Core Criteria
    hero_stat_zero_capex: 'تكلفة تأسيس شبه منعدمة',
    hero_stat_zero_capex_desc: 'تبدأ من هاتفك دون الحاجة لقروض أو التزامات',
    hero_stat_high_margins: 'هوامش ربح مرتفعة (60%+)',
    hero_stat_high_margins_desc: 'مشاريع خدمية ورقمية ذات عائد صافٍ مباشر',
    hero_stat_speed_payback: 'سرعة جني أول دخل',
    hero_stat_speed_payback_desc: 'استرداد التكاليف خلال 3 إلى 14 يوماً من الإطلاق',

    // AI Banner
    banner_ai_badge: 'مساعد ريادة الأعمال بالذكاء الاصطناعي',
    banner_ai_title: 'لديك فكرة أخرى خاصة بك وتريد دراسة جدوى لها في ثوانٍ؟',
    banner_ai_desc: 'استخدم نموذج الذكاء الاصطناعي المدمج لتحليل فكرتك، تقدير التكاليف، وتحديد خطة إطلاق في 7 أيام مع خطوات استقطاب أول زبون دون إنفاق باهظ.',
    banner_ai_btn: 'توليد دراسة جدوى مخصصة الآن',

    // 4 Golden Rules
    rules_title: '4 قواعد ذهبية لضمان نجاح أي مشروع صغير وتفادي الخسارة',
    rules_sub: 'نصائح جوهرية من واقع تجارب رواد الأعمال والمشاريع المصغرة الرابحة',
    rule_1_title: 'ابدأ بنظام الطلب المسبق',
    rule_1_desc: 'لا تشترِ مخزوناً كبيراً من البداية. اعرض نماذج واضحة واطلب عربوناً مقدماً من العميل لتغطية تكاليف المواد وضمان الجدية.',
    rule_2_title: 'حل مشكلة واضحة',
    rule_2_desc: 'الناس يدفعون بسخاء لمن يوفر عليهم الوقت، الجهد، أو الإحراج (مثل تنظيم الخزائن، تنظيف السيارات عند الباب، أو السيرة الذاتية).',
    rule_3_title: 'قوة التسويق بالمحتوى',
    rule_3_desc: 'فيديوهات كواليس التحضير (Behind The Scenes) وتوثيق النتائج الواقعية على تيك توك وإنستغرام تجلب آلاف الزبائن مجاناً دون إعلانات.',
    rule_4_title: 'إعادة استثمار أول أرباح',
    rule_4_desc: 'في أول 3 إلى 6 أشهر، أعد استثمار 40% من صافي ربحك في تحسين التغليف، شراء أدوات أسرع، وتوسيع سلة المنتجات لزيادة الدخل.',

    // Favorites Drawer
    fav_drawer_title: 'المشاريع المحفوظة',
    fav_clear_all: 'مسح الكل',
    fav_empty_title: 'لا توجد مشاريع في المفضلة حتى الآن',
    fav_empty_desc: 'اضغط على أيقونة الإشارة المرجعية على أي فكرة مشروع لحفظها هنا ومقارنتها لاحقاً.',
    fav_potential_label: 'إجمالي العائد المحتمل شهرياً:',
    fav_potential_prefix: 'يفوق $',
    fav_monthly_suffix: ' شهرياً',
    fav_ideas_count: 'أفكار',
    fav_btn_details: 'التفاصيل',
    fav_btn_calc: 'حساب الأرباح',
    fav_close_btn: 'إغلاق',

    // Empty Search
    search_empty_title: 'لم يتم العثور على أفكار تطابق بحثك',
    search_empty_desc: 'جرب كلمات بحث أخرى أو اختر تصنيفاً عاماً لتصفح جميع المشاريع المتاحة.',
    search_empty_btn: 'عرض جميع المشاريع',

    // Asset Scanner App Section
    scanner_box_badge: 'ماسح الأصول',
    scanner_box_title: 'لم تجد فكرتك في القائمة؟ لأن فكرتك ليست في أي قائمة.',
    scanner_box_desc: 'أفضل المشاريع لا تأتي من تقليد الآخرين، بل من دمج ما تملكه أنت ولا يملكه غيرك مجتمعاً. أخبرنا بأصولك — أدواتك، مساحتك، وقتك، مهاراتك، ومن تعرفهم — ونولّد لك أفكاراً تنشأ من تركيبتك وحدها.',
    scanner_pill_car: 'سيارة',
    scanner_pill_students: 'تعرف طلاباً',
    scanner_pill_result: 'اشتراك توصيل شهري للسكن الجامعي',
    scanner_btn_start: 'ابدأ مسح أصولك الآن',

    // Business Simulator App Section
    sim_box_badge: 'محاكي المشروع',
    sim_box_title: 'جرّب إدارة مشروع لسنة كاملة قبل أن تخاطر بدينار واحد',
    sim_box_desc: 'ابدأ بـ 100$ افتراضية وأدِر 12 شهراً: سعّر منتجك، قرر كم تنتج، وزّع ميزانية تسويقك، وواجه ما يواجهه أصحاب المشاريع فعلاً — ارتفاع أسعار المواد، منافس يفتح بجوارك، وطلبية كبيرة بسعر مخفّض. في النهاية تقرأ تقريراً صريحاً بما أخطأت فيه.',
    sim_pill_safe: 'أخطئ هنا لا في الواقع',
    sim_pill_events: '14 حدثاً واقعياً',
    sim_pill_report: 'تقرير بأخطائك',
    sim_btn_start: 'ابدأ محاكاة 12 شهراً',

    // AI Plan Generator Modal
    ai_modal_title: 'دراسة الجدوى وخطة الإطلاق الذكية (Gemini AI)',
    ai_modal_subtitle: 'صمم خطة عمل ودراسة جدوى مخصصة حسب ميزانيتك ووقتك المتاح',
    ai_badge_7days: 'خطة 7 أيام',
    ai_label_title: 'فكرة أو اسم المشروع المقترح:',
    ai_placeholder_title: 'مثلاً: متجر هدايا منسقة، إدارة حسابات تيك توك، صناعة شموع عطرية...',
    ai_label_budget: 'الميزانية المتاحة لديك:',
    ai_label_hours: 'ساعات العمل اليومية المتاحة:',
    ai_label_location: 'مكان العمل المفضل:',
    ai_label_skills: 'أبرز مهاراتك أو اهتماماتك:',
    ai_placeholder_skills: 'مثلاً: تصميم كانفا، طهي، لباقة في الحديث، ترتيب وتنظيم...',
    ai_btn_generate: 'توليد دراسة الجدوى وخطة الإطلاق',
    ai_btn_generating: 'جارٍ تحليل الجدوى وهيكلة الخطة...',
    ai_plan_copied: 'تم نسخ الخطة!',
    ai_plan_copy_all: 'نسخ الخطة بالكامل',
    ai_plan_custom_badge: 'خطة تنفيذية مخصصة',
    ai_plan_summary_title: 'الملخص التنفيذي:',
    ai_plan_startup_cost: 'التكلفة المبدئية',
    ai_plan_monthly_profit: 'الربح الشهري المتوقع',
    ai_plan_payback: 'استرداد رأس المال',
    ai_plan_target_market: 'العملاء المستهدفون بدقة:',
    ai_plan_quick_steps: 'خطوات الإطلاق السريعة (خلال أول 48 ساعة):',
    ai_plan_roadmap: 'خطة الإنجاز للأشهر الأولى (خريطة طريق 4 أسابيع):',
    ai_plan_risks: 'تجنب المخاطر وضمان الأمان',
    ai_plan_pricing: 'استراتيجية التسعير الذكي',
    ai_btn_close: 'إغلاق',
    ai_budget_zero: '0$ (بدون أي رأس مال إطلاقاً)',
    ai_budget_low: 'أقل من 50 دولار (رأس مال رمزي)',
    ai_budget_mid: '50$ - 150$',
    ai_budget_high: '200$ - 500$',
    ai_hours_1: 'ساعة واحدة يومياً (وقت جزئي خفيف)',
    ai_hours_2_3: '2 - 3 ساعات يومياً',
    ai_hours_4_5: '4 - 5 ساعات يومياً',
    ai_hours_full: 'تفرغ كامل (6+ ساعات)',
    ai_loc_online: 'من المنزل عبر الإنترنت بالكامل',
    ai_loc_home: 'من مطبخ أو ورشة المنزل',
    ai_loc_mobile: 'ميداني مرن أو تقديم خدمات متنقلة',

    // Matchmaker Quiz Modal
    quiz_modal_title: 'اختبار المشروع الأنسب لك',
    quiz_modal_subtitle: 'أجب عن 4 أسئلة سريعة لاكتشاف أفضل فكرة تتطابق مع ميزانيتك ووقتك ومهاراتك',
    quiz_step: 'سؤال',
    quiz_of: 'من',
    quiz_q1_title: 'ما هو رأس المال الذي يمكنك تخصيصه الآن؟',
    quiz_q1_desc: 'اختر الميزانية الواقعية التي تشعر بالأمان معها',
    quiz_q1_opt1_title: '0$ (بدون رأس مال نهائياً)',
    quiz_q1_opt1_sub: 'أعتمد على مهاراتي، هاتفي، أو خدمات مباشرة بدون مخزون',
    quiz_q1_opt2_title: 'مبلغ رمزي (حتى 80$)',
    quiz_q1_opt2_sub: 'شراء خامات أولية بسيطة، أدوات، أو عينات تجريبية',
    quiz_q1_opt3_title: 'مبلغ متوسط (100$ - 150$)',
    quiz_q1_opt3_sub: 'تجهيز منتجات احترافية أو أدوات كهربائية متنقلة',
    quiz_q2_title: 'كم ساعة يمكنك تخصيصها يومياً للمشروع؟',
    quiz_q2_desc: 'وفقاً لجدولك اليومي والتزاماتك الحالية',
    quiz_q2_opt1_title: 'ساعة إلى ساعتين فقط',
    quiz_q2_opt1_sub: 'دخل جانبي مرن إلى جانب وظيفتي أو دراستي',
    quiz_q2_opt2_title: '3 إلى 4 ساعات',
    quiz_q2_opt2_sub: 'التزام شبه يومي متوسط لتحقيق نتائج أسرع',
    quiz_q2_opt3_title: 'تفرغ كامل أو مرن (5+ ساعات)',
    quiz_q2_opt3_sub: 'جاهز لتكثيف الجهد وتسريع الوصول لأول 1000$',
    quiz_q3_title: 'ما هو المجال أو النمط الذي تفضله؟',
    quiz_q3_desc: 'العمل بما تحبه يضمن استمرارك حتى النجاح',
    quiz_q3_opt1_title: 'رقمي عبر الإنترنت (تصميم، إدارة حسابات، قوالب رقمية)',
    quiz_q3_opt1_sub: 'العمل أمام اللابتوب أو الهاتف دون الحاجة لمغادرة المنزل',
    quiz_q3_opt2_title: 'حرفي، يدوي، أو مأكولات (تغليف، شموع، طعام صحي)',
    quiz_q3_opt2_sub: 'أحب العمل باليد وصنع أشياء ملموسة جميلة ومميزة',
    quiz_q3_opt3_title: 'خدمي مباشر وسريع (تنظيف سيارات متنقل، تنظيم منازل)',
    quiz_q3_opt3_sub: 'كسب مال فوري كاش من خدمة يقدرها الناس وتوفر وقتهم',
    quiz_q4_title: 'أين تفضل إنجاز عملك؟',
    quiz_q4_desc: 'مكان تقديم الخدمة وصنع القيمة',
    quiz_q4_opt1_title: 'من المنزل 100%',
    quiz_q4_opt1_sub: 'أقصى راحة وتوفير لتكاليف المواصلات والوقت',
    quiz_q4_opt2_title: 'ميداني أو متنقل لدى الزبائن',
    quiz_q4_opt2_sub: 'خدمة سريعة في موقع العميل بعائد مباشر أعلى',
    quiz_btn_prev: 'السابق',
    quiz_btn_next: 'التالي',
    quiz_btn_results: 'عرض المشاريع المطابقة',
    quiz_results_title: 'أفضل المشاريع المتوافقة مع إجاباتك',
    quiz_results_subtitle: 'تم ترتيب هذه الأفكار حسب درجة التوافق مع رأس مالك ووقتك وتفضيلاتك',
    quiz_match_score: 'نسبة التوافق:',
    quiz_btn_restart: 'إعادة الاختبار',
    quiz_btn_explore: 'استكشاف ودراسة المشروع',

    // Footer
    footer_copy: 'منصة أفكار مشاريع سهلة ومربحة © 2026',
    footer_sub: 'دليلك التفاعلي لدراسات الجدوى السريعة، حاسبة الأرباح، ونماذج العمل الناجحة'
  },
  en: {
    // Header & Brand
    app_title: 'Easy & High-Profit Micro Businesses',
    app_subtitle: 'Validated, low-startup cost ideas with profit margins exceeding 60%',
    badge_year: '2026 Guide',
    search_placeholder: 'Search ideas, skills, or business models (e.g. from home, zero capital)...',
    search_clear: 'Clear',
    nav_compare: 'Compare',
    nav_emergency: 'Fast Cash This Week',
    nav_scanner: 'Asset Scanner',
    nav_simulator: 'Business Simulator',
    nav_quiz: 'Idea Matchmaker Quiz',
    nav_calc: 'Profit Calculator',
    nav_ai: 'AI Business Feasibility',
    nav_favorites: 'Favorites',
    nav_language: 'العربية',
    language_toggle_label: 'تبديل للغة العربية',

    // Hero Section
    hero_badge: 'Micro-Entrepreneurship & Freelance Guide 2026',
    hero_title: 'Launch your venture with under $100 & see profits within days',
    hero_desc: 'Discover 12+ meticulously curated micro-investment ventures: starting from $0 up to $150, boasting 50% to 95% profit margins, backed by actionable feasibility roadmaps.',
    hero_quiz_callout: 'Not sure which business fits you best?',
    hero_quiz_sub: 'Answer 4 quick questions or compare multiple ventures side by side to pick the optimal path.',
    hero_btn_quiz: 'Start Idea Matchmaker Quiz',
    hero_btn_compare: 'Projects Comparison Table',
    hero_btn_scanner: 'Generate Idea From Your Assets',
    hero_stat_capital: 'Avg. Startup Capital',
    hero_stat_capital_val: 'Under $80',
    hero_stat_margin: 'Net Profit Margin',
    hero_stat_margin_val: '65% - 95%',
    hero_stat_speed: 'Time to First Income',
    hero_stat_speed_val: '3 - 14 Days',
    hero_stat_risk: 'Financial Downside Risk',
    hero_stat_risk_val: 'Near Zero (No Debt)',

    // Categories & Filter Tabs
    cat_all: 'All Projects',
    cat_zero_capital: 'Zero Capital ($0)',
    cat_home_based: 'Home-Based',
    cat_digital: 'Digital & Remote',
    cat_services: 'Fast Services',
    cat_food_crafts: 'Food & Crafts',
    cat_micro_commerce: 'Micro-Commerce',

    // Sort Dropdown
    sort_label: 'Sort by:',
    sort_rating: 'Highest Community Rating ⭐',
    sort_profit: 'Highest Monthly Profit',
    sort_capital: 'Lowest Startup Capital',
    sort_speed: 'Fastest Time to Revenue',

    // Results Bar
    results_showing: 'Showing',
    results_ideas: 'matching business ideas',
    results_sorted_by_rating: 'Ranked by community user ratings',
    results_search_for: 'Search results for:',
    results_view_compare: 'View Comparison',

    // Project Cards
    card_capital_req: 'Startup Capital',
    card_monthly_profit: 'Expected Monthly Profit',
    card_daily_hours: 'daily',
    card_first_revenue: 'First Income:',
    card_view_study: 'View Study & Launch Plan',
    card_compare_add: 'Compare',
    card_compare_selected: 'Selected',
    card_btn_calc_title: 'Calculate financial returns and net profits',
    card_btn_ai_title: 'Tailor custom AI business plan',
    card_fav_add: 'Save to Favorites',
    card_fav_remove: 'Remove from Favorites',
    margin_prefix: 'Margin',

    // Comparison Drawer & Floating Bar
    compare_drawer_title: 'Side-by-Side Projects Comparison Table',
    compare_drawer_subtitle: 'Compare required capital, expected profits, and ease of execution to pick the best venture for you',
    compare_floating_bar_title: 'Projects Selected for Comparison',
    compare_bar_title: 'Comparing:',
    compare_project_singular: 'project',
    compare_projects_plural: 'projects',
    compare_projects_selected: 'projects selected',
    compare_bar_min: 'Select at least 2 projects',
    compare_clear_all: 'Clear All',
    compare_bar_view_btn: 'View Comparison Table',
    compare_open_btn: 'Open Full Comparison Matrix',
    compare_clear_btn: 'Clear All',
    compare_add_more: 'Add another project to compare',
    compare_add_another: 'Add another project to compare:',
    compare_select_placeholder: 'Choose an idea to add to comparison...',
    compare_back_btn: 'Return & Browse Projects',
    compare_need_two_title: 'Select a second project to compare',
    compare_min_capital: 'Lowest Startup Capital',
    compare_max_profit: 'Highest Monthly Profit',
    compare_easiest: 'Easiest Execution',
    compare_criteria: 'Comparison Criteria',
    compare_remove_title: 'Remove from comparison',
    compare_row_capital: 'Startup Capital',
    compare_badge_lowest_capital: 'Most Budget-Friendly',
    compare_row_profit: 'Expected Monthly Profit',
    compare_annual_est: 'Annual est.',
    compare_badge_highest_profit: 'Highest Monthly Return',
    compare_row_ease: 'Execution Difficulty',
    compare_badge_easiest: 'Easiest for Beginners',
    compare_row_speed: 'Speed to First Revenue',
    compare_row_rating: 'User Rating',
    compare_row_margin: 'Net Profit Margin',
    compare_row_location_hours: 'Work Environment & Daily Hours',
    compare_row_unit_economics: 'Unit Economics',
    compare_row_requirements: 'Key Requirements',
    compare_row_secret: 'Key Secret to Success',
    compare_row_actions: 'Quick Actions',
    compare_btn_details: 'Study Idea',
    compare_btn_calc: 'Calculate Profits',
    compare_btn_ai: 'AI Business Plan',
    compare_tip: '💡 Pro-tip: If you are starting for the first time with a tight budget, choose the venture with the lowest capital and highest ease to build confidence and generate fast positive cash flow.',
    compare_close_btn: 'Close Comparison',
    compare_max_alert: 'You can compare up to 5 projects at once',
    compare_empty_title: 'No projects selected for comparison yet',
    compare_empty_desc: 'Click the "Compare" toggle on any project card to review their economics, effort, and returns side by side.',
    compare_col_metric: 'Metric / Project',
    compare_col_category: 'Category',
    compare_col_capital: 'Startup Capital',
    compare_col_profit: 'Expected Monthly Profit',
    compare_col_margin: 'Profit Margin',
    compare_col_ease: 'Execution Ease',
    compare_col_speed: 'Time to Revenue',
    compare_col_location: 'Work Location',
    compare_col_hours: 'Daily Commitment',
    compare_col_rating: 'User Rating',
    compare_col_unit_eco: 'Unit Economics Model',
    compare_col_actions: 'Quick Actions',

    // Profit Calculator
    calc_modal_title: 'Interactive Profit & Breakeven Calculator',
    calc_modal_subtitle: 'Calculate your revenues, direct costs, net margins, and 6-month growth projections',
    calc_preset_label: 'Auto-fill from project ideas:',
    calc_sale_price: 'Unit / Service Sale Price ($)',
    calc_sale_price_hint: 'What the client pays per unit or service delivery',
    calc_cost_unit: 'Direct Cost Per Unit ($)',
    calc_cost_unit_hint: 'Raw materials, packaging, or direct fulfillment',
    calc_monthly_units: 'Expected Monthly Sales',
    calc_unit_orders: 'units/orders',
    calc_fixed_costs: 'Monthly Fixed Overhead ($)',
    calc_fixed_costs_hint: 'Internet, subscription tools, phone, basic ads',
    calc_startup_capital: 'Initial Setup Capital ($)',
    calc_startup_capital_hint: 'Initial equipment, sample inventory, basic branding',
    calc_results_title: 'Projected Financial Outcomes',
    calc_margin_label: 'Net Profit Margin:',
    calc_gross_revenue: 'Gross Revenue',
    calc_total_expenses: 'Total Expenses',
    calc_net_profit: 'Net Monthly Profit',
    calc_breakeven: 'Breakeven Volume',
    calc_sales_unit: 'orders',
    calc_growth_title: '6-Month Income Growth Projections',
    calc_interactive_badge: 'Interactive Chart',
    calc_growth_subtitle: 'Simulate order volume and profit growth as client retention scales',
    calc_tab_monthly: 'Monthly Revenue & Profit',
    calc_tab_cumulative: 'Cumulative Profit & Payback',
    calc_scenario_label: 'Growth Scenario:',
    calc_scenario_conservative: 'Conservative (Cautious)',
    calc_scenario_realistic: 'Realistic (Organic)',
    calc_scenario_aggressive: 'Aggressive (Active marketing)',
    calc_stat_6m_profit: 'Total 6-Month Profit',
    calc_stat_6m_revenue: 'Total 6-Month Revenue',
    calc_stat_month6: 'Month 6 Profit',
    calc_stat_payback: 'Capital Payback',
    calc_month_prefix: 'Month',
    calc_after_6m: 'After 6 months',
    calc_not_available: 'N/A',
    calc_close_btn: 'Close Calculator',
    calc_chart_rev: 'Gross Revenue',
    calc_chart_profit: 'Net Profit',
    calc_chart_expenses: 'Total Expenses',
    calc_chart_cum_profit: 'Cumulative Net Profit',
    calc_chart_invested: 'Invested Capital',

    // Simulator promo section
    promo_sim_badge: 'Virtual Entrepreneurship Sandbox',
    promo_sim_title: 'Simulate your business decisions for 12 months before investing $1',
    promo_sim_desc: 'Experience an interactive business simulation: set retail prices, adjust marketing spend, navigate real-world market shocks, and review month-by-month financial statements.',
    promo_sim_btn: 'Open Business Simulator',

    // Asset scanner promo section
    promo_scanner_badge: 'Real-Asset Ideation Engine',
    promo_scanner_title: 'No idea yet? Scan your assets to uncover custom opportunities',
    promo_scanner_desc: 'Select what you already own (smartphone, vehicle, kitchen tools, writing or design skills) and the system generates an investment combo customized for you.',
    promo_scanner_btn: 'Scan My Assets Now',

    // Emergency Cash Strip
    strip_emergency_question: 'Need quick cash this week rather than a long-term business?',
    strip_emergency_sub: 'Proven paths generating cash within 72 hours with $0 startup capital',
    strip_emergency_btn: 'Start Now',

    // Hero 3 Core Criteria
    hero_stat_zero_capex: 'Near-Zero Startup Cost',
    hero_stat_zero_capex_desc: 'Start with your smartphone without loans or debt',
    hero_stat_high_margins: 'High Net Margins (60%+)',
    hero_stat_high_margins_desc: 'Service and digital ventures with direct cash flow',
    hero_stat_speed_payback: 'Fast Payback Velocity',
    hero_stat_speed_payback_desc: 'Recover setup costs within 3 to 14 days of launch',

    // AI Banner
    banner_ai_badge: 'AI Entrepreneurship Assistant',
    banner_ai_title: 'Have your own unique idea and want an instant feasibility roadmap?',
    banner_ai_desc: 'Leverage the built-in AI engine to analyze your custom idea, estimate realistic costs, and craft a 7-day launch plan to land your first paying client without heavy spending.',
    banner_ai_btn: 'Generate Custom Feasibility Plan',

    // 4 Golden Rules
    rules_title: '4 Golden Rules for Micro-Venture Success & Risk Prevention',
    rules_sub: 'Battle-tested principles distilled from successful micro-entrepreneurs',
    rule_1_title: '1. Start With Pre-Orders',
    rule_1_desc: 'Never buy bulk inventory upfront. Showcase mockups or sample designs and secure upfront deposits to fund raw materials safely.',
    rule_2_title: '2. Solve an Immediate Pain Point',
    rule_2_desc: 'Clients gladly pay when you save them time, stress, or hassle (mobile detailing at their door, resume revamp, or closet organizing).',
    rule_3_title: '3. Organic Content Over Paid Ads',
    rule_3_desc: 'Behind-the-scenes clips and clear before-and-after transformations on TikTok and Instagram acquire paying clients organically for $0.',
    rule_4_title: '4. Reinvest Early Cash Flow',
    rule_4_desc: 'During your first 3 to 6 months, reinvest ~40% of net profits into faster gear, premium packaging, and service add-ons to compound growth.',

    // Favorites Drawer
    fav_drawer_title: 'Saved Favorite Ideas',
    fav_clear_all: 'Clear All',
    fav_empty_title: 'No favorites saved yet',
    fav_empty_desc: 'Bookmark any project card to review them here and compare later.',
    fav_potential_label: 'Combined Monthly Profit Potential:',
    fav_potential_prefix: 'Exceeds $',
    fav_monthly_suffix: '/month',
    fav_ideas_count: 'ideas',
    fav_btn_details: 'Details',
    fav_btn_calc: 'Profit Calculator',
    fav_close_btn: 'Close',

    // Empty Search
    search_empty_title: 'No matching ideas found',
    search_empty_desc: 'Try different search terms or select another category to browse all available ventures.',
    search_empty_btn: 'View All Projects',

    // Asset Scanner App Section
    scanner_box_badge: 'Asset Scanner',
    scanner_box_title: "Couldn't find your idea on the list? Because your idea isn't on any list.",
    scanner_box_desc: "The greatest ventures don't come from copying others, but from combining your unique assets: your tools, space, time, skills, and network. Tell us your assets, and we'll generate ventures tailor-made for your unique blend.",
    scanner_pill_car: 'A car',
    scanner_pill_students: 'Know college students',
    scanner_pill_result: 'Monthly campus dorm delivery subscription',
    scanner_btn_start: 'Start Scanning Your Assets Now',

    // Business Simulator App Section
    sim_box_badge: 'Business Simulator',
    sim_box_title: 'Run a 1-year business simulation before risking a single dollar',
    sim_box_desc: 'Start with virtual $100 and steer through 12 months: price your product, plan production, allocate marketing, and handle market shocks like raw material price hikes, new competitors, and discounted bulk inquiries—ending with a transparent diagnosis of your mistakes.',
    sim_pill_safe: 'Fail safely here, not in real life',
    sim_pill_events: '14 realistic events',
    sim_pill_report: 'Honest mistake diagnosis',
    sim_btn_start: 'Start 12-Month Simulation',

    // AI Plan Generator Modal
    ai_modal_title: 'Smart Feasibility & Launch Roadmap (Gemini AI)',
    ai_modal_subtitle: 'Craft a tailored feasibility study and action plan based on your budget and available hours',
    ai_badge_7days: '7-Day Plan',
    ai_label_title: 'Proposed venture or business idea:',
    ai_placeholder_title: 'e.g. Curated gift packaging, TikTok social management, scented soy candles...',
    ai_label_budget: 'Available startup capital:',
    ai_label_hours: 'Available daily hours:',
    ai_label_location: 'Preferred work location:',
    ai_label_skills: 'Key skills or interests:',
    ai_placeholder_skills: 'e.g. Canva design, cooking, persuasive communication, home organizing...',
    ai_btn_generate: 'Generate Feasibility Study & Launch Plan',
    ai_btn_generating: 'Analyzing feasibility & structuring plan...',
    ai_plan_copied: 'Plan copied to clipboard!',
    ai_plan_copy_all: 'Copy Complete Plan',
    ai_plan_custom_badge: 'Custom Action Plan',
    ai_plan_summary_title: 'Executive Summary:',
    ai_plan_startup_cost: 'Estimated Startup Cost',
    ai_plan_monthly_profit: 'Expected Monthly Profit',
    ai_plan_payback: 'Capital Payback',
    ai_plan_target_market: 'Target Customer Audience:',
    ai_plan_quick_steps: 'Quick Launch Steps (First 48 Hours):',
    ai_plan_roadmap: 'Implementation Roadmap (4-Week Schedule):',
    ai_plan_risks: 'Risk Mitigation & Safeguards',
    ai_plan_pricing: 'Smart Pricing Strategy',
    ai_btn_close: 'Close',
    ai_budget_zero: '$0 (Zero startup capital)',
    ai_budget_low: 'Under $50 (Minimal seed capital)',
    ai_budget_mid: '$50 - $150',
    ai_budget_high: '$200 - $500',
    ai_hours_1: '1 hour daily (Light part-time)',
    ai_hours_2_3: '2 - 3 hours daily',
    ai_hours_4_5: '4 - 5 hours daily',
    ai_hours_full: 'Full-time (6+ hours)',
    ai_loc_online: '100% Online from home',
    ai_loc_home: 'From home kitchen or studio',
    ai_loc_mobile: 'Mobile or on-site service',

    // Matchmaker Quiz Modal
    quiz_modal_title: 'Find Your Ideal Micro-Business Quiz',
    quiz_modal_subtitle: 'Answer 4 quick questions to discover ventures matching your budget, time, and skills',
    quiz_step: 'Question',
    quiz_of: 'of',
    quiz_q1_title: 'How much startup capital can you allocate today?',
    quiz_q1_desc: 'Select a realistic budget you feel comfortable with',
    quiz_q1_opt1_title: '$0 (Zero - absolutely zero startup cash)',
    quiz_q1_opt1_sub: 'Rely on skills, smartphone, or direct client service without inventory',
    quiz_q1_opt2_title: 'Modest seed cash (Up to $80)',
    quiz_q1_opt2_sub: 'Basic ingredients, starter tools, or product samples',
    quiz_q1_opt3_title: 'Moderate budget ($100 - $150)',
    quiz_q1_opt3_sub: 'Professional inventory, gear, or portable equipment',
    quiz_q2_title: 'How many hours can you dedicate daily?',
    quiz_q2_desc: 'Based on your real day-to-day schedule and commitments',
    quiz_q2_opt1_title: '1 to 2 hours only',
    quiz_q2_opt1_sub: 'Side hustle alongside study or employment',
    quiz_q2_opt2_title: '3 to 4 hours',
    quiz_q2_opt2_sub: 'Dedicated part-time focus for faster revenue',
    quiz_q2_opt3_title: 'Full-time or flexible (5+ hours)',
    quiz_q2_opt3_sub: 'Ready to accelerate and hit the first $1,000',
    quiz_q3_title: 'Which operating style matches your strengths?',
    quiz_q3_desc: 'Working in a style you enjoy ensures consistency',
    quiz_q3_opt1_title: 'Digital & online (Design, social media, templates)',
    quiz_q3_opt1_sub: 'Work on laptop/phone without leaving your desk',
    quiz_q3_opt2_title: 'Physical crafts & food (Packaging, candles, meal prep)',
    quiz_q3_opt2_sub: 'Enjoy hands-on tangible creation and packaging',
    quiz_q3_opt3_title: 'Direct on-site service (Mobile detailing, home organizing)',
    quiz_q3_opt3_sub: 'Immediate cash from high-demand on-demand services saving people time',
    quiz_q4_title: 'Where do you prefer executing your work?',
    quiz_q4_desc: 'Where your service and value creation takes place',
    quiz_q4_opt1_title: '100% From Home',
    quiz_q4_opt1_sub: 'Maximum convenience, zero transit costs',
    quiz_q4_opt2_title: 'Mobile / At client locations',
    quiz_q4_opt2_sub: 'Fast on-demand service with higher hourly return',
    quiz_btn_prev: 'Previous',
    quiz_btn_next: 'Next',
    quiz_btn_results: 'View Matched Ventures',
    quiz_results_title: 'Best Ventures Matched To Your Profile',
    quiz_results_subtitle: 'Ranked based on fit with your capital, time, and preferred style',
    quiz_match_score: 'Fit Score:',
    quiz_btn_restart: 'Retake Quiz',
    quiz_btn_explore: 'Explore & Study Venture',

    // Footer
    footer_copy: 'Easy & High-Profit Micro Ventures Platform © 2026',
    footer_sub: 'Your interactive companion for rapid feasibility studies, profit calculation, and proven business models'
  }
};
