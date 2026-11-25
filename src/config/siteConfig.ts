import type { SiteConfig } from '../types';

function readEnv(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  return (env[key] ?? '').trim();
}

function readEnvInt(key: string, fallback: number): number {
  const parsed = Number.parseInt(readEnv(key), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const siteConfig: SiteConfig = {
  brandName: readEnv('VITE_BRAND_NAME') || 'Revist',
  websiteUrl: readEnv('VITE_WEBSITE_URL') || 'https://therevist.in',
  // Unconfigured values remain empty so broken placeholders are never displayed
  businessEmail: readEnv('VITE_BUSINESS_EMAIL'),
  businessPhone: readEnv('VITE_BUSINESS_PHONE'),
  leadEndpoint: readEnv('VITE_LEAD_ENDPOINT'),
  clientDashboardUrl: readEnv('VITE_CLIENT_DASHBOARD_URL'),
  defaultInactivityThreshold: readEnvInt('VITE_DEFAULT_INACTIVITY_THRESHOLD', 21),
  trialDurationDays: readEnvInt('VITE_TRIAL_DURATION_DAYS', 30),
  privacyPolicyVersion: readEnv('VITE_PRIVACY_POLICY_VERSION') || '2026-11-draft-v1',
  termsVersion: readEnv('VITE_TERMS_VERSION') || '2026-11-draft-v1',
  copyrightOwner: 'Megh Hiteshkumar Mahant',
  features: {
    trialRequestsEnabled: true,
    pricingPublic: false,
    liveConsentCaptureReady: false,
    deliveryTrackingReady: false,
    weeklyReportsReady: false,
  },
  socialLinks: {
    linkedin: readEnv('VITE_SOCIAL_LINKEDIN'),
    instagram: readEnv('VITE_SOCIAL_INSTAGRAM'),
    x: readEnv('VITE_SOCIAL_X'),
  },
};
