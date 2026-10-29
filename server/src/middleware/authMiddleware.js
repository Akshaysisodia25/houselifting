import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';
import { isEmailAuthorized } from '../utils/googleAuth.js';

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Extract session token: prioritize secure HttpOnly cookie, fallback to Authorization header
    let token = req.cookies?.tdbd_admin_session;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in with an authorized Google administrator account.',
      });
    }

    const secret = process.env.JWT_SECRET || 'tdbd-super-secret-jwt-key-2026-production';

    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Admin session expired. Please sign in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid session token. Please sign in again.',
      });
    }

    if (!decoded || (!decoded.id && !decoded.email)) {
      return res.status(401).json({
        success: false,
        message: 'Malformed session credentials.',
      });
    }

    // 2. Server-side allowlist check (403 Forbidden if not authorized)
    if (decoded.email && !isEmailAuthorized(decoded.email)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: This Google account is not on the authorized engineering administrator allowlist.',
      });
    }

    // 3. Resolve Admin user profile from Prisma or Fallback
    let admin = null;
    try {
      if (decoded.id && !isNaN(parseInt(decoded.id, 10))) {
        admin = await prisma.admin.findUnique({
          where: { id: parseInt(decoded.id, 10) },
          select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
        });
      }
      if (!admin && decoded.email) {
        admin = await prisma.admin.findUnique({
          where: { email: decoded.email.toLowerCase().trim() },
          select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma Admin lookup warning:', dbErr.message);
    }

    if (!admin) {
      // In-memory fallback if database is not available
      admin = {
        id: decoded.id || 1,
        name: decoded.name || 'Administrator',
        email: decoded.email || fallbackStore.admin.email,
        googleId: decoded.googleId || null,
        picture: decoded.picture || null,
        role: decoded.role || 'SUPERADMIN',
        createdAt: new Date().toISOString(),
      };
    }

    // Verify role permissions
    if (admin.role !== 'ADMIN' && admin.role !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient administrator privileges.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('requireAuth unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal authorization error.',
    });
  }
};

export default requireAuth;
