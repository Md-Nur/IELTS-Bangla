# Database Architecture & Design — IELTS Bangla

**Document type:** Living Database Specification  
**Project:** IELTS Bangla  
**Author:** Software Architect & Database Engineer  
**Status:** Initial Proposed Architecture  
**Last updated:** 2026-11-08  

---

## 1. Database Environment & Connection

- **Provider:** Neon Serverless PostgreSQL
- **Host Region:** `ap-southeast-1` (AWS Singapore, low latency for Bangladesh/Asia-Pacific)
- **Connection Mode:** Pooled connection via PgBouncer (`-pooler` endpoint) for resilient serverless connection handling.
- **ORM:** Prisma ORM with standard migrations (`prisma migrate dev` / `prisma migrate deploy`).

### Security Configuration
- The database connection string is stored securely in `.env` as `DATABASE_URL` (currently aliased from `DATA_BASE`).
- Secrets and credentials must never be committed to git or exposed in client bundles.
- Direct database credentials are not logged or returned in error responses.

---

## 2. Core Architectural Principles

1. **Test Version Immutability:**
   When an administrator publishes a test, a new immutable `PublishedTestVersion` is generated. Test attempts reference this version. Even if the admin edits the draft test later, past student attempts retain an exact historical record of the passages, questions, accepted answers, and band conversion tables.
2. **Server-Side Answer Key Security:**
   Correct answers and question rationales are never delivered to the client during an active test attempt. Answer verification and score computation occur strictly on the server inside the scoring engine.
3. **Idempotent Submission & Anti-Tampering:**
   Attempts track `status`, `startedAt`, `expiresAt`, and `submittedAt`. Server-side validation guarantees:
   - A student cannot modify answers after submission or expiration.
   - Autosave operations update `StudentAnswer` atomically via upsert.
   - Repeated submissions do not produce duplicate evaluations or score recalculations.
4. **Normalized Schema with Controlled JSON Metadata:**
   Relational integrity (foreign keys, cascading delete on drafts, unique constraints) enforces consistency, while structured JSON is used appropriately for flexible contextual data such as option lists and raw-to-band conversion lookup tables.

---

## 3. Entity-Relationship Model (Phase 1: Reading Focus)

```mermaid
erDiagram
    User ||--o{ TestAttempt : "undertakes"
    Test ||--o{ PublishedTestVersion : "has versions"
    PublishedTestVersion ||--o{ TestSection : "contains"
    PublishedTestVersion ||--o{ TestAttempt : "attempted via"
    TestSection ||--o{ QuestionGroup : "contains"
    QuestionGroup ||--o{ Question : "contains"
    Question ||--o{ AcceptedAnswer : "has"
    TestAttempt ||--o{ StudentAnswer : "contains"
    TestAttempt ||--o| EvaluationResult : "produces"
    Question ||--o{ StudentAnswer : "answered by"

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        enum role "STUDENT, ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    Test {
        string id PK
        string title
        string slug UK
        enum module "READING, LISTENING, WRITING, SPEAKING"
        enum testType "ACADEMIC, GENERAL_TRAINING"
        string description
        int durationMinutes
        int totalQuestions
        boolean isPublished
        datetime createdAt
        datetime updatedAt
    }

    PublishedTestVersion {
        string id PK
        string testId FK
        int versionNumber
        string title
        int durationMinutes
        int totalQuestions
        json bandConversionTable
        datetime publishedAt
        boolean isArchived
    }

    TestSection {
        string id PK
        string testVersionId FK
        int orderIndex
        string title
        string passageText
    }

    QuestionGroup {
        string id PK
        string sectionId FK
        int orderIndex
        string instruction
        enum questionType
        int wordLimit
        json contextOptions
    }

    Question {
        string id PK
        string questionGroupId FK
        int questionNumber UK_per_version
        string prompt
        json options
        string explanation
    }

    AcceptedAnswer {
        string id PK
        string questionId FK
        string acceptedText
        boolean isCaseSensitive
    }

    TestAttempt {
        string id PK
        string userId FK
        string testVersionId FK
        enum status "IN_PROGRESS, SUBMITTED, TIMED_OUT, ABANDONED"
        datetime startedAt
        datetime expiresAt
        datetime submittedAt
        int timeSpentSeconds
        int rawScore
        float estimatedBand
    }

    StudentAnswer {
        string id PK
        string attemptId FK
        string questionId FK
        string answerText
        boolean isFlaggedForReview
        boolean isCorrect
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
        json sectionBreakdown
        datetime evaluatedAt
    }
```

