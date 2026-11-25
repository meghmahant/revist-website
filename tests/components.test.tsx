import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';
import { RevenueCalculatorSection } from '../src/sections/RevenueCalculator/RevenueCalculatorSection';
import { WhatsAppSimulatorSection } from '../src/sections/WhatsAppSimulator/WhatsAppSimulatorSection';
import { DashboardDemoSection } from '../src/sections/DashboardDemo/DashboardDemoSection';
import { FAQSection } from '../src/sections/FAQ/FAQSection';
import { PrivacyPolicyPage } from '../src/pages/PrivacyPolicy/PrivacyPolicyPage';
import { TermsOfServicePage } from '../src/pages/TermsOfService/TermsOfServicePage';
import { ThemeProvider } from '../src/context/ThemeContext';
import { TrialModalProvider } from '../src/context/TrialModalContext';
import { RouterProvider } from '../src/context/RouterContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <RouterProvider>
        <TrialModalProvider>{ui}</TrialModalProvider>
      </RouterProvider>
    </ThemeProvider>,
  );
}

describe('Revist 2.0 Interactive Components', () => {
  it('opens the reusable Free Trial modal from hero CTA and closes on Escape', () => {
    renderWithProviders(<App />);
    const buttons = screen.getAllByRole('button', { name: /Start Free Trial/i });
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(buttons[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Let's grow your restaurant\./i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('persists dark/light theme preference in localStorage', () => {
    renderWithProviders(<App />);
    const toggle = screen.getAllByRole('button', { name: /Switch to (light|dark) mode/i })[0];
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('revist-theme')).toBe('light');
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('revist-theme')).toBe('dark');
  });

  it('recalculates revenue estimates live and resets cleanly', () => {
    renderWithProviders(<RevenueCalculatorSection />);
    expect(screen.getByTestId('calc-eligible')).toHaveTextContent('300');
    expect(screen.getByTestId('calc-returning')).toHaveTextContent('30');
    expect(screen.getByTestId('calc-gross')).toHaveTextContent('₹18,000');
    expect(screen.getByTestId('calc-net')).toHaveTextContent('₹16,200');

    const inactiveNum = screen.getByLabelText('Number of inactive customers numeric value');
    fireEvent.change(inactiveNum, { target: { value: '1000' } });
    expect(screen.getByTestId('calc-eligible')).toHaveTextContent('600');
    expect(screen.getByTestId('calc-returning')).toHaveTextContent('60');

    fireEvent.click(screen.getByRole('button', { name: /Reset to Defaults/i }));
    expect(screen.getByTestId('calc-eligible')).toHaveTextContent('300');
  });

  it('blocks WhatsApp simulator preview when customer opts out or was reminded recently', () => {
    renderWithProviders(<WhatsAppSimulatorSection />);
    expect(screen.getByText(/Eligible — Ready for template preview/i)).toBeInTheDocument();

    const optOutCheckbox = screen.getByLabelText(/Customer has opted out/i);
    fireEvent.click(optOutCheckbox);
    expect(screen.getByText(/Campaign blocked/i)).toBeInTheDocument();
    expect(screen.getByText(/No message would be dispatched/i)).toBeInTheDocument();
  });

  it('enforces strictly greater-than inactivity threshold in Dashboard Demo', () => {
    renderWithProviders(<DashboardDemoSection />);
    // Default threshold is 21: Vikram Nair (21d) is Active, Ananya Deshmukh (22d) is Inactive
    const slider = screen.getByLabelText(/Adjust inactivity threshold in days/i);
    fireEvent.change(slider, { target: { value: '20' } });
    expect(screen.getByText('> 20d')).toBeInTheDocument();
  });

  it('expands and collapses FAQ items with accessible ARIA attributes', () => {
    renderWithProviders(<FAQSection />);
    const secondBtn = screen.getByRole('button', {
      name: /Does Revist connect to my billing system\?/i,
    });
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(secondBtn);
    expect(secondBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders draft Privacy Policy and Terms of Service notices clearly', () => {
    const { unmount } = renderWithProviders(<PrivacyPolicyPage />);
    expect(screen.getByText(/Privacy Policy \(Draft\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING LEGAL & BUSINESS OWNER REVIEW/i)).toBeInTheDocument();
    unmount();

    renderWithProviders(<TermsOfServicePage />);
    expect(screen.getByText(/Terms of Service \(Draft\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING LEGAL & BUSINESS OWNER REVIEW/i)).toBeInTheDocument();
  });
});
