import { useId, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateRevenueEstimate, clampNumber } from '../../utils/calculations';
import { formatIndianNumber, formatINR } from '../../utils/formatting';
import { useTrialModal } from '../../context/TrialModalContext';
import { useTheme } from '../../context/ThemeContext';

const DEFAULTS = {
  inactiveCustomers: 500,
  eligiblePercent: 60,
  assumedReturnRate: 10,
  averageBillValue: 600,
  discountPercent: 10,
};

interface SliderControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unitPrefix?: string;
  unitSuffix?: string;
  onChange: (next: number) => void;
}

function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unitPrefix = '',
  unitSuffix = '',
  onChange,
}: SliderControlProps) {
  const handleNumericChange = (raw: string) => {
    if (raw.trim() === '') {
      onChange(min);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    onChange(clampNumber(parsed, min, max));
  };

  return (
    <div className="space-y-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-[var(--border-strong)] bg-[var(--bg-secondary)] px-2.5 py-1">
          {unitPrefix && (
            <span className="font-mono-data text-xs text-[var(--text-muted)] mr-1">
              {unitPrefix}
            </span>
          )}
          <input
            id={`${id}-num`}
            aria-label={`${label} numeric value`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleNumericChange(e.target.value)}
            className="w-20 bg-transparent text-right font-mono-data text-sm font-semibold text-[var(--text-primary)] focus:outline-none"
          />
          {unitSuffix && (
            <span className="font-mono-data text-xs text-[var(--text-muted)] ml-1">
              {unitSuffix}
            </span>
          )}
        </div>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clampNumber(Number(e.target.value), min, max))}
        className="revist-slider"
      />
      <div className="flex justify-between font-mono-data text-[10px] text-[var(--text-muted)]">
        <span>
          {unitPrefix}
          {formatIndianNumber(min)}
          {unitSuffix}
        </span>
        <span>
          {unitPrefix}
          {formatIndianNumber(max)}
          {unitSuffix}
        </span>
      </div>
    </div>
  );
}

export function RevenueCalculatorSection() {
  const baseId = useId();
  const { openModal } = useTrialModal();
  const { theme } = useTheme();

  const [inactiveCustomers, setInactiveCustomers] = useState(DEFAULTS.inactiveCustomers);
  const [eligiblePercent, setEligiblePercent] = useState(DEFAULTS.eligiblePercent);
  const [assumedReturnRate, setAssumedReturnRate] = useState(DEFAULTS.assumedReturnRate);
  const [averageBillValue, setAverageBillValue] = useState(DEFAULTS.averageBillValue);
  const [discountPercent, setDiscountPercent] = useState(DEFAULTS.discountPercent);

  const result = calculateRevenueEstimate({
    inactiveCustomers,
    eligiblePercent,
    assumedReturnRate,
    averageBillValue,
    discountPercent,
  });

  const handleReset = () => {
    setInactiveCustomers(DEFAULTS.inactiveCustomers);
    setEligiblePercent(DEFAULTS.eligiblePercent);
    setAssumedReturnRate(DEFAULTS.assumedReturnRate);
    setAverageBillValue(DEFAULTS.averageBillValue);
    setDiscountPercent(DEFAULTS.discountPercent);
  };

  return (
    <section
      id="revenue-calculator"
      aria-labelledby="calculator-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/35"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
              <Calculator className="h-3.5 w-3.5" />
              Hypothetical Revenue Estimator
            </span>
            <h2
              id="calculator-heading"
              className="font-display text-section-display font-bold text-[var(--text-primary)]"
            >
              What could bringing customers back mean for your restaurant?
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start lg:self-auto inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Input Controls */}
          <div className="lg:col-span-7 space-y-3.5 rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-5 sm:p-8">
            <SliderControl
              id={`${baseId}-inactive`}
              label="Number of inactive customers"
              value={inactiveCustomers}
              min={0}
              max={5000}
              step={10}
              onChange={setInactiveCustomers}
            />
            <SliderControl
              id={`${baseId}-eligible`}
              label="Inactive customers eligible for messaging"
              value={eligiblePercent}
              min={0}
              max={100}
              unitSuffix="%"
              onChange={setEligiblePercent}
            />
            <SliderControl
              id={`${baseId}-return`}
              label="Assumed customer return rate"
              value={assumedReturnRate}
              min={0}
              max={100}
              unitSuffix="%"
              onChange={setAssumedReturnRate}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <SliderControl
                id={`${baseId}-bill`}
                label="Average bill value"
                value={averageBillValue}
                min={50}
                max={10000}
                step={50}
                unitPrefix="₹"
                onChange={setAverageBillValue}
              />
              <SliderControl
                id={`${baseId}-discount`}
                label="Promotional discount"
                value={discountPercent}
                min={0}
                max={90}
                unitSuffix="%"
                onChange={setDiscountPercent}
              />
            </div>
          </div>

          {/* Live Calculated Output Column */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[var(--accent-primary)]/40 bg-[var(--bg-primary)] p-6 sm:p-8 shadow-[0_28px_80px_var(--accent-glow)] space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
                  Estimated Scenario
                </span>
                <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-0.5 font-mono-data text-[10px] text-[var(--text-muted)]">
                  Hypothetical model
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                  <div className="text-xs text-[var(--text-muted)]">Eligible customers</div>
                  <div
                    data-testid="calc-eligible"
                    className="mt-1.5 font-display text-3xl font-bold tabular-nums text-[var(--text-primary)]"
                  >
                    {formatIndianNumber(result.eligibleCustomers)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                  <div className="text-xs text-[var(--text-muted)]">Est. returning customers</div>
                  <div
                    data-testid="calc-returning"
                    className="mt-1.5 font-display text-3xl font-bold tabular-nums text-[var(--text-primary)]"
                  >
                    {formatIndianNumber(result.estimatedReturningCustomers)}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/65 p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Potential gross revenue
                  </span>
                  <span
                    data-testid="calc-gross"
                    className="font-display text-2xl font-bold tabular-nums text-[var(--text-primary)]"
                  >
                    {formatINR(result.potentialGrossRevenue)}
                  </span>
                </div>

                <div className="border-t border-[var(--border-subtle)] pt-4 flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Potential revenue after discounts
                  </span>
                  <span
                    data-testid="calc-net"
                    className="font-display text-3xl sm:text-4xl font-bold tabular-nums text-[var(--accent-primary)]"
                  >
                    {formatINR(result.potentialRevenueAfterDiscounts)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => openModal('calculator_cta')}
                className={`w-full rounded-full bg-[var(--accent-primary)] py-3.5 text-sm font-semibold shadow-[0_0_24px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer ${
                  theme === 'dark' ? 'text-[#04120a]' : 'text-white'
                }`}
              >
                Start Free Trial
              </button>

              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                These calculations are hypothetical estimates based on user-selected assumptions.
                They are not actual Revist results or guaranteed revenue. Calculations assume one
                return visit per estimated returning customer and exclude WhatsApp charges,
                subscription fees, taxes and operating expenses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
