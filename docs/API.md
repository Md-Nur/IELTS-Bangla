# API Specification — IELTS Bangla

**Document type:** Living API Contracts & Route Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Full-Stack Developer  
**Status:** Validated Pre-Migration API Specification  
**Last updated:** 2026-11-08  

---

## 1. Overview & Conventions

All API routes and server actions in IELTS Bangla adhere to standard RESTful and Next.js App Router patterns:
- **Authentication:** Stateless, secure HTTP-only session cookie verified on every protected route.
- **Validation:** All incoming request bodies validated using Zod schemas.
- **Error Responses:** Standard JSON structure `{ error: string, code?: string, details?: unknown }`.
- **Authorization:** Handled strictly on the server; student actions are scoped strictly to `session.user.id`.
- **Answer Key Security:** Answer keys, rationales, and accepted alternatives are NEVER delivered to the client during an active test session.

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Purpose:** Register a new student account.
- **Role Assignment:** Always assigned `Role.STUDENT`. Any `role` field in the request body is stripped/ignored.
- **Authoritative Activation:** Newly created users are assigned `isActive: true`.
- **Request Body:**
  ```json
  {
    "name": "Nur Alam",
    "email": "student@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response (201):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT", "isActive": true } }`
- **Errors:** 
  - `400 Bad Request` (validation failed).
  - `409 Conflict` (email already registered).

