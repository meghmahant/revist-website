import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppRoute } from '../types';

interface RouterContextValue {
  route: AppRoute;
  navigate: (to: AppRoute, hash?: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

function normalizePath(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/privacy-policy') return '/privacy-policy';
  if (clean === '/terms-of-service') return '/terms-of-service';
  return '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: AppRoute, hash?: string) => {
    const targetUrl = to === '/' ? (hash ? `/#${hash}` : '/') : `${to}/`;
    if (typeof window !== 'undefined') {
      const currentNorm = normalizePath(window.location.pathname);
      if (currentNorm !== to) {
        window.history.pushState({}, '', targetUrl);
        setRoute(to);
      } else if (hash) {
        window.history.replaceState({}, '', `/#${hash}`);
      }

      if (to === '/' && hash) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 40);
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useAppRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useAppRouter must be used within a RouterProvider');
  }
  return ctx;
}
