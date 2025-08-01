import { db } from '../index';
import { users, listings } from '../schema';
import { eq, and, sql } from 'drizzle-orm';

export class StatsRepository {
  // Get platform-wide statistics
  async getPlatformStats() {
    // Get total active listings count
    const listingsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.status, 'active'));

    // Get total verified dealers count
    const dealersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        and(
          eq(users.role, 'dealer'),
          eq(users.isDealerVerified, true)
        )
      );

    // Get total users count
    const usersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return {
      totalListings: listingsResult[0]?.count || 0,
      totalDealers: dealersResult[0]?.count || 0,
      totalUsers: usersResult[0]?.count || 0,
    };
  }
}
