// Performance monitoring utilities

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObserver();
    }
  }

  private initializeObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
        break;
      
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime;
        break;
      
      case 'first-input':
        this.metrics.fid = (entry as any).processingStart - entry.startTime;
        break;
      
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value;
        }
        break;
      
      case 'navigation':
        this.metrics.ttfb = (entry as PerformanceNavigationTiming).responseStart;
        break;
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('First Contentful Paint (FCP):', this.metrics.fcp ? `${this.metrics.fcp.toFixed(2)}ms` : 'Not available');
      console.log('Largest Contentful Paint (LCP):', this.metrics.lcp ? `${this.metrics.lcp.toFixed(2)}ms` : 'Not available');
      console.log('First Input Delay (FID):', this.metrics.fid ? `${this.metrics.fid.toFixed(2)}ms` : 'Not available');
      console.log('Cumulative Layout Shift (CLS):', this.metrics.cls ? this.metrics.cls.toFixed(4) : 'Not available');
      console.log('Time to First Byte (TTFB):', this.metrics.ttfb ? `${this.metrics.ttfb.toFixed(2)}ms` : 'Not available');
      console.groupEnd();
    }
  }

  public getPerformanceGrade(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const { fcp, lcp, fid, cls } = this.metrics;
    
    let score = 0;
    let totalMetrics = 0;

    if (fcp !== undefined) {
      totalMetrics++;
      if (fcp <= 1800) score += 3;
      else if (fcp <= 3000) score += 2;
      else if (fcp <= 4200) score += 1;
    }

    if (lcp !== undefined) {
      totalMetrics++;
      if (lcp <= 2500) score += 3;
      else if (lcp <= 4000) score += 2;
      else if (lcp <= 5500) score += 1;
    }

    if (fid !== undefined) {
      totalMetrics++;
      if (fid <= 100) score += 3;
      else if (fid <= 300) score += 2;
      else if (fid <= 500) score += 1;
    }

    if (cls !== undefined) {
      totalMetrics++;
      if (cls <= 0.1) score += 3;
      else if (cls <= 0.25) score += 2;
      else if (cls <= 0.4) score += 1;
    }

    if (totalMetrics === 0) return 'needs-improvement';

    const averageScore = score / totalMetrics;
    
    if (averageScore >= 2.5) return 'excellent';
    if (averageScore >= 2) return 'good';
    if (averageScore >= 1) return 'needs-improvement';
    return 'poor';
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measurePageLoad = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Wait a bit for all metrics to be collected
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 1000);
  });
};

export const measureComponentRender = (componentName: string) => {
  if (typeof window === 'undefined') return () => {};

  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  };
};

// Web Vitals reporting (for analytics)
export const reportWebVitals = (metric: PerformanceMetrics) => {
  // This can be used to send metrics to analytics services
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, DataDog, etc.
    // gtag('event', 'web_vitals', {
    //   event_category: 'performance',
    //   event_label: metric.name,
    //   value: Math.round(metric.value)
    // });
  }
};

// Resource loading performance
export const measureResourceLoad = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const img = new Image();
    img.onload = img.onerror = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };
    img.src = url;
  });
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('📦 Bundle Analysis');
    console.log('JavaScript files:', scripts.length);
    console.log('CSS files:', styles.length);
    
    scripts.forEach((script: any) => {
      console.log(`JS: ${script.src}`);
    });
    
    styles.forEach((style: any) => {
      console.log(`CSS: ${style.href}`);
    });
    console.groupEnd();
  }
};