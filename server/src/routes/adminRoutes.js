import { Router } from 'express';
import {
  approveListing,
  getAdminListings,
  getAdminStats,
  getAdminUserListings,
  getAdminUsers,
  rejectListing
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/listings', getAdminListings);
router.get('/users', getAdminUsers);
router.get('/users/:userId/listings', getAdminUserListings);

router.patch('/listings/:id/approve', approveListing);
router.patch('/listings/:id/reject', rejectListing);

export default router;