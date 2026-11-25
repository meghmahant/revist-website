import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTrialModal } from '../../context/TrialModalContext';
import { useAppRouter } from '../../context/RouterContext';
import { RevistLogo } from '../common/RevistLogo';

interface NavLinkItem {
  label: string;
  sectionId: string;
}

const NAV_ITEMS: NavLinkItem[] = [
  { label: 'Product', sectionId: 'product' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Live Demo', sectionId: 'live-demo' },
  { label: 'Revenue Calculator', sectionId: 'revenue-calculator' },
  { label: 'FAQ', sectionId: 'faq' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { openModal } = useTrialModal();
  const { route, navigate } = useAppRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (route !== '/') {
      setActiveSection('');
      return;
    }

    const ids = NAV_ITEMS.map((i) => i.sectionId);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-38% 0px -48% 0px', threshold: 0.01 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route]);

  // Lock background scroll & support Escape key when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    navigate('/', sectionId);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10"
      >
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            navigate('/');
          }}
          className="group flex items-center text-left focus-visible:outline-none"
          aria-label="Revist home"
        >
          <RevistLogo size={32} />
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = route === '/' && activeSection === item.sectionId;
            return (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => handleNavClick(item.sectionId)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors rounded-full cursor-pointer ${
                  isActive
                    ? 'text-[var(--text-primary)] bg-[var(--accent-tint)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[var(--accent-primary)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => openModal('navbar_cta')}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-[#05140b] dark:text-[#04120a] text-white shadow-[0_0_24px_var(--accent-glow)] hover:brightness-110 transition-all cursor-pointer"
          >
            <span className={theme === 'dark' ? 'text-[#04120a]' : 'text-white'}>
              Start Free Trial
            </span>
            <ArrowUpRight
              className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                theme === 'dark' ? 'text-[#04120a]' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="lg:hidden fixed inset-0 top-[65px] z-40 flex flex-col justify-between bg-[var(--bg-primary)]/98 backdrop-blur-2xl px-6 py-8 border-t border-[var(--border-subtle)]"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => handleNavClick(item.sectionId)}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-left font-display text-xl font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openModal('mobile_menu_cta');
              }}
              className={`w-full rounded-full bg-[var(--accent-primary)] py-4 text-center text-base font-semibold shadow-[0_0_28px_var(--accent-glow)] cursor-pointer ${
                theme === 'dark' ? 'text-[#04120a]' : 'text-white'
              }`}
            >
              Start Free Trial
            </button>
            <p className="text-center text-xs text-[var(--text-secondary)]">
              Built for independent restaurants and cafés.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
