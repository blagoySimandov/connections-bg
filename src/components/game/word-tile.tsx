import { cn } from "@/lib/utils";
import { difficultyColors } from "./constants";

interface WordTileProps {
  word: string;
  selected: boolean;
  solved: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  onClick: () => void;
  isIncorrect?: boolean;
  isAnimating?: boolean;
}

export function WordTile({
  word,
  selected,
  solved,
  difficulty,
  onClick,
  isIncorrect = false,
  isAnimating = false,
}: WordTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={solved || isAnimating}
      style={
        isIncorrect
          ? {
              animation: "shake 0.6s ease-in-out",
            }
          : isAnimating
            ? {
                animation: "morphOut 0.5s ease-in-out forwards",
              }
            : undefined
      }
      className={cn(
        "h-20 rounded-md font-bold uppercase transition-all duration-200",
        "flex items-center justify-center text-center",
        "px-2 py-2 leading-tight",
        "text-[11px] sm:text-xs md:text-sm",
        !solved &&
          !selected &&
          !isAnimating &&
          "bg-connections-word hover:bg-connections-word-hover text-foreground",
        !solved && selected && !isIncorrect && !isAnimating && "bg-connections-word-selected text-white",
        !solved && selected && isIncorrect && "bg-gray-500 text-white",
        !solved && isAnimating && "bg-connections-word-selected text-white",
        solved && difficulty !== undefined && difficultyColors[difficulty],
        "disabled:cursor-not-allowed",
      )}
    >
      <span className="block w-full break-all hyphens-auto overflow-hidden">
        {word}
      </span>
    </button>
  );
}
