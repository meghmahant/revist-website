import type { TrialLeadPayload, TrialLeadResponse } from '../types';
import { siteConfig } from '../config/siteConfig';

const IN_FLIGHT_KEYS = new Set<string>();

export async function submitTrialLead(
  payload: TrialLeadPayload,
  signal?: AbortSignal,
): Promise<TrialLeadResponse> {
  if (!siteConfig.leadEndpoint) {
    return {
      success: false,
      isUnconfigured: true,
      error:
        'Trial registration endpoint is not yet connected in this preview environment. Configure VITE_LEAD_ENDPOINT after deploying the Google Apps Script / serverless backend.',
    };
  }

  if (IN_FLIGHT_KEYS.has(payload.idempotencyKey)) {
    return {
      success: false,
      error: 'A submission is already in progress. Please wait a moment.',
    };
  }

  IN_FLIGHT_KEYS.add(payload.idempotencyKey);

  try {
    const response = await fetch(siteConfig.leadEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        success: false,
        error:
          'We could not verify whether your request was saved. Please retry in a moment.',
      };
    }

    const data = (await response.json()) as Partial<TrialLeadResponse>;
    if (!response.ok || data.success !== true || !data.leadId) {
      return {
        success: false,
        error:
          typeof data.error === 'string' && data.error.trim().length > 0
            ? data.error
            : 'Unable to submit your trial request right now. Please try again.',
      };
    }

    return {
      success: true,
      leadId: data.leadId,
      message: data.message || 'Trial request received',
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: 'The request was cancelled or timed out. Your details have been kept—please retry.',
      };
    }
    return {
      success: false,
      error:
        'Network error while sending your trial request. Your entered details are preserved—please try again.',
    };
  } finally {
    IN_FLIGHT_KEYS.delete(payload.idempotencyKey);
  }
}
