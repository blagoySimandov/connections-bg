import { cn } from "@/lib/utils";

interface WordTileProps {
  word: string;
  selected: boolean;
  solved: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  onClick: () => void;
}

const difficultyColors = {
  0: "bg-connections-easy text-black",
  1: "bg-connections-medium text-white",
  2: "bg-connections-hard text-white",
  3: "bg-connections-hardest text-white",
};

export function WordTile({
  word,
  selected,
  solved,
  difficulty,
  onClick,
}: WordTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={solved}
      className={cn(
        "h-20 rounded-md font-bold uppercase transition-all duration-200",
        "flex items-center justify-center text-center",
        "px-2 py-2 leading-tight",
        "text-[11px] sm:text-xs md:text-sm",
        !solved &&
          !selected &&
          "bg-connections-word hover:bg-connections-word-hover text-foreground",
        !solved && selected && "bg-connections-word-selected text-white",
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
