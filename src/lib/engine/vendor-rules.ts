export interface VendorBlueprint {
  id: string;
  vendorType: string;
  categoryKey: string;
  whyNeeded: string;
  normalLeadDays: number;
  isCritical: boolean;
  keyQuestions: string[];
}

export const WEDDING_VENDORS: VendorBlueprint[] = [
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
    vendorType: 'Mandap & Floral Decor Architect',
    categoryKey: 'decor',
    whyNeeded: 'Designs floral mandap, brass diya pathways, reception stage, and entrance arches.',
    normalLeadDays: 90,
    isCritical: true,
    keyQuestions: [
      'Are the floral arrangements made with fresh local flowers (Mysore jasmine, marigold)?',
      'What is your setup teardown timeline and electrical safety certification?',
      'Do you provide 3D visual mockups of the stage and mandap before execution?',
    ],
  },
  {
    id: 'v_makeup',
    vendorType: 'Bridal Makeup & Saree Drape Artist',
    categoryKey: 'attire',
    whyNeeded: 'Provides HD bridal makeup, traditional hair styling, and saree draping for Muhurtham.',
    normalLeadDays: 75,
    isCritical: true,
    keyQuestions: [
      'Do you offer an in-person bridal makeup trial before the wedding day?',
      'Can your team handle makeup and hairstyling for immediate family members as well?',
      'What cosmetics brands and airbrush products do you utilize?',
    ],
  },
  {
    id: 'v_music',
    vendorType: 'Nadaswaram & Live Fusion Troupe',
    categoryKey: 'entertainment',
    whyNeeded: 'Performs auspicious traditional Nadaswaram for Muhurtham and DJ/band for Reception.',
    normalLeadDays: 60,
    isCritical: false,
    keyQuestions: [
      'Will you supply your own instrument amplifiers and sound mix board?',
      'Can you adapt playlists for Kannada, Hindi, and fusion genres on the fly?',
    ],
  },
];

export const BIRTHDAY_VENDORS: VendorBlueprint[] = [
  {
    id: 'v_venue',
    vendorType: 'Party Venue / Rooftop Lounge',
    categoryKey: 'venue',
    whyNeeded: 'Provides exclusive celebration space with seating, sound equipment, and bar service.',
    normalLeadDays: 30,
    isCritical: true,
    keyQuestions: [
      'Is the sound setup and DJ console included in the booking tariff?',
      'What is the cutoff time for outdoor music and food service?',
      'Are outside cakes and custom balloon decor permitted without corkage fees?',
    ],
  },
  {
    id: 'v_cake',
    vendorType: 'Artisanal Cake Designer',
    categoryKey: 'cake',
    whyNeeded: 'Creates custom tiered themed cake and dessert platter matching party aesthetics.',
    normalLeadDays: 14,
    isCritical: true,
    keyQuestions: [
      'Do you offer eggless, vegan, or gluten-free cake tiers?',
      'Do you provide safe temperature-controlled doorstep delivery to the venue?',
      'Can you craft 3D edible fondant figures matching our theme?',
    ],
  },
  {
    id: 'v_entertainment',
    vendorType: 'Party Host, Emcee & DJ',
    categoryKey: 'entertainment',
    whyNeeded: 'Organizes engaging interactive games, keeps energy vibrant, and curates party tracks.',
    normalLeadDays: 20,
    isCritical: true,
    keyQuestions: [
      'Can you curate custom trivia and age-appropriate games for our guest group?',
      'Do you bring your own wireless microphones and backup music console?',
    ],
  },
  {
    id: 'v_decor',
    vendorType: 'Thematic Balloon & Lighting Decorator',
    categoryKey: 'decor',
    whyNeeded: 'Builds customized balloon arches, personalized neon signs, and photo booth backdrops.',
    normalLeadDays: 12,
    isCritical: false,
    keyQuestions: [
      'Do you use biodegradable latex balloons and reusable frames?',
      'How many hours before event start do you require venue access for setup?',
    ],
  },
  {
    id: 'v_photo',
    vendorType: 'Event Photographer',
    categoryKey: 'photography',
    whyNeeded: 'Captures cake cutting, candid interactions, and delivers instant digital photo albums.',
    normalLeadDays: 15,
    isCritical: false,
    keyQuestions: [
      'What is your delivery timeline for high-res edited digital photos?',
      'Can you set up an instant live gallery QR code for guests to view pictures?',
    ],
  },
];

export const COMMUNITY_VENDORS: VendorBlueprint[] = [
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

export function getVendorBlueprints(eventType: string): VendorBlueprint[] {
  if (eventType === 'wedding') return WEDDING_VENDORS;
  if (eventType === 'birthday') return BIRTHDAY_VENDORS;
  return COMMUNITY_VENDORS;
}
