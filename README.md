# DuxMax - Car Selling Platform for UAE

A full-stack car selling platform specifically designed for the UAE market, featuring user listings for private sellers, dealer accounts with subscription models, advanced filtering, real-time messaging, and bilingual support (English/Arabic).

## 🚀 Features

### Core Features
- **User Listings**: Private sellers can list their vehicles
- **Dealer Accounts**: Paid subscription model for professional dealers
- **Advanced Filtering**: Comprehensive search and filter system
- **Real-time Messaging**: Direct communication between buyers and sellers
- **Bilingual Support**: Full English and Arabic language support with RTL layout
- **Secure Authentication**: Multi-provider authentication with Better Auth
- **Image Management**: Multiple image uploads with optimization

### User Types
- **Individual Sellers**: Free account for private car sales
- **Verified Dealers**: Premium subscription with enhanced features
- **Buyers**: Browse and contact sellers with favorites system

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: App Router with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Accessible component library
- **React Hook Form**: Form management with Zod validation
- **Lucide React**: Icon library
- **next-intl**: Internationalization

### Backend
- **Hono.js**: Fast web framework for API routes
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database toolkit
- **Better Auth**: Authentication and session management

### Infrastructure
- **Docker**: Containerization
- **Bun**: JavaScript runtime and package manager
- **ESLint + Prettier**: Code quality and formatting

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Hono.js)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── listings/      # Car listings endpoints
│   │   ├── messages/      # Messaging endpoints
│   │   └── users/         # User management endpoints
│   └── [locale]/          # Internationalized pages
├── components/            # Reusable UI components
├── db/                   # Database layer
│   ├── repositories/     # Repository pattern implementation
│   ├── schema.ts         # Drizzle schema definitions
│   └── index.ts          # Database connection
├── lib/                  # Utility libraries
│   ├── auth.ts           # Better Auth configuration
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # Application constants
├── schemas/              # Zod validation schemas
├── i18n/                 # Internationalization setup
└── types/                # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd duxmax
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/duxmax
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Start the database** (using Docker)
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. **Generate and run database migrations**
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

6. **Start the development server**
   ```bash
   bun run dev
   ```

7. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Key Tables
- **users**: User accounts and profiles
- **dealer_subscriptions**: Paid dealer account management
- **listings**: Car listings with comprehensive details
- **messages**: Real-time messaging system
- **conversations**: Message threading
- **favorites**: User saved listings
- **analytics**: Tracking and insights

### Repository Pattern
The application uses the repository pattern for data access with built-in authorization:

```typescript
// Example: Get user's listings with automatic ownership filtering
const listings = await listingsRepo.getListingsForUser(userId);
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings with filters
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get listing details
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversation/:id` - Get conversation messages

## 🌍 Internationalization

The application supports English and Arabic with:
- **RTL Support**: Automatic right-to-left layout for Arabic
- **Locale Routing**: URLs prefixed with language code
- **Dynamic Content**: All text content translated
- **Date/Number Formatting**: Locale-aware formatting

### Adding Translations
1. Update message files in `/messages/`
2. Use the `useTranslations` hook in components
3. Format numbers and dates with locale-aware utilities

## 🔧 Development Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Code Quality
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run format           # Format with Prettier
bun run type-check       # TypeScript type checking

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:push          # Push schema changes
bun run db:studio        # Open Drizzle Studio
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
docker-compose up -d
```

The Docker setup includes:
- PostgreSQL database
- Redis for caching
- pgAdmin for database management
- Application container

## 🔐 Security Features

- **Authentication**: Secure session management with Better Auth
- **Authorization**: Repository-level data access control
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle
- **CSRF Protection**: Built-in Next.js CSRF protection

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure database connection
3. Set up file storage (for images)
4. Configure domain and SSL

### Database Migration
```bash
bun run db:generate
bun run db:migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for the UAE automotive market**
