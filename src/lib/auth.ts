import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verificationToken: verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || '',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  // callbacks: {
  //   onSignUp: async (user) => {
  //     // Additional logic after user signs up
  //     console.log('User signed up:', user.email);
  //   },
  //   onSignIn: async (user) => {
  //     // Additional logic after user signs in
  //     console.log('User signed in:', user.email);
  //   },
  // },
});

// Export types
export type Session = typeof auth.$Infer.Session;
// export type User = typeof auth.$Infer.User; // Not available yet
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'individual' | 'dealer';
};
