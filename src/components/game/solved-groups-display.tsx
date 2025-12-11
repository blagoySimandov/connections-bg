import { cn } from "@/lib/utils";
import type { SolvedGroup } from "./types/game-types";
import { getDifficultyColors } from "./utils/game-utils";

interface SolvedGroupsDisplayProps {
  solvedGroups: SolvedGroup[];
}

/**
 * Displays the solved category groups with their words
 */
export function SolvedGroupsDisplay({ solvedGroups }: SolvedGroupsDisplayProps) {
  if (solvedGroups.length === 0) return null;

  return (
    <>
      {solvedGroups.map((group, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-md text-center",
            getDifficultyColors(group.difficulty)
          )}
        >
          <h3 className="font-bold uppercase mb-2">{group.category}</h3>
          <p className="text-sm uppercase">{group.words.join(", ")}</p>
        </div>
      ))}
    </>
  );
}
