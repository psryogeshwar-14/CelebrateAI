export interface RawCategoryRule {
  category: string;
  displayName: string;
  basePercentage: number;
  notes: string;
  isContingency?: boolean;
}

export const WEDDING_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Kalyana Mantapa', basePercentage: 24, notes: 'Hall rental, guest accommodation & power backup' },
  { category: 'catering', displayName: 'Catering & Beverages', basePercentage: 24, notes: 'Multi-course feasts, live counters & welcome drinks' },
  { category: 'decor', displayName: 'Decor & Florals', basePercentage: 12, notes: 'Mandap, stage backdrop, entrance arch & floral styling' },
  { category: 'photography', displayName: 'Photography & Cinema', basePercentage: 9, notes: 'Candid photo, cinematic film & drone coverage' },
  { category: 'attire', displayName: 'Attire & Styling', basePercentage: 7, notes: 'Bridal silk sarees, sherwanis, jewelry & makeup' },
  { category: 'entertainment', displayName: 'Entertainment & Music', basePercentage: 5, notes: 'Live Nadaswaram, DJ, Sangeet sound & emcee' },
  { category: 'invitations', displayName: 'Invitations & Stationery', basePercentage: 3, notes: 'Digital invites, print cards & packaging' },
  { category: 'transport', displayName: 'Transport & Valet', basePercentage: 3, notes: 'VIP transit, airport pickups & valet coordination' },
  { category: 'gifts', displayName: 'Favors & Gifting', basePercentage: 3, notes: 'Mysore Pak sweets, traditional return gifts & hampers' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Emergency buffer for guest spillover & last-minute needs', isContingency: true },
];

export const BIRTHDAY_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Space Rental', basePercentage: 20, notes: 'Rooftop terrace, cafe, party hall or lounge' },
  { category: 'food', displayName: 'Food & Refreshments', basePercentage: 25, notes: 'Party buffet, live snack counters & drinks' },
  { category: 'cake', displayName: 'Celebration Cake', basePercentage: 5, notes: 'Custom themed fondant/artisanal cake & dessert platter' },
  { category: 'decor', displayName: 'Decor & Lighting', basePercentage: 14, notes: 'Thematic balloons, neon signs & photo booth' },
  { category: 'photography', displayName: 'Photography & Prints', basePercentage: 6, notes: 'Party highlights & instant photo booth prints' },
  { category: 'entertainment', displayName: 'DJ & Activities', basePercentage: 13, notes: 'DJ, sound, party games & entertainer/host' },
  { category: 'return_gifts', displayName: 'Return Gifts & Favors', basePercentage: 7, notes: 'Personalized favors & goodie bags' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Buffer for overtime or extra guest headcount', isContingency: true },
];

export const COMMUNITY_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Ground Booking', basePercentage: 15, notes: 'Community park, amphitheater or public grounds' },
  { category: 'catering', displayName: 'Community Food & Drinks', basePercentage: 18, notes: 'Wholesome snacks, tea/coffee & hydration stations' },
  { category: 'stage_av', displayName: 'Stage, Sound & AV', basePercentage: 18, notes: 'PA audio system, stage podium, microphones & lights' },
  { category: 'decor', displayName: 'Eco Decor & Canopies', basePercentage: 8, notes: 'Bamboo canopies, directional signage & banners' },
  { category: 'publicity', displayName: 'Publicity & Outreach', basePercentage: 11, notes: 'Flyers, posters, digital campaigns & banners' },
  { category: 'volunteers_logistics', displayName: 'Volunteers & Logistics', basePercentage: 12, notes: 'Badges, first-aid, waste segregation & cleanup' },
  { category: 'permissions', displayName: 'Permits & Security', basePercentage: 8, notes: 'Police, municipal clearances & security wardens' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Weather protection & emergency reserves', isContingency: true },
];

export function getBaselineRules(eventType: string): RawCategoryRule[] {
  if (eventType === 'wedding') {
    return WEDDING_BASELINE.map((r) => ({ ...r }));
  }
  if (eventType === 'birthday') {
    return BIRTHDAY_BASELINE.map((r) => ({ ...r }));
  }
  return COMMUNITY_BASELINE.map((r) => ({ ...r }));
}
