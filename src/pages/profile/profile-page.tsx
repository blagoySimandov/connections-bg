import { useAuth } from "@/shared/hooks";
import { Card, CardContent, CardHeader, CardTitle, Badge, Collapsible } from "@/shared/ui";
import { useUserStats } from "./hooks/use-user-stats";

const DIFFICULTY_COLORS = [
  "bg-connections-easy text-connections-easy border-connections-easy",
  "bg-connections-medium text-connections-medium border-connections-medium",
  "bg-connections-hard text-connections-hard border-connections-hard",
  "bg-connections-hardest text-connections-hardest border-connections-hardest",
];

const DIFFICULTY_LABELS = ["Easy", "Medium", "Hard", "Hardest"];

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

      {/* Recent Games */}
      {stats && stats.recentGames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentGames.map((game, index) => (
                <Collapsible
                  key={`${game.puzzleId}-${index}`}
                  trigger={
                    <div className="flex items-center justify-between w-full">
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
                      <div className="flex items-center gap-2 mr-2">
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
                  }
                >
                  <div className="mt-4 space-y-4">
                    {/* Solved Groups */}
                    {game.solvedGroups.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Solved Groups</h4>
                        <div className="space-y-2">
                          {game.solvedGroups.map((group, groupIndex) => (
                            <div
                              key={groupIndex}
                              className={`p-3 rounded-lg border bg-opacity-10 ${DIFFICULTY_COLORS[group.difficulty]}`}
                            >
                              <div className="text-xs font-medium mb-1">
                                {DIFFICULTY_LABELS[group.difficulty]}: {group.category}
                              </div>
                              <div className="text-xs opacity-90">
                                {group.words.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attempt History */}
                    {game.attemptHistory.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Attempts ({game.attemptHistory.length})
                        </h4>
                        <div className="space-y-1">
                          {game.attemptHistory.map((attempt, attemptIndex) => (
                            <div
                              key={attemptIndex}
                              className="text-xs text-muted-foreground"
                            >
                              Attempt {attemptIndex + 1}: {attempt.categories.length} {attempt.categories.length === 1 ? "category" : "categories"}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Collapsible>
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
