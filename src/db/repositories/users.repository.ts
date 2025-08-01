import { eq, and, desc } from 'drizzle-orm';
import type { Database } from '../index';
import {
  users,
  dealerSubscriptions,
  type User,
  type NewUser,
  type DealerSubscription,
  type NewDealerSubscription,
} from '../schema';

export class UsersRepository {
  constructor(private readonly db: Database) {}

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user || null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user || null;
  }

  // Create new user
  async createUser(userData: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(userData).returning();

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  // Update user
  async updateUser(userId: string, updates: Partial<NewUser>): Promise<User | null> {
    const [user] = await this.db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user || null;
  }

  // Get user with dealer subscription
  async getUserWithSubscription(userId: string): Promise<
    (User & { subscription?: DealerSubscription }) | null
  > {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        dealerSubscriptions: {
          where: eq(dealerSubscriptions.isActive, true),
          orderBy: desc(dealerSubscriptions.createdAt),
          limit: 1,
        },
      },
    });

    if (!result) return null;

    return {
      ...result,
      subscription: result.dealerSubscriptions?.[0] || undefined,
    };
  }

  // Check if user is verified dealer
  async isVerifiedDealer(userId: string): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: and(
        eq(users.id, userId),
        eq(users.role, 'dealer'),
        eq(users.isDealerVerified, true)
      ),
    });

    return !!user;
  }

  // Verify dealer
  async verifyDealer(userId: string): Promise<User | null> {
    const [user] = await this.db
      .update(users)
      .set({
        isDealerVerified: true,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), eq(users.role, 'dealer')))
      .returning();

    return user || null;
  }
}

export class DealerSubscriptionsRepository {
  constructor(private readonly db: Database) {}

  // Create dealer subscription
  async createSubscription(
    subscriptionData: NewDealerSubscription
  ): Promise<DealerSubscription> {
    const [subscription] = await this.db
      .insert(dealerSubscriptions)
      .values(subscriptionData)
      .returning();

    if (!subscription) {
      throw new Error('Failed to create subscription');
    }

    return subscription;
  }

  // Get active subscription for user
  async getActiveSubscription(userId: string): Promise<DealerSubscription | null> {
    const subscription = await this.db.query.dealerSubscriptions.findFirst({
      where: and(
        eq(dealerSubscriptions.userId, userId),
        eq(dealerSubscriptions.isActive, true)
      ),
      orderBy: desc(dealerSubscriptions.createdAt),
    });

    return subscription || null;
  }

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    updates: Partial<NewDealerSubscription>
  ): Promise<DealerSubscription | null> {
    const [subscription] = await this.db
      .update(dealerSubscriptions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(dealerSubscriptions.id, subscriptionId))
      .returning();

    return subscription || null;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const [result] = await this.db
      .update(dealerSubscriptions)
      .set({
        isActive: false,
        autoRenew: false,
        updatedAt: new Date(),
      })
      .where(eq(dealerSubscriptions.id, subscriptionId))
      .returning({ id: dealerSubscriptions.id });

    return !!result;
  }

  // Check if subscription is expired
  async isSubscriptionExpired(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    
    if (!subscription) return true;
    
    return new Date() > subscription.expiresAt;
  }
}
