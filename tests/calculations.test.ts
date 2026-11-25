import { describe, expect, it } from 'vitest';
import {
  calculateRevenueEstimate,
  evaluateCampaignEligibility,
  isCustomerInactive,
} from '../src/utils/calculations';

describe('Inactivity threshold business rule (strictly greater than)', () => {
  it('treats exactly 21 days as active under the default 21-day rule', () => {
    expect(isCustomerInactive(21, 21)).toBe(false);
  });

  it('treats 22 days as inactive under the default 21-day rule', () => {
    expect(isCustomerInactive(22, 21)).toBe(true);
  });

  it('adapts to custom thresholds cleanly', () => {
    expect(isCustomerInactive(14, 14)).toBe(false);
    expect(isCustomerInactive(15, 14)).toBe(true);
  });
});

describe('Campaign eligibility rules and 30-day boundary', () => {
  it('allows eligible inactive customer with opt-in, no opt-out, and no recent reminder', () => {
    const res = evaluateCampaignEligibility({
      daysSinceLastVisit: 28,
      inactivityThreshold: 21,
      optedIn: true,
      optedOut: false,
      remindedWithinLast30Days: false,
    });
    expect(res.isInactive).toBe(true);
    expect(res.isEligible).toBe(true);
    expect(res.reasons).toHaveLength(0);
  });

  it('blocks customer without opt-in consent', () => {
    const res = evaluateCampaignEligibility({
      daysSinceLastVisit: 28,
      inactivityThreshold: 21,
      optedIn: false,
      optedOut: false,
      remindedWithinLast30Days: false,
    });
    expect(res.isEligible).toBe(false);
    expect(res.reasons.some((r) => r.includes('opted in'))).toBe(true);
  });

  it('blocks customer who opted out (STOP)', () => {
    const res = evaluateCampaignEligibility({
      daysSinceLastVisit: 28,
      inactivityThreshold: 21,
      optedIn: true,
      optedOut: true,
      remindedWithinLast30Days: false,
    });
    expect(res.isEligible).toBe(false);
    expect(res.reasons.some((r) => r.includes('STOP'))).toBe(true);
  });

  it('blocks customer reminded fewer than 30 days ago (e.g. 29d)', () => {
    const res = evaluateCampaignEligibility({
      daysSinceLastVisit: 28,
      inactivityThreshold: 21,
      optedIn: true,
      optedOut: false,
      remindedWithinLast30Days: 29 < 30,
    });
    expect(res.isEligible).toBe(false);
  });

  it('allows customer reminded exactly 30 days ago', () => {
    const daysSinceReminder = 30;
    const res = evaluateCampaignEligibility({
      daysSinceLastVisit: 31,
      inactivityThreshold: 21,
      optedIn: true,
      optedOut: false,
      remindedWithinLast30Days: daysSinceReminder < 30,
    });
    expect(res.isEligible).toBe(true);
  });
});

describe('Revenue calculator formulas and boundaries', () => {
  it('computes exact default values (500, 60%, 10%, ₹600, 10%)', () => {
    const res = calculateRevenueEstimate({
      inactiveCustomers: 500,
      eligiblePercent: 60,
      assumedReturnRate: 10,
      averageBillValue: 600,
      discountPercent: 10,
    });
    expect(res).toEqual({
      eligibleCustomers: 300,
      estimatedReturningCustomers: 30,
      potentialGrossRevenue: 18000,
      potentialRevenueAfterDiscounts: 16200,
    });
  });

  it('handles zero eligible customers', () => {
    const res = calculateRevenueEstimate({
      inactiveCustomers: 500,
      eligiblePercent: 0,
      assumedReturnRate: 10,
      averageBillValue: 600,
      discountPercent: 10,
    });
    expect(res.eligibleCustomers).toBe(0);
    expect(res.estimatedReturningCustomers).toBe(0);
    expect(res.potentialGrossRevenue).toBe(0);
    expect(res.potentialRevenueAfterDiscounts).toBe(0);
  });

  it('handles zero estimated return rate', () => {
    const res = calculateRevenueEstimate({
      inactiveCustomers: 500,
      eligiblePercent: 60,
      assumedReturnRate: 0,
      averageBillValue: 600,
      discountPercent: 10,
    });
    expect(res.eligibleCustomers).toBe(300);
    expect(res.estimatedReturningCustomers).toBe(0);
    expect(res.potentialGrossRevenue).toBe(0);
  });

  it('handles 100% eligibility', () => {
    const res = calculateRevenueEstimate({
      inactiveCustomers: 200,
      eligiblePercent: 100,
      assumedReturnRate: 10,
      averageBillValue: 500,
      discountPercent: 0,
    });
    expect(res.eligibleCustomers).toBe(200);
    expect(res.estimatedReturningCustomers).toBe(20);
    expect(res.potentialGrossRevenue).toBe(10000);
    expect(res.potentialRevenueAfterDiscounts).toBe(10000);
  });

  it('clamps negative and invalid values safely', () => {
    const res = calculateRevenueEstimate({
      inactiveCustomers: -100,
      eligiblePercent: 140,
      assumedReturnRate: -20,
      averageBillValue: Number.NaN,
      discountPercent: 120,
    });
    expect(res.eligibleCustomers).toBe(0);
    expect(res.estimatedReturningCustomers).toBe(0);
    expect(res.potentialGrossRevenue).toBe(0);
    expect(res.potentialRevenueAfterDiscounts).toBe(0);
  });
});
