import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from './middleware/cookieParser.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { testDatabaseConnection } from './utils/prisma.js';
import { getAllowedAdminEmails, isAllowedOrigin, isAllowedHost } from './utils/googleAuth.js';

const app = express();

// Enable reverse proxy trust for accurate client IP identification on Vercel / Cloudflare
app.set('trust proxy', 1);

// Security Headers (Helmet CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://challenges.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'https://lh3.googleusercontent.com'],
        connectSrc: [
          "'self'",
          'https://houselifting.vercel.app',
          'https://*.vercel.app',
          'https://challenges.cloudflare.com',
          'https://accounts.google.com',
          'https://oauth2.googleapis.com'
        ],
        frameSrc: ["'self'", 'https://challenges.cloudflare.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Cross-Origin Resource Sharing with Strict Whitelist
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, same-origin)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: Origin ${origin} is not authorized`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400,
  })
);

// CSRF Defense: Validate Origin & Referer headers on state-changing requests
app.use((req, res, next) => {
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (!isStateChanging) return next();

  // Validate Origin header if present
  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({
      success: false,
      message: 'CSRF Protection: Request origin not authorized.',
    });
  }

  // Validate Referer header host if present
  const referer = req.headers.referer;
  if (referer) {
    try {
      const refHost = new URL(referer).host;
      if (!isAllowedHost(refHost)) {
        return res.status(403).json({
          success: false,
          message: 'CSRF Protection: Request referer host not authorized.',
        });
      }
    } catch (e) {
      // Malformed referer
      return res.status(403).json({
        success: false,
        message: 'CSRF Protection: Malformed referer header.',
      });
    }
  }

  next();
});

// Specialized Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Global API limit: 30 requests per 15-minute window
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.originalUrl?.includes('/auth'), // Keep auth rate limiting strictly separate
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter auth limit: max 5 requests per 15-minute window
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
  },
});

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 public enquiry submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP. Please try again after 15 minutes.',
  },
});

app.use('/api/', apiLimiter);

// Cookie & Body Parsing
app.use(cookieParser);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (Sanitized to prevent internal information leakage in production)
const handleHealth = async (req, res) => {
  const dbHealth = await testDatabaseConnection();
  const allowedEmails = getAllowedAdminEmails();
  const isProd = process.env.NODE_ENV === 'production';

  res.status(200).json({
    success: true,
    message: 'TDBD Engineering Works API is operational',
    database: {
      configured: dbHealth.configured,
      connected: dbHealth.connected,
      provider: 'postgresql',
      hostType: dbHealth.meta?.hostType || 'unknown',
      isPooled: dbHealth.meta?.isPooled || false,
      hasSsl: dbHealth.meta?.hasSsl || false,
      protocol: dbHealth.meta?.protocol || 'unknown',
      errorCode: dbHealth.errorCode || null,
      error: isProd ? (dbHealth.connected ? null : 'Database connectivity check failed') : dbHealth.error,
    },
    adminAuth: {
      allowlistConfigured: Boolean(process.env.ADMIN_GOOGLE_EMAILS) || allowedEmails.length > 0,
      allowedCount: allowedEmails.length,
    },
    envStatus: {
      hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
      hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasPostgresPrismaUrl: Boolean(process.env.POSTGRES_PRISMA_URL),
      hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
      hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      hasAdminGoogleEmails: Boolean(process.env.ADMIN_GOOGLE_EMAILS),
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Root friendly endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'TDBD Engineering Works API',
    description: 'House Lifting & Structural Shifting Backend Service',
    health: '/api/health',
    documentation: 'See README.md',
  });
});

// API Routes with rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/auth', authLimiter, authRoutes);

app.post('/api/enquiries', enquiryLimiter);
app.post('/enquiries', enquiryLimiter);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/services', serviceRoutes);
app.use('/services', serviceRoutes);

app.use('/api/gallery', galleryRoutes);
app.use('/gallery', galleryRoutes);

app.use('/api/testimonials', testimonialRoutes);
app.use('/testimonials', testimonialRoutes);

app.use('/api/faqs', faqRoutes);
app.use('/faqs', faqRoutes);

app.use('/api/enquiries', enquiryRoutes);
app.use('/enquiries', enquiryRoutes);

// Catch 404 & forward to error handler
app.use(notFound);

// Centralized Error Handling
app.use(errorHandler);

export default app;
