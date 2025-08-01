import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcryptjs';
import {
  users,
  accounts,
  listings,
  messages,
  dealerSubscriptions,
  type NewUser,
  type NewListing,
  type NewMessage,
  type NewDealerSubscription,
} from '../src/db/schema';
import { createDatabaseIfNotExists } from '../src/db';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/duxmax';
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create database if it doesn't exist
    await createDatabaseIfNotExists();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(messages);
    await db.delete(listings);
    await db.delete(dealerSubscriptions);
    await db.delete(accounts);
    await db.delete(users);

    // Seed Users (Individual buyers and dealers)
    console.log('👥 Seeding users...');
    const seedUsers: NewUser[] = [
      // Individual users
      {
        email: 'ahmed.hassan@gmail.com',
        name: 'Ahmed Hassan',
        phone: '+971501234567',
        role: 'individual',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
      },
      {
        email: 'fatima.ali@gmail.com',
        name: 'Fatima Al-Zahra',
        phone: '+971502345678',
        role: 'individual',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
      },
      {
        email: 'mohammed.salem@gmail.com',
        name: 'Mohammed Salem',
        phone: '+971503456789',
        role: 'individual',
        emailVerified: false,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed',
      },
      {
        email: 'sarah.khalil@gmail.com',
        name: 'Sarah Khalil',
        phone: '+971504567890',
        role: 'individual',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
      
      // Dealer users
      {
        email: 'admin@premiumauto.ae',
        name: 'Premium Auto Emirates',
        phone: '+971441234567',
        role: 'dealer',
        emailVerified: true,
        isDealerVerified: true,
        image: 'https://api.dicebear.com/7.x/initials/svg?seed=Premium%20Auto',
      },
      {
        email: 'sales@gulfmotors.ae',
        name: 'Gulf Motors Trading',
        phone: '+971449876543',
        role: 'dealer',
        emailVerified: true,
        isDealerVerified: true,
        image: 'https://api.dicebear.com/7.x/initials/svg?seed=Gulf%20Motors',
      },
      {
        email: 'contact@capitalcars.ae',
        name: 'Capital Car Center',
        phone: '+971255550123',
        role: 'dealer',
        emailVerified: true,
        isDealerVerified: true,
        image: 'https://api.dicebear.com/7.x/initials/svg?seed=Capital%20Cars',
      },
      {
        email: 'info@emirates-luxury.ae',
        name: 'Emirates Luxury Cars',
        phone: '+971443334444',
        role: 'dealer',
        emailVerified: true,
        isDealerVerified: true,
        image: 'https://api.dicebear.com/7.x/initials/svg?seed=Emirates%20Luxury',
      },
      {
        email: 'sales@sharjah-motors.ae',
        name: 'Sharjah Motors',
        phone: '+971665556666',
        role: 'dealer',
        emailVerified: false,
        isDealerVerified: false,
        image: 'https://api.dicebear.com/7.x/initials/svg?seed=Sharjah%20Motors',
      },
    ];

    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create accounts for password-based auth
    console.log('🔐 Creating user accounts...');
    const userAccounts = await Promise.all(
      insertedUsers.map(async (user) => ({
        userId: user.id,
        accountId: user.email,
        providerId: 'credential',
        password: await hash(user.role === 'dealer' ? 'dealer123' : 'password123', 12),
      }))
    );

    await db.insert(accounts).values(userAccounts);
    console.log(`✅ Created ${userAccounts.length} user accounts`);

    // Get dealer users for subscriptions
    const dealerUsers = insertedUsers.filter(user => user.role === 'dealer');

    // Seed Dealer Subscriptions
    console.log('💳 Seeding dealer subscriptions...');
    const tiers: ('basic' | 'premium' | 'enterprise')[] = ['basic', 'premium', 'enterprise'];
    const seedSubscriptions: NewDealerSubscription[] = dealerUsers.map((dealer, index) => ({
      userId: dealer.id,
      tier: tiers[index % 3],
      isActive: dealer.isDealerVerified || false,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in last year
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // One year from now
      autoRenew: true,
    }));

    const insertedSubscriptions = await db.insert(dealerSubscriptions).values(seedSubscriptions).returning();
    console.log(`✅ Created ${insertedSubscriptions.length} dealer subscriptions`);

    // Seed Car Listings
    console.log('🚗 Seeding car listings...');
    const carBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Ford', 'Hyundai', 'Lexus', 'Porsche'];
    const carModels: Record<string, string[]> = {
      'Toyota': ['Camry', 'Corolla', 'Land Cruiser', 'Prado', 'Hilux', 'RAV4'],
      'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X6', '7 Series'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'G-Class'],
      'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'Q8'],
      'Nissan': ['Altima', 'Patrol', 'X-Trail', 'Pathfinder', 'Maxima', 'Sentra'],
      'Ford': ['Explorer', 'F-150', 'Mustang', 'Edge', 'Expedition', 'Focus'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Genesis', 'Accent'],
      'Lexus': ['ES', 'LS', 'RX', 'LX', 'GX', 'IS'],
      'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', '718', 'Taycan'],
    };

    const colors = ['White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Brown', 'Green', 'Gold', 'Beige'];
    const fuelTypes = ['Gasoline', 'Hybrid', 'Electric', 'Diesel'];
    const transmissions = ['Automatic', 'Manual', 'CVT'];
    const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
    const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Wagon'];
    const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

    const seedListings: NewListing[] = [];

    // Create listings for each user (both individuals and dealers)
    for (let i = 0; i < 100; i++) {
      const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
      const model = carModels[brand][Math.floor(Math.random() * carModels[brand].length)];
      const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
      const mileage = Math.floor(Math.random() * 200000) + 5000;
      const basePrice = brand === 'Porsche' || brand === 'BMW' || brand === 'Mercedes-Benz' || brand === 'Audi' || brand === 'Lexus' 
        ? 80000 + Math.floor(Math.random() * 300000)
        : 25000 + Math.floor(Math.random() * 150000);

      const emirate = emirates[Math.floor(Math.random() * emirates.length)];

      seedListings.push({
        userId: user.id,
        title: `${year} ${brand} ${model}`,
        description: `Well-maintained ${year} ${brand} ${model} in excellent condition. This vehicle has been regularly serviced and comes with full service history. Perfect for ${brand === 'Toyota' || brand === 'Honda' || brand === 'Nissan' ? 'families and daily commuting' : 'luxury driving experience'}. ${user.role === 'dealer' ? 'Dealer warranty included.' : 'Single owner, garage kept.'}`,
        make: brand,
        model,
        year,
        price: basePrice.toString(),
        currency: 'AED',
        mileage,
        color: colors[Math.floor(Math.random() * colors.length)],
        fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
        transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
        bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        features: [
          'Air Conditioning',
          'Power Steering',
          'ABS',
          'Airbags',
          ...(Math.random() > 0.5 ? ['Sunroof', 'Leather Seats'] : []),
          ...(Math.random() > 0.7 ? ['Navigation System', 'Bluetooth'] : []),
          ...(basePrice > 100000 ? ['Premium Sound System', 'Parking Sensors'] : []),
        ],
        images: [
          `https://api.lorem.space/image/car?w=800&h=600&hash=${i}1`,
          `https://api.lorem.space/image/car?w=800&h=600&hash=${i}2`,
          `https://api.lorem.space/image/car?w=800&h=600&hash=${i}3`,
        ],
        emirate,
        city: emirate === 'Dubai' ? 'Dubai' : emirate === 'Abu Dhabi' ? 'Abu Dhabi' : emirate,
        area: `${emirate} Area ${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.1 ? 'active' : 'draft', // 90% active
        publishedAt: Math.random() > 0.9 ? null : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Some published
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        accidentHistory: Math.random() > 0.8, // 20% have accident history
        doors: Math.floor(Math.random() * 3) + 2, // 2-4 doors
        cylinders: Math.floor(Math.random() * 6) + 4, // 4-8 cylinders
        horsepower: Math.floor(Math.random() * 400) + 100, // 100-500 HP
      });
    }

    const insertedListings = await db.insert(listings).values(seedListings).returning();
    console.log(`✅ Created ${insertedListings.length} car listings`);

    // Seed Messages (sample conversations between buyers and sellers)
    console.log('💬 Seeding messages...');
    const seedMessages: NewMessage[] = [];
    
    // Create some sample conversations
    for (let i = 0; i < 50; i++) {
      const listing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const buyer = insertedUsers.find(u => u.id !== listing.userId && u.role === 'individual');
      
      if (buyer) {
        // Initial inquiry
        seedMessages.push({
          fromUserId: buyer.id,
          toUserId: listing.userId,
          listingId: listing.id,
          content: `Hi, I'm interested in your ${listing.title}. Is it still available? Can we arrange a viewing?`,
          isRead: Math.random() > 0.3,
        });

        // Response from seller (sometimes)
        if (Math.random() > 0.4) {
          seedMessages.push({
            fromUserId: listing.userId,
            toUserId: buyer.id,
            listingId: listing.id,
            content: `Hello! Yes, the car is still available. You can view it anytime. Please let me know when you'd like to schedule a viewing. The car is in excellent condition and has been well maintained.`,
            isRead: Math.random() > 0.2,
          });

          // Follow-up from buyer (sometimes)
          if (Math.random() > 0.6) {
            seedMessages.push({
              fromUserId: buyer.id,
              toUserId: listing.userId,
              listingId: listing.id,
              content: `Great! Would tomorrow afternoon work for a viewing? Also, is there any room for negotiation on the price?`,
              isRead: Math.random() > 0.5,
            });
          }
        }
      }
    }

    const insertedMessages = await db.insert(messages).values(seedMessages).returning();
    console.log(`✅ Created ${insertedMessages.length} messages`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${insertedUsers.length}`);
    console.log(`   🏢 Dealers: ${dealerUsers.length}`);
    console.log(`   💳 Subscriptions: ${insertedSubscriptions.length}`);
    console.log(`   🚗 Listings: ${insertedListings.length}`);
    console.log(`   💬 Messages: ${insertedMessages.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('   Individual: ahmed.hassan@gmail.com / password123');
    console.log('   Dealer: admin@premiumauto.ae / dealer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };
