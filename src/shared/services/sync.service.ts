import type { Firestore } from "firebase/firestore/lite";
import type { SolvedGroup, AttemptHistory, GameHistory } from "../types";
import { GameHistoryService } from "./game-history.service";
import { PuzzleService } from "./puzzle.service";
import { UserStatsService } from "./user-stats.service";

export class SyncService {
  private gameHistoryService: GameHistoryService;
  private puzzleService: PuzzleService;
  private userStatsService: UserStatsService;

  constructor(db: Firestore) {
    this.gameHistoryService = new GameHistoryService(db);
    this.puzzleService = new PuzzleService(db);
    this.userStatsService = new UserStatsService(db);
  }

  /**
   * Load game state from Firestore for cross-device sync
   * Returns the game history if the user has already played this puzzle
   */
  async loadGameHistory(
    userId: string,
    puzzleDate: Date
  ): Promise<GameHistory | null> {
    return this.gameHistoryService.getGameHistory(userId, puzzleDate);
  }

  /**
   * Sync game completion to Firestore and update puzzle stats
   */
  async syncGameCompletion(
    userId: string | null,
    puzzleId: string,
    puzzleDate: Date,
    gameData: {
      won: boolean;
      mistakes: number;
      solvedGroups: SolvedGroup[];
      attemptHistory: AttemptHistory[];
    }
  ): Promise<void> {
    // Update puzzle stats (for all users)
    try {
      await this.puzzleService.incrementPlayedCount(puzzleId);
      if (gameData.won) {
        await this.puzzleService.incrementSolvedCount(puzzleId);
      }
    } catch (error) {
      console.error("Failed to update puzzle stats:", error);
    }

    // Save user history and update stats (only if logged in)
    if (userId) {
      try {
        await this.gameHistoryService.saveGameHistory(userId, puzzleDate, {
          puzzleId,
          puzzleDate: puzzleDate.toISOString(),
          completed: true,
          won: gameData.won,
          mistakes: gameData.mistakes,
          solvedGroups: gameData.solvedGroups,
          attemptHistory: gameData.attemptHistory,
          completedAt: new Date().toISOString(),
        });

        // Update user stats
        await this.userStatsService.updateUserStats(userId, {
          won: gameData.won,
          mistakes: gameData.mistakes,
          gameDate: puzzleDate.toISOString().split("T")[0], // Use date only (YYYY-MM-DD)
        });
      } catch (error) {
        console.error("Failed to save game history:", error);
      }
    }
  }
}
