import { useFeatureFlag } from '@/lib/features/featureFlags';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private enabled: boolean;

  private constructor() {
    this.enabled = useFeatureFlag('analytics');
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public trackPageView(path: string): void {
    if (!this.enabled) return;

    // Implement your analytics tracking here
    console.log('Page view:', path);
    // Example: Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    // Implement your event tracking here
    console.log('Event:', event);
    // Example: Google Analytics
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value
    // });
  }

  public trackError(error: Error): void {
    if (!this.enabled) return;

    this.trackEvent({
      category: 'Error',
      action: 'Error Occurred',
      label: error.message,
    });
  }

  public trackUserAction(action: string, details?: any): void {
    if (!this.enabled) return;

    this.trackEvent({
      category: 'User Action',
      action,
      label: JSON.stringify(details),
    });
  }
}

export const analytics = AnalyticsService.getInstance();

// React hook to use analytics
export const useAnalytics = () => {
  const enabled = useFeatureFlag('analytics');

  const trackPageView = (path: string) => {
    if (enabled) {
      analytics.trackPageView(path);
    }
  };

  const trackEvent = (event: AnalyticsEvent) => {
    if (enabled) {
      analytics.trackEvent(event);
    }
  };

  const trackError = (error: Error) => {
    if (enabled) {
      analytics.trackError(error);
    }
  };

  const trackUserAction = (action: string, details?: any) => {
    if (enabled) {
      analytics.trackUserAction(action, details);
    }
  };

  return {
    trackPageView,
    trackEvent,
    trackError,
    trackUserAction,
  };
}; 