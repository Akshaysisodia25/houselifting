import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'tdbd-super-secret-jwt-key-2026-production';

    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
    } catch (dbErr) {
      if (fallbackStore.admin.id === decoded.id) {
        admin = {
          id: fallbackStore.admin.id,
          name: fallbackStore.admin.name,
          email: fallbackStore.admin.email,
          role: fallbackStore.admin.role,
          createdAt: fallbackStore.admin.createdAt
        };
      }
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired, please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication credentials',
    });
  }
};
