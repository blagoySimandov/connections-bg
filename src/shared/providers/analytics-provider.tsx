import { createContext, useEffect, ReactNode, useCallback } from "react";
import { analytics, analyticsService } from "../services";

interface AnalyticsContextType {
  trackEvent: (eventName: string, params?: Record<string, any>) => void;
  trackPageView: (pageName: string, params?: Record<string, any>) => void;
  setUserId: (userId: string | null) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType | null>(
  null
);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    analyticsService.initialize(analytics);
  }, []);

  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      analyticsService.logEvent(eventName, params);
    },
    []
  );

  const trackPageView = useCallback(
    (pageName: string, params?: Record<string, any>) => {
      analyticsService.logPageView(pageName, params);
    },
    []
  );

  const setUserId = useCallback((userId: string | null) => {
    analyticsService.setUserId(userId);
  }, []);

  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    setUserId,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
