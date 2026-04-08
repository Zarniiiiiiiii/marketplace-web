import { z } from 'zod';
import prisma from '../config/prisma.js';
import { normalizeListingForResponse } from '../utils/parseListing.js';

const listingSchema = z.object({
  title: z.string().trim().min(10, 'Titlul trebuie să aibă minim 10 caractere.').max(120, 'Titlul este prea lung.'),
  description: z.string().trim().min(30, 'Descrierea trebuie să aibă minim 30 de caractere.').max(3000, 'Descrierea este prea lungă.'),
  brand: z.string().trim().min(2, 'Marca este obligatorie.').max(50),
  model: z.string().trim().min(1, 'Modelul este obligatoriu.').max(50),
  year: z.coerce.number().int().min(1980, 'An invalid.').max(new Date().getFullYear() + 1, 'An invalid.'),
  price: z.coerce.number().int().min(100, 'Prețul trebuie să fie de minim 100.').max(1000000, 'Preț prea mare.'),
  mileage: z.coerce.number().int().min(0, 'Kilometraj invalid.').max(1000000, 'Kilometraj prea mare.'),
  fuelType: z.enum(['DIESEL', 'PETROL', 'HYBRID', 'ELECTRIC', 'LPG']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  color: z.string().trim().min(2, 'Culoarea este obligatorie.').max(30),
  engine: z.string().trim().min(2, 'Motorul este obligatoriu.').max(50),
  horsepower: z.coerce.number().int().min(30, 'Număr invalid de cai putere.').max(2000, 'Număr invalid de cai putere.'),
  locationCity: z.string().trim().min(2, 'Orașul este obligatoriu.').max(60),
  featuredImage: z.string().url('Imaginea principală este invalidă.'),
  gallery: z.array(z.string().url()).max(12, 'Poți încărca maxim 12 imagini.').optional().default([]),
  contactName: z.string().trim().min(2, 'Numele de contact este obligatoriu.').max(80),
  contactEmail: z.string().trim().email('Emailul de contact este invalid.'),
  contactPhone: z.string().trim().min(6, 'Telefonul de contact este invalid.').max(30)
});

function buildSort(sort) {
  switch (sort) {
    case 'price_asc':
      return (a, b) => a.price - b.price;
    case 'price_desc':
      return (a, b) => b.price - a.price;
    case 'year_desc':
      return (a, b) => b.year - a.year;
    case 'year_asc':
      return (a, b) => a.year - b.year;
    case 'mileage_asc':
      return (a, b) => a.mileage - b.mileage;
    case 'mileage_desc':
      return (a, b) => b.mileage - a.mileage;
    case 'relevance':
      return (a, b) => b.relevanceScore - a.relevanceScore || new Date(b.createdAt) - new Date(a.createdAt);
    case 'latest':
    default:
      return (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
  }
}

function calculateRelevanceScore(listing, search) {
  if (!search) return 0;

  const normalizedSearch = search.toLowerCase();
  let score = 0;

  if (listing.brand.toLowerCase().includes(normalizedSearch)) score += 5;
  if (listing.model.toLowerCase().includes(normalizedSearch)) score += 4;
  if (listing.title.toLowerCase().includes(normalizedSearch)) score += 3;
  if (listing.description.toLowerCase().includes(normalizedSearch)) score += 1;

  return score;
}

export async function getListings(req, res, next) {
  try {
    const {
      search = '',
      brand,
      model,
      fuelType,
      transmission,
      city,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      sort = 'latest',
      status = 'APPROVED',
      page = '1',
      pageSize = '12'
    } = req.query;

    const normalizedSearch = String(search).trim();
    const normalizedBrand = String(brand || '').trim();
    const normalizedModel = String(model || '').trim();
    const normalizedCity = String(city || '').trim();

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentPageSize = Math.min(Math.max(Number(pageSize) || 12, 1), 48);

    const where = {
      ...(status !== 'ALL' ? { status } : {}),
      ...(status !== 'ALL' ? { isPublished: true } : {}),
      ...(status !== 'ALL' ? { isSold: false } : {}),
      ...(normalizedBrand ? { brand: { equals: normalizedBrand } } : {}),
      ...(normalizedModel ? { model: { equals: normalizedModel } } : {}),
      ...(fuelType ? { fuelType } : {}),
      ...(transmission ? { transmission } : {}),
      ...(normalizedCity ? { locationCity: { contains: normalizedCity } } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {})
            }
          }
        : {}),
      ...(minYear || maxYear
        ? {
            year: {
              ...(minYear ? { gte: Number(minYear) } : {}),
              ...(maxYear ? { lte: Number(maxYear) } : {})
            }
          }
        : {}),
      ...(maxMileage
        ? {
            mileage: {
              lte: Number(maxMileage)
            }
          }
        : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch } },
              { brand: { contains: normalizedSearch } },
              { model: { contains: normalizedSearch } },
              { description: { contains: normalizedSearch } }
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
            phone: true,
            city: true
          }
        },
        favorites: true
      }
    });

    const rankedListings = listings.map((listing) => ({
      ...listing,
      relevanceScore: calculateRelevanceScore(listing, normalizedSearch)
    }));

    rankedListings.sort(buildSort(sort));

    const total = rankedListings.length;
    const totalPages = Math.max(Math.ceil(total / currentPageSize), 1);
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * currentPageSize;
    const paginatedListings = rankedListings.slice(start, start + currentPageSize);

    return res.json({
      listings: paginatedListings.map(normalizeListingForResponse),
      pagination: {
        page: safePage,
        pageSize: currentPageSize,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getListingById(req, res, next) {
  try {
    const listingId = Number(req.params.id);

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            city: true
          }
        },
        favorites: true
      }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Anunțul nu a fost găsit.' });
    }

    return res.json({ listing: normalizeListingForResponse(listing) });
  } catch (error) {
    next(error);
  }
}