### `POST /api/auth/login`
- **Purpose:** Authenticate user credentials and issue secure HTTP-only session cookie.
- **Account Verification:** If `user.isActive === false`, authentication is rejected with `401 Unauthorized` (`"Account is deactivated"`).
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`
- **Errors:** `401 Unauthorized` (invalid credentials or deactivated account).

### `POST /api/auth/logout`
- **Purpose:** Invalidate session and clear session cookie.
- **Response (200):** `{ "success": true }`

---

## 3. Examination Endpoints (Student)

### `GET /api/tests`
- **Purpose:** List all active, published tests available for examination.
- **Filter Rules:**
  - `Test.status = 'ACTIVE'`
  - `PublishedTestVersion.isArchived = false`
- **Query Params:** `?module=READING&category=ACADEMIC`
- **Response (200):**
  ```json
  [
    {
      "id": "cuid_test_1",
      "title": "IELTS Academic Reading Mock Test 01",
      "slug": "academic-reading-mock-01",
      "module": "READING",
      "category": "ACADEMIC",
      "durationMinutes": 60,
      "totalQuestions": 40,
      "versionNumber": 1
    }
  ]
  ```

### `POST /api/exam/start`
- **Purpose:** Initialize a new test attempt for the authenticated student against an active published test version, or resume an existing active attempt.
- **Authentication:** Required (`Bearer <token>` header or `ib_session` HTTP-only cookie).
- **Database-Level Single Active Attempt Policy:**
  - Enforced by PostgreSQL partial unique index:
    `CREATE UNIQUE INDEX "idx_unique_active_attempt_per_test" ON "TestAttempt" ("userId", "testId") WHERE status = 'IN_PROGRESS';`
  - A student can have at most ONE `IN_PROGRESS` attempt per logical test.
  - If the student already has an active attempt, the endpoint returns the existing attempt (`isResumed: true`) with HTTP status `200 OK`.
  - Concurrent start requests are handled safely: any simultaneous insert hitting PostgreSQL constraint `P2002` catches the collision and retrieves the winning active attempt.
  - Start and expiration timestamps are strictly server-authoritative (`SELECT NOW() as db_now`).
- **Request Body:**
  ```json
  {
    "testSlug": "academic-reading-mock-01"
  }
  ```
  *(Accepts either `testSlug` or `testId`)*
- **Response (201 Created for new attempt, 200 OK for resumed attempt):**
  ```json
  {
    "success": true,
    "data": {
      "attemptId": "cuid_attempt_123",
      "testId": "cuid_test_1",
      "testSlug": "academic-reading-mock-01",
      "testTitle": "Academic Reading · Mock Test 01",
      "testVersionId": "cmw86bndp005wlqu6v8yuiwsx",
      "versionNumber": 1,
      "status": "IN_PROGRESS",
      "startedAt": "2026-11-09T00:45:00.000Z",
      "expiresAt": "2026-11-09T01:45:00.000Z",
      "durationMinutes": 60,
      "totalQuestions": 40,
      "serverTime": "2026-11-09T00:45:00.000Z",
      "remainingSeconds": 3600,
      "isResumed": false
    }
  }
  ```
- **Errors:**
  - `401 Unauthorized` (unauthenticated).
  - `400 Bad Request` (invalid body).
  - `403 Forbidden` (account deactivated).
  - `404 Not Found` (test not found or no published version available).

### `GET /api/exam/[attemptId]`
- **Purpose:** Retrieve full published exam content (passages, groups, questions) and saved answers for an active attempt.
- **Authentication:** Required (`Bearer <token>` header or `ib_session` HTTP-only cookie).
- **Authorization & Security Guards:**
  - **Ownership:** Scoped strictly to `attempt.userId === session.user.id`. Access by any other user returns `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS`).
  - **Status:** Requires `attempt.status === 'IN_PROGRESS'`. Other statuses return `409 Conflict` (`ATTEMPT_NOT_IN_PROGRESS`).
  - **Authoritative Deadline:** Evaluated against database clock (`SELECT NOW() as db_now`). If `db_now >= attempt.expiresAt`, access is rejected with `403 Forbidden` (`ATTEMPT_EXPIRED`).
  - **Strict Answer Key Containment:** `acceptedAnswers`, `explanation`, and `bandConversionTable` are completely omitted from the response.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "attempt": {
        "id": "cuid_attempt_123",
        "testId": "cuid_test_1",
        "testSlug": "academic-reading-mock-01",
        "testTitle": "Academic Reading · Mock Test 01",
        "testVersionId": "cmw86bndp005wlqu6v8yuiwsx",
        "versionNumber": 1,
        "status": "IN_PROGRESS",
        "startedAt": "2026-11-09T00:45:00.000Z",
        "expiresAt": "2026-11-09T01:45:00.000Z",
        "durationMinutes": 60,
        "totalQuestions": 40,
        "serverTime": "2026-11-09T00:45:00.000Z",
        "remainingSeconds": 3600
      },
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
              "contextOptions": null,
              "questions": [
                {
                  "id": "q_1",
                  "questionNumber": 1,
                  "prompt": "Karl von Drais was an engineer by profession.",
                  "options": null
                }
              ]
            }
          ]
        }
      ],
      "savedAnswers": [
        {
          "questionId": "q_1",
          "answerText": "FALSE",
          "isFlaggedForReview": false,
          "lastSavedAt": "2026-11-09T00:46:12.000Z"
        }
      ]
    }
  }
  ```
- **Errors:**
  - `401 Unauthorized` (unauthenticated).
  - `400 Bad Request` (invalid attempt ID).
  - `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS` or `ATTEMPT_EXPIRED`).
  - `404 Not Found` (attempt not found).
  - `409 Conflict` (`ATTEMPT_NOT_IN_PROGRESS`).

### `PUT /api/exam/[attemptId]/answers`
- **Purpose:** Reliable, debounced autosave endpoint for student answers and review flags with row-level locking.
- **Authentication:** Required (`Bearer <token>` header or `ib_session` HTTP-only cookie).
- **Concurrency & Locking Rules:**
  - Inside a transaction, acquires pessimistic row lock `SELECT id, "userId", "testVersionId", status, "expiresAt" FROM "TestAttempt" WHERE id = $1 FOR UPDATE`.
  - Verifies student ownership (`attempt.userId === session.user.id`). Any mismatch returns `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS`).
  - Verifies server time against database clock (`SELECT NOW() as db_now`). If `db_now >= expiresAt`, returns `403 Forbidden` (`ATTEMPT_EXPIRED`).
  - Verifies status is `IN_PROGRESS`. If `SUBMITTED`, `TIMED_OUT`, or `ABANDONED`, returns `409 Conflict` (`ATTEMPT_NOT_IN_PROGRESS`).
  - Validates `questionId` belongs to the attempt's `testVersionId` via `PublishedQuestion` lookup. If not found or mismatch, returns `400 Bad Request` (`QUESTION_NOT_IN_VERSION`).
  - Validates answer payload size ($\le 500$ characters) via Zod schema. If invalid, returns `400 Bad Request` (`VALIDATION_ERROR`).
  - Performs an idempotent upsert on `StudentAnswer` using composite foreign keys `(attemptId, testVersionId)` and `(testVersionId, questionId)`.
  - Sets `lastSavedAt: db_now`.
  - **Security Guarantee:** Does NOT calculate or return correctness (`isCorrect` and `scoreAwarded` remain `null`). Never exposes accepted answers, answer keys, or evaluation data.
