import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { isEmailAuthorized } from '../utils/googleAuth.js';

export const requireAuth = async (req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
  const clearSessionCookie = () => {
    res.clearCookie('tdbd_admin_session', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  };

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
      clearSessionCookie();
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

    // Every valid administrator session MUST have a verified email
    if (!decoded || !decoded.email || typeof decoded.email !== 'string') {
      clearSessionCookie();
      return res.status(401).json({
        success: false,
        message: 'Malformed session credentials: Email claim missing or invalid.',
      });
    }

    // Normalize email to lowercase and trim whitespace
    const normalizedEmail = decoded.email.replace(/^["']|["']$/g, '').toLowerCase().trim();

    // 2. STRICT Server-side allowlist check (403 Forbidden if not authorized)
    if (!isEmailAuthorized(normalizedEmail)) {
      clearSessionCookie();
      return res.status(403).json({
        success: false,
        message: 'Forbidden: This Google account is not on the authorized engineering administrator allowlist.',
      });
    }

    // 3. Resolve Admin user profile from Prisma PostgreSQL
    let admin = null;
    try {
      if (decoded.id && !isNaN(parseInt(decoded.id, 10))) {
        admin = await prisma.admin.findUnique({
          where: { id: parseInt(decoded.id, 10) },
          select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
        });
      }
      if (!admin && normalizedEmail) {
        admin = await prisma.admin.findUnique({
          where: { email: normalizedEmail },
          select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma Admin lookup warning:', dbErr.message);
    }

    if (!admin) {
      admin = {
        id: decoded.id || 1,
        name: decoded.name || 'Administrator',
        email: normalizedEmail,
        googleId: decoded.googleId || null,
        picture: decoded.picture || null,
        role: decoded.role || 'SUPERADMIN',
        createdAt: new Date().toISOString(),
      };
    }

    // 4. Verify role permissions
    if (admin.role !== 'ADMIN' && admin.role !== 'SUPERADMIN') {
      clearSessionCookie();
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient administrator privileges.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('requireAuth unexpected error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Internal authorization error.',
    });
  }
};

export default requireAuth;
