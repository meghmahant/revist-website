import { useState } from 'react';
import {
  BarChart2,
  CopyCheck,
  FileSpreadsheet,
  Lock,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

export function ProductFeaturesSection() {
  const [miniThreshold, setMiniThreshold] = useState(21);

  return (
    <section
      id="product"
      aria-labelledby="features-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
            Platform Capabilities
          </span>
          <h2
            id="features-heading"
            className="font-display text-section-display font-bold text-[var(--text-primary)]"
          >
            Built around the reality of independent restaurants.
          </h2>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl">
            Revist is a specialised customer retention platform—not a POS replacement, billing
            system, or delivery marketplace.
          </p>
        </div>

        {/* Varied Editorial Feature Rows (no uniform card grid) */}
        <div className="space-y-8">
          {/* Row 1: Asymmetric 7/5 split — Analytics + Adjustable Rule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <article className="lg:col-span-7 rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-2.5 max-w-lg">
                <span className="inline-flex items-center gap-2 text-xs font-mono-data text-[var(--accent-primary)]">
                  <BarChart2 className="h-4 w-4" />
                  Customer Analytics &amp; Restaurant-Specific Dashboard
                </span>
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  Understand guest activity inside your own workspace.
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Separate restaurant logins give each outlet a clear view of total customers,
                  inactive guests, and—when order-level data is included—top dishes, orders, and
                  revenue.
                </p>
              </div>

              {/* Miniature animated bar visualization */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 flex items-end gap-2 h-28">
                {[42, 68, 54, 82, 61, 90, 74, 88].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full rounded-t-md bg-[var(--accent-primary)]/80 transition-all duration-500"
                      style={{ height: `${h}%`, opacity: 0.45 + i * 0.07 }}
                    />
                  </div>
                ))}
                <span className="ml-2 font-mono-data text-[10px] text-[var(--text-muted)] self-start">
                  Illustrative pulse
                </span>
              </div>
            </article>

            <article className="lg:col-span-5 rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-2 text-xs font-mono-data text-[var(--accent-primary)]">
                  <SlidersHorizontal className="h-4 w-4" />
                  Adjustable Inactivity Rules
                </span>
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  Define what &ldquo;inactive&rdquo; means for your dining room.
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Default is strictly more than 21 days since last visit, adjustable per restaurant.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-data">
                  <span className="text-[var(--text-secondary)]">Rule preview</span>
                  <span className="text-[var(--accent-primary)] font-semibold">
                    &gt; {miniThreshold} days
                  </span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={45}
                  value={miniThreshold}
                  aria-label="Preview adjustable inactivity threshold"
                  onChange={(e) => setMiniThreshold(Number(e.target.value))}
                  className="revist-slider"
                />
                <div className="flex justify-between text-[11px] font-mono-data text-[var(--text-muted)]">
                  <span>Day {miniThreshold}: Active</span>
                  <span>Day {miniThreshold + 1}: Inactive</span>
                </div>
              </div>
            </article>
          </div>

          {/* Row 2: Three-pillar editorial strip — CSV, Duplicate Protection, WhatsApp API */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                CSV Import Without POS Credentials
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Export customer lists from your existing billing system and upload them yourself.
                Revist never asks for POS passwords or direct billing logins.
              </p>
              <div className="pt-2 font-mono-data text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                customers_export.csv &rarr; Revist
              </div>
            </article>

            <article className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                <CopyCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                Built-In Duplicate Protection
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Re-uploading weekly exports won&apos;t clutter your database. Duplicate customer
                entries are guarded during CSV import.
              </p>
              <div className="pt-2 font-mono-data text-[11px] text-[var(--accent-primary)] border-t border-[var(--border-subtle)]">
                Duplicate phone entries merged cleanly
              </div>
            </article>

            <article className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                Personalised WhatsApp Campaigns
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Built on WhatsApp&apos;s official Business API using your restaurant&apos;s own
                WhatsApp Business account and approved message templates.
              </p>
              <div className="pt-2 font-mono-data text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                Tested end to end on a test number
              </div>
            </article>
          </div>

          {/* Row 3: Full-width Responsible Engagement Banner */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-surface)]/55 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Responsible customer engagement by design
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Intended messaging rules require guest opt-in, honour STOP opt-outs, and cap
                  reminders at once every 30 days. Production opt-in capture, consent verification,
                  delivery status tracking, and weekly performance reports are still being completed
                  before live restaurant campaigns begin.
                </p>
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-2 font-mono-data text-xs text-[var(--text-secondary)]">
              <Lock className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              Live campaigns gated on consent readiness
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
