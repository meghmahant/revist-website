import { siteConfig } from '../../config/siteConfig';
import { useAppRouter } from '../../context/RouterContext';
import { RevistLogo } from '../common/RevistLogo';

export function Footer() {
  const { navigate } = useAppRouter();
  const hasContactInfo = Boolean(siteConfig.businessEmail || siteConfig.businessPhone);

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-14 sm:py-16">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border-subtle)]">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-left cursor-pointer"
              aria-label="Revist home"
            >
              <RevistLogo size={30} />
            </button>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              Great food brings them in. Revist brings them back. Specialised customer retention
              automation built for independent restaurants and cafés.
            </p>
          </div>

          {/* Product Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-mono-data text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Platform
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/', 'product')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Product
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/', 'how-it-works')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/', 'live-demo')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Live Demo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/', 'revenue-calculator')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Revenue Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/', 'faq')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Configured Contact */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono-data text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Legal {hasContactInfo ? '& Contact' : ''}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/privacy-policy')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Privacy Policy (Draft)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/terms-of-service')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Terms of Service (Draft)
                </button>
              </li>
              {siteConfig.businessEmail && (
                <li>
                  <a
                    href={`mailto:${siteConfig.businessEmail}`}
                    className="text-[var(--accent-primary)] hover:underline"
                  >
                    {siteConfig.businessEmail}
                  </a>
                </li>
              )}
              {siteConfig.businessPhone && (
                <li>
                  <a
                    href={`tel:${siteConfig.businessPhone}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {siteConfig.businessPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.brandName}. Operated by{' '}
            {siteConfig.copyrightOwner}. All rights reserved.
          </p>
          <p>Built on WhatsApp&apos;s official Business API.</p>
        </div>
      </div>
    </footer>
  );
}
