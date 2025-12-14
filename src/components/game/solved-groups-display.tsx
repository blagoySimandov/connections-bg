import { cn } from "@/lib/utils";
import type { SolvedGroup } from "./types/game-types";
import type { Puzzle } from "@/types";
import { getDifficultyColors } from "./utils/game-utils";

interface SolvedGroupsDisplayProps {
  solvedGroups: SolvedGroup[];
  gameEnded: boolean;
  gameLost?: boolean;
  puzzle?: Puzzle;
}

export function SolvedGroupsDisplay({
  solvedGroups,
  gameEnded,
  gameLost,
  puzzle,
}: SolvedGroupsDisplayProps) {
  if (gameLost && puzzle) {
    const sortedSolution = Object.entries(puzzle.solution).sort(
      ([, themeA], [, themeB]) => themeA.difficulty - themeB.difficulty
    );

    return (
      <div className="space-y-2">
        {sortedSolution.map(([category, theme], index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-md text-center",
              getDifficultyColors(theme.difficulty),
            )}
          >
            <h3 className="font-bold uppercase mb-2">{category}</h3>
            <p className="text-sm uppercase">{theme.words.join(", ")}</p>
          </div>
        ))}
      </div>
    );
  }

  if (solvedGroups.length === 0 && !gameEnded) return null;

  return (
    <div className="space-y-2">
      {solvedGroups.map((group, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-md text-center",
            getDifficultyColors(group.difficulty),
          )}
        >
          <h3 className="font-bold uppercase mb-2">{group.category}</h3>
          <p className="text-sm uppercase">{group.words.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
