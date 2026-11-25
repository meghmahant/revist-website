import { z } from 'zod';

/**
 * Normalises a phone number string for validation and submission.
 * Supports 10-digit Indian mobile numbers (e.g. 9876543210, 09876543210, +91 98765 43210)
 * as well as valid E.164 international phone numbers (+[country][number]).
 */
export function normalisePhoneNumber(raw: string): string {
  const trimmed = raw.trim();
  // Strip spaces, hyphens, parentheses, and dots while preserving leading +
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!hasPlus && digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }
  if (!hasPlus && digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^0[6-9]\d{9}$/.test(digitsOnly)) {
    return `+91${digitsOnly.slice(1)}`;
  }
  if (!hasPlus && digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^91[6-9]\d{9}$/.test(digitsOnly)) {
    return `+${digitsOnly}`;
  }
  if (hasPlus) {
    return `+${digitsOnly}`;
  }
  return digitsOnly;
}

export function isValidPhoneNumber(raw: string): boolean {
  const normalised = normalisePhoneNumber(raw);
  // Indian mobile (+91 followed by 6-9 and 9 digits)
  if (normalised.startsWith('+91')) {
    return /^\+91[6-9]\d{9}$/.test(normalised);
  }
  // General E.164 international number (8 to 15 digits after +)
  if (normalised.startsWith('+')) {
    return /^\+[1-9]\d{7,14}$/.test(normalised);
  }
  return false;
}

export const trialFormSchema = z.object({
  restaurantName: z
    .string()
    .trim()
    .min(2, 'Please enter your restaurant or café name.')
    .max(120, 'Restaurant name must be 120 characters or fewer.'),
  contactName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'Contact name must be 100 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .max(25, 'Phone number is too long.')
    .refine(isValidPhoneNumber, {
      message: 'Enter a valid 10-digit Indian mobile number (+91) or international number.',
    }),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .max(160, 'Email address must be 160 characters or fewer.')
    .email('Please enter a valid email address.'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please confirm consent so our team can contact you about your trial request.',
  }),
  websiteHp: z.string().max(0).optional(),
});

export type TrialFormValues = z.infer<typeof trialFormSchema>;
