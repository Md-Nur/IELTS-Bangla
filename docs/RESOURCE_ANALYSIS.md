# Resource Analysis — IELTS Bangla

**Document type:** Architecture & Content Reference  
**Project:** IELTS Bangla  
**Author:** Software Architect & Technical Lead  
**Status:** Complete Initial Analysis  
**Last updated:** 2026-11-08  

---

## 1. Executive Summary

A comprehensive inspection of the `resource/` directory was performed. The repository contains a mixture of:
1. **Original, branded mock examination materials** (`Mock_01_Test.pdf` & `Mock_01_Answer_Key.pdf`) explicitly customized for IELTS Bangla with complete passages, 40 questions, detailed answer explanations, and a band conversion matrix.
2. **Extensive original practice banks** (50 Reading sets, 52 Reading sets, 160 Writing sets, and 160 Speaking sets) providing hundreds of practice prompts.
3. **Official IELTS reference materials** (`resource/ielts-sample-papers/`) containing authentic Cambridge/British Council/IDP test tasks, scored candidate scripts with examiner commentary, and sample speaking/listening audio recordings.
4. **Curated link indexes** (`actual_reading_mock_sites.html`, `official_idp_ielts_reading_links_academic_general/`) referencing official IDP and British Council preparation hubs.

---

## 2. Resource-by-Resource Inventory & Analysis

### 2.1. Mock Test 01 (`resource/Mock_01_Test.pdf` & `resource/Mock_01_Answer_Key.pdf`)

- **Filename:** `Mock_01_Test.pdf`, `Mock_01_Answer_Key.pdf`
- **Format:** PDF documents (23,414 characters test booklet, 3-page answer key).
- **Purpose:** Full-length, authentic 60-minute, 40-question IELTS Academic Reading simulation test branded specifically for IELTS Bangla.
- **Passages & Question Types:**
  - **Passage 1:** *"The Bicycle: From Wooden Hobby-Horse to Everyday Machine"* (Q1–7: True/False/Not Given, Q8–13: Note Completion with max 2 words).
  - **Passage 2:** *"Green Roofs: Gardens in the Sky"* (Q14–19: Matching Headings [List of Headings i–vii], Q20–23: Sentence Completion with max 2 words, Q24–26: Multiple Choice 4-option).
  - **Passage 3:** *"The Myth of Multitasking"* (Q27–32: Yes/No/Not Given, Q33–36: Multiple Choice 4-option, Q37–40: Summary Completion from a word list A–G).
- **Important Findings:**
  - Includes comprehensive rationales for all 40 questions ("Where to find it / why" citing exact paragraph evidence).
  - Provides an exact Academic Reading raw score to estimated IELTS Band table:
    - 39–40: Band 9.0
    - 37–38: Band 8.5
    - 35–36: Band 8.0
    - 33–34: Band 7.5
    - 30–32: Band 7.0
    - 27–29: Band 6.5
    - 23–26: Band 6.0
    - 19–22: Band 5.5
    - 15–18: Band 5.0
    - 13–14: Band 4.5
    - 10–12: Band 4.0
    - 8–9: Band 3.5
    - 6–7: Band 3.0
    - 0–5: Below Band 3.0
- **Relevant Product Features:**
  - Perfect golden seed dataset for the Phase 1 Reading examination module.
  - Golden test suite for validating deterministic grading algorithms, alternative accepted answer parsing (e.g. `x / y`), case insensitivity, whitespace trimming, and band mapping.
  - Serves as the primary reference for the post-exam detailed review and explanation modal.
- **Implementation Implications:**
  - Database schema must support passages with paragraph markers (e.g., Para A–G for Matching Headings).
  - Database schema must support multiple question types and specific answer constraints (e.g. word limit rules, heading roman numerals, summary completion token mapping).
  - Band conversion must be model-configurable per test version.
- **Copyright & Licensing:**
  - Created specifically for IELTS Bangla as original training material. Stated: *"Original practice material written for training... follows the IELTS Academic Reading format... but it is not an official test."*
  - **Commercial Status:** Cleared for use in IELTS Bangla application.

---

### 2.2. IELTS Academic Reading 50 Sets (`resource/IELTS_Academic_Reading_50_Sets/`)

- **Directory:** `resource/IELTS_Academic_Reading_50_Sets/` (Set_01 to Set_50, `README.txt`, `Set_Index.txt`).
- **Format:** Plain text files (`Set_XX_Test.txt`, `Set_XX_Answer_Key.txt`).
- **Purpose:** Large bank of 50 reading sets (3 passages, 40 questions each = 150 passages, 2,000 questions).
- **Important Findings:**
  - Passage inspection reveals that these passages use a programmatic mad-libs/templated text structure based on research methodology critique (combining data sources, establishing baselines, threshold limits, stakeholder trade-offs, staged rollouts).
  - The answer patterns and completion tokens repeat predictably across passages (e.g. Q9, 22, 35: `why`; Q10, 23, 36: `averaging`; Q11, 24, 37: `rollout`).