export async function getSimilarListings(req, res, next) {
  try {
    const listingId = Number(req.params.id);

    const currentListing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!currentListing) {
      return res.status(404).json({ message: 'Anunțul nu a fost găsit.' });
    }

    const similarListings = await prisma.listing.findMany({
      where: {
        id: { not: listingId },
        status: 'APPROVED',
        isPublished: true,
        isSold: false,
        OR: [
          { brand: currentListing.brand },
          { model: currentListing.model },
          {
            price: {
              gte: Math.max(currentListing.price - 5000, 0),
              lte: currentListing.price + 5000
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            city: true
          }
        },
        favorites: true
      },
      take: 4
    });

    return res.json({
      listings: similarListings.map(normalizeListingForResponse)
    });
  } catch (error) {
    next(error);
  }
}

export async function createListing(req, res, next) {
  try {
    const data = listingSchema.parse(req.body);

    const listing = await prisma.listing.create({
      data: {
        ...data,
        gallery: JSON.stringify(data.gallery ?? []),
        ownerId: req.user.userId,
        status: 'PENDING',
        isPublished: false,
        isSold: false,
        soldAt: null
      }
    });

    return res.status(201).json({
      message: 'Anunțul a fost creat.',
      listing: normalizeListingForResponse(listing)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const data = listingSchema.parse(req.body);

    const existing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!existing) {
      return res.status(404).json({ message: 'Anunțul nu a fost găsit.' });
    }

    if (existing.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Nu poți modifica acest anunț.' });
    }

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...data,
        gallery: JSON.stringify(data.gallery ?? []),
        status: req.user.role === 'ADMIN' ? existing.status : 'PENDING',
        isPublished: req.user.role === 'ADMIN' ? existing.isPublished : false
      }
    });

    return res.json({
      message: 'Anunțul a fost actualizat.',
      listing: normalizeListingForResponse(listing)
    });
  } catch (error) {
    next(error);
  }
}

export async function markListingAsSold(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const existing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!existing) {
      return res.status(404).json({ message: 'Anunțul nu a fost găsit.' });
    }

    if (existing.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Nu poți modifica acest anunț.' });
    }

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        isSold: true,
        soldAt: new Date()
      }
    });

    return res.json({
      message: 'Anunțul a fost marcat ca vândut.',
      listing: normalizeListingForResponse(listing)
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const existing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!existing) {
      return res.status(404).json({ message: 'Anunțul nu a fost găsit.' });
    }

    if (existing.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Nu poți șterge acest anunț.' });
    }

    await prisma.listing.delete({ where: { id: listingId } });

    return res.json({ message: 'Anunțul a fost șters.' });
  } catch (error) {
    next(error);
  }
}

export async function getMyListings(req, res, next) {
  try {
    const listings = await prisma.listing.findMany({
      where: { ownerId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ listings: listings.map(normalizeListingForResponse) });
  } catch (error) {
    next(error);
  }
}