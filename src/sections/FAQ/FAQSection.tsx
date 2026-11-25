import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Revist?',
    answer:
      'Revist is a customer retention platform designed to help restaurants identify inactive customers and reconnect with eligible customers through personalised WhatsApp campaigns.',
  },
  {
    question: 'Does Revist connect to my billing system?',
    answer:
      'No. You export your customer data as a CSV file and upload it to Revist. You do not need to provide your billing system credentials.',
  },
  {
    question: 'What customer information is required?',
    answer:
      'Revist primarily requires customer names, phone numbers and last visit dates. Usual orders and total spend may be included when available.',
  },
  {
    question: 'How does Revist identify inactive customers?',
    answer:
      'By default, customers who have not visited for more than 21 days are considered inactive. Restaurants can adjust this threshold.',
  },
  {
    question: 'Will every inactive customer receive a WhatsApp message?',
    answer:
      'No. Promotional messages must be limited to eligible customers who have agreed to receive offers and meet the messaging rules.',
  },
  {
    question: 'Can customers stop receiving messages?',
    answer:
      'Customers must be able to opt out by replying STOP. Production opt-out handling must be verified before live campaigns begin.',
  },
  {
    question: 'Does Revist use the official WhatsApp API?',
    answer:
      "Yes. Revist's message-sending functionality is built on WhatsApp's official Business API and has been tested with a test number.",
  },
  {
    question: 'How frequently will customers receive reminders?',
    answer:
      'The intended reminder policy is no more than one reminder per customer within a 30-day period.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Submit a free trial request. The Revist team will contact you to discuss your restaurant, data requirements and onboarding.',
  },
  {
    question: 'How much does Revist cost?',
    answer:
      'Contact the Revist team to discuss pricing and requirements. Final pricing and WhatsApp messaging charges have not yet been confirmed.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-24 sm:py-32 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1040px] px-5 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </span>
          <h2
            id="faq-heading"
            className="font-display text-section-display font-bold text-[var(--text-primary)]"
          >
            Clear answers before you start.
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-subtle)] rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] px-6 sm:px-8">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-btn-${idx}`;
            return (
              <div key={item.question} className="py-5">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(idx)}
                    className="flex w-full items-center justify-between gap-4 text-left font-display text-base sm:text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 text-[var(--accent-primary)] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pt-3 pr-8 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
