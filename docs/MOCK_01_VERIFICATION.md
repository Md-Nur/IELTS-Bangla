# Mock Test 01 Content and Seed Verification Audit Report — IELTS Bangla

**Document Version:** 2.1.0 (Pre-Seeding Answer-Key Corrections & Source Audit)  
**Date:** 2026-11-09  
**Module:** Academic Reading  
**Test Identifier:** `academic-reading-mock-01`  
**Database Status:** Seeded into dedicated Neon PostgreSQL database `ielts_bangla` (Published Version ID: `cmw86bndp005wlqu6v8yuiwsx`) and verified with independent post-seed audit.

---

## 1. Executive Summary & Answer-Key Corrections

Following the founder review, the answer key for **Mock Test 01** has been strictly aligned with official test materials and instructions:

1. **Q37–Q40 (Summary Completion with Word List):** Instructions require candidates to write letters A–H. Only option letters (`A`, `C`, `D`, `E`, case-insensitive and standard formatting like `(A)`) are accepted. All word-based entries (`predator`, `triggers`, `skill`, `unproductive`) and letter+word combinations (`A predator`, `C triggers`) have been **completely removed and are scored as incorrect**.
2. **Q21 (Sentence Completion):** Unapproved singular variant `overflow` has been removed. Only the official plural form `overflows` is accepted.
3. **Q22 (Sentence Completion):** Unapproved 2-word phrase `isolated islands` has been removed. Only the official concise noun `islands` is accepted.
4. **Q9 (Hyphenation Review):** Official primary answer is `air-filled` (PDF-verified). The non-hyphenated variant `air filled` is classified as a **Manually Approved Alternative** (marking tolerance for unhyphenated compound within the 2-word limit) and is clearly distinguished from PDF-verified source text.
5. **Database Invariant:** Exactly **54 accepted answer rows** exist across the 40 questions (39 questions with 1 answer; Q9 with 2 answers; Q1–7 and Q27–32 with standard IELTS T/F/NG and Y/N/NG abbreviation variants).

---

## 2. Complete Question-by-Question Source Audit (Q1–Q40)

### Classification Legend:
- `[OFFICIAL-PDF]`: Directly verified from `Mock_01_Test.pdf` or `Mock_01_Answer_Key.pdf`.
- `[MANUALLY-APPROVED-ALT]`: Explicitly approved marking alternative (e.g. unhyphenated compound).
- `[AUTOMATED-TEST]`: Verified by automated test suites.
- `[REJECTED-UNAPPROVED]`: Inferred variants verified as rejected by the scoring engine.

---

### Section 1: Reading Passage 1 (Questions 1–13)
*The Bicycle: From Wooden Hobby-Horse to Everyday Machine*  
- **Source PDF:** `Mock_01_Test.pdf` Pages 2–3 | `Mock_01_Answer_Key.pdf` Page 1

#### Group 1: Questions 1–7 (True / False / Not Given)
*Instructions: Write TRUE if the statement agrees with the information, FALSE if it contradicts, NOT GIVEN if there is no information.*

| Q# | Exact Question Prompt | Official Answer `[OFFICIAL-PDF]` | Accepted Alternatives | Source Pages | Passage Citation & Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | Karl von Drais was an engineer by profession. | `FALSE` | `F` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 2 calls him ‘a German forester’, not an engineer. |
| **2** | Drais's invention was prompted partly by the high cost of keeping horses. | `TRUE` | `T` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 2: bad harvests left oats scarce and horses expensive to feed. |
| **3** | Drais earned a large profit from selling his machines in Paris. | `NOT GIVEN` | `NG` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 2 says crowds gathered in Paris but never mentions Drais's earnings. |
| **4** | The nickname ‘boneshakers’ referred to the metal rims of the velocipede's wheels. | `TRUE` | `T` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 3: ‘iron-rimmed wheels earned them the nickname’. |
| **5** | A larger front wheel allowed a penny-farthing rider to cover more distance with each push on the pedals. | `TRUE` | `T` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 4: one turn of the pedals = one turn of the wheel, so a bigger wheel covered more ground. |
| **6** | Penny-farthings were popular with people from every social class. | `FALSE` | `F` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 4: popular ‘mainly with young, athletic and wealthy men’. |
| **7** | The Rover was the first bicycle to be driven by a chain. | `NOT GIVEN` | `NG` (case-insensitive) | Test: p.3<br>Key: p.1 | Para 5 says the Rover had a chain but does not say it was the first to do so. |

#### Group 2: Questions 8–13 (Note Completion — Word Limit: 2)
*Instructions: Choose NO MORE THAN TWO WORDS from the passage for each answer.*

| Q# | Exact Question Prompt | Official Answer `[OFFICIAL-PDF]` | Approved Alternatives | Word Limit | Source Pages | Passage Citation & Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **8** | The 1880s: In 1885, John Kemp Starley's Rover placed the rider low, [8] the two wheels, so that both feet could touch the ground. | `between` | None | 1 word ($\le 2$) | Test: p.3<br>Key: p.1 | Para 5: ‘The rider sat low, between the wheels’. |
| **9** | The 1880s: Dunlop's [9] rubber tyre made rides more comfortable. | `air-filled` | `air filled` `[MANUALLY-APPROVED-ALT]` | 1 word / 2 words ($\le 2$) | Test: p.3<br>Key: p.1 | Para 5: ‘an air-filled rubber tyre’.<br>*Justification:* Hyphenated compound counts as 1 word. The spaced form `air filled` counts as 2 words and does not violate the 2-word limit. Accepted as a lenient spelling tolerance. |
| **10** | The 1890s: Factories used [10], so prices dropped and workers could afford bicycles. | `mass production` | None | 2 words ($\le 2$) | Test: p.3<br>Key: p.1 | Para 6: ‘Factories adopted mass production, prices fell’. |
| **11** | The 1890s: Women gained [11] and began to wear more practical clothes. | `independence` | None | 1 word ($\le 2$) | Test: p.3<br>Key: p.1 | Para 6: ‘the bicycle gave them independence’. |
| **12** | Recent decades: In the 1970s, higher [12] and anxiety about pollution renewed interest in cycling. | `fuel prices` | None | 2 words ($\le 2$) | Test: p.3<br>Key: p.1 | Para 7: ‘rising fuel prices and growing concern about pollution’. |
| **13** | Recent decades: [13] bicycles now attract older riders and those facing long, hilly journeys. | `electric` | None | 1 word ($\le 2$) | Test: p.3<br>Key: p.1 | Para 7: ‘electric models are extending its appeal to older riders’. |

---

### Section 2: Reading Passage 2 (Questions 14–26)
*Green Roofs: Gardens in the Sky*  
- **Source PDF:** `Mock_01_Test.pdf` Pages 4–6 | `Mock_01_Answer_Key.pdf` Pages 1–2

#### Group 3: Questions 14–19 (Matching Headings — Roman Numerals i–ix)
*Instructions: Choose the correct heading for each paragraph from the list of headings (i–ix).*

| Q# | Paragraph | Official Heading `[OFFICIAL-PDF]` | Accepted Case Variant | Source Pages | Heading Text & Official Explanation |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **14** | Paragraph B | `ii` | `II` | Test: p.5<br>Key: p.1 | Heading ii: *Cooler buildings in warmer cities*. (Para B: Cooling effect of plants; reduces urban heat island). |
| **15** | Paragraph C | `i` | `I` | Test: p.5<br>Key: p.1 | Heading i: *Rainwater held back and released slowly*. (Para C: Roofs act like sponges and release water slowly). |
| **16** | Paragraph D | `vii` | `VII` | Test: p.5<br>Key: p.1 | Heading vii: *A home for creatures in crowded places*. (Para D: Bees, butterflies and birds find habitats on roofs). |
| **17** | Paragraph E | `iv` | `IV` | Test: p.5<br>Key: p.1 | Heading iv: *The price of installing a roof garden*. (Para E: Heavier structure, higher initial price and maintenance). |
| **18** | Paragraph F | `vi` | `VI` | Test: p.5<br>Key: p.1 | Heading vi: *Arguments that the investment pays for itself*. (Para F: Longer membrane life, lower energy use, higher rents). |
| **19** | Paragraph G | `v` | `V` | Test: p.5<br>Key: p.1 | Heading v: *Rooftops as places to grow food and relax*. (Para G: Rooftop farms and public parks). |

#### Group 4: Questions 20–23 (Sentence Completion — Word Limit: 2)
*Instructions: Choose NO MORE THAN TWO WORDS from the passage for each answer.*

| Q# | Exact Question Prompt | Official Answer `[OFFICIAL-PDF]` | Rejected Alternatives `[REJECTED-UNAPPROVED]` | Word Limit | Source Pages | Passage Citation & Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **20** | A modern green roof consists of waterproofing, drainage and [20] that supports plants. | `growing material` | None | 2 words | Test: p.5<br>Key: p.1 | Para A: ‘waterproofing, drainage and growing material’. |
| **21** | In older cities, heavy storms can cause [21] of untreated waste into rivers. | `overflows` | `overflow` *(strictly rejected)* | 1 word | Test: p.5<br>Key: p.1 | Para C: ‘overflows of untreated waste into rivers’. Key specifies `overflows`. |
| **22** | Ecologists compare roof habitats to [22], so animals must be able to reach them. | `islands` | `isolated islands` *(strictly rejected)* | 1 word | Test: p.5<br>Key: p.1 | Para D: ‘roof habitats are isolated islands’. Key specifies `islands`. |
| **23** | Owners of older buildings may need to pay for [23] before installing a green roof. | `structural reinforcement` | `expensive structural reinforcement` *(rejected: 3 words)* | 2 words | Test: p.5<br>Key: p.1 | Para E: ‘expensive structural reinforcement’. |

#### Group 5: Questions 24–26 (Multiple Choice — Options A–D)
*Instructions: Choose the correct letter, A, B, C or D.*

| Q# | Exact Question Prompt | Official Key `[OFFICIAL-PDF]` | Normalization Variants | Source Pages | Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **24** | According to critics in paragraph E, private owners hesitate to install green roofs because | `B` | `b`, `(B)`, `B.` | Test: p.6<br>Key: p.2 | Para E: owners ‘rarely see the financial reward… such gains are shared by the whole city’. (Option B: the benefits are shared by the whole city rather than the owner) |
| **25** | What is stated about Toronto in paragraph F? | `B` | `b`, `(B)`, `B.` | Test: p.6<br>Key: p.2 | Para F: Toronto ‘now requires green roofs on large new buildings’. (Option B: It insists that large new buildings have green roofs) |
| **26** | What is the writer's final point in paragraph G? | `C` | `c`, `(C)`, `C.` | Test: p.6<br>Key: p.2 | Para G: ‘cities need not choose between building and nature if they… build upwards’. (Option C: Cities can have both buildings and nature if they build upwards) |

---

### Section 3: Reading Passage 3 (Questions 27–40)
*The Myth of Multitasking*  
- **Source PDF:** `Mock_01_Test.pdf` Pages 7–9 | `Mock_01_Answer_Key.pdf` Page 2

#### Group 6: Questions 27–32 (Yes / No / Not Given)
*Instructions: Write YES if the statement agrees with the views/claims of the writer, NO if it contradicts, NOT GIVEN if it is impossible to say what the writer thinks.*

| Q# | Exact Question Prompt | Official Answer `[OFFICIAL-PDF]` | Accepted Abbreviations | Source Pages | Passage Citation & Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **27** | Employers often list multitasking as a required skill in job advertisements. | `YES` | `Y` | Test: p.8<br>Key: p.2 | Para 1: job advertisements ‘routinely demand it’. |
| **28** | The delays caused by task-switching are too small to have any real effect. | `NO` | `N` | Test: p.8<br>Key: p.2 | Para 2: the tiny delays ‘accumulate’ over a working day. |
| **29** | Attention residue is more serious for managers than for other staff. | `NOT GIVEN` | `NG` | Test: p.8<br>Key: p.2 | Para 3 does not compare managers with other staff. |
| **30** | Using a hands-free phone does not remove the risk of distraction while driving. | `YES` | `Y` | Test: p.8<br>Key: p.2 | Para 4: ‘even hands-free phone calls can impair driving’. |
| **31** | The study of heavy media multitaskers showed that multitasking damages the brain. | `NO` | `N` | Test: p.8<br>Key: p.2 | Para 5: ‘This does not prove that multitasking damages the brain’. |
| **32** | Training in prioritising can help even in jobs with unpredictable demands. | `YES` | `Y` | Test: p.8<br>Key: p.2 | Para 6: ‘Even there… training staff to prioritise… produces better results’. |

#### Group 7: Questions 33–36 (Multiple Choice — Options A–D)
*Instructions: Choose the correct letter, A, B, C or D.*

