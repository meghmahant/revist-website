import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useTrialModal } from '../../context/TrialModalContext';
import { useAppRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { siteConfig } from '../../config/siteConfig';
import { normalisePhoneNumber, trialFormSchema, type TrialFormValues } from '../../utils/validation';
import { submitTrialLead } from '../../services/leadService';

function getUtmParams(): { utmSource: string; utmMedium: string; utmCampaign: string } {
  if (typeof window === 'undefined') {
    return { utmSource: '', utmMedium: '', utmCampaign: '' };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: (params.get('utm_source') ?? '').slice(0, 80),
    utmMedium: (params.get('utm_medium') ?? '').slice(0, 80),
    utmCampaign: (params.get('utm_campaign') ?? '').slice(0, 80),
  };
}

function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function TrialModal() {
  const { isOpen, leadSource, closeModal } = useTrialModal();
  const { navigate } = useAppRouter();
  const { theme } = useTheme();
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUnconfiguredNotice, setIsUnconfiguredNotice] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>(createIdempotencyKey());

  const utm = useMemo(getUtmParams, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrialFormValues>({
    resolver: zodResolver(trialFormSchema),
    defaultValues: {
      restaurantName: '',
      contactName: '',
      phone: '',
      email: '',
      consent: false,
      websiteHp: '',
    },
  });

  // Escape key, focus trap, and background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([tabindex="-1"]), button, a[href]',
      );
      firstFocusable?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleClose = () => {
    if (submittedName) {
      reset();
      setSubmittedName(null);
      setSubmittedLeadId(null);
      idempotencyKeyRef.current = createIdempotencyKey();
    }
    setSubmitError(null);
    setIsUnconfiguredNotice(false);
    closeModal();
  };

  const onSubmit = async (values: TrialFormValues) => {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsUnconfiguredNotice(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const result = await submitTrialLead(
        {
          restaurantName: values.restaurantName.trim(),
          contactName: values.contactName.trim(),
          phone: normalisePhoneNumber(values.phone),
          email: values.email.trim().toLowerCase(),
          consent: values.consent,
          consentTimestamp: new Date().toISOString(),
          privacyNoticeVersion: siteConfig.privacyPolicyVersion,
          leadSource,
          idempotencyKey: idempotencyKeyRef.current,
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
          websiteHp: values.websiteHp ?? '',
        },
        controller.signal,
      );

      if (result.success && result.leadId) {
        setSubmittedName(values.contactName.trim());
        setSubmittedLeadId(result.leadId);
        idempotencyKeyRef.current = createIdempotencyKey();
        return;
      }

      if (result.isUnconfigured) {
        setIsUnconfiguredNotice(true);
      }
      setSubmitError(
        result.error || 'Could not process your trial request right now. Please try again.',
      );
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close trial registration modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {submittedName ? (
              <div className="py-6 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-tint)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]"
                >
                  <CheckCircle2 className="h-9 w-9" />
                </motion.div>

                <div className="space-y-2">
                  <h2
                    id={titleId}
                    className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"
                  >
                    You&apos;re one step closer!
                  </h2>
                  <p id={descId} className="text-base text-[var(--text-secondary)]">
                    Thank you, <span className="font-semibold text-[var(--text-primary)]">{submittedName}</span>!
                    Our team will contact you soon to help you get started with Revist.
                  </p>
                </div>

                {submittedLeadId && (
                  <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-1.5 font-mono-data text-xs text-[var(--text-secondary)]">
                    Reference ID: {submittedLeadId}
                  </p>
                )}

                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  This submits a free trial onboarding request. Accounts are configured manually with
                  your team before any live campaign begins.
                </p>

                <button
                  type="button"
                  onClick={handleClose}
                  className={`mt-2 w-full rounded-full bg-[var(--accent-primary)] py-3.5 text-sm font-semibold transition-all hover:brightness-110 cursor-pointer ${
                    theme === 'dark' ? 'text-[#04120a]' : 'text-white'
                  }`}
                >
                  Back to Homepage
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 pr-8 space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-3 py-1 text-xs font-medium text-[var(--accent-primary)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    30-Day Free Trial Request
                  </span>
                  <h2
                    id={titleId}
                    className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"
                  >
                    Let&apos;s grow your restaurant.
                  </h2>
                  <p id={descId} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Tell us a little about your business. Our team will contact you to discuss your
                    Revist free trial and onboarding.
                  </p>
                </div>

                {!siteConfig.leadEndpoint && (
                  <div
                    role="status"
                    className="mb-5 rounded-xl border border-[var(--warning-amber)]/35 bg-[var(--warning-tint)] px-3.5 py-2.5 text-xs text-[var(--text-primary)]"
                  >
                    <strong className="font-semibold">Backend configuration pending:</strong> Lead
                    submission runs in unconfigured preview mode until{' '}
                    <code className="font-mono-data">VITE_LEAD_ENDPOINT</code> is connected to the
                    Apps Script / Worker backend.
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                  {/* Honeypot anti-bot field (hidden from assistive tech & visual users) */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website-hp">Leave this field blank</label>
                    <input
                      id="website-hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register('websiteHp')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="trial-restaurant-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Restaurant or café name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="trial-restaurant-name"
                      type="text"
                      autoComplete="organization"
                      placeholder="e.g., The Urban Café"
                      aria-invalid={Boolean(errors.restaurantName)}
                      aria-describedby={errors.restaurantName ? 'err-restaurant' : undefined}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
                      {...register('restaurantName')}
                    />
                    {errors.restaurantName && (
                      <p id="err-restaurant" role="alert" className="mt-1.5 text-xs text-[var(--danger-rose)]">
                        {errors.restaurantName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="trial-contact-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Contact person&apos;s full name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="trial-contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g., Rohan Kulkarni"
                      aria-invalid={Boolean(errors.contactName)}
                      aria-describedby={errors.contactName ? 'err-contact' : undefined}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
                      {...register('contactName')}
                    />
                    {errors.contactName && (
                      <p id="err-contact" role="alert" className="mt-1.5 text-xs text-[var(--danger-rose)]">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="trial-phone"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                      >
                        Phone number <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="trial-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'err-phone' : undefined}
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p id="err-phone" role="alert" className="mt-1.5 text-xs text-[var(--danger-rose)]">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="trial-email"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                      >
                        Email address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="trial-email"
                        type="email"
                        autoComplete="email"
                        placeholder="owner@restaurant.in"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="err-email" role="alert" className="mt-1.5 text-xs text-[var(--danger-rose)]">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'err-consent' : undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent-primary)] cursor-pointer"
                        {...register('consent')}
                      />
                      <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                        I agree to be contacted by Revist regarding my free trial request and
                        acknowledge the{' '}
                        <button
                          type="button"
                          onClick={() => {
                            closeModal();
                            navigate('/privacy-policy');
                          }}
                          className="underline font-medium text-[var(--accent-primary)] hover:opacity-80 cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="err-consent" role="alert" className="mt-1.5 text-xs text-[var(--danger-rose)]">
                        {errors.consent.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs ${
                        isUnconfiguredNotice
                          ? 'border-[var(--warning-amber)]/40 bg-[var(--warning-tint)] text-[var(--text-primary)]'
                          : 'border-[var(--danger-rose)]/40 bg-[var(--danger-tint)] text-[var(--danger-rose)]'
                      }`}
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] py-3.5 text-sm font-semibold shadow-[0_0_28px_var(--accent-glow)] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                      theme === 'dark' ? 'text-[#04120a]' : 'text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending request...
                      </>
                    ) : (
                      'Request Free Trial'
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    No billing system credentials or card details required.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
