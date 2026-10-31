import { describe, it, expect } from 'vitest';
import {
  createEventSchema,
  createBudgetItemSchema,
  createTimelineTaskSchema,
  createVendorSchema,
  themeIdeaSchema,
  menuIdeaSchema,
  riskIdeaSchema,
  runSheetIdeaSchema,
  savingTipIdeaSchema,
  aiEnrichmentOutputSchema,
} from './schemas';

describe('Validation Schemas: createEventSchema', () => {
  const validEvent = {
    eventType: 'wedding',
    title: "Ananya & Vikram's Wedding",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    guestCount: 350,
    totalBudget: 2500000,
    currency: 'INR',
    style: 'Heritage South Indian',
    dietaryNeeds: ['Pure Veg'],
    accessibilityNeeds: ['Wheelchair access'],
    specialRequests: 'Muhurtham at 7:30 AM',
    status: 'planning',
    isDemo: false,
  };

  it('validates a complete, valid event payload', () => {
    const result = createEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid event date format', () => {
    const invalid = { ...validEvent, eventDate: '20-11-2026' };
    const result = createEventSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects non-positive guest count and budget', () => {
    expect(createEventSchema.safeParse({ ...validEvent, guestCount: 0 }).success).toBe(false);
    expect(createEventSchema.safeParse({ ...validEvent, guestCount: -5 }).success).toBe(false);
    expect(createEventSchema.safeParse({ ...validEvent, totalBudget: 0 }).success).toBe(false);
    expect(createEventSchema.safeParse({ ...validEvent, totalBudget: -100 }).success).toBe(false);
  });

  it('rejects unsupported event types', () => {
    const invalid = { ...validEvent, eventType: 'anniversary' };
    const result = createEventSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('Validation Schemas: createBudgetItemSchema', () => {
  it('validates a correct budget item', () => {
    const valid = {
      eventId: '11111111-1111-4111-8111-111111111111',
      category: 'catering',
      plannedAmount: 625000,
      actualAmount: 600000,
      notes: 'Udupi grand feast',
    };
    expect(createBudgetItemSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects negative planned or actual amounts', () => {
    const negativePlanned = {
      eventId: '11111111-1111-4111-8111-111111111111',
      category: 'catering',
      plannedAmount: -500,
    };
    expect(createBudgetItemSchema.safeParse(negativePlanned).success).toBe(false);
  });

  it('rejects invalid category enums', () => {
    const invalidCategory = {
      eventId: '11111111-1111-4111-8111-111111111111',
      category: 'gambling',
      plannedAmount: 500,
    };
    expect(createBudgetItemSchema.safeParse(invalidCategory).success).toBe(false);
  });
});

describe('Validation Schemas: createTimelineTaskSchema', () => {
  it('validates a valid task item', () => {
    const valid = {
      eventId: '11111111-1111-4111-8111-111111111111',
      title: 'Book Kalyana Mantapa',
      description: 'Palace Grounds booking with deposit',
      owner: 'Family',
      dueDate: '2026-05-24',
      status: 'todo',
      priority: 'critical',
    };
    expect(createTimelineTaskSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects malformed due dates', () => {
    const invalid = {
      eventId: '11111111-1111-4111-8111-111111111111',
      title: 'Task',
      dueDate: 'May 24th',
    };
    expect(createTimelineTaskSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('Validation Schemas: createVendorSchema', () => {
  it('validates a valid vendor record', () => {
    const valid = {
      eventId: '11111111-1111-4111-8111-111111111111',
      vendorType: 'Catering',
      name: 'Sri Krishna Grand Caterers',
      contact: '+91 94480 67890',
      quoteAmount: 600000,
      status: 'booked',
      bookingDeadline: '2026-07-23',
      questions: ['Is banana leaf service included?'],
      notes: 'Tasting completed',
    };
    expect(createVendorSchema.safeParse(valid).success).toBe(true);
  });
});

describe('Validation Schemas: AI Output Schemas', () => {
  it('validates themeIdeaSchema requires exactly 3 concepts with valid hex codes', () => {
    const validThemeConcept = {
      title: 'Hoysala Royal Brass',
      tagline: 'Timeless architectural grandeur',
      colorPalette: [
        { hex: '#8B1E3F', name: 'Vermillion' },
        { hex: '#D4AF37', name: 'Temple Gold' },
        { hex: '#2C5E43', name: 'Plantain Green' },
        { hex: '#FFFDD0', name: 'Silk Ivory' },
      ],
      decorElements: ['Carved stone-finish mandap pillars', 'Antique brass bells'],
      ambianceAndVibe: 'Sacred, fragrant, dignified with traditional Nadaswaram',
      signatureMoment: 'Groom and bride entry beneath woven marigold archway',
    };

    const validPayload = {
      concepts: [validThemeConcept, validThemeConcept, validThemeConcept],
    };
    expect(themeIdeaSchema.safeParse(validPayload).success).toBe(true);

    // Rejects fewer than 3 concepts
    const fewerConcepts = { concepts: [validThemeConcept, validThemeConcept] };
    expect(themeIdeaSchema.safeParse(fewerConcepts).success).toBe(false);

    // Rejects invalid hex codes
    const invalidHex = {
      concepts: [
        {
          ...validThemeConcept,
          colorPalette: [
            { hex: 'green', name: 'Green' }, // Invalid hex!
            { hex: '#D4AF37', name: 'Gold' },
            { hex: '#2C5E43', name: 'Green' },
            { hex: '#FFFDD0', name: 'Ivory' },
          ],
        },
        validThemeConcept,
        validThemeConcept,
      ],
    };
    expect(themeIdeaSchema.safeParse(invalidHex).success).toBe(false);
  });

  it('validates menuIdeaSchema and dietary compliance notes', () => {
    const validMenu = {
      cuisineStyle: 'South Indian Royal Feast',
      welcomeDrinks: [
        {
          cocktail: 'Kokum Fizz',
          mocktailAlternative: 'Iced Panakam',
          notes: 'Infused with fresh mint',
        },
      ],
      appetizers: [
        { dishName: 'Maddur Vada', description: 'Crispy onion patties', dietaryTags: ['Veg'] },
        { dishName: 'Jackfruit Roast', description: 'Spiced tender jackfruit', dietaryTags: ['Veg'] },
      ],
      mains: [
        { dishName: 'Bisi Bele Bath', description: 'Lentil rice delicacy', dietaryTags: ['Veg', 'GF'] },
        { dishName: 'Puliyogare', description: 'Tamarind rice', dietaryTags: ['Veg', 'GF'] },
      ],
      desserts: [
        { dishName: 'Bele Obbattu', description: 'Sweet lentil flatbread', dietaryTags: ['Veg'] },
      ],
      dietaryComplianceNotes: 'Completely segregated kitchen counters for strict Jain meals.',
    };
    expect(menuIdeaSchema.safeParse(validMenu).success).toBe(true);
  });

  it('validates riskIdeaSchema structure and severity enums', () => {
    const validRisk = {
      risks: [
        {
          category: 'Weather',
          riskDescription: 'Unseasonal rain over open courtyard',
          severity: 'high',
          probability: 'medium',
          contingencyPlan: 'Waterproof German clear-span hangars pre-installed.',
        },
        {
          category: 'Logistics',
          riskDescription: 'Airport road traffic delays',
          severity: 'high',
          probability: 'high',
          contingencyPlan: 'Chartered traveler buses with traffic wardens.',
        },
        {
          category: 'Power Backup',
          riskDescription: 'Grid power cut during Muhurtham',
          severity: 'high',
          probability: 'low',
          contingencyPlan: 'Dual 125 kVA auto-transfer generators on standby.',
        },
      ],
    };
    expect(riskIdeaSchema.safeParse(validRisk).success).toBe(true);

    // Rejects invalid severity
    const invalidSeverity = {
      risks: [
        { ...validRisk.risks[0], severity: 'catastrophic' }, // Not low, medium, or high
        validRisk.risks[1],
        validRisk.risks[2],
      ],
    };
    expect(riskIdeaSchema.safeParse(invalidSeverity).success).toBe(false);
  });

  it('validates runSheetIdeaSchema itinerary items', () => {
    const validRunSheet = {
      itinerary: [
        { timeSlot: '05:30 AM', activity: 'Priest arrival', leadPerson: 'Priest' },
        { timeSlot: '07:30 AM', activity: 'Muhurtham', leadPerson: 'Chief Priest' },
        { timeSlot: '09:00 AM', activity: 'Grand Feast', leadPerson: 'Catering Lead' },
        { timeSlot: '11:00 AM', activity: 'Reception blessings', leadPerson: 'Coordinator' },
      ],
    };
    expect(runSheetIdeaSchema.safeParse(validRunSheet).success).toBe(true);
  });

  it('validates savingTipIdeaSchema', () => {
    const validTips = {
      tips: [
        {
          category: 'decor',
          practicalTip: 'Reuse morning mandap brass urlis and flower garlands for reception wall.',
          tradeOffToAvoid: 'Do not compromise on fresh morning jasmine.',
        },
        {
          category: 'invitations_favors',
          practicalTip: 'Send 80% digital WhatsApp animated video invites.',
          tradeOffToAvoid: 'Do not skip physical cards for family elders.',
        },
        {
          category: 'apparel_makeup',
          practicalTip: 'Source Kanjivaram silks directly from weaver cooperative societies.',
          tradeOffToAvoid: 'Do not compromise on bridal makeup trials.',
        },
      ],
    };
    expect(savingTipIdeaSchema.safeParse(validTips).success).toBe(true);
  });

  it('validates unified aiEnrichmentOutputSchema', () => {
    const sample = {
      themes: {
        concepts: [
          {
            title: 'Concept 1',
            tagline: 'Tagline 1 description',
            colorPalette: [
              { hex: '#111111', name: 'Dark' },
              { hex: '#222222', name: 'Gray' },
              { hex: '#333333', name: 'Light' },
            ],
            decorElements: ['Element 1', 'Element 2'],
            ambianceAndVibe: 'A warm and vibrant ambiance throughout the hall',
            signatureMoment: 'The couple arrives under fireworks display',
          },
          {
            title: 'Concept 2',
            tagline: 'Tagline 2 description',
            colorPalette: [
              { hex: '#111111', name: 'Dark' },
              { hex: '#222222', name: 'Gray' },
              { hex: '#333333', name: 'Light' },
            ],
            decorElements: ['Element 1', 'Element 2'],
            ambianceAndVibe: 'A warm and vibrant ambiance throughout the hall',
            signatureMoment: 'The couple arrives under fireworks display',
          },
          {
            title: 'Concept 3',
            tagline: 'Tagline 3 description',
            colorPalette: [
              { hex: '#111111', name: 'Dark' },
              { hex: '#222222', name: 'Gray' },
              { hex: '#333333', name: 'Light' },
            ],
            decorElements: ['Element 1', 'Element 2'],
            ambianceAndVibe: 'A warm and vibrant ambiance throughout the hall',
            signatureMoment: 'The couple arrives under fireworks display',
          },
        ],
      },
      menu: {
        cuisineStyle: 'Regional Fusion',
        welcomeDrinks: [{ cocktail: 'Gin Fizz', mocktailAlternative: 'Lemonade', notes: 'Fresh herbs' }],
        appetizers: [
          { dishName: 'App 1', description: 'Crispy fried bites', dietaryTags: ['Veg'] },
          { dishName: 'App 2', description: 'Skewered delights', dietaryTags: ['Non-Veg'] },
        ],
        mains: [
          { dishName: 'Main 1', description: 'Curry with fragrant rice', dietaryTags: ['Veg'] },
          { dishName: 'Main 2', description: 'Biryani with raita', dietaryTags: ['Non-Veg'] },
        ],
        desserts: [{ dishName: 'Dessert 1', description: 'Gulab Jamun with ice cream', dietaryTags: ['Veg'] }],
        dietaryComplianceNotes: 'Kitchen is separated for non-veg and veg items.',
      },
      risks: {
        risks: [
          { category: 'Weather', riskDescription: 'Heavy rains', severity: 'high', probability: 'medium', contingencyPlan: 'Rent waterproof tents.' },
          { category: 'Logistics', riskDescription: 'Late delivery', severity: 'medium', probability: 'low', contingencyPlan: 'Buffer time by 2 hours.' },
          { category: 'Vendor', riskDescription: 'No-show sound engineer', severity: 'high', probability: 'low', contingencyPlan: 'Backup audio team on speed dial.' },
        ],
      },
      runSheet: {
        itinerary: [
          { timeSlot: '10:00 AM', activity: 'Setup begins', leadPerson: 'Coordinator' },
          { timeSlot: '12:00 PM', activity: 'Guests arrive', leadPerson: 'Host' },
          { timeSlot: '01:00 PM', activity: 'Lunch feast', leadPerson: 'Caterer' },
          { timeSlot: '03:00 PM', activity: 'Closing toast', leadPerson: 'Host' },
        ],
      },
      savingTips: {
        tips: [
          { category: 'decor', practicalTip: 'Use potted plants instead of cut flowers.', tradeOffToAvoid: 'Do not skimp on stage lighting.' },
          { category: 'catering', practicalTip: 'Limit appetizers to 4 high-impact items.', tradeOffToAvoid: 'Do not reduce food quantity.' },
          { category: 'invitations_favors', practicalTip: 'Send paperless video invites via WhatsApp.', tradeOffToAvoid: 'Do not miss following up with guests.' },
        ],
      },
    };

    expect(aiEnrichmentOutputSchema.safeParse(sample).success).toBe(true);
  });
});
