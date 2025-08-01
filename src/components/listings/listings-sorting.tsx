'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest to Oldest' },
  { value: 'year-asc', label: 'Year: Oldest to Newest' },
  { value: 'mileage-asc', label: 'Mileage: Low to High' },
  { value: 'mileage-desc', label: 'Mileage: High to Low' },
];

export function ListingsSorting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentSort = searchParams.get('sort') || 'createdAt-desc';

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
      const listingsPath = `/${locale}/listings`;
      router.replace(`${listingsPath}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <Select value={currentSort} onValueChange={handleSortChange} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by..." />
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
