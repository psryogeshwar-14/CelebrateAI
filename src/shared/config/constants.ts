/**
 * CelebrateAI Centralized Domain Constants & Thresholds
 * Eliminates magic numbers and centralizes business rules.
 */

export const PLANNING_CONSTANTS = {
  // Contingency Percentages
  INDOOR_CONTINGENCY_PERCENT: 10,
  OUTDOOR_CONTINGENCY_PERCENT: 12,

  // Timeline Compression Threshold (Days)
  SHORT_NOTICE_DAYS_THRESHOLD: 30,

  // Default Currency
  DEFAULT_CURRENCY: 'INR',

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10,      // 10 requests per window
  },

  // Cache Configuration
  CACHE: {
    TTL_MS: 10 * 60 * 1000, // 10 minutes
  },

  // Request Ceilings
  SECURITY: {
    MAX_REQUEST_BODY_BYTES: 512 * 1024, // 512 KB
    HSTS_MAX_AGE_SECONDS: 63072000,
  },

  // Minimum Catering Baselines (Per Guest INR)
  CATERING_FLOORS: {
    TIER_1: 400, // Metro (Bengaluru, Mumbai, Delhi)
    TIER_2: 300, // Major Urban
    TIER_3: 200, // Regional / Town
  },

  // Gemini API Defaults
  AI: {
    DEFAULT_MODEL: 'gemini-2.5-flash',
    REQUEST_TIMEOUT_MS: 15000,
    ASSISTANT_TIMEOUT_MS: 12000,
    MAX_RETRIES: 2,
    RETRY_DELAY_MS: 1200,
  },
} as const;
