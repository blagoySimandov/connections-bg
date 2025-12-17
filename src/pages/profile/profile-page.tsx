import { useAuth } from "@/shared/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { useUserStats } from "./hooks/use-user-stats";

export function ProfilePage() {
  const { user, userData } = useAuth();
  const { data: stats, isLoading } = useUserStats(user?.uid);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* User Info Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="h-16 w-16 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{user?.displayName}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {userData?.createdAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {formatDate(userData.createdAt)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGames || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.winRate.toFixed(0) || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.currentStreak || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perfect Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.perfectGames || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wins</span>
            <span className="font-semibold">{stats?.totalWins || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Losses</span>
            <span className="font-semibold">{stats?.totalLosses || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Avg. Mistakes
            </span>
            <span className="font-semibold">
              {stats?.averageMistakes.toFixed(1) || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Longest Streak
            </span>
            <span className="font-semibold">
              {stats?.longestStreak || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {stats && stats.totalGames === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No games played yet. Start playing to see your stats!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
