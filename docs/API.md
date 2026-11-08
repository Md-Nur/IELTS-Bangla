# API Specification — IELTS Bangla

**Document type:** Living API Contracts & Route Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Full-Stack Developer  
**Status:** Revised Specification (Pre-Migration Architecture Review)  
**Last updated:** 2026-11-08  

---

## 1. Overview & Conventions

All API routes and server actions in IELTS Bangla adhere to standard RESTful and Next.js App Router patterns:
- **Authentication:** Stateless, secure HTTP-only session cookie verified on every protected route.
- **Validation:** All incoming request bodies validated using Zod.
- **Error Responses:** Standard JSON structure `{ error: string, code?: string, details?: unknown }`.
- **Authorization:** Handled strictly on the server; student actions are scoped strictly to `session.user.id`.
- **Answer Key Protection:** Answer keys, rationales, and accepted alternatives are NEVER delivered to the client during an active test session.

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Purpose:** Register a new student account.
- **Request Body:**
  ```json
  {
    "name": "Nur Alam",
    "email": "student@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response (201):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT" } }`
- **Errors:** `400 Bad Request` (validation failed), `409 Conflict` (email already registered).

### `POST /api/auth/login`
- **Purpose:** Authenticate user and issue secure HTTP-only session cookie.
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`
- **Errors:** `401 Unauthorized` (invalid credentials).

### `POST /api/auth/logout`
- **Purpose:** Invalidate session and clear session cookie.
- **Response (200):** `{ "success": true }`

---

## 3. Examination Endpoints (Student)

### `GET /api/tests`
- **Purpose:** List all currently published tests available for examination.
- **Query Params:** `?module=READING&category=ACADEMIC`
- **Response (200):** Array of active test summaries (id, title, slug, durationMinutes, totalQuestions).

### `POST /api/exam/start`
- **Purpose:** Initialize a new test attempt for the authenticated student against an active `PublishedTestVersion`.
- **Request Body:** `{ "testSlug": "academic-reading-mock-01" }`
- **Response (201):**
  ```json
  {
    "attemptId": "cuid_attempt_123",
    "testVersionId": "cuid_ver_01",
    "testTitle": "IELTS Academic Reading Mock Test 01",
    "startedAt": "2026-11-08T08:30:00.000Z",
    "expiresAt": "2026-11-08T09:30:00.000Z",
    "durationMinutes": 60,
    "totalQuestions": 40,
    "sections": [
      {
        "id": "sec_1",
        "orderIndex": 1,
        "title": "The Bicycle: From Wooden Hobby-Horse to Everyday Machine",
        "passageText": "...",
        "questionGroups": [
          {
            "id": "grp_1",
            "orderIndex": 1,
            "instruction": "Do the following statements agree with the information in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.",
            "questionType": "TRUE_FALSE_NOT_GIVEN",
            "wordLimit": null,
            "questions": [
              {
                "id": "q_1",
                "questionNumber": 1,
                "prompt": "The inventor of the early two-wheeled machine was an engineer.",
                "options": null
              }
            ]
          }
        ]
      }
    ]
  }
  ```
  *(Security Notice: Correct answers, accepted alternatives, and rationales are strictly stripped from this payload.)*

### `POST /api/exam/[attemptId]/save`
- **Purpose:** Debounced autosave endpoint for student answers.
- **Request Body:**
  ```json
  {
    "questionId": "q_1",
    "answerText": "FALSE",
    "isFlaggedForReview": false
  }
  ```
- **Response (200):** `{ "success": true, "lastSavedAt": "2026-11-08T08:35:12.000Z" }`
- **Errors:** 
  - `403 Forbidden` (attempt does not belong to authenticated user).
  - `400 Bad Request` (question does not belong to attempt's published test version).
  - `409 Conflict` (attempt is already `SUBMITTED` or `TIMED_OUT`; writes are rejected).

### `POST /api/exam/[attemptId]/submit`
- **Purpose:** Final manual submission of an examination.
- **Behavior:**
  - Invokes `finalizeAndScoreAttempt(attemptId, { reason: 'MANUAL', actorUserId })`.
  - Atomically transitions attempt from `IN_PROGRESS` to `SUBMITTED`.
  - Evaluates all answers deterministically and records `EvaluationResult`.
  - Returns the evaluation summary.
- **Idempotency:** Repeated calls return the existing `EvaluationResult` with `alreadyFinalized: true`.
- **Response (200):**
  ```json
  {
    "success": true,
    "attemptId": "cuid_attempt_123",
    "status": "SUBMITTED",
    "rawScore": 38,
    "estimatedBand": 8.5,
    "totalQuestions": 40,
    "totalAttempted": 40,
    "totalCorrect": 38,
    "timeSpentSeconds": 3120,
    "redirectUrl": "/results/cuid_attempt_123"
  }
  ```

### `POST /api/exam/[attemptId]/timeout`
- **Purpose:** Authoritative expiration endpoint triggered automatically when the server-calculated deadline (`expiresAt`) is reached.
- **Behavior:**
  - Invokes `finalizeAndScoreAttempt(attemptId, { reason: 'TIMEOUT' })`.
  - Atomically transitions attempt from `IN_PROGRESS` to `TIMED_OUT`.
  - Evaluates saved answers and records `EvaluationResult`.
- **Response (200):** Same structure as `/submit`, with `"status": "TIMED_OUT"`.

### `GET /api/exam/[attemptId]/results`
- **Purpose:** Fetch full scored results, per-question correctness, and detailed explanations for review.
- **Access:** Only authorized after status is `SUBMITTED` or `TIMED_OUT`, and only for the attempt owner or an administrator.
- **Response (200):**
  ```json
  {
    "attemptId": "cuid_attempt_123",
    "status": "SUBMITTED",
    "rawScore": 38,
    "estimatedBand": 8.5,
    "scoringVersion": "reading_v1.0.0",
    "timeSpentSeconds": 3120,
    "sectionBreakdown": {
      "passage1": { "correct": 12, "total": 13 },
      "passage2": { "correct": 13, "total": 13 },
      "passage3": { "correct": 13, "total": 14 }
    },
    "questionBreakdown": [
      {
        "questionNumber": 1,
        "prompt": "The inventor of the early two-wheeled machine was an engineer.",
        "studentAnswer": "FALSE",
        "acceptedAnswers": ["FALSE"],
        "isCorrect": true,
        "scoreAwarded": 1,
        "explanation": "Para 2 calls him 'a German forester', not an engineer."
      }
    ]
  }
  ```

---

## 4. Admin Test Authoring Endpoints (Admin Only)

### `GET /api/admin/tests`
- **Purpose:** List all tests (drafts and published versions).

### `POST /api/admin/tests`
- **Purpose:** Create a new draft test container.

### `PUT /api/admin/tests/[testId]/draft`
- **Purpose:** Update draft test metadata, sections, question groups, questions, and accepted answers.

### `POST /api/admin/tests/[testId]/publish`
- **Purpose:** Freeze current draft and create a new immutable `PublishedTestVersion` with incremented version number.
- **Response (201):** `{ "success": true, "versionNumber": 2, "publishedVersionId": "..." }`

### `POST /api/admin/versions/[versionId]/archive`
- **Purpose:** Set `isArchived: true` on a published version (removes from new student listings without deleting historical attempts).
