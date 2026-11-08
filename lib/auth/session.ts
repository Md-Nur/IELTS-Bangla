import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

export const SESSION_COOKIE_NAME = "ib_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  [key: string]: unknown;
}

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "dev_super_secret_ielts_bangla_key_32_bytes_min!";
  return new TextEncoder().encode(secret);
}

/**
 * Creates and signs an encrypted/tamper-proof JWT session token.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getJwtSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

/**
 * Verifies a JWT session token and returns the decoded payload.
 * Returns null if invalid, expired, or tampered.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/**
 * Extracts session token from either Authorization header or Cookie header.
 */
export function extractTokenFromRequest(request: Request): string | null {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie header: ib_session=<token>
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        return cookie.substring(SESSION_COOKIE_NAME.length + 1).trim();
      }
    }
  }

  return null;
}