- **Relevant Product Features:**
  - Excellent for automated end-to-end integration testing, bulk import stress-testing, pagination testing, and modular practice drills.
  - Less ideal as primary featured mock tests due to repetitive passage prose patterns.
- **Implementation Implications:**
  - Batch ingestion scripts can easily parse this uniform format into the Prisma database.
- **Copyright & Licensing:**
  - Original practice texts created for this pack; not copied from external sources.
  - **Commercial Status:** Cleared for use, but recommended for practice/drill modes rather than flagship mock tests.

---

### 2.3. IELTS Academic Reading 52 Original Sets (`resource/IELTS_Academic_Reading_52_Original_Sets/`)

- **Directory:** `resource/IELTS_Academic_Reading_52_Original_Sets/` (Set_01 to Set_52, `README.txt`).
- **Format:** Plain text files (`Set_XX_Test.txt`, `Set_XX_Answer_Key.txt`).
- **Purpose:** 52 original academic reading practice sets with answer keys and brief rationales.
- **Important Findings:**
  - Covers True/False/Not Given, Yes/No/Not Given, Multiple Choice, Sentence Completion, Matching Headings, and Short Answer.
  - Explicit README disclosure: passages are shorter than official test length (~2,150–2,750 words) to support strategy practice.
  - Every question has an explanation/rationale attached to the answer key.
- **Relevant Product Features:**
  - Rich question bank for granular practice and topic-specific reading drills.
  - Explanations can be loaded directly into question-level review explanations.
- **Implementation Implications:**
  - Parser required to ingest questions, options, correct answers, and rationales into Prisma.
- **Copyright & Licensing:**
  - Original practice material; no passage text copied.
  - **Commercial Status:** Cleared for application use.

---

### 2.4. IELTS Sample Papers (`resource/ielts-sample-papers/`)

- **Directory:** `resource/ielts-sample-papers/`
- **Subdirectories:**
  - `Academic Reading/` (7 PDF sample tasks)
  - `Academic Writing/` (Sample tasks Task 1 & 2, scored scripts `113313_AC_sample_scripts.pdf`)
  - `General Training Reading/` (8 PDF sample tasks)
  - `General Training Writing/` (Sample tasks and scripts `115004_General_Training_Writing_sample_scripts.pdf`)
  - `Listening/` (7 PDF sample tasks: Form completion, Matching, Multiple choice, Plan/map/diagram labelling, Sentence completion, Short-answer)
  - `Speaking/` (PDF tasks Part 1, 2, 3 and official transcripts)
  - `Tasks Auido/` (7 MP3 recordings for listening and speaking samples)
- **Important Findings:**
  - **Academic Writing:** Contains real candidate scripts across Bands 5 through 8.5 with examiner commentary dissecting Task Achievement/Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.
  - **Speaking:** Contains authentic examiners conducting Part 1, Part 2, and Part 3 with candidate speech transcripts and audio recordings. Demonstrates natural candidate pauses, lexical self-correction, grammatical structures, and pronunciation features.
  - **Listening:** Demonstrates audio instructions ("You will hear...", "First you have some time to look at questions 1 to 5"), section transitions, British/Australian/North American accents, and distractors in dialogue.
- **Relevant Product Features:**
  - Informs the exact timing, prompts, instructions, and UI conventions for future Listening, Writing, and Speaking modules.
  - Benchmark calibration dataset for validating future Writing AI grading prompts and Speaking audio evaluation algorithms.
- **Copyright & Licensing Concern:**
  - **STRICT PROHIBITION:** These files are proprietary copyright of Cambridge University Press & Assessment, British Council, and IDP Education.
  - **Rule:** Under no circumstances should these PDFs, sample texts, or MP3 audio files be copied into `public/`, stored in the database, or distributed commercially to users.
  - **Permitted Use:** Strictly internal pedagogical reference for developer architectural design, rubric calibration, and test engine specifications.

---

### 2.5. Academic Writing 160 Original Sets (`resource/IELTS_Academic_Writing_160_Original_Sets/`)

