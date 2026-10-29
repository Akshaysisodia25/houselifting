import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { isEmailAuthorized } from '../utils/googleAuth.js';

const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours absolute session limit
const IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000;     // 2 hours idle session limit
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;      // Refresh lastActive every 15 minutes

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

    const now = Date.now();

    // 2. Validate Session Timeouts (8h Absolute & 2h Idle)
    if (decoded.sessionStart && now - decoded.sessionStart > ABSOLUTE_TIMEOUT_MS) {
      clearSessionCookie();
      return res.status(401).json({
        success: false,
        message: 'Admin session expired (maximum 8-hour session lifetime reached). Please sign in again.',
      });
    }

    if (decoded.lastActive && now - decoded.lastActive > IDLE_TIMEOUT_MS) {
      clearSessionCookie();
      return res.status(401).json({
        success: false,
        message: 'Admin session expired due to 2 hours of inactivity. Please sign in again.',
      });
    }

    // 3. Sliding Session Activity Refresh (every 15 min if still within 8h absolute window)
    if (decoded.lastActive && now - decoded.lastActive > REFRESH_INTERVAL_MS) {
      const sessionStart = decoded.sessionStart || now;
      const remainingMs = Math.max(1000, ABSOLUTE_TIMEOUT_MS - (now - sessionStart));
      const remainingSec = Math.floor(remainingMs / 1000);

      const refreshedToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          googleId: decoded.googleId,
          picture: decoded.picture,
          sessionStart,
          lastActive: now,
        },
        secret,
        {
          expiresIn: remainingSec,
          issuer: 'tdbd-engineering-works',
          audience: 'tdbd-admin-portal',
        }
      );

      res.cookie('tdbd_admin_session', refreshedToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: remainingMs,
      });
    }

    // Normalize email to lowercase and trim whitespace
    const normalizedEmail = decoded.email.replace(/^["']|["']$/g, '').toLowerCase().trim();

    // 4. STRICT Server-side allowlist check (403 Forbidden if not authorized)
    if (!isEmailAuthorized(normalizedEmail)) {
      clearSessionCookie();
      return res.status(403).json({
        success: false,
        message: 'Forbidden: This Google account is not on the authorized engineering administrator allowlist.',
      });
    }

    // 5. Resolve Admin user profile from Prisma PostgreSQL by verified email
    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
      });
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

    // 6. Verify role permissions
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
