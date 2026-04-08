import prisma from '../config/prisma.js';
import { normalizeListingForResponse } from '../utils/parseListing.js';

export async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: {
        listing: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      favorites: favorites.map((item) => ({
        id: item.id,
        listing: normalizeListingForResponse(item.listing)
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const listingId = Number(req.params.listingId);
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: req.user.userId,
          listingId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ message: 'Anunțul a fost scos din favorite.', isFavorite: false });
    }

    await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        listingId
      }
    });

    return res.json({ message: 'Anunțul a fost adăugat la favorite.', isFavorite: true });
  } catch (error) {
    next(error);
  }
}
