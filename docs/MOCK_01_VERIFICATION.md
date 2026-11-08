# Mock Test 01 Content and Seed Verification Audit Report — IELTS Bangla

**Document Version:** 2.0.0 (Final Pre-Seed Content & Database Audit)  
**Date:** 2026-11-09  
**Module:** Academic Reading  
**Test Identifier:** `academic-reading-mock-01`  
**Database Status:** Verified on disposable PostgreSQL cluster (`localhost:5433`). **Zero rows committed to Neon PostgreSQL.**

---

## 1. Executive Summary

This comprehensive audit validates **Academic Reading Mock Test 01** across source accuracy, database seeding idempotency, transaction publishing guarantees, and scoring normalization rules.

| Audit Pillar | Requirement | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **1. Source Audit** | Exact prompts, keys, citations, explanations for Q1–Q40 | Cross-checked against `Mock_01_Test.pdf` & `Mock_01_Answer_Key.pdf` | **100% Verified** |
| **2. Seed Integration** | Idempotent execution (run twice on disposable DB) | Disposable PostgreSQL (`localhost:5433`), executed `prisma/seed.ts` $\times 2$ | **100% Verified** |
| **3. Publishing Service** | Atomic snapshot, numbering continuity, immutability | Transaction test suite on disposable DB + PostgreSQL triggers | **100% Verified** |
| **4. Scoring Engine** | Deterministic evaluation of all 8 question types | 48 automated test specs covering all edge cases | **100% Verified** |
| **5. Neon Safeguard** | No unauthorized commits to production / Neon | Explicit URL assertions + zero connection attempts | **Enforced** |

---

## 2. Question-by-Question Source Audit (Q1–Q40)

### Verification Legend:
- `[PDF-VERIFIED]`: Directly transcribed from `Mock_01_Test.pdf` or `Mock_01_Answer_Key.pdf`.
- `[AUTOMATED-TEST]`: Covered and asserted by automated test suites.
- `[INFERRED-TOLERANCE]`: Accepted alternative derived from IELTS marking principles (flagged for founder review).

---

### Passage 1: The Bicycle: From Wooden Hobby-Horse to Everyday Machine
- **Source PDF:** `Mock_01_Test.pdf` (Passage text: Page 2; Questions: Page 3)
- **Answer Key PDF:** `Mock_01_Answer_Key.pdf` (Page 1)
- **Passage Structure:** 7 unnumbered paragraphs.

#### Group 1: Questions 1–7
- **Original Type:** True / False / Not Given (`TRUE_FALSE_NOT_GIVEN`)
- **Original Instructions:**
  > *Do the following statements agree with the information given in Reading Passage 1?*  
  > *In boxes 1–7 on your answer sheet, write:*  
  > `TRUE` *if the statement agrees with the information*  
  > `FALSE` *if the statement contradicts the information*  
  > `NOT GIVEN` *if there is no information on this*

