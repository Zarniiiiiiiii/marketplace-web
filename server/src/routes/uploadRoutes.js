import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Poți încărca doar imagini.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/', protect, upload.single('image'), uploadImage);

export default router;