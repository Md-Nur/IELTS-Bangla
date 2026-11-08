import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { Role, AttemptStatus } from "@prisma/client";
import { createSessionToken } from "@/lib/auth/session";
import { SectionDTO } from "@/lib/services/examAttemptService";
import { POST as startRoute } from "../start/route";
import { GET as contentRoute } from "../[attemptId]/route";

describe("Exam API Routes (HTTP Contract Verification)", () => {
  const timestamp = Date.now();
  let tokenA: string;
  let tokenB: string;
  const testSlug = "academic-reading-mock-01";
  const createdAttemptIds: string[] = [];
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    // 1. Create Student A
    const userA = await prisma.user.create({
      data: {
        email: `api_student_a_${timestamp}@example.com`,
        name: "API Student A",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(userA.id);
    tokenA = await createSessionToken({
      userId: userA.id,
      email: userA.email,
      role: userA.role,
    });

    // 2. Create Student B
    const userB = await prisma.user.create({
      data: {
        email: `api_student_b_${timestamp}@example.com`,
        name: "API Student B",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(userB.id);
    tokenB = await createSessionToken({
      userId: userB.id,
      email: userB.email,
      role: userB.role,
    });
  });

  afterAll(async () => {
    if (createdAttemptIds.length > 0) {
      await prisma.studentAnswer.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
      await prisma.testAttempt.deleteMany({
        where: { id: { in: createdAttemptIds } },
      });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
  });

  // -----------------------------------------------------------------
  // 1. Unauthenticated Requests
  // -----------------------------------------------------------------
  it("rejects unauthenticated requests with 401 Unauthorized", async () => {
    // POST /api/exam/start without auth
    const reqStart = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testSlug }),
    });

    const resStart = await startRoute(reqStart);
    expect(resStart.status).toBe(401);
    const jsonStart = await resStart.json();
    expect(jsonStart.code).toBe("UNAUTHORIZED");

    // GET /api/exam/[attemptId] without auth
    const reqContent = new Request("http://localhost:3000/api/exam/fake-id", {
      method: "GET",
    });

    const resContent = await contentRoute(reqContent, {
      params: Promise.resolve({ attemptId: "fake-id" }),
    });
    expect(resContent.status).toBe(401);
    const jsonContent = await resContent.json();
    expect(jsonContent.code).toBe("UNAUTHORIZED");
  });

  // -----------------------------------------------------------------
  // 2. Validation & Invalid Test Identifiers
  // -----------------------------------------------------------------
  it("rejects invalid request bodies with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({}), // empty
    });

    const res = await startRoute(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 for non-existent test slug", async () => {
    const req = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ testSlug: "non-existent-test-404" }),
    });

    const res = await startRoute(req);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.code).toBe("TEST_NOT_FOUND");
  });

  // -----------------------------------------------------------------
  // 3. Successful Attempt Creation via API
  // -----------------------------------------------------------------
  it("creates attempt with 201 Created and database-authoritative time", async () => {
    const req = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ testSlug }),
    });

    const res = await startRoute(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.attemptId).toBeDefined();
    expect(json.data.isResumed).toBe(false);
    expect(json.data.totalQuestions).toBe(40);
    expect(json.data.remainingSeconds).toBeGreaterThan(3500);

    createdAttemptIds.push(json.data.attemptId);
  });

  // -----------------------------------------------------------------
  // 4. Repeated Start Request (Resume)
  // -----------------------------------------------------------------
  it("returns 200 OK and resumes existing active attempt on repeated start", async () => {
    const req = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ testSlug }),
    });

    const res = await startRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.attemptId).toBe(createdAttemptIds[0]);
    expect(json.data.isResumed).toBe(true);
  });

  // -----------------------------------------------------------------
  // 5. Attempt Ownership & IDOR Protection
  // -----------------------------------------------------------------
  it("returns 403 Forbidden when Student B tries to access Student A's exam content", async () => {
    const attemptId = createdAttemptIds[0];

    const req = new Request(`http://localhost:3000/api/exam/${attemptId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenB}`, // Student B
      },
    });

    const res = await contentRoute(req, {
      params: Promise.resolve({ attemptId }),
    });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("FORBIDDEN_ATTEMPT_ACCESS");
  });

  // -----------------------------------------------------------------
  // 6. Exam Content Retrieval & Answer-Key Security
  // -----------------------------------------------------------------
  it("returns 200 OK with full exam content and ZERO answer keys for the owner", async () => {
    const attemptId = createdAttemptIds[0];

    const req = new Request(`http://localhost:3000/api/exam/${attemptId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenA}`, // Student A (Owner)
      },
    });

    const res = await contentRoute(req, {
      params: Promise.resolve({ attemptId }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.attempt.id).toBe(attemptId);
    expect(json.data.sections.length).toBe(3);

    // Verify ordering
    const allQuestions = (json.data.sections as SectionDTO[])
      .flatMap((s) => s.questionGroups)
      .flatMap((g) => g.questions);
    expect(allQuestions.length).toBe(40);
    expect(allQuestions[0].questionNumber).toBe(1);
    expect(allQuestions[39].questionNumber).toBe(40);

    // Strict security check: Ensure answer keys and rationales are completely omitted
    const stringified = JSON.stringify(json);
    expect(stringified).not.toContain("acceptedAnswers");
    expect(stringified).not.toContain("acceptedText");
    expect(stringified).not.toContain("explanation");
    expect(stringified).not.toContain("bandConversionTable");
    expect(stringified).not.toContain("scoringConfig");
  });

  // -----------------------------------------------------------------
  // 7. Expired Attempt Handling
  // -----------------------------------------------------------------
  it("returns 403 ATTEMPT_EXPIRED when attempting to retrieve content for an expired attempt", async () => {
    // Dedicated user for expired attempt so there is no collision with student A's active attempt
    const expiredUser = await prisma.user.create({
      data: {
        email: `expired_student_${timestamp}@example.com`,
        name: "Expired Student",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(expiredUser.id);
    const expiredToken = await createSessionToken({
      userId: expiredUser.id,
      email: expiredUser.email,
      role: expiredUser.role,
    });

    const now = new Date();
    const test = await prisma.test.findUniqueOrThrow({
      where: { slug: testSlug },
      include: {
        publishedVersions: { where: { isArchived: false }, take: 1 },
      },
    });

    const expired = await prisma.testAttempt.create({
      data: {
        userId: expiredUser.id,
        testId: test.id,
        testVersionId: test.publishedVersions[0].id,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date(now.getTime() - 100 * 60 * 1000),
        expiresAt: new Date(now.getTime() - 40 * 60 * 1000), // expired 40 mins ago
      },
    });
    createdAttemptIds.push(expired.id);

    const req = new Request(`http://localhost:3000/api/exam/${expired.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });

    const res = await contentRoute(req, {
      params: Promise.resolve({ attemptId: expired.id }),
    });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("ATTEMPT_EXPIRED");
  });
});
