// Accessibility utilities and helpers

export interface AccessibilityOptions {
  enableFocusVisible?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReaderSupport?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
}

class AccessibilityManager {
  private options: AccessibilityOptions;
  private focusVisiblePolyfill: boolean = false;

  constructor(options: AccessibilityOptions = {}) {
    this.options = {
      enableFocusVisible: true,
      enableKeyboardNavigation: true,
      enableScreenReaderSupport: true,
      enableHighContrast: true,
      enableReducedMotion: true,
      ...options
    };

    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (this.options.enableFocusVisible) {
      this.initFocusVisible();
    }

    if (this.options.enableKeyboardNavigation) {
      this.initKeyboardNavigation();
    }

    if (this.options.enableHighContrast) {
      this.initHighContrast();
    }

    if (this.options.enableReducedMotion) {
      this.initReducedMotion();
    }

    this.initAriaLiveRegion();
  }

  private initFocusVisible() {
    // Add focus-visible polyfill behavior
    let hadKeyboardEvent = true;
    const keyboardThrottleTimeout = 100;

    const pointerEvents = ['mousedown', 'pointerdown', 'touchstart'];
    const keyboardEvents = ['keydown'];

    function onPointerDown() {
      hadKeyboardEvent = false;
    }

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }
      hadKeyboardEvent = true;
    }

    function onFocus(e: FocusEvent) {
      if (hadKeyboardEvent || (e.target as HTMLElement).matches(':focus-visible')) {
        (e.target as HTMLElement).classList.add('focus-visible');
      }
    }

    function onBlur(e: FocusEvent) {
      (e.target as HTMLElement).classList.remove('focus-visible');
    }

    pointerEvents.forEach(event => {
      document.addEventListener(event, onPointerDown, true);
    });

    keyboardEvents.forEach(event => {
      document.addEventListener(event, onKeyDown, true);
    });

    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);

    // Add CSS for focus-visible
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #a855f7;
        outline-offset: 2px;
      }
      
      *:focus:not(.focus-visible) {
        outline: none;
      }
    `;
    document.head.appendChild(style);
  }

  private initKeyboardNavigation() {
    // Skip links for keyboard navigation
    this.addSkipLinks();

    // Trap focus in modals
    document.addEventListener('keydown', this.handleModalFocusTrap.bind(this));

    // Escape key handler
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  private addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  private handleModalFocusTrap(e: globalThis.KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const modal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  private handleEscapeKey(e: globalThis.KeyboardEvent) {
    if (e.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
      if (modal) {
        const closeButton = modal.querySelector('[data-close-modal]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  }

  private initHighContrast() {
    // Detect high contrast mode
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    };

    mediaQuery.addListener(handleContrastChange);
    handleContrastChange(mediaQuery as any);

    // Add high contrast styles
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast {
        --bg-primary: #000000;
        --text-primary: #ffffff;
        --border-color: #ffffff;
        --link-color: #00ffff;
        --button-bg: #ffffff;
        --button-text: #000000;
      }
      
      .high-contrast * {
        background-color: var(--bg-primary) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
      }
      
      .high-contrast a {
        color: var(--link-color) !important;
      }
      
      .high-contrast button {
        background-color: var(--button-bg) !important;
        color: var(--button-text) !important;
      }
    `;
    document.head.appendChild(style);
  }

  private initReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    };

    mediaQuery.addListener(handleMotionChange);
    handleMotionChange(mediaQuery as any);

    // Add reduced motion styles
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  private initAriaLiveRegion() {
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);
  }

  // Public methods
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  public addAriaLabel(element: HTMLElement, label: string) {
    element.setAttribute('aria-label', label);
  }

  public addAriaDescribedBy(element: HTMLElement, descriptionId: string) {
    element.setAttribute('aria-describedby', descriptionId);
  }

  public makeElementFocusable(element: HTMLElement) {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  }

  public removeFromTabOrder(element: HTMLElement) {
    element.setAttribute('tabindex', '-1');
  }

  public setAriaExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  public setAriaHidden(element: HTMLElement, hidden: boolean) {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  // Color contrast checker
  public checkColorContrast(foreground: string, background: string): {
    ratio: number;
    level: 'AAA' | 'AA' | 'A' | 'FAIL';
  } {
    const getLuminance = (color: string): number => {
      // Simple luminance calculation (would need full implementation)
      // This is a simplified version
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(c => {
        const val = parseInt(c) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    let level: 'AAA' | 'AA' | 'A' | 'FAIL';
    if (ratio >= 7) level = 'AAA';
    else if (ratio >= 4.5) level = 'AA';
    else if (ratio >= 3) level = 'A';
    else level = 'FAIL';

    return { ratio, level };
  }
}

// Singleton instance
export const accessibilityManager = new AccessibilityManager();

// Utility functions
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  accessibilityManager.announce(message, priority);
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: globalThis.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

export const createAriaLabel = (text: string): string => {
  return text.replace(/[^\w\s]/gi, '').trim();
};