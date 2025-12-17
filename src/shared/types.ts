export interface PuzzleTheme {
  difficulty: 0 | 1 | 2 | 3;
  words: [string, string, string, string];
}

export interface PuzzleStats {
  playedCount: number;
  solvedCount: number;
}

export interface Puzzle {
  id?: string;
  title?: string;
  solution: Record<string, PuzzleTheme>;
  author?: string;
  date: Date;
  stats?: PuzzleStats;
}

export type UserRole = "admin" | "user";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: string;
  role: UserRole;
}

export interface SolvedGroup {
  category: string;
  difficulty: 0 | 1 | 2 | 3;
  words: string[];
}

export interface AttemptHistory {
  categories: number[];
}

export interface GameHistory {
  puzzleId: string;
  puzzleDate: string;
  completed: boolean;
  won: boolean;
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  completedAt: string;
}