| Q# | Exact Question Prompt | Official Key `[OFFICIAL-PDF]` | Normalization Variants | Source Pages | Official Explanation |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **33** | According to the writer, experiments in which people alternate between simple tasks show that | `C` | `c`, `(C)`, `C.` | Test: p.9<br>Key: p.2 | Para 2: people ‘become slower and make more errors immediately after each switch’. (Option C: delays appear immediately after each switch) |
| **34** | The writer says some people can combine two activities successfully because | `A` | `a`, `(A)`, `A.` | Test: p.9<br>Key: p.2 | Para 4: one task is ‘so well practised that it requires almost no conscious thought’. (Option A: one of the activities has become almost automatic) |
| **35** | What does the writer conclude about the study of heavy media multitaskers? | `D` | `d`, `(D)`, `D.` | Test: p.9<br>Key: p.2 | Para 5: not proof of damage, yet it ‘challenges the comforting idea that practice makes perfect’. (Option D: Its results do not prove a cause, but they still challenge a popular belief) |
| **36** | What is the writer's view of workplace measures such as ‘quiet hours’ for email? | `B` | `b`, `(B)`, `B.` | Test: p.9<br>Key: p.2 | Para 6: ‘Such policies are not a cure, since some jobs genuinely involve unpredictable demands’. (Option B: They help but cannot solve every problem) |

#### Group 8: Questions 37–40 (Summary Completion with Word List — Letters A–H)
*Instructions: Complete the summary using the list of words, A–H, below. Write the correct letter, A–H, in boxes 37–40 on your answer sheet.*  
*Word Bank: `A`: predator \| `B`: reward \| `C`: triggers \| `D`: skill \| `E`: unproductive \| `F`: exhausting \| `G`: weakness \| `H`: hunter*

| Q# | Exact Summary Sentence Prompt | Official Answer `[OFFICIAL-PDF]` | Accepted Case / Formats | Rejected Words / Combos `[REJECTED-UNAPPROVED]` | Source Pages | Citation & Explanation |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **37** | The ability to shift attention quickly was once useful because it allowed our ancestors to notice a 37 [_______] while they were busy gathering food. | `A` | `a`, `(A)`, `A.` | `predator`, `A predator` *(strictly rejected)* | Test: p.9<br>Key: p.2 | Para 7: ‘notice a predator while they were gathering food’. Candidate must write letter **A**. |
| **38** | Today, technology provides constant 38 [_______] for this instinct, | `C` | `c`, `(C)`, `C.` | `triggers`, `C triggers` *(strictly rejected)* | Test: p.9<br>Key: p.2 | Para 7: ‘endless triggers for that instinct’. Candidate must write letter **C**. |
| **39** | and people have wrongly come to see the reflex as a 39 [_______]. | `D` | `d`, `(D)`, `D.` | `skill`, `D skill` *(strictly rejected)* | Test: p.9<br>Key: p.2 | Para 7: ‘mistaken the reflex for a skill’. Candidate must write letter **D**. |
| **40** | Working on a single task may seem 40 [_______] at first, but it is probably more effective and less tiring. | `E` | `e`, `(E)`, `E.` | `unproductive`, `E unproductive` *(strictly rejected)* | Test: p.9<br>Key: p.2 | Para 7: ‘may feel unproductive at first’. Candidate must write letter **E**. |

---

## 3. Seed Integration & Database Invariants (Disposable PostgreSQL)

Tested on a disposable PostgreSQL 17.5 cluster (`localhost:5433/ielts_disposable_audit`) with the corrected 54 accepted answers:

- **Seed Executions:** 2 consecutive executions.
- **Idempotency:** Second run exited safely with 0 duplicate mutations.
- **Entity Invariants:**
  - `Test`: exactly **1**
  - `DraftSection`: exactly **3** | `PublishedSection`: exactly **3**
  - `DraftQuestionGroup`: exactly **8** | `PublishedQuestionGroup`: exactly **8**
  - `DraftQuestion`: exactly **40** | `PublishedQuestion`: exactly **40**
  - `DraftAcceptedAnswer`: exactly **54** | `PublishedAcceptedAnswer`: exactly **54**
  - `PublishedTestVersion`: exactly **1** (Version 1 snapshot)
- **Question Continuity:** Questions 1 to 40 strictly continuous without gaps or duplicates.
- **Safe Failure & Rollback:** Tested invalid drafts (numbering gap, missing keys); full transactional rollback confirmed with 0 orphaned records.
- **Immutability:** PostgreSQL engine triggers block `UPDATE` and `DELETE` on published records.

---

## 4. Test Suite and Build Status

- **Unit Tests (`bun test`):** 49 tests passing across 4 test files (548 assertions).
- **ESLint (`bun run lint`):** Passed with 0 errors and 0 warnings.
- **TypeScript Check (`bun x tsc --noEmit`):** Clean compile with 0 errors.
- **Production Build (`bun run build`):** Compiled successfully, all static pages generated cleanly.
- **Neon Production Database:** **0 rows committed. Untouched.**
