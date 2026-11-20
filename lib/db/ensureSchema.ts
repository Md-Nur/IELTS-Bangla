import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

let isEnsured = false;

/**
 * Ensures required database columns exist on older or partially-migrated databases.
 * Safe, non-destructive, and idempotent in PostgreSQL.
 */
export async function ensureUserSchema(): Promise<boolean> {
  if (isEnsured) return true;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;`
    );
    isEnsured = true;
    return true;
  } catch (error) {
    console.warn("[ensureUserSchema] Auto-migration execution notice:", error);
    return false;
  }
}

export interface SafeUserRecord {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  passwordHash?: string | null;
  targetBand?: number | null;
  examDate?: Date | null;
  createdAt?: Date;
}

/**
 * Safely finds a user by email for authentication.
 * Handles missing User.isActive column via auto-healing and fallback.
 */
export async function findUserByEmailSafe(email: string): Promise<SafeUserRecord | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; meta?: { column?: string } };
    const isP2022 =
      err?.code === "P2022" ||
      (typeof err?.message === "string" && err.message.includes("isActive")) ||
      (typeof err?.meta?.column === "string" && err.meta.column.includes("isActive"));

    if (isP2022) {
      console.warn("[findUserByEmailSafe] Column isActive missing. Attempting self-heal...");
      await ensureUserSchema();

      try {
        return await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        });
      } catch {
        // Fallback: Query without isActive
        const fallback = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
          },
        });
        if (!fallback) return null;
        return { ...fallback, isActive: true };
      }
    }
    throw error;
  }
}

/**
 * Safely finds an authenticated user by ID for sessions and guards.
 * Handles missing User.isActive column via auto-healing and fallback.
 */
export async function findUserByIdSafe(id: string): Promise<SafeUserRecord | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        targetBand: true,
        examDate: true,
        createdAt: true,
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; meta?: { column?: string } };
    const isP2022 =
      err?.code === "P2022" ||
      (typeof err?.message === "string" && err.message.includes("isActive")) ||
      (typeof err?.meta?.column === "string" && err.meta.column.includes("isActive"));

    if (isP2022) {
      console.warn("[findUserByIdSafe] Column isActive missing. Attempting self-heal...");
      await ensureUserSchema();

      try {
        return await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            targetBand: true,
            examDate: true,
            createdAt: true,
          },
        });
      } catch {
        // Fallback: Query without isActive
        const fallback = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            targetBand: true,
            examDate: true,
            createdAt: true,
          },
        });
        if (!fallback) return null;
        return { ...fallback, isActive: true };
      }
    }
    throw error;
  }
}

/**
 * Safely creates a new student user.
 * Handles missing User.isActive column via auto-healing and fallback.
 */
export async function createUserSafe(data: {
  email: string;
  name: string | null;
  passwordHash: string;
  role: Role;
}): Promise<SafeUserRecord> {
  try {
    return await prisma.user.create({
      data: {
        ...data,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; meta?: { column?: string } };
    const isP2022 =
      err?.code === "P2022" ||
      (typeof err?.message === "string" && err.message.includes("isActive")) ||
      (typeof err?.meta?.column === "string" && err.meta.column.includes("isActive"));

    if (isP2022) {
      console.warn("[createUserSafe] Column isActive missing. Attempting self-heal...");
      await ensureUserSchema();

      try {
        return await prisma.user.create({
          data: {
            ...data,
            isActive: true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        });
      } catch {
        // Fallback: Insert without isActive
        const fallback = await prisma.user.create({
          data,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });
        return { ...fallback, isActive: true };
      }
    }
    throw error;
  }
}
