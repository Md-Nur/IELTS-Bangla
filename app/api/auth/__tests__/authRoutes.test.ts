import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { POST as registerRoute } from "../register/route";
import { POST as loginRoute } from "../login/route";
import { POST as logoutRoute } from "../logout/route";

describe("Authentication API Routes", () => {
  const timestamp = Date.now();
  const testEmail = `auth_test_${timestamp}@example.com`;
  const testPassword = "SecurePassword123!";
  const createdUserIds: string[] = [];

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
  });

  it("registers a student account successfully with Role.STUDENT", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Auth Student",
        email: testEmail,
        password: testPassword,
        role: "ADMIN", // Attacker attempts privilege escalation
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.email).toBe(testEmail);
    expect(json.user.role).toBe("STUDENT"); // Escalation ignored, role is STUDENT
    expect(json.token).toBeDefined();

    createdUserIds.push(json.user.id);
  });

  it("rejects registration with existing email with 409 Conflict", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("authenticates valid credentials and issues session token", async () => {
    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.email).toBe(testEmail);
    expect(json.token).toBeDefined();
  });

  it("rejects invalid password with 401 Unauthorized", async () => {
    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword999!",
      }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.code).toBe("INVALID_CREDENTIALS");
  });

  it("rejects login for deactivated accounts with 403 Forbidden", async () => {
    // Deactivate user
    await prisma.user.update({
      where: { id: createdUserIds[0] },
      data: { isActive: false },
    });

    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("ACCOUNT_DEACTIVATED");
  });

  it("logs out and clears session cookie", async () => {
    const res = await logoutRoute();
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("Max-Age=0");
  });
});
