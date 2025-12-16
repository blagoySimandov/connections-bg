export interface SolvedGroup {
  category: string;
  difficulty: 0 | 1 | 2 | 3;
  words: string[];
}

export interface AttemptHistory {
  categories: number[];
}

export interface GameState {
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  words: string[];
}
