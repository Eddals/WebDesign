declare global {
  interface Window {
    __supabaseConfigLogged?: boolean;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    Brevo?: any[];
  }
}

export {};