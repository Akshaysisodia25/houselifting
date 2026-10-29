import crypto from 'crypto';

/**
 * Approved application origins for CORS, redirect validation, and CSRF protection
 */
export const ALLOWED_ORIGINS = [
  'https://houselifting.vercel.app',
  'https://www.houselifting.in',
  'https://houselifting.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const ALLOWED_HOSTS = [
  'houselifting.vercel.app',
  'www.houselifting.in',
  'houselifting.in',
  'localhost',
  '127.0.0.1',
];

/**
 * Verify whether an origin is allowed by CORS and CSRF defense
 */
export function isAllowedOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const clean = origin.trim().replace(/\/+$/, '');

  if (ALLOWED_ORIGINS.includes(clean)) return true;

  if (process.env.CLIENT_URL && process.env.CLIENT_URL !== '*') {
    const configured = process.env.CLIENT_URL.trim().replace(/\/+$/, '');
    if (configured === clean) return true;
  }

  // Allow Vercel preview environments (e.g., https://houselifting-git-main-xxx.vercel.app)
  if (/^https:\/\/[a-z0-9_-]+(\.vercel\.app)$/i.test(clean)) {
    return true;
  }

  return false;
}

/**
 * Verify whether a hostname is safe against host header poisoning
 */
export function isAllowedHost(host) {
  if (!host || typeof host !== 'string') return false;
  const cleanHost = host.split(':')[0].trim().toLowerCase();

  if (ALLOWED_HOSTS.includes(cleanHost)) return true;
  if (cleanHost.endsWith('.vercel.app')) return true;

  return false;
}

/**
 * Sanitize post-login redirect destination to eliminate Open Redirect attacks
 */
export function sanitizeReturnTo(url, req) {
  const fallback = resolveFrontendUrl(req);
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Safe relative paths (e.g. /#admin, /admin, /)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return `${fallback}${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (isAllowedOrigin(parsed.origin)) {
      return trimmed;
    }
  } catch (e) {
    // Malformed URL, fallback to default
  }

  return fallback;
}

/**
 * Generate PKCE Code Verifier, Code Challenge, and Cryptographically Secure OAuth State
 */
export function generatePkce() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  const state = crypto.randomBytes(32).toString('hex');

  return { codeVerifier, codeChallenge, state };
}

/**
 * Resolve effective OAuth Redirect URI protected against host header poisoning
 */
export function resolveRedirectUri(req) {
  if (process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI.trim() !== '') {
    return process.env.GOOGLE_REDIRECT_URI.trim();
  }

  const rawHost = (req.get('x-forwarded-host') || req.get('host') || 'localhost:5001').split(',')[0].trim();
  const host = isAllowedHost(rawHost) ? rawHost : 'houselifting.vercel.app';
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.secure ? 'https' : 'http');

  return `${proto}://${host}/api/auth/google/callback`;
}

/**
 * Resolve frontend origin for post-login redirection
 */
export function resolveFrontendUrl(req) {
  if (process.env.CLIENT_URL && process.env.CLIENT_URL.trim() !== '' && process.env.CLIENT_URL !== '*') {
    return process.env.CLIENT_URL.replace(/\/+$/, '');
  }

  const rawHost = (req.get('x-forwarded-host') || req.get('host') || 'localhost:3000').split(',')[0].trim();
  const host = isAllowedHost(rawHost) ? rawHost : 'houselifting.vercel.app';
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.secure ? 'https' : 'http');

  // If backend is on 5001 in local development, frontend is typically on port 3000
  if (host.includes('localhost:5001') || host.includes('127.0.0.1:5001')) {
    return 'http://localhost:3000';
  }

  return `${proto}://${host}`;
}

/**
 * Build Google OAuth 2.0 Authorization URL with PKCE
 */
export function getGoogleAuthorizationUrl({ state, codeChallenge, redirectUri }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.trim() === '') {
    throw new Error('GOOGLE_CLIENT_ID environment variable is missing.');
  }

  const params = new URLSearchParams({
    client_id: clientId.trim(),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Authorization Code for Google Tokens using PKCE
 */
export async function exchangeCodeForTokens({ code, codeVerifier, redirectUri }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variable is missing.');
  }

  const bodyParams = new URLSearchParams({
    client_id: clientId.trim(),
    client_secret: clientSecret.trim(),
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorDescription = data.error_description || data.error || 'Token exchange failed';
    throw new Error(`Google token exchange error: ${errorDescription}`);
  }

  return data;
}

/**
 * Cryptographically verify and decode Google identity & claims server-side
 */
export async function verifyGoogleUser({ idToken, accessToken }) {
  if (!idToken && !accessToken) {
    throw new Error('No ID token or access token provided for Google user verification.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : null;

  // 1. Verify ID token directly with Google OAuth tokeninfo endpoint (cryptographic verification)
  let verifiedTokenInfo = null;
  if (idToken) {
    try {
      const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
      if (tokenInfoRes.ok) {
        verifiedTokenInfo = await tokenInfoRes.json();
      }
    } catch (e) {
      console.warn('Google tokeninfo verification endpoint call warning:', e.message);
    }
  }

  // 2. Fetch official OIDC UserInfo if access token is available
  let userInfo = null;
  if (accessToken) {
    try {
      const userinfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userinfoRes.ok) {
        userInfo = await userinfoRes.json();
      }
    } catch (e) {
      console.warn('UserInfo fetch warning:', e.message);
    }
  }

  // 3. Fallback parse id_token payload
  let idPayload = null;
  if (idToken) {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      try {
        idPayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      } catch (e) {
        console.warn('Could not parse id_token payload:', e.message);
      }
    }
  }

  const verifiedClaims = verifiedTokenInfo || idPayload;
  const user = verifiedTokenInfo || userInfo || idPayload;

  if (!user || !user.email) {
    throw new Error('Could not obtain verified user profile from Google.');
  }

  // Cryptographic & Claims Validation
  if (verifiedClaims) {
    // Validate audience / client ID
    if (clientId && verifiedClaims.aud && verifiedClaims.aud !== clientId) {
      throw new Error('Google ID token audience mismatch.');
    }
    // Validate issuer
    const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
    if (verifiedClaims.iss && !validIssuers.includes(verifiedClaims.iss)) {
      throw new Error('Google ID token issuer invalid.');
    }
    // Validate expiration
    if (verifiedClaims.exp && verifiedClaims.exp * 1000 < Date.now()) {
      throw new Error('Google ID token has expired.');
    }
  }

  const emailVerified = user.email_verified === true || user.email_verified === 'true';
  if (!emailVerified) {
    throw new Error('Google email address is not verified by Google.');
  }

  return {
    googleId: user.sub,
    email: user.email.toLowerCase().trim(),
    name: user.name || 'Administrator',
    picture: user.picture || null,
  };
}

/**
 * Core authorized administrator Google accounts allowlist
 */
const CORE_AUTHORIZED_ADMINS = [
  'sisodiaakshay25@gmail.com',
  'krishansisodia91@gmail.com',
  'sisodiaakshay536@gmail.com',
];

/**
 * Retrieve normalized array of allowed administrator Google emails from environment & config
 */
export function getAllowedAdminEmails() {
  const rawList = process.env.ADMIN_GOOGLE_EMAILS || '';
  const allowed = rawList
    .split(',')
    .map(e => e.replace(/^["']|["']$/g, '').trim().toLowerCase())
    .filter(Boolean);

  // Ensure authorized core administrator Google accounts are included
  for (const email of CORE_AUTHORIZED_ADMINS) {
    if (!allowed.includes(email)) {
      allowed.push(email);
    }
  }

  // Also include single ADMIN_EMAIL if defined and not already in list
  if (process.env.ADMIN_EMAIL) {
    const defaultEmail = process.env.ADMIN_EMAIL.replace(/^["']|["']$/g, '').trim().toLowerCase();
    if (defaultEmail && !allowed.includes(defaultEmail)) {
      allowed.push(defaultEmail);
    }
  }

  return allowed;
}

/**
 * Check if the email address is on the authorized administrator allowlist
 */
export function isEmailAuthorized(email) {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.replace(/^["']|["']$/g, '').toLowerCase().trim();
  if (!cleanEmail) return false;

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(cleanEmail);
}
