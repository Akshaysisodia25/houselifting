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

let tablesEnsured = false;

/**
 * Safely ensure that required database tables exist in PostgreSQL.
 * Completely idempotent and non-destructive.
 */
export async function ensureDatabaseTables() {
  if (tablesEnsured) return true;

  try {
    const res = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'enquiries'
      ) as "tableExists";
    `);

    if (res?.[0]?.tableExists) {
      tablesEnsured = true;
      return true;
    }

    console.info('[PRISMA] Database tables missing in PostgreSQL. Initializing schema safely...');

    // 1. Enum
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Admins table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "admins" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "email" TEXT UNIQUE NOT NULL,
          "passwordHash" TEXT,
          "googleId" TEXT UNIQUE,
          "picture" TEXT,
          "role" TEXT NOT NULL DEFAULT 'ADMIN',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Enquiries table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "enquiries" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT,
          "city" TEXT NOT NULL,
          "service" TEXT NOT NULL,
          "message" TEXT,
          "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Projects table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "projects" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "slug" TEXT UNIQUE NOT NULL,
          "location" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "beforeImageUrl" TEXT,
          "afterImageUrl" TEXT,
          "featured" BOOLEAN NOT NULL DEFAULT false,
          "liftHeight" TEXT,
          "problem" TEXT,
          "solution" TEXT,
          "specs" JSONB,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Services table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "services" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "slug" TEXT UNIQUE NOT NULL,
          "shortDescription" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "icon" TEXT,
          "featured" BOOLEAN NOT NULL DEFAULT false,
          "specs" JSONB,
          "features" JSONB,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Gallery images table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "gallery_images" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Testimonials table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "testimonials" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "location" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "rating" INTEGER NOT NULL DEFAULT 5,
          "imageUrl" TEXT,
          "approved" BOOLEAN NOT NULL DEFAULT true,
          "outcome" TEXT,
          "projectType" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. FAQs table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "faqs" (
          "id" SERIAL PRIMARY KEY,
          "question" TEXT NOT NULL,
          "answer" TEXT NOT NULL,
          "category" TEXT NOT NULL DEFAULT 'General',
          "published" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    tablesEnsured = true;
    console.info('[PRISMA] Database schema verified and active.');
    return true;
  } catch (err) {
    console.error('[PRISMA] Error verifying database tables:', err.message);
    return false;
  }
}

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
    await ensureDatabaseTables();

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
