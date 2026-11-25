/**
 * Revist 2.0 — Minimal Serverless Intermediary (Cloudflare Worker)
 *
 * Bridges GitHub Pages static frontend -> Google Apps Script Web App:
 * - Enforces CORS origin allowlist
 * - Validates request size, JSON structure, required fields, consent & honeypot
 * - Applies per-IP rate limiting (sliding 60s window)
 * - Injects server-side SHARED_SECRET before forwarding to Google Apps Script
 * - Returns explicit readable JSON responses (never opaque no-cors)
 * - Logs zero personal lead information
 */

interface Env {
  APPS_SCRIPT_URL: string;
  SHARED_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

const MAX_BYTES = 8192;
const RATE_LIMIT_MAX_PER_MIN = 8;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string | null, allowedOrigin: string): Record<string, string> {
  const allow = origin && origin === allowedOrigin ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (bucket.count >= RATE_LIMIT_MAX_PER_MIN) {
    return true;
  }
  bucket.count += 1;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = (env.ALLOWED_ORIGIN || 'https://therevist.in').trim();
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin, allowedOrigin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed.' }, 405, headers);
    }

    if (origin && origin !== allowedOrigin) {
      return json({ success: false, error: 'Origin not permitted.' }, 403, headers);
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(clientIp)) {
      return json(
        { success: false, error: 'Too many requests. Please wait a minute and retry.' },
        429,
        headers,
      );
    }

    const rawText = await request.text();
    if (rawText.length === 0 || rawText.length > MAX_BYTES) {
      return json({ success: false, error: 'Invalid payload size.' }, 400, headers);
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      return json({ success: false, error: 'Invalid JSON payload.' }, 400, headers);
    }

    if (typeof payload.websiteHp === 'string' && payload.websiteHp.trim().length > 0) {
      return json({ success: false, error: 'Submission rejected.' }, 400, headers);
    }

    if (payload.consent !== true) {
      return json({ success: false, error: 'Contact consent is required.' }, 400, headers);
    }

    if (!env.APPS_SCRIPT_URL || !env.SHARED_SECRET) {
      return json({ success: false, error: 'Lead backend is not configured.' }, 503, headers);
    }

    try {
      const upstream = await fetch(env.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          ...payload,
          _proxySecret: env.SHARED_SECRET,
        }),
      });

      const text = await upstream.text();
      const parsed = JSON.parse(text) as { success?: boolean; leadId?: string; message?: string; error?: string };

      if (!upstream.ok || parsed.success !== true || !parsed.leadId) {
        return json(
          {
            success: false,
            error: parsed.error || 'Could not save trial request. Please try again.',
          },
          400,
          headers,
        );
      }

      return json(
        {
          success: true,
          leadId: parsed.leadId,
          message: parsed.message || 'Trial request received',
        },
        200,
        headers,
      );
    } catch {
      return json(
        { success: false, error: 'Upstream service unavailable. Please retry shortly.' },
        502,
        headers,
      );
    }
  },
};
