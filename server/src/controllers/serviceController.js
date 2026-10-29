import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getServices = async (req, res, next) => {
  try {
    const { featured } = req.query;
    try {
      const where = {};
      if (featured !== undefined) {
        where.featured = featured === 'true';
      }

      const services = await prisma.service.findMany({
        where,
        orderBy: { id: 'asc' }
      });

      return res.json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getServices, using fallbackStore:', dbErr.message);
      let list = [...fallbackStore.services];
      if (featured !== undefined) {
        list = list.filter(s => s.featured === (featured === 'true'));
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

export const getServiceByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isId = !isNaN(parseInt(idOrSlug, 10));

    try {
      const service = await prisma.service.findFirst({
        where: isId
          ? { OR: [{ id: parseInt(idOrSlug, 10) }, { slug: idOrSlug }] }
          : { slug: idOrSlug }
      });

      if (service) {
        return res.json({ success: true, data: service });
      }
    } catch (dbErr) {
      console.warn('Prisma DB error in getServiceByIdOrSlug, using fallbackStore:', dbErr.message);
    }

    const fallbackService = fallbackStore.services.find(s =>
      (isId && s.id === parseInt(idOrSlug, 10)) || s.slug === idOrSlug
    );

    if (!fallbackService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({ success: true, data: fallbackService });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      imageUrl,
      icon,
      featured,
      specs,
      features
    } = req.body;

    if (!title || !shortDescription || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'title, shortDescription, description, and imageUrl are required'
      });
    }

    const generatedSlug = slug ? slug.trim().toLowerCase() : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const service = await prisma.service.create({
        data: {
          title: title.trim(),
          slug: generatedSlug,
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          icon: icon ? icon.trim() : null,
          featured: Boolean(featured),
          specs: specs || null,
          features: features || null
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service
      });
    } catch (dbErr) {
      const newServ = {
        id: fallbackStore.services.length + 1,
        title: title.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        icon: icon ? icon.trim() : null,
        featured: Boolean(featured),
        specs: specs || null,
        features: features || null
      };
      fallbackStore.services.push(newServ);
      return res.status(201).json({
        success: true,
        message: 'Service created successfully (fallback)',
        data: newServ
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID' });
    }

    try {
      const existing = await prisma.service.findUnique({ where: { id } });
      if (existing) {
        const { title, slug, shortDescription, description, imageUrl, icon, featured, specs, features } = req.body;
        const updated = await prisma.service.update({
          where: { id },
          data: {
            ...(title && { title: title.trim() }),
            ...(slug && { slug: slug.trim().toLowerCase() }),
            ...(shortDescription && { shortDescription: shortDescription.trim() }),
            ...(description && { description: description.trim() }),
            ...(imageUrl && { imageUrl: imageUrl.trim() }),
            ...(icon !== undefined && { icon: icon ? icon.trim() : null }),
            ...(featured !== undefined && { featured: Boolean(featured) }),
            ...(specs !== undefined && { specs }),
            ...(features !== undefined && { features })
          }
        });
        return res.json({ success: true, message: 'Service updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateService error, updating fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.services.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    fallbackStore.services[index] = { ...fallbackStore.services[index], ...req.body };
    return res.json({ success: true, message: 'Service updated successfully', data: fallbackStore.services[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID' });
    }

    try {
      const existing = await prisma.service.findUnique({ where: { id } });
      if (existing) {
        await prisma.service.delete({ where: { id } });
        return res.json({ success: true, message: 'Service deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteService error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.services.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    fallbackStore.services.splice(index, 1);
    return res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
