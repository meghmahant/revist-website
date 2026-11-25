import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAppRouter } from '../../context/RouterContext';
import { siteConfig } from '../../config/siteConfig';

export function PrivacyPolicyPage() {
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
          <strong>DRAFT DOCUMENT — PENDING LEGAL &amp; BUSINESS OWNER REVIEW:</strong> This draft
          Privacy Policy contains configurable placeholders (such as entity registration details,
          final retention periods, and grievance/contact channels) and must be reviewed and approved
          by the business owner and qualified legal counsel before production publication.
        </div>
      </div>

      <header className="space-y-3 border-b border-[var(--border-subtle)] pb-8 mb-10">
        <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-primary)]">
          Draft Version: {siteConfig.privacyPolicyVersion}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
          Privacy Policy (Draft)
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Operated by: [Legal Entity Name / Operator: {siteConfig.copyrightOwner}] · Website:{' '}
          {siteConfig.websiteUrl}
        </p>
      </header>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            1. Scope &amp; Website Lead Collection
          </h2>
          <p>
            This draft policy explains how Revist (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects and
            handles personal information submitted by prospective restaurant and café operators
            through the free trial request form on {siteConfig.websiteUrl}. It also outlines data
            responsibilities for restaurants considering Revist&apos;s customer retention platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            2. Information Collected on This Website
          </h2>
          <p>When you submit a free trial request, we collect only the details you enter:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Restaurant or café name</li>
            <li>Contact person&apos;s full name</li>
            <li>Phone number and email address</li>
            <li>Consent confirmation timestamp, notice version, and optional UTM attribution</li>
          </ul>
          <p>
            We do not store trial lead form submissions in browser localStorage, nor do we sell
            prospective lead details or send them to third-party advertising networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            3. Purpose of Collection &amp; Contact Consent
          </h2>
          <p>
            Information submitted via the trial request modal is used solely to contact you
            regarding your Revist trial inquiry, understand your restaurant&apos;s requirements, and
            coordinate manual onboarding. Consent checked in the trial modal applies specifically
            to trial communication and does not constitute blanket consent for unrelated marketing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            4. Data Storage, Authorised Access &amp; Service Providers
          </h2>
          <p>
            Trial lead submissions are processed through a secured lead-processing service (such as
            a Cloudflare Worker intermediary and Google Apps Script) and stored in a private Google
            Sheet accessible only to authorised Revist team members. Email notifications are sent to
            the configured Revist business inbox via Google Apps Script MailApp.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            5. Data Retention &amp; Deletion Requests
          </h2>
          <p>
            Trial inquiry records are retained for [RETENTION PERIOD TO BE CONFIRMED — e.g., 12
            months from last interaction, unless onboarding proceeds or deletion is requested earlier].
            Under applicable Indian data protection principles, including the Digital Personal Data
            Protection (DPDP) Act framework, you may request access, correction, withdrawal of
            consent, or erasure of your trial inquiry data by contacting{' '}
            {siteConfig.businessEmail ? (
              <a href={`mailto:${siteConfig.businessEmail}`} className="text-[var(--accent-primary)] underline">
                {siteConfig.businessEmail}
              </a>
            ) : (
              <span>[CONFIGURED BUSINESS EMAIL PENDING]</span>
            )}
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            6. Restaurant Customer Data Responsibilities
          </h2>
          <p>
            When restaurants use the separate Revist product dashboard, restaurants control which
            customer fields they export via CSV from their billing software. Revist does not
            require POS passwords, payment card numbers, bank details, or residential addresses, and
            restaurants should remove unnecessary sensitive columns prior to upload. Before live
            WhatsApp campaigns launch, participating restaurants must establish verifiable
            customer opt-in consent and honour STOP opt-out requests in accordance with WhatsApp
            Business policies and Indian privacy law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            7. Cookies &amp; LocalStorage Usage
          </h2>
          <p>
            This marketing website uses browser <code className="font-mono-data">localStorage</code>{' '}
            only to remember your dark/light theme preference (<code className="font-mono-data">revist-theme</code>).
            No personal lead data is persisted in cookies or local storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            8. Contact &amp; Policy Updates
          </h2>
          <p>
            Registered/Business Address: [ENTITY ADDRESS PLACEHOLDER]. Grievance / Privacy Contact:{' '}
            {siteConfig.businessEmail || '[PRIVACY CONTACT EMAIL PLACEHOLDER]'}. Updates to this
            draft will be reflected by updating the policy version date above.
          </p>
        </section>
      </div>
    </article>
  );
}
