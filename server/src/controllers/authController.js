import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/generateToken.js';

const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'Prenumele este prea scurt.').max(50, 'Prenumele este prea lung.'),
  lastName: z.string().trim().min(2, 'Numele este prea scurt.').max(50, 'Numele este prea lung.'),
  email: z.string().trim().email('Email invalid.'),
  password: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere.'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s()-]{6,20}$/, 'Telefon invalid.')
    .optional()
    .or(z.literal('')),
  city: z.string().trim().max(60, 'Oraș invalid.').optional().or(z.literal(''))
});

const loginSchema = z.object({
  email: z.string().trim().email('Email invalid.'),
  password: z.string().min(1, 'Parola este obligatorie.')
});

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Există deja un cont cu acest email.' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        phone: data.phone || null,
        city: data.city || null
      }
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ message: 'Email sau parolă incorectă.' });
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Email sau parolă incorectă.' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

function sanitizeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}