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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  
  // Filter states - will be synced with URL params
  const [search, setSearch] = useState('');
  const [make, setMake] = useState('all');
  const [model, setModel] = useState('all');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [bodyType, setBodyType] = useState('all');
  const [emirate, setEmirate] = useState('all');
  const [condition, setCondition] = useState('all');
  
  // Range states
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');

  // Collapsible states
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Sync with URL params on mount and when params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setMake(searchParams.get('make') || 'all');
    setModel(searchParams.get('model') || 'all');
    setFuelType(searchParams.get('fuelType') || 'all');
    setTransmission(searchParams.get('transmission') || 'all');
    setBodyType(searchParams.get('bodyType') || 'all');
    setEmirate(searchParams.get('emirate') || 'all');
    setCondition(searchParams.get('condition') || 'all');
    setPriceFrom(searchParams.get('priceFrom') || '');
    setPriceTo(searchParams.get('priceTo') || '');
    setYearFrom(searchParams.get('yearFrom') || '');
    setYearTo(searchParams.get('yearTo') || '');
  }, [searchParams]);

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
      const listingsPath = `/${locale}`;
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
      const listingsPath = `/${locale}`;
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
          {t('common.filter')}
        </h2>
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            {t('common.reset')}
          </Button>
        )}
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
            {t('common.search')}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              placeholder={t('home.searchPlaceholder')}
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
            {t('search.filters.make')}
          </Label>
          <Select value={make} onValueChange={setMake}>
            <SelectTrigger>
              <SelectValue placeholder={`${t('common.select')} ${t('search.filters.make').toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.select')} {t('search.filters.make').toLowerCase()}</SelectItem>
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
            {t('search.filters.model')}
          </Label>
          <Select value={model} onValueChange={setModel} disabled={!make || make === 'all' || availableModels.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={make && make !== 'all' ? `${t('common.select')} ${t('search.filters.model').toLowerCase()}` : t('common.selectFirst', {field: t('search.filters.make').toLowerCase()})} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.select')} {t('search.filters.model').toLowerCase()}</SelectItem>
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
            {t('search.filters.priceRange')} (AED)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="priceFrom" className="text-xs text-gray-500 mb-1 block">
                {t('common.from')}
              </Label>
              <Input
                id="priceFrom"
                type="number"
                placeholder={t('common.minPrice')}
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="priceTo" className="text-xs text-gray-500 mb-1 block">
                {t('common.to')}
              </Label>
              <Input
                id="priceTo"
                type="number"
                placeholder={t('common.maxPrice')}
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
            {t('search.filters.yearRange')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="yearFrom" className="text-xs text-gray-500 mb-1 block">
                {t('common.from')}
              </Label>
              <Input
                id="yearFrom"
                type="number"
                placeholder={t('common.minYear')}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min={filterOptions.yearRange.min}
                max={filterOptions.yearRange.max}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="yearTo" className="text-xs text-gray-500 mb-1 block">
                {t('common.to')}
              </Label>
              <Input
                id="yearTo"
                type="number"
                placeholder={t('common.maxYear')}
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
              <span className="text-sm font-medium text-gray-700">{t('common.advancedFilters')}</span>
              <span className="text-xs text-gray-500">
                {isAdvancedOpen ? t('common.hide') : t('common.show')}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Fuel Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                {t('search.filters.fuelType')}
              </Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.any')} ${t('search.filters.fuelType').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.any')} {t('search.filters.fuelType').toLowerCase()}</SelectItem>
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
                {t('search.filters.transmission')}
              </Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.any')} ${t('search.filters.transmission').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.any')} {t('search.filters.transmission').toLowerCase()}</SelectItem>
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
                {t('search.filters.bodyType')}
              </Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.any')} ${t('search.filters.bodyType').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.any')} {t('search.filters.bodyType').toLowerCase()}</SelectItem>
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
                {t('search.filters.emirate')}
              </Label>
              <Select value={emirate} onValueChange={setEmirate}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.any')} ${t('search.filters.emirate').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.any')} {t('search.filters.emirate').toLowerCase()}</SelectItem>
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
                {t('search.filters.condition')}
              </Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.any')} ${t('search.filters.condition').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.any')} {t('search.filters.condition').toLowerCase()}</SelectItem>
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
          {isPending ? t('common.applying') : t('common.applyFilters')}
        </Button>
      </div>
    </div>
  );
}
