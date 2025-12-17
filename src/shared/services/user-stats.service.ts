import { doc, getDoc, updateDoc, type Firestore } from "firebase/firestore/lite";
import type { UserStats } from "../types";

export class UserStatsService {
  constructor(private db: Firestore) {}

  /**
   * Initialize empty stats for a new user
   */
  getInitialStats(): UserStats {
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      averageMistakes: 0,
      perfectGames: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastGameDate: null,
    };
  }

  /**
   * Check if the game date is consecutive with the last game date
   */
  private isConsecutiveDay(lastGameDate: string | null, currentGameDate: string): boolean {
    if (!lastGameDate) return true;

    const last = new Date(lastGameDate);
    const current = new Date(currentGameDate);

    // Reset times to midnight for date comparison
    last.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    const diffTime = current.getTime() - last.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Same day or next day
    return diffDays <= 1;
  }

  /**
   * Update user stats after game completion
   */
  async updateUserStats(
    userId: string,
    gameResult: {
      won: boolean;
      mistakes: number;
      gameDate: string; // ISO date string
    }
  ): Promise<void> {
    const userRef = doc(this.db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("User document not found");
      return;
    }

    const userData = userDoc.data();
    const currentStats: UserStats = userData.stats || this.getInitialStats();

    // Calculate new stats
    const newTotalGames = currentStats.totalGames + 1;
    const newTotalWins = currentStats.totalWins + (gameResult.won ? 1 : 0);
    const newTotalLosses = currentStats.totalLosses + (gameResult.won ? 0 : 1);

    // Calculate new average mistakes
    const totalMistakes = currentStats.averageMistakes * currentStats.totalGames + gameResult.mistakes;
    const newAverageMistakes = totalMistakes / newTotalGames;

    // Count perfect games
    const newPerfectGames = currentStats.perfectGames + (gameResult.won && gameResult.mistakes === 0 ? 1 : 0);

    // Handle streak logic
    let newCurrentStreak = currentStats.currentStreak;
    let newLongestStreak = currentStats.longestStreak;

    if (gameResult.won) {
      // Check if consecutive day
      if (this.isConsecutiveDay(currentStats.lastGameDate, gameResult.gameDate)) {
        newCurrentStreak = currentStats.currentStreak + 1;
      } else {
        // Non-consecutive, reset streak
        newCurrentStreak = 1;
      }
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
    } else {
      // Lost - reset current streak
      newCurrentStreak = 0;
    }

    // Calculate win rate
    const newWinRate = (newTotalWins / newTotalGames) * 100;

    // Update user document
    const updatedStats: UserStats = {
      totalGames: newTotalGames,
      totalWins: newTotalWins,
      totalLosses: newTotalLosses,
      winRate: newWinRate,
      averageMistakes: newAverageMistakes,
      perfectGames: newPerfectGames,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastGameDate: gameResult.gameDate,
    };

    await updateDoc(userRef, {
      stats: updatedStats,
    });
  }
}
