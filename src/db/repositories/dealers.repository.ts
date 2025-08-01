import { db } from '../index';
import { users, dealerSubscriptions } from '../schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export class DealersRepository {
  // Get all verified dealers with their subscription info
  async getVerifiedDealers() {
    const dealers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        isDealerVerified: users.isDealerVerified,
        createdAt: users.createdAt,
        subscription: {
          tier: dealerSubscriptions.tier,
          isActive: dealerSubscriptions.isActive,
          expiresAt: dealerSubscriptions.expiresAt,
        }
      })
      .from(users)
      .leftJoin(
        dealerSubscriptions,
        and(
          eq(dealerSubscriptions.userId, users.id),
          eq(dealerSubscriptions.isActive, true)
        )
      )
      .where(
        and(
          eq(users.role, 'dealer'),
          eq(users.isDealerVerified, true)
        )
      )
      .orderBy(desc(users.createdAt));

    return dealers;
  }

  // Get a specific dealer by ID
  async getDealerById(dealerId: string) {
    const dealer = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        isDealerVerified: users.isDealerVerified,
        createdAt: users.createdAt,
        subscription: {
          tier: dealerSubscriptions.tier,
          isActive: dealerSubscriptions.isActive,
          expiresAt: dealerSubscriptions.expiresAt,
          startDate: dealerSubscriptions.startDate,
        }
      })
      .from(users)
      .leftJoin(
        dealerSubscriptions,
        and(
          eq(dealerSubscriptions.userId, users.id),
          eq(dealerSubscriptions.isActive, true)
        )
      )
      .where(
        and(
          eq(users.id, dealerId),
          eq(users.role, 'dealer'),
          eq(users.isDealerVerified, true)
        )
      )
      .limit(1);

    return dealer[0] || null;
  }

  // Get dealer stats (could be expanded with actual listing counts)
  async getDealerStats() {
    // Get actual count of verified dealers
    const dealersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        and(
          eq(users.role, 'dealer'),
          eq(users.isDealerVerified, true)
        )
      );

    return {
      totalDealers: dealersResult[0]?.count || 0,
      totalCars: 5000, // TODO: Replace with actual count from listings
      averageRating: 4.7, // TODO: Replace with actual average from reviews
    };
  }
}
