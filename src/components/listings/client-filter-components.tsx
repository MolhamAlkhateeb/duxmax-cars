'use client';

import { QuickSearch } from "@/components/listings/quick-search";
import { ListingsFilters } from "@/components/listings/listings-filters";
import { ListingsSorting } from "@/components/listings/listings-sorting";

interface ClientFilterComponentsProps {
  filterOptions: any;
}

export function ClientFilterComponents({ filterOptions }: ClientFilterComponentsProps) {
  return (
    <>
      {/* Quick Search for Mobile */}
      <QuickSearch />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ListingsFilters filterOptions={filterOptions} />
        </div>

        {/* Listings Grid Container */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Grid Header with Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {/* This will be passed from server component */}
            </h3>
            <ListingsSorting />
          </div>
        </div>
      </div>
    </>
  );
}
