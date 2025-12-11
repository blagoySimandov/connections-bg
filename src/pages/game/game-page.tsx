import { ConnectionsGame } from "@/components/game/connections-game";
import { samplePuzzle } from "@/data";

export function GamePage() {
  return <ConnectionsGame puzzle={samplePuzzle} />;
}
