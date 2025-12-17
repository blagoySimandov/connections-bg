import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/shared/services/firebase";
import type { UserStats } from "@/shared/types";

async function fetchUserStats(userId: string): Promise<UserStats> {
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

  return userStats;
}

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => fetchUserStats(userId!),
    enabled: !!userId,
  });
}
