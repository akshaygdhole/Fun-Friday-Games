/**
 * Team quiz (same bank for both teams). Host awards points on the quiz page.
 * correctIndex: 0-based index into options.
 */
export const FUN_FRIDAY_QUESTIONS = [
  {
    question: "Which city is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctIndex: 2,
    explain:
      "Canberra was chosen as the capital in the early 1900s as a compromise between Sydney and Melbourne.",
  },
  {
    question: "On the periodic table, the symbol “W” stands for which element?",
    options: ["Tungsten", "Wolframite (ore only)", "Titanium", "Silver"],
    correctIndex: 0,
    explain:
      "Tungsten comes from Swedish “tung sten” (heavy stone); its alternate name Wolfram is why the symbol is W.",
  },
  {
    question: "In computing, what does HTTP status code 404 mean?",
    options: ["Server error", "Unauthorized", "Not Found", "Too Many Requests"],
    correctIndex: 2,
    explain:
      "404 means the server could not find the requested resource at that URL.",
  },
  {
    question:
      "Which of these protocols is connection-oriented and reliable by default (built-in retransmission)?",
    options: ["UDP", "TCP", "ICMP", "DHCP"],
    correctIndex: 1,
    explain:
      "TCP establishes a connection and retransmits lost packets; UDP is connectionless and best-effort.",
  },
  {
    question:
      "The thought experiment “Schrodinger’s cat” is most often used to illustrate unease with which idea?",
    options: [
      "Quantum superposition / measurement",
      "General relativity",
      "Newton’s third law",
      "Classical electromagnetism",
    ],
    correctIndex: 0,
    explain:
      "Until measured, the system can be in a combined state; measurement “collapses” possibilities—simplified in the famous cat story.",
  },
  {
    question:
      "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, …?",
    options: ["11", "12", "13", "21"],
    correctIndex: 2,
    explain: "Each term is the sum of the two before: 5 + 8 = 13.",
  },
  {
    question:
      "Which word describes animals active mainly during the day (opposite of nocturnal)?",
    options: ["Crepuscular", "Diurnal", "Arboreal", "Vespertine"],
    correctIndex: 1,
    explain: "Diurnal = daytime; nocturnal = night; crepuscular = dawn/dusk.",
  },
  {
    question: "World War I began in which year?",
    options: ["1912", "1914", "1916", "1918"],
    correctIndex: 1,
    explain:
      "The war broke out in 1914 (assassination in Sarajevo, July, then declarations of war).",
  },
  {
    question:
      "Who is often credited as the first computer programmer for work on Charles Babbage’s Analytical Engine?",
    options: [
      "Grace Hopper",
      "Ada Lovelace",
      "Katherine Johnson",
      "Hedy Lamarr",
    ],
    correctIndex: 1,
    explain:
      "Ada Lovelace wrote notes including an algorithm for the engine—widely cited as early programming.",
  },
  {
    question:
      "Photosynthesis in plants produces glucose and which gas released into the air?",
    options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Methane"],
    correctIndex: 2,
    explain: "Plants use CO₂ and water; oxygen is released as a by-product.",
  },
  {
    question: "The “Dunning–Kruger effect” is broadly about:",
    options: [
      "People with little knowledge overestimating their competence",
      "Memory improving under stress",
      "Crowds always being wiser than experts",
      "Optical illusions in data charts",
    ],
    correctIndex: 0,
    explain:
      "It describes a pattern where limited skill can pair with high confidence until learning reveals the gaps.",
  },
  {
    question: "In JSON, which value is valid?",
    options: [
      '{ "count": 3, "ok": true }',
      "{ count: 3 }",
      "{ 'ok': true }",
      '{ "name": undefined }',
    ],
    correctIndex: 0,
    explain:
      "JSON requires double quotes on keys/strings; it does not allow undefined or single-quoted keys like JS object literals often do.",
  },
  {
    question:
      "Which desert is the largest in the world by area (including cold/polar deserts)?",
    options: ["Sahara", "Arabian", "Antarctic", "Gobi"],
    correctIndex: 2,
    explain:
      "Antarctica is a polar desert with very little precipitation—larger than the Sahara by area.",
  },
  {
    question: "The programming language named after a British comedy group is:",
    options: ["Ruby", "Python", "Perl", "Java"],
    correctIndex: 1,
    explain:
      "Python was named after Monty Python’s Flying Circus, not the snake (though the snake imagery stuck).",
  },
  {
    question:
      "A “binary search” on a sorted array typically has time complexity:",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
    explain:
      "Each step halves the search space, so it grows logarithmically with size.",
  },
  {
    question: "Which planet is the largest in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    correctIndex: 1,
    explain: "Jupiter is more massive than all other planets combined.",
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
    explain: "2 is the smallest (and only even) prime.",
  },
  {
    question: "How many hearts does a typical octopus have?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 2,
    explain: "Two branchial hearts for the gills plus one systemic heart for the body.",
  },
  {
    question: "The capital of France is:",
    options: ["Lyon", "Marseille", "Paris", "Nice"],
    correctIndex: 2,
    explain: "Paris has been the capital for centuries.",
  },
  {
    question:
      "Which of these is a markup language rather than a general-purpose programming language?",
    options: ["HTML", "Python", "Java", "C#"],
    correctIndex: 0,
    explain: "HTML describes structure; it is not a programming language in the same sense as the others.",
  },
];
