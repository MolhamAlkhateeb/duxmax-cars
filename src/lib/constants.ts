// Car makes available in UAE market
export const CAR_MAKES = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Toyota', 'Honda', 'Nissan', 'Hyundai',
  'Kia', 'Volkswagen', 'Ford', 'Chevrolet', 'Lexus', 'Infiniti', 'Mazda',
  'Mitsubishi', 'Subaru', 'Jeep', 'Land Rover', 'Range Rover', 'Porsche',
  'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'McLaren',
  'Aston Martin', 'Jaguar', 'Volvo', 'Peugeot', 'Renault', 'Citroën',
  'Skoda', 'SEAT', 'Fiat', 'Alfa Romeo', 'Mini', 'Smart', 'Tesla',
  'Genesis', 'Acura', 'Cadillac', 'Lincoln', 'Buick', 'GMC', 'Dodge',
  'Ram', 'Chrysler', 'Suzuki', 'Isuzu', 'Daihatsu', 'Geely', 'BYD',
  'Chery', 'JAC', 'Haval', 'MG', 'Mahindra', 'Tata'
] as const;

// UAE Emirates
export const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain'
] as const;

// Common cities in UAE
export const CITIES = {
  'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Madinat Zayed', 'Ruwais'],
  'Dubai': ['Dubai City', 'Deira', 'Bur Dubai', 'Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay'],
  'Sharjah': ['Sharjah City', 'Kalba', 'Khor Fakkan', 'Dibba Al-Hisn'],
  'Ajman': ['Ajman City', 'Manama', 'Masfout'],
  'Ras Al Khaimah': ['Ras Al Khaimah City', 'Digdaga', 'Al Hamra'],
  'Fujairah': ['Fujairah City', 'Dibba Al-Fujairah', 'Kalba'],
  'Umm Al Quwain': ['Umm Al Quwain City', 'Falaj Al Mualla']
} as const;

// Fuel types
export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Hybrid',
  'Electric',
  'LPG',
  'CNG'
] as const;

// Transmission types
export const TRANSMISSION_TYPES = [
  'Automatic',
  'Manual',
  'CVT',
  'Semi-Automatic'
] as const;

// Body types
export const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Wagon',
  'Pickup',
  'Van',
  'Crossover',
  'Roadster',
  'Limousine'
] as const;

// Car colors
export const COLORS = [
  'White',
  'Black',
  'Silver',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Brown',
  'Gold',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Beige',
  'Maroon'
] as const;

// Car conditions
export const CONDITIONS = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
] as const;

// Common car features
export const CAR_FEATURES = [
  // Safety
  'ABS',
  'Airbags',
  'Electronic Stability Control',
  'Traction Control',
  'Parking Sensors',
  'Rear Camera',
  '360 Camera',
  'Blind Spot Monitoring',
  'Lane Departure Warning',
  'Adaptive Cruise Control',
  
  // Comfort
  'Air Conditioning',
  'Climate Control',
  'Heated Seats',
  'Ventilated Seats',
  'Memory Seats',
  'Power Seats',
  'Leather Seats',
  'Sunroof',
  'Panoramic Roof',
  'Keyless Entry',
  'Push Start',
  
  // Technology
  'Navigation System',
  'Bluetooth',
  'USB Ports',
  'Wireless Charging',
  'Apple CarPlay',
  'Android Auto',
  'Premium Sound System',
  'Digital Dashboard',
  'Head-up Display',
  
  // Performance
  'Turbo Engine',
  'All-Wheel Drive',
  'Sport Mode',
  'Paddle Shifters',
  'Limited Slip Differential',
  
  // Exterior
  'Alloy Wheels',
  'LED Headlights',
  'Xenon Headlights',
  'Fog Lights',
  'Roof Rails',
  'Tinted Windows',
  'Chrome Exterior'
] as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under 50K', min: 0, max: 50000 },
  { label: '50K - 100K', min: 50000, max: 100000 },
  { label: '100K - 200K', min: 100000, max: 200000 },
  { label: '200K - 500K', min: 200000, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: 'Above 1M', min: 1000000, max: Infinity }
] as const;

// Year ranges
export const YEAR_RANGES = [
  { label: 'Last 2 years', min: new Date().getFullYear() - 2, max: new Date().getFullYear() },
  { label: 'Last 5 years', min: new Date().getFullYear() - 5, max: new Date().getFullYear() },
  { label: '2015 - 2020', min: 2015, max: 2020 },
  { label: '2010 - 2015', min: 2010, max: 2015 },
  { label: 'Before 2010', min: 1990, max: 2010 }
] as const;

// Mileage ranges
export const MILEAGE_RANGES = [
  { label: 'Under 50K km', min: 0, max: 50000 },
  { label: '50K - 100K km', min: 50000, max: 100000 },
  { label: '100K - 150K km', min: 100000, max: 150000 },
  { label: '150K - 200K km', min: 150000, max: 200000 },
  { label: 'Above 200K km', min: 200000, max: Infinity }
] as const;

// Dealer subscription tiers
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    price: 299,
    duration: 30, // days
    features: [
      'Up to 10 listings',
      'Basic analytics',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    price: 799,
    duration: 30,
    features: [
      'Up to 50 listings',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      'Multiple photos'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 1999,
    duration: 30,
    features: [
      'Unlimited listings',
      'Full analytics suite',
      'Dedicated support',
      'Premium placement',
      'API access',
      'Custom branding'
    ]
  }
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const;

// Image upload constraints
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 20,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: { width: 400, height: 300 },
  LARGE_SIZE: { width: 1200, height: 800 }
} as const;

// API endpoints
export const API_ENDPOINTS = {
  LISTINGS: '/api/listings',
  USERS: '/api/users',
  MESSAGES: '/api/messages',
  UPLOAD: '/api/upload',
  SEARCH: '/api/search'
} as const;
