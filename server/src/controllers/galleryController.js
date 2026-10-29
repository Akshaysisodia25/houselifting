import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getGalleryImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    try {
      const where = {};
      if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' };
      }

      const images = await prisma.galleryImage.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        success: true,
        count: images.length,
        data: images
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getGalleryImages, using fallbackStore:', dbErr.message);
      let list = [...fallbackStore.gallery];
      if (category && category !== 'All') {
        list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
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

export const getGalleryImageById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid image ID' });
    }

    try {
      const image = await prisma.galleryImage.findUnique({ where: { id } });
      if (image) return res.json({ success: true, data: image });
    } catch (dbErr) {
      console.warn('Prisma DB error in getGalleryImageById, using fallbackStore:', dbErr.message);
    }

    const fallbackImg = fallbackStore.gallery.find(g => g.id === id);
    if (!fallbackImg) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    return res.json({ success: true, data: fallbackImg });
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req, res, next) => {
  try {
    const { title, imageUrl, category, description } = req.body;

    if (!title || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: 'title, imageUrl, and category are required'
      });
    }

    try {
      const newImage = await prisma.galleryImage.create({
        data: {
          title: title.trim(),
          imageUrl: imageUrl.trim(),
          category: category.trim(),
          description: description ? description.trim() : null
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Gallery image added successfully',
        data: newImage
      });
    } catch (dbErr) {
      const newImg = {
        id: fallbackStore.gallery.length + 1,
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim(),
        description: description ? description.trim() : null,
        createdAt: new Date().toISOString()
      };
      fallbackStore.gallery.unshift(newImg);
      return res.status(201).json({
        success: true,
        message: 'Gallery image added successfully (fallback)',
        data: newImg
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateGalleryImage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid image ID' });
    }

    try {
      const existing = await prisma.galleryImage.findUnique({ where: { id } });
      if (existing) {
        const { title, imageUrl, category, description } = req.body;
        const updated = await prisma.galleryImage.update({
          where: { id },
          data: {
            ...(title !== undefined && { title: title.trim() }),
            ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
            ...(category !== undefined && { category: category.trim() }),
            ...(description !== undefined && { description: description ? description.trim() : null })
          }
        });
        return res.json({ success: true, message: 'Gallery image updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateGalleryImage error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.gallery.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    fallbackStore.gallery[index] = { ...fallbackStore.gallery[index], ...req.body };
    return res.json({ success: true, message: 'Gallery image updated successfully', data: fallbackStore.gallery[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid image ID' });
    }

    try {
      const existing = await prisma.galleryImage.findUnique({ where: { id } });
      if (existing) {
        await prisma.galleryImage.delete({ where: { id } });
        return res.json({ success: true, message: 'Gallery image deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteGalleryImage error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.gallery.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    fallbackStore.gallery.splice(index, 1);
    return res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    next(error);
  }
};