- **Request Body:**
  ```json
  {
    "questionId": "cmw86bne4005ylqu6j1a7h4q8",
    "answerText": "FALSE",
    "isFlaggedForReview": false
  }
  ```
  *(Note: `answerText` can be `null` or a string up to 500 chars; `isFlaggedForReview` is a boolean)*
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "questionId": "cmw86bne4005ylqu6j1a7h4q8",
      "answerText": "FALSE",
      "isFlaggedForReview": false,
      "lastSavedAt": "2026-11-09T01:05:00.000Z"
    }
  }
  ```
- **Errors:**
  - `401 Unauthorized` (unauthenticated).
  - `400 Bad Request` (`VALIDATION_ERROR` or `QUESTION_NOT_IN_VERSION`).
  - `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS` or `ATTEMPT_EXPIRED`).
  - `404 Not Found` (`ATTEMPT_NOT_FOUND`).
  - `409 Conflict` (`ATTEMPT_NOT_IN_PROGRESS`).

### `POST /api/exam/[attemptId]/finalize`
- **Purpose:** Securely finalize an active examination attempt, evaluate answers against the immutable published answer key, calculate raw score (0..40) and estimated IELTS band (0.0..9.0), and persist the evaluation snapshot atomically.
- **Authentication:** Required (`Bearer <token>` header or `ib_session` HTTP-only cookie).
- **Request Body (Optional):**
  ```json
  {
    "reason": "MANUAL" // or "TIMEOUT"
  }
  ```
- **Single Database Transaction & Concurrency Guarantees:**
  - Acquires row-level pessimistic lock: `SELECT ... FROM "TestAttempt" WHERE id = $1 FOR UPDATE`.
  - Queries server-authoritative time: `SELECT NOW() as db_now`.
  - Enforces attempt ownership (`attempt.userId === session.user.id`). IDOR attempts return `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS`).
  - **Idempotency Guarantee:** If the attempt is already `SUBMITTED` or `TIMED_OUT`, returns the committed `EvaluationResult` without re-scoring or creating duplicate records.
  - **Deadline Enforcement:**
    - If `reason === "TIMEOUT"` and `db_now < expiresAt`, request is rejected with `400 Bad Request` (`DEADLINE_NOT_PASSED`); zero state mutation occurs.
    - If `db_now >= expiresAt`, attempt transitions strictly to `TIMED_OUT` (even if submitted with `MANUAL`).
    - If `db_now < expiresAt`, attempt transitions to `SUBMITTED`.
  - **Scoring & Integrity:**
    - Loads published sections, groups, questions, and accepted answers for the attempt's `testVersionId`.
    - Evaluates student answers using pure deterministic scoring engine (`reading_v1.0.0`).
    - Treats unanswered questions as zero.
    - Updates `isCorrect` and `scoreAwarded` on all 40 `StudentAnswer` records.
    - Creates immutable `EvaluationResult` record with `sectionBreakdown`, `questionBreakdown`, and `scoringConfig`.
  - **Atomic Commit / Rollback:** Status update, student answer evaluation, and `EvaluationResult` creation execute in a single atomic transaction. Any error causes a complete rollback.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "attemptId": "cuid_attempt_123",
      "testId": "cuid_test_1",
      "testSlug": "academic-reading-mock-01",
      "testTitle": "Academic Reading · Mock Test 01",
      "testVersionId": "cmw86bndp005wlqu6v8yuiwsx",
      "versionNumber": 1,
      "status": "SUBMITTED",
      "startedAt": "2026-11-09T01:00:00.000Z",
      "expiresAt": "2026-11-09T02:00:00.000Z",
      "submittedAt": "2026-11-09T01:52:00.000Z",
      "timeSpentSeconds": 3120,
      "totalQuestions": 40,
      "totalAttempted": 40,
      "totalCorrect": 38,
      "totalIncorrect": 2,
      "rawScore": 38,
      "estimatedBand": 8.5,
      "scoringVersion": "reading_v1.0.0",
      "sectionBreakdown": {
        "passage1": { "sectionIndex": 1, "totalQuestions": 13, "attempted": 13, "correct": 13, "rawScore": 13, "accuracyPercentage": 100 },
        "passage2": { "sectionIndex": 2, "totalQuestions": 13, "attempted": 13, "correct": 12, "rawScore": 12, "accuracyPercentage": 92 },
        "passage3": { "sectionIndex": 3, "totalQuestions": 14, "attempted": 14, "correct": 13, "rawScore": 13, "accuracyPercentage": 93 }
      },
      "questionBreakdown": [
        {
          "questionId": "cmw86bne4005ylqu6j1a7h4q8",
          "questionNumber": 1,
          "studentAnswer": "FALSE",
          "acceptedAnswers": ["FALSE", "F"],
          "isCorrect": true,
          "scoreAwarded": 1,
          "wordLimitExceeded": false,
          "explanation": "Para 1: ‘Drais was a civil servant…’."
        }
      ],
      "redirectUrl": "/results/cuid_attempt_123"
    }
  }
  ```
