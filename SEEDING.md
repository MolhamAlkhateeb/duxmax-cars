# Database Seeding

This document explains how to seed the DuxMax database with sample data.

## Prerequisites

1. Make sure your PostgreSQL database is running
2. Ensure your `.env.local` file has the correct `DATABASE_URL`
3. Run database migrations: `bun run db:push`

## Seeding the Database

### Option 1: Using npm script (Recommended)
```bash
bun run db:seed
```

### Option 2: Direct execution
```bash
bun run seed.ts
```

## What Gets Seeded

The seed script will populate your database with:

### 👥 **Users (9 total)**
- **4 Individual Users:**
  - Ahmed Hassan (ahmed.hassan@gmail.com)
  - Fatima Al-Zahra (fatima.ali@gmail.com) 
  - Mohammed Salem (mohammed.salem@gmail.com)
  - Sarah Khalil (sarah.khalil@gmail.com)

- **5 Dealer Users:**
  - Premium Auto Emirates (admin@premiumauto.ae)
  - Gulf Motors Trading (sales@gulfmotors.ae)
  - Capital Car Center (contact@capitalcars.ae)
  - Emirates Luxury Cars (info@emirates-luxury.ae)
  - Sharjah Motors (sales@sharjah-motors.ae)

### 🔐 **Authentication Accounts**
- Password-based accounts for all users
- Individual users: password = `password123`
- Dealer users: password = `dealer123`

### 💳 **Dealer Subscriptions**
- Basic, Premium, and Enterprise tier subscriptions
- Active subscriptions for verified dealers
- Auto-renewal enabled

### 🚗 **Car Listings (100 total)**
- Mix of cars from individuals and dealers
- 10 popular brands: Toyota, Honda, BMW, Mercedes-Benz, Audi, Nissan, Ford, Hyundai, Lexus, Porsche
- Realistic pricing based on brand (luxury vs economy)
- Various conditions, mileage, and features
- Distributed across all UAE emirates
- 90% active listings, 10% drafts

### 💬 **Messages (50+ conversations)**
- Sample conversations between buyers and sellers
- Realistic inquiry and response patterns
- Various read/unread states

## Test Accounts

After seeding, you can log in with these accounts:

### Individual Users
- **Email:** ahmed.hassan@gmail.com
- **Password:** password123

### Dealer Users  
- **Email:** admin@premiumauto.ae
- **Password:** dealer123

## Database Reset

The seed script will **clear all existing data** before inserting new records. This includes:
- All messages
- All listings  
- All dealer subscriptions
- All accounts
- All users

⚠️ **Warning:** Only run this on development databases. Never run on production data.

## Customization

To modify the seed data:
1. Edit `seed.ts`
2. Adjust the arrays for brands, models, locations, etc.
3. Change the number of generated listings by modifying the loop counter
4. Add or remove test users as needed

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check database credentials

### Schema Issues
- Run `bun run db:push` to ensure schema is up to date
- Verify all tables exist in your database

### Permission Issues
- Ensure the database user has CREATE, INSERT, DELETE permissions
- Check if the database exists

## Next Steps

After seeding:
1. Start the development server: `bun run dev`
2. Visit the dealers page: `/en/dealers`
3. Browse listings: `/en/listings`
4. Test authentication with the provided accounts
