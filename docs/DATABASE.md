# Database Architecture & Design — IELTS Bangla

**Document type:** Living Database Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Database Engineer  
**Status:** Validated Pre-Migration Architecture Specification  
**Last updated:** 2026-11-08  

---

## 1. Database Environment & Connection

- **Provider:** Neon Serverless PostgreSQL
- **Host Region:** `ap-southeast-1` (AWS Singapore, low latency for Bangladesh/Asia-Pacific)
- **Connection Mode:** Pooled connection via PgBouncer (`-pooler` endpoint) for resilient serverless connection handling.
- **ORM:** Prisma ORM (v6.19.3) with standard PostgreSQL migrations.

### Security Configuration
- The database connection string is stored securely in `.env` as `DATABASE_URL` (with backward compatibility fallback for `DATA_BASE`).
- Secrets and credentials must never be committed to git or exposed in client bundles.
- Direct database credentials are not logged or returned in error responses.

---

## 2. Core Architectural Model

### 2.1. Separation of Draft Content vs. Immutable Published Snapshots
To preserve examination integrity, accreditation standards, and historical auditability:
- **Draft Entities (`Test`, `DraftSection`, `DraftQuestionGroup`, `DraftQuestion`, `DraftAcceptedAnswer`):** Fully editable by administrators. Any passage revision, question re-numbering, or prompt correction happens in the draft domain without risking active student sessions.
- **Published Entities (`PublishedTestVersion`, `PublishedSection`, `PublishedQuestionGroup`, `PublishedQuestion`, `PublishedAcceptedAnswer`):** Created when an admin executes an atomic "Publish" action. A full, frozen, deep copy of the draft is created with an incremented `versionNumber`. Once created, this data is immutable.

### 2.2. Test Lifecycle & Status (`TestStatus`)
- `TestStatus` is strictly `ACTIVE` or `ARCHIVED`.
- An unpublished test container is represented by having `status: ACTIVE` and zero associated `PublishedTestVersion` records.
- Active published versions are queried cleanly from `PublishedTestVersion` where `testId = test.id AND isArchived = false ORDER BY versionNumber DESC LIMIT 1`.

### 2.3. User Activation & Historical Preservation
- **Authoritative Activation:** `User.isActive` is the single authoritative account state (`isActive: true` by default; deactivated/suspended accounts have `isActive: false`).
- **Historical Immutability:** `TestAttempt` references `User` with `onDelete: Restrict`. A user account with existing examination attempts **cannot be deleted**.
- **`EvaluationResult` Deletion Policy:** `EvaluationResult` references `TestAttempt` with `onDelete: Restrict`. A completed test attempt cannot be deleted while its evaluation record exists.
- **`StudentAnswer` Deletion Policy:** `StudentAnswer` references both `TestAttempt` and `PublishedQuestion` with `onDelete: Restrict`. Student answers cannot be purged if the parent attempt exists.

### 2.4. Version-Locked Composite Foreign Keys
We enforce cross-table version integrity using **composite foreign keys** that cascade `testVersionId` through every tier of the published hierarchy:
1. `PublishedSection` has composite unique key `@@unique([testVersionId, id])`.
2. `PublishedQuestionGroup` references `PublishedSection` via `(testVersionId, sectionId) REFERENCES PublishedSection(testVersionId, id)`.
3. `PublishedQuestionGroup` has composite unique key `@@unique([testVersionId, id])`.
4. `PublishedQuestion` references `PublishedQuestionGroup` via `(testVersionId, questionGroupId) REFERENCES PublishedQuestionGroup(testVersionId, id)`.
5. `PublishedAcceptedAnswer` references `PublishedQuestion` via `(testVersionId, questionId) REFERENCES PublishedQuestion(testVersionId, id)`.
6. `TestAttempt` has composite unique key `@@unique([id, testVersionId])`.
7. `StudentAnswer` references `TestAttempt` via `(attemptId, testVersionId) REFERENCES TestAttempt(id, testVersionId)` **AND** references `PublishedQuestion` via `(testVersionId, questionId) REFERENCES PublishedQuestion(testVersionId, id)`.

> [!IMPORTANT]
> Because `StudentAnswer` binds both the `TestAttempt` and `PublishedQuestion` to the **same** `testVersionId` column, it is **relationally impossible** for a student answer to point to a question belonging to another test version.

### 2.5. Index Audit & Redundancy Cleanups
In B-tree indexes, a multi-column index or unique constraint on `(colA, colB)` automatically indexes queries filtered by `colA`. The following redundant indexes were explicitly audited and removed:
- **`DraftSection`:** Removed `@@index([testId])` (covered by `@@unique([testId, orderIndex])`).
- **`PublishedTestVersion`:** Removed `@@index([testId])` (covered by `@@unique([testId, versionNumber])`).
- **`PublishedSection`:** Removed `@@index([testVersionId])` (covered by `@@unique([testVersionId, id])`).
- **`StudentAnswer`:** Removed `@@index([attemptId])` (covered by `@@unique([attemptId, questionId])`).

---

## 3. Database-Level Enforcement: Triggers & Partial Unique Index

