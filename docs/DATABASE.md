# Database Architecture & Design — IELTS Bangla

**Document type:** Living Database Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Database Engineer  
**Status:** Revised Final Proposal (Pre-Migration Architecture Review)  
**Last updated:** 2026-11-08  

---

## 1. Database Environment & Connection

- **Provider:** Neon Serverless PostgreSQL
- **Host Region:** `ap-southeast-1` (AWS Singapore, low latency for Bangladesh/Asia-Pacific)
- **Connection Mode:** Pooled connection via PgBouncer (`-pooler` endpoint) for resilient serverless connection handling.
- **ORM:** Prisma ORM with standard PostgreSQL migrations.

### Security Configuration
- The database connection string is stored securely in `.env` as `DATABASE_URL` (with fallback support for `DATA_BASE`).
- Secrets and credentials must never be committed to git or exposed in client bundles.
- Direct database credentials are not logged or returned in error responses.

---

## 2. Core Architectural Principles & Revisions

### 2.1. Complete Separation of Draft vs. Published Snapshots
To preserve absolute examination integrity and historical auditability:
- **Draft Entities (`Test`, `DraftSection`, `DraftQuestionGroup`, `DraftQuestion`, `DraftAcceptedAnswer`):** Fully editable by administrators. Any passage revision, question re-numbering, or prompt correction happens in the draft domain without risking active student sessions.
- **Published Entities (`PublishedTestVersion`, `PublishedSection`, `PublishedQuestionGroup`, `PublishedQuestion`, `PublishedAcceptedAnswer`):** Created when an admin executes a "Publish" action. A full, frozen, deep copy of the draft is created with an incremented `versionNumber`. Once created, this data is immutable.

### 2.2. Version Integrity via Composite Foreign Keys
In hierarchical document schemas, a simple foreign key (e.g. `questionGroupId`) cannot prove at the database level that the parent group belongs to the exact same test version as the question.

We solve this using **composite foreign keys** that cascade `testVersionId` through every level of the hierarchy:
1. `PublishedSection` has composite unique key `@@unique([testVersionId, id])`.
2. `PublishedQuestionGroup` references `PublishedSection` via `(testVersionId, sectionId)`.
3. `PublishedQuestionGroup` has composite unique key `@@unique([testVersionId, id])`.
4. `PublishedQuestion` references `PublishedQuestionGroup` via `(testVersionId, questionGroupId)`.
5. `PublishedAcceptedAnswer` references `PublishedQuestion` via `(testVersionId, questionId)`.
6. `TestAttempt` has composite unique key `@@unique([id, testVersionId])`.
7. `StudentAnswer` references `TestAttempt` via `(attemptId, testVersionId)` **AND** references `PublishedQuestion` via `(testVersionId, questionId)`.

> [!IMPORTANT]
> Because `StudentAnswer` binds both the `TestAttempt` and `PublishedQuestion` to the **same** `testVersionId` column, it is **relationally impossible** for a student answer to point to a question belonging to another test version.

### 2.3. Uniqueness of Question Numbering
Within any `PublishedTestVersion`, question numbers (1 to 40) must be continuous, ordered, and unique across the entire test booklet (not just within an individual passage).
- Enforced by: `@@unique([testVersionId, questionNumber])` in `PublishedQuestion`.
- Any attempt to publish a test version with missing or duplicated question numbers will fail database validation.

### 2.4. Protection of Published Content
- **Relational `onDelete: Restrict`:** Every relation pointing to or within the published hierarchy uses `onDelete: Restrict`. This prevents accidental deletion of tests, versions, sections, questions, or answers if any dependencies (or student attempts) exist.
- **Database Trigger Enforcement:** In the initial migration, PostgreSQL triggers will be attached to published tables:
  ```sql
  CREATE OR REPLACE FUNCTION prevent_published_data_modification()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Immutable snapshot violation: Deleting published test content is prohibited.';
    ELSIF TG_OP = 'UPDATE' THEN
      -- Only allow isArchived to be toggled on PublishedTestVersion
      IF TG_TABLE_NAME = 'PublishedTestVersion' AND
         (OLD.title = NEW.title AND OLD.testId = NEW.testId AND OLD.versionNumber = NEW.versionNumber AND
          OLD.durationMinutes = NEW.durationMinutes AND OLD.totalQuestions = NEW.totalQuestions AND
          OLD.bandConversionTable = NEW.bandConversionTable) THEN
        RETURN NEW;
      END IF;
      RAISE EXCEPTION 'Immutable snapshot violation: Modifying published test content is prohibited.';
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```
- **Archiving Policy:** Archiving (`isArchived = true`) removes a version from the active student test catalog without deleting a single byte of passage, question, or attempt history.

