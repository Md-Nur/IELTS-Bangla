# API Specification — IELTS Bangla

**Document type:** Living API Contracts & Route Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Full-Stack Developer  
**Status:** Initial Specification (Phase 1: Reading Focus)  
**Last updated:** 2026-11-08  

---

## 1. Overview & Conventions

All API routes and server actions in IELTS Bangla adhere to standard RESTful and Next.js App Router patterns:
- **Authentication:** Session cookie verified on every request.
- **Validation:** All incoming request bodies validated using Zod.
- **Error Responses:** Standard JSON structure `{ error: string, details?: unknown }`.
- **Authorization:** Handled strictly on the server; student actions scope strictly to `session.user.id`.

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Purpose:** Register a new student account.
- **Request Body:**
  ```json
  {
    "name": "Nur Alam",
    "email": "nur@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response (201):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "STUDENT" } }`
- **Errors:** `400 Bad Request` (validation failed), `409 Conflict` (email already registered).

### `POST /api/auth/login`
- **Purpose:** Authenticate user and issue secure HTTP-only session cookie.
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200):** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`

### `POST /api/auth/logout`
- **Purpose:** Invalidate session and clear session cookie.

---

## 3. Examination Endpoints (Student)

### `GET /api/tests`
- **Purpose:** List all published tests available for examination.
- **Query Params:** `?module=READING&category=ACADEMIC`
- **Response (200):** Array of test metadata (id, title, slug, durationMinutes, totalQuestions).

### `POST /api/exam/start`
- **Purpose:** Initialize a new test attempt for the authenticated user.
- **Request Body:** `{ "testSlug": "academic-reading-mock-01" }`
- **Response (201):**
  ```json
  {
    "attemptId": "cuid_attempt_123",
    "testTitle": "IELTS Academic Reading Mock Test 01",
    "startedAt": "2026-11-08T08:30:00.000Z",
    "expiresAt": "2026-11-08T09:30:00.000Z",
    "durationMinutes": 60,
    "sections": [
      {
        "orderIndex": 1,
        "title": "The Bicycle: From Wooden Hobby-Horse to Everyday Machine",
        "passageText": "...",
        "questionGroups": [
          {
            "id": "group_1",
            "instruction": "Do the following statements agree with the information...",
            "questionType": "TRUE_FALSE_NOT_GIVEN",
            "wordLimit": null,
            "questions": [
              {
                "id": "q_1",
                "questionNumber": 1,
                "prompt": "The inventor of the early two-wheeled machine was an engineer."
              }
            ]
          }
        ]
      }
    ]
  }
  ```
  *(Note: Correct answers and explanations are omitted from this payload.)*

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
- **Errors:** `403 Forbidden` (attempt not owned by user), `400 Bad Request` (attempt expired or already submitted).

### `POST /api/exam/[attemptId]/submit`
- **Purpose:** Final submission and scoring triggering.
- **Request Body:** `{}`
- **Response (200):**
  ```json
  {
    "success": true,
    "attemptId": "cuid_attempt_123",
    "rawScore": 38,
    "estimatedBand": 8.5,
    "totalQuestions": 40,
    "timeSpentSeconds": 3120,
    "redirectUrl": "/results/cuid_attempt_123"
  }
  ```

### `GET /api/exam/[attemptId]/results`
- **Purpose:** Fetch detailed scored results and rationales (authorized only for attempt owner or admin after submission).
- **Response (200):** Full breakdown including `EvaluationResult`, passage details, student answers, accepted answers, and question explanations.

---

## 4. Admin Management Endpoints

### `GET /api/admin/tests`
- **Purpose:** List all tests (draft and published) with version metadata.
- **Access:** Admin only.

### `POST /api/admin/tests`
- **Purpose:** Create a draft test.
- **Access:** Admin only.

### `POST /api/admin/tests/[testId]/publish`
- **Purpose:** Freeze current draft and create a new immutable `PublishedTestVersion`.
- **Access:** Admin only.
