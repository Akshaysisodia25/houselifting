import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission
router.post('/', createEnquiry);

// Admin operations
router.get('/', requireAuth, getEnquiries);
router.get('/:id', requireAuth, getEnquiryById);
router.put('/:id', requireAuth, updateEnquiry);
router.delete('/:id', requireAuth, deleteEnquiry);

export default router;

