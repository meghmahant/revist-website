import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarCheck2,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

interface WorkflowStage {
  step: string;
  title: string;
  shortTitle: string;
  icon: typeof FileSpreadsheet;
  summary: string;
  details: string[];
  badge?: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: '01',
    title: 'Export customer CSV',
    shortTitle: 'Export CSV',
    icon: FileSpreadsheet,
    summary:
      'Export your customer list directly from your existing billing software as a standard CSV file.',
    details: [
      'No direct billing system integration or POS login credentials required.',
      'You choose and review the exact columns exported before sharing anything.',
      'Only customer name, phone number, and last visit date are required.',
    ],
  },
  {
    step: '02',
    title: 'Upload to Revist',
    shortTitle: 'Upload CSV',
    icon: UploadCloud,
    summary:
      'Upload the CSV inside your own restaurant dashboard with automatic duplicate protection.',
    details: [
      'Separate dashboard login scoped strictly to your restaurant.',
      'Built-in duplicate protection avoids creating repeat customer entries on re-import.',
      'Optional usual order and total spend columns enrich your analytics view.',
    ],
  },
  {
    step: '03',
    title: 'Identify inactive customers',
    shortTitle: 'Detect Inactivity',
    icon: SlidersHorizontal,
    summary:
      'Revist inspects each guest’s last visit date against your restaurant’s inactivity threshold.',
    details: [
      'Default rule flags customers who have not visited for strictly more than 21 days.',
      'A guest at exactly 21 days remains active; Day 22 becomes inactive.',
      'Each restaurant can adjust the threshold to match its dining cadence.',
    ],
  },
  {
    step: '04',
    title: 'Verify customer messaging eligibility',
    shortTitle: 'Verify Eligibility',
    icon: ShieldCheck,
    summary:
      'Inactivity alone never sends a message. Every guest is checked against consent and frequency rules.',
    badge: 'Required before live campaigns',
    details: [
      'Customer must have opted in to promotional WhatsApp messages from your restaurant.',
      'Customers who replied STOP or opted out are excluded.',
      'Intended cooldown blocks more than one reminder within 30 days. Opt-in capture & STOP enforcement are being finalised before live restaurant launches.',
    ],
  },
  {
    step: '05',
    title: 'Personalise approved WhatsApp templates',
    shortTitle: 'Personalise Template',
    icon: MessageSquareText,
    summary:
      'Approved templates are personalised with customer name, restaurant name, and your offer.',
    details: [
      'Sent through your restaurant’s own WhatsApp Business account.',
      'Built on WhatsApp’s official Business API (tested end to end on a test number).',
      'Only approved WhatsApp message templates should be used in live campaigns.',
    ],
  },
  {
    step: '06',
    title: 'Schedule customer re-engagement',
    shortTitle: 'Daily Schedule',
    icon: CalendarCheck2,
    summary:
      'Campaigns are intended to operate on a calm daily schedule once all live prerequisites pass.',
    badge: 'Required before live campaigns',
    details: [
      'Designed to run daily without manual follow-ups once consent & template approvals are verified.',
      'Live deployment begins only after onboarding review and a test send to the owner.',
    ],
  },
];

