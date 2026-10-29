import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getPublicTestimonials = async (req, res, next) => {
  try {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getPublicTestimonials, using fallbackStore:', dbErr.message);
      const list = fallbackStore.testimonials.filter(t => t.approved);
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

export const getAllTestimonials = async (req, res, next) => {
  try {
    try {
      const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getAllTestimonials, using fallbackStore:', dbErr.message);
      return res.json({
        success: true,
        count: fallbackStore.testimonials.length,
        data: fallbackStore.testimonials
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID' });
    }

    try {
      const testimonial = await prisma.testimonial.findUnique({ where: { id } });
      if (testimonial) return res.json({ success: true, data: testimonial });
    } catch (dbErr) {
      console.warn('Prisma DB error in getTestimonialById, using fallbackStore:', dbErr.message);
    }

    const item = fallbackStore.testimonials.find(t => t.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const { name, location, content, rating, imageUrl, approved, outcome, projectType } = req.body;

    if (!name || !content || !location) {
      return res.status(400).json({
        success: false,
        message: 'name, location, and content are required'
      });
    }

    const isApproved = approved !== undefined ? Boolean(approved) : true;

    try {
      const testimonial = await prisma.testimonial.create({
        data: {
          name: name.trim(),
          location: location.trim(),
          content: content.trim(),
          rating: rating !== undefined ? parseInt(rating, 10) : 5,
          imageUrl: imageUrl ? imageUrl.trim() : null,
          approved: isApproved,
          outcome: outcome ? outcome.trim() : null,
          projectType: projectType ? projectType.trim() : null
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        data: testimonial
      });
    } catch (dbErr) {
      const newT = {
        id: fallbackStore.testimonials.length + 1,
        name: name.trim(),
        location: location.trim(),
        content: content.trim(),
        rating: rating !== undefined ? parseInt(rating, 10) : 5,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        approved: isApproved,
        outcome: outcome ? outcome.trim() : null,
        projectType: projectType ? projectType.trim() : null,
        createdAt: new Date().toISOString()
      };
      fallbackStore.testimonials.unshift(newT);
      return res.status(201).json({
        success: true,
        message: 'Testimonial created successfully (fallback)',
        data: newT
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID' });
    }

    try {
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (existing) {
        const { name, location, content, rating, imageUrl, approved, outcome, projectType } = req.body;
        const updated = await prisma.testimonial.update({
          where: { id },
          data: {
            ...(name !== undefined && { name: name.trim() }),
            ...(location !== undefined && { location: location.trim() }),
            ...(content !== undefined && { content: content.trim() }),
            ...(rating !== undefined && { rating: parseInt(rating, 10) }),
            ...(imageUrl !== undefined && { imageUrl: imageUrl ? imageUrl.trim() : null }),
            ...(approved !== undefined && { approved: Boolean(approved) }),
            ...(outcome !== undefined && { outcome: outcome ? outcome.trim() : null }),
            ...(projectType !== undefined && { projectType: projectType ? projectType.trim() : null })
          }
        });
        return res.json({ success: true, message: 'Testimonial updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateTestimonial error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.testimonials.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    fallbackStore.testimonials[index] = { ...fallbackStore.testimonials[index], ...req.body };
    return res.json({ success: true, message: 'Testimonial updated successfully', data: fallbackStore.testimonials[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial ID' });
    }

    try {
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (existing) {
        await prisma.testimonial.delete({ where: { id } });
        return res.json({ success: true, message: 'Testimonial deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteTestimonial error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.testimonials.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    fallbackStore.testimonials.splice(index, 1);
    return res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