---

## 4. Detailed Prisma Schema Specification

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  ADMIN
}

enum ModuleType {
  READING
  LISTENING
  WRITING
  SPEAKING
}

enum TestCategory {
  ACADEMIC
  GENERAL_TRAINING
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE_NOT_GIVEN
  YES_NO_NOT_GIVEN
  SENTENCE_COMPLETION
  NOTE_COMPLETION
  SUMMARY_COMPLETION
  MATCHING_HEADINGS
  MATCHING_INFORMATION
  MATCHING_FEATURES
  SHORT_ANSWER
}

enum AttemptStatus {
  IN_PROGRESS
  SUBMITTED
  TIMED_OUT
  ABANDONED
}

model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String?
  passwordHash String
  role         Role          @default(STUDENT)
  attempts     TestAttempt[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([email])
}

model Test {
  id              String                 @id @default(cuid())
  title           String
  slug            String                 @unique
  module          ModuleType             @default(READING)
  category        TestCategory           @default(ACADEMIC)
  description     String?                @db.Text
  durationMinutes Int                    @default(60)
  totalQuestions  Int                    @default(40)
  isPublished     Boolean                @default(false)
  versions        PublishedTestVersion[]
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt

  @@index([module, category])
  @@index([slug])
}

model PublishedTestVersion {
  id                  String         @id @default(cuid())
  testId              String
  test                Test           @relation(fields: [testId], references: [id], onDelete: Cascade)
  versionNumber       Int            @default(1)
  title               String
  durationMinutes     Int            @default(60)
  totalQuestions      Int            @default(40)
  bandConversionTable Json           // Mapping: { "39-40": 9.0, "37-38": 8.5, ... }
  isArchived          Boolean        @default(false)
  sections            TestSection[]
  attempts            TestAttempt[]
  publishedAt         DateTime       @default(now())

  @@unique([testId, versionNumber])
  @@index([testId])
}

model TestSection {
  id            String                 @id @default(cuid())
  testVersionId String
  testVersion   PublishedTestVersion   @relation(fields: [testVersionId], references: [id], onDelete: Cascade)
  orderIndex    Int                    // 1 = Passage 1, 2 = Passage 2, 3 = Passage 3
  title         String                 // e.g. "The Bicycle: From Wooden Hobby-Horse..."
  passageText   String                 @db.Text
  groups        QuestionGroup[]
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt

  @@index([testVersionId, orderIndex])
}

model QuestionGroup {
  id             String        @id @default(cuid())
  sectionId      String
  section        TestSection   @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  orderIndex     Int
  instruction    String        @db.Text // e.g. "Do the following statements agree... Choose TRUE, FALSE, or NOT GIVEN"
  questionType   QuestionType
  wordLimit      Int?          // e.g. 2 for "NO MORE THAN TWO WORDS"
  contextOptions Json?         // For Heading matching list { "i": "...", "ii": "..." } or word list { "A": "predator", "B": "prey" }
  questions      Question[]

  @@index([sectionId, orderIndex])
}

model Question {
  id              String          @id @default(cuid())
  questionGroupId String
  questionGroup   QuestionGroup   @relation(fields: [questionGroupId], references: [id], onDelete: Cascade)
  questionNumber  Int             // 1 to 40
  prompt          String          @db.Text
  options         Json?           // ["A. ...", "B. ...", "C. ...", "D. ..."]
  explanation     String?         @db.Text // Rationale from answer key
  acceptedAnswers AcceptedAnswer[]
  studentAnswers  StudentAnswer[]

  @@index([questionGroupId, questionNumber])
}