---

## 3. Entity-Relationship Model (Reading MVP)

```mermaid
erDiagram
    User ||--o{ TestAttempt : "undertakes"
    Test ||--o{ DraftSection : "drafts"
    Test ||--o{ PublishedTestVersion : "publishes"
    
    DraftSection ||--o{ DraftQuestionGroup : "contains"
    DraftQuestionGroup ||--o{ DraftQuestion : "contains"
    DraftQuestion ||--o{ DraftAcceptedAnswer : "has"

    PublishedTestVersion ||--o{ PublishedSection : "freezes"
    PublishedTestVersion ||--o{ TestAttempt : "attempted via"
    PublishedSection ||--o{ PublishedQuestionGroup : "freezes (version-locked)"
    PublishedQuestionGroup ||--o{ PublishedQuestion : "freezes (version-locked)"
    PublishedQuestion ||--o{ PublishedAcceptedAnswer : "freezes (version-locked)"

    TestAttempt ||--o{ StudentAnswer : "contains (version-locked)"
    PublishedQuestion ||--o{ StudentAnswer : "answers (version-locked)"
    TestAttempt ||--o| EvaluationResult : "produces (atomic)"

    User {
        string id PK
        string email UK
        string name
        string passwordHash "nullable for future OAuth"
        enum role "STUDENT, ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    Test {
        string id PK
        string title
        string slug UK
        enum module "READING, LISTENING, WRITING, SPEAKING"
        enum category "ACADEMIC, GENERAL_TRAINING"
        enum status "DRAFT, ARCHIVED"
        int durationMinutes
        int totalQuestions
        int currentPublishedVersionNumber "nullable"
    }

    PublishedTestVersion {
        string id PK
        string testId FK
        int versionNumber UK_per_test
        string title
        int durationMinutes
        int totalQuestions
        json bandConversionTable
        boolean isArchived
        datetime publishedAt
    }

    PublishedSection {
        string id PK
        string testVersionId FK
        int orderIndex
        string title
        string passageText
    }

    PublishedQuestionGroup {
        string id PK
        string testVersionId FK
        string sectionId FK
        int orderIndex
        string instruction
        enum questionType
        int wordLimit
        json contextOptions
    }

    PublishedQuestion {
        string id PK
        string testVersionId FK
        string questionGroupId FK
        int questionNumber UK_per_version
        string prompt
        json options
        string explanation
    }

    PublishedAcceptedAnswer {
        string id PK
        string testVersionId FK
        string questionId FK
        string acceptedText
        boolean isCaseSensitive
        int orderIndex
    }

    TestAttempt {
        string id PK
        string userId FK
        string testVersionId FK
        enum status "IN_PROGRESS, SUBMITTED, TIMED_OUT, ABANDONED"
        datetime startedAt
        datetime expiresAt "server authoritative"
        datetime submittedAt "server authoritative"
        int timeSpentSeconds
        int rawScore
        float estimatedBand
    }

    StudentAnswer {
        string id PK
        string attemptId FK
        string testVersionId FK
        string questionId FK
        string answerText
        boolean isFlaggedForReview
        boolean isCorrect "nullable while in-progress"
        int scoreAwarded "nullable while in-progress"
        datetime lastSavedAt
    }

    EvaluationResult {
        string id PK
        string attemptId FK,UK
        int totalQuestions
        int totalAttempted
        int totalCorrect
        int totalIncorrect
        int rawScore
        float estimatedBand
        string scoringVersion
        json scoringConfig
        json sectionBreakdown
        json questionBreakdown
        datetime evaluatedAt
    }
```

