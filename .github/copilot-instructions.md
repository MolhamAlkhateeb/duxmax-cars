# Copilot Instructions for DuxMax Car Selling Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack car selling platform targeting the UAE market with the following key features:
- User listings for private sellers
- Dealer accounts with paid subscription model
- Advanced filtering system
- Real-time messaging
- Bilingual support (English/Arabic)
- Secure authentication and data access

## Technology Stack
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components
- **Forms**: React-Hook-Form + Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better-Auth (OAuth + Email/Password)
- **API**: Hono.js backend
- **Storage**: Netlify Blob Storage for images
- **Icons**: Lucide React
- **i18n**: next-intl for translations
- **HTTP Client**: Axios
- **Runtime**: Bun

## Code Patterns
- Use the repository pattern for data access
- Implement data-level authorization in repositories
- Follow the TBT (Table-Based Testing) approach for database schema
- Use TypeScript strict mode
- Implement proper error handling and validation
- Use React Server Components where appropriate
- Follow Next.js 14 App Router conventions

## File Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and configurations
- `/src/db` - Database schema and repositories
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/src/i18n` - Internationalization files
- `/src/schemas` - Zod validation schemas

## Authentication & Authorization
- Use Better-Auth for authentication
- Implement role-based access control (individual/dealer)
- Verify dealer status for premium features
- Secure all API endpoints with proper middleware

## Database Best Practices
- Use Drizzle ORM for type-safe database queries
- Implement proper foreign key relationships
- Use UUIDs for primary keys
- Include proper timestamps and soft deletes
- Implement data-level security in repositories

## UI/UX Guidelines
- Use ShadCN UI components for consistency
- Implement responsive design with Tailwind CSS
- Support RTL layout for Arabic language
- Follow accessibility best practices
- Use proper loading states and error handling

## Development Guidelines
- Write comprehensive tests
- Use proper TypeScript types
- Implement proper error boundaries
- Follow ESLint and Prettier configurations
- Use semantic commit messages
