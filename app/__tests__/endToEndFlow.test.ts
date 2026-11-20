import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { POST as registerRoute } from "@/app/api/auth/register/route";
import { POST as loginRoute } from "@/app/api/auth/login/route";
import { POST as logoutRoute } from "@/app/api/auth/logout/route";
import { POST as startExamRoute } from "@/app/api/exam/start/route";
import { PUT as autosaveRoute } from "@/app/api/exam/[attemptId]/answers/route";
import { POST as finalizeRoute } from "@/app/api/exam/[attemptId]/finalize/route";
import { GET as getResultRoute } from "@/app/api/exam/[attemptId]/result/route";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

describe("End-to-End User Journey: Public Landing -> Registration -> Dashboard -> Test Taking -> Scoring Review", () => {
  const timestamp = Date.now();
  const testEmail = `e2e_student_${timestamp}@ieltsbangla.com`;
  const testPassword = "ValidStudentPass123!";
  const testName = "E2E Candidate";

  let studentId = "";
  let sessionToken = "";
  let attemptId = "";

  afterAll(async () => {
    // Cleanup any created student and attempts
    if (studentId) {
      await prisma.evaluationResult.deleteMany({
        where: { attempt: { userId: studentId } },
      });
      await prisma.studentAnswer.deleteMany({
        where: { attempt: { userId: studentId } },
      });
      await prisma.testAttempt.deleteMany({
        where: { userId: studentId },
      });
      await prisma.user.deleteMany({
        where: { id: studentId },
      });
    }
  });

  it("1. Unauthenticated user is protected from accessing /dashboard", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login?redirect=%2Fdashboard");
  });

  it("2. New candidate registers an account at /signup", async () => {
    const regReq = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });

    const regRes = await registerRoute(regReq);
    expect(regRes.status).toBe(201);

    const regData = await regRes.json();
    expect(regData.success).toBe(true);
    expect(regData.user.email).toBe(testEmail);
    expect(regData.user.name).toBe(testName);
    expect(regData.user.role).toBe("STUDENT");
    expect(regData.token).toBeDefined();

    studentId = regData.user.id;
    sessionToken = regData.token;
  });

  it("3. Authenticated candidate is granted access to /dashboard by proxy", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("4. Logged in candidate visiting /login or /signup is redirected to /dashboard", async () => {
    const req = new NextRequest("http://localhost:3000/login", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("5. Candidate logs out and logs in via /login", async () => {
    // Logout
    const logoutRes = await logoutRoute();
    expect(logoutRes.status).toBe(200);

    // Login with valid credentials
    const loginReq = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginRes = await loginRoute(loginReq);
    expect(loginRes.status).toBe(200);

    const loginData = await loginRes.json();
    expect(loginData.success).toBe(true);
    expect(loginData.user.id).toBe(studentId);
    expect(loginData.token).toBeDefined();

    sessionToken = loginData.token;
  });

  it("6. Student starts Academic Reading Mock Test 01 from the dashboard", async () => {
    const startReq = new Request("http://localhost:3000/api/exam/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ testSlug: "academic-reading-mock-01" }),
    });

    const startRes = await startExamRoute(startReq);
    expect(startRes.status).toBe(201);

    const startData = await startRes.json();
    expect(startData.success).toBe(true);
    expect(startData.data.attemptId).toBeDefined();
    expect(startData.data.durationMinutes).toBe(60);
    expect(startData.data.totalQuestions).toBe(40);

    attemptId = startData.data.attemptId;
  });

  it("7. Student answers questions and autosaves during the exam", async () => {
    // Fetch question 1 ID
    const q1 = await prisma.publishedQuestion.findFirst({
      where: {
        questionNumber: 1,
        questionGroup: {
          section: {
            testVersion: {
              test: { slug: "academic-reading-mock-01" },
            },
          },
        },
      },
    });
    expect(q1).not.toBeNull();

    const saveReq = new Request(`http://localhost:3000/api/exam/${attemptId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        questionId: q1!.id,
        answerText: "TRUE",
        isFlaggedForReview: false,
      }),
    });

    const saveRes = await autosaveRoute(saveReq, {
      params: Promise.resolve({ attemptId }),
    });
    expect(saveRes.status).toBe(200);

    const saveData = await saveRes.json();
    expect(saveData.success).toBe(true);
    expect(saveData.data.answerText).toBe("TRUE");
  });

  it("8. Student finalizes test and receives server-authoritative score and band review", async () => {
    const finalReq = new NextRequest(`http://localhost:3000/api/exam/${attemptId}/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ reason: "MANUAL" }),
    });

    const finalRes = await finalizeRoute(finalReq, {
      params: Promise.resolve({ attemptId }),
    });
    expect(finalRes.status).toBe(200);

    const finalData = await finalRes.json();
    expect(finalData.success).toBe(true);
    expect(finalData.data.status).toBe("SUBMITTED");
    expect(finalData.data.totalQuestions).toBe(40);
    expect(finalData.data.rawScore).toBeDefined();
    expect(finalData.data.estimatedBand).toBeDefined();

    // Fetch result view
    const resultReq = new NextRequest(`http://localhost:3000/api/exam/${attemptId}/result`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const resultRes = await getResultRoute(resultReq, {
      params: Promise.resolve({ attemptId }),
    });
    expect(resultRes.status).toBe(200);

    const resultData = await resultRes.json();
    expect(resultData.success).toBe(true);
    expect(resultData.data.testTitle).toBe("Academic Reading · Mock Test 01");
    expect(resultData.data.totalQuestions).toBe(40);
    expect(typeof resultData.data.rawScore).toBe("number");
    expect(resultData.data.sections.length).toBe(3);
  });
});
