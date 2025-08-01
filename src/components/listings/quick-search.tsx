'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function QuickSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    
    // Reset to first page when searching
    params.delete('page');

    startTransition(() => {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const locale = pathSegments[1]; // Extract locale from path (e.g., 'en' or 'ar')
      const listingsPath = `/${locale}/listings`;
      router.replace(`${listingsPath}?${params.toString()}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-6 lg:hidden">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={handleSearch} 
        disabled={isPending}
        size="default"
        className="px-6"
      >
        {isPending ? '...' : 'Search'}
      </Button>
    </div>
  );
}
