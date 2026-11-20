/**
 * Optional Development Seed Script for Demo Student Account
 *
 * Usage: bun run seed:demo
 *
 * DO NOT RUN IN PRODUCTION.
 * This is strictly an isolated helper for developers needing a local student account.
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedDemoUser() {
  const email = process.env.DEV_DEMO_EMAIL || "student@ieltsbangla.com";
  const password = process.env.DEV_DEMO_PASSWORD || "StudentPass123!";
  const name = "Demo Student";

  console.log(`[DEV SEED] Checking for development demo user: ${email}...`);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
      name,
    },
    create: {
      email,
      name,
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  console.log(`[DEV SEED] Successfully ensured development student account exists.`);
  console.log(`[DEV SEED] ID: ${user.id}`);
  console.log(`[DEV SEED] Email: ${user.email}`);
  console.log(`[DEV SEED] Role: ${user.role}`);
}

seedDemoUser()
  .catch((err) => {
    console.error("[DEV SEED] Error seeding demo student:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
