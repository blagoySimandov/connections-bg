import { Button } from "@/shared/ui/button";

interface GameActionsProps {
  selectedCount: number;
  onShuffle: () => void;
  onDeselectAll: () => void;
  onSubmit: () => void;
}

/**
 * Action buttons for the game (Shuffle, Deselect All, Submit)
 */
export function GameActions({
  selectedCount,
  onShuffle,
  onDeselectAll,
  onSubmit,
}: GameActionsProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-4">
      <Button variant="outline" onClick={onShuffle} className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2">
        Разбъркай
      </Button>
      <Button variant="outline" onClick={onDeselectAll} className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2">
        Отмаркирай
      </Button>
      <Button onClick={onSubmit} disabled={selectedCount !== 4} className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2">
        Провери
      </Button>
    </div>
  );
}
