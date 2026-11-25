import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useAppRouter } from './context/RouterContext';
import { TrialModalProvider } from './context/TrialModalContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TrialModal } from './components/forms/TrialModal';
import { HomePage } from './pages/Home/HomePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfService/TermsOfServicePage';

function AppShell() {
  const { route } = useAppRouter();

  useEffect(() => {
    if (route === '/privacy-policy') {
      document.title = 'Privacy Policy (Draft) | Revist';
    } else if (route === '/terms-of-service') {
      document.title = 'Terms of Service (Draft) | Revist';
    } else {
      document.title = 'Revist | Customer Retention Automation for Restaurants';
    }
  }, [route]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="film-grain" aria-hidden="true" />
      <Navbar />
      <main id="main-content" className="relative flex-1">
        {route === '/' && <HomePage />}
        {route === '/privacy-policy' && <PrivacyPolicyPage />}
        {route === '/terms-of-service' && <TermsOfServicePage />}
      </main>
      <Footer />
      <TrialModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <TrialModalProvider>
          <AppShell />
        </TrialModalProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