- **Errors:**
  - `401 Unauthorized` (unauthenticated).
  - `400 Bad Request` (`VALIDATION_ERROR` or `DEADLINE_NOT_PASSED`).
  - `403 Forbidden` (`FORBIDDEN_ATTEMPT_ACCESS`).
  - `404 Not Found` (`ATTEMPT_NOT_FOUND`).
  - `409 Conflict` (`ATTEMPT_NOT_IN_PROGRESS`).

### `GET /api/exam/[attemptId]/results`
- **Purpose:** Fetch detailed scored results, per-question correctness, and detailed explanations for review.
- **Authorization & Pre-condition:**
  - Allowed ONLY if `TestAttempt.status` is `SUBMITTED` or `TIMED_OUT`.
  - Allowed ONLY if `EvaluationResult` exists.
  - Allowed ONLY for the attempt's owner or an admin.
  - If attempt is still `IN_PROGRESS`, returns `403 Forbidden`.
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

## 4. Admin Management Endpoints (Admin Only)

All endpoints below require server session `role === 'ADMIN'`. Unauthorized requests return `403 Forbidden`.

### `GET /api/admin/tests`
- **Purpose:** List all tests (active, archived, drafts, and published versions).

### `POST /api/admin/tests`
- **Purpose:** Create a new draft test container.

### `PUT /api/admin/tests/[testId]/draft`
- **Purpose:** Update draft test metadata, sections, question groups, questions, and accepted answers.

### `POST /api/admin/tests/[testId]/publish`
- **Purpose:** Validate draft integrity and create an immutable `PublishedTestVersion` in a single transaction.
- **Validation Checked:**
  - Continuous question numbering (1 to `totalQuestions`).
  - Total question count matches test definition.
  - Every question has accepted answers.
  - Valid question types and options.
  - Complete band conversion table covering 0 to `totalQuestions`.
- **Response (201):** `{ "success": true, "versionNumber": 2, "publishedVersionId": "..." }`
- **Errors:** `422 Unprocessable Entity` (publishing validation failed with detailed error list).

### `POST /api/admin/versions/[versionId]/archive`
- **Purpose:** Set `isArchived: true` on a published version (removes it from student catalog without deleting historical attempt data).
