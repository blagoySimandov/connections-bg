import { StatCard } from "./stat-card";
import type { UserStats } from "@/shared/types";

interface StatsOverviewProps {
  stats: UserStats | undefined;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Games" value={stats?.totalGames || 0} />
      <StatCard label="Win Rate" value={`${stats?.winRate.toFixed(0) || 0}%`} />
      <StatCard label="Current Streak" value={stats?.currentStreak || 0} />
      <StatCard label="Perfect Games" value={stats?.perfectGames || 0} />
    </div>
  );
}
