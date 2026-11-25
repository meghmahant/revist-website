import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarClock, CheckCircle2, Coffee, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

interface StoryScene {
  dayLabel: string;
  dayNumber: number;
  title: string;
  subtitle: string;
  description: string;
  statusLabel: string;
  statusTone: 'active' | 'cooling' | 'watch' | 'inactive' | 'eligible';
  ringProgress: number;
  note: string;
}

const SCENES: StoryScene[] = [
  {
    dayLabel: 'Scene 01 · Day 1',
    dayNumber: 1,
    title: 'A great first evening at your café.',
    subtitle: 'First visit logged in your billing system',
    description:
      'A guest visits your restaurant, enjoys their meal, and pays at the counter. Your billing software records their name, phone number, and visit date.',
    statusLabel: 'Active Guest',
    statusTone: 'active',
    ringProgress: 5,
    note: 'Data stays in your billing system until you choose to export a CSV.',
  },
  {
    dayLabel: 'Scene 02 · Day 7',
    dayNumber: 7,
    title: 'Life gets busy.',
    subtitle: 'One week later, routines take over',
    description:
      'Work, errands, and dining habits pull attention elsewhere. They still enjoyed the food—your restaurant just isn’t top of mind this week.',
    statusLabel: 'Recent Visitor',
    statusTone: 'cooling',
    ringProgress: 33,
    note: 'Within the 21-day default window — no reminder needed.',
  },
  {
    dayLabel: 'Scene 03 · Day 14',
    dayNumber: 14,
    title: 'Two weeks with no return visit.',
    subtitle: 'Habit begins to fade',
    description:
      'Fourteen days have passed since their last bill. Without an organised view of visit dates, it is easy for regulars and first-timers alike to slip away unnoticed.',
    statusLabel: 'Within Window (14 ≤ 21)',
    statusTone: 'watch',
    ringProgress: 67,
    note: 'Still considered active under the default 21-day rule.',
  },
  {
    dayLabel: 'Scene 04 · Day 22',
    dayNumber: 22,
    title: 'Revist flags the inactivity.',
    subtitle: 'Crosses the default > 21-day threshold',
    description:
      'At Day 22, days since last visit is strictly greater than 21. When you upload your CSV, Revist separates this guest into your inactive customer view automatically.',
    statusLabel: 'Inactive (> 21 Days)',
    statusTone: 'inactive',
    ringProgress: 100,
    note: 'A customer at Day 21 is still active; Day 22 triggers inactive status.',
  },
  {
    dayLabel: 'Scene 05 · Reconnection',
    dayNumber: 28,
    title: 'An eligible, respectful WhatsApp invitation.',
    subtitle: 'Only when consent & 30-day rules pass',
    description:
      'Inactivity alone never sends a message. Only if the guest opted in, has not opted out (STOP), and has had no reminder in 30 days can your restaurant reach out with a personalised offer.',
    statusLabel: 'Eligible for Campaign',
    statusTone: 'eligible',
    ringProgress: 100,
    note: 'Not every guest returns after a message. Production opt-in capture is still being finalised.',
  },
];

function toneClasses(tone: StoryScene['statusTone']) {
  switch (tone) {
    case 'active':
    case 'eligible':
      return {
        badge: 'border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] text-[var(--accent-primary)]',
        stroke: 'var(--accent-primary)',
      };
    case 'cooling':
    case 'watch':
      return {
        badge: 'border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)]',
        stroke: 'var(--text-secondary)',
      };
    case 'inactive':
      return {
        badge: 'border-[var(--warning-amber)]/45 bg-[var(--warning-tint)] text-[var(--warning-amber)]',
        stroke: 'var(--warning-amber)',
      };
  }
}

