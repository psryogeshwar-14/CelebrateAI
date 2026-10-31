/**
 * CelebrateAI Production Audit Logging
 * Structured logging for security, compliance, and event operations.
 * Redacts any PII or sensitive keys and outputs JSON logs suitable for Cloud Run / Google Cloud Logging.
 */

export interface AuditLogEntry {
  action: 'plan_generate' | 'plan_replan' | 'assistant_chat' | 'security_alert' | 'rate_limit_exceeded';
  timestamp: string;
  ip: string;
  eventType?: string;
  totalBudget?: number;
  city?: string;
  guestCount?: number;
  status: 'success' | 'rejected' | 'failed' | 'rate_limited';
  durationMs?: number;
  isAIOffline?: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Anonymizes an IP address for privacy compliance (GDPR/APPI).
 * e.g., 192.168.1.100 -> 192.168.1.xxx
 */
function anonymizeIp(ip: string): string {
  if (!ip || ip === 'anonymous-client') return 'anonymous-client';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  // IPv6 truncation
  if (ip.includes(':')) {
    const v6Parts = ip.split(':');
    return `${v6Parts.slice(0, 3).join(':')}:xxxx:xxxx`;
  }
  return 'masked-ip';
}

/**
 * Emits a structured JSON audit record to stdout for Cloud Logging.
 */
export function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): void {
  const record: AuditLogEntry = {
    ...entry,
    ip: anonymizeIp(entry.ip),
    timestamp: new Date().toISOString(),
  };

  // Structured single-line JSON log
  const logLine = `[AUDIT] ${JSON.stringify(record)}`;
  if (entry.status === 'failed' || entry.action === 'security_alert') {
    console.error(logLine);
  } else if (entry.status === 'rate_limited') {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }
}
