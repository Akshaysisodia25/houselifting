import { PrismaClient } from '@prisma/client';

/**
 * Resolve and optimize database URL for runtime environment.
 * Ensures pooled connections for serverless Prisma Postgres / cloud Postgres traffic.
 */
function resolveRuntimeDatabaseUrl() {
  let url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.NEON_DATABASE_URL;

  if (!url) return null;

  // Step 5: For serverless application traffic, if using direct db.prisma.io, switch to pooled.db.prisma.io
  if (url.includes('db.prisma.io') && !url.includes('pooled.db.prisma.io')) {
    url = url.replace('db.prisma.io', 'pooled.db.prisma.io');
  }

  // Ensure SSL is required for cloud postgres
  if (url.startsWith('postgres') && !url.includes('localhost') && !url.includes('127.0.0.1') && !url.includes('sslmode=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}sslmode=require`;
  }

  return url;
}

const resolvedDatabaseUrl = resolveRuntimeDatabaseUrl();
if (resolvedDatabaseUrl) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(resolvedDatabaseUrl ? { datasourceUrl: resolvedDatabaseUrl } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Always cache client on globalThis in serverless environments to prevent connection pool exhaustion
globalForPrisma.prisma = prisma;

/**
 * Return safe, non-sensitive metadata about the current database configuration
 */
export function getSafeDatabaseMeta() {
  const url = process.env.DATABASE_URL || '';
  if (!url) {
    return {
      configured: false,
      hostType: 'none',
      isPooled: false,
      hasSsl: false,
      protocol: 'none'
    };
  }

  let hostType = 'other';
  let isPooled = false;
  let hasSsl = false;
  let protocol = 'unknown';

  try {
    const matchProto = url.match(/^([a-z+]+):\/\//i);
    if (matchProto) protocol = matchProto[1].toLowerCase();

    if (url.includes('pooled.db.prisma.io')) {
      hostType = 'Prisma Postgres (Pooled)';
      isPooled = true;
    } else if (url.includes('db.prisma.io')) {
      hostType = 'Prisma Postgres (Direct)';
      isPooled = false;
    } else if (url.includes('localhost') || url.includes('127.0.0.1')) {
      hostType = 'localhost';
      isPooled = false;
    } else if (url.includes('neon.tech')) {
      hostType = 'Neon';
      isPooled = url.includes('-pooler');
    } else if (url.includes('supabase.co')) {
      hostType = 'Supabase';
      isPooled = url.includes(':6543') || url.includes('pooler');
    }

    hasSsl = url.includes('sslmode=require') || url.includes('sslaccept=strict') || url.includes('ssl=true');
  } catch (e) {
    // ignore
  }

  return {
    configured: true,
    hostType,
    isPooled,
    hasSsl,
    protocol
  };
}

/**
 * Non-destructive database connection test (SELECT 1)
 * Safely checks PostgreSQL connectivity without exposing credentials.
 */
export async function testDatabaseConnection() {
  const meta = getSafeDatabaseMeta();
  if (!meta.configured) {
    return {
      connected: false,
      configured: false,
      meta,
      errorCode: null,
      error: 'DATABASE_URL environment variable is not configured on this server.'
    };
  }

  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return {
      connected: true,
      configured: true,
      meta,
      errorCode: null,
      error: null
    };
  } catch (err) {
    // Extract non-empty lines from error message
    const lines = (err.message || 'Connection failed')
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    // Sanitize any potential credential leaks from error message
    const safeError = lines.slice(0, 3).join(' ').replace(/:\/\/[^@]+@/g, '://***:***@');

    return {
      connected: false,
      configured: true,
      meta,
      errorCode: err.code || null,
      error: safeError
    };
  }
}

export default prisma;
