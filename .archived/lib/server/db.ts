// src/lib/server/db.ts
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

// Create a singleton instance of the PrismaClient
const prisma = global.__prisma || new PrismaClient({
  log: dev ? ['query', 'error', 'warn'] : ['error'],
});

// In development, attach to global to prevent multiple instances during HMR
if (dev) {
  global.__prisma = prisma;
}

export { prisma };