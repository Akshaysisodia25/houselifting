import crypto from 'crypto';

/**
 * Generate PKCE Code Verifier, Code Challenge, and OAuth State
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
 * Resolve effective OAuth Redirect URI for current request environment
 */
export function resolveRedirectUri(req) {
  if (process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI.trim() !== '') {
    return process.env.GOOGLE_REDIRECT_URI.trim();
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.secure ? 'https' : 'http');
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:5001';

  return `${proto}://${host}/api/auth/google/callback`;
}

/**
 * Resolve frontend origin for post-login redirection
 */
export function resolveFrontendUrl(req) {
  if (process.env.CLIENT_URL && process.env.CLIENT_URL.trim() !== '' && process.env.CLIENT_URL !== '*') {
    return process.env.CLIENT_URL.replace(/\/+$/, '');
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.secure ? 'https' : 'http');
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';

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
 * Verify and decode Google ID Token & fetch verified userinfo
 */
export async function verifyGoogleUser({ idToken, accessToken }) {
  if (!idToken && !accessToken) {
    throw new Error('No ID token or access token provided for Google user verification.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : null;

  // 1. Fetch official OIDC UserInfo
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

  // 2. Decode and validate ID Token payload
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

  const user = userInfo || idPayload;
  if (!user || !user.email) {
    throw new Error('Could not obtain verified user profile from Google.');
  }

  // Security checks
  if (idPayload) {
    // Validate audience if clientId is configured
    if (clientId && idPayload.aud && idPayload.aud !== clientId) {
      throw new Error('Google ID token audience mismatch.');
    }
    // Validate issuer
    const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
    if (idPayload.iss && !validIssuers.includes(idPayload.iss)) {
      throw new Error('Google ID token issuer invalid.');
    }
    // Validate expiration
    if (idPayload.exp && idPayload.exp * 1000 < Date.now()) {
      throw new Error('Google ID token has expired.');
    }
  }

  const emailVerified = user.email_verified === true || user.email_verified === 'true';
  if (!emailVerified) {
    throw new Error('Google email address is not verified.');
  }

  return {
    googleId: user.sub,
    email: user.email.toLowerCase().trim(),
    name: user.name || 'Administrator',
    picture: user.picture || null,
  };
}

/**
 * Check if the email address is on the authorized administrator allowlist
 */
export function isEmailAuthorized(email) {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  // Allowlist from ADMIN_GOOGLE_EMAILS (comma-separated list)
  const rawList = process.env.ADMIN_GOOGLE_EMAILS || '';
  const allowedEmails = rawList
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  // Also include single ADMIN_EMAIL if defined
  if (process.env.ADMIN_EMAIL) {
    const defaultEmail = process.env.ADMIN_EMAIL.replace(/^["']|["']$/g, '').trim().toLowerCase();
    if (defaultEmail && !allowedEmails.includes(defaultEmail)) {
      allowedEmails.push(defaultEmail);
    }
  }

  return allowedEmails.includes(cleanEmail);
}
