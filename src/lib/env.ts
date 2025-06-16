// Environment configuration and validation

interface EnvironmentConfig {
  // App
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_APP_URL: string;
  
  // Supabase
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  
  // Stripe
  VITE_STRIPE_PUBLISHABLE_KEY?: string;
  
  // Analytics
  VITE_GA_TRACKING_ID?: string;
  VITE_GTM_ID?: string;
  
  // Features
  VITE_ENABLE_ANALYTICS: boolean;
  VITE_ENABLE_ERROR_REPORTING: boolean;
  VITE_ENABLE_PERFORMANCE_MONITORING: boolean;
  
  // API
  VITE_API_BASE_URL?: string;
  VITE_API_TIMEOUT: number;
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      // App
      NODE_ENV: (import.meta.env.NODE_ENV as any) || 'development',
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'DevTone',
      VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
      VITE_APP_URL: import.meta.env.VITE_APP_URL || 'https://www.devtone.agency',
      
      // Supabase
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      
      // Stripe
      VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      
      // Analytics
      VITE_GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,
      VITE_GTM_ID: import.meta.env.VITE_GTM_ID,
      
      // Features
      VITE_ENABLE_ANALYTICS: this.parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS, true),
      VITE_ENABLE_ERROR_REPORTING: this.parseBoolean(import.meta.env.VITE_ENABLE_ERROR_REPORTING, true),
      VITE_ENABLE_PERFORMANCE_MONITORING: this.parseBoolean(import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING, true),
      
      // API
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
    };
  }

  private parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  private validateConfig(): void {
    const errors: string[] = [];

    // Required in production
    if (this.config.NODE_ENV === 'production') {
      if (!this.config.VITE_APP_URL) {
        errors.push('VITE_APP_URL is required in production');
      }
      
      if (!this.config.VITE_SUPABASE_URL) {
        console.warn('VITE_SUPABASE_URL is not set - database features will be disabled');
      }
      
      if (!this.config.VITE_SUPABASE_ANON_KEY) {
        console.warn('VITE_SUPABASE_ANON_KEY is not set - database features will be disabled');
      }
    }

    // Validate URLs
    if (this.config.VITE_APP_URL && !this.isValidUrl(this.config.VITE_APP_URL)) {
      errors.push('VITE_APP_URL must be a valid URL');
    }

    if (this.config.VITE_SUPABASE_URL && !this.isValidUrl(this.config.VITE_SUPABASE_URL)) {
      errors.push('VITE_SUPABASE_URL must be a valid URL');
    }

    if (this.config.VITE_API_BASE_URL && !this.isValidUrl(this.config.VITE_API_BASE_URL)) {
      errors.push('VITE_API_BASE_URL must be a valid URL');
    }

    // Validate timeout
    if (this.config.VITE_API_TIMEOUT < 1000 || this.config.VITE_API_TIMEOUT > 60000) {
      errors.push('VITE_API_TIMEOUT must be between 1000 and 60000 milliseconds');
    }

    if (errors.length > 0) {
      console.error('Environment configuration errors:', errors);
      if (this.config.NODE_ENV === 'production') {
        throw new Error(`Environment validation failed: ${errors.join(', ')}`);
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Getters
  public get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  public get appName(): string {
    return this.config.VITE_APP_NAME;
  }

  public get appVersion(): string {
    return this.config.VITE_APP_VERSION;
  }

  public get appUrl(): string {
    return this.config.VITE_APP_URL;
  }

  public get supabaseUrl(): string | undefined {
    return this.config.VITE_SUPABASE_URL;
  }

  public get supabaseAnonKey(): string | undefined {
    return this.config.VITE_SUPABASE_ANON_KEY;
  }

  public get stripePublishableKey(): string | undefined {
    return this.config.VITE_STRIPE_PUBLISHABLE_KEY;
  }

  public get gaTrackingId(): string | undefined {
    return this.config.VITE_GA_TRACKING_ID;
  }

  public get gtmId(): string | undefined {
    return this.config.VITE_GTM_ID;
  }

  public get enableAnalytics(): boolean {
    return this.config.VITE_ENABLE_ANALYTICS && this.isProduction;
  }

  public get enableErrorReporting(): boolean {
    return this.config.VITE_ENABLE_ERROR_REPORTING;
  }

  public get enablePerformanceMonitoring(): boolean {
    return this.config.VITE_ENABLE_PERFORMANCE_MONITORING;
  }

  public get apiBaseUrl(): string | undefined {
    return this.config.VITE_API_BASE_URL;
  }

  public get apiTimeout(): number {
    return this.config.VITE_API_TIMEOUT;
  }

  public get isSupabaseConfigured(): boolean {
    return !!(this.config.VITE_SUPABASE_URL && this.config.VITE_SUPABASE_ANON_KEY);
  }

  public get isStripeConfigured(): boolean {
    return !!this.config.VITE_STRIPE_PUBLISHABLE_KEY;
  }

  // Debug info
  public getDebugInfo(): Record<string, any> {
    if (!this.isDevelopment) {
      return { message: 'Debug info only available in development' };
    }

    return {
      nodeEnv: this.config.NODE_ENV,
      appName: this.config.VITE_APP_NAME,
      appVersion: this.config.VITE_APP_VERSION,
      appUrl: this.config.VITE_APP_URL,
      supabaseConfigured: this.isSupabaseConfigured,
      stripeConfigured: this.isStripeConfigured,
      analyticsEnabled: this.enableAnalytics,
      errorReportingEnabled: this.enableErrorReporting,
      performanceMonitoringEnabled: this.enablePerformanceMonitoring,
      apiTimeout: this.config.VITE_API_TIMEOUT,
    };
  }

  public logConfig(): void {
    if (this.isDevelopment) {
      console.group('🔧 Environment Configuration');
      console.table(this.getDebugInfo());
      console.groupEnd();
    }
  }
}

// Singleton instance
export const env = new Environment();

// Export commonly used values
export const {
  isDevelopment,
  isProduction,
  isTest,
  appName,
  appVersion,
  appUrl,
  supabaseUrl,
  supabaseAnonKey,
  stripePublishableKey,
  gaTrackingId,
  gtmId,
  enableAnalytics,
  enableErrorReporting,
  enablePerformanceMonitoring,
  apiBaseUrl,
  apiTimeout,
  isSupabaseConfigured,
  isStripeConfigured
} = env;

// Initialize logging in development
if (isDevelopment) {
  env.logConfig();
}