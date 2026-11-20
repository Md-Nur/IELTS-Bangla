import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifySessionToken, SessionPayload } from "./session";

/**
 * Reads and verifies the current session from incoming HTTP cookies in Server Components or Actions.
 * Returns null if not authenticated or token is invalid.
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Retrieves the active user record for the current server session.
 * Enforces isActive check.
 */
export async function getCurrentServerUser() {
  const session = await getServerSession();
  if (!session || !session.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}
