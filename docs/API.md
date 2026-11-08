# API Specification — IELTS Bangla (Revised)

**Document type:** Living API Contracts & Route Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Full-Stack Developer  
**Status:** Revised Specification (Phase 1: Reading MVP)  
**Last updated:** 2026-11-08  

---

## 1. Conventions & Principles

- **Authentication & Roles:** Every request is authenticated via signed HTTP-only cookie session (`userId`, `role`).
- **Authorization Scoping:** Students can only read/mutate their own attempts (`attempt.userId === session.userId`). Admins can access draft authoring and publishing APIs.
- **Validation:** All incoming request bodies are validated with Zod. Malformed payloads return `400 Bad Request` with structured error details.
- **Server-Authoritative Time:** Server timestamps (`startedAt`, `expiresAt`, `submittedAt`) govern all exam rules. Client clock discrepancies are rejected.
- **Zero Answer Key Leakage:** Client payloads for active attempts strictly omit accepted answers, rationales, and scoring keys.

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Nur Alam",
    "email": "nur@example.com",
    "password": "Password123!"
  }
  ```
- **Response (201):** `{ "success": true, "user": { "id": "cuid_1", "name": "Nur Alam", "email": "nur@example.com", "role": "STUDENT" } }`
- **Errors:** `400 Bad Request`, `409 Conflict` (email already registered).

### `POST /api/auth/login`
- **Request Body:** `{ "email": "nur@example.com", "password": "Password123!" }`
- **Response (200):** `{ "success": true, "user": { "id": "cuid_1", "email": "nur@example.com", "role": "STUDENT" } }`
- **Side Effect:** Sets `HttpOnly; Secure; SameSite=Lax; Path=/` session cookie.

### `POST /api/auth/logout`
- **Response (200):** `{ "success": true }` (Clears session cookie).

---

## 3. Student Examination Endpoints

### `GET /api/tests`
- **Query:** `?category=ACADEMIC&module=READING`
- **Response (200):** Returns published, non-archived tests available for mock examination:
  ```json
  [
    {
      "id": "test_cuid_1",
      "title": "IELTS Academic Reading Mock Test 01",
      "slug": "academic-reading-mock-01",
      "durationMinutes": 60,
      "totalQuestions": 40,
      "latestVersion": 1
    }
  ]
  ```

### `POST /api/exam/start`
- **Purpose:** Initializes an attempt referencing the active `PublishedTestVersion`.
- **Request Body:** `{ "testSlug": "academic-reading-mock-01" }`
- **Response (201):**
  ```json
  {
    "attemptId": "attempt_cuid_101",
    "testVersionId": "version_cuid_1",
    "testTitle": "IELTS Academic Reading Mock Test 01",
    "versionNumber": 1,
    "startedAt": "2026-11-08T08:50:00.000Z",
    "expiresAt": "2026-11-08T09:50:00.000Z",
    "durationMinutes": 60,
    "sections": [
      {
        "id": "section_1",
        "orderIndex": 1,
        "title": "The Bicycle: From Wooden Hobby-Horse to Everyday Machine",
        "passageText": "...",
        "questionGroups": [
          {
            "id": "group_1",
            "orderIndex": 1,
            "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.",
            "questionType": "TRUE_FALSE_NOT_GIVEN",
            "wordLimit": null,
            "contextOptions": null,
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
    ],
    "existingAnswers": []
  }
  ```
  *(Note: `AcceptedAnswers` and `explanation` are strictly withheld.)*

### `POST /api/exam/[attemptId]/save`
- **Purpose:** Debounced autosave for student answers.
- **Request Body:**
  ```json
  {
    "questionId": "q_1",
    "testVersionId": "version_cuid_1",
    "answerText": "FALSE",
    "isFlaggedForReview": false
  }
  ```
- **Validation:**
  - `attemptId` must belong to caller.
  - Attempt `status` must be `IN_PROGRESS`.
  - Server time must be $\le$ `expiresAt + 5s`.
  - `testVersionId` must match `attempt.testVersionId`.
- **Response (200):** `{ "success": true, "lastSavedAt": "2026-11-08T08:55:10.000Z" }`
- **Errors:** `403 Forbidden` (expired or unauthorized), `400 Bad Request` (mismatched version).

### `POST /api/exam/[attemptId]/submit`
- **Purpose:** Final submission and transaction-safe scoring.
- **Request Body:** `{}`
- **Execution:**
  1. Atomic conditional update on `TestAttempt` (`status = 'SUBMITTED'` where `status = 'IN_PROGRESS'`).
  2. If already submitted: return existing result (idempotency).
  3. If transitioned: run deterministic scoring engine across all 40 questions.
  4. Write `isCorrect`, `scoreAwarded` on `StudentAnswer`.
  5. Compute `rawScore` and map to `estimatedBand` via `bandConversionTable`.
  6. Insert `EvaluationResult`.
- **Response (200):**
  ```json
  {
    "success": true,
    "attemptId": "attempt_cuid_101",
    "status": "SUBMITTED",
    "rawScore": 38,
    "estimatedBand": 8.5,
    "totalQuestions": 40,
    "timeSpentSeconds": 3140,
    "redirectUrl": "/results/attempt_cuid_101"
  }
  ```

### `GET /api/exam/[attemptId]/results`
- **Purpose:** Retrieve complete post-examination breakdown and rationales.
- **Access:** Attempt owner or Admin, strictly after `status === 'SUBMITTED' || status === 'TIMED_OUT'`.
- **Response (200):**
  ```json
  {
    "attemptId": "attempt_cuid_101",
    "rawScore": 38,
    "estimatedBand": 8.5,
    "totalQuestions": 40,
    "totalAttempted": 40,
    "totalCorrect": 38,
    "totalIncorrect": 2,
    "timeSpentSeconds": 3140,
    "sectionBreakdown": {
      "passage1": { "correct": 13, "total": 13 },
      "passage2": { "correct": 12, "total": 13 },
      "passage3": { "correct": 13, "total": 14 }
    },
    "questions": [
      {
        "questionNumber": 1,
        "prompt": "The inventor of the early two-wheeled machine was an engineer.",
        "studentAnswer": "FALSE",
        "isCorrect": true,
        "scoreAwarded": 1,
        "acceptedAnswers": ["FALSE"],
        "explanation": "Para 2 calls him ‘a German forester’, not an engineer."
      }
    ]
  }
  ```

---

## 4. Admin Test Authoring & Management Endpoints

- All routes protected by `requireRole('ADMIN')`.

### Draft Authoring Routes:
- `GET /api/admin/tests` — List all tests with draft and published status.
- `POST /api/admin/tests` — Create a new test draft (`title`, `slug`, `category`, `durationMinutes`).
- `PUT /api/admin/tests/[testId]` — Update test draft metadata.
- `POST /api/admin/tests/[testId]/sections` — Create/reorder a `DraftSection`.
- `PUT /api/admin/sections/[sectionId]` — Update section passage text and title.
- `POST /api/admin/sections/[sectionId]/groups` — Create a `DraftQuestionGroup` (type, instructions, word limit).
- `POST /api/admin/groups/[groupId]/questions` — Add a `DraftQuestion` (number, prompt, options, explanation).
- `POST /api/admin/questions/[questionId]/accepted-answers` — Add an explicit `DraftAcceptedAnswer`.

### Publishing Workflow:
- `POST /api/admin/tests/[testId]/publish`
  - **Validation:**
    - Checks that all 3 passages exist.
    - Checks that continuous questions 1 to 40 exist with at least one accepted answer each.
    - Checks that band conversion table is valid JSON with complete ranges (0 to 40).
  - **Execution:**
    - Deep-copies draft tree into `PublishedTestVersion`, `PublishedSection`, `PublishedQuestionGroup`, `PublishedQuestion`, and `PublishedAcceptedAnswer`.
    - Increments `versionNumber`.
    - Marks `Test.isPublished = true`.
  - **Response (200):** `{ "success": true, "publishedVersionId": "version_cuid_2", "versionNumber": 2 }`

### Version Archive:
- `POST /api/admin/versions/[versionId]/archive`
  - Toggles `isArchived = true` (soft archive).
  - Existing student attempts remain readable; new attempts cannot be started on archived versions.
