import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Car, Fuel, Calendar, Settings, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ListingsRepository } from "@/db/repositories/listings.repository";
import { ListingsFilters } from "@/components/listings/listings-filters";
import { ListingsSorting } from "@/components/listings/listings-sorting";
import { QuickSearch } from "@/components/listings/quick-search";
import { db } from "@/db";

interface SearchParams {
  page?: string;
  search?: string;
  make?: string;
  model?: string;
  yearFrom?: string;
  yearTo?: string;
  priceFrom?: string;
  priceTo?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  emirate?: string;
  condition?: string;
  sort?: string;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = 12;

  const listingsRepo = new ListingsRepository(db);
  
  // Get filter options
  const filterOptions = await listingsRepo.getFilterOptions();
  
  // Build filters from search params
  const filters = {
    search: params.search,
    make: params.make,
    model: params.model,
    yearFrom: params.yearFrom ? parseInt(params.yearFrom, 10) : undefined,
    yearTo: params.yearTo ? parseInt(params.yearTo, 10) : undefined,
    priceFrom: params.priceFrom ? parseInt(params.priceFrom, 10) : undefined,
    priceTo: params.priceTo ? parseInt(params.priceTo, 10) : undefined,
    fuelType: params.fuelType,
    transmission: params.transmission,
    bodyType: params.bodyType,
    emirate: params.emirate,
    condition: params.condition,
  };

  // Parse sorting
  const sortParam = params.sort || 'createdAt-desc';
  const [sortField, sortOrder] = sortParam.split('-') as ['price' | 'year' | 'mileage' | 'createdAt', 'asc' | 'desc'];
  const sort = { field: sortField, order: sortOrder };

  const { listings, total } = await listingsRepo.searchListings(
    filters,
    sort,
    page,
    limit
  );

  const totalPages = Math.ceil(total / limit);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Cars</h1>
        <p className="text-gray-600">
          Find your perfect car from our extensive collection
        </p>
      </div>

      {/* Quick Search for Mobile */}
      <QuickSearch />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ListingsFilters filterOptions={filterOptions} />
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Grid Header with Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {total} car{total !== 1 ? 's' : ''} found
            </h2>
            <ListingsSorting />
          </div>
          
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0] as string}
                          alt={listing.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 left-2 bg-white/90 text-gray-900"
                    >
                      {listing.condition}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {listing.year} {listing.make} {listing.model}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          <span>{listing.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-4 h-4" />
                          <span>{listing.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{listing.year}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.city}, {listing.emirate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {listing.currency} {listing.price?.toLocaleString()}
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/listings/${listing.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cars found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or browse all available cars.
                </p>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                const currentParams = new URLSearchParams();
                
                // Preserve all current filters
                Object.entries(params).forEach(([key, value]) => {
                  if (key !== 'page' && value) {
                    currentParams.set(key, value);
                  }
                });
                currentParams.set('page', pageNum.toString());
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`/listings?${currentParams.toString()}`}>
                      {pageNum}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
