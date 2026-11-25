import { describe, expect, it } from 'vitest';
import { isValidPhoneNumber, normalisePhoneNumber, trialFormSchema } from '../src/utils/validation';

describe('Phone normalisation and validation', () => {
  it('normalises 10-digit Indian mobile numbers to +91', () => {
    expect(normalisePhoneNumber('9876543210')).toBe('+919876543210');
    expect(normalisePhoneNumber('098765 43210')).toBe('+919876543210');
    expect(normalisePhoneNumber('+91 98765-43210')).toBe('+919876543210');
    expect(isValidPhoneNumber('9876543210')).toBe(true);
    expect(isValidPhoneNumber('+91 98765 43210')).toBe(true);
  });

  it('accepts valid international E.164 phone numbers', () => {
    expect(isValidPhoneNumber('+44 7911 123456')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidPhoneNumber('12345')).toBe(false);
    expect(isValidPhoneNumber('not-a-phone')).toBe(false);
    expect(isValidPhoneNumber('+911234567890')).toBe(false);
  });
});

describe('Trial registration schema validation', () => {
  const validInput = {
    restaurantName: 'The Urban Café',
    contactName: 'Rohan Kulkarni',
    phone: '+91 98765 43210',
    email: 'rohan@urbancafe.in',
    consent: true,
    websiteHp: '',
  };

  it('accepts valid trimmed input with consent', () => {
    const parsed = trialFormSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);
  });

  it('rejects missing consent', () => {
    const parsed = trialFormSchema.safeParse({ ...validInput, consent: false });
    expect(parsed.success).toBe(false);
  });

  it('rejects invalid email and excessively long inputs', () => {
    const badEmail = trialFormSchema.safeParse({ ...validInput, email: 'invalid-email' });
    expect(badEmail.success).toBe(false);

    const tooLong = trialFormSchema.safeParse({
      ...validInput,
      restaurantName: 'A'.repeat(121),
    });
    expect(tooLong.success).toBe(false);
  });

  it('rejects filled honeypot field', () => {
    const bot = trialFormSchema.safeParse({ ...validInput, websiteHp: 'http://spam.example' });
    expect(bot.success).toBe(false);
  });
});
