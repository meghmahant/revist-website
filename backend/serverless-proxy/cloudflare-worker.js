/**
 * Revist 2.0 — Minimal Serverless Intermediary (Cloudflare Worker, JavaScript edition)
 * Safe to paste directly into Cloudflare Dashboard -> Worker -> Edit code.
 *
 * Configure in Worker Settings -> Variables and Secrets:
 * - Variable (Text):  ALLOWED_ORIGIN  = https://therevist.in
 * - Secret:           APPS_SCRIPT_URL = your Google Apps Script /exec URL
 * - Secret:           SHARED_SECRET   = exact same secret set in Apps Script Properties
 */

const MAX_BYTES = 8192;
const RATE_LIMIT_MAX_PER_MIN = 8;
const rateBuckets = new Map();

function corsHeaders(origin, allowedOrigin) {
  const allow = origin && origin === allowedOrigin ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  if (bucket.count >= RATE_LIMIT_MAX_PER_MIN) {
    return true;
  }
  bucket.count += 1;
  return false;
}

export default {
  async fetch(request, env) {
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

    let payload;
    try {
      payload = JSON.parse(rawText);
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
      const parsed = JSON.parse(text);

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
