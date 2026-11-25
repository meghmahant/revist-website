import { Ban, Check, Lock, Shield } from 'lucide-react';

const REQUIRED_COLUMNS = [
  { name: 'Customer name', note: 'For personalised greetings' },
  { name: 'Phone number', note: 'For WhatsApp eligibility matching' },
  { name: 'Last visit date', note: 'For inactivity detection (> 21 days)' },
];

const OPTIONAL_COLUMNS = [
  { name: 'Usual order', note: 'Enables dish insights' },
  { name: 'Total spend', note: 'Enables spend-based analytics' },
];

const EXCLUDED_DATA = [
  'Payment card numbers or CVVs',
  'Bank account or UPI credentials',
  'Billing software / POS passwords',
  'Customer residential addresses',
  'Unnecessary sensitive personal details',
];

const PRINCIPLES = [
  'Restaurants decide exactly which customer columns to export from their billing software.',
  'Revist does not require billing system credentials or direct POS account access.',
  'Promotional WhatsApp messages require customer opt-in consent before live dispatch.',
  'Customers must be able to opt out at any time by replying STOP.',
  'The intended reminder policy limits outreach to one reminder per customer within 30 days.',
  'Public website demonstrations use fictional datasets—never actual restaurant records.',
];

export function DataPrivacySection() {
  return (
    <section
      id="privacy-trust"
      aria-labelledby="privacy-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/35"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Trust Manifesto */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
                <Shield className="h-3.5 w-3.5" />
                Data Privacy &amp; Control
              </span>
              <h2
                id="privacy-heading"
                className="font-display text-section-display font-bold text-[var(--text-primary)]"
              >
                Your customer relationships. Your data. Your control.
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Revist is built around data minimisation—collect only what helps you understand
                repeat visits and leave sensitive financial or billing credentials behind.
              </p>
            </div>

            <ul className="space-y-3.5">
              {PRINCIPLES.map((principle) => (
                <li key={principle} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm sm:text-base text-[var(--text-secondary)]">
                    {principle}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Data Minimisation Inspector */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-primary)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                  CSV Data Minimisation Guide
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Remove unnecessary columns before uploading your CSV export.
                </p>
              </div>
              <Lock className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--accent-primary)]/35 bg-[var(--bg-secondary)] p-4 space-y-3">
                <div className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--accent-primary)]">
                  Required Columns
                </div>
                <ul className="space-y-2.5">
                  {REQUIRED_COLUMNS.map((col) => (
                    <li key={col.name} className="text-xs">
                      <div className="font-semibold text-[var(--text-primary)]">{col.name}</div>
                      <div className="text-[var(--text-muted)]">{col.note}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-3">
                <div className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                  Optional Columns
                </div>
                <ul className="space-y-2.5">
                  {OPTIONAL_COLUMNS.map((col) => (
                    <li key={col.name} className="text-xs">
                      <div className="font-semibold text-[var(--text-primary)]">{col.name}</div>
                      <div className="text-[var(--text-muted)]">{col.note}</div>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                  Detailed order counts, revenue, and top-dish views require order-level data.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--danger-rose)]/30 bg-[var(--danger-tint)]/45 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-mono-data text-[11px] uppercase tracking-wider text-[var(--danger-rose)]">
                <Ban className="h-3.5 w-3.5" />
                Information Revist Does Not Require
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXCLUDED_DATA.map((item) => (
                  <div
                    key={item}
                    className="text-xs text-[var(--text-primary)] flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger-rose)] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
