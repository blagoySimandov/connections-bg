import { useQuery } from "@tanstack/react-query";
import { ConnectionsGame } from "./components";
import { puzzleService } from "@/shared/services";
import { Loader } from "@/shared/ui";

export function GamePage() {
  const currentDate = new Date();
  const { data: puzzle, isLoading, error } = useQuery({
    queryKey: ["puzzle", currentDate.toISOString().split("T")[0]],
    queryFn: () => puzzleService.getPuzzleByDate(currentDate),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) return <div>Error loading puzzle: {error.message}</div>;
  if (!puzzle) return <div>No Puzzle for today :/</div>;

  return <ConnectionsGame puzzle={puzzle} />;
}
