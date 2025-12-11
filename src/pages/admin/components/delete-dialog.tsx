import type { Puzzle } from "../../../types/puzzle";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface DeleteDialogProps {
  open: boolean;
  puzzle: Puzzle | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  puzzle,
  onOpenChange,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Puzzle</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{puzzle?.title || "this puzzle"}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