model AcceptedAnswer {
  id              String   @id @default(cuid())
  questionId      String
  question        Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  acceptedText    String
  isCaseSensitive Boolean  @default(false)
  orderIndex      Int      @default(0)

  @@index([questionId])
}

model TestAttempt {
  id               String               @id @default(cuid())
  userId           String
  user             User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  testVersionId    String
  testVersion      PublishedTestVersion @relation(fields: [testVersionId], references: [id], onDelete: Restrict)
  status           AttemptStatus        @default(IN_PROGRESS)
  startedAt        DateTime             @default(now())
  expiresAt        DateTime             // Authoritative server-side deadline
  submittedAt      DateTime?
  timeSpentSeconds Int                  @default(0)
  rawScore         Int?
  estimatedBand    Float?
  answers          StudentAnswer[]
  evaluation       EvaluationResult?
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  @@index([userId, status])
  @@index([testVersionId])
}

model StudentAnswer {
  id                 String      @id @default(cuid())
  attemptId          String
  attempt            TestAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId         String
  question           Question    @relation(fields: [questionId], references: [id], onDelete: Restrict)
  answerText         String?
  isFlaggedForReview Boolean     @default(false)
  isCorrect          Boolean?
  lastSavedAt        DateTime    @default(now())

  @@unique([attemptId, questionId])
  @@index([attemptId])
}

model EvaluationResult {
  id               String      @id @default(cuid())
  attemptId        String      @unique
  attempt          TestAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  totalQuestions   Int         @default(40)
  totalAttempted   Int         @default(0)
  totalCorrect     Int         @default(0)
  totalIncorrect   Int         @default(0)
  rawScore         Int         @default(0)
  estimatedBand    Float       @default(0.0)
  sectionBreakdown Json        // { "passage1": { "correct": 11, "total": 13 }, ... }
  evaluatedAt      DateTime    @default(now())

  @@index([attemptId])
}
```

---

## 5. Band Conversion Table Specification

Band conversions vary slightly between Academic Reading test calibrations. Therefore, each `PublishedTestVersion` stores its JSON band conversion table. The standard Academic table from `resource/Mock_01_Answer_Key.pdf` will be seeded as default:

```json
{
  "ranges": [
    { "min": 39, "max": 40, "band": 9.0 },
    { "min": 37, "max": 38, "band": 8.5 },
    { "min": 35, "max": 36, "band": 8.0 },
    { "min": 33, "max": 34, "band": 7.5 },
    { "min": 30, "max": 32, "band": 7.0 },
    { "min": 27, "max": 29, "band": 6.5 },
    { "min": 23, "max": 26, "band": 6.0 },
    { "min": 19, "max": 22, "band": 5.5 },
    { "min": 15, "max": 18, "band": 5.0 },
    { "min": 13, "max": 14, "band": 4.5 },
    { "min": 10, "max": 12, "band": 4.0 },
    { "min": 8,  "max": 9,  "band": 3.5 },
    { "min": 6,  "max": 7,  "band": 3.0 },
    { "min": 0,  "max": 5,  "band": 2.5 }
  ]
}
```

---

## 6. Migration & Seeding Plan

1. **Step 1:** Configure Prisma with `@prisma/client` and `prisma` CLI.
2. **Step 2:** Ensure `.env` contains `DATABASE_URL` pointing to the Neon PostgreSQL connection string.
3. **Step 3:** Generate Prisma Client and push/migrate initial schema via `bunx prisma migrate dev --name init_reading_schema`.
4. **Step 4:** Build `prisma/seed.ts` to ingest `resource/Mock_01_Test.pdf` & `resource/Mock_01_Answer_Key.pdf` into the database as a complete, verified published test ready for student mock testing.
