import express from 'express';
import {
  getPublicFaqs,
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
} from '../controllers/faqController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicFaqs);
router.get('/all', requireAuth, getAllFaqs);
router.get('/:id', getFaqById);
router.post('/', requireAuth, createFaq);
router.put('/:id', requireAuth, updateFaq);
router.delete('/:id', requireAuth, deleteFaq);

export default router;

