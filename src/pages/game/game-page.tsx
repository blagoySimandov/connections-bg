import { useQuery } from "@tanstack/react-query";
import { ConnectionsGame } from "@/components/game/connections-game";
import { connectionService } from "@/lib";

export function GamePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["puzzle", "today"],
    queryFn: () => connectionService.getPuzzleForCurrentDate(),
  });

  const puzzle = data?.[0];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puzzle: {error.message}</div>;
  if (!puzzle) return <div>No Puzzle for today :/</div>;

  return <ConnectionsGame puzzle={puzzle} />;
}
