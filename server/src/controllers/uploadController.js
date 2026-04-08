export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Nu a fost trimisă nicio imagine.' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  return res.status(201).json({
    message: 'Imagine încărcată cu succes.',
    url: imageUrl
  });
}