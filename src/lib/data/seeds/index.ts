import { SeedEventBundle } from './types';
import { WEDDING_SEED_BUNDLE } from './wedding.seed';
import { BIRTHDAY_SEED_BUNDLE } from './birthday.seed';
import { COMMUNITY_SEED_BUNDLE } from './community.seed';

export * from './types';
export * from './wedding.seed';
export * from './wedding-ideas';
export * from './birthday.seed';
export * from './birthday-ideas';
export * from './community.seed';
export * from './community-ideas';

export const BENGALURU_DEMO_EVENTS: SeedEventBundle[] = [
  WEDDING_SEED_BUNDLE,
  BIRTHDAY_SEED_BUNDLE,
  COMMUNITY_SEED_BUNDLE,
];
