import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

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
  const locale = await getLocale();
  
  // Build query string from search params
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, value);
    }
  });
  
  // Redirect to home page with search params preserved
  const queryString = queryParams.toString();
  const redirectUrl = `/${locale}${queryString ? `?${queryString}` : ''}`;
  
  redirect(redirectUrl);
}