While Prisma manages relational constraints, database-level protection against `UPDATE`, `DELETE`, `TRUNCATE`, and concurrent active attempt creation is enforced via PostgreSQL triggers and a partial unique index.

These SQL statements are included in the initial migration (`migration.sql`):

```sql
-- ====================================================================
-- 1. SINGLE ACTIVE ATTEMPT PER LOGICAL TEST
-- Enforces that a student can have at most ONE IN_PROGRESS attempt
-- per logical Test at any given time.
-- ====================================================================

CREATE UNIQUE INDEX "idx_unique_active_attempt_per_test"
ON "TestAttempt" ("userId", "testId")
WHERE status = 'IN_PROGRESS';


-- ====================================================================
-- 2. IMMUTABILITY TRIGGER: PublishedTestVersion
-- Allows INSERT during test publication.
-- Allows UPDATE ONLY for archiving: isArchived: false -> true.
-- Prohibits all DELETEs and all other field modifications.
-- ====================================================================

CREATE OR REPLACE FUNCTION protect_published_test_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Deleting a PublishedTestVersion is strictly prohibited.';
  ELSIF TG_OP = 'UPDATE' THEN
    -- Allow ONLY updating isArchived from false to true
    IF (OLD."isArchived" = false AND NEW."isArchived" = true) AND
       (OLD."id" = NEW."id" AND
        OLD."testId" = NEW."testId" AND
        OLD."versionNumber" = NEW."versionNumber" AND
        OLD."title" = NEW."title" AND
        OLD."durationMinutes" = NEW."durationMinutes" AND
        OLD."totalQuestions" = NEW."totalQuestions" AND
        OLD."bandConversionTable" = NEW."bandConversionTable" AND
        OLD."publishedAt" = NEW."publishedAt") THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Immutable snapshot violation: Modifying PublishedTestVersion content or reversing archive state is strictly prohibited.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_published_test_version
BEFORE UPDATE OR DELETE ON "PublishedTestVersion"
FOR EACH ROW EXECUTE FUNCTION protect_published_test_version();


-- ====================================================================
-- 3. IMMUTABILITY TRIGGER: Published Child Tables
-- Targets: PublishedSection, PublishedQuestionGroup, PublishedQuestion, PublishedAcceptedAnswer
-- Allows INSERT during test publication.
-- Rejects 100% of UPDATEs and DELETEs.
-- ====================================================================

CREATE OR REPLACE FUNCTION protect_published_child_record()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Deleting records from % is strictly prohibited.', TG_TABLE_NAME;
  ELSIF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Immutable snapshot violation: Updating records in % is strictly prohibited.', TG_TABLE_NAME;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_published_section
BEFORE UPDATE OR DELETE ON "PublishedSection"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_question_group
BEFORE UPDATE OR DELETE ON "PublishedQuestionGroup"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_question
BEFORE UPDATE OR DELETE ON "PublishedQuestion"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();

CREATE TRIGGER trg_protect_published_accepted_answer
BEFORE UPDATE OR DELETE ON "PublishedAcceptedAnswer"
FOR EACH ROW EXECUTE FUNCTION protect_published_child_record();


-- ====================================================================
-- 4. STATEMENT-LEVEL TRIGGER: Prevent TRUNCATE on Published Tables
-- Row-level triggers do NOT fire on TRUNCATE.
-- Statement-level triggers reject TRUNCATE operations completely.
-- ====================================================================

CREATE OR REPLACE FUNCTION prevent_published_truncate()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Immutable snapshot violation: TRUNCATE on % is strictly prohibited.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_truncate_published_version
BEFORE TRUNCATE ON "PublishedTestVersion"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_section
BEFORE TRUNCATE ON "PublishedSection"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_group
BEFORE TRUNCATE ON "PublishedQuestionGroup"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_question
BEFORE TRUNCATE ON "PublishedQuestion"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();

CREATE TRIGGER trg_prevent_truncate_published_answer
BEFORE TRUNCATE ON "PublishedAcceptedAnswer"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_published_truncate();
```

---

## 5. Attempt Finalization & Deadline Race Prevention

A single shared service handles both user-initiated submissions and automated timeout sweeps:

```typescript
finalizeAndScoreAttempt(attemptId: string, options: { reason: 'MANUAL' | 'TIMEOUT'; actorUserId?: string })
```

### Deterministic Transaction Execution Steps
1. **Pessimistic Row Lock & Server Clock Authority:**
   Inside `prisma.$transaction`, the service acquires a PostgreSQL row lock and queries the database's authoritative time:
   ```typescript
   const rows = await tx.$queryRaw<Array<{
     id: string;
     userId: string;
     testId: string;
     testVersionId: string;
     status: AttemptStatus;
     startedAt: Date;
     expiresAt: Date;
     submittedAt: Date | null;
     db_now: Date;
   }>>`
     SELECT 
       id, "userId", "testId", "testVersionId", status, "startedAt", "expiresAt", "submittedAt",
       NOW() as db_now
     FROM "TestAttempt"
     WHERE id = ${attemptId}
     FOR UPDATE
   `;
   ```
