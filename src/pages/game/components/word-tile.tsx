import { memo } from "react";
import { cn } from "@/shared/utils";
import { DIFFICULTY_COLORS } from "@/shared/constants";
import useFitText from "use-fit-text";

interface WordTileProps {
  word: string;
  selected: boolean;
  solved: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  onClick: () => void;
  isIncorrect?: boolean;
  isAnimating?: boolean;
}

function formatWordDisplay(word: string) {
  if (word.includes(" ")) {
    return word.split(" ").map((part, idx) => (
      <span key={idx} className="block">
        {part}
      </span>
    ));
  }
  return word;
}

const WordTileComponent = ({
  word,
  selected,
  solved,
  difficulty,
  onClick,
  isIncorrect = false,
  isAnimating = false,
}: WordTileProps) => {
  const { fontSize, ref } = useFitText({
    maxFontSize: 120,
    minFontSize: 50,
    resolution: 5,
  });

  return (
    <button
      onClick={onClick}
      disabled={solved || isAnimating}
      style={
        isIncorrect
          ? { animation: "shake 0.6s ease-in-out" }
          : isAnimating
            ? { animation: "morphOut 0.5s ease-in-out forwards" }
            : undefined
      }
      className={cn(
        "h-20 rounded-md font-bold uppercase transition-all duration-200",
        "flex items-center justify-center text-center",
        "leading-tight",
        !solved &&
          !selected &&
          !isAnimating &&
          "bg-connections-word hover:bg-connections-word-hover text-foreground",
        !solved &&
          selected &&
          !isIncorrect &&
          !isAnimating &&
          "bg-connections-word-selected text-white",
        !solved && selected && isIncorrect && "bg-gray-500 text-white",
        !solved && isAnimating && "bg-connections-word-selected text-white",
        solved && difficulty !== undefined && DIFFICULTY_COLORS[difficulty],
        "disabled:cursor-not-allowed",
      )}
    >
      <div
        ref={ref}
        style={{ fontSize }}
        className="flex h-full w-full flex-col items-center justify-center overflow-hidden px-2 py-1 text-center"
      >
        {formatWordDisplay(word)}
      </div>
    </button>
  );
};

export const WordTile = memo(WordTileComponent);
