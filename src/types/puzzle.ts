export interface PuzzleTheme {
  difficulty: 0 | 1 | 2 | 3;
  words: [string, string, string, string];
}

export interface Puzzle {
  solution: Record<string, PuzzleTheme>;
  author?: string;
  date: Date;
}
