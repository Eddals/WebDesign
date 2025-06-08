// Simple client-side storage for frequently searched FAQ questions
// This complements the server-side storage for FAQs

const STORAGE_KEY = 'faq_frequent_searches';
const MAX_SEARCHES = 5;

class FAQStorage {
  private frequentSearches: string[] = [];

  constructor() {
    this.loadFrequentSearches();
  }

  // Load searches from localStorage
  loadFrequentSearches(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          this.frequentSearches = JSON.parse(stored);
        } catch (e) {
          this.frequentSearches = [];
        }
      }
    }
  }

  // Save searches to localStorage
  saveFrequentSearches(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.frequentSearches));
    }
  }

  // Add a new search query
  addFrequentSearch(query: string): void {
    // Normalize the query
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;

    // Remove if it already exists (to move it to the front)
    this.frequentSearches = this.frequentSearches.filter(
      (item) => item.toLowerCase() !== normalizedQuery
    );

    // Add to the beginning
    this.frequentSearches.unshift(query.trim());

    // Limit to max searches
    if (this.frequentSearches.length > MAX_SEARCHES) {
      this.frequentSearches = this.frequentSearches.slice(0, MAX_SEARCHES);
    }

    this.saveFrequentSearches();
  }

  // Get all frequent searches
  getFrequentSearches(): string[] {
    return [...this.frequentSearches];
  }

  // Clear all frequent searches
  clearFrequentSearches(): void {
    this.frequentSearches = [];
    this.saveFrequentSearches();
  }
}

// Create a singleton instance
export const storage = new FAQStorage();