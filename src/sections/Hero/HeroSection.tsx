import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { useTrialModal } from '../../context/TrialModalContext';
import { useTheme } from '../../context/ThemeContext';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { CustomerNetworkCanvas } from './CustomerNetworkCanvas';

export function HeroSection() {
  const { openModal } = useTrialModal();
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [spot, setSpot] = useState({ x: 65, y: 42 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
  };

  const scrollToStory = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden pt-28 pb-10 sm:pt-32 sm:pb-12"
    >
      {/* Subtle architectural hairline grid & cursor-responsive emerald spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 editorial-grid-bg opacity-[0.28]"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 50% 45%, black 20%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(620px circle at ${spot.x}% ${spot.y}%, var(--accent-glow), transparent 68%)`,
          opacity: theme === 'dark' ? 0.65 : 0.45,
        }}
      />

      <div className="relative z-10 mx-auto my-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/85 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              <span>Customer Retention Automation · Built on WhatsApp&apos;s official Business API</span>
            </motion.div>

            <h1 className="font-display text-hero-display font-bold text-[var(--text-primary)]">
              <motion.span
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Great food brings them in.
              </motion.span>
              <motion.span
                initial={reducedMotion ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="block mt-1.5 text-[var(--accent-primary)]"
              >
                Revist brings them back.
              </motion.span>
            </h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-[var(--text-secondary)]"
            >
              Understand your customers, identify inactivity and reconnect with eligible customers
              through personalised WhatsApp campaigns.
            </motion.p>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <button
                type="button"
                onClick={() => openModal('hero_primary_cta')}
                className={`group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--accent-primary)] px-7 py-4 text-sm sm:text-base font-semibold shadow-[0_0_32px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer ${
                  theme === 'dark' ? 'text-[#04120a]' : 'text-white'
                }`}
              >
                <span>Start Free Trial</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={scrollToStory}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-secondary)]/70 backdrop-blur-md px-7 py-4 text-sm sm:text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                <span>Experience Revist</span>
                <ArrowDown className="h-4 w-4 text-[var(--accent-primary)]" />
              </button>
            </motion.div>

            {/* Trust statement + factual workflow anchors */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-4 border-t border-[var(--border-subtle)]/80 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-[var(--text-secondary)]"
            >
              <span className="font-medium text-[var(--text-primary)]">
                Built for independent restaurants and cafés.
              </span>
              <span className="hidden sm:inline text-[var(--border-strong)]" aria-hidden="true">
                /
              </span>
              <span>CSV export workflow · No POS login credentials required</span>
            </motion.div>
          </div>

          {/* Interactive Customer Network Column */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <CustomerNetworkCanvas />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-10 text-xs font-mono-data text-[var(--text-muted)]">
        <button
          type="button"
          onClick={scrollToStory}
          className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <span className="inline-flex h-6 w-4 items-start justify-center rounded-full border border-[var(--border-strong)] p-1">
            <span className="h-1.5 w-0.5 rounded-full bg-[var(--accent-primary)] animate-bounce" />
          </span>
          <span>Scroll to explore the customer journey</span>
        </button>
        <span className="hidden sm:inline">Turn inactive customers into opportunities for repeat business.</span>
      </div>
    </section>
  );
}
