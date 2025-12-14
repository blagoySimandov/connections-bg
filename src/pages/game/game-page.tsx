import { useQuery } from "@tanstack/react-query";
import { ConnectionsGame } from "@/components/game/connections-game";
import { connectionService } from "@/lib";

export function GamePage() {
  const currentDate = new Date();
  const { data: puzzle, isLoading, error } = useQuery({
    queryKey: ["puzzle", currentDate.toISOString().split("T")[0]],
    queryFn: () => connectionService.getPuzzleByDate(currentDate),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puzzle: {error.message}</div>;
  if (!puzzle) return <div>No Puzzle for today :/</div>;

  return <ConnectionsGame puzzle={puzzle} />;
}
