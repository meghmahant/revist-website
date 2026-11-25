import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAppRouter } from '../../context/RouterContext';
import { siteConfig } from '../../config/siteConfig';

export function TermsOfServicePage() {
  const { navigate } = useAppRouter();

  return (
    <article className="mx-auto max-w-4xl px-5 pt-32 pb-24 sm:px-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Homepage
      </button>

      <div
        role="note"
        className="mb-8 rounded-2xl border border-[var(--warning-amber)]/45 bg-[var(--warning-tint)] p-5 flex items-start gap-3"
      >
        <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--warning-amber)] mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
          <strong>DRAFT DOCUMENT — PENDING LEGAL &amp; BUSINESS OWNER REVIEW:</strong> These draft
          Terms of Service contain provisional clauses and placeholders for entity details, trial
          inclusions, WhatsApp charges, and governing terms. Legal review is required before
          production publication.
        </div>
      </div>

      <header className="space-y-3 border-b border-[var(--border-subtle)] pb-8 mb-10">
        <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
          Draft Version: {siteConfig.termsVersion}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
          Terms of Service (Draft)
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Operated by: [Legal Entity Name / Operator: {siteConfig.copyrightOwner}] · Website:{' '}
          {siteConfig.websiteUrl}
        </p>
      </header>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            1. Description of Revist &amp; Website Usage
          </h2>
          <p>
            Revist provides customer retention analytics and WhatsApp re-engagement workflow tools
            for independent restaurants and cafés. This marketing website provides product
            information, illustrative demonstrations, and a trial onboarding request form.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            2. Trial Request Conditions
          </h2>
          <p>
            Submitting the free trial form does not automatically activate a software account or
            guarantee eligibility for any specific trial package. Onboarding is conducted manually
            following an introductory review. Trial duration, message allowances, WhatsApp API
            pass-through fees, and post-trial pricing remain subject to final written agreement
            ([FINAL TRIAL &amp; PRICING TERMS PLACEHOLDER]).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            3. Restaurant Responsibilities &amp; Customer Consent
          </h2>
          <p>
            Restaurants using the separate Revist product are responsible for exporting accurate
            CSV data, omitting unnecessary sensitive personal or payment details, obtaining lawful
            opt-in consent from guests before promotional WhatsApp messaging, and honouring opt-out
            (STOP) requests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            4. WhatsApp Usage &amp; Third-Party Services
          </h2>
          <p>
            Revist&apos;s messaging functionality is built on WhatsApp&apos;s official Business API.
            Restaurants must use their own WhatsApp Business account, comply with Meta / WhatsApp
            Business Messaging Policies, and use only approved message templates. Revist is not an
            official Meta partner and cannot guarantee third-party API uptime or template approvals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            5. Acceptable Use &amp; Intellectual Property
          </h2>
          <p>
            You agree not to misuse the website, submit automated spam, attempt unauthorised access
            to lead systems, or copy Revist&apos;s branding, visual assets, and software without
            permission. All website design, copy, and code remain the intellectual property of{' '}
            {siteConfig.copyrightOwner} / [ENTITY PLACEHOLDER].
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            6. Service Limitations &amp; Revenue Estimation Disclaimers
          </h2>
          <p>
            Interactive dashboards, customer records, WhatsApp previews, and revenue calculator
            outputs on this site are illustrative demonstrations only. Calculator figures are
            hypothetical estimates based solely on user-selected inputs and exclude WhatsApp
            charges, subscription fees, taxes, and operating costs. Revist makes no guarantee of
            customer return rates or revenue growth.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            7. Termination &amp; Contact Information
          </h2>
          <p>
            We may suspend or decline trial access for violations of acceptable use, consent rules,
            or applicable law. Governing law &amp; jurisdiction: [INDIA — JURISDICTION PLACEHOLDER].
            Contact: {siteConfig.businessEmail || '[BUSINESS CONTACT EMAIL PLACEHOLDER]'}.
          </p>
        </section>
      </div>
    </article>
  );
}
