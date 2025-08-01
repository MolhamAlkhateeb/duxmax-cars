import { eq, ilike, and, desc, asc, sql } from 'drizzle-orm';
import type { Database } from '../index';
import { listings, users, type Listing, type NewListing } from '../schema';

export interface ListingFilters {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  emirate?: string;
  city?: string;
  condition?: string;
  search?: string;
}

export interface ListingSort {
  field: 'price' | 'year' | 'mileage' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ListingWithUser extends Listing {
  user: {
    id: string;
    name: string | null;
    role: 'individual' | 'dealer';
    isDealerVerified: boolean | null;
  };
}

export class ListingsRepository {
  constructor(private readonly db: Database) {}

  // Get listings for a specific user (data-level auth)
  async getListingsForUser(userId: string): Promise<Listing[]> {
    return this.db.query.listings.findMany({
      where: eq(listings.userId, userId),
      orderBy: desc(listings.createdAt),
    });
  }

  // Get a single listing by ID with ownership check
  async getListingByIdForUser(
    listingId: string,
    userId: string,
  ): Promise<Listing | null> {
    const listing = await this.db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.userId, userId)),
    });
    return listing || null;
  }

  // Get public listing by ID (for viewing)
  async getPublicListingById(listingId: string): Promise<ListingWithUser | null> {
    const result = await this.db
      .select({
        id: listings.id,
        userId: listings.userId,
        title: listings.title,
        description: listings.description,
        price: listings.price,
        currency: listings.currency,
        status: listings.status,
        make: listings.make,
        model: listings.model,
        year: listings.year,
        mileage: listings.mileage,
        fuelType: listings.fuelType,
        transmission: listings.transmission,
        bodyType: listings.bodyType,
        color: listings.color,
        doors: listings.doors,
        cylinders: listings.cylinders,
        horsepower: listings.horsepower,
        emirate: listings.emirate,
        city: listings.city,
        area: listings.area,
        features: listings.features,
        condition: listings.condition,
        accidentHistory: listings.accidentHistory,
        serviceHistory: listings.serviceHistory,
        images: listings.images,
        videos: listings.videos,
        slug: listings.slug,
        metaTitle: listings.metaTitle,
        metaDescription: listings.metaDescription,
        publishedAt: listings.publishedAt,
        expiresAt: listings.expiresAt,
        createdAt: listings.createdAt,
        updatedAt: listings.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          role: users.role,
          isDealerVerified: users.isDealerVerified,
        },
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .where(and(eq(listings.id, listingId), eq(listings.status, 'active')))
      .limit(1);

    return result[0] || null;
  }

  // Search listings with advanced filtering
  async searchListings(
    filters: ListingFilters = {},
    sort: ListingSort = { field: 'createdAt', order: 'desc' },
    page = 1,
    limit = 20,
  ): Promise<{ listings: Listing[]; total: number }> {
    const offset = (page - 1) * limit;
    const conditions = [eq(listings.status, 'active')];

    // Apply filters
    if (filters.make) {
      conditions.push(ilike(listings.make, `%${filters.make}%`));
    }
    if (filters.model) {
      conditions.push(ilike(listings.model, `%${filters.model}%`));
    }
    if (filters.yearFrom) {
      conditions.push(sql`${listings.year} >= ${filters.yearFrom}`);
    }
    if (filters.yearTo) {
      conditions.push(sql`${listings.year} <= ${filters.yearTo}`);
    }
    if (filters.priceFrom) {
      conditions.push(sql`${listings.price} >= ${filters.priceFrom}`);
    }
    if (filters.priceTo) {
      conditions.push(sql`${listings.price} <= ${filters.priceTo}`);
    }
    if (filters.mileageFrom) {
      conditions.push(sql`${listings.mileage} >= ${filters.mileageFrom}`);
    }
    if (filters.mileageTo) {
      conditions.push(sql`${listings.mileage} <= ${filters.mileageTo}`);
    }
    if (filters.fuelType) {
      conditions.push(eq(listings.fuelType, filters.fuelType));
    }
    if (filters.transmission) {
      conditions.push(eq(listings.transmission, filters.transmission));
    }
    if (filters.bodyType) {
      conditions.push(eq(listings.bodyType, filters.bodyType));
    }
    if (filters.emirate) {
      conditions.push(eq(listings.emirate, filters.emirate));
    }
    if (filters.city) {
      conditions.push(eq(listings.city, filters.city));
    }
    if (filters.condition) {
      conditions.push(eq(listings.condition, filters.condition));
    }
    if (filters.search) {
      conditions.push(
        sql`(${listings.title} ILIKE ${`%${filters.search}%`} OR ${listings.description} ILIKE ${`%${filters.search}%`} OR ${listings.make} ILIKE ${`%${filters.search}%`} OR ${listings.model} ILIKE ${`%${filters.search}%`})`,
      );
    }

    // Build order by clause
    const orderBy =
      sort.order === 'desc'
        ? desc(listings[sort.field])
        : asc(listings[sort.field]);

    // Get listings
    const listingsResult = await this.db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(...conditions));

    return {
      listings: listingsResult,
      total: totalResult[0]?.count || 0,
    };
  }

  // Create new listing
  async createListing(
    listingData: NewListing,
    userId: string,
  ): Promise<Listing> {
    const [listing] = await this.db
      .insert(listings)
      .values({
        ...listingData,
        userId,
      })
      .returning();

    if (!listing) {
      throw new Error('Failed to create listing');
    }

    return listing;
  }

  // Update listing (with ownership check)
  async updateListing(
    listingId: string,
    userId: string,
    updates: Partial<NewListing>,
  ): Promise<Listing | null> {
    const [listing] = await this.db
      .update(listings)
      .set({
        ...updates,
        updatedAt: sql`now()`,
      })
      .where(and(eq(listings.id, listingId), eq(listings.userId, userId)))
      .returning();

    return listing || null;
  }

  // Delete listing (with ownership check)
  async deleteListing(listingId: string, userId: string): Promise<boolean> {
    const [result] = await this.db
      .delete(listings)
      .where(and(eq(listings.id, listingId), eq(listings.userId, userId)))
      .returning({ id: listings.id });

    return !!result;
  }

  // Get featured listings
  async getFeaturedListings(limit = 10): Promise<Listing[]> {
    return this.db
      .select()
      .from(listings)
      .where(eq(listings.status, 'active'))
      .orderBy(desc(listings.createdAt))
      .limit(limit);
  }

  // Get similar listings
  async getSimilarListings(
    listingId: string,
    make: string,
    model: string,
    limit = 5,
  ): Promise<Listing[]> {
    return this.db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.status, 'active'),
          sql`${listings.id} != ${listingId}`,
          eq(listings.make, make),
          ilike(listings.model, `%${model}%`),
        ),
      )
      .orderBy(desc(listings.createdAt))
      .limit(limit);
  }

  // Get listings by dealer
  async getListingsByDealer(dealerId: string, limit = 20): Promise<Listing[]> {
    const result = await this.db
      .select({
        id: listings.id,
        userId: listings.userId,
        title: listings.title,
        description: listings.description,
        price: listings.price,
        currency: listings.currency,
        status: listings.status,
        make: listings.make,
        model: listings.model,
        year: listings.year,
        mileage: listings.mileage,
        fuelType: listings.fuelType,
        transmission: listings.transmission,
        bodyType: listings.bodyType,
        color: listings.color,
        doors: listings.doors,
        cylinders: listings.cylinders,
        horsepower: listings.horsepower,
        emirate: listings.emirate,
        city: listings.city,
        area: listings.area,
        features: listings.features,
        condition: listings.condition,
        accidentHistory: listings.accidentHistory,
        serviceHistory: listings.serviceHistory,
        images: listings.images,
        videos: listings.videos,
        slug: listings.slug,
        metaTitle: listings.metaTitle,
        metaDescription: listings.metaDescription,
        publishedAt: listings.publishedAt,
        expiresAt: listings.expiresAt,
        createdAt: listings.createdAt,
        updatedAt: listings.updatedAt,
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .where(
        and(
          eq(listings.status, 'active'),
          eq(users.id, dealerId),
          eq(users.role, 'dealer'),
          eq(users.isDealerVerified, true),
        ),
      )
      .orderBy(desc(listings.createdAt))
      .limit(limit);

    return result;
  }

  // Get filter options for dropdowns
  async getFilterOptions(): Promise<{
    makes: string[];
    fuelTypes: string[];
    transmissions: string[];
    bodyTypes: string[];
    emirates: string[];
    conditions: string[];
    yearRange: { min: number; max: number };
    priceRange: { min: number; max: number };
  }> {
    // Get unique makes
    const makesResult = await this.db
      .selectDistinct({ make: listings.make })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.make} IS NOT NULL AND ${listings.make} != ''`))
      .orderBy(asc(listings.make));

    // Get unique fuel types
    const fuelTypesResult = await this.db
      .selectDistinct({ fuelType: listings.fuelType })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.fuelType} IS NOT NULL AND ${listings.fuelType} != ''`))
      .orderBy(asc(listings.fuelType));

    // Get unique transmissions
    const transmissionsResult = await this.db
      .selectDistinct({ transmission: listings.transmission })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.transmission} IS NOT NULL AND ${listings.transmission} != ''`))
      .orderBy(asc(listings.transmission));

    // Get unique body types
    const bodyTypesResult = await this.db
      .selectDistinct({ bodyType: listings.bodyType })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.bodyType} IS NOT NULL AND ${listings.bodyType} != ''`))
      .orderBy(asc(listings.bodyType));

    // Get unique emirates
    const emiratesResult = await this.db
      .selectDistinct({ emirate: listings.emirate })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.emirate} IS NOT NULL AND ${listings.emirate} != ''`))
      .orderBy(asc(listings.emirate));

    // Get unique conditions
    const conditionsResult = await this.db
      .selectDistinct({ condition: listings.condition })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.condition} IS NOT NULL AND ${listings.condition} != ''`))
      .orderBy(asc(listings.condition));

    // Get year range
    const yearRangeResult = await this.db
      .select({
        minYear: sql<number>`MIN(${listings.year})`,
        maxYear: sql<number>`MAX(${listings.year})`,
      })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.year} IS NOT NULL`));

    // Get price range
    const priceRangeResult = await this.db
      .select({
        minPrice: sql<number>`MIN(CAST(${listings.price} AS NUMERIC))`,
        maxPrice: sql<number>`MAX(CAST(${listings.price} AS NUMERIC))`,
      })
      .from(listings)
      .where(and(eq(listings.status, 'active'), sql`${listings.price} IS NOT NULL`));

    return {
      makes: makesResult.map(r => r.make).filter((make): make is string => Boolean(make)),
      fuelTypes: fuelTypesResult.map(r => r.fuelType).filter((fuelType): fuelType is string => Boolean(fuelType)),
      transmissions: transmissionsResult.map(r => r.transmission).filter((transmission): transmission is string => Boolean(transmission)),
      bodyTypes: bodyTypesResult.map(r => r.bodyType).filter((bodyType): bodyType is string => Boolean(bodyType)),
      emirates: emiratesResult.map(r => r.emirate).filter((emirate): emirate is string => Boolean(emirate)),
      conditions: conditionsResult.map(r => r.condition).filter((condition): condition is string => Boolean(condition)),
      yearRange: {
        min: yearRangeResult[0]?.minYear || 2000,
        max: yearRangeResult[0]?.maxYear || new Date().getFullYear(),
      },
      priceRange: {
        min: Math.floor(priceRangeResult[0]?.minPrice || 0),
        max: Math.ceil(priceRangeResult[0]?.maxPrice || 1000000),
      },
    };
  }

  // Get models for a specific make
  async getModelsForMake(make: string): Promise<string[]> {
    const modelsResult = await this.db
      .selectDistinct({ model: listings.model })
      .from(listings)
      .where(
        and(
          eq(listings.status, 'active'),
          eq(listings.make, make),
          sql`${listings.model} IS NOT NULL AND ${listings.model} != ''`
        )
      )
      .orderBy(asc(listings.model));

    return modelsResult.map(r => r.model).filter((model): model is string => Boolean(model));
  }
}
