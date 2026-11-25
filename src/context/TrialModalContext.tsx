import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface TrialModalContextValue {
  isOpen: boolean;
  leadSource: string;
  openModal: (source?: string) => void;
  closeModal: () => void;
}

const TrialModalContext = createContext<TrialModalContextValue | undefined>(undefined);

export function TrialModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('hero');
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback((source = 'website_cta') => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      lastFocusedRef.current = document.activeElement;
    }
    setLeadSource(source);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    const previous = lastFocusedRef.current;
    if (previous) {
      requestAnimationFrame(() => {
        previous.focus();
      });
    }
  }, []);

  return (
    <TrialModalContext.Provider value={{ isOpen, leadSource, openModal, closeModal }}>
      {children}
    </TrialModalContext.Provider>
  );
}

export function useTrialModal() {
  const ctx = useContext(TrialModalContext);
  if (!ctx) {
    throw new Error('useTrialModal must be used within a TrialModalProvider');
  }
  return ctx;
}
