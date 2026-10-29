import express from 'express';
import {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.get('/:id', getGalleryImageById);
router.post('/', requireAuth, createGalleryImage);
router.put('/:id', requireAuth, updateGalleryImage);
router.delete('/:id', requireAuth, deleteGalleryImage);

export default router;

