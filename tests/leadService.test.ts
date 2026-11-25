import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TrialLeadPayload } from '../src/types';

const samplePayload: TrialLeadPayload = {
  restaurantName: 'The Urban Café',
  contactName: 'Rohan Kulkarni',
  phone: '+919876543210',
  email: 'rohan@urbancafe.in',
  consent: true,
  consentTimestamp: '2026-11-25T10:00:00.000Z',
  privacyNoticeVersion: '2026-11-draft-v1',
  leadSource: 'hero_primary_cta',
  idempotencyKey: 'idem-test-1',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  websiteHp: '',
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('submitTrialLead service', () => {
  it('returns explicit unconfigured error when VITE_LEAD_ENDPOINT is empty', async () => {
    vi.doMock('../src/config/siteConfig', () => ({
      siteConfig: { leadEndpoint: '' },
    }));
    const { submitTrialLead } = await import('../src/services/leadService');
    const res = await submitTrialLead(samplePayload);
    expect(res.success).toBe(false);
    expect(res.isUnconfigured).toBe(true);
  });

  it('returns success only when verified JSON with leadId is returned', async () => {
    vi.doMock('../src/config/siteConfig', () => ({
      siteConfig: { leadEndpoint: 'https://example.workers.dev/lead' },
    }));
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, leadId: 'REV-ABC123', message: 'Trial request received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { submitTrialLead } = await import('../src/services/leadService');
    const res = await submitTrialLead(samplePayload);
    expect(res).toEqual({
      success: true,
      leadId: 'REV-ABC123',
      message: 'Trial request received',
    });
  });

  it('rejects opaque or non-JSON responses instead of assuming success', async () => {
    vi.doMock('../src/config/siteConfig', () => ({
      siteConfig: { leadEndpoint: 'https://example.workers.dev/lead' },
    }));
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<html>redirect</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }),
    );

    const { submitTrialLead } = await import('../src/services/leadService');
    const res = await submitTrialLead(samplePayload);
    expect(res.success).toBe(false);
    expect(res.error).toContain('could not verify');
  });

  it('handles network failures gracefully', async () => {
    vi.doMock('../src/config/siteConfig', () => ({
      siteConfig: { leadEndpoint: 'https://example.workers.dev/lead' },
    }));
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network down'));

    const { submitTrialLead } = await import('../src/services/leadService');
    const res = await submitTrialLead(samplePayload);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Network error');
  });
});
