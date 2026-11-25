export type ThemeMode = 'dark' | 'light';

export type AppRoute = '/' | '/privacy-policy' | '/terms-of-service';

export interface SiteConfig {
  brandName: string;
  websiteUrl: string;
  businessEmail: string;
  businessPhone: string;
  leadEndpoint: string;
  clientDashboardUrl: string;
  defaultInactivityThreshold: number;
  trialDurationDays: number;
  privacyPolicyVersion: string;
  termsVersion: string;
  copyrightOwner: string;
  features: {
    trialRequestsEnabled: boolean;
    pricingPublic: boolean;
    liveConsentCaptureReady: boolean;
    deliveryTrackingReady: boolean;
    weeklyReportsReady: boolean;
  };
  socialLinks: {
    linkedin: string;
    instagram: string;
    x: string;
  };
}

export interface DemoCustomer {
  id: string;
  name: string;
  daysSinceLastVisit: number;
  totalSpend: number;
  usualOrder: string;
  optedIn: boolean;
  optedOut: boolean;
  lastReminderDaysAgo: number | null;
}

export interface DemoOrderMetric {
  dateLabel: string;
  orders: number;
  revenue: number;
  returningOrders: number;
}

export interface DemoDishMetric {
  name: string;
  orders: number;
  sharePercent: number;
}

export interface DemoRestaurant {
  id: string;
  name: string;
  cityLabel: string;
  cuisineLabel: string;
  customers: DemoCustomer[];
  ordersTimeline: {
    '30d': DemoOrderMetric[];
    '90d': DemoOrderMetric[];
  };
  topDishes: DemoDishMetric[];
}

export interface TrialLeadPayload {
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  consent: boolean;
  consentTimestamp: string;
  privacyNoticeVersion: string;
  leadSource: string;
  idempotencyKey: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  websiteHp?: string; // Honeypot field (must remain empty)
}

export interface TrialLeadResponse {
  success: boolean;
  leadId?: string;
  message?: string;
  error?: string;
  isUnconfigured?: boolean;
}
