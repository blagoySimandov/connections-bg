import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { PerformanceStatRow } from "./performance-stat-row";
import type { UserStats } from "@/shared/types";

interface PerformanceCardProps {
  stats: UserStats | undefined;
}

export function PerformanceCard({ stats }: PerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Представяне</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PerformanceStatRow label="Победи" value={stats?.totalWins || 0} />
        <PerformanceStatRow label="Загуби" value={stats?.totalLosses || 0} />
        <PerformanceStatRow
          label="Средно грешки"
          value={stats?.averageMistakes.toFixed(1) || 0}
        />
        <PerformanceStatRow
          label="Най-дълга серия"
          value={stats?.longestStreak || 0}
        />
      </CardContent>
    </Card>
  );
}
