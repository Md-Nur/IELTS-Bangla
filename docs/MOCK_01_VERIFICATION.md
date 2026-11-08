# Mock Test 01 Content Verification Report — IELTS Bangla

**Document Version:** 1.0.0  
**Date:** 2026-11-08  
**Module:** Academic Reading  
**Test Identifier:** `academic-reading-mock-01`  
**Source Materials:**  
- `resource/Mock_01_Test.pdf` (11 pages)  
- `resource/Mock_01_Answer_Key.pdf` (3 pages)  

---

## 1. Executive Summary

This report documents the extraction, structuring, and automated validation of **Academic Reading Mock Test 01** for IELTS Bangla.

- **Total Passages:** 3
- **Total Question Groups:** 8
- **Total Questions:** 40
- **Duration:** 60 minutes
- **Scoring System:** 1 mark per question (40 marks maximum); no penalty for incorrect answers.
- **Authoritative Answer Key:** Exact match against `Mock_01_Answer_Key.pdf` with paragraph citations and explanations for all 40 questions.
- **Database Status:** Staged in `prisma/seeds/mock01Data.ts` and validated by 29 automated tests. **0 rows have been inserted into Neon PostgreSQL** awaiting founder approval.

---

## 2. Structure Overview

| Section | Title / Topic | Paragraphs | Question Groups | Question Range | Question Types |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Passage 1** | *The Bicycle: From Wooden Hobby-Horse to Everyday Machine* | 7 paragraphs | Group 1 (Q1–7)<br>Group 2 (Q8–13) | Q1–Q13 | • True / False / Not Given (Q1–7)<br>• Note Completion (Q8–13, Limit: 2 words) |
| **Passage 2** | *Green Roofs: Gardens in the Sky* | 7 paragraphs (A–G) | Group 3 (Q14–19)<br>Group 4 (Q20–23)<br>Group 5 (Q24–26) | Q14–Q26 | • Matching Headings (Q14–19, Headings i–ix)<br>• Sentence Completion (Q20–23, Limit: 2 words)<br>• Multiple Choice (Q24–26, A–D) |
| **Passage 3** | *The Myth of Multitasking* | 7 paragraphs (1–7) | Group 6 (Q27–32)<br>Group 7 (Q33–36)<br>Group 8 (Q37–40) | Q27–Q40 | • Yes / No / Not Given (Q27–32)<br>• Multiple Choice (Q33–36, A–D)<br>• Summary Completion w/ word list (Q37–40, A–H) |

---

## 3. Comprehensive Question-by-Question Audit (Q1–Q40)

### Section 1: Passage 1 (Q1–13)
*The Bicycle: From Wooden Hobby-Horse to Everyday Machine*

