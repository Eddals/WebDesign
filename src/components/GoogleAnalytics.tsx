import useGoogleAnalytics from '../hooks/useGoogleAnalytics';

export default function GoogleAnalytics() {
  // Initialize Google Analytics
  useGoogleAnalytics();
  
  // This component doesn't render anything
  return null;
}