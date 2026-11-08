import { QuestionType, ModuleType, TestCategory } from "@prisma/client";
import { MOCK_01_BAND_TABLE } from "@/lib/scoring/band";

export interface SeedAcceptedAnswer {
  acceptedText: string;
  isCaseSensitive?: boolean;
  isPrimary?: boolean;
}

export interface SeedQuestion {
  questionNumber: number;
  prompt: string;
  options?: string[];
  explanation: string;
  acceptedAnswers: SeedAcceptedAnswer[];
}

export interface SeedQuestionGroup {
  orderIndex: number;
  instruction: string;
  questionType: QuestionType;
  wordLimit?: number | null;
  contextOptions?: Record<string, unknown> | null;
  questions: SeedQuestion[];
}

export interface SeedSection {
  orderIndex: number;
  title: string;
  passageText: string;
  groups: SeedQuestionGroup[];
}

export interface SeedTestData {
  title: string;
  slug: string;
  module: ModuleType;
  category: TestCategory;
  durationMinutes: number;
  totalQuestions: number;
  bandConversionTable: typeof MOCK_01_BAND_TABLE;
  sections: SeedSection[];
}

export const mock01TestData: SeedTestData = {
  title: "Academic Reading · Mock Test 01",
  slug: "academic-reading-mock-01",
  module: ModuleType.READING,
  category: TestCategory.ACADEMIC,
  durationMinutes: 60,
  totalQuestions: 40,
  bandConversionTable: MOCK_01_BAND_TABLE,
  sections: [
    {
      orderIndex: 1,
      title: "The Bicycle: From Wooden Hobby-Horse to Everyday Machine",
      passageText: `Few inventions are as simple, or as influential, as the bicycle. More than a billion of them are thought to be in use around the world today, carrying commuters, couriers and children to school. Its appeal lies largely in efficiency, since a person on a bicycle uses less energy to cover a given distance than with almost any other means of travel. Yet the machine took almost a century to reach its familiar form, and its early history is a story of false starts, eccentric designs and a surprising amount of social change.

The ancestor of the bicycle appeared in 1817, when a German forester named Karl von Drais built a wooden frame with two wheels set in line and a steerable front wheel. The rider sat astride the frame and pushed himself along with his feet. Drais had been searching for a quicker way to travel around the estates he managed, at a time when bad harvests had left oats scarce and horses expensive to feed. His ‘running machine’ drew crowds in Mannheim and Paris, and fashionable young men in London nicknamed it the hobby-horse. However, it was awkward to use on the rutted roads of the period, and pedestrians complained so often about riders on pavements that several cities banned the machine from them. Public interest faded within a few years.

The next important step came in the 1860s in France, where pedals were fixed directly to the front wheel of a similar frame. These machines, called velocipedes, were heavy and uncomfortable, and their iron-rimmed wheels earned them the nickname ‘boneshakers’. Nevertheless, they proved that a rider could stay balanced while using his own legs to supply power, and workshops in Paris began to produce them in large numbers. Visitors to the city carried the idea home, and by the end of the decade riding schools, where beginners could learn to stay upright indoors, had opened in several European and American cities. The craze did not last, however: the outbreak of war between France and Prussia in 1870 disrupted production in Paris, and by the early 1870s enthusiasm for the velocipede had cooled.

In the 1870s designers tried to make bicycles faster in the only way they could: by enlarging the front wheel. Because one turn of the pedals produced one turn of the wheel, a bigger wheel covered more ground with each push. The result was the ‘penny-farthing’, named after two British coins of very different sizes, whose front wheel could be more than a metre and a half across. Riders sat high above the ground, and a sudden stop could throw them over the handlebars. The machine was therefore popular mainly with young, athletic and wealthy men, and it was regarded as a sport rather than a means of transport.

The breakthrough came in the 1880s with the ‘safety bicycle’. In 1885 John Kemp Starley, working in Coventry, produced the Rover, which had two wheels of roughly equal size and a chain that drove the rear wheel. The rider sat low, between the wheels, and could put both feet on the ground. Three years later a Scottish veterinary surgeon named John Boyd Dunlop developed an air-filled rubber tyre for his young son's tricycle. It absorbed the bumps of the road and made cycling far more comfortable, and within a few years the penny-farthing had almost vanished. Starley's design was soon copied by rival firms, and Coventry became the centre of the British cycle industry.

The 1890s saw a ‘bicycle boom’ in Europe and North America. Factories adopted mass production, prices fell, and for the first time ordinary workers could afford a machine. Manufacturers competed fiercely, and features that are still found on bicycles today, such as ball bearings, brakes and gears, were improved during this period. Cycling clubs flourished, and the new freedom of movement had unexpected effects. Women in particular found that the bicycle gave them independence, and it encouraged them to wear more practical clothing, such as divided skirts. The American campaigner Susan B. Anthony once remarked that the bicycle had done more to free women than anything else in the world.

The car eventually reduced the bicycle's importance in wealthy countries, but it never disappeared. In the 1970s, rising fuel prices and growing concern about pollution renewed interest in cycling, and some cities, notably in the Netherlands and Denmark, began to build networks of separated cycle lanes. Today the bicycle is again promoted as a clean and healthy form of urban transport, and electric models are extending its appeal to older riders and to people who face long journeys over hilly ground.`,
      groups: [
        {
          orderIndex: 1,
          questionType: QuestionType.TRUE_FALSE_NOT_GIVEN,
          instruction: `Do the following statements agree with the information given in Reading Passage 1?
In boxes 1–7 on your answer sheet, write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this`,
          wordLimit: null,
          contextOptions: null,
          questions: [
            {
              questionNumber: 1,
              prompt: "Karl von Drais was an engineer by profession.",
              explanation: "Para 2 calls him ‘a German forester’, not an engineer.",
              acceptedAnswers: [
                { acceptedText: "FALSE", isPrimary: true },
                { acceptedText: "F" }
              ]
            },
            {
              questionNumber: 2,
              prompt: "Drais's invention was prompted partly by the high cost of keeping horses.",
              explanation: "Para 2: bad harvests left oats scarce and horses expensive to feed.",
              acceptedAnswers: [
                { acceptedText: "TRUE", isPrimary: true },
                { acceptedText: "T" }
              ]
            },
            {
              questionNumber: 3,
              prompt: "Drais earned a large profit from selling his machines in Paris.",
              explanation: "Para 2 says crowds gathered in Paris but never mentions Drais's earnings.",
              acceptedAnswers: [
                { acceptedText: "NOT GIVEN", isPrimary: true },
                { acceptedText: "NG" }
              ]
            },
            {
              questionNumber: 4,
              prompt: "The nickname ‘boneshakers’ referred to the metal rims of the velocipede's wheels.",
              explanation: "Para 3: ‘iron-rimmed wheels earned them the nickname’.",
              acceptedAnswers: [
                { acceptedText: "TRUE", isPrimary: true },
                { acceptedText: "T" }
              ]
            },
            {
              questionNumber: 5,
              prompt: "A larger front wheel allowed a penny-farthing rider to cover more distance with each push on the pedals.",
              explanation: "Para 4: one turn of the pedals = one turn of the wheel, so a bigger wheel covered more ground.",
              acceptedAnswers: [
                { acceptedText: "TRUE", isPrimary: true },
                { acceptedText: "T" }
              ]
            },
            {
              questionNumber: 6,
              prompt: "Penny-farthings were popular with people from every social class.",
              explanation: "Para 4: popular ‘mainly with young, athletic and wealthy men’.",
              acceptedAnswers: [
                { acceptedText: "FALSE", isPrimary: true },
                { acceptedText: "F" }
              ]
            },
            {
              questionNumber: 7,
              prompt: "The Rover was the first bicycle to be driven by a chain.",
              explanation: "Para 5 says the Rover had a chain but does not say it was the first to do so.",
              acceptedAnswers: [
                { acceptedText: "NOT GIVEN", isPrimary: true },
                { acceptedText: "NG" }
              ]
            }
          ]
        },
        {
          orderIndex: 2,
          questionType: QuestionType.NOTE_COMPLETION,
          instruction: `Complete the notes below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 8–13 on your answer sheet.`,
          wordLimit: 2,
          contextOptions: {
            title: "The safety bicycle and its effects"
          },
          questions: [
            {
              questionNumber: 8,
              prompt: "The 1880s: In 1885, John Kemp Starley's Rover placed the rider low, [8] the two wheels, so that both feet could touch the ground.",
              explanation: "Para 5: ‘The rider sat low, between the wheels’.",
              acceptedAnswers: [
                { acceptedText: "between", isPrimary: true }
              ]
            },
            {
              questionNumber: 9,
              prompt: "The 1880s: Dunlop's [9] rubber tyre made rides more comfortable.",
              explanation: "Para 5: ‘an air-filled rubber tyre’.",
              acceptedAnswers: [
                { acceptedText: "air-filled", isPrimary: true },
                { acceptedText: "air filled" }
              ]
            },
            {
              questionNumber: 10,
              prompt: "The 1890s: Factories used [10], so prices dropped and workers could afford bicycles.",
              explanation: "Para 6: ‘Factories adopted mass production, prices fell’.",
              acceptedAnswers: [
                { acceptedText: "mass production", isPrimary: true }
              ]
            },
            {
              questionNumber: 11,
              prompt: "The 1890s: Women gained [11] and began to wear more practical clothes.",
              explanation: "Para 6: ‘the bicycle gave them independence’.",
              acceptedAnswers: [
                { acceptedText: "independence", isPrimary: true }
              ]
            },
            {
              questionNumber: 12,
              prompt: "Recent decades: In the 1970s, higher [12] and anxiety about pollution renewed interest in cycling.",
              explanation: "Para 7: ‘rising fuel prices and growing concern about pollution’.",
              acceptedAnswers: [
                { acceptedText: "fuel prices", isPrimary: true }
              ]
            },
            {
              questionNumber: 13,
              prompt: "Recent decades: [13] bicycles now attract older riders and those facing long, hilly journeys.",
              explanation: "Para 7: ‘electric models are extending its appeal to older riders’.",
              acceptedAnswers: [
                { acceptedText: "electric", isPrimary: true }
              ]
            }
          ]
        }
      ]
    },
    {
      orderIndex: 2,
      title: "Green Roofs: Gardens in the Sky",
      passageText: `A In the centre of many cities the only unused land is overhead. Buildings in dense urban areas are crowned with acres of flat roofing that is hot in summer, wasted in winter and invisible to everyone except the pigeons. Increasingly, architects and city planners are asking why these surfaces should not be covered with plants. The idea is not new: turf roofs have kept Scandinavian houses warm for centuries, and the Hanging Gardens of Babylon are said to have been planted on terraces. What is new is the modern green roof, a layered system of waterproofing, drainage and growing material designed to support vegetation on top of an ordinary building.

B The first benefit that developers notice is thermal. Dark roofing absorbs sunlight and radiates it back as heat, so that city centres can be several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. A roof covered in plants reflects part of that light and uses much of the rest to evaporate water, which cools the air. Measurements on buildings in several countries suggest that the surface of a green roof can be much cooler than that of a conventional roof on a hot afternoon, sometimes by more than twenty degrees Celsius. Cooler roofs in turn mean that the rooms below need less air conditioning, which saves electricity at the very time when demand for it is highest.

C Water is the second advantage. In a heavy storm, rain falling on roads and rooftops rushes into drains all at once, and in older cities with combined sewage and rainwater systems this can cause overflows of untreated waste into rivers. Green roofs act like sponges. The growing material soaks up much of the rainfall, the plants take up some of it, and what remains is released slowly over several hours. Engineers in Germany, where green roofs have been encouraged by regulation and subsidies since the 1980s, estimate that such roofs can hold back between half and three quarters of the water from an average shower.

D Wildlife also benefits. Even a thin layer of soil planted with sedum, a hardy succulent, will attract bees, butterflies and beetles, and larger roofs with a deeper layer of soil have been colonised by ground-nesting birds. In some cities, rare species that have lost their natural habitats now breed on rooftops. Ecologists point out, however, that roof habitats are isolated islands, and that animals must be able to reach them from parks or gardens nearby if the roofs are to make a lasting difference. Once insects have arrived, larger animals tend to follow, so that a single roof can come to support a small food chain.

E None of this comes without cost. A green roof is heavier than a gravel one, particularly when the soil is saturated with water, so older buildings may need expensive structural reinforcement before one can be installed. The initial price, which includes waterproofing, drainage and plants, is typically higher than for a traditional roof, and the roof must be inspected and weeded regularly. Critics argue that these expenses discourage private owners, who rarely see the financial reward of cooler air or reduced flooding because such gains are shared by the whole city. A leak under a layer of soil can also be difficult to trace, which makes some owners cautious.

F Supporters reply that the extra outlay is partly recovered over time. A roof protected from sunlight and frost suffers less wear, and some studies suggest that its waterproof membrane may last up to twice as long as an exposed one. Buildings with green roofs also need less energy for air conditioning in summer and less heating in winter, and in some commercial districts they command higher rents. Cities have therefore begun to share the burden: Toronto, for instance, now requires green roofs on large new buildings, while others offer grants to owners who add them to existing ones. The calculation is not simple, since the benefits vary with climate, roof type and the price of energy.

G The future of the green roof may depend on what it is used for. Some of the most ambitious projects now grow food: rooftop farms in New York, Singapore and Paris supply restaurants and local markets with herbs, salads and honey. Others are open to the public as parks, which is valuable in districts where land for open space is almost impossible to find. Building managers add that office workers will often eat lunch in a rooftop garden rather than at their desks. Whatever their purpose, such roofs share one lesson, which is that cities need not choose between building and nature if they are prepared to build upwards.`,
      groups: [
        {
          orderIndex: 1,
          questionType: QuestionType.MATCHING_HEADINGS,
          instruction: `Reading Passage 2 has 7 paragraphs, A–G.
Choose the correct heading for each paragraph from the list of headings below.
Write the correct number, i–ix, in boxes 14–19 on your answer sheet.`,
          wordLimit: null,
          contextOptions: {
            headings: {
              "i": "Rainwater held back and released slowly",
              "ii": "Cooler buildings in warmer cities",
              "iii": "Why the idea may not suit every country",
              "iv": "The price of installing a roof garden",
              "v": "Rooftops as places to grow food and relax",
              "vi": "Arguments that the investment pays for itself",
              "vii": "A home for creatures in crowded places",
              "viii": "A tradition that was forgotten",
              "ix": "The danger of falling plants"
            }
          },
          questions: [
            {
              questionNumber: 14,
              prompt: "Paragraph B",
              explanation: "Paragraph B: Cooling effect of plants; reduces the urban heat island.",
              acceptedAnswers: [
                { acceptedText: "ii", isPrimary: true }
              ]
            },
            {
              questionNumber: 15,
              prompt: "Paragraph C",
              explanation: "Paragraph C: Roofs act like sponges and release water slowly.",
              acceptedAnswers: [
                { acceptedText: "i", isPrimary: true }
              ]
            },
            {
              questionNumber: 16,
              prompt: "Paragraph D",
              explanation: "Paragraph D: Bees, butterflies and birds find habitats on roofs.",
              acceptedAnswers: [
                { acceptedText: "vii", isPrimary: true }
              ]
            },
            {
              questionNumber: 17,
              prompt: "Paragraph E",
              explanation: "Paragraph E: Heavier structure, higher initial price and maintenance.",
              acceptedAnswers: [
                { acceptedText: "iv", isPrimary: true }
              ]
            },
            {
              questionNumber: 18,
              prompt: "Paragraph F",
              explanation: "Paragraph F: Longer membrane life, lower energy use, higher rents.",
              acceptedAnswers: [
                { acceptedText: "vi", isPrimary: true }
              ]
            },
            {
              questionNumber: 19,
              prompt: "Paragraph G",
              explanation: "Paragraph G: Rooftop farms and public parks.",
              acceptedAnswers: [
                { acceptedText: "v", isPrimary: true }
              ]
            }
          ]
        },
        {
          orderIndex: 2,
          questionType: QuestionType.SENTENCE_COMPLETION,
          instruction: `Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 20–23 on your answer sheet.`,
          wordLimit: 2,
          contextOptions: null,
          questions: [
            {
              questionNumber: 20,
              prompt: "A modern green roof consists of waterproofing, drainage and [20] that supports plants.",
              explanation: "Para A: ‘waterproofing, drainage and growing material’.",
              acceptedAnswers: [
                { acceptedText: "growing material", isPrimary: true }
              ]
            },
            {
              questionNumber: 21,
              prompt: "In older cities, heavy storms can cause [21] of untreated waste into rivers.",
              explanation: "Para C: ‘overflows of untreated waste into rivers’.",
              acceptedAnswers: [
                { acceptedText: "overflows", isPrimary: true },
                { acceptedText: "overflow" }
              ]
            },
            {
              questionNumber: 22,
              prompt: "Ecologists compare roof habitats to [22], so animals must be able to reach them.",
              explanation: "Para D: ‘roof habitats are isolated islands’.",
              acceptedAnswers: [
                { acceptedText: "islands", isPrimary: true },
                { acceptedText: "isolated islands" }
              ]
            },
            {
              questionNumber: 23,
              prompt: "Owners of older buildings may need to pay for [23] before installing a green roof.",
              explanation: "Para E: ‘expensive structural reinforcement’.",
              acceptedAnswers: [
                { acceptedText: "structural reinforcement", isPrimary: true }
              ]
            }
          ]
        },
        {
          orderIndex: 3,
          questionType: QuestionType.MULTIPLE_CHOICE,
          instruction: `Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 24–26 on your answer sheet.`,
          wordLimit: null,
          contextOptions: null,
          questions: [
            {
              questionNumber: 24,
              prompt: "According to critics in paragraph E, private owners hesitate to install green roofs because",
              options: [
                "A they cannot find skilled workers to maintain them.",
                "B the benefits are shared by the whole city rather than the owner.",
                "C the plants make the building look untidy.",
                "D the roofs use too much water."
              ],
              explanation: "Para E: owners ‘rarely see the financial reward… such gains are shared by the whole city’.",
              acceptedAnswers: [
                { acceptedText: "B", isPrimary: true }
              ]
            },
            {
              questionNumber: 25,
              prompt: "What is stated about Toronto in paragraph F?",
              options: [
                "A It was the first city to ban conventional roofs.",
                "B It insists that large new buildings have green roofs.",
                "C It pays the full cost of green roofs on older buildings.",
                "D It has halved the use of air conditioning."
              ],
              explanation: "Para F: Toronto ‘now requires green roofs on large new buildings’.",
              acceptedAnswers: [
                { acceptedText: "B", isPrimary: true }
              ]
            },
            {
              questionNumber: 26,
              prompt: "What is the writer's final point in paragraph G?",
              options: [
                "A Rooftop farms earn more money than parks.",
                "B Most cities lack the space to build green roofs.",
                "C Cities can have both buildings and nature if they build upwards.",
                "D Green roofs are mainly useful for producing honey."
              ],
              explanation: "Para G: ‘cities need not choose between building and nature if they… build upwards’.",
              acceptedAnswers: [
                { acceptedText: "C", isPrimary: true }
              ]
            }
          ]
        }
      ]
    },
    {
      orderIndex: 3,
      title: "The Myth of Multitasking",
      passageText: `Walk into any modern office and you will see people doing several things at once: answering emails while listening to a conference call, glancing at a phone in the middle of a conversation, switching between a dozen open windows on a screen. Multitasking has become a badge of honour, and job advertisements routinely demand it. The assumption behind this enthusiasm is that the brain, like a computer with several processors, can run more than one task at the same moment. Research in psychology and neuroscience suggests that this assumption is largely mistaken.

What we call multitasking is, in most cases, rapid task-switching. When two activities both demand conscious attention, such as writing a report and reading a message, the brain cannot give full attention to both. It must shift its focus from one to the other, and every shift carries a cost. In laboratory experiments, volunteers who alternate between simple tasks, such as sorting shapes and then sorting colours, become slower and make more errors immediately after each switch. Moving between tasks of quite different kinds seems to cost more than moving between similar ones. The individual delays are tiny, often a fraction of a second, but over a working day they accumulate. Some researchers have estimated that heavy switching can consume a considerable share of a person's productive time, although such figures are rough and vary from one study to another.

The costs are not only measured in seconds. Studies of office workers who are interrupted by incoming email have found that it can take many minutes to return to the original task with the same level of concentration, because part of the mind stays occupied with the interruption. Psychologists describe this lingering effect as ‘attention residue’. In addition, people who switch frequently tend to report higher levels of stress, perhaps because they sense that they are falling behind with everything at once. Anyone who has returned to a half-written document after answering a message knows the feeling of having lost the thread.

There are exceptions, and they are instructive. Some combinations of tasks do work, but usually because one of them is so well practised that it requires almost no conscious thought. An experienced driver can hold a conversation, and many people can knit while watching television. The difficulty arises when both activities are demanding or unfamiliar. This explains why even hands-free phone calls can impair driving: it is the conversation, not the handset, that draws attention away from the road.

A more surprising finding concerns who believes they are good at it. In one widely discussed study, participants who said they often used several kinds of media at once performed worse, not better, on tests of task-switching and of ignoring distractions than those who rarely did so. This does not prove that multitasking damages the brain; it may be that people who are easily distracted are drawn to multitasking in the first place. Even so, the result challenges the comforting idea that practice makes perfect, and it should make us wary of anyone who claims to thrive on constant interruption. The researchers themselves were careful to add that the evidence so far is incomplete.

Employers who encourage multitasking should therefore think carefully. Many organisations have tried to reduce its costs with simple measures: meeting-free blocks of the day, ‘quiet hours’ for email, and software that gathers notifications and delivers them at set times. Some companies have gone further and discourage staff from sending messages in the evening. Such policies are not a cure, since some jobs genuinely involve unpredictable demands, as in emergency dispatch or customer service. Even there, however, researchers suggest that training staff to prioritise, and to finish one task before starting another wherever possible, produces better results than praising those who juggle.

None of this means that the human brain is poorly designed. Our ability to shift attention quickly was valuable to our ancestors, who needed to notice a predator while they were gathering food. The problem is that modern technology offers endless triggers for that instinct, and we have mistaken the reflex for a skill. Learning to work on one thing at a time may feel unproductive at first, but it is likely to be more effective, and less tiring, than the constant switching that so many of us have come to regard as normal. Anyone who doubts it could try switching off all notifications for a single afternoon and seeing what happens to the quality of the work.`,
      groups: [
        {
          orderIndex: 1,
          questionType: QuestionType.YES_NO_NOT_GIVEN,
          instruction: `Do the following statements agree with the views/claims of the writer in Reading Passage 3?
In boxes 27–32 on your answer sheet, write
YES if the statement agrees with the views of the writer
NO if the statement contradicts the views of the writer
NOT GIVEN if it is impossible to say what the writer thinks about this`,
          wordLimit: null,
          contextOptions: null,
          questions: [
            {
              questionNumber: 27,
              prompt: "Employers often list multitasking as a required skill in job advertisements.",
              explanation: "Para 1: job advertisements ‘routinely demand it’.",
              acceptedAnswers: [
                { acceptedText: "YES", isPrimary: true },
                { acceptedText: "Y" }
              ]
            },
            {
              questionNumber: 28,
              prompt: "The delays caused by task-switching are too small to have any real effect.",
              explanation: "Para 2: the tiny delays ‘accumulate’ over a working day.",
              acceptedAnswers: [
                { acceptedText: "NO", isPrimary: true },
                { acceptedText: "N" }
              ]
            },
            {
              questionNumber: 29,
              prompt: "Attention residue is more serious for managers than for other staff.",
              explanation: "Para 3 does not compare managers with other staff.",
              acceptedAnswers: [
                { acceptedText: "NOT GIVEN", isPrimary: true },
                { acceptedText: "NG" }
              ]
            },
            {
              questionNumber: 30,
              prompt: "Using a hands-free phone does not remove the risk of distraction while driving.",
              explanation: "Para 4: ‘even hands-free phone calls can impair driving’.",
              acceptedAnswers: [
                { acceptedText: "YES", isPrimary: true },
                { acceptedText: "Y" }
              ]
            },
            {
              questionNumber: 31,
              prompt: "The study of heavy media multitaskers showed that multitasking damages the brain.",
              explanation: "Para 5: ‘This does not prove that multitasking damages the brain’.",
              acceptedAnswers: [
                { acceptedText: "NO", isPrimary: true },
                { acceptedText: "N" }
              ]
            },
            {
              questionNumber: 32,
              prompt: "Training in prioritising can help even in jobs with unpredictable demands.",
              explanation: "Para 6: ‘Even there… training staff to prioritise… produces better results’.",
              acceptedAnswers: [
                { acceptedText: "YES", isPrimary: true },
                { acceptedText: "Y" }
              ]
            }
          ]
        },
        {
          orderIndex: 2,
          questionType: QuestionType.MULTIPLE_CHOICE,
          instruction: `Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 33–36 on your answer sheet.`,
          wordLimit: null,
          contextOptions: null,
          questions: [
            {
              questionNumber: 33,
              prompt: "According to the writer, experiments in which people alternate between simple tasks show that",
              options: [
                "A volunteers improve steadily as the experiment continues.",
                "B errors occur only when both tasks are difficult.",
                "C delays appear immediately after each switch.",
                "D sorting colours is harder than sorting shapes."
              ],
              explanation: "Para 2: people ‘become slower and make more errors immediately after each switch’.",
              acceptedAnswers: [
                { acceptedText: "C", isPrimary: true }
              ]
            },
            {
              questionNumber: 34,
              prompt: "The writer says some people can combine two activities successfully because",
              options: [
                "A one of the activities has become almost automatic.",
                "B they divide their attention equally between both.",
                "C both activities are new to them.",
                "D they use different parts of the brain without effort."
              ],
              explanation: "Para 4: one task is ‘so well practised that it requires almost no conscious thought’.",
              acceptedAnswers: [
                { acceptedText: "A", isPrimary: true }
              ]
            },
            {
              questionNumber: 35,
              prompt: "What does the writer conclude about the study of heavy media multitaskers?",
              options: [
                "A It proved that multitasking harms the brain.",
                "B It involved only people who work in offices.",
                "C It showed that practice improves task-switching.",
                "D Its results do not prove a cause, but they still challenge a popular belief."
              ],
              explanation: "Para 5: not proof of damage, yet it ‘challenges the comforting idea that practice makes perfect’.",
              acceptedAnswers: [
                { acceptedText: "D", isPrimary: true }
              ]
            },
            {
              questionNumber: 36,
              prompt: "What is the writer's view of workplace measures such as ‘quiet hours’ for email?",
              options: [
                "A They are pointless.",
                "B They help but cannot solve every problem.",
                "C They have removed the problem in most companies.",
                "D They are too expensive for most employers."
              ],
              explanation: "Para 6: ‘Such policies are not a cure, since some jobs genuinely involve unpredictable demands’.",
              acceptedAnswers: [
                { acceptedText: "B", isPrimary: true }
              ]
            }
          ]
        },
        {
          orderIndex: 3,
          questionType: QuestionType.SUMMARY_COMPLETION,
          instruction: `Complete the summary using the list of words, A–H, below.
Write the correct letter, A–H, in boxes 37–40 on your answer sheet.`,
          wordLimit: null,
          contextOptions: {
            title: "Why we multitask",
            words: {
              "A": "predator",
              "B": "reward",
              "C": "triggers",
              "D": "skill",
              "E": "unproductive",
              "F": "exhausting",
              "G": "weakness",
              "H": "hunter"
            }
          },
          questions: [
            {
              questionNumber: 37,
              prompt: "The ability to shift attention quickly was once useful because it allowed our ancestors to notice a 37 [_______] while they were busy gathering food.",
              explanation: "Para 7: ‘notice a predator while they were gathering food’.",
              acceptedAnswers: [
                { acceptedText: "A", isPrimary: true },
                { acceptedText: "predator" },
                { acceptedText: "A predator" }
              ]
            },
            {
              questionNumber: 38,
              prompt: "Today, technology provides constant 38 [_______] for this instinct,",
              explanation: "Para 7: ‘endless triggers for that instinct’.",
              acceptedAnswers: [
                { acceptedText: "C", isPrimary: true },
                { acceptedText: "triggers" },
                { acceptedText: "C triggers" }
              ]
            },
            {
              questionNumber: 39,
              prompt: "and people have wrongly come to see the reflex as a 39 [_______].",
              explanation: "Para 7: ‘mistaken the reflex for a skill’.",
              acceptedAnswers: [
                { acceptedText: "D", isPrimary: true },
                { acceptedText: "skill" },
                { acceptedText: "D skill" }
              ]
            },
            {
              questionNumber: 40,
              prompt: "Working on a single task may seem 40 [_______] at first, but it is probably more effective and less tiring.",
              explanation: "Para 7: ‘may feel unproductive at first’.",
              acceptedAnswers: [
                { acceptedText: "E", isPrimary: true },
                { acceptedText: "unproductive" },
                { acceptedText: "E unproductive" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
