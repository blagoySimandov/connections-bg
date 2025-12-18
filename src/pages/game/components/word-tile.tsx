import { cn } from "@/shared/utils";
import { DIFFICULTY_COLORS } from "@/shared/constants";

interface WordTileProps {
  word: string;
  selected: boolean;
  solved: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  onClick: () => void;
  isIncorrect?: boolean;
  isAnimating?: boolean;
}

function getFontSizeClass(word: string): string {
  const length = word.length;

  if (length <= 4) return "text-lg sm:text-xs md:text-sm";
  if (length <= 6) return "text-base sm:text-xs md:text-sm";
  if (length <= 8) return "text-sm sm:text-xs md:text-sm";
  if (length <= 10) return "text-xs sm:text-xs md:text-sm";
  if (length <= 12) return "text-[11px] sm:text-xs md:text-sm";
  return "text-[10px] sm:text-xs md:text-sm";
}

function formatWordDisplay(word: string) {
  const hasSpace = word.includes(" ");

  if (hasSpace) {
    const parts = word.split(" ");
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx} className="block">
            {part}
          </span>
        ))}
      </>
    );
  }

  return <>{word}</>;
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
  const fontSizeClass = getFontSizeClass(word);

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
        "h-20 sm:h-20 md:h-20 rounded-md font-bold uppercase transition-all duration-200",
        "flex items-center justify-center text-center",
        "px-2 py-2 leading-tight",
        fontSizeClass,
        !solved &&
        !selected &&
        !isAnimating &&
        "bg-connections-word hover:bg-connections-word-hover text-foreground",
        !solved && selected && !isIncorrect && !isAnimating && "bg-connections-word-selected text-white",
        !solved && selected && isIncorrect && "bg-gray-500 text-white",
        !solved && isAnimating && "bg-connections-word-selected text-white",
        solved && difficulty !== undefined && DIFFICULTY_COLORS[difficulty],
        "disabled:cursor-not-allowed",
      )}
    >
      <span className="block w-full overflow-hidden">
        {formatWordDisplay(word)}
      </span>
    </button>
  );
}
