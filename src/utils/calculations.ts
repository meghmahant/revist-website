import type { DemoCustomer } from '../types';

export interface EligibilityInput {
  daysSinceLastVisit: number;
  inactivityThreshold: number;
  optedIn: boolean;
  optedOut: boolean;
  remindedWithinLast30Days: boolean;
}

export interface EligibilityResult {
  isInactive: boolean;
  isEligible: boolean;
  reasons: string[];
}

export interface RevenueCalculationInput {
  inactiveCustomers: number;
  eligiblePercent: number;
  assumedReturnRate: number;
  averageBillValue: number;
  discountPercent: number;
}

export interface RevenueCalculationResult {
  eligibleCustomers: number;
  estimatedReturningCustomers: number;
  potentialGrossRevenue: number;
  potentialRevenueAfterDiscounts: number;
}

/**
 * Business rule: A customer is inactive only when days since last visit
 * is strictly greater than the configured inactivity threshold (default: > 21 days).
 */
export function isCustomerInactive(daysSinceLastVisit: number, threshold: number): boolean {
  return daysSinceLastVisit > threshold;
}

/**
 * Evaluates whether a customer can receive a simulated promotional WhatsApp message.
 * A customer reminded fewer than 30 days ago is blocked; 30+ days ago is allowed.
 */
export function evaluateCampaignEligibility(input: EligibilityInput): EligibilityResult {
  const isInactive = isCustomerInactive(input.daysSinceLastVisit, input.inactivityThreshold);
  const reasons: string[] = [];

  if (!isInactive) {
    reasons.push(
      `Customer visited ${input.daysSinceLastVisit} day${input.daysSinceLastVisit === 1 ? '' : 's'} ago, which does not exceed the ${input.inactivityThreshold}-day threshold.`,
    );
  }
  if (!input.optedIn) {
    reasons.push('Customer has not opted in to promotional WhatsApp messages.');
  }
  if (input.optedOut) {
    reasons.push('Customer has opted out (STOP) and must be excluded.');
  }
  if (input.remindedWithinLast30Days) {
    reasons.push('Customer already received a reminder within the previous 30 days.');
  }

  return {
    isInactive,
    isEligible: reasons.length === 0,
    reasons,
  };
}

export function isDemoCustomerEligible(customer: DemoCustomer, threshold: number): EligibilityResult {
  const remindedWithinLast30Days =
    customer.lastReminderDaysAgo !== null && customer.lastReminderDaysAgo < 30;
  return evaluateCampaignEligibility({
    daysSinceLastVisit: customer.daysSinceLastVisit,
    inactivityThreshold: threshold,
    optedIn: customer.optedIn,
    optedOut: customer.optedOut,
    remindedWithinLast30Days,
  });
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function calculateRevenueEstimate(
  raw: RevenueCalculationInput,
): RevenueCalculationResult {
  const inactiveCustomers = Math.max(0, Math.round(Number.isFinite(raw.inactiveCustomers) ? raw.inactiveCustomers : 0));
  const eligiblePercent = clampNumber(raw.eligiblePercent, 0, 100);
  const assumedReturnRate = clampNumber(raw.assumedReturnRate, 0, 100);
  const averageBillValue = Math.max(0, Number.isFinite(raw.averageBillValue) ? raw.averageBillValue : 0);
  const discountPercent = clampNumber(raw.discountPercent, 0, 90);

  const eligibleCustomers = Math.floor((inactiveCustomers * eligiblePercent) / 100);
  const estimatedReturningCustomers = Math.round((eligibleCustomers * assumedReturnRate) / 100);
  const potentialGrossRevenue = Math.round(estimatedReturningCustomers * averageBillValue);
  const potentialRevenueAfterDiscounts = Math.round(
    potentialGrossRevenue * (1 - discountPercent / 100),
  );

  return {
    eligibleCustomers,
    estimatedReturningCustomers,
    potentialGrossRevenue,
    potentialRevenueAfterDiscounts,
  };
}
