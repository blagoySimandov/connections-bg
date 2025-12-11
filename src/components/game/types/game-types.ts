/**
 * Represents a solved group/category in the game
 */
export interface SolvedGroup {
  category: string;
  difficulty: 0 | 1 | 2 | 3;
  words: string[];
}

/**
 * Represents a single attempt in the game history
 */
export interface AttemptHistory {
  categories: number[];
}

/**
 * The complete game state that can be persisted
 */
export interface GameState {
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  words: string[];
}
