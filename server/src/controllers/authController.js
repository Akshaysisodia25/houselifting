import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import {
  generatePkce,
  resolveRedirectUri,
  resolveFrontendUrl,
  getGoogleAuthorizationUrl,
  exchangeCodeForTokens,
  verifyGoogleUser,
  isEmailAuthorized
} from '../utils/googleAuth.js';

/**
 * Step 1: Initiate Google OAuth 2.0 Authorization with PKCE
 * GET /api/auth/google
 */
export const initiateGoogleAuth = async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth 2.0 is not configured on this server. Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured in environment variables.',
      });
    }

    const { codeVerifier, codeChallenge, state } = generatePkce();
    const redirectUri = resolveRedirectUri(req);
    const returnTo = req.query.returnTo || resolveFrontendUrl(req);

    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    res.cookie('oauth_state', state, cookieOptions);
    res.cookie('oauth_code_verifier', codeVerifier, cookieOptions);
    res.cookie('oauth_return_to', returnTo, cookieOptions);

    const authUrl = getGoogleAuthorizationUrl({
      state,
      codeChallenge,
      redirectUri,
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error('initiateGoogleAuth error:', error);
    next(error);
  }
};

/**
 * Step 2: Handle Google OAuth 2.0 Callback
 * GET /api/auth/google/callback
 */
export const handleGoogleCallback = async (req, res, next) => {
  const returnTo = req.cookies?.oauth_return_to || resolveFrontendUrl(req);

  const clearOAuthCookies = () => {
    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    const opts = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };
    res.clearCookie('oauth_state', opts);
    res.clearCookie('oauth_code_verifier', opts);
    res.clearCookie('oauth_return_to', opts);
  };

  try {
    const { code, state, error } = req.query;

    if (error) {
      clearOAuthCookies();
      return res.redirect(`${returnTo}/#admin?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      clearOAuthCookies();
      return res.redirect(`${returnTo}/#admin?error=missing_code`);
    }

    // Validate state (CSRF mitigation)
    const expectedState = req.cookies?.oauth_state;
    if (!state || !expectedState || state !== expectedState) {
      clearOAuthCookies();
      return res.redirect(`${returnTo}/#admin?error=invalid_state`);
    }

    // Retrieve PKCE code verifier
    const codeVerifier = req.cookies?.oauth_code_verifier;
    if (!codeVerifier) {
      clearOAuthCookies();
      return res.redirect(`${returnTo}/#admin?error=missing_code_verifier`);
    }

    clearOAuthCookies();

    // 1. Exchange authorization code for tokens
    const redirectUri = resolveRedirectUri(req);
    const tokenResponse = await exchangeCodeForTokens({
      code,
      codeVerifier,
      redirectUri,
    });

    // 2. Verify Google user identity & OpenID claims
    const googleUser = await verifyGoogleUser({
      idToken: tokenResponse.id_token,
      accessToken: tokenResponse.access_token,
    });

    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';

    // 3. Server-side allowlist authorization check (HTTP 403 on failure)
    if (!isEmailAuthorized(googleUser.email)) {
      console.warn('[SECURITY] Unauthorized Google login attempt denied by server-side allowlist');

      // CRITICAL: Immediately clear any active admin session cookies to prevent privilege persistence
      res.clearCookie('tdbd_admin_session', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
      });

      // If client requests JSON or direct API verification
      if (req.headers.accept?.includes('application/json')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access denied: Google account is not on the authorized engineering administrator allowlist.',
        });
      }

      // Redirect to Admin Portal with access_denied flag (do not leak email in URL or logs)
      return res.redirect(`${returnTo}/#admin?error=unauthorized_email`);
    }

    // 4. Upsert Admin account in Prisma PostgreSQL (or fallback if DB disconnected)
    let admin = null;
    try {
      admin = await prisma.admin.upsert({
        where: { email: googleUser.email.toLowerCase().trim() },
        update: {
          googleId: googleUser.googleId,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        create: {
          email: googleUser.email.toLowerCase().trim(),
          googleId: googleUser.googleId,
          name: googleUser.name,
          picture: googleUser.picture,
          role: 'SUPERADMIN',
        },
        select: { id: true, name: true, email: true, googleId: true, picture: true, role: true, createdAt: true },
      });
    } catch (dbErr) {
      console.warn('Database upsert skipped or unavailable in Google callback:', dbErr.message);
      admin = {
        id: 1,
        name: googleUser.name,
        email: googleUser.email.toLowerCase().trim(),
        googleId: googleUser.googleId,
        picture: googleUser.picture,
        role: 'SUPERADMIN',
        createdAt: new Date().toISOString(),
      };
    }

    // 5. Generate secure JWT session token
    const secret = process.env.JWT_SECRET || 'tdbd-super-secret-jwt-key-2026-production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const sessionToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        googleId: admin.googleId,
        picture: admin.picture,
      },
      secret,
      { expiresIn }
    );

    // 6. Set secure HttpOnly session cookie
    res.cookie('tdbd_admin_session', sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Redirect back to Admin Portal with success flag
    return res.redirect(`${returnTo}/#admin?auth=success`);
  } catch (error) {
    console.error('handleGoogleCallback error:', error.message || error);
    clearOAuthCookies();
    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie('tdbd_admin_session', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
    return res.redirect(`${returnTo}/#admin?error=${encodeURIComponent(error.message || 'authentication_failed')}`);
  }
};

/**
 * Step 3: Get Current Authenticated Administrator Session
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 4: Logout Administrator (Clear Session Cookie)
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie('tdbd_admin_session', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deprecated Password Login (Disabled in favor of Google OIDC)
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  return res.status(403).json({
    success: false,
    message: 'Password authentication has been superseded. Please use Google Sign-In with your authorized administrator account.',
  });
};
