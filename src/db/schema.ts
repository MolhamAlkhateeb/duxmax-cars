import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  numeric,
  pgEnum,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['individual', 'dealer']);
export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'basic',
  'premium',
  'enterprise',
]);
export const listingStatusEnum = pgEnum('listing_status', [
  'draft',
  'active',
  'sold',
  'suspended',
]);
export const messageStatusEnum = pgEnum('message_status', [
  'sent',
  'delivered',
  'read',
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: boolean('email_verified').default(false),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').notNull().default('individual'),
  isDealerVerified: boolean('is_dealer_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth accounts table
export const accounts = pgTable('accounts', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at'),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth sessions table
export const sessions = pgTable('sessions', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Better Auth verification tokens table
export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Dealer subscriptions table
export const dealerSubscriptions = pgTable('dealer_subscriptions', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  tier: subscriptionTierEnum('tier').notNull().default('basic'),
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  autoRenew: boolean('auto_renew').default(false),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Car listings table
export const listings = pgTable('listings', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  
  // Basic info
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('AED'),
  status: listingStatusEnum('status').default('draft'),
  
  // Car details
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  mileage: integer('mileage'),
  fuelType: varchar('fuel_type', { length: 50 }),
  transmission: varchar('transmission', { length: 50 }),
  bodyType: varchar('body_type', { length: 50 }),
  color: varchar('color', { length: 50 }),
  doors: integer('doors'),
  cylinders: integer('cylinders'),
  horsepower: integer('horsepower'),
  
  // Location
  emirate: varchar('emirate', { length: 100 }),
  city: varchar('city', { length: 100 }),
  area: varchar('area', { length: 100 }),
  
  // Features and condition
  features: jsonb('features'), // Array of features
  condition: varchar('condition', { length: 50 }),
  accidentHistory: boolean('accident_history'),
  serviceHistory: jsonb('service_history'),
  
  // Media
  images: jsonb('images'), // Array of image URLs
  videos: jsonb('videos'), // Array of video URLs
  
  // SEO and meta
  slug: varchar('slug', { length: 255 }).unique(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Messages table for real-time messaging
export const messages = pgTable('messages', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  listingId: uuid('listing_id')
    .references(() => listings.id, { onDelete: 'cascade' })
    .notNull(),
  fromUserId: uuid('from_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  toUserId: uuid('to_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  status: messageStatusEnum('status').default('sent'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Conversations table to group messages
export const conversations = pgTable('conversations', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  listingId: uuid('listing_id')
    .references(() => listings.id, { onDelete: 'cascade' })
    .notNull(),
  buyerUserId: uuid('buyer_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sellerUserId: uuid('seller_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  lastMessageAt: timestamp('last_message_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Favorites/Wishlist table
export const favorites = pgTable('favorites', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  listingId: uuid('listing_id')
    .references(() => listings.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Search history table
export const searchHistory = pgTable('search_history', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  query: varchar('query', { length: 500 }).notNull(),
  filters: jsonb('filters'),
  resultCount: integer('result_count'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Analytics table for tracking
export const analytics = pgTable('analytics', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  listingId: uuid('listing_id')
    .references(() => listings.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  eventType: varchar('event_type', { length: 50 }).notNull(), // view, contact, favorite
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export all tables for use in queries
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type DealerSubscription = typeof dealerSubscriptions.$inferSelect;
export type NewDealerSubscription = typeof dealerSubscriptions.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