##### Question 1
- **Exact Prompt:** "Karl von Drais was an engineer by profession."
- **Correct Answer:** `FALSE`
- **Accepted Alternatives:** `F` (case-insensitive: `false`, `f`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 2: *"The ancestor of the bicycle appeared in 1817, when a German forester named Karl von Drais built a wooden frame with two wheels set in line and a steerable front wheel."*
- **Official Explanation:** Para 2 calls him ‘a German forester’, not an engineer.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 2
- **Exact Prompt:** "Drais's invention was prompted partly by the high cost of keeping horses."
- **Correct Answer:** `TRUE`
- **Accepted Alternatives:** `T` (case-insensitive: `true`, `t`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 2: *"Drais had been searching for a quicker way to travel around the estates he managed, at a time when bad harvests had left oats scarce and horses expensive to feed."*
- **Official Explanation:** Para 2: bad harvests left oats scarce and horses expensive to feed.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 3
- **Exact Prompt:** "Drais earned a large profit from selling his machines in Paris."
- **Correct Answer:** `NOT GIVEN`
- **Accepted Alternatives:** `NG` (case-insensitive: `not given`, `ng`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 2: *"His ‘running machine’ drew crowds in Mannheim and Paris... Public interest faded within a few years."*
- **Official Explanation:** Para 2 says crowds gathered in Paris but never mentions Drais's earnings.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 4
- **Exact Prompt:** "The nickname ‘boneshakers’ referred to the metal rims of the velocipede's wheels."
- **Correct Answer:** `TRUE`
- **Accepted Alternatives:** `T` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 3: *"These machines, called velocipedes, were heavy and uncomfortable, and their iron-rimmed wheels earned them the nickname ‘boneshakers’."*
- **Official Explanation:** Para 3: ‘iron-rimmed wheels earned them the nickname’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 5
- **Exact Prompt:** "A larger front wheel allowed a penny-farthing rider to cover more distance with each push on the pedals."
- **Correct Answer:** `TRUE`
- **Accepted Alternatives:** `T` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 4: *"Because one turn of the pedals produced one turn of the wheel, a bigger wheel covered more ground with each push."*
- **Official Explanation:** Para 4: one turn of the pedals = one turn of the wheel, so a bigger wheel covered more ground.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 6
- **Exact Prompt:** "Penny-farthings were popular with people from every social class."
- **Correct Answer:** `FALSE`
- **Accepted Alternatives:** `F` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 4: *"The machine was therefore popular mainly with young, athletic and wealthy men, and it was regarded as a sport rather than a means of transport."*
- **Official Explanation:** Para 4: popular ‘mainly with young, athletic and wealthy men’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 7
- **Exact Prompt:** "The Rover was the first bicycle to be driven by a chain."
- **Correct Answer:** `NOT GIVEN`
- **Accepted Alternatives:** `NG` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 5: *"In 1885 John Kemp Starley, working in Coventry, produced the Rover, which had two wheels of roughly equal size and a chain that drove the rear wheel."*
- **Official Explanation:** Para 5 says the Rover had a chain but does not say it was the first to do so.
- **Audit Tag:** `[PDF-VERIFIED]`

---

#### Group 2: Questions 8–13
- **Original Type:** Note Completion (`NOTE_COMPLETION`)
- **Word Limit:** `NO MORE THAN TWO WORDS`
- **Original Instructions:**
  > *Complete the notes below.*  
  > *Choose NO MORE THAN TWO WORDS from the passage for each answer.*  
  > *Write your answers in boxes 8–13 on your answer sheet.*  
  > **The safety bicycle and its effects**

##### Question 8
- **Heading / Context:** The 1880s
- **Exact Prompt:** "In 1885, John Kemp Starley's Rover placed the rider low, 8 ________________ the two wheels, so that both feet could touch the ground."
- **Correct Answer:** `between`
- **Accepted Alternatives:** None (`between`, case-insensitive)
- **Word Count:** 1 word (Limit: 2)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 5: *"The rider sat low, between the wheels, and could put both feet on the ground."*
- **Official Explanation:** Para 5: ‘The rider sat low, between the wheels’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 9
- **Heading / Context:** The 1880s
- **Exact Prompt:** "Dunlop's 9 ________________ rubber tyre made rides more comfortable."
- **Correct Answer:** `air-filled`
- **Accepted Alternatives:** `air filled` `[INFERRED-TOLERANCE]`
- **Word Count:** `air-filled` = 1 word (hyphenated); `air filled` = 2 words (both within 2-word limit)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 5: *"Three years later a Scottish veterinary surgeon named John Boyd Dunlop developed an air-filled rubber tyre for his young son's tricycle."*
- **Official Explanation:** Para 5: ‘an air-filled rubber tyre’.
- **Review Note:** In IELTS, hyphenated words count as single words. Allowing the non-hyphenated variant (`air filled`) is standard practice as it does not breach the 2-word limit.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 10
- **Heading / Context:** The 1890s
- **Exact Prompt:** "Factories used 10 ________________, so prices dropped and workers could afford bicycles."
- **Correct Answer:** `mass production`
- **Accepted Alternatives:** None (`mass production`, case-insensitive)
- **Word Count:** 2 words (Limit: 2)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 6: *"Factories adopted mass production, prices fell, and for the first time ordinary workers could afford a machine."*
- **Official Explanation:** Para 6: ‘Factories adopted mass production, prices fell’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 11
- **Heading / Context:** The 1890s
- **Exact Prompt:** "Women gained 11 ________________ and began to wear more practical clothes."
- **Correct Answer:** `independence`
- **Accepted Alternatives:** None (`independence`, case-insensitive)
- **Word Count:** 1 word (Limit: 2)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 6: *"Women in particular found that the bicycle gave them independence, and it encouraged them to wear more practical clothing, such as divided skirts."*
- **Official Explanation:** Para 6: ‘the bicycle gave them independence’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 12
- **Heading / Context:** Recent decades
- **Exact Prompt:** "In the 1970s, higher 12 ________________ and anxiety about pollution renewed interest in cycling."
- **Correct Answer:** `fuel prices`
- **Accepted Alternatives:** None (`fuel prices`, case-insensitive)
- **Word Count:** 2 words (Limit: 2)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 7: *"In the 1970s, rising fuel prices and growing concern about pollution renewed interest in cycling..."*
- **Official Explanation:** Para 7: ‘rising fuel prices and growing concern about pollution’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 13
- **Heading / Context:** Recent decades
- **Exact Prompt:** "13 ________________ bicycles now attract older riders and those facing long, hilly journeys."
- **Correct Answer:** `electric`
- **Accepted Alternatives:** None (`electric`, case-insensitive)
- **Word Count:** 1 word (Limit: 2)
- **Source PDF Page:** Test PDF Page 3; Answer Key PDF Page 1
- **Passage Citation:** Paragraph 7: *"Today the bicycle is again promoted as a clean and healthy form of urban transport, and electric models are extending its appeal to older riders..."*
- **Official Explanation:** Para 7: ‘electric models are extending its appeal to older riders’.
- **Audit Tag:** `[PDF-VERIFIED]`

---

### Passage 2: Green Roofs: Gardens in the Sky
- **Source PDF:** `Mock_01_Test.pdf` (Passage text: Page 4; Questions: Pages 5–6)
- **Answer Key PDF:** `Mock_01_Answer_Key.pdf` (Pages 1–2)
- **Passage Structure:** 7 lettered paragraphs A–G.

#### Group 3: Questions 14–19
- **Original Type:** Matching Headings (`MATCHING_HEADINGS`)
- **Original Instructions:**
  > *Reading Passage 2 has 7 paragraphs, A–G.*  
  > *Choose the correct heading for each paragraph from the list of headings below.*  
  > *Write the correct number, i–ix, in boxes 14–19 on your answer sheet.*  
  > **List of Headings:**  
  > `i`: Rainwater held back and released slowly  
  > `ii`: Cooler buildings in warmer cities  
  > `iii`: Why the idea may not suit every country  
  > `iv`: The price of installing a roof garden  
  > `v`: Rooftops as places to grow food and relax  
  > `vi`: Arguments that the investment pays for itself  
  > `vii`: A home for creatures in crowded places  
  > `viii`: A tradition that was forgotten  
  > `ix`: The danger of falling plants

##### Question 14
- **Exact Prompt:** "Paragraph B"
- **Correct Answer:** `ii`
- **Accepted Alternatives:** `II` (case-insensitive Roman numeral normalization) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph B: *"The first benefit that developers notice is thermal. Dark roofing absorbs sunlight... cooler air... Cooler roofs in turn mean that the rooms below need less air conditioning..."*
- **Official Explanation:** Paragraph B: Cooling effect of plants; reduces the urban heat island.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 15
- **Exact Prompt:** "Paragraph C"
- **Correct Answer:** `i`
- **Accepted Alternatives:** `I` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph C: *"Water is the second advantage... Green roofs act like sponges... what remains is released slowly over several hours."*
- **Official Explanation:** Paragraph C: Roofs act like sponges and release water slowly.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 16
- **Exact Prompt:** "Paragraph D"
- **Correct Answer:** `vii`
- **Accepted Alternatives:** `VII` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph D: *"Wildlife also benefits... attract bees, butterflies and beetles... colonised by ground-nesting birds... rare species... breed on rooftops."*
- **Official Explanation:** Paragraph D: Bees, butterflies and birds find habitats on roofs.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 17
- **Exact Prompt:** "Paragraph E"
- **Correct Answer:** `iv`
- **Accepted Alternatives:** `IV` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph E: *"None of this comes without cost... expensive structural reinforcement... The initial price... is typically higher... inspected and weeded regularly. Critics argue that these expenses discourage private owners..."*
- **Official Explanation:** Paragraph E: Heavier structure, higher initial price and maintenance.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 18
- **Exact Prompt:** "Paragraph F"
- **Correct Answer:** `vi`
- **Accepted Alternatives:** `VI` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph F: *"Supporters reply that the extra outlay is partly recovered over time. A roof protected... last up to twice as long... need less energy... command higher rents."*
- **Official Explanation:** Paragraph F: Longer membrane life, lower energy use, higher rents.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 19
- **Exact Prompt:** "Paragraph G"
- **Correct Answer:** `v`
- **Accepted Alternatives:** `V` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph G: *"The future of the green roof may depend on what it is used for. Some of the most ambitious projects now grow food... Others are open to the public as parks... office workers will often eat lunch in a rooftop garden..."*
- **Official Explanation:** Paragraph G: Rooftop farms and public parks.
- **Audit Tag:** `[PDF-VERIFIED]`

---

#### Group 4: Questions 20–23
- **Original Type:** Sentence Completion (`SENTENCE_COMPLETION`)
- **Word Limit:** `NO MORE THAN TWO WORDS`
- **Original Instructions:**
  > *Complete the sentences below.*  
  > *Choose NO MORE THAN TWO WORDS from the passage for each answer.*  
  > *Write your answers in boxes 20–23 on your answer sheet.*

##### Question 20
- **Exact Prompt:** "A modern green roof consists of waterproofing, drainage and 20 ________________ that supports plants."
- **Correct Answer:** `growing material`
- **Accepted Alternatives:** None (`growing material`, case-insensitive)
- **Word Count:** 2 words (Limit: 2)
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph A: *"What is new is the modern green roof, a layered system of waterproofing, drainage and growing material designed to support vegetation on top of an ordinary building."*
- **Official Explanation:** Para A: ‘waterproofing, drainage and growing material’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 21
- **Exact Prompt:** "In older cities, heavy storms can cause 21 ________________ of untreated waste into rivers."
- **Correct Answer:** `overflows`
- **Accepted Alternatives:** `overflow` `[INFERRED-TOLERANCE]`
- **Word Count:** 1 word (Limit: 2)
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph C: *"In a heavy storm, rain falling on roads and rooftops rushes into drains all at once, and in older cities with combined sewage and rainwater systems this can cause overflows of untreated waste into rivers."*
- **Official Explanation:** Para C: ‘overflows of untreated waste into rivers’.
- **Review Note:** Answer key specifies `overflows`. The singular `overflow` is included as an accepted alternative per IELTS marking guidelines where singular/plural variance that fits grammatically is accepted.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 22
- **Exact Prompt:** "Ecologists compare roof habitats to 22 ________________, so animals must be able to reach them."
- **Correct Answer:** `islands`
- **Accepted Alternatives:** `isolated islands` `[INFERRED-TOLERANCE]`
- **Word Count:** `islands` = 1 word; `isolated islands` = 2 words (both $\le 2$)
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph D: *"Ecologists point out, however, that roof habitats are isolated islands, and that animals must be able to reach them from parks or gardens nearby if the roofs are to make a lasting difference."*
- **Official Explanation:** Para D: ‘roof habitats are isolated islands’.
- **Review Note:** Answer key lists `islands`. Because the exact text phrase is `isolated islands` and the limit is 2 words, `isolated islands` is retained as an accepted variant.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 23
- **Exact Prompt:** "Owners of older buildings may need to pay for 23 ________________ before installing a green roof."
- **Correct Answer:** `structural reinforcement`
- **Accepted Alternatives:** None (`structural reinforcement`, case-insensitive)
- **Word Count:** 2 words (Limit: 2)
- **Source PDF Page:** Test PDF Page 5; Answer Key PDF Page 1
- **Passage Citation:** Paragraph E: *"A green roof is heavier than a gravel one, particularly when the soil is saturated with water, so older buildings may need expensive structural reinforcement before one can be installed."*
- **Official Explanation:** Para E: ‘expensive structural reinforcement’.
- **Note on Excluded Form:** "expensive structural reinforcement" is 3 words and is strictly rejected by the scoring engine (`wordLimitExceeded: true`).
- **Audit Tag:** `[PDF-VERIFIED]`

---

#### Group 5: Questions 24–26
- **Original Type:** Multiple Choice (`MULTIPLE_CHOICE`)
- **Original Instructions:**
  > *Choose the correct letter, A, B, C or D.*  
  > *Write the correct letter in boxes 24–26 on your answer sheet.*

##### Question 24
- **Exact Prompt:** "According to critics in paragraph E, private owners hesitate to install green roofs because"
  - `A`: they cannot find skilled workers to maintain them.
  - `B`: the benefits are shared by the whole city rather than the owner.
  - `C`: the plants make the building look untidy.
  - `D`: the roofs use too much water.
- **Correct Answer:** `B`
- **Accepted Alternatives:** `b`, `(B)`, `B.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 6; Answer Key PDF Page 2
- **Passage Citation:** Paragraph E: *"Critics argue that these expenses discourage private owners, who rarely see the financial reward of cooler air or reduced flooding because such gains are shared by the whole city."*
- **Official Explanation:** Para E: owners ‘rarely see the financial reward… such gains are shared by the whole city’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 25
- **Exact Prompt:** "What is stated about Toronto in paragraph F?"
  - `A`: It was the first city to ban conventional roofs.
  - `B`: It insists that large new buildings have green roofs.
  - `C`: It pays the full cost of green roofs on older buildings.
  - `D`: It has halved the use of air conditioning.
- **Correct Answer:** `B`
- **Accepted Alternatives:** `b`, `(B)`, `B.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 6; Answer Key PDF Page 2
- **Passage Citation:** Paragraph F: *"Toronto, for instance, now requires green roofs on large new buildings, while others offer grants to owners who add them to existing ones."*
- **Official Explanation:** Para F: Toronto ‘now requires green roofs on large new buildings’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 26
- **Exact Prompt:** "What is the writer's final point in paragraph G?"
  - `A`: Rooftop farms earn more money than parks.
  - `B`: Most cities lack the space to build green roofs.
  - `C`: Cities can have both buildings and nature if they build upwards.
  - `D`: Green roofs are mainly useful for producing honey.
- **Correct Answer:** `C`
- **Accepted Alternatives:** `c`, `(C)`, `C.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 6; Answer Key PDF Page 2
- **Passage Citation:** Paragraph G: *"Whatever their purpose, such roofs share one lesson, which is that cities need not choose between building and nature if they are prepared to build upwards."*
- **Official Explanation:** Para G: ‘cities need not choose between building and nature if they… build upwards’.
- **Audit Tag:** `[PDF-VERIFIED]`

---

### Passage 3: The Myth of Multitasking
- **Source PDF:** `Mock_01_Test.pdf` (Passage text: Page 7; Questions: Pages 8–9)
- **Answer Key PDF:** `Mock_01_Answer_Key.pdf` (Page 2)
- **Passage Structure:** 7 unnumbered paragraphs.

#### Group 6: Questions 27–32
- **Original Type:** Yes / No / Not Given (`YES_NO_NOT_GIVEN`)
- **Original Instructions:**
  > *Do the following statements agree with the views/claims of the writer in Reading Passage 3?*  
  > *In boxes 27–32 on your answer sheet, write:*  
  > `YES` *if the statement agrees with the views of the writer*  
  > `NO` *if the statement contradicts the views of the writer*  
  > `NOT GIVEN` *if it is impossible to say what the writer thinks about this*  
  > *(Note: Distinct from TRUE/FALSE/NOT GIVEN: reflects claims/views of the author)*

##### Question 27
- **Exact Prompt:** "Employers often list multitasking as a required skill in job advertisements."
- **Correct Answer:** `YES`
- **Accepted Alternatives:** `Y` (case-insensitive: `yes`, `y`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 1: *"Multitasking has become a badge of honour, and job advertisements routinely demand it."*
- **Official Explanation:** Para 1: job advertisements ‘routinely demand it’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 28
- **Exact Prompt:** "The delays caused by task-switching are too small to have any real effect."
- **Correct Answer:** `NO`
- **Accepted Alternatives:** `N` (case-insensitive: `no`, `n`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 2: *"The individual delays are tiny, often a fraction of a second, but over a working day they accumulate. Some researchers have estimated that heavy switching can consume a considerable share of a person's productive time..."*
- **Official Explanation:** Para 2: the tiny delays ‘accumulate’ over a working day.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 29
- **Exact Prompt:** "Attention residue is more serious for managers than for other staff."
- **Correct Answer:** `NOT GIVEN`
- **Accepted Alternatives:** `NG` (case-insensitive: `not given`, `ng`) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 3: *"Studies of office workers who are interrupted by incoming email have found that it can take many minutes to return to the original task with the same level of concentration... Psychologists describe this lingering effect as ‘attention residue’."*
- **Official Explanation:** Para 3 does not compare managers with other staff.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 30
- **Exact Prompt:** "Using a hands-free phone does not remove the risk of distraction while driving."
- **Correct Answer:** `YES`
- **Accepted Alternatives:** `Y` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 4: *"This explains why even hands-free phone calls can impair driving: it is the conversation, not the handset, that draws attention away from the road."*
- **Official Explanation:** Para 4: ‘even hands-free phone calls can impair driving’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 31
- **Exact Prompt:** "The study of heavy media multitaskers showed that multitasking damages the brain."
- **Correct Answer:** `NO`
- **Accepted Alternatives:** `N` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 5: *"This does not prove that multitasking damages the brain; it may be that people who are easily distracted are drawn to multitasking in the first place."*
- **Official Explanation:** Para 5: ‘This does not prove that multitasking damages the brain’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 32
- **Exact Prompt:** "Training in prioritising can help even in jobs with unpredictable demands."
- **Correct Answer:** `YES`
- **Accepted Alternatives:** `Y` (case-insensitive) `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 8; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 6: *"Such policies are not a cure, since some jobs genuinely involve unpredictable demands... Even there, however, researchers suggest that training staff to prioritise... produces better results..."*
- **Official Explanation:** Para 6: ‘Even there… training staff to prioritise… produces better results’.
- **Audit Tag:** `[PDF-VERIFIED]`

---

#### Group 7: Questions 33–36
- **Original Type:** Multiple Choice (`MULTIPLE_CHOICE`)
- **Original Instructions:**
  > *Choose the correct letter, A, B, C or D.*  
  > *Write the correct letter in boxes 33–36 on your answer sheet.*

##### Question 33
- **Exact Prompt:** "According to the writer, experiments in which people alternate between simple tasks show that"
  - `A`: volunteers improve steadily as the experiment continues.
  - `B`: errors occur only when both tasks are difficult.
  - `C`: delays appear immediately after each switch.
  - `D`: sorting colours is harder than sorting shapes.
- **Correct Answer:** `C`
- **Accepted Alternatives:** `c`, `(C)`, `C.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 2: *"In laboratory experiments, volunteers who alternate between simple tasks, such as sorting shapes and then sorting colours, become slower and make more errors immediately after each switch."*
- **Official Explanation:** Para 2: people ‘become slower and make more errors immediately after each switch’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 34
- **Exact Prompt:** "The writer says some people can combine two activities successfully because"
  - `A`: one of the activities has become almost automatic.
  - `B`: they divide their attention equally between both.
  - `C`: both activities are new to them.
  - `D`: they use different parts of the brain without effort.
- **Correct Answer:** `A`
- **Accepted Alternatives:** `a`, `(A)`, `A.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 4: *"Some combinations of tasks do work, but usually because one of them is so well practised that it requires almost no conscious thought."*
- **Official Explanation:** Para 4: one task is ‘so well practised that it requires almost no conscious thought’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 35
- **Exact Prompt:** "What does the writer conclude about the study of heavy media multitaskers?"
  - `A`: It proved that multitasking harms the brain.
  - `B`: It involved only people who work in offices.
  - `C`: It showed that practice improves task-switching.
  - `D`: Its results do not prove a cause, but they still challenge a popular belief.
- **Correct Answer:** `D`
- **Accepted Alternatives:** `d`, `(D)`, `D.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 5: *"This does not prove that multitasking damages the brain... Even so, the result challenges the comforting idea that practice makes perfect..."*
- **Official Explanation:** Para 5: not proof of damage, yet it ‘challenges the comforting idea that practice makes perfect’.
- **Audit Tag:** `[PDF-VERIFIED]`

##### Question 36
- **Exact Prompt:** "What is the writer's view of workplace measures such as ‘quiet hours’ for email?"
  - `A`: They are pointless.
  - `B`: They help but cannot solve every problem.
  - `C`: They have removed the problem in most companies.
  - `D`: They are too expensive for most employers.
- **Correct Answer:** `B`
- **Accepted Alternatives:** `b`, `(B)`, `B.` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 6: *"Many organisations have tried to reduce its costs with simple measures... Such policies are not a cure, since some jobs genuinely involve unpredictable demands..."*
- **Official Explanation:** Para 6: ‘Such policies are not a cure, since some jobs genuinely involve unpredictable demands’.
- **Audit Tag:** `[PDF-VERIFIED]`

---

#### Group 8: Questions 37–40
- **Original Type:** Summary Completion with Word List (`SUMMARY_COMPLETION`)
- **Original Instructions:**
  > *Complete the summary using the list of words, A–H, below.*  
  > *Write the correct letter, A–H, in boxes 37–40 on your answer sheet.*  
  > **Why we multitask**  
  > **Options List:**  
  > `A`: predator | `B`: reward | `C`: triggers | `D`: skill  
  > `E`: unproductive | `F`: exhausting | `G`: weakness | `H`: hunter

##### Question 37
- **Exact Prompt:** "The ability to shift attention quickly was once useful because it allowed our ancestors to notice a 37 [_______] while they were busy gathering food."
- **Primary Answer:** `A`
- **Answer Key Notation:** `A (predator)`
- **Accepted Alternatives:** `predator`, `A predator`, `a`, `(A)` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 7: *"Our ability to shift attention quickly was valuable to our ancestors, who needed to notice a predator while they were gathering food."*
- **Official Explanation:** Para 7: ‘notice a predator while they were gathering food’.
- **Format Review:** The instructions specifically state: "Write the correct letter, A–H". However, the Answer Key prints `A (predator)`. Accepting the letter option `A`, the word `predator`, or `A predator` ensures no student is penalized for writing the word instead of the letter.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 38
- **Exact Prompt:** "Today, technology provides constant 38 [_______] for this instinct,"
- **Primary Answer:** `C`
- **Answer Key Notation:** `C (triggers)`
- **Accepted Alternatives:** `triggers`, `C triggers`, `c`, `(C)` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 7: *"The problem is that modern technology offers endless triggers for that instinct..."*
- **Official Explanation:** Para 7: ‘endless triggers for that instinct’.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 39
- **Exact Prompt:** "and people have wrongly come to see the reflex as a 39 [_______]."
- **Primary Answer:** `D`
- **Answer Key Notation:** `D (skill)`
- **Accepted Alternatives:** `skill`, `D skill`, `d`, `(D)` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 7: *"and we have mistaken the reflex for a skill."*
- **Official Explanation:** Para 7: ‘mistaken the reflex for a skill’.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

##### Question 40
- **Exact Prompt:** "Working on a single task may seem 40 [_______] at first, but it is probably more effective and less tiring."
- **Primary Answer:** `E`
- **Answer Key Notation:** `E (unproductive)`
- **Accepted Alternatives:** `unproductive`, `E unproductive`, `e`, `(E)` `[AUTOMATED-TEST]`
- **Source PDF Page:** Test PDF Page 9; Answer Key PDF Page 2
- **Passage Citation:** Paragraph 7: *"Learning to work on one thing at a time may feel unproductive at first, but it is likely to be more effective, and less tiring..."*
- **Official Explanation:** Para 7: ‘may feel unproductive at first’.
- **Audit Tag:** `[PDF-VERIFIED]` / `[INFERRED-TOLERANCE]`

---

## 3. Seed Integration Testing on Disposable PostgreSQL

### Test Environment
- **Database Engine:** PostgreSQL 17.5 running locally on port `5433` (`/tmp/pg_disposable_audit`)
- **Datasource:** `postgresql://postgres@localhost:5433/ielts_disposable_audit`
- **Neon Production Connection:** Completely disabled and blocked via assertion guards.

### Dual Execution Verification
The production seed script `prisma/seed.ts` was executed **twice** in sequence against the clean migrated disposable database:

```bash
# Execution 1
DATABASE_URL="postgresql://postgres@localhost:5433/ielts_disposable_audit" bun prisma/seed.ts
# Result: Created root Test (cmw853ow40000lqu05ca7990f), draft hierarchy, published Version 1 snapshot.

# Execution 2
DATABASE_URL="postgresql://postgres@localhost:5433/ielts_disposable_audit" bun prisma/seed.ts
# Result: Test 'Academic Reading · Mock Test 01' already exists with ID: cmw853ow40000lqu05ca7990f. Exited safely without duplicate mutations.
```

### Invariant Checks (Post-Execution 2)

| Entity Table | Expected Count | Actual Count | Match Status | Verification Assertion |
| :--- | :---: | :---: | :---: | :--- |
| `Test` | 1 | 1 | **EXACT** | No duplicate root test records created |
| `DraftSection` | 3 | 3 | **EXACT** | Passage 1, Passage 2, Passage 3 |
| `DraftQuestionGroup` | 8 | 8 | **EXACT** | Groups 1–8 |
| `DraftQuestion` | 40 | 40 | **EXACT** | Questions 1–40 continuous |
| `DraftAcceptedAnswer` | 64 | 64 | **EXACT** | All primary and alternative variants |
| `PublishedTestVersion` | 1 | 1 | **EXACT** | Version 1 snapshot |
| `PublishedSection` | 3 | 3 | **EXACT** | Published passages 1, 2, 3 |
| `PublishedQuestionGroup` | 8 | 8 | **EXACT** | Published groups 1–8 |
| `PublishedQuestion` | 40 | 40 | **EXACT** | Published questions 1–40 |
| `PublishedAcceptedAnswer` | 64 | 64 | **EXACT** | Published accepted answers 1–64 |

### Safe Failure on Invalid Source Data
Tested atomic transactional rollback when source data is invalid (e.g., question numbering gap: questions 1 and 3 without 2):
- **Observed Behavior:** Threw `TestPublishingValidationError: Invalid question numbering: expected question number 2, but found 3.`
- **Database Rollback:** The entire transaction rolled back. Zero orphaned tests, draft sections, or questions remained.

---

## 4. Publishing Transaction & Immutability Testing

### Transaction Validation Rules Tested

1. **Question Numbering Continuity:**
   - Attempted publishing a draft with missing question number 2 (numbers [1, 3]).
   - **Result:** Publishing rejected; exception thrown; transaction aborted.
2. **Missing Answer Key Prevention:**
   - Attempted publishing a question with an empty `acceptedAnswers: []` array.
   - **Result:** Rejected with `TestPublishingValidationError: Question X has no accepted answers.`
3. **Empty Accepted Text Prevention:**
   - Attempted publishing a question where `acceptedText: "   "`.
   - **Result:** Rejected with `TestPublishingValidationError: Question X has an empty accepted answer.`
4. **Duplicate Version Number Prevention:**
   - Attempted publishing target version number 1 a second time on the same test.
   - **Result:** Rejected with `TestPublishingValidationError: Published test version 1 already exists for test X.`
5. **No Partial Snapshot:**
   - Checked database record counts after each failed publication: `totalPubVersions = 1`, `totalPubQuestions = 40`. No partial tables created.

### Immutability Enforcement (PostgreSQL Triggers)

Executed direct modification attempts on live published records (`PublishedQuestion`):

```sql
-- Attempt UPDATE on published record
UPDATE "PublishedQuestion" SET prompt = 'Modified' WHERE id = '...';
-- Result: ERROR: P0001: Immutable snapshot violation: Updating records in PublishedQuestion is strictly prohibited.

-- Attempt DELETE on published record
DELETE FROM "PublishedQuestion" WHERE id = '...';
-- Result: ERROR: P0001: Immutable snapshot violation: Deleting records from PublishedQuestion is strictly prohibited.
```

**Assertion:** Published records in PostgreSQL are 100% immutable at the database engine level.

---

## 5. Scoring Engine Verification Across All Question Types

Automated tests in `lib/scoring/__tests__/representativeScoring.test.ts` (19 tests) and `lib/scoring/__tests__/scoring.test.ts` (15 tests) verify deterministic scoring across all representative input formats:

### Representative Test Matrix

| Question Type | Representative Inputs Tested | Expected Score | Result | Rule Verified |
| :--- | :--- | :---: | :---: | :--- |
| **TFNG (Q1)** | `"FALSE"`, `"false"`, `"f"`, `"  False  "` | 1 / 1 | **PASS** | Case/whitespace/abbreviation tolerance |
| **TFNG (Q1)** | `"TRUE"`, `""`, `null` | 0 / 1 | **PASS** | Incorrect and unattempted rejected |
| **TFNG (Q3)** | `"NOT GIVEN"`, `"ng"`, `"\tnot   given\n"` | 1 / 1 | **PASS** | Multi-word boolean token canonicalization |
| **Note Comp (Q8)** | `"between"`, `"  Between  "`, `'"between"'` | 1 / 1 | **PASS** | Quote & whitespace normalization |
| **Note Comp (Q8)** | `"sitting low between them"` (4 words) | 0 / 1 | **PASS** | Word limit violation (`wordLimitExceeded: true`) |
| **Note Comp (Q9)** | `"air-filled"`, `"air filled"`, `"AIR-FILLED"` | 1 / 1 | **PASS** | Hyphenated vs spaced equivalence ($\le 2$ words) |
| **Headings (Q14)** | `"ii"`, `"II"`, `"  ii  "`, `"ii."` | 1 / 1 | **PASS** | Roman numeral normalization |
| **Headings (Q14)** | `"iii"`, `"viii"`, `"ix"` | 0 / 1 | **PASS** | Incorrect heading selection rejected |
| **Sentence Comp (Q21)** | `"overflows"`, `"overflow"` | 1 / 1 | **PASS** | Accepted singular/plural alternative |
| **Sentence Comp (Q22)** | `"islands"`, `"isolated islands"` | 1 / 1 | **PASS** | 1-word and 2-word textual variants accepted |
| **Sentence Comp (Q23)** | `"expensive structural reinforcement"` (3 words) | 0 / 1 | **PASS** | Strictly rejected for exceeding 2-word limit |
| **Multiple Choice (Q24)** | `"B"`, `"b"`, `"(B)"`, `"B."` | 1 / 1 | **PASS** | Letter token normalization |
| **Multiple Choice (Q24)** | `"A"`, `"C"`, `"D"` | 0 / 1 | **PASS** | Incorrect distractor rejected |
| **YNNG (Q27)** | `"YES"`, `"y"`, `"  yes  "` | 1 / 1 | **PASS** | Yes/No claim evaluation |
| **YNNG (Q28)** | `"NO"`, `"n"` | 1 / 1 | **PASS** | Contradicting claim evaluated as NO |
| **Summary Comp (Q37)** | `"A"`, `"a"`, `"(A)"` | 1 / 1 | **PASS** | Option letter recognized |
| **Summary Comp (Q37)** | `"predator"`, `"PREDATOR"`, `"A predator"` | 1 / 1 | **PASS** | Word from list & letter+word recognized |
| **Summary Comp (Q37)** | `"B"`, `"reward"`, `"hunter"`, `"H"` | 0 / 1 | **PASS** | Wrong word or wrong letter rejected |
| **Full 40Q Attempt** | 35 correct, 5 wrong | 35 / 40 | **PASS** | Accurately produces Band 8.0 per band table |

---

## 6. Official Band Conversion Table

Exact transcription from `Mock_01_Answer_Key.pdf` (Page 3):

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

*Verification Note:* All 18 tiers are monotonically ordered, non-overlapping, and completely cover every possible integer score from 0 to 40 without gaps.

---

## 7. Verification Summary & Next Steps

### Complete Verification Summary
- **Total Automated Unit & Integration Tests Passing:** 48 tests across 4 test suites.
- **Disposable Database Tests:** 24 assertions passed with 0 failures.
- **TypeScript Typecheck:** 0 errors.
- **ESLint:** 0 errors / 0 warnings.
- **Next.js Production Build:** Successful static compilation (`next build`).
- **Production Neon Database:** Completely untouched (`0` rows inserted).

### Pending Authorizations
Before running `bun prisma/seed.ts` against Neon:
1. Review and approve the Accepted Alternatives tagged with `[INFERRED-TOLERANCE]` (Questions 9, 21, 22, 37–40).
2. Authorize production Neon seeding when ready.
