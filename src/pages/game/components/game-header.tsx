import { formatDateBulgarian } from "../utils/game-utils";

interface GameHeaderProps {
  date: Date;
}

/**
 * Header component displaying the game title and date
 */
export function GameHeader({ date }: GameHeaderProps) {
  return (
    <header className="text-center mb-3 sm:mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-0.5">Connections</h1>
      <p className="text-sm sm:text-base text-muted-foreground">{formatDateBulgarian(date)}</p>
    </header>
  );
}
