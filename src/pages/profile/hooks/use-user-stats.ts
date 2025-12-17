import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore/lite";
import { db } from "@/shared/services/firebase";
import type { GameHistory, UserStats } from "@/shared/types";

export interface ProfileStats extends UserStats {
  recentGames: GameHistory[];
}

export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
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

        // Fetch user document with stats (1 read)
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found");
        }

        const userData = userDoc.data();
        const userStats: UserStats = userData.stats || {
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

        // Fetch only 5 most recent games (5 reads max)
        const historyRef = collection(db, "users", userId, "history");
        const historySnapshot = await getDocs(historyRef);

        const games: GameHistory[] = historySnapshot.docs.map(
          (doc) => doc.data() as GameHistory
        );

        // Sort by completion date and take only 5 most recent
        games.sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        );
        const recentGames = games.slice(0, 5);

        setStats({
          ...userStats,
          recentGames,
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
