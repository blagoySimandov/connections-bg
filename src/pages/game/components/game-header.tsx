import { formatDateBulgarian } from "../utils/game-utils";

interface GameHeaderProps {
  date: Date;
}

/**
 * Header component displaying the game title and date
 */
export function GameHeader({ date }: GameHeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2">Connections</h1>
      <p className="text-muted-foreground">{formatDateBulgarian(date)}</p>
    </header>
  );
}
