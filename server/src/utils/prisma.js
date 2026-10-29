import { PrismaClient } from '@prisma/client';

// Support standard cloud PostgreSQL environment variables (Vercel Postgres, Neon, Supabase, Railway)
if (!process.env.DATABASE_URL) {
  const cloudUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.NEON_DATABASE_URL;

  if (cloudUrl) {
    process.env.DATABASE_URL = cloudUrl;
  }
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Always cache client on globalThis in serverless environments to prevent connection pool exhaustion
globalForPrisma.prisma = prisma;

/**
 * Non-destructive database connection test (SELECT 1)
 * Safely checks PostgreSQL connectivity without exposing credentials.
 */
export async function testDatabaseConnection() {
  const hasUrl = Boolean(process.env.DATABASE_URL);
  if (!hasUrl) {
    return {
      connected: false,
      configured: false,
      error: 'DATABASE_URL environment variable is not configured on this server.'
    };
  }

  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return {
      connected: true,
      configured: true,
      error: null
    };
  } catch (err) {
    // Sanitize any potential credential leaks from error message
    const safeError = (err.message || 'Connection failed')
      .replace(/:\/\/.*@/, '://***:***@')
      .split('\n')[0];

    return {
      connected: false,
      configured: true,
      error: safeError
    };
  }
}

export default prisma;
