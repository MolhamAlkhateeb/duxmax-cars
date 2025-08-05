'use client';

import { Suspense } from 'react';
import { QuickSearch } from '@/components/listings/quick-search';
import { ListingsFilters } from '@/components/listings/listings-filters';
import { ListingsSorting } from '@/components/listings/listings-sorting';

// Fallback components for loading states
const QuickSearchFallback = () => (
  <div className="flex gap-2 mb-6 lg:hidden">
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-pulse">
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full h-10 bg-gray-100 rounded-md pl-10 animate-pulse"></div>
    </div>
    <div className="w-20 h-10 bg-gray-100 rounded-md animate-pulse"></div>
  </div>
);

const FiltersFallback = () => (
  <div className="space-y-4">
    <div className="h-6 bg-gray-100 rounded w-20 animate-pulse"></div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

const SortingFallback = () => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-gray-100 rounded animate-pulse"></div>
    <div className="w-48 h-10 bg-gray-100 rounded animate-pulse"></div>
  </div>
);

// Wrapper components with Suspense
export function QuickSearchWithSuspense() {
  return (
    <Suspense fallback={<QuickSearchFallback />}>
      <QuickSearch />
    </Suspense>
  );
}

export function ListingsFiltersWithSuspense({ filterOptions }: { filterOptions: any }) {
  return (
    <Suspense fallback={<FiltersFallback />}>
      <ListingsFilters filterOptions={filterOptions} />
    </Suspense>
  );
}

export function ListingsSortingWithSuspense() {
  return (
    <Suspense fallback={<SortingFallback />}>
      <ListingsSorting />
    </Suspense>
  );
}
