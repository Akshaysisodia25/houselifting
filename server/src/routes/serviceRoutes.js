import express from 'express';
import {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:idOrSlug', getServiceByIdOrSlug);
router.post('/', requireAuth, createService);
router.put('/:id', requireAuth, updateService);
router.delete('/:id', requireAuth, deleteService);

export default router;

