import prisma, { ensureDatabaseTables } from '../utils/prisma.js';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

/**
 * Create a new customer enquiry
 * POST /api/enquiries
 * Strictly persists a new independent row in PostgreSQL. Never updates or overwrites existing records.
 */
export const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, city, service, message } = req.body;

    if (!name || !phone || !city || !service) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, city/location, and service type are required'
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    await ensureDatabaseTables();

    try {
      const enquiry = await prisma.enquiry.create({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email && email.trim() ? email.trim() : null,
          city: city.trim(),
          service: service.trim(),
          message: message && message.trim() ? message.trim() : null,
          status: 'NEW'
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully. Our engineering team will contact you within 24 hours.',
        data: enquiry
      });
    } catch (dbErr) {
      console.error('PostgreSQL error creating enquiry in prisma.enquiry.create:', dbErr);
      const safeErrMessage = (dbErr.message || 'Database error')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' ')
        .replace(/:\/\/[^@]+@/g, '://***:***@');

      return res.status(500).json({
        success: false,
        message: 'Database persistence error while recording enquiry in PostgreSQL.',
        errorCode: dbErr.code || null,
        detail: safeErrMessage
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all enquiries from PostgreSQL
 * GET /api/enquiries
 * Queries PostgreSQL findMany with optional status/search filters.
 * Returns empty array [] if zero records exist.
 */
export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const where = {};

    if (status && VALID_STATUSES.includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { phone: { contains: search.trim() } },
        { city: { contains: search.trim(), mode: 'insensitive' } },
        { service: { contains: search.trim(), mode: 'insensitive' } }
      ];
    }

    await ensureDatabaseTables();

    try {
      const enquiries = await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        success: true,
        count: enquiries.length,
        data: enquiries
      });
    } catch (dbErr) {
      console.error('PostgreSQL error fetching enquiries in prisma.enquiry.findMany:', dbErr);
      const safeErrMessage = (dbErr.message || 'Database error')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' ')
        .replace(/:\/\/[^@]+@/g, '://***:***@');

      return res.status(500).json({
        success: false,
        message: 'Database error retrieving enquiries from PostgreSQL.',
        errorCode: dbErr.code || null,
        detail: safeErrMessage,
        data: []
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get single enquiry by ID
 * GET /api/enquiries/:id
 */
export const getEnquiryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
    }

    try {
      const enquiry = await prisma.enquiry.findUnique({ where: { id } });
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database' });
      }
      return res.json({ success: true, data: enquiry });
    } catch (dbErr) {
      console.error('PostgreSQL error in getEnquiryById:', dbErr);
      return res.status(500).json({
        success: false,
        message: 'Database error retrieving enquiry from PostgreSQL.',
        error: process.env.NODE_ENV === 'development' ? dbErr.message : undefined
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status or message
 * PUT /api/enquiries/:id
 */
export const updateEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
    }

    const { status, message } = req.body;
    if (status && !VALID_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    try {
      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database' });
      }

      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          ...(status && { status: status.toUpperCase() }),
          ...(message !== undefined && { message: message ? message.trim() : null })
        }
      });
      return res.json({ success: true, message: 'Enquiry updated successfully', data: updated });
    } catch (dbErr) {
      console.error('PostgreSQL error updating enquiry in prisma.enquiry.update:', dbErr);
      return res.status(500).json({
        success: false,
        message: 'Database error updating enquiry in PostgreSQL.',
        error: process.env.NODE_ENV === 'development' ? dbErr.message : undefined
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete enquiry by ID
 * DELETE /api/enquiries/:id
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
    }

    try {
      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Enquiry not found in database' });
      }

      await prisma.enquiry.delete({ where: { id } });
      return res.json({ success: true, message: 'Enquiry deleted successfully from database' });
    } catch (dbErr) {
      console.error('PostgreSQL error deleting enquiry in prisma.enquiry.delete:', dbErr);
      return res.status(500).json({
        success: false,
        message: 'Database error deleting enquiry from PostgreSQL.',
        error: process.env.NODE_ENV === 'development' ? dbErr.message : undefined
      });
    }
  } catch (error) {
    next(error);
  }
};
