import { ConnectionsGame } from "@/components";
import { samplePuzzle } from "@/data";

export function GamePage() {
  return <ConnectionsGame puzzle={samplePuzzle} />;
}
