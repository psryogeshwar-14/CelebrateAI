import { ComputedPlan } from '@/lib/engine/types';
import {
  ValidatedEnrichmentOutput,
  ValidatedSavingsTip,
  ValidatedPersonalTask,
  ThemeRecommendation,
  MenuRecommendation,
  RiskMitigation,
  RunSheetItem,
} from '../types';
import { addDaysFormatted, clamp } from '@/lib/utils/deterministic';
import { sanitizeText } from './recommendation.service';

/**
 * Deterministic offline templates providing rich recommendations when Gemini is unavailable.
 */
export function getOfflineFallback(plan: ComputedPlan): ValidatedEnrichmentOutput {
  const { input, budget } = plan;
  const eventType = input.eventType;
    const eventDate = input.eventDate;
    const todayStr = input.currentDate || new Date().toISOString().split('T')[0];

    let themes: ThemeRecommendation[];
    let menu: MenuRecommendation;

    if (eventType === 'wedding') {
      themes = [
        {
          name: 'Mysore Silk & Royal Jasmine Pavilion',
          description: 'A regal South Indian palace ambiance with fragrant jasmine garlands, brass deepams, and warm gold silks.',
          palette: ['#B45309', '#F59E0B', '#15803D', '#FFFBEB'],
          decorIdeas: ['Brass urlis with floating lotus and mogra', 'Temple pillar entrance archways', 'Marigold tassels and amber ambient chandeliers'],
          signatureMoment: 'Grand nadaswaram procession welcoming the couple under a floral canopy.',
        },
        {
          name: 'Cubbon Park Verdant Garden Elegance',
          description: 'A contemporary botanical celebration with eucalyptus foliage, warm fairy lights, and ivory linen styling.',
          palette: ['#065F46', '#10B981', '#E5E7EB', '#FFFFFF'],
          decorIdeas: ['Eucalyptus and baby breath arches', 'Fairy-light canopy over open lawns', 'Wooden signage with personalized calligraphy'],
          signatureMoment: 'Sunset champagne or elaneer toast under an illuminated heritage banyan tree.',
        },
        {
          name: 'Koramangala Modern Minimalist Chic',
          description: 'Clean architectural lines with terracotta accents, neon monogram highlights, and chic acoustic lounge vibes.',
          palette: ['#C2410C', '#475569', '#F1F5F9', '#1E293B'],
          decorIdeas: ['Geometric brass backdrops with dried pampas', 'Terracotta pottery with succulents', 'Bespoke neon couple monogram backdrop'],
          signatureMoment: 'Unplugged acoustic sangeet jamming session with signature craft cocktails.',
        },
      ];

      menu = {
        summary: 'Grand multi-course feast blending royal traditional delicacies with modern live counter delights.',
        sections: [
          { name: 'Welcome Refreshments', items: ['Tender Coconut Cooler with Basil Seeds', 'Filter Coffee Foam Shots'] },
          { name: 'Live Counters', items: ['Artisanal Mini Dosa Bar (Ghee Roast & Podi)', 'Steamed Dim Sum & Lotus Stem Crisps'] },
          { name: 'Traditional Banana Leaf Feast', items: ['Bisi Bele Bath with Boondi', 'Avial & Pineapple Menaskai', 'Mysore Pak & Elaneer Payasam'] },
          { name: 'Desserts & Digestives', items: ['Kulfi Falooda Bar', 'Artisanal Paan Counter'] },
        ],
        dietaryNotes: ['Pure vegetarian options prepared in dedicated segregated kitchen', 'All dairy items sourced from organic local farms'],
      };
    } else if (eventType === 'birthday') {
      themes = [
        {
          name: 'Indiranagar Neon Arcade Extravaganza',
          description: 'High-energy retro arcade neon party with synthwave beats, glow accents, and interactive game stations.',
          palette: ['#9333EA', '#06B6D4', '#EC4899', '#18181B'],
          decorIdeas: ['Custom neon quote backdrops', 'LED glowing cocktail tables', 'Retro 80s pixel art photo booth'],
          signatureMoment: 'High-energy cake-cutting ceremony surrounded by safe cold-spark fountain effects.',
        },
        {
          name: 'Cubbon Terrace Sundowner Party',
          description: 'A relaxed rooftop lounge vibe with tropical greens, sunset acoustic sets, and artisanal grazing boards.',
          palette: ['#EA580C', '#FBBF24', '#047857', '#FEF3C7'],
          decorIdeas: ['Rooftop festoon overhead lighting', 'Boho rattan lounge chairs with tropical cushions', 'Fresh artisanal mocktail bar counter'],
          signatureMoment: 'Golden-hour polaroid memory wall where guests pin handwritten wishes.',
        },
        {
          name: 'Whitefield Cosplay & Quest Gala',
          description: 'Immersive pop-culture and fantasy journey featuring custom puzzle stations and cinematic soundtrack styling.',
          palette: ['#2563EB', '#D97706', '#374151', '#F3F4F6'],
          decorIdeas: ['Themed table centers matching popular fantasy lore', 'Interactive treasure quest checkpoint markers', 'Glow-in-the-dark themed badges'],
          signatureMoment: 'Live interactive team trivia showdown with personalized host prize ceremony.',
        },
      ];

      menu = {
        summary: 'Vibrant party street buffet featuring artisanal finger foods, craft mocktails, and decadent dessert sliders.',
        sections: [
          { name: 'Welcome Sippers', items: ['Kokum Sparkler with Rosemary', 'Virgin Passionfruit Mojito'] },
          { name: 'Sliders & Tacos', items: ['Pulled Jackfruit / Chicken Slider Trio', 'Crispy Paneer Tinga Tacos'] },
          { name: 'Live Stations', items: ['Woodfired Pizza Bites', 'Loaded Truffle Fries Bar'] },
          { name: 'Celebration Finale', items: ['Custom Belgium Dark Chocolate Cake', 'Churros with Salted Caramel Dip'] },
        ],
        dietaryNotes: ['Gluten-free slider buns available upon advance request', 'Separate nut-free dessert station for allergen safety'],
      };
    } else {
      themes = [
        {
          name: 'Eco-Bengaluru Habba',
          description: 'Zero-waste community festivity featuring bamboo architecture, terracotta crafts, and indigenous floral displays.',
          palette: ['#15803D', '#84CC16', '#78350F', '#FEFCE8'],
          decorIdeas: ['Handwoven bamboo welcome arches', 'Recycled cloth community banners', 'Potted native saplings as pathway borders'],
          signatureMoment: 'Mass ceremonial sapling planting followed by community pledge.',
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
    const runSheet: RunSheetItem[] = [
      { time: '08:00 AM', activity: 'Vendor load-in, stage check & decor setup', owner: 'Planner / Decorator' },
      { time: '10:00 AM', activity: 'Guest arrivals, registration & welcome drinks', owner: 'Host / Ushers' },
      { time: '11:30 AM', activity: 'Main ceremony / keynote celebrations', owner: 'Master of Ceremonies' },
      { time: '01:00 PM', activity: 'Banquet dining & dessert service', owner: 'Catering Lead' },
      { time: '03:30 PM', activity: 'Farewells, favor distribution & site teardown', owner: 'Host' },
    ];

    const risks: RiskMitigation[] = [
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

