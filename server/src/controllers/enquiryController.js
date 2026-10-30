import prisma, { ensureDatabaseTables } from '../utils/prisma.js';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

/**
 * Sanitize text input: strips HTML tags, script elements, ASCII control characters, and enforces length bounds.
 */
function sanitizeInput(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // Strip ASCII control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Check for prototype pollution payload keys
 */
function hasPrototypePollution(obj) {
  if (!obj || typeof obj !== 'object') return false;
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    if (typeof obj[key] === 'object' && hasPrototypePollution(obj[key])) {
      return true;
    }
  }
  return false;
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(token, clientIp) {
  // Cloudflare official testing secret key passes automatically if no custom key is provided
  const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

  if (!token || typeof token !== 'string' || token.trim() === '') {
    return { success: false, error: 'missing_token' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (clientIp) formData.append('remoteip', clientIp);

    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await cfRes.json();
    return { success: data.success === true, data };
  } catch (err) {
    console.error('[TURNSTILE] Verification network error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Create a new customer enquiry
 * POST /api/enquiries
 * Strictly persists a new independent row in PostgreSQL. Never updates or overwrites existing records.
 */
export const createEnquiry = async (req, res, next) => {
  try {
    // 1. Prototype pollution defense
    if (hasPrototypePollution(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload structure.',
      });
    }

    // 2. Cloudflare Turnstile CAPTCHA verification
    const turnstileToken = req.body.turnstileToken || req.body['cf-turnstile-response'];
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;

    const captchaResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!captchaResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Security check failed: Invalid or missing CAPTCHA. Please complete the verification.',
      });
    }

    const { name, phone, email, city, service, message } = req.body;

    if (!name || !phone || !city || !service) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, city/location, and service type are required.',
      });
    }

    // 2. Strict sanitization & length constraints
    const cleanName = sanitizeInput(name, 100);
    const cleanPhone = sanitizeInput(phone, 25);
    const cleanCity = sanitizeInput(city, 100);
    const cleanService = sanitizeInput(service, 100);
    const cleanEmail = email ? sanitizeInput(email, 150).toLowerCase() : null;
    const cleanMessage = message ? sanitizeInput(message, 2000) : null;

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (minimum 2 characters).',
      });
    }

    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (7 to 15 digits).',
      });
    }

    if (cleanEmail) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }
    }

    await ensureDatabaseTables();

    try {
      const enquiry = await prisma.enquiry.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          city: cleanCity,
          service: cleanService,
          message: cleanMessage,
          status: 'NEW',
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully. Our engineering team will contact you within 24 hours.',
        data: enquiry,
      });
    } catch (dbErr) {
      console.error('PostgreSQL error creating enquiry in prisma.enquiry.create:', dbErr.message);

      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        success: false,
        message: 'Database persistence error while recording enquiry in PostgreSQL. Please check database connection.',
        ...(isDev && { error: dbErr.message }),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all enquiries from PostgreSQL (Admin Protected)
 * GET /api/enquiries
 * Queries PostgreSQL findMany with optional status/search filters.
 */
export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const where = {};

    if (status && VALID_STATUSES.includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const cleanSearch = sanitizeInput(search, 100);
      where.OR = [
        { name: { contains: cleanSearch, mode: 'insensitive' } },
        { phone: { contains: cleanSearch } },
        { city: { contains: cleanSearch, mode: 'insensitive' } },
        { service: { contains: cleanSearch, mode: 'insensitive' } },
      ];
    }

    await ensureDatabaseTables();

    try {
      const enquiries = await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return res.json({
        success: true,
        count: enquiries.length,
        data: enquiries,
      });
    } catch (dbErr) {
      console.error('PostgreSQL error fetching enquiries in prisma.enquiry.findMany:', dbErr.message);

      return res.status(500).json({
        success: false,
        message: 'Database error retrieving enquiries from PostgreSQL. Please check database connection.',
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get single enquiry by ID (Admin Protected)
 * GET /api/enquiries/:id
 */
export const getEnquiryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }

    try {
      const enquiry = await prisma.enquiry.findUnique({ where: { id } });
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database.' });
      }
      return res.json({ success: true, data: enquiry });
    } catch (dbErr) {
      console.error('PostgreSQL error in getEnquiryById:', dbErr.message);
      return res.status(500).json({
        success: false,
        message: 'Database error retrieving enquiry from PostgreSQL.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status or message (Admin Protected)
 * PUT /api/enquiries/:id
 */
export const updateEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }

    if (hasPrototypePollution(req.body)) {
      return res.status(400).json({ success: false, message: 'Invalid request payload structure.' });
    }

    const { status, message } = req.body;
    if (status && !VALID_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    try {
      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database.' });
      }

      const cleanMessage = message !== undefined ? sanitizeInput(message, 2000) : undefined;

      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          ...(status && { status: status.toUpperCase() }),
          ...(cleanMessage !== undefined && { message: cleanMessage || null }),
        },
      });
      return res.json({ success: true, message: 'Enquiry updated successfully.', data: updated });
    } catch (dbErr) {
      console.error('PostgreSQL error updating enquiry in prisma.enquiry.update:', dbErr.message);
      return res.status(500).json({
        success: false,
        message: 'Database error updating enquiry in PostgreSQL.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete enquiry by ID (Admin Protected)
 * DELETE /api/enquiries/:id
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }

    try {
      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database.' });
      }

      await prisma.enquiry.delete({ where: { id } });
      return res.json({ success: true, message: 'Enquiry deleted successfully from database.' });
    } catch (dbErr) {
      console.error('PostgreSQL error deleting enquiry in prisma.enquiry.delete:', dbErr.message);
      return res.status(500).json({
        success: false,
        message: 'Database error deleting enquiry from PostgreSQL.',
      });
    }
  } catch (error) {
    next(error);
  }
};