export function CustomerStorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(idx);
          }
        },
        { rootMargin: '-40% 0px -45% 0px', threshold: 0.05 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const current = SCENES[activeIndex];
  const tone = toneClasses(current.statusTone);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current.ringProgress / 100) * circumference;

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/45 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-14 lg:mb-20">
          <span className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
            <CalendarClock className="h-3.5 w-3.5" />
            Customer Lifecycle Story
          </span>
          <h2
            id="story-heading"
            className="font-display text-section-display font-bold text-[var(--text-primary)]"
          >
            Every customer has a story. Don&apos;t let it end after one visit.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl">
            Follow a single fictional guest (illustrative example) from their first meal through
            Revist&apos;s default 21-day inactivity threshold.
          </p>
        </div>

        {/* Desktop Sticky Split Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Narrative Timeline */}
          <div className="lg:col-span-6 relative pl-8 border-l border-[var(--border-subtle)] space-y-24 pb-16">
            {SCENES.map((scene, idx) => {
              const isActive = idx === activeIndex;
              const sceneTone = toneClasses(scene.statusTone);
              return (
                <div
                  key={scene.dayLabel}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative cursor-pointer transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-45 hover:opacity-75'
                  }`}
                >
                  {/* Timeline node dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-[var(--accent-primary)] bg-[var(--bg-primary)] scale-110 shadow-[0_0_16px_var(--accent-glow)]'
                        : 'border-[var(--border-strong)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />}
                  </span>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
                        {scene.dayLabel}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${sceneTone.badge}`}
                      >
                        {scene.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl xl:text-3xl font-bold text-[var(--text-primary)]">
                      {scene.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {scene.subtitle}
                    </p>
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      {scene.description}
                    </p>
                    <p className="text-xs font-mono-data text-[var(--text-muted)] pt-1">
                      {scene.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sticky Stage */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-primary)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-35"
                style={{ backgroundColor: tone.stroke }}
              />

              {/* Top metadata bar */}
              <div className="relative flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold text-[var(--text-primary)]">
                      Aarav Mehta
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Fictional guest · Illustrative timeline
                    </div>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.badge}`}>
                  {current.statusLabel}
                </span>
              </div>

              {/* Center Morphing Day Gauge */}
              <div className="relative my-8 grid grid-cols-12 items-center gap-6">
                <div className="col-span-5 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="var(--border-subtle)"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke={tone.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono-data text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                        Day
                      </span>
                      <span className="font-display text-4xl font-bold tabular-nums text-[var(--text-primary)]">
                        {String(current.dayNumber).padStart(2, '0')}
                      </span>
                      <span className="font-mono-data text-[10px] text-[var(--text-secondary)]">
                        Rule: &gt; 21d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-7 space-y-4">
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Days since last visit</span>
                      <span className="font-mono-data font-semibold text-[var(--text-primary)]">
                        {current.dayNumber} {current.dayNumber === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Inactivity check (&gt; 21d)</span>
                      <span className="font-mono-data font-semibold text-[var(--text-primary)]">
                        {current.dayNumber > 21 ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">WhatsApp opt-in</span>
                      <span className="font-mono-data font-semibold text-[var(--accent-primary)]">
                        {activeIndex === 4 ? 'Verified (demo)' : 'Required before send'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">30-day cooldown</span>
                      <span className="font-mono-data font-semibold text-[var(--text-primary)]">
                        Clear
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scene-specific WhatsApp preview or rule callout */}
              {activeIndex === 4 ? (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-[var(--accent-primary)]/35 bg-[var(--bg-surface)] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)]">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Illustrative WhatsApp Campaign Preview
                    </span>
                    <span className="font-mono-data text-[10px] text-[var(--text-muted)]">
                      Opt-out: STOP
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                    &ldquo;Hi Aarav! It&apos;s been a while since your last visit to The Urban Café.
                    We&apos;d love to welcome you back — enjoy 15% off your next visit. Reply STOP
                    to opt out.&rdquo;
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[var(--warning-amber)]" />
                    Illustrative example. Not every guest returns, and opt-in capture is still being finalised.
                  </p>
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/70 p-4 flex items-start gap-3">
                  {activeIndex === 3 ? (
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[var(--warning-amber)]" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent-primary)]" />
                  )}
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {current.note}
                  </p>
                </div>
              )}

              {/* Scene selector pills */}
              <div className="mt-6 flex items-center gap-2">
                {SCENES.map((s, idx) => (
                  <button
                    key={s.dayLabel}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Jump to ${s.dayLabel}`}
                    className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-[var(--accent-primary)]'
                        : idx < activeIndex
                          ? 'bg-[var(--accent-primary)]/40'
                          : 'bg-[var(--border-subtle)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Lightweight Vertical Timeline (no sticky trap) */}
        <div className="lg:hidden relative pl-6 border-l border-[var(--border-subtle)] space-y-8">
          {SCENES.map((scene, idx) => {
            const sceneTone = toneClasses(scene.statusTone);
            return (
              <div key={scene.dayLabel} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--bg-primary)]"
                />
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
                      {scene.dayLabel}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${sceneTone.badge}`}
                    >
                      {scene.statusLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {scene.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {scene.description}
                  </p>
                  {idx === 4 && (
                    <div className="rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--bg-surface)] p-3.5 text-xs text-[var(--text-primary)]">
                      &ldquo;Hi Aarav! We&apos;d love to welcome you back to The Urban Café. Enjoy
                      15% off your next visit. Reply STOP to opt out.&rdquo;
                    </div>
                  )}
                  <p className="text-[11px] font-mono-data text-[var(--text-muted)]">
                    {scene.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
