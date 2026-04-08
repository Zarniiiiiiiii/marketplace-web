import { Router } from 'express';
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  getMyListings,
  getSimilarListings,
  markListingAsSold,
  updateListing
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getListings);
router.get('/mine', protect, getMyListings);
router.get('/:id/similar', getSimilarListings);
router.get('/:id', getListingById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.patch('/:id/sold', protect, markListingAsSold);
router.delete('/:id', protect, deleteListing);

export default router;