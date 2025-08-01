import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Method to create database if it doesn't exist
export async function createDatabaseIfNotExists() {
  const dbUrl = new URL(process.env.DATABASE_URL!);
  const targetDbName = dbUrl.pathname.slice(1);
  
  dbUrl.pathname = '/postgres';
  const adminSql = postgres(dbUrl.toString(), { max: 1 });

  try {
    const result = await adminSql`SELECT 1 FROM pg_database WHERE datname = ${targetDbName}`;
    
    if (result.length === 0) {
      await adminSql.unsafe(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Created database: ${targetDbName}`);
    }
  } finally {
    await adminSql.end();
  }
}

// Create the connection
const queryClient = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

// Export the database instance
export const db = drizzle(queryClient, { schema });

// Export types
export type Database = typeof db;
export * from './schema';
