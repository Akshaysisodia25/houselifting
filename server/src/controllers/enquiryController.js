import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

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
      console.warn('Prisma DB error in createEnquiry, saving to fallbackStore:', dbErr.message);
      const newEnquiry = {
        id: fallbackStore.enquiries.length + 1,
        name: name.trim(),
        phone: phone.trim(),
        email: email && email.trim() ? email.trim() : null,
        city: city.trim(),
        service: service.trim(),
        message: message && message.trim() ? message.trim() : null,
        status: 'NEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      fallbackStore.enquiries.unshift(newEnquiry);

      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully. Our engineering team will contact you within 24 hours.',
        data: newEnquiry
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    try {
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
      console.warn('Prisma DB error in getEnquiries, using fallbackStore:', dbErr.message);
      let list = [...fallbackStore.enquiries];
      if (status && VALID_STATUSES.includes(status.toUpperCase())) {
        list = list.filter(e => e.status === status.toUpperCase());
      }
      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(e =>
          e.name.toLowerCase().includes(s) ||
          e.phone.includes(s) ||
          e.city.toLowerCase().includes(s) ||
          e.service.toLowerCase().includes(s)
        );
      }
      return res.json({
        success: true,
        count: list.length,
        data: list
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
    }

    try {
      const enquiry = await prisma.enquiry.findUnique({ where: { id } });
      if (enquiry) return res.json({ success: true, data: enquiry });
    } catch (dbErr) {
      console.warn('Prisma DB error in getEnquiryById, using fallbackStore:', dbErr.message);
    }

    const item = fallbackStore.enquiries.find(e => e.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

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
      if (existing) {
        const updated = await prisma.enquiry.update({
          where: { id },
          data: {
            ...(status && { status: status.toUpperCase() }),
            ...(message !== undefined && { message: message ? message.trim() : null })
          }
        });
        return res.json({ success: true, message: 'Enquiry updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateEnquiry error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.enquiries.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    fallbackStore.enquiries[index] = {
      ...fallbackStore.enquiries[index],
      ...(status && { status: status.toUpperCase() }),
      ...(message !== undefined && { message: message ? message.trim() : null }),
      updatedAt: new Date().toISOString()
    };
    return res.json({ success: true, message: 'Enquiry updated successfully', data: fallbackStore.enquiries[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
    }

    try {
      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (existing) {
        await prisma.enquiry.delete({ where: { id } });
        return res.json({ success: true, message: 'Enquiry deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteEnquiry error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.enquiries.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    fallbackStore.enquiries.splice(index, 1);
    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
