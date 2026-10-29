import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getPublicFaqs = async (req, res, next) => {
  try {
    const { category } = req.query;
    try {
      const where = { published: true };
      if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' };
      }

      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: { id: 'asc' }
      });

      return res.json({
        success: true,
        count: faqs.length,
        data: faqs
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getPublicFaqs, using fallbackStore:', dbErr.message);
      let list = fallbackStore.faqs.filter(f => f.published);
      if (category && category !== 'All') {
        list = list.filter(f => f.category.toLowerCase() === category.toLowerCase());
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

export const getAllFaqs = async (req, res, next) => {
  try {
    try {
      const faqs = await prisma.fAQ.findMany({
        orderBy: { id: 'asc' }
      });

      return res.json({
        success: true,
        count: faqs.length,
        data: faqs
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getAllFaqs, using fallbackStore:', dbErr.message);
      return res.json({
        success: true,
        count: fallbackStore.faqs.length,
        data: fallbackStore.faqs
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    }

    try {
      const faq = await prisma.fAQ.findUnique({ where: { id } });
      if (faq) return res.json({ success: true, data: faq });
    } catch (dbErr) {
      console.warn('Prisma DB error in getFaqById, using fallbackStore:', dbErr.message);
    }

    const item = fallbackStore.faqs.find(f => f.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createFaq = async (req, res, next) => {
  try {
    const { question, answer, category, published } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'question and answer are required'
      });
    }

    const isPublished = published !== undefined ? Boolean(published) : true;
    const cat = category ? category.trim() : 'General';

    try {
      const faq = await prisma.fAQ.create({
        data: {
          question: question.trim(),
          answer: answer.trim(),
          category: cat,
          published: isPublished
        }
      });

      return res.status(201).json({
        success: true,
        message: 'FAQ created successfully',
        data: faq
      });
    } catch (dbErr) {
      const newFaq = {
        id: fallbackStore.faqs.length + 1,
        question: question.trim(),
        answer: answer.trim(),
        category: cat,
        published: isPublished,
        createdAt: new Date().toISOString()
      };
      fallbackStore.faqs.push(newFaq);
      return res.status(201).json({
        success: true,
        message: 'FAQ created successfully (fallback)',
        data: newFaq
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    }

    try {
      const existing = await prisma.fAQ.findUnique({ where: { id } });
      if (existing) {
        const { question, answer, category, published } = req.body;
        const updated = await prisma.fAQ.update({
          where: { id },
          data: {
            ...(question !== undefined && { question: question.trim() }),
            ...(answer !== undefined && { answer: answer.trim() }),
            ...(category !== undefined && { category: category.trim() }),
            ...(published !== undefined && { published: Boolean(published) })
          }
        });
        return res.json({ success: true, message: 'FAQ updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateFaq error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.faqs.findIndex(f => f.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    fallbackStore.faqs[index] = { ...fallbackStore.faqs[index], ...req.body };
    return res.json({ success: true, message: 'FAQ updated successfully', data: fallbackStore.faqs[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    }

    try {
      const existing = await prisma.fAQ.findUnique({ where: { id } });
      if (existing) {
        await prisma.fAQ.delete({ where: { id } });
        return res.json({ success: true, message: 'FAQ deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteFaq error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.faqs.findIndex(f => f.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    fallbackStore.faqs.splice(index, 1);
    return res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};
