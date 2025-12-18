import {
  type Analytics,
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
  isSupported,
} from "firebase/analytics";

class AnalyticsService {
  private analytics: Analytics | null = null;
  private initialized = false;
  private isEnabled = true;

  async initialize(analytics: Analytics) {
    if (this.initialized) return;

    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase Analytics is not supported in this environment");
        this.isEnabled = false;
        return;
      }

      this.analytics = analytics;
      this.initialized = true;

      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        console.log("Firebase Analytics initialized in development mode");
      }
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
      this.isEnabled = false;
    }
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    if (!this.isEnabled || !this.analytics) return;

    try {
      firebaseLogEvent(this.analytics, eventName, params);

      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        console.log(`[Analytics] ${eventName}`, params);
      }
    } catch (error) {
      console.error("Failed to log event:", error);
    }
  }

  setUserId(userId: string | null) {
    if (!this.isEnabled || !this.analytics) return;

    try {
      firebaseSetUserId(this.analytics, userId);

      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        console.log(`[Analytics] Set user ID:`, userId);
      }
    } catch (error) {
      console.error("Failed to set user ID:", error);
    }
  }

  setUserProperty(name: string, value: string) {
    if (!this.isEnabled || !this.analytics) return;

    try {
      firebaseSetUserProperties(this.analytics, { [name]: value });

      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        console.log(`[Analytics] Set user property:`, { [name]: value });
      }
    } catch (error) {
      console.error("Failed to set user property:", error);
    }
  }

  logPageView(pageName: string, params?: Record<string, any>) {
    this.logEvent("page_view", {
      page_name: pageName,
      ...params,
    });
  }
}

export const analyticsService = new AnalyticsService();
