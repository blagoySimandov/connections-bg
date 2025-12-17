import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/shared/services/firebase";
import type { GameHistory } from "@/shared/types";

export interface UserStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  averageMistakes: number;
  perfectGames: number;
  currentStreak: number;
  longestStreak: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  hardestCompleted: number;
  recentGames: GameHistory[];
}

export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const historyRef = collection(db, "users", userId, "history");
        const historySnapshot = await getDocs(historyRef);

        const games: GameHistory[] = historySnapshot.docs.map(
          (doc) => doc.data() as GameHistory
        );

        // Sort games by date (most recent first)
        games.sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        );

        // Calculate stats
        const totalGames = games.length;
        const totalWins = games.filter((g) => g.won).length;
        const totalLosses = totalGames - totalWins;
        const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

        const completedGames = games.filter((g) => g.completed);
        const averageMistakes =
          completedGames.length > 0
            ? completedGames.reduce((sum, g) => sum + g.mistakes, 0) /
              completedGames.length
            : 0;

        const perfectGames = games.filter((g) => g.won && g.mistakes === 0).length;

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Sort by date for streak calculation (oldest first)
        const sortedGames = [...games].sort(
          (a, b) =>
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
        );

        for (const game of sortedGames) {
          if (game.won) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }

        // Current streak (counting from most recent backwards)
        for (const game of games) {
          if (game.won) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Count difficulty levels completed
        let easyCompleted = 0;
        let mediumCompleted = 0;
        let hardCompleted = 0;
        let hardestCompleted = 0;

        games.forEach((game) => {
          game.solvedGroups.forEach((group) => {
            switch (group.difficulty) {
              case 0:
                easyCompleted++;
                break;
              case 1:
                mediumCompleted++;
                break;
              case 2:
                hardCompleted++;
                break;
              case 3:
                hardestCompleted++;
                break;
            }
          });
        });

        setStats({
          totalGames,
          totalWins,
          totalLosses,
          winRate,
          averageMistakes,
          perfectGames,
          currentStreak,
          longestStreak,
          easyCompleted,
          mediumCompleted,
          hardCompleted,
          hardestCompleted,
          recentGames: games.slice(0, 10), // Last 10 games
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}
