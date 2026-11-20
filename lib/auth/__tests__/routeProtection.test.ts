import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

describe("Route Protection & Proxy Tests", () => {
  it("redirects unauthenticated users trying to access /dashboard to /login", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toBe("http://localhost:3000/login?redirect=%2Fdashboard");
  });

  it("redirects unauthenticated users trying to access an active exam to /login", async () => {
    const req = new NextRequest("http://localhost:3000/exam/attempt-12345");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toBe("http://localhost:3000/login?redirect=%2Fexam%2Fattempt-12345");
  });

  it("redirects unauthenticated users trying to access results to /login", async () => {
    const req = new NextRequest("http://localhost:3000/results/attempt-12345");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toBe("http://localhost:3000/login?redirect=%2Fresults%2Fattempt-12345");
  });

  it("allows unauthenticated access to public routes without redirection", async () => {
    const publicPaths = ["/login", "/signup"];

    for (const path of publicPaths) {
      const req = new NextRequest(`http://localhost:3000${path}`);
      const res = await proxy(req);
      // Status is 200 (NextResponse.next())
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("redirects already authenticated users away from /login to /dashboard", async () => {
    const token = await createSessionToken({
      userId: "user_test_123",
      email: "test@example.com",
      role: "STUDENT",
    });

    const req = new NextRequest("http://localhost:3000/login", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects already authenticated users away from /signup to /dashboard", async () => {
    const token = await createSessionToken({
      userId: "user_test_123",
      email: "test@example.com",
      role: "STUDENT",
    });

    const req = new NextRequest("http://localhost:3000/signup", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects non-admin authenticated users away from /admin to /dashboard", async () => {
    const token = await createSessionToken({
      userId: "student_user",
      email: "student@example.com",
      role: "STUDENT",
    });

    const req = new NextRequest("http://localhost:3000/admin/settings", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("allows authenticated users to access protected routes", async () => {
    const token = await createSessionToken({
      userId: "valid_student",
      email: "valid@example.com",
      role: "STUDENT",
    });

    const req = new NextRequest("http://localhost:3000/dashboard", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
