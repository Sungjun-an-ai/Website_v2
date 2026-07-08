// Shared security helpers: HTML escaping, input validation, and a lightweight
// in-memory rate limiter. These address KISA secure-coding items for XSS,
// improper input validation, and improper resource-usage limits.

/** Escape a string for safe interpolation into HTML (prevents HTML/JS injection). */
export function escapeHtml(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Basic email format validation with a sane max length. */
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value)
}

/** Trim and hard-cap a string field; returns '' for non-strings. */
export function sanitizeString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLen)
}

/**
 * Best-effort client IP extraction from proxy headers (Vercel sets
 * x-forwarded-for). Falls back to a constant bucket when unavailable.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

type Bucket = { count: number; resetAt: number }
const store = new Map<string, Bucket>()

/**
 * Fixed-window in-memory rate limiter. Suitable for single-instance / basic
 * abuse mitigation. Returns { allowed, remaining, retryAfter }.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { allowed: true, remaining: limit - existing.count, retryAfter: 0 }
}

// Periodically evict expired buckets to bound memory usage.
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key)
    }
  }, 60_000)
  // Do not keep the process alive solely for cleanup.
  if (typeof (timer as { unref?: () => void }).unref === 'function') {
    ;(timer as { unref?: () => void }).unref!()
  }
}
