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
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PerformanceStatRow label="Wins" value={stats?.totalWins || 0} />
        <PerformanceStatRow label="Losses" value={stats?.totalLosses || 0} />
        <PerformanceStatRow
          label="Avg. Mistakes"
          value={stats?.averageMistakes.toFixed(1) || 0}
        />
        <PerformanceStatRow
          label="Longest Streak"
          value={stats?.longestStreak || 0}
        />
      </CardContent>
    </Card>
  );
}
