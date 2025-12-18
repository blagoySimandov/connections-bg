import { useAuth } from "@/shared/hooks";
import { useUserStats } from "./hooks/use-user-stats";
import {
  UserInfoCard,
  StatsOverview,
  PerformanceCard,
  EmptyState,
} from "./components";

export function ProfilePage() {
  const { user, userData } = useAuth();
  const { data: stats, isLoading } = useUserStats(user?.uid);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Зареждане...</div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <UserInfoCard user={user} memberSince={userData.createdAt} />
        <StatsOverview stats={stats} />
        <PerformanceCard stats={stats} />
        {stats && stats.totalGames === 0 && <EmptyState />}
      </div>
    </div>
  );
}
