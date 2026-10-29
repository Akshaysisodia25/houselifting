import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { fallbackStore } from '../utils/fallbackStore.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (dbErr) {
      console.warn('Prisma DB query failed in authController, checking fallbackStore:', dbErr.message);
      if (fallbackStore.admin.email.toLowerCase() === email.toLowerCase().trim()) {
        admin = fallbackStore.admin;
      }
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const secret = process.env.JWT_SECRET || 'tdbd-super-secret-jwt-key-2026-production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

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

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
