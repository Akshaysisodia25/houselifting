import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    try {
      const where = {};
      if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' };
      }
      if (featured !== undefined) {
        where.featured = featured === 'true';
      }

      const projects = await prisma.project.findMany({
        where,
        orderBy: { id: 'asc' }
      });

      return res.json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (dbErr) {
      console.warn('Prisma DB error in getProjects, using fallbackStore:', dbErr.message);
      let list = [...fallbackStore.projects];
      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (featured !== undefined) {
        list = list.filter(p => p.featured === (featured === 'true'));
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

export const getProjectByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isId = !isNaN(parseInt(idOrSlug, 10));

    try {
      const project = await prisma.project.findFirst({
        where: isId
          ? { OR: [{ id: parseInt(idOrSlug, 10) }, { slug: idOrSlug }] }
          : { slug: idOrSlug }
      });

      if (project) {
        return res.json({ success: true, data: project });
      }
    } catch (dbErr) {
      console.warn('Prisma DB error in getProjectByIdOrSlug, using fallbackStore:', dbErr.message);
    }

    const fallbackProject = fallbackStore.projects.find(p =>
      (isId && p.id === parseInt(idOrSlug, 10)) || p.slug === idOrSlug
    );

    if (!fallbackProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, data: fallbackProject });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      location,
      description,
      category,
      imageUrl,
      beforeImageUrl,
      afterImageUrl,
      featured,
      liftHeight,
      problem,
      solution,
      specs
    } = req.body;

    if (!title || !location || !description || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'title, location, description, category, and imageUrl are required'
      });
    }

    const generatedSlug = slug ? slug.trim().toLowerCase() : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const existingSlug = await prisma.project.findUnique({
        where: { slug: generatedSlug }
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'A project with this slug or title already exists'
        });
      }

      const project = await prisma.project.create({
        data: {
          title: title.trim(),
          slug: generatedSlug,
          location: location.trim(),
          description: description.trim(),
          category: category.trim(),
          imageUrl: imageUrl.trim(),
          beforeImageUrl: beforeImageUrl ? beforeImageUrl.trim() : null,
          afterImageUrl: afterImageUrl ? afterImageUrl.trim() : null,
          featured: Boolean(featured),
          liftHeight: liftHeight ? liftHeight.trim() : null,
          problem: problem ? problem.trim() : null,
          solution: solution ? solution.trim() : null,
          specs: specs || null
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (dbErr) {
      const newProj = {
        id: fallbackStore.projects.length + 1,
        title: title.trim(),
        slug: generatedSlug,
        location: location.trim(),
        description: description.trim(),
        category: category.trim(),
        imageUrl: imageUrl.trim(),
        beforeImageUrl: beforeImageUrl ? beforeImageUrl.trim() : null,
        afterImageUrl: afterImageUrl ? afterImageUrl.trim() : null,
        featured: Boolean(featured),
        liftHeight: liftHeight ? liftHeight.trim() : null,
        problem: problem ? problem.trim() : null,
        solution: solution ? solution.trim() : null,
        specs: specs || null
      };
      fallbackStore.projects.push(newProj);
      return res.status(201).json({
        success: true,
        message: 'Project created successfully (fallback)',
        data: newProj
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (existing) {
        const {
          title, slug, location, description, category, imageUrl,
          beforeImageUrl, afterImageUrl, featured, liftHeight, problem, solution, specs
        } = req.body;

        const updated = await prisma.project.update({
          where: { id },
          data: {
            ...(title && { title: title.trim() }),
            ...(slug && { slug: slug.trim().toLowerCase() }),
            ...(location && { location: location.trim() }),
            ...(description && { description: description.trim() }),
            ...(category && { category: category.trim() }),
            ...(imageUrl && { imageUrl: imageUrl.trim() }),
            ...(beforeImageUrl !== undefined && { beforeImageUrl: beforeImageUrl ? beforeImageUrl.trim() : null }),
            ...(afterImageUrl !== undefined && { afterImageUrl: afterImageUrl ? afterImageUrl.trim() : null }),
            ...(featured !== undefined && { featured: Boolean(featured) }),
            ...(liftHeight !== undefined && { liftHeight: liftHeight ? liftHeight.trim() : null }),
            ...(problem !== undefined && { problem: problem ? problem.trim() : null }),
            ...(solution !== undefined && { solution: solution ? solution.trim() : null }),
            ...(specs !== undefined && { specs })
          }
        });

        return res.json({ success: true, message: 'Project updated successfully', data: updated });
      }
    } catch (dbErr) {
      console.warn('Prisma updateProject error, updating fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    fallbackStore.projects[index] = { ...fallbackStore.projects[index], ...req.body };
    return res.json({ success: true, message: 'Project updated successfully', data: fallbackStore.projects[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (existing) {
        await prisma.project.delete({ where: { id } });
        return res.json({ success: true, message: 'Project deleted successfully' });
      }
    } catch (dbErr) {
      console.warn('Prisma deleteProject error, using fallbackStore:', dbErr.message);
    }

    const index = fallbackStore.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    fallbackStore.projects.splice(index, 1);
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