---

## 4. Complete Prisma Schema Specification

The complete schema is maintained at [`prisma/schema.prisma`](file:///Users/md.nurealamsiddiquee/Projects/ielts-bangla/prisma/schema.prisma).

Key features of this revised schema:
- **Cleaned Up Redundancies:**
  - Removed duplicate `@@index([email])` on `User.email` (already `@unique`).
  - Removed duplicate `@@index([slug])` on `Test.slug` (already `@unique`).
  - Removed duplicate `@@index([attemptId])` on `EvaluationResult.attemptId` (already `@unique`).
  - Replaced boolean `Test.isPublished` with `TestStatus` enum (`DRAFT`, `ARCHIVED`) and `currentPublishedVersionNumber Int?`. Live playable state is determined by whether an active `PublishedTestVersion` exists.
- **Future-Proof Auth:**
  - `User.passwordHash` is `String?` (nullable) to accommodate future passwordless magic links or OAuth SSO without schema migrations.
- **Deterministic Nullability:**
  - `StudentAnswer.scoreAwarded` and `isCorrect` are nullable without default, accurately representing that grading only takes place upon submission or timeout finalization.

---

## 5. Submission & Timeout Transaction Strategy

A single shared service handles both user-initiated submissions and automated timeout sweeps:

```
finalizeAndScoreAttempt(attemptId: string, options: { reason: 'MANUAL' | 'TIMEOUT', actorUserId?: string })
```

### Concurrency & Atomicity Guarantee
1. **Pessimistic Transition Mutex:**
   ```typescript
   const updated = await tx.testAttempt.updateMany({
     where: {
       id: attemptId,
       status: AttemptStatus.IN_PROGRESS,
     },
     data: {
       status: options.reason === 'TIMEOUT' ? AttemptStatus.TIMED_OUT : AttemptStatus.SUBMITTED,
       submittedAt: now,
     }
   });
   ```
   If `updated.count === 0`, another concurrent request (or simultaneous timeout sweep) has already won the transition. The service gracefully queries and returns the committed `EvaluationResult` without duplicating work or throwing an error.
2. **Authoritative Timestamping:**
   - Attempt `expiresAt` is set strictly on the server at test creation: `now() + durationMinutes * 60 * 1000`.
   - `timeSpentSeconds` is computed on the server: `min(round((now - startedAt) / 1000), durationMinutes * 60 + gracePeriod)`.
3. **All-or-Nothing Atomicity:**
   The status change, student answer scoring, band calculation, and `EvaluationResult` creation occur within the **same database transaction**. If scoring fails or an exception is thrown, the transaction aborts completely. An attempt is **never left in a dangling SUBMITTED or TIMED_OUT state without an EvaluationResult**.
4. **Reproducibility Preservation:**
   Every `EvaluationResult` stores:
   - `scoringVersion`: e.g. `"reading_v1.0.0"`
   - `scoringConfig`: JSON snapshot of the exact grading rules and band table.
   - `questionBreakdown`: Detailed audit record containing the student's answer, correct alternatives, correctness, and marks awarded for every single question.

---

## 6. Official Mock Test 01 Band Conversion Resolution

Inspected directly from `resource/Mock_01_Answer_Key.pdf` without guesswork:

| Raw Score (0–40) | Estimated IELTS Band |
| :--- | :--- |
| **39–40** | **9.0** |
| **37–38** | **8.5** |
| **35–36** | **8.0** |
| **33–34** | **7.5** |
| **30–32** | **7.0** |
| **27–29** | **6.5** |
| **23–26** | **6.0** |
| **19–22** | **5.5** |
| **15–18** | **5.0** |
| **13–14** | **4.5** |
| **10–12** | **4.0** |
| **8–9** | **3.5** |
| **6–7** | **3.0** |
| **4–5** | **2.5** |
| **3** | **2.0** |
| **2** | **1.5** |
| **1** | **1.0** |
| **0** | **0.0** |

This mapping is stored directly in `PublishedTestVersion.bandConversionTable`, ensuring each published test can have its own calibrated conversion table.
