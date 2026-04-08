export function notFound(req, res) {
  res.status(404).json({ message: 'Ruta nu a fost găsită.' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error?.message?.includes('File too large')) {
    return res.status(400).json({
      message: 'Imaginea este prea mare. Dimensiunea maximă permisă este 5 MB.'
    });
  }

  if (error?.message === 'Poți încărca doar imagini.') {
    return res.status(400).json({
      message: 'Poți încărca doar fișiere imagine.'
    });
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(status).json({
    message: error.message || 'A apărut o eroare internă.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
}