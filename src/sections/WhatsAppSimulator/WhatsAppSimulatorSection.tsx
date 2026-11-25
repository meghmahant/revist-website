import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, CheckCircle2, MessageCircle, Play, ShieldAlert } from 'lucide-react';
import { evaluateCampaignEligibility } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

export function WhatsAppSimulatorSection() {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  const [restaurantName, setRestaurantName] = useState('The Urban Café');
  const [customerName, setCustomerName] = useState('Rahul');
  const [offerText, setOfferText] = useState('15% off your next visit');
  const [daysSinceLastVisit, setDaysSinceLastVisit] = useState(28);
  const [inactivityThreshold, setInactivityThreshold] = useState(21);

  const [optedIn, setOptedIn] = useState(true);
  const [optedOut, setOptedOut] = useState(false);
  const [remindedWithin30Days, setRemindedWithin30Days] = useState(false);

  const [simState, setSimState] = useState<'idle' | 'typing' | 'preview'>('preview');

  const eligibility = evaluateCampaignEligibility({
    daysSinceLastVisit,
    inactivityThreshold,
    optedIn,
    optedOut,
    remindedWithinLast30Days: remindedWithin30Days,
  });

  useEffect(() => {
    if (simState !== 'typing') return;
    const timer = setTimeout(() => {
      setSimState('preview');
    }, reducedMotion ? 50 : 700);
    return () => clearTimeout(timer);
  }, [simState, reducedMotion]);

  const handleSimulate = () => {
    setSimState('typing');
  };

  const displayRestaurant = restaurantName.trim() || 'Your Restaurant';
  const displayCustomer = customerName.trim() || 'Guest';
  const displayOffer = offerText.trim() || 'a complimentary welcome treat';

  return (
    <section
      id="simulator"
      aria-labelledby="simulator-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl space-y-4 mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-tint)] px-3.5 py-1 text-xs font-mono-data text-[var(--accent-primary)]">
            <MessageCircle className="h-3.5 w-3.5" />
            Campaign simulator — no real messages are sent
          </span>
          <h2
            id="simulator-heading"
            className="font-display text-section-display font-bold text-[var(--text-primary)]"
          >
            See how a simple message can start a new conversation.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Edit the message fields and test Revist&apos;s intended eligibility rules in real time.
            Production opt-in capture and STOP handling are still being completed before live
            restaurant launches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sim-restaurant"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  Restaurant name
                </label>
                <input
                  id="sim-restaurant"
                  type="text"
                  maxLength={60}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="sim-customer"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  Customer name
                </label>
                <input
                  id="sim-customer"
                  type="text"
                  maxLength={40}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sim-offer"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Restaurant offer
              </label>
              <input
                id="sim-offer"
                type="text"
                maxLength={80}
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="sim-days" className="text-[var(--text-secondary)]">
                    Days since last visit
                  </label>
                  <span className="font-mono-data font-semibold text-[var(--text-primary)]">
                    {daysSinceLastVisit}d
                  </span>
                </div>
                <input
                  id="sim-days"
                  type="range"
                  min={1}
                  max={60}
                  value={daysSinceLastVisit}
                  onChange={(e) => setDaysSinceLastVisit(Number(e.target.value))}
                  className="revist-slider"
                />
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="sim-threshold" className="text-[var(--text-secondary)]">
                    Inactivity threshold
                  </label>
                  <span className="font-mono-data font-semibold text-[var(--accent-primary)]">
                    &gt; {inactivityThreshold}d
                  </span>
                </div>
                <input
                  id="sim-threshold"
                  type="range"
                  min={7}
                  max={60}
                  value={inactivityThreshold}
                  onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                  className="revist-slider"
                />
              </div>
            </div>

            {/* Eligibility Controls */}
            <fieldset className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
              <legend className="text-xs font-mono-data uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Intended Eligibility Rules
              </legend>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 cursor-pointer">
                <span className="text-sm text-[var(--text-primary)]">Customer has opted in</span>
                <input
                  type="checkbox"
                  checked={optedIn}
                  onChange={(e) => setOptedIn(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent-primary)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 cursor-pointer">
                <span className="text-sm text-[var(--text-primary)]">
                  Customer has opted out (STOP)
                </span>
                <input
                  type="checkbox"
                  checked={optedOut}
                  onChange={(e) => setOptedOut(e.target.checked)}
                  className="h-4 w-4 accent-[var(--danger-rose)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-3 cursor-pointer">
                <span className="text-sm text-[var(--text-primary)]">
                  Received reminder within previous 30 days
                </span>
                <input
                  type="checkbox"
                  checked={remindedWithin30Days}
                  onChange={(e) => setRemindedWithin30Days(e.target.checked)}
                  className="h-4 w-4 accent-[var(--warning-amber)] cursor-pointer"
                />
              </label>
            </fieldset>

            <button
              type="button"
              onClick={handleSimulate}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] py-3.5 text-sm font-semibold shadow-[0_0_24px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer ${
                theme === 'dark' ? 'text-[#04120a]' : 'text-white'
              }`}
            >
              <Play className="h-4 w-4" />
              Simulate Campaign Preview
            </button>
          </div>

          {/* Realistic WhatsApp-style Mobile Preview */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[400px] rounded-[36px] border-2 border-[var(--border-strong)] bg-[#0B141A] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.45)] text-white">
              {/* WhatsApp Header */}
              <div className="flex items-center justify-between rounded-t-[26px] bg-[#1F2C34] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-[#04120a] font-display font-bold text-sm">
                    {displayRestaurant.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight text-white">
                      {displayRestaurant}
                    </div>
                    <div className="text-[11px] text-[#8696A0]">
                      WhatsApp Business Account (Simulator)
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-[#22C55E]/15 px-2 py-0.5 font-mono-data text-[10px] text-[#86EFAC]">
                  Preview
                </span>
              </div>

              {/* Chat Canvas */}
              <div className="min-h-[340px] flex flex-col justify-between bg-[#0B141A] px-4 py-5 rounded-b-[26px] space-y-5">
                {/* Eligibility Banner */}
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-3.5 py-2.5 text-xs ${
                    eligibility.isEligible
                      ? 'border-[#22C55E]/40 bg-[#12251C] text-[#86EFAC]'
                      : 'border-[#F59E0B]/45 bg-[#2A1D0D] text-[#FCD34D]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {eligibility.isEligible ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22C55E]" />
                        Eligible — Ready for template preview
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                        Campaign blocked
                      </>
                    )}
                  </div>
                  {!eligibility.isEligible && (
                    <ul className="mt-1.5 list-disc pl-5 space-y-0.5 text-[11px] text-[#FDE68A]">
                      {eligibility.reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Message Bubble or Blocked Placeholder */}
                {eligibility.isEligible ? (
                  simState === 'typing' ? (
                    <div className="self-start rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-3 text-xs text-[#8696A0]">
                      Preparing illustrative template preview...
                    </div>
                  ) : (
                    <motion.div
                      key={`${displayCustomer}-${displayRestaurant}-${displayOffer}`}
                      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="self-start max-w-[92%] rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-3.5 text-[13.5px] leading-relaxed text-[#E9EDEF] shadow-md space-y-2.5"
                    >
                      <p>Hi {displayCustomer}!</p>
                      <p>
                        It&apos;s been a while since your last visit to{' '}
                        <span className="font-semibold text-white">{displayRestaurant}</span>.
                        We&apos;d love to welcome you back.
                      </p>
                      <p className="font-medium text-[#86EFAC]">Enjoy {displayOffer}.</p>
                      <p className="text-xs text-[#8696A0]">
                        Reply STOP to opt out of future offers.
                      </p>
                      <div className="flex justify-end pt-1 font-mono-data text-[10px] text-[#8696A0]">
                        Simulated preview · Not sent
                      </div>
                    </motion.div>
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#2F3F49] bg-[#111B21] p-5 text-center space-y-2">
                    <ShieldAlert className="mx-auto h-6 w-6 text-[#F59E0B]" />
                    <p className="text-xs font-medium text-[#E9EDEF]">
                      No message would be dispatched
                    </p>
                    <p className="text-[11px] text-[#8696A0]">
                      Adjust the toggles or visit threshold on the left to satisfy every
                      eligibility condition.
                    </p>
                  </div>
                )}

                <div className="text-center font-mono-data text-[10px] text-[#8696A0]">
                  Campaign simulator — no real messages are sent.
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-[400px] text-center text-xs leading-relaxed text-[var(--text-muted)]">
              Illustrative template preview only (not a claim that this sample copy has received Meta
              approval). Demonstrates intended messaging rules; production opt-in capture is still
              being completed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
