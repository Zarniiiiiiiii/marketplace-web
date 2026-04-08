import { z } from 'zod';
import prisma from '../config/prisma.js';
import { normalizeListingForResponse } from '../utils/parseListing.js';

const rejectSchema = z.object({
  reason: z.string().trim().min(5, 'Motivul trebuie să aibă minim 5 caractere.').max(300, 'Motivul este prea lung.')
});

export async function getAdminStats(req, res, next) {
  try {
    const [
      usersCount,
      listingsCount,
      approvedCount,
      pendingCount,
      rejectedCount,
      soldCount,
      favoritesCount,
      listingsByBrandRaw,
      listingsByCityRaw
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'APPROVED' } }),
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.listing.count({ where: { status: 'REJECTED' } }),
      prisma.listing.count({ where: { isSold: true } }),
      prisma.favorite.count(),
      prisma.listing.groupBy({
        by: ['brand'],
        _count: { brand: true },
        orderBy: {
          _count: {
            brand: 'desc'
          }
        }
      }),
      prisma.listing.groupBy({
        by: ['locationCity'],
        _count: { locationCity: true },
        orderBy: {
          _count: {
            locationCity: 'desc'
          }
        }
      })
    ]);

    return res.json({
      stats: {
        usersCount,
        listingsCount,
        approvedCount,
        pendingCount,
        rejectedCount,
        soldCount,
        favoritesCount,
        listingsByBrand: listingsByBrandRaw.slice(0, 8).map((item) => ({
          label: item.brand,
          value: item._count.brand
        })),
        listingsByCity: listingsByCityRaw.slice(0, 8).map((item) => ({
          label: item.locationCity,
          value: item._count.locationCity
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminListings(req, res, next) {
  try {
    const {
      search = '',
      status = '',
      ownerId = ''
    } = req.query;

    const normalizedSearch = String(search).trim();

    const where = {
      ...(status ? { status } : {}),
      ...(ownerId ? { ownerId: Number(ownerId) } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch } },
              { brand: { contains: normalizedSearch } },
              { model: { contains: normalizedSearch } },
              { owner: { firstName: { contains: normalizedSearch } } },
              { owner: { lastName: { contains: normalizedSearch } } },
              { owner: { email: { contains: normalizedSearch } } }
            ]
          }
        : {})
    };

    const listings = await prisma.listing.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            city: true
          }
        },
        favorites: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      listings: listings.map(normalizeListingForResponse)
    });
  } catch (error) {
    next(error);
  }
}

export async function approveListing(req, res, next) {
  try {
    const listingId = Number(req.params.id);

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'APPROVED',
        isPublished: true,
        rejectionReason: null
      }
    });

    return res.json({
      message: 'Anunțul a fost aprobat.',
      listing: normalizeListingForResponse(listing)
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectListing(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const data = rejectSchema.parse(req.body);

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'REJECTED',
        isPublished: false,
        rejectionReason: data.reason
      }
    });

    return res.json({
      message: 'Anunțul a fost respins.',
      listing: normalizeListingForResponse(listing)
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminUsers(req, res, next) {
  try {
    const search = String(req.query.search || '').trim();

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
              { city: { contains: search } }
            ]
          }
        : undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            listings: true,
            favorites: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function getAdminUserListings(req, res, next) {
  try {
    const userId = Number(req.params.userId);

    const listings = await prisma.listing.findMany({
      where: { ownerId: userId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            city: true
          }
        },
        favorites: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      listings: listings.map(normalizeListingForResponse)
    });
  } catch (error) {
    next(error);
  }
}