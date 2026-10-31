import { z } from 'zod';
import { ComputedPlan } from '../engine/types';
import { addDaysFormatted, clamp } from '../utils/deterministic';

// ----------------------------------------------------------------------------
// Text Sanitization (Prevents XSS / malicious injection)
// ----------------------------------------------------------------------------

export function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----------------------------------------------------------------------------
// Raw Gemini Response Zod Schemas (with length caps)
// ----------------------------------------------------------------------------

const rawThemeSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  palette: z.array(z.string().min(1).max(50)).min(3).max(6),
  decor_ideas: z.array(z.string().min(1).max(300)).min(2).max(8),
  signature_moment: z.string().min(1).max(500),
});

const rawMenuSectionSchema = z.object({
  name: z.string().min(1).max(80),
  items: z.array(z.string().min(1).max(200)).min(1).max(15),
});

const rawMenuSchema = z.object({
  summary: z.string().min(1).max(600),
  sections: z.array(rawMenuSectionSchema).min(1).max(8),
  dietary_notes: z.array(z.string().min(1).max(300)).max(10).default([]),
});

const rawRiskSchema = z.object({
  risk: z.string().min(1).max(300),
  impact: z.string().min(1).max(50),
  mitigation: z.string().min(1).max(500),
});

const rawSavingsTipSchema = z.object({
  category: z.string().min(1).max(80),
  percentage: z.number(),
  advice: z.string().min(1).max(500),
});

const rawPersonalTaskSchema = z.object({
  title: z.string().min(1).max(150),
  reason: z.string().min(1).max(400),
  suggested_offset_days: z.number().int(),
});

const rawRunSheetSchema = z.object({
  time: z.string().min(1).max(50),
  activity: z.string().min(1).max(250),
  owner: z.string().min(1).max(80),
});

export const rawPlanEnrichmentZodSchema = z.object({
  themes: z.array(rawThemeSchema).min(1).max(5),
  menu: rawMenuSchema,
  risks: z.array(rawRiskSchema).min(1).max(8),
  savings_tips: z.array(rawSavingsTipSchema).min(1).max(10),
  personal_tasks: z.array(rawPersonalTaskSchema).min(1).max(6),
  run_sheet: z.array(rawRunSheetSchema).min(3).max(20),
});

export type RawPlanEnrichment = z.infer<typeof rawPlanEnrichmentZodSchema>;

// ----------------------------------------------------------------------------
// Validated & Enriched Output Types
// ----------------------------------------------------------------------------

export interface ValidatedSavingsTip {
  category: string;
  categoryDisplayName: string;
  percentage: number; // Clamped to 0-30%
  calculatedSavingsAmount: number; // Calculated on server
  advice: string;
}

export interface ValidatedPersonalTask {
  id: string;
  title: string;
  reason: string;
  suggestedOffsetDays: number;
  calculatedDueDate: string; // YYYY-MM-DD
  isOverdue: boolean;
}

export interface ValidatedEnrichmentOutput {
  isAIOffline: boolean;
  aiStatus: string;
  generatedAt: string;
  themes: Array<{
    name: string;
    description: string;
    palette: string[];
    decorIdeas: string[];
    signatureMoment: string;
  }>;
  menu: {
    summary: string;
    sections: Array<{ name: string; items: string[] }>;
    dietaryNotes: string[];
  };
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
  savingsTips: ValidatedSavingsTip[];
  personalTasks: ValidatedPersonalTask[];
  runSheet: Array<{
    time: string;
    activity: string;
    owner: string;
  }>;
}

/**
 * Validates, sanitizes, and deterministically transforms raw Gemini output.
 * - Rejects unknown categories
 * - Clamps percentage to 0–30%
 * - Server calculates savings amounts based on actual budget lines
 * - Converts suggested_offset_days into calendar dates
 */
export function validateAndMergeEnrichment(
  rawJson: unknown,
  plan: ComputedPlan
): ValidatedEnrichmentOutput {
  const validation = rawPlanEnrichmentZodSchema.safeParse(rawJson);
  if (!validation.success) {
    console.warn('[AI Validation] Malformed Gemini response rejected. Falling back to offline templates.');
    return getOfflineFallbackEnrichment(plan);
  }
  const parsed = validation.data;
  const eventDate = plan.input.eventDate;
  const todayStr = plan.input.currentDate || new Date().toISOString().split('T')[0];

  // Map of valid category keys to their allocations
  const validCategoriesMap = new Map(
    plan.budget.allocations.map((a) => [a.category.toLowerCase(), a])
  );

  // 1. Process Themes
  const themes = parsed.themes.map((t) => ({
    name: sanitizeText(t.name),
    description: sanitizeText(t.description),
    palette: t.palette.map((p) => sanitizeText(p)),
    decorIdeas: t.decor_ideas.map((d) => sanitizeText(d)),
    signatureMoment: sanitizeText(t.signature_moment),
  }));

  // 2. Process Menu
  const menu = {
    summary: sanitizeText(parsed.menu.summary),
    sections: parsed.menu.sections.map((s) => ({
      name: sanitizeText(s.name),
      items: s.items.map((i) => sanitizeText(i)),
    })),
    dietaryNotes: parsed.menu.dietary_notes.map((n) => sanitizeText(n)),
  };

  // 3. Process Risks
  const risks = parsed.risks.map((r) => ({
    risk: sanitizeText(r.risk),
    impact: sanitizeText(r.impact),
    mitigation: sanitizeText(r.mitigation),
  }));

  // 4. Process Savings Tips (Reject unknown categories, clamp 0-30%, compute amount)
  const savingsTips: ValidatedSavingsTip[] = [];
  for (const tip of parsed.savings_tips) {
    const rawCat = tip.category.trim().toLowerCase();
    // Match exact or fuzzy category
    let matchedAlloc = validCategoriesMap.get(rawCat);
    if (!matchedAlloc) {
      for (const [key, alloc] of Array.from(validCategoriesMap.entries())) {
        if (rawCat.includes(key) || key.includes(rawCat)) {
          matchedAlloc = alloc;
          break;
        }
      }
    }

    // Reject unknown category
    if (!matchedAlloc) continue;

    // Clamp percentage strictly between 0 and 30%
    const clampedPercentage = Math.round(clamp(tip.percentage, 0, 30));

    // Server calculates savings amount from deterministic budget line
    const calculatedSavingsAmount = Math.round(
      matchedAlloc.amount * (clampedPercentage / 100)
    );

    savingsTips.push({
      category: matchedAlloc.category,
      categoryDisplayName: matchedAlloc.displayName,
      percentage: clampedPercentage,
      calculatedSavingsAmount,
      advice: sanitizeText(tip.advice),
    });
  }

  // 5. Process Personal Tasks (Calculate real due dates)
  const personalTasks: ValidatedPersonalTask[] = parsed.personal_tasks.map((pt, idx) => {
    const offset = Math.max(0, pt.suggested_offset_days);
    const calculatedDueDate = addDaysFormatted(eventDate, -offset);
    const isOverdue = calculatedDueDate < todayStr;

    return {
      id: `ai_task_${idx + 1}`,
      title: sanitizeText(pt.title),
      reason: sanitizeText(pt.reason),
      suggestedOffsetDays: offset,
      calculatedDueDate,
      isOverdue,
    };
  });

  // 6. Process Run Sheet
  const runSheet = parsed.run_sheet.map((rs) => ({
    time: sanitizeText(rs.time),
    activity: sanitizeText(rs.activity),
    owner: sanitizeText(rs.owner),
  }));

  return {
    isAIOffline: false,
    aiStatus: 'AI online (Generated by Gemini 3.8 Flash)',
    generatedAt: new Date().toISOString(),
    themes,
    menu,
    risks,
    savingsTips,
    personalTasks,
    runSheet,
  };
}

// ----------------------------------------------------------------------------
// Offline Fallback Template Generator
// ----------------------------------------------------------------------------

export function getOfflineFallbackEnrichment(plan: ComputedPlan): ValidatedEnrichmentOutput {
  const { input, budget } = plan;
  const eventDate = input.eventDate;
  const todayStr = input.currentDate || new Date().toISOString().split('T')[0];

  // Map of valid category keys
  const validCategoriesMap = new Map(
    budget.allocations.map((a) => [a.category.toLowerCase(), a])
  );

  let themes: ValidatedEnrichmentOutput['themes'];
  let menu: ValidatedEnrichmentOutput['menu'];

  if (input.eventType === 'wedding') {
    themes = [
      {
        name: 'Heritage Palace Elegance',
        description: 'Traditional royal grandeur featuring rich brass artifacts, auspicious jasmine, and warm temple illumination.',
        palette: ['#8B1E3F', '#D4AF37', '#2C5E43', '#FFFDD0'],
        decorIdeas: ['Carved stone-finish mandap pillars', 'Antique brass urlis with fresh floating lotuses', 'Jasmine ceiling canopies'],
        signatureMoment: 'Groom and bride entry under a canopy of woven marigolds with live Nadaswaram.',
      },
      {
        name: 'Botanical Glasshouse Romance',
        description: 'Lush tropical greenery accented with fairy light canopies and contemporary brass geometrics.',
        palette: ['#1B4D3E', '#F7CAC9', '#C5A059', '#F5F5DC'],
        decorIdeas: ['Black-iron glass arches', 'Fairy light starlit ceiling', 'Native potted palms along aisle'],
        signatureMoment: 'Vows exchanged beneath an illuminated floral gazebo at twilight.',
      },
      {
        name: 'Channapatna Folk Vibrancy',
        description: 'Vibrant celebration of Karnataka handcrafted wooden lacquer beads and raw silk textures.',
        palette: ['#E65100', '#00838F', '#FFB300', '#6A1B9A'],
        decorIdeas: ['Channapatna wooden bead hangings', 'Silk fabric draped lounges', 'Brass street chai cart'],
        signatureMoment: 'High-energy Sangeet flash mob with customized floral props.',
      },
    ];

    menu = {
      summary: 'Curated Karnataka Royal Banquet with live counters and authentic filter coffee.',
      sections: [
        { name: 'Welcome Drinks', items: ['Spiced Kokum Fizz', 'Iced Panakam with Cardamom & Jaggery'] },
        { name: 'Appetizers', items: ['Crispy Maddur Vada with Coconut Chutney', 'Smoked Jackfruit Roast Canapés'] },
        { name: 'Mains', items: ['Authentic Bisi Bele Bath with Ghee Boondi', 'Melkote Puliyogare & Curd Rice Trio'] },
        { name: 'Desserts', items: ['Warm Bele Obbattu with Saffron Ghee', 'Melt-in-mouth Mysore Pak'] },
      ],
      dietaryNotes: ['Segregated kitchen counters for Jain guests', 'Filter coffee prepared live with pure cow milk'],
    };
  } else if (input.eventType === 'birthday') {
    themes = [
      {
        name: 'Cyberpunk Neon 3.0',
        description: 'Electric cyan and magenta hues with retro arcade machines and LED glow installations.',
        palette: ['#00F0FF', '#FF007F', '#120E24', '#FFE600'],
        decorIdeas: ['Custom neon quote signs', 'UV blacklights', 'Glowing LED ice buckets'],
        signatureMoment: 'Midnight retro arcade tournament projected onto the rooftop wall.',
      },
      {
        name: 'Artisanal Craft Hop Lounge',
        description: 'Warm oak barrels, ambient Edison string lights, and chalkboard craft brew menus.',
        palette: ['#D97706', '#4D7C0F', '#78350F', '#FDFBF7'],
        decorIdeas: ['Rustic wooden barrels', 'Potted fresh rosemary plants', 'Tasting flight paddles'],
        signatureMoment: 'Custom craft brew keg tapping toast with close friends.',
      },
      {
        name: 'Retro Vinyl & Groove Vault',
        description: 'Funky 70s groove lounge with playable vinyl records and vintage board game stations.',
        palette: ['#E11D48', '#F59E0B', '#0D9488', '#F3F4F6'],
        decorIdeas: ['Vinyl record walls', 'Giant tabletop games', 'Retro polaroid camera station'],
        signatureMoment: 'Cake cutting shaped like a retro arcade cassette.',
      },
    ];

    menu = {
      summary: 'Modern gastro-pub menu featuring live wood-fired sourdough pizzas and craft finger foods.',
      sections: [
        { name: 'Drinks', items: ['Citrus Craft Shandy', 'Sparkling Cold-Brew Cascara Tea'] },
        { name: 'Starters', items: ['Gunpowder Podi Truffle Fries', 'Charred Paneer & Chicken Skewers'] },
        { name: 'Mains', items: ['Wood-Fired Neapolitan Sourdough Pizzas', 'Lotus Bao Sliders with Pickled Slaw'] },
        { name: 'Desserts', items: ['Dark Chocolate Stout Brownies with Salted Caramel Gelato'] },
      ],
      dietaryNotes: ['Dedicated vegan cheese pizza stone', 'Gluten-free fries fried in dedicated fryer'],
    };
  } else {
    themes = [
      {
        name: 'Hasiru Habba (Green Festival)',
        description: 'Eco-friendly celebration honoring local biodiversity, unbleached fabrics, and bamboo architecture.',
        palette: ['#15803D', '#A16207', '#FACC15', '#ECFDF5'],
        decorIdeas: ['Woven bamboo archways', 'Upcycled denim pallet seating', 'Chalk art pathway maps'],
        signatureMoment: 'Community sapling pledge by neighborhood children along the perimeter.',
      },
      {
        name: 'Artisan Heritage Bazaar',
        description: 'Celebration of local craftspeople with warm terracotta, jute, and handloom textures.',
        palette: ['#C2410C', '#854D0E', '#065F46', '#FEF3C7'],
        decorIdeas: ['Jute canopies', 'Earthen pottery displays', 'Hand-painted fabric banners'],
        signatureMoment: 'Live pottery wheel demonstration and resident giveaway.',
      },
      {
        name: 'Solar Harmony Pavilion',
        description: 'Futuristic sustainability pavilion highlighting clean energy, solar sound, and zero-plastic.',
        palette: ['#0284C7', '#16A34A', '#EAB308', '#F8FAFC'],
        decorIdeas: ['Solar-powered decorative lights', 'Interactive composting exhibits', 'Herb planter boxes'],
        signatureMoment: 'Amphitheater street play on clean waste segregation.',
      },
    ];

    menu = {
      summary: 'Wholesome organic millet street food court using zero single-use plastics.',
      sections: [
        { name: 'Hydration', items: ['Fresh Tender Coconut Water with Chia & Mint', 'Spiced Buttermilk (Majjige)'] },
        { name: 'Snacks', items: ['Crispy Ragi Pakoras', 'Sprouted Moong Chaat in Baked Cones'] },
        { name: 'Mains', items: ['Jowar Roti with Ennegai Stuffed Brinjal Curry', 'Organic Foxtail Millet Pongal'] },
        { name: 'Desserts', items: ['Kodo Millet Palm Jaggery Payasa'] },
      ],
      dietaryNotes: ['100% vegetarian menu', 'Reusable stainless steel plates rented from community plate bank'],
    };
  }

  // Fallback Savings Tips
  const savingsTips: ValidatedSavingsTip[] = [];
  for (const alloc of budget.allocations) {
    if (alloc.isContingency) continue;
    let advice = 'Negotiate package discounts or compare multiple local vendor quotes.';
    let pct = 10;

    if (alloc.category === 'decor') {
      advice = 'Reuse daytime ceremony floral structures for evening photo backdrops to save on fresh floral turnover.';
      pct = 15;
    } else if (alloc.category === 'invitations') {
      advice = 'Shift 80% of distribution to animated WhatsApp invitations, printing only physical copies for immediate family.';
      pct = 20;
    } else if (alloc.category === 'catering' || alloc.category === 'food') {
      advice = 'Consolidate live counter options into 4 high-impact crowd favorites to reduce waste and staffing fees.';
      pct = 8;
    }

    const calculatedSavingsAmount = Math.round(alloc.amount * (pct / 100));
    savingsTips.push({
      category: alloc.category,
      categoryDisplayName: alloc.displayName,
      percentage: pct,
      calculatedSavingsAmount,
      advice,
    });

    if (savingsTips.length >= 4) break;
  }

  // Fallback Personal Tasks
  const personalTasks: ValidatedPersonalTask[] = [
    {
      id: 'ai_task_1',
      title: 'Schedule Outfit & Accessory Fitting Trial',
      reason: 'Ensures adjustments and backup accessories are ready well in advance.',
      suggestedOffsetDays: 21,
      calculatedDueDate: addDaysFormatted(eventDate, -21),
      isOverdue: addDaysFormatted(eventDate, -21) < todayStr,
    },
    {
      id: 'ai_task_2',
      title: 'Assemble Emergency Touch-Up & First-Aid Kit',
      reason: 'Safety essential for safety pins, stain remover, pain relievers, and breath mints.',
      suggestedOffsetDays: 7,
      calculatedDueDate: addDaysFormatted(eventDate, -7),
      isOverdue: addDaysFormatted(eventDate, -7) < todayStr,
    },
  ];

  // Fallback Run Sheet
  const runSheet = [
    { time: '08:00 AM', activity: 'Vendor load-in, stage check & decor setup', owner: 'Planner / Decorator' },
    { time: '10:00 AM', activity: 'Guest arrivals, registration & welcome drinks', owner: 'Host / Ushers' },
    { time: '11:30 AM', activity: 'Main ceremony / keynote celebrations', owner: 'Master of Ceremonies' },
    { time: '01:00 PM', activity: 'Banquet dining & dessert service', owner: 'Catering Lead' },
    { time: '03:30 PM', activity: 'Farewells, favor distribution & site teardown', owner: 'Host' },
  ];

  const risks = [
    {
      risk: 'Unseasonal local rain shower',
      impact: 'high',
      mitigation: 'Pre-book waterproof clear-span canopy cover with raised wooden subflooring.',
    },
    {
      risk: 'Guest traffic congestion during peak hours',
      impact: 'medium',
      mitigation: 'Arrange dedicated traffic marshals and send parking GPS pins in invitation messages.',
    },
    {
      risk: 'Grid electrical power outage',
      impact: 'high',
      mitigation: 'Dual auto-transfer diesel generators connected to critical lighting and sound consoles.',
    },
  ];

  return {
    isAIOffline: true,
    aiStatus: 'AI offline (Deterministic baseline & fallback template loaded)',
    generatedAt: new Date().toISOString(),
    themes,
    menu,
    risks,
    savingsTips,
    personalTasks,
    runSheet,
  };
}
