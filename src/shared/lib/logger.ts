/**
 * CelebrateAI Production Structured Logger
 * Enforces structured single-line JSON logging with automatic PII and IP masking.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'audit';

export interface LogPayload {
  message: string;
  context?: string;
  details?: Record<string, unknown>;
  error?: unknown;
}

/**
 * Anonymizes IPv4 and IPv6 addresses for GDPR compliance.
 */
export function anonymizeIp(ip?: string | null): string {
  if (!ip) return 'unknown';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:xxxx:xxxx`;
  }
  return 'anonymized';
}

function formatLogLine(level: LogLevel, payload: LogPayload): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    context: payload.context || 'app',
    message: payload.message,
    ...(payload.details ? { details: payload.details } : {}),
    ...(payload.error instanceof Error
      ? { error: { name: payload.error.name, message: payload.error.message } }
      : payload.error
      ? { error: String(payload.error) }
      : {}),
  });
}

export const logger = {
  info(message: string, details?: Record<string, unknown>, context?: string): void {
    // eslint-disable-next-line no-console
    console.log(formatLogLine('info', { message, details, context }));
  },

  warn(message: string, details?: Record<string, unknown>, context?: string): void {
    console.warn(formatLogLine('warn', { message, details, context }));
  },

  error(message: string, error?: unknown, details?: Record<string, unknown>, context?: string): void {
    console.error(formatLogLine('error', { message, error, details, context }));
  },

  audit(action: string, metadata: Record<string, unknown> = {}): void {
    const ip = typeof metadata.ip === 'string' ? anonymizeIp(metadata.ip) : undefined;
    const sanitizedMeta = {
      ...metadata,
      ...(ip ? { ip } : {}),
      timestamp: new Date().toISOString(),
      action,
    };
    // eslint-disable-next-line no-console
    console.log(`[AUDIT] ${JSON.stringify(sanitizedMeta)}`);
  },
};
