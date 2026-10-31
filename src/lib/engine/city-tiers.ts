export type CityTier = 1 | 2 | 3;

const TIER_1_CITIES = new Set([
  'bengaluru',
  'bangalore',
  'mumbai',
  'delhi',
  'new delhi',
  'ncr',
  'gurugram',
  'gurgaon',
  'noida',
  'hyderabad',
  'chennai',
  'kolkata',
]);

const TIER_2_CITIES = new Set([
  'pune',
  'ahmedabad',
  'jaipur',
  'chandigarh',
  'kochi',
  'cochin',
  'goa',
  'lucknow',
  'surat',
  'indore',
  'nagpur',
  'bhopal',
  'coimbatore',
  'vadodara',
  'visakhapatnam',
  'mysore',
  'mysuru',
  'mangalore',
  'mangaluru',
  'dehradun',
]);

/**
 * Returns the cost tier (1 = Metro, 2 = Major Urban, 3 = Regional / Town)
 * for a given city string.
 */
export function getCityCostTier(city: string): CityTier {
  if (!city) return 2;
  const normalized = city.trim().toLowerCase();

  for (const t1 of TIER_1_CITIES) {
    if (normalized.includes(t1)) return 1;
  }

  for (const t2 of TIER_2_CITIES) {
    if (normalized.includes(t2)) return 2;
  }

  return 3;
}

/**
 * Minimum recommended catering cost per guest by event type and city tier.
 */
export const MIN_CATERING_PER_GUEST: Record<
  string,
  Record<CityTier, number>
> = {
  wedding: {
    1: 750, // Metro wedding grand feast min ₹750/guest
    2: 550, // Tier 2 ₹550/guest
    3: 400, // Tier 3 ₹400/guest
  },
  birthday: {
    1: 450, // Metro party bites + drinks ₹450/guest
    2: 350,
    3: 250,
  },
  community_event: {
    1: 150, // Refreshments + snacks ₹150/guest
    2: 120,
    3: 90,
  },
};
