import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { extractTokenFromRequest, verifySessionToken } from "./session";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Forbidden: Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class DeactivatedAccountError extends Error {
  constructor(message: string = "Account is deactivated") {
    super(message);
    this.name = "DeactivatedAccountError";
  }
}

/**
 * Retrieves the currently authenticated user from the incoming request.
 * Returns null if unauthenticated or invalid.
 */
export async function getCurrentUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = extractTokenFromRequest(request);
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) return null;

  return user;
}

/**
 * Enforces that a valid, active user session exists.
 * Throws AuthenticationError or DeactivatedAccountError if invalid.
 */
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const token = extractTokenFromRequest(request);
  if (!token) {
    throw new AuthenticationError("Authentication required to access this resource");
  }

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) {
    throw new AuthenticationError("Invalid or expired session");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AuthenticationError("User account no longer exists");
  }

  if (!user.isActive) {
    throw new DeactivatedAccountError("Account has been deactivated");
  }

  return user;
}

/**
 * Enforces that the authenticated user possesses the required role.
 */
export async function requireRole(request: Request, requiredRole: Role): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  if (user.role !== requiredRole) {
    throw new AuthorizationError(`Access restricted to ${requiredRole} users`);
  }
  return user;
}
