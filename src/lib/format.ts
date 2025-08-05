/**
 * Format numbers consistently for server and client to avoid hydration mismatches
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0';
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) return '0';
  
  // Use a simple comma separator that works consistently across environments
  return Math.floor(numValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | string | null | undefined, currency: string = 'AED'): string {
  const formattedNumber = formatNumber(price);
  return `${currency} ${formattedNumber}`;
}

/**
 * Format mileage with unit
 */
export function formatMileage(mileage: number | string | null | undefined, unit: string = 'km'): string {
  const formattedNumber = formatNumber(mileage);
  return `${formattedNumber} ${unit}`;
}
