// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Track a page view in Google Analytics
 * @param path The path of the page (e.g., '/about')
 * @param title The title of the page
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('config', 'G-3FWDB6VQNN', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track an event in Google Analytics
 * @param eventName The name of the event
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, eventParams);
}