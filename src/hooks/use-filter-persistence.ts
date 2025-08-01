'use client';

interface FilterState {
  search: string;
  make: string;
  model: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  emirate: string;
  condition: string;
  priceRange: [number, number];
  yearRange: [number, number];
}

const STORAGE_KEY = 'duxmax-listings-filters';

export function useFilterPersistence() {
  const saveFilters = (filters: FilterState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      // Ignore localStorage errors (e.g., in private browsing)
      console.warn('Could not save filters to localStorage:', error);
    }
  };

  const loadFilters = (): Partial<FilterState> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Could not load filters from localStorage:', error);
      return null;
    }
  };

  const clearSavedFilters = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Could not clear filters from localStorage:', error);
    }
  };

  return { saveFilters, loadFilters, clearSavedFilters };
}
