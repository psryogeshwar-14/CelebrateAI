import {
  EventPlanningInput,
  ComputedBudgetResult,
  VendorRecommendation,
} from './types';
import { addDaysFormatted, daysBetween, formatDateISO } from '../utils/deterministic';

interface VendorBlueprint {
  id: string;
  vendorType: string;
  categoryKey: string;
  whyNeeded: string;
  normalLeadDays: number;
  isCritical: boolean;
  keyQuestions: string[];
}

const WEDDING_VENDORS: VendorBlueprint[] = [
  {
    id: 'v_venue',
    vendorType: 'Kalyana Mantapa / Wedding Venue',
    categoryKey: 'venue',
    whyNeeded: 'Secures ceremony hall, dining pavilion, bridal green rooms, and electrical backup.',
    normalLeadDays: 150,
    isCritical: true,
    keyQuestions: [
      'Does the rental fee include 100% DG generator backup and fuel?',
      'What are the municipal sound curfew hours for evening music and processions?',
      'How many guest rooms and dedicated parking spaces are included?',
      'Are outside traditional caterers and decorators permitted without penalty?',
    ],
  },
  {
    id: 'v_catering',
    vendorType: 'Wedding Feast Caterer',
    categoryKey: 'catering',
    whyNeeded: 'Prepares traditional banana-leaf feasts, live Chaat/Dosa counters, and welcome drinks.',
    normalLeadDays: 120,
    isCritical: true,
    keyQuestions: [
      'What is your staff-to-guest serving ratio during peak dining hours?',
      'Can you guarantee complete kitchen segregation for strict Jain / vegan guests?',
      'Do you supply banana leaves, copper water dispensers, and dining tables?',
      'Is food tasting provided before contract signing?',
    ],
  },
  {
    id: 'v_photo',
    vendorType: 'Candid Photographer & Cinematographer',
    categoryKey: 'photography',
    whyNeeded: 'Captures spontaneous emotions, ritual milestones, and drone aerial footage.',
    normalLeadDays: 105,
    isCritical: true,
    keyQuestions: [
      'How many candid vs traditional photographers will cover the Muhurtham and Reception?',
      'What is the turnaround SLA for the teaser trailer, raw footage, and printed album?',
      'Do you possess drone flight clearance for this specific venue location?',
    ],
  },
  {
    id: 'v_decor',
    vendorType: 'Mandap Floral Designer & Decorator',
    categoryKey: 'decor',
    whyNeeded: 'Builds customized floral mandap, entrance archway, and ambient stage lighting.',
    normalLeadDays: 90,
    isCritical: false,
    keyQuestions: [
      'Are fresh flowers (e.g. Mysore Mallige, marigold) delivered fresh on the ceremony morning?',
      'Can you share 3D CAD render previews of the mandap and lighting plan?',
      'Does your quote include complete post-event teardown and site clearing?',
    ],
  },
  {
    id: 'v_music',
    vendorType: 'Nadaswaram & Wedding Band / DJ',
    categoryKey: 'entertainment',
    whyNeeded: 'Provides auspicious traditional Nadaswaram for Muhurtham and high-energy Sangeet music.',
    normalLeadDays: 75,
    isCritical: false,
    keyQuestions: [
      'Can the Nadaswaram troupe coordinate cues directly with the family priest?',
      'Do you bring backup wireless microphones and sound amplifiers?',
      'Can we provide a customized playlist of family favorites and regional tracks?',
    ],
  },
  {
    id: 'v_makeup',
    vendorType: 'Bridal Makeup & Saree Drapist',
    categoryKey: 'attire',
    whyNeeded: 'Ensures flawless HD bridal makeup, hair styling, and traditional silk saree draping.',
    normalLeadDays: 45,
    isCritical: false,
    keyQuestions: [
      'Do you travel on-site to the venue at 4:30 AM for early morning Muhurtham?',
      'Is a trial makeup session included in the package?',
      'How many family members can your assistant team accommodate?',
    ],
  },
  {
    id: 'v_valet',
    vendorType: 'Valet Parking & Guest Transport',
    categoryKey: 'transport',
    whyNeeded: 'Prevents traffic congestion and assists elderly guests with arrival and departure.',
    normalLeadDays: 30,
    isCritical: false,
    keyQuestions: [
      'How many uniformed valet drivers and traffic marshals will be deployed?',
      'Do you carry third-party vehicle damage insurance during parking transit?',
    ],
  },
];

const BIRTHDAY_VENDORS: VendorBlueprint[] = [
  {
    id: 'v_venue',
    vendorType: 'Rooftop Lounge / Party Venue',
    categoryKey: 'venue',
    whyNeeded: 'Provides private space, seating, sound permits, and celebration ambiance.',
    normalLeadDays: 45,
    isCritical: true,
    keyQuestions: [
      'What is the minimum spend or rental deposit for the private terrace?',
      'Can outside custom cakes, craft kegs, or specialty foods be brought in?',
      'What is the hard music curfew cutoff time?',
    ],
  },
  {
    id: 'v_catering',
    vendorType: 'Party Buffet & Snack Caterer',
    categoryKey: 'food',
    whyNeeded: 'Supplies warm appetizers, wood-fired pizzas, finger foods, and craft beverages.',
    normalLeadDays: 30,
    isCritical: true,
    keyQuestions: [
      'Can live food stations (e.g. barbecue, slider station) be operated on the terrace?',
      'Do you offer gluten-free, vegan, and nut-free snack options?',
    ],
  },
  {
    id: 'v_bakery',
    vendorType: 'Custom Cake Designer & Artisanal Bakery',
    categoryKey: 'cake',
    whyNeeded: 'Bakes personalized centerpiece birthday cake matching party theme.',
    normalLeadDays: 20,
    isCritical: true,
    keyQuestions: [
      'Do you deliver in temperature-controlled refrigerated transport directly to venue?',
      'Can you craft 3D sugar figurines and custom flavor profiles?',
    ],
  },
  {
    id: 'v_dj',
    vendorType: 'Party DJ & Sound Setup',
    categoryKey: 'entertainment',
    whyNeeded: 'Mixes dance tracks, manages audio volume, and keeps party energy vibrant.',
    normalLeadDays: 25,
    isCritical: false,
    keyQuestions: [
      'Do you provide club laser lighting and haze effects with your sound console?',
      'Can we share a collaborative Spotify playlist for must-play tracks?',
    ],
  },
  {
    id: 'v_decor',
    vendorType: 'Thematic Decor & Neon Specialist',
    categoryKey: 'decor',
    whyNeeded: 'Installs personalized neon signage, balloon garlands, and photo booth frames.',
    normalLeadDays: 15,
    isCritical: false,
    keyQuestions: [
      'Is the custom neon name sign yours to keep as a souvenir after the party?',
      'How quickly can your team set up and dismantle the balloon installations?',
    ],
  },
];

const COMMUNITY_VENDORS: VendorBlueprint[] = [
  {
    id: 'v_sound_av',
    vendorType: 'Stage Sound & Public Address System',
    categoryKey: 'stage_av',
    whyNeeded: 'Ensures crystal-clear acoustics across open park grounds for speeches and performances.',
    normalLeadDays: 45,
    isCritical: true,
    keyQuestions: [
      'Can the PA sound system operate for 8 hours on battery / solar UPS during power cuts?',
      'Do you provide 4+ wireless microphones and stage monitor speakers?',
    ],
  },
  {
    id: 'v_tents',
    vendorType: 'Eco Canopies & Event Infrastructure',
    categoryKey: 'decor',
    whyNeeded: 'Erects weather-resistant bamboo canopies, exhibition stalls, and seating.',
    normalLeadDays: 30,
    isCritical: true,
    keyQuestions: [
      'Are all stall fabrics unbleached cotton and reusable bamboo with zero PVC vinyl?',
      'Can you set up wheelchair-accessible ramps to the stage area?',
    ],
  },
  {
    id: 'v_catering',
    vendorType: 'Community Refreshment Partner',
    categoryKey: 'catering',
    whyNeeded: 'Serves wholesome snacks, fresh coconut water, and clean drinking water.',
    normalLeadDays: 25,
    isCritical: false,
    keyQuestions: [
      'Can you operate on a strict zero single-use plastic model using steel cups / plates?',
      'Do you have capacity to serve 500+ guests during peak afternoon hours?',
    ],
  },
  {
    id: 'v_waste',
    vendorType: 'Eco Waste Management & Composting Team',
    categoryKey: 'volunteers_logistics',
    whyNeeded: 'Manages 4-way source waste segregation and ensures park is spotless after the event.',
    normalLeadDays: 20,
    isCritical: false,
    keyQuestions: [
      'Do you supply labeled bins and trained volunteers to monitor segregation points?',
      'Can you provide a post-event waste audit certificate for the resident welfare association?',
    ],
  },
];

/**
 * Generates an event-specific vendor checklist with budget ranges and Google Maps search links.
 */
export function generateVendors(
  input: EventPlanningInput,
  budgetResult: ComputedBudgetResult
): VendorRecommendation[] {
  const city = input.city || 'Bengaluru';
  const eventDate = input.eventDate;
  const todayStr = input.currentDate || formatDateISO(new Date());
  const daysUntil = daysBetween(todayStr, eventDate);

  let blueprints: VendorBlueprint[];
  if (input.eventType === 'wedding') {
    blueprints = WEDDING_VENDORS;
  } else if (input.eventType === 'birthday') {
    blueprints = BIRTHDAY_VENDORS;
  } else {
    blueprints = COMMUNITY_VENDORS;
  }

  return blueprints.map((bp) => {
    // 1. Calculate realistic booking deadline
    // If event is short-notice, compress lead days so deadline never precedes today or succeeds eventDate
    let daysBefore: number;
    if (daysUntil < 30) {
      // Proportional compression within available days
      daysBefore = Math.min(daysUntil, Math.max(1, Math.round((bp.normalLeadDays / 150) * daysUntil)));
    } else {
      daysBefore = Math.min(daysUntil, bp.normalLeadDays);
    }

    const bookingDeadline = addDaysFormatted(eventDate, -daysBefore);

    // 2. Derive estimated budget range from computed category allocation
    const matchedAlloc = budgetResult.allocations.find(
      (a) => a.category === bp.categoryKey || a.category.includes(bp.categoryKey)
    );

    const targetAmount = matchedAlloc ? matchedAlloc.amount : Math.round(budgetResult.totalBudget * 0.1);
    const minAmount = Math.max(1, Math.floor(targetAmount * 0.85));
    const maxAmount = Math.max(minAmount, Math.ceil(targetAmount * 1.15));

    // 3. Generate clean Google Maps search link
    const query = `${bp.vendorType} in ${city}`;
    const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    return {
      id: bp.id,
      vendorType: bp.vendorType,
      whyNeeded: bp.whyNeeded,
      bookingDeadline,
      daysBeforeEvent: daysBefore,
      keyQuestions: [...bp.keyQuestions],
      estimatedBudgetRange: {
        min: minAmount,
        target: targetAmount,
        max: maxAmount,
      },
      googleMapsSearchUrl,
      isCritical: bp.isCritical,
    };
  });
}
