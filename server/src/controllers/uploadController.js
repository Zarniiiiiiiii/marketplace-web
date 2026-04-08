import cloudinary from '../config/cloudinary.js';

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nu a fost trimisă nicio imagine.' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'marketplace-web/listings',
      resource_type: 'image'
    });

    return res.status(201).json({
      message: 'Imagine încărcată cu succes.',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    next(error);
  }
}

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    stream.end(buffer);
  });
}