import { cn } from "@/lib/utils";
import type { Puzzle } from "@/types";
import { getDifficultyColors } from "./utils/game-utils";

interface GameEndScreenProps {
  gameWon: boolean;
  gameLost: boolean;
  puzzle: Puzzle;
}

/**
 * Displays the end game screen (win or loss)
 */
export function GameEndScreen({ gameWon, gameLost, puzzle }: GameEndScreenProps) {
  if (gameWon) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-green-600">Поздравления!</h2>
        <p className="text-lg">Решихте пъзела!</p>
      </div>
    );
  }

  if (gameLost) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-red-600">Край на Играта</h2>
        <p className="text-lg">Нямате повече опити.</p>
        <div className="space-y-2">
          {Object.entries(puzzle.solution).map(
            ([category, theme], index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-md text-center",
                  getDifficultyColors(theme.difficulty)
                )}
              >
                <h3 className="font-bold uppercase mb-2">{category}</h3>
                <p className="text-sm uppercase">
                  {theme.words.join(", ")}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  return null;
}