| Q# | Type | Prompt / Summary Text | Primary Answer | Accepted Alternatives | Word Limit | Citation & Rationale |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | TRUE_FALSE_NOT_GIVEN | Karl von Drais was an engineer by profession. | `FALSE` | `F` | — | Para 2 calls him ‘a German forester’, not an engineer. |
| **2** | TRUE_FALSE_NOT_GIVEN | Drais's invention was prompted partly by the high cost of keeping horses. | `TRUE` | `T` | — | Para 2: bad harvests left oats scarce and horses expensive to feed. |
| **3** | TRUE_FALSE_NOT_GIVEN | Drais earned a large profit from selling his machines in Paris. | `NOT GIVEN` | `NG` | — | Para 2 says crowds gathered in Paris but never mentions Drais's earnings. |
| **4** | TRUE_FALSE_NOT_GIVEN | The nickname ‘boneshakers’ referred to the metal rims of the velocipede's wheels. | `TRUE` | `T` | — | Para 3: ‘iron-rimmed wheels earned them the nickname’. |
| **5** | TRUE_FALSE_NOT_GIVEN | A larger front wheel allowed a penny-farthing rider to cover more distance with each push on the pedals. | `TRUE` | `T` | — | Para 4: one turn of the pedals = one turn of the wheel, so a bigger wheel covered more ground. |
| **6** | TRUE_FALSE_NOT_GIVEN | Penny-farthings were popular with people from every social class. | `FALSE` | `F` | — | Para 4: popular ‘mainly with young, athletic and wealthy men’. |
| **7** | TRUE_FALSE_NOT_GIVEN | The Rover was the first bicycle to be driven by a chain. | `NOT GIVEN` | `NG` | — | Para 5 says the Rover had a chain but does not say it was the first to do so. |
| **8** | NOTE_COMPLETION | The 1880s: In 1885, John Kemp Starley's Rover placed the rider low, [8] the two wheels, so that both feet could touch the ground. | `between` | — | 2 words | Para 5: ‘The rider sat low, between the wheels’. |
| **9** | NOTE_COMPLETION | The 1880s: Dunlop's [9] rubber tyre made rides more comfortable. | `air-filled` | `air filled` | 2 words | Para 5: ‘an air-filled rubber tyre’. |
| **10** | NOTE_COMPLETION | The 1890s: Factories used [10], so prices dropped and workers could afford bicycles. | `mass production` | — | 2 words | Para 6: ‘Factories adopted mass production, prices fell’. |
| **11** | NOTE_COMPLETION | The 1890s: Women gained [11] and began to wear more practical clothes. | `independence` | — | 2 words | Para 6: ‘the bicycle gave them independence’. |
| **12** | NOTE_COMPLETION | Recent decades: In the 1970s, higher [12] and anxiety about pollution renewed interest in cycling. | `fuel prices` | — | 2 words | Para 7: ‘rising fuel prices and growing concern about pollution’. |
| **13** | NOTE_COMPLETION | Recent decades: [13] bicycles now attract older riders and those facing long, hilly journeys. | `electric` | — | 2 words | Para 7: ‘electric models are extending its appeal to older riders’. |

---

### Section 2: Passage 2 (Q14–26)
*Green Roofs: Gardens in the Sky*

**Context Headings List for Group 3 (Q14–19):**  
`i`: Rainwater held back and released slowly  
`ii`: Cooler buildings in warmer cities  
`iii`: Why the idea may not suit every country  
`iv`: The price of installing a roof garden  
`v`: Rooftops as places to grow food and relax  
`vi`: Arguments that the investment pays for itself  
`vii`: A home for creatures in crowded places  
`viii`: A tradition that was forgotten  
`ix`: The danger of falling plants  

| Q# | Type | Prompt / Summary Text | Primary Answer | Accepted Alternatives | Word Limit | Citation & Rationale |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **14** | MATCHING_HEADINGS | Paragraph B | `ii` | `II` | — | Paragraph B: Cooling effect of plants; reduces the urban heat island. |
| **15** | MATCHING_HEADINGS | Paragraph C | `i` | `I` | — | Paragraph C: Roofs act like sponges and release water slowly. |
| **16** | MATCHING_HEADINGS | Paragraph D | `vii` | `VII` | — | Paragraph D: Bees, butterflies and birds find habitats on roofs. |
| **17** | MATCHING_HEADINGS | Paragraph E | `iv` | `IV` | — | Paragraph E: Heavier structure, higher initial price and maintenance. |
| **18** | MATCHING_HEADINGS | Paragraph F | `vi` | `VI` | — | Paragraph F: Longer membrane life, lower energy use, higher rents. |
| **19** | MATCHING_HEADINGS | Paragraph G | `v` | `V` | — | Paragraph G: Rooftop farms and public parks. |
| **20** | SENTENCE_COMPLETION | A modern green roof consists of waterproofing, drainage and [20] that supports plants. | `growing material` | — | 2 words | Para A: ‘waterproofing, drainage and growing material’. |
| **21** | SENTENCE_COMPLETION | In older cities, heavy storms can cause [21] of untreated waste into rivers. | `overflows` | `overflow` | 2 words | Para C: ‘overflows of untreated waste into rivers’. |
| **22** | SENTENCE_COMPLETION | Ecologists compare roof habitats to [22], so animals must be able to reach them. | `islands` | `isolated islands` | 2 words | Para D: ‘roof habitats are isolated islands’. Both "islands" and "isolated islands" satisfy the 2-word limit. |
| **23** | SENTENCE_COMPLETION | Owners of older buildings may need to pay for [23] before installing a green roof. | `structural reinforcement` | — | 2 words | Para E: ‘expensive structural reinforcement’. |
| **24** | MULTIPLE_CHOICE | According to critics in paragraph E, private owners hesitate to install green roofs because | `B` | `b` | — | Para E: owners ‘rarely see the financial reward… such gains are shared by the whole city’. (Option B: the benefits are shared by the whole city rather than the owner) |
| **25** | MULTIPLE_CHOICE | What is stated about Toronto in paragraph F? | `B` | `b` | — | Para F: Toronto ‘now requires green roofs on large new buildings’. (Option B: It insists that large new buildings have green roofs) |
| **26** | MULTIPLE_CHOICE | What is the writer's final point in paragraph G? | `C` | `c` | — | Para G: ‘cities need not choose between building and nature if they… build upwards’. (Option C: Cities can have both buildings and nature if they build upwards) |

---

### Section 3: Passage 3 (Q27–40)
*The Myth of Multitasking*

**Context Word List for Group 8 (Q37–40):**  
`A`: predator | `B`: reward | `C`: triggers | `D`: skill  
`E`: unproductive | `F`: exhausting | `G`: weakness | `H`: hunter  

| Q# | Type | Prompt / Summary Text | Primary Answer | Accepted Alternatives | Word Limit | Citation & Rationale |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **27** | YES_NO_NOT_GIVEN | Employers often list multitasking as a required skill in job advertisements. | `YES` | `Y` | — | Para 1: job advertisements ‘routinely demand it’. |
| **28** | YES_NO_NOT_GIVEN | The delays caused by task-switching are too small to have any real effect. | `NO` | `N` | — | Para 2: the tiny delays ‘accumulate’ over a working day. |
| **29** | YES_NO_NOT_GIVEN | Attention residue is more serious for managers than for other staff. | `NOT GIVEN` | `NG` | — | Para 3 does not compare managers with other staff. |
| **30** | YES_NO_NOT_GIVEN | Using a hands-free phone does not remove the risk of distraction while driving. | `YES` | `Y` | — | Para 4: ‘even hands-free phone calls can impair driving’. |
| **31** | YES_NO_NOT_GIVEN | The study of heavy media multitaskers showed that multitasking damages the brain. | `NO` | `N` | — | Para 5: ‘This does not prove that multitasking damages the brain’. |
| **32** | YES_NO_NOT_GIVEN | Training in prioritising can help even in jobs with unpredictable demands. | `YES` | `Y` | — | Para 6: ‘Even there… training staff to prioritise… produces better results’. |
| **33** | MULTIPLE_CHOICE | According to the writer, experiments in which people alternate between simple tasks show that | `C` | `c` | — | Para 2: people ‘become slower and make more errors immediately after each switch’. (Option C: delays appear immediately after each switch) |
| **34** | MULTIPLE_CHOICE | The writer says some people can combine two activities successfully because | `A` | `a` | — | Para 4: one task is ‘so well practised that it requires almost no conscious thought’. (Option A: one of the activities has become almost automatic) |
| **35** | MULTIPLE_CHOICE | What does the writer conclude about the study of heavy media multitaskers? | `D` | `d` | — | Para 5: not proof of damage, yet it ‘challenges the comforting idea that practice makes perfect’. (Option D: Its results do not prove a cause, but they still challenge a popular belief) |
| **36** | MULTIPLE_CHOICE | What is the writer's view of workplace measures such as ‘quiet hours’ for email? | `B` | `b` | — | Para 6: ‘Such policies are not a cure, since some jobs genuinely involve unpredictable demands’. (Option B: They help but cannot solve every problem) |
| **37** | SUMMARY_COMPLETION | The ability to shift attention quickly was once useful because it allowed our ancestors to notice a 37 [_______] while they were busy gathering food. | `A` | `predator`, `A predator` | — | Para 7: ‘notice a predator while they were gathering food’. Candidate can write option letter A or word. |
| **38** | SUMMARY_COMPLETION | Today, technology provides constant 38 [_______] for this instinct, | `C` | `triggers`, `C triggers` | — | Para 7: ‘endless triggers for that instinct’. Candidate can write option letter C or word. |
| **39** | SUMMARY_COMPLETION | and people have wrongly come to see the reflex as a 39 [_______]. | `D` | `skill`, `D skill` | — | Para 7: ‘mistaken the reflex for a skill’. Candidate can write option letter D or word. |
| **40** | SUMMARY_COMPLETION | Working on a single task may seem 40 [_______] at first, but it is probably more effective and less tiring. | `E` | `unproductive`, `E unproductive` | — | Para 7: ‘may feel unproductive at first’. Candidate can write option letter E or word. |

