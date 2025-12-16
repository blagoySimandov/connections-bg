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
    <div className="flex justify-center gap-4">
      <Button variant="outline" onClick={onShuffle}>
        Разбъркай
      </Button>
      <Button variant="outline" onClick={onDeselectAll}>
        Отмаркирай всички
      </Button>
      <Button onClick={onSubmit} disabled={selectedCount !== 4}>
        Провери
      </Button>
    </div>
  );
}
