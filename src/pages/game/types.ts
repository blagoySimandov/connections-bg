import type { SolvedGroup, AttemptHistory } from "@/shared/types";

export type { SolvedGroup, AttemptHistory };

export interface GameState {
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  words: string[];
}