- **Directory:** `resource/IELTS_Academic_Writing_160_Original_Sets/` (Set_001 to Set_160, `README.txt`, `Index.txt`).
- **Format:** Text files organized by set.
- **Purpose:** Comprehensive question bank for Academic Writing Task 1 and Task 2.
- **Important Findings:**
  - Task 1: Tabular data, bar charts, process steps described in structured text form.
  - Task 2: Formal argumentative and discursive prompts across education, technology, society, environment, globalization, and urban life.
  - Includes word count rules (Task 1: min 150 words; Task 2: min 250 words) and self-checklist covering the 4 assessment criteria.
- **Relevant Product Features:**
  - Ready-to-use prompt repository for Phase 3 Writing engine.
- **Copyright & Licensing:**
  - Original practice prompts; cleared for platform use.

---

### 2.6. Academic Speaking 160 Original Practice Sets (`resource/IELTS_Academic_Speaking_160_Original_Practice_Sets/`)

- **Directory:** `resource/IELTS_Academic_Speaking_160_Original_Practice_Sets/` (Set_001 to Set_160, `INDEX.csv`, `README.txt`).
- **Format:** Text files and CSV index.
- **Purpose:** Comprehensive question bank for Academic Speaking.
- **Important Findings:**
  - Structured into Part 1 (Introduction/Interview, 4–5 min), Part 2 (Cue card with 1 min prep, 2 min speaking), and Part 3 (Two-way abstract discussion, 4–5 min).
  - Explicit timing guidelines and self-review checklists.
- **Relevant Product Features:**
  - Structured prompt database for Phase 4 Speaking test workflow.
- **Copyright & Licensing:**
  - Original practice material; cleared for platform use.

---

### 2.7. Reference Web Indexes (`actual_reading_mock_sites.html` & `official_idp_ielts_reading_links_academic_general/`)

- **Files:** `resource/actual_reading_mock_sites.html`, `resource/official_idp_ielts_reading_links_academic_general/` (`index.html`, `official_idp_reading_links.csv`).
- **Purpose:** Curated web reference index linking to live practice resources on official IDP and British Council portals.
- **Key Findings:**
  - Shows industry standard layout for computer-delivered IELTS (CD-IELTS):
    - Left column: Passage text with clear paragraph lettering (A, B, C...) and scroll synchronization.
    - Right column: Question list with interactive form elements (radio inputs, dropdowns, text fields).
    - Header: Countdown timer (60:00 descending), test title, pause/exit actions.
    - Footer: Passage selector (Passage 1, Passage 2, Passage 3) and Question Navigator (1 to 40) with visual states: Unattempted (grey/neutral), Answered (highlighted/filled), Flagged/Review (corner badge).
    - Review & Submit dialog: Explicit warnings if any questions remain unanswered.
- **Relevant Product Features:**
  - Direct guide for IELTS Bangla's examination UI/UX design.

---

## 3. Synthesis of Examination Structure & Scoring Rules

| Module | Sections / Passages | Questions | Standard Duration | Scoring Method | Evaluation Engine |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Reading** | 3 Passages (~700–900 words each) | 40 | 60 minutes | 1 mark per question (0–40 raw score converted to Band 1.0–9.0) | Deterministic Server-Side Answer Key Matcher |
| **Listening** | 4 Sections (Audio tracks) | 40 | ~30 min + 10 min transfer (paper) or 2 min review (computer) | 1 mark per question (0–40 raw score converted to Band 1.0–9.0) | Deterministic Server-Side Answer Key Matcher |
| **Writing** | Task 1 (report, 150w, 20m)<br>Task 2 (essay, 250w, 40m) | 2 tasks | 60 minutes | 4 Criteria: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy (Task 2 weighted 2x) | Asynchronous AI Evaluation (Phase 3) |
| **Speaking** | Part 1 (4-5m), Part 2 (3-4m), Part 3 (4-5m) | 3 parts | 11–14 minutes | 4 Criteria: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation | Asynchronous Audio + Transcript AI (Phase 4) |

---

## 4. Key Takeaways for Immediate Phase 1 Reading Implementation

1. **Seed Mock Test:** Use `Mock_01_Test.pdf` / `Mock_01_Answer_Key.pdf` as the initial verified, high-quality test in the database seed script.
2. **Deterministic Evaluation Rules:**
   - Trimming leading/trailing whitespace.
   - Case-insensitive comparison (`FALSE` == `false` == `False`).
   - Normalizing internal spaces (e.g. `mass  production` -> `mass production`).
   - Supporting multiple accepted answers (e.g. `x / y` or `[x, y]`).
   - Enforcing word counts (e.g. NO MORE THAN TWO WORDS).
3. **Band Conversion:** Store the specific raw-to-band conversion table per test in the database or test configuration, allowing test-specific calibration.
4. **Security & Licensing:** Do not redistribute Cambridge/BC copyright PDFs. Store all question keys strictly in the server database, never sending them to the client during an active test attempt.
