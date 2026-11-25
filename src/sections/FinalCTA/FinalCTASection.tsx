import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { useTrialModal } from '../../context/TrialModalContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppRouter } from '../../context/RouterContext';

export function FinalCTASection() {
  const { openModal } = useTrialModal();
  const { theme } = useTheme();
  const { navigate } = useAppRouter();

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/45 py-28 sm:py-36"
    >
      {/* Echoing orbital reconnection SVG rings */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] opacity-25"
        viewBox="0 0 720 720"
        fill="none"
      >
        <circle cx="360" cy="360" r="170" stroke="var(--accent-primary)" strokeOpacity="0.3" />
        <circle
          cx="360"
          cy="360"
          r="260"
          stroke="var(--accent-primary)"
          strokeOpacity="0.2"
          strokeDasharray="6 8"
        />
        <circle cx="360" cy="360" r="345" stroke="var(--border-strong)" strokeOpacity="0.35" />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8 space-y-8">
        <span className="inline-block font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--accent-primary)]">
          30-Day Free Trial Onboarding
        </span>

        <h2
          id="final-cta-heading"
          className="font-display text-section-display font-bold text-[var(--text-primary)]"
        >
          Your next returning customer could already be in your database.
        </h2>

        <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
          Discover how Revist can help your restaurant understand customer activity and build
          meaningful customer relationships—starting with a personal onboarding review.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => openModal('final_cta')}
            className={`group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[var(--accent-primary)] px-8 py-4 text-sm sm:text-base font-semibold shadow-[0_0_32px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer ${
              theme === 'dark' ? 'text-[#04120a]' : 'text-white'
            }`}
          >
            <span>Start Free Trial</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/', 'live-demo')}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-primary)]/80 px-8 py-4 text-sm sm:text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <PlayCircle className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>Explore the Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
}
