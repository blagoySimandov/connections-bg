import { StatCard } from "./stat-card";
import type { UserStats } from "@/shared/types";

interface StatsOverviewProps {
  stats: UserStats | undefined;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Изиграни игри" value={stats?.totalGames || 0} />
      <StatCard label="Процент победи" value={`${stats?.winRate.toFixed(0) || 0}%`} />
      <StatCard label="Текуща серия" value={stats?.currentStreak || 0} />
      <StatCard label="Перфектни игри" value={stats?.perfectGames || 0} />
    </div>
  );
}