2. **Concurrent Request Handling:**
   If `status` is already `SUBMITTED` or `TIMED_OUT`, another request held the lock first and completed scoring. The service queries and returns the committed `EvaluationResult` idempotently.
3. **Deadline Evaluation:**
   - Evaluates `const isExpired = rows[0].db_now >= rows[0].expiresAt;`
   - **Premature Timeout:** If `options.reason === 'TIMEOUT'` and `!isExpired`, the request is **rejected** (`400 Bad Request: deadline has not passed`). No state change occurs.
   - **Late Manual Submission:** If `options.reason === 'MANUAL'` and `isExpired`, the attempt **must and does transition to `TIMED_OUT`**.
   - **On-Time Manual Submission:** If `options.reason === 'MANUAL'` and `!isExpired`, the attempt transitions to `SUBMITTED`.
4. **Scoring & Rollback Guarantee:**
   Status transition, answer evaluation, and `EvaluationResult` creation execute inside the **same transaction**. Any scoring failure triggers a full rollback, preventing dangling finalized attempts without an evaluation.
5. **No Undocumented Grace Period:** `expiresAt = startedAt + durationMinutes * 60 * 1000`.

---

## 6. Autosave Concurrency & Row-Level Locking

To prevent race conditions where an attempt is checked as `IN_PROGRESS`, finalized concurrently, and subsequently receives an answer upsert:

Autosave executes within an atomic transaction utilizing PostgreSQL row-level locking:
```typescript
export async function saveStudentAnswer(
  attemptId: string,
  testVersionId: string,
  questionId: string,
  answerText: string | null,
  isFlaggedForReview: boolean
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Acquire row lock on the TestAttempt
    const attempts = await tx.$queryRaw<Array<{ id: string; status: string; expiresAt: Date }>>`
      SELECT id, status, "expiresAt"
      FROM "TestAttempt"
      WHERE id = ${attemptId} AND "testVersionId" = ${testVersionId}
      FOR UPDATE
    `;

    if (!attempts.length) throw new NotFoundError('Attempt not found');
    const attempt = attempts[0];

    // 2. Reject writes if attempt is no longer IN_PROGRESS
    if (attempt.status !== 'IN_PROGRESS') {
      throw new AttemptConflictError(`Cannot save answers for attempt with status ${attempt.status}`);
    }

    // 3. Reject writes if server deadline has passed
    if (new Date() >= attempt.expiresAt) {
      throw new AttemptExpiredError('Attempt deadline has passed. Please finalize the test.');
    }

    // 4. Upsert StudentAnswer safely
    return await tx.studentAnswer.upsert({
      where: { attemptId_questionId: { attemptId, questionId } },
      update: { answerText, isFlaggedForReview, lastSavedAt: new Date() },
      create: { attemptId, testVersionId, questionId, answerText, isFlaggedForReview, lastSavedAt: new Date() }
    });
  });
}
```
Because both `saveStudentAnswer` and `finalizeAndScoreAttempt` lock the `TestAttempt` row (`FOR UPDATE`), any concurrent autosave is serialized before finalization, or rejected immediately once finalization completes.

---

## 7. Verification Test Results (Disposable PostgreSQL 17)

All triggers, partial unique indexes, locking strategies, and deadline transitions were executed against an isolated, temporary PostgreSQL 17 test cluster on port 5433 (zero interaction with Neon):

| # | Test Case | Mechanism | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Updating a published question | Trigger `trg_protect_published_question` | Rejected with `ERROR: Immutable snapshot violation (P0001)` | **PASS** |
| **2** | Deleting a published question | Trigger `trg_protect_published_question` | Rejected with `ERROR: Immutable snapshot violation (P0001)` | **PASS** |
| **3** | Updating a published version title | Trigger `trg_protect_published_test_version` | Rejected with `ERROR: Immutable snapshot violation (P0001)` | **PASS** |
| **4** | Archiving a version (`isArchived: false → true`) | Trigger `trg_protect_published_test_version` | Succeeded; `isArchived = true` committed | **PASS** |
| **5** | Reversing archived version (`isArchived: true → false`) | Trigger `trg_protect_published_test_version` | Rejected with `ERROR: Immutable snapshot violation (P0001)` | **PASS** |
| **6** | Truncating a published table | Statement trigger `trg_prevent_truncate_*` | Rejected with `ERROR: Immutable snapshot violation (P0001)` | **PASS** |
| **7a** | Creating first `IN_PROGRESS` attempt | Partial unique index | Succeeded; attempt created | **PASS** |
| **7b** | Creating second concurrent `IN_PROGRESS` attempt | Partial unique index `idx_unique_active_attempt_per_test` | Rejected with `Unique constraint failed (23505)` | **PASS** |
| **8a** | Premature timeout request (`now < expiresAt`) | `SELECT FOR UPDATE` + `NOW() < expiresAt` | Rejected with `400 Bad Request`; zero mutations committed | **PASS** |
| **8b** | Late manual submission arriving after `expiresAt` | `SELECT FOR UPDATE` + `NOW() >= expiresAt` | Transitioned strictly to `TIMED_OUT`; scored successfully | **PASS** |

**Summary: 10 automated test suites executed, 10 passed, 0 failed.**
