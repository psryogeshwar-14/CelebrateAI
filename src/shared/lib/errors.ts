/**
 * CelebrateAI Strongly Typed Domain Application Errors
 * Provides centralized error hierarchy and safe client-facing serialization.
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'GEMINI_API_ERROR'
  | 'DATABASE_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'PAYLOAD_TOO_LARGE'
  | 'FEASIBILITY_CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_SERVER_ERROR',
    statusCode = 500,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfterSec: number;

  constructor(message = 'Too many requests. Please wait a moment before trying again.', retryAfterSec = 60) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, { retryAfterSec });
    this.name = 'RateLimitError';
    this.retryAfterSec = retryAfterSec;
  }
}

export class GeminiApiError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'GEMINI_API_ERROR', 502, details);
    this.name = 'GeminiApiError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const msg = identifier ? `${resource} '${identifier}' was not found.` : `${resource} was not found.`;
    super(msg, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class FeasibilityError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'FEASIBILITY_CONFLICT', 422, details);
    this.name = 'FeasibilityError';
  }
}

/**
 * Safely extracts an error message from an unknown caught exception.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'An unexpected internal error occurred.';
}

/**
 * Normalizes any unknown thrown object into a standardized AppError.
 */
export function toAppError(error: unknown, defaultMessage = 'An unexpected internal error occurred.'): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message || defaultMessage, 'INTERNAL_SERVER_ERROR', 500);
  }
  return new AppError(defaultMessage, 'INTERNAL_SERVER_ERROR', 500);
}
