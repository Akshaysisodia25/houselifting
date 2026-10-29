import express from 'express';
import {
  initiateGoogleAuth,
  handleGoogleCallback,
  getMe,
  logout,
  login
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Google OAuth 2.0 with PKCE & OpenID Connect
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

// Current Session & Profile
router.get('/me', requireAuth, getMe);

// Logout (Clears HttpOnly Session Cookie)
router.post('/logout', logout);

// Superseded Password Login (Safely returns 403 Forbidden)
router.post('/login', login);

export default router;
