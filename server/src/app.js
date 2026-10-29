import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const clientUrl = process.env.CLIENT_URL || '*';
const allowedOrigins = [
  'https://houselifting.vercel.app',
  'https://www.houselifting.in',
  'https://houselifting.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

if (clientUrl && clientUrl !== '*') {
  allowedOrigins.push(clientUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (clientUrl === '*') return callback(null, true);
      return callback(null, true); // Permissive for preview/staging environments
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

app.use('/api/', apiLimiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
const handleHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TDBD Engineering Works API is operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
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
    documentation: 'See README.md'
  });
});

// API Routes (mounted under both /api/... and direct /... for seamless Vercel serverless routing)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

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

