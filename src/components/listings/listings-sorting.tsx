'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ListingsSorting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  
  // Initialize with default and sync with URL params
  const [currentSort, setCurrentSort] = useState('createdAt-desc');

  // Sync with URL params on mount and when params change
  useEffect(() => {
    setCurrentSort(searchParams.get('sort') || 'createdAt-desc');
  }, [searchParams]);

  const sortOptions = [
    { value: 'createdAt-desc', label: t('search.sortBy.newest') },
    { value: 'createdAt-asc', label: t('search.sortBy.oldest') },
    { value: 'price-asc', label: t('search.sortBy.priceLow') },
    { value: 'price-desc', label: t('search.sortBy.priceHigh') },
    { value: 'year-desc', label: t('search.sortBy.yearNew') },
    { value: 'year-asc', label: t('search.sortBy.yearOld') },
    { value: 'mileage-asc', label: t('search.sortBy.mileageLow') },
    { value: 'mileage-desc', label: t('search.sortBy.mileageHigh') },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'createdAt-desc') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    // Reset to first page when sorting changes
    params.delete('page');

    startTransition(() => {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const locale = pathSegments[1]; // Extract locale from path (e.g., 'en' or 'ar')
      const listingsPath = `/${locale}`;
      router.replace(`${listingsPath}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <Select value={currentSort} onValueChange={handleSortChange} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('search.sortBy.label')} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
