import type { Puzzle } from "@/types";

export const samplePuzzle: Puzzle = {
  solution: {
    "Български градове": {
      difficulty: 0,
      words: ["София", "Пловдив", "Варна", "Бургас"],
    },
    Плодове: {
      difficulty: 1,
      words: ["Ябълка", "Круша", "Банан", "Портокал"],
    },
    Цветове: {
      difficulty: 2,
      words: ["Червен", "Син", "Зелен", "Жълт"],
    },
    Животни: {
      difficulty: 3,
      words: ["Куче", "Котка", "Риба", "Птица"],
    },
  },
  author: "Admin",
  date: new Date("2025-12-10"),
};