export function AutomationWorkflowSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const activeStage = WORKFLOW_STAGES[activeIdx];
  const ActiveIcon = activeStage.icon;

  return (
    <section
      id="how-it-works"
      aria-labelledby="workflow-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)] overflow-hidden"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
              <Filter className="h-3.5 w-3.5" />
              How Revist Works
            </span>
            <h2
              id="workflow-heading"
              className="font-display text-section-display font-bold text-[var(--text-primary)]"
            >
              From customer data to meaningful reconnections.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[var(--text-secondary)]">
            Select any stage to inspect how Revist turns a simple billing CSV export into
            responsible, consent-gated WhatsApp outreach.
          </p>
        </div>

        {/* Horizontal Interactive Pipeline (Desktop) */}
        <div className="hidden lg:block mb-10">
          <div className="relative">
            {/* Connecting Rail with animated data pulse */}
            <div
              aria-hidden="true"
              className="absolute left-8 right-8 top-9 h-[2px] bg-[var(--border-subtle)] overflow-hidden"
            >
              <div
                className="h-full bg-[var(--accent-primary)] transition-all duration-500"
                style={{ width: `${(activeIdx / (WORKFLOW_STAGES.length - 1)) * 100}%` }}
              />
              {!reducedMotion && (
                <motion.div
                  className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-[var(--accent-bright)] to-transparent"
                  animate={{ x: ['-10%', '1100%'] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>

            <div className="relative grid grid-cols-6 gap-3" role="tablist" aria-label="Automation workflow stages">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = idx === activeIdx;
                const isCompleted = idx < activeIdx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`workflow-panel-${stage.step}`}
                    onClick={() => setActiveIdx(idx)}
                    className={`group flex flex-col items-start text-left rounded-2xl p-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-surface)]/85 border border-[var(--accent-primary)]/50 shadow-[0_12px_34px_var(--accent-glow)]'
                        : 'hover:bg-[var(--bg-secondary)]/70 border border-transparent'
                    }`}
                  >
                    <div
                      className={`relative z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#04120a]'
                          : isCompleted
                            ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-tint)] text-[var(--accent-primary)]'
                            : 'border-[var(--border-strong)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected ? 'text-[#04120a]' : ''
                        }`}
                      />
                    </div>
                    <span className="font-mono-data text-[11px] text-[var(--accent-primary)]">
                      Step {stage.step}
                    </span>
                    <span className="mt-0.5 font-display text-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {stage.shortTitle}
                    </span>
                    {stage.badge && (
                      <span className="mt-2 inline-block rounded-full bg-[var(--warning-tint)] px-2 py-0.5 text-[10px] font-medium text-[var(--warning-amber)]">
                        Pre-launch check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Interactive Stepper */}
        <div className="lg:hidden space-y-2.5 mb-6" role="tablist" aria-label="Automation workflow stages">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = idx === activeIdx;
            return (
              <div key={stage.step} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIdx(idx)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#04120a]'
                          : 'border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="block font-mono-data text-[11px] text-[var(--accent-primary)]">
                        Stage {stage.step}
                      </span>
                      <span className="font-display text-sm font-semibold text-[var(--text-primary)]">
                        {stage.title}
                      </span>
                    </div>
                  </div>
                  {stage.badge && (
                    <span className="shrink-0 rounded-full bg-[var(--warning-tint)] px-2 py-0.5 text-[10px] font-medium text-[var(--warning-amber)]">
                      Required
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Active Stage Detail Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.step}
            id={`workflow-panel-${activeStage.step}`}
            role="tabpanel"
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-tint)] border border-[var(--accent-primary)]/35 text-[var(--accent-primary)]">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
                  Stage {activeStage.step} of 06
                </span>
                {activeStage.badge && (
                  <span className="rounded-full border border-[var(--warning-amber)]/40 bg-[var(--warning-tint)] px-3 py-1 text-xs font-medium text-[var(--warning-amber)]">
                    {activeStage.badge}
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                {activeStage.title}
              </h3>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {activeStage.summary}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  className="rounded-full border border-[var(--border-strong)] px-4 py-1.5 text-xs font-medium text-[var(--text-primary)] disabled:opacity-35 hover:bg-[var(--bg-surface)] transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeIdx === WORKFLOW_STAGES.length - 1}
                  onClick={() => setActiveIdx((i) => Math.min(WORKFLOW_STAGES.length - 1, i + 1))}
                  className="rounded-full border border-[var(--accent-primary)]/50 bg-[var(--accent-tint)] px-4 py-1.5 text-xs font-medium text-[var(--accent-primary)] disabled:opacity-35 hover:brightness-110 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Next Stage
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-3">
              {activeStage.details.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/75 p-4"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent-primary)]" />
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
