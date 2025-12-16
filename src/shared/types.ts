export interface PuzzleTheme {
  difficulty: 0 | 1 | 2 | 3;
  words: [string, string, string, string];
}

export interface Puzzle {
  id?: string;
  title?: string;
  solution: Record<string, PuzzleTheme>;
  author?: string;
  date: Date;
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
