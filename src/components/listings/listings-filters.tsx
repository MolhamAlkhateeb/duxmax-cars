'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterOptions {
  makes: string[];
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  emirates: string[];
  conditions: string[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

interface ListingsFiltersProps {
  filterOptions: FilterOptions;
}

export function ListingsFilters({ filterOptions }: ListingsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [make, setMake] = useState(searchParams.get('make') || 'all');
  const [model, setModel] = useState(searchParams.get('model') || 'all');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || 'all');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'all');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || 'all');
  const [emirate, setEmirate] = useState(searchParams.get('emirate') || 'all');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'all');
  
  // Range states
  const [priceFrom, setPriceFrom] = useState(
    searchParams.get('priceFrom') || ''
  );
  const [priceTo, setPriceTo] = useState(
    searchParams.get('priceTo') || ''
  );
  const [yearFrom, setYearFrom] = useState(
    searchParams.get('yearFrom') || ''
  );
  const [yearTo, setYearTo] = useState(
    searchParams.get('yearTo') || ''
  );

  // Collapsible states
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Fetch models when make changes
  useEffect(() => {
    if (make && make !== 'all') {
      fetch(`/api/listings/models?make=${encodeURIComponent(make)}`)
        .then(res => res.json())
        .then(data => {
          setAvailableModels(data.models || []);
          // Clear model if it's not available for the selected make
          if (model && model !== 'all' && !data.models?.includes(model)) {
            setModel('all');
          }
        })
        .catch(console.error);
    } else {
      setAvailableModels([]);
      setModel('all');
    }
  }, [make, model]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (make && make !== 'all') params.set('make', make);
    if (model && model !== 'all') params.set('model', model);
    if (fuelType && fuelType !== 'all') params.set('fuelType', fuelType);
    if (transmission && transmission !== 'all') params.set('transmission', transmission);
    if (bodyType && bodyType !== 'all') params.set('bodyType', bodyType);
    if (emirate && emirate !== 'all') params.set('emirate', emirate);
    if (condition && condition !== 'all') params.set('condition', condition);
    
    if (priceFrom && priceFrom.trim() !== '') {
      params.set('priceFrom', priceFrom);
    }
    if (priceTo && priceTo.trim() !== '') {
      params.set('priceTo', priceTo);
    }
    
    if (yearFrom && yearFrom.trim() !== '') {
      params.set('yearFrom', yearFrom);
    }
    if (yearTo && yearTo.trim() !== '') {
      params.set('yearTo', yearTo);
    }

    startTransition(() => {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const locale = pathSegments[1]; // Extract locale from path (e.g., 'en' or 'ar')
      const listingsPath = `/${locale}/listings`;
      router.replace(`${listingsPath}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch('');
    setMake('all');
    setModel('all');
    setAvailableModels([]);
    setFuelType('all');
    setTransmission('all');
    setBodyType('all');
    setEmirate('all');
    setCondition('all');
    setPriceFrom('');
    setPriceTo('');
    setYearFrom('');
    setYearTo('');
    
    startTransition(() => {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const locale = pathSegments[1]; // Extract locale from path (e.g., 'en' or 'ar')
      const listingsPath = `/${locale}/listings`;
      router.replace(listingsPath);
    });
  };

  const hasActiveFilters = () => {
    return search || 
           (make && make !== 'all') || 
           (model && model !== 'all') || 
           (fuelType && fuelType !== 'all') || 
           (transmission && transmission !== 'all') || 
           (bodyType && bodyType !== 'all') || 
           (emirate && emirate !== 'all') || 
           (condition && condition !== 'all') ||
           (priceFrom && priceFrom.trim() !== '') ||
           (priceTo && priceTo.trim() !== '') ||
           (yearFrom && yearFrom.trim() !== '') ||
           (yearTo && yearTo.trim() !== '');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
        </div>

        {/* Make */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Make
          </Label>
          <Select value={make} onValueChange={setMake}>
            <SelectTrigger>
              <SelectValue placeholder="Any make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any make</SelectItem>
              {filterOptions.makes.map((makeOption) => (
                <SelectItem key={makeOption} value={makeOption}>
                  {makeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Model
          </Label>
          <Select value={model} onValueChange={setModel} disabled={!make || make === 'all' || availableModels.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={make && make !== 'all' ? "Select model" : "Select make first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any model</SelectItem>
              {availableModels.map((modelOption) => (
                <SelectItem key={modelOption} value={modelOption}>
                  {modelOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Price Range (AED)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="priceFrom" className="text-xs text-gray-500 mb-1 block">
                From
              </Label>
              <Input
                id="priceFrom"
                type="number"
                placeholder="Min price"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="priceTo" className="text-xs text-gray-500 mb-1 block">
                To
              </Label>
              <Input
                id="priceTo"
                type="number"
                placeholder="Max price"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Year Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="yearFrom" className="text-xs text-gray-500 mb-1 block">
                From
              </Label>
              <Input
                id="yearFrom"
                type="number"
                placeholder="Min year"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min={filterOptions.yearRange.min}
                max={filterOptions.yearRange.max}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="yearTo" className="text-xs text-gray-500 mb-1 block">
                To
              </Label>
              <Input
                id="yearTo"
                type="number"
                placeholder="Max year"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                min={filterOptions.yearRange.min}
                max={filterOptions.yearRange.max}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
              <span className="text-xs text-gray-500">
                {isAdvancedOpen ? 'Hide' : 'Show'}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Fuel Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Fuel Type
              </Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any fuel type</SelectItem>
                  {filterOptions.fuelTypes.map((fuelTypeOption) => (
                    <SelectItem key={fuelTypeOption} value={fuelTypeOption}>
                      {fuelTypeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Transmission
              </Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger>
                  <SelectValue placeholder="Any transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any transmission</SelectItem>
                  {filterOptions.transmissions.map((transmissionOption) => (
                    <SelectItem key={transmissionOption} value={transmissionOption}>
                      {transmissionOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Body Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Body Type
              </Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any body type</SelectItem>
                  {filterOptions.bodyTypes.map((bodyTypeOption) => (
                    <SelectItem key={bodyTypeOption} value={bodyTypeOption}>
                      {bodyTypeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emirate */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Emirate
              </Label>
              <Select value={emirate} onValueChange={setEmirate}>
                <SelectTrigger>
                  <SelectValue placeholder="Any emirate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any emirate</SelectItem>
                  {filterOptions.emirates.map((emirateOption) => (
                    <SelectItem key={emirateOption} value={emirateOption}>
                      {emirateOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Condition
              </Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Any condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any condition</SelectItem>
                  {filterOptions.conditions.map((conditionOption) => (
                    <SelectItem key={conditionOption} value={conditionOption}>
                      {conditionOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Apply Button */}
        <Button 
          onClick={applyFilters} 
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Applying...' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  );
}
