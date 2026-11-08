# Database Architecture & Design — IELTS Bangla

**Document type:** Living Database Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Database Engineer  
**Status:** Final Pre-Migration Architecture Specification  
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
- Denormalized state fields like `currentPublishedVersionNumber` have been removed to eliminate state synchronization bugs. The active published version is queried directly:
  ```sql
  SELECT * FROM "PublishedTestVersion"
  WHERE "testId" = $1 AND "isArchived" = false
  ORDER BY "versionNumber" DESC LIMIT 1;
  ```

### 2.3. Historical Preservation & Deletion Policy
Student examination history must be permanently preserved:
- **`User` Deletion Policy:** `TestAttempt` references `User` with `onDelete: Restrict`. A user account with existing examination attempts **cannot be deleted**. Account deactivation uses `isDeactivated: true`.
- **`EvaluationResult` Deletion Policy:** `EvaluationResult` references `TestAttempt` with `onDelete: Restrict`. A completed test attempt cannot be deleted while its evaluation record exists.
- **`StudentAnswer` Deletion Policy:** `StudentAnswer` references both `TestAttempt` and `PublishedQuestion` with `onDelete: Restrict`. Student answer records cannot be purged if the parent attempt exists.

### 2.4. Version-Locked Composite Foreign Keys
In hierarchical document schemas, simple single-column foreign keys (`questionGroupId`, `sectionId`) cannot prevent cross-version corruption.

We enforce cross-table integrity using **composite foreign keys** that cascade `testVersionId` through every level of the hierarchy:
1. `PublishedSection` has composite unique key `@@unique([testVersionId, id])`.
2. `PublishedQuestionGroup` references `PublishedSection` via `(testVersionId, sectionId) REFERENCES PublishedSection(testVersionId, id)`.
3. `PublishedQuestionGroup` has composite unique key `@@unique([testVersionId, id])`.
4. `PublishedQuestion` references `PublishedQuestionGroup` via `(testVersionId, questionGroupId) REFERENCES PublishedQuestionGroup(testVersionId, id)`.
5. `PublishedAcceptedAnswer` references `PublishedQuestion` via `(testVersionId, questionId) REFERENCES PublishedQuestion(testVersionId, id)`.
6. `TestAttempt` has composite unique key `@@unique([id, testVersionId])`.
7. `StudentAnswer` references `TestAttempt` via `(attemptId, testVersionId) REFERENCES TestAttempt(id, testVersionId)` **AND** references `PublishedQuestion` via `(testVersionId, questionId) REFERENCES PublishedQuestion(testVersionId, id)`.

> [!IMPORTANT]
> Because `StudentAnswer` binds both the `TestAttempt` and `PublishedQuestion` to the **same** `testVersionId` column, it is **relationally impossible** for a student answer to point to a question belonging to another test version.

---

## 3. PostgreSQL Immutability Triggers (Migration Level)

While Prisma enforces foreign key constraints and `onDelete: Restrict`, database-level protection against `UPDATE` and `DELETE` on published snapshots is enforced via PostgreSQL triggers.

These triggers are declared in the migration SQL file (`migration.sql`) created during initial migration:

```sql
-- ====================================================================
-- IMMUTABILITY TRIGGER 1: PublishedTestVersion
-- Allows INSERT. Allows UPDATE only for isArchived: false -> true.
-- Prohibits all DELETEs and all other UPDATEs.
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
-- IMMUTABILITY TRIGGER 2: Published Child Tables
-- Covers: PublishedSection, PublishedQuestionGroup, PublishedQuestion, PublishedAcceptedAnswer
-- Allows INSERT during publishing. Rejects 100% of UPDATEs and DELETEs.
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
```

---

## 4. Attempt Finalization & Deadline Enforcement

A single shared service handles both user-initiated submissions and automated timeout sweeps:

```
finalizeAndScoreAttempt(attemptId: string, options: { reason: 'MANUAL' | 'TIMEOUT'; actorUserId?: string })
```

### Deterministic State Transitions
1. **Server-Authoritative Clock:** The server retrieves `now = new Date()`. Client timestamps are completely ignored.
2. **Deadline Evaluation:**
   - If `now <= attempt.expiresAt`:
     - Manual request (`reason: 'MANUAL'`) transitions attempt to `SUBMITTED`.
   - If `now > attempt.expiresAt`:
     - Both manual requests and timeout sweeps transition attempt to `TIMED_OUT`. Manual submissions arriving after expiry **must and do** use timeout finalization.