---

## 4. Band Conversion Table Verification

Direct transcription from `resource/Mock_01_Answer_Key.pdf` (Page 3):

| Raw Score (Correct / 40) | Estimated IELTS Band Score |
| :---: | :---: |
| **39 – 40** | **9.0** |
| **37 – 38** | **8.5** |
| **35 – 36** | **8.0** |
| **33 – 34** | **7.5** |
| **30 – 32** | **7.0** |
| **27 – 29** | **6.5** |
| **23 – 26** | **6.0** |
| **19 – 22** | **5.5** |
| **15 – 18** | **5.0** |
| **13 – 14** | **4.5** |
| **10 – 12** | **4.0** |
| **8 – 9** | **3.5** |
| **6 – 7** | **3.0** |
| **4 – 5** | **2.5** |
| **3** | **2.0** |
| **2** | **1.5** |
| **1** | **1.0** |
| **0** | **0.0** |

*Verification Note:* All boundary values are monotonically non-decreasing, non-overlapping, and completely cover the entire integer spectrum from 0 to 40.

---

## 5. Scoring Engine & Normalization Rules

Per architectural decisions:
1. **No Semantic / Fuzzy Matching:** Strict deterministic comparison against pre-configured accepted alternative variants.
2. **Whitespace Normalization:** Multiple spaces, leading/trailing spaces, tabs, and newlines are collapsed to single spaces.
3. **Punctuation Trimming:** Quotes, brackets, trailing periods, and commas are stripped. Hyphenated compounds (e.g. `air-filled`) are recognized both hyphenated and spaced (`air filled`).
4. **Token Canonicalization:**
   - Case-insensitive (`FALSE` = `false` = `False`).
   - Standard IELTS abbreviations are accepted (`T`/`F`/`NG`, `Y`/`N`/`NG`).
   - Roman numerals are normalized (`ii` = `II`).
   - Multiple choice letters are normalized (`A` = `a` = `(A)`).
   - Summary completion with a word box accepts the letter option (`A`) or the matched word (`predator`).
5. **Word Limits:** Questions 8–13 and 20–23 enforce `NO MORE THAN TWO WORDS`. Hyphenated compound words count as 1 word. Submissions exceeding the limit receive 0 marks with `wordLimitExceeded: true`.

---

## 6. Automated Test Verification Results

The test suite executed with **29 passing tests across 3 suites**:

```
✓ lib/scoring/__tests__/scoring.test.ts (15 tests)
✓ lib/services/__tests__/testPublishing.test.ts (5 tests)
✓ lib/scoring/__tests__/mock01SeedValidation.test.ts (9 tests)

Test Files  3 passed (3)
Tests       29 passed (29)
Time        138ms
```

Key verified test assertions:
- **Test Metadata:** Title, slug `academic-reading-mock-01`, 60-min duration, 40 total questions.
- **Continuous Question Numbering:** Exactly 40 questions numbered 1 to 40 without gaps or duplicates.
- **Word Limits:** Every accepted answer for Q8–13 and Q20–23 has word count $\le 2$.
- **Golden Score Simulation:** 40 primary answers produce raw score 40, Band 9.0.
- **Variant Simulation:** 40 case/abbreviation/synonym variants produce raw score 40, Band 9.0.
- **Zero Score Simulation:** Empty attempt produces raw score 0, Band 0.0.
- **Publishing Service:** Enforces full atomic validation and composite foreign key copying.

---

## 7. Pre-Seeding Safeguards Checklist

- [x] All 40 questions, answers, and explanations extracted and cross-referenced.
- [x] Word limits configured on completion groups.
- [x] Band conversion table verified against source PDF.
- [x] Automated test suite passing with 100% success.
- [x] Neon database verified: `testCount: 0`, `publishedVersionCount: 0`, `attemptCount: 0`.
- [x] Seed script authored (`prisma/seed.ts`) and guarded against unprompted execution.
- [ ] **Awaiting Founder Approval to run `bun prisma/seed.ts` against Neon.**
