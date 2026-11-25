import { lazy, Suspense } from 'react';
import { HeroSection } from '../../sections/Hero/HeroSection';
import { CustomerStorySection } from '../../sections/CustomerStory/CustomerStorySection';
import { AutomationWorkflowSection } from '../../sections/AutomationWorkflow/AutomationWorkflowSection';
import { ProductFeaturesSection } from '../../sections/ProductFeatures/ProductFeaturesSection';
import { DataPrivacySection } from '../../sections/DataPrivacy/DataPrivacySection';
import { FAQSection } from '../../sections/FAQ/FAQSection';
import { FinalCTASection } from '../../sections/FinalCTA/FinalCTASection';

const DashboardDemoSection = lazy(() =>
  import('../../sections/DashboardDemo/DashboardDemoSection').then((m) => ({
    default: m.DashboardDemoSection,
  })),
);

const WhatsAppSimulatorSection = lazy(() =>
  import('../../sections/WhatsAppSimulator/WhatsAppSimulatorSection').then((m) => ({
    default: m.WhatsAppSimulatorSection,
  })),
);

const RevenueCalculatorSection = lazy(() =>
  import('../../sections/RevenueCalculator/RevenueCalculatorSection').then((m) => ({
    default: m.RevenueCalculatorSection,
  })),
);

function SectionFallback({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      className="py-24 border-t border-[var(--border-subtle)] text-center text-sm text-[var(--text-muted)]"
    >
      Loading {label}...
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CustomerStorySection />
      <AutomationWorkflowSection />
      <Suspense fallback={<SectionFallback id="live-demo" label="interactive dashboard demo" />}>
        <DashboardDemoSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="simulator" label="WhatsApp simulator" />}>
        <WhatsAppSimulatorSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="revenue-calculator" label="revenue calculator" />}>
        <RevenueCalculatorSection />
      </Suspense>
      <ProductFeaturesSection />
      <DataPrivacySection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