3. **Single Transaction Atomicity:**
   The status transition (`IN_PROGRESS → SUBMITTED` or `IN_PROGRESS → TIMED_OUT`), answer scoring, band calculation, and `EvaluationResult` creation occur within a **single database transaction**:
   - If scoring throws an error or fails, the transaction aborts and rolls back completely.
   - An attempt is **never left in a dangling SUBMITTED or TIMED_OUT state without an EvaluationResult**.
4. **Concurrency Mutex:**
   The transition uses an atomic conditional update:
   ```typescript
   const updateResult = await tx.testAttempt.updateMany({
     where: {
       id: attemptId,
       status: AttemptStatus.IN_PROGRESS,
     },
     data: {
       status: targetStatus,
       submittedAt: now,
       timeSpentSeconds,
     }
   });
   ```
   If `updateResult.count === 0`, another concurrent request (or simultaneous timeout sweep) won the transition. The service queries and returns the committed `EvaluationResult` idempotently.
5. **No Undocumented Grace Period:** The deadline is exact: `expiresAt = startedAt + durationMinutes * 60 * 1000`. No extra grace period is granted.

---

## 5. Autosave Concurrency & Locking Strategy

To prevent the race condition where an attempt is checked as `IN_PROGRESS`, finalized concurrently, and subsequently receives an answer upsert:

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
    // 1. Acquire row-level lock on the TestAttempt
    const attempts = await tx.$queryRaw<Array<{ id: string; status: string; expiresAt: Date }>>`
      SELECT id, status, "expiresAt"
      FROM "TestAttempt"
      WHERE id = ${attemptId} AND "testVersionId" = ${testVersionId}
      FOR UPDATE
    `;

    if (!attempts.length) {
      throw new NotFoundError('Attempt not found');
    }

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
      where: {
        attemptId_questionId: { attemptId, questionId }
      },
      update: {
        answerText,
        isFlaggedForReview,
        lastSavedAt: new Date()
      },
      create: {
        attemptId,
        testVersionId,
        questionId,
        answerText,
        isFlaggedForReview,
        lastSavedAt: new Date()
      }
    });
  });
}
```
Because both `saveStudentAnswer` and `finalizeAndScoreAttempt` lock the `TestAttempt` row (`FOR UPDATE`), any concurrent autosave is serialized before finalization, or rejected immediately once finalization completes.

---

## 6. Publishing Validation Rules

A unique constraint (`@@unique([testVersionId, questionNumber])`) only guarantees that no two questions share the same number; it does **not** guarantee continuous numbering.

The publishing service (`publishTestVersion(testId: string)`) validates the draft in memory before beginning the atomic publish transaction:
1. **Total Question Count:** The number of draft questions must exactly equal `test.totalQuestions`.
2. **Continuous Question Numbering:** Questions across all passages must be sequentially numbered from `1` to `totalQuestions` without gaps or duplicates (e.g. `[1, 2, ..., 40]`).
3. **Passage/Question Distribution Flexibility:** Passage and question distribution is completely configurable (e.g. 13/13/14, 14/13/13, 10/10/10/10, etc.) and not hardcoded to 13/13/14.
4. **Structural Validity:**
   - Every `DraftSection` must have at least one `DraftQuestionGroup`.
   - Every `DraftQuestionGroup` must have at least one `DraftQuestion`.
   - Every `DraftQuestion` must have at least one `DraftAcceptedAnswer`.
5. **Question Type & Option Integrity:**
   - `MULTIPLE_CHOICE` must have at least 2 non-empty options.
   - `MATCHING_HEADINGS` must have `contextOptions` containing heading definitions (e.g. Roman numerals `i` to `vii`).
   - `SENTENCE_COMPLETION`, `NOTE_COMPLETION`, `SUMMARY_COMPLETION` must have `wordLimit >= 1`.
6. **Band Conversion Integrity:**
   - `bandConversionTable` must provide contiguous, non-overlapping raw score ranges covering `0` to `totalQuestions`, mapping each range to an IELTS band between `0.0` and `9.0`.

Publishing executes inside a single database transaction. If any validation fails, the transaction rolls back and no published version is created.

---

## 7. Official Mock Test 01 Band Conversion Resolution

Inspected directly from `resource/Mock_01_Answer_Key.pdf`:

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

This mapping is stored directly in `PublishedTestVersion.bandConversionTable`, allowing per-test calibration.
