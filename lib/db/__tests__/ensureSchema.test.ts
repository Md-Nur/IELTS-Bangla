import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  findUserByEmailSafe,
  findUserByIdSafe,
  createUserSafe,
} from "../ensureSchema";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

describe("Database Resilience & Schema Auto-Healing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("findUserByEmailSafe", () => {
    it("returns user normally when column exists", async () => {
      const mockUser = {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        passwordHash: "hash",
        role: Role.STUDENT,
        isActive: true,
      };
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser as never);

      const res = await findUserByEmailSafe("test@example.com");
      expect(res).toEqual(mockUser);
    });

    it("handles P2022 by attempting schema healing and retrying", async () => {
      const mockUser = {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        passwordHash: "hash",
        role: Role.STUDENT,
        isActive: true,
      };
      const p2022 = {
        code: "P2022",
        meta: { column: "User.isActive" },
        message: "The column User.isActive does not exist in the current database.",
      };

      const spyFind = vi
        .spyOn(prisma.user, "findUnique")
        .mockRejectedValueOnce(p2022)
        .mockResolvedValueOnce(mockUser as never);

      const spyRaw = vi.spyOn(prisma, "$executeRawUnsafe").mockResolvedValue(1 as never);

      const res = await findUserByEmailSafe("test@example.com");
      expect(spyRaw).toHaveBeenCalled();
      expect(res).toEqual(mockUser);
      expect(spyFind).toHaveBeenCalledTimes(2);
    });

    it("falls back to querying without isActive if healing fails", async () => {
      const legacyUser = {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        passwordHash: "hash",
        role: Role.STUDENT,
      };
      const p2022 = {
        code: "P2022",
        meta: { column: "User.isActive" },
        message: "The column User.isActive does not exist in the current database.",
      };

      vi.spyOn(prisma.user, "findUnique")
        .mockRejectedValueOnce(p2022) // Initial attempt with isActive
        .mockRejectedValueOnce(p2022) // Retry after heal still fails
        .mockResolvedValueOnce(legacyUser as never); // Fallback without isActive

      vi.spyOn(prisma, "$executeRawUnsafe").mockRejectedValue(new Error("Permission denied"));

      const res = await findUserByEmailSafe("test@example.com");
      expect(res).toEqual({ ...legacyUser, isActive: true });
    });
  });

  describe("findUserByIdSafe", () => {
    it("returns user normally when column exists", async () => {
      const mockUser = {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        role: Role.STUDENT,
        isActive: true,
        targetBand: 7.5,
        examDate: null,
        createdAt: new Date(),
      };
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser as never);

      const res = await findUserByIdSafe("u1");
      expect(res).toEqual(mockUser);
    });

    it("falls back safely if isActive column is missing", async () => {
      const legacyUser = {
        id: "u1",
        email: "test@example.com",
        name: "Test",
        role: Role.STUDENT,
        targetBand: 7.5,
        examDate: null,
        createdAt: new Date(),
      };
      const p2022 = {
        code: "P2022",
        meta: { column: "User.isActive" },
        message: "The column User.isActive does not exist in the current database.",
      };

      vi.spyOn(prisma.user, "findUnique")
        .mockRejectedValueOnce(p2022)
        .mockRejectedValueOnce(p2022)
        .mockResolvedValueOnce(legacyUser as never);

      vi.spyOn(prisma, "$executeRawUnsafe").mockResolvedValue(1 as never);

      const res = await findUserByIdSafe("u1");
      expect(res).toEqual({ ...legacyUser, isActive: true });
    });
  });

  describe("createUserSafe", () => {
    it("creates user normally when column exists", async () => {
      const newUser = {
        id: "u2",
        email: "new@example.com",
        name: "New Student",
        role: Role.STUDENT,
        isActive: true,
      };
      vi.spyOn(prisma.user, "create").mockResolvedValue(newUser as never);

      const res = await createUserSafe({
        email: "new@example.com",
        name: "New Student",
        passwordHash: "hash",
        role: Role.STUDENT,
      });

      expect(res).toEqual(newUser);
    });
  });
});
