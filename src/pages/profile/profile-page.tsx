import { useAuth } from "@/shared/hooks";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/shared/ui";
import { useUserStats } from "./hooks/use-user-stats";

export function ProfilePage() {
  const { user, userData } = useAuth();
  const { stats, loading } = useUserStats(user?.uid);

  if (loading) {
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

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Groups Solved by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-connections-easy">
                Easy
              </span>
              <span className="font-semibold">{stats?.easyCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-connections-medium">
                Medium
              </span>
              <span className="font-semibold">
                {stats?.mediumCompleted || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-connections-hard">
                Hard
              </span>
              <span className="font-semibold">{stats?.hardCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-connections-hardest">
                Hardest
              </span>
              <span className="font-semibold">
                {stats?.hardestCompleted || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      {stats && stats.recentGames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentGames.map((game, index) => (
                <div
                  key={`${game.puzzleId}-${index}`}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {new Date(game.puzzleDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {game.mistakes} {game.mistakes === 1 ? "mistake" : "mistakes"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={game.won ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {game.won ? "Won" : "Lost"}
                    </Badge>
                    {game.won && game.mistakes === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Perfect
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
