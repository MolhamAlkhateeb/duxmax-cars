import { z } from 'zod';
import {
  CAR_MAKES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  COLORS,
  CONDITIONS,
  EMIRATES,
  CAR_FEATURES,
} from '@/lib/constants';

// Type-safe enum conversion
const makeEnum = z.enum(CAR_MAKES);
const fuelTypeEnum = z.enum(FUEL_TYPES);
const transmissionEnum = z.enum(TRANSMISSION_TYPES);
const bodyTypeEnum = z.enum(BODY_TYPES);
const colorEnum = z.enum(COLORS);
const conditionEnum = z.enum(CONDITIONS);
const emirateEnum = z.enum(EMIRATES);
const featureEnum = z.enum(CAR_FEATURES);

// Base listing schema
export const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(255),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  price: z.coerce.number().min(1000, 'Price must be at least 1,000 AED').max(10000000, 'Price must be less than 10,000,000 AED'),
  currency: z.literal('AED').default('AED'),
  
  // Car details
  make: makeEnum,
  model: z.string().min(1, 'Model is required').max(100),
  year: z.coerce.number()
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  mileage: z.coerce.number().min(0, 'Mileage cannot be negative').max(1000000, 'Mileage seems too high').optional(),
  fuelType: fuelTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  bodyType: bodyTypeEnum.optional(),
  color: colorEnum.optional(),
  doors: z.coerce.number().min(2).max(6).optional(),
  cylinders: z.coerce.number().min(2).max(16).optional(),
  horsepower: z.coerce.number().min(50).max(2000).optional(),
  
  // Location
  emirate: emirateEnum,
  city: z.string().min(1, 'City is required').max(100),
  area: z.string().max(100).optional(),
  
  // Features and condition
  features: z.array(featureEnum).default([]),
  condition: conditionEnum,
  accidentHistory: z.boolean().default(false),
  serviceHistory: z.any().optional(), // Will be JSON
  
  // Media
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(20, 'Maximum 20 images allowed'),
  videos: z.array(z.string().url()).max(5, 'Maximum 5 videos allowed').default([]),
});

// Create listing schema (without auto-generated fields)
export const createListingSchema = listingSchema;

// Update listing schema (all fields optional except ID)
export const updateListingSchema = listingSchema.partial();

// Listing filters schema
export const listingFiltersSchema = z.object({
  search: z.string().max(200).optional(),
  make: makeEnum.optional(),
  model: z.string().max(100).optional(),
  yearFrom: z.coerce.number().min(1990).optional(),
  yearTo: z.coerce.number().max(new Date().getFullYear() + 1).optional(),
  priceFrom: z.coerce.number().min(0).optional(),
  priceTo: z.coerce.number().min(0).optional(),
  mileageFrom: z.coerce.number().min(0).optional(),
  mileageTo: z.coerce.number().min(0).optional(),
  fuelType: fuelTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  bodyType: bodyTypeEnum.optional(),
  emirate: emirateEnum.optional(),
  city: z.string().max(100).optional(),
  condition: conditionEnum.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['price', 'year', 'mileage', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200),
  filters: listingFiltersSchema.omit({ search: true }).optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
export type CreateListingData = z.infer<typeof createListingSchema>;
export type UpdateListingData = z.infer<typeof updateListingSchema>;
export type ListingFilters = z.infer<typeof listingFiltersSchema>;
export type SearchData = z.infer<typeof searchSchema>;
