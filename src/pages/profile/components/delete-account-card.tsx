import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/ui";
import { useDeleteAccount } from "../hooks/use-delete-account";

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const { isDeleting, error, handleDelete } = useDeleteAccount();

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Изтриване на профил</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Това действие е необратимо. Всички ваши данни ще бъдат изтрити завинаги.
        </p>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Изтрий профила
        </Button>
        <DeleteAccountDialog
          open={open}
          onOpenChange={setOpen}
          isDeleting={isDeleting}
          error={error}
          onConfirm={handleDelete}
        />
      </CardContent>
    </Card>
  );
}

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  error: string | null;
  onConfirm: () => void;
}

function DeleteAccountDialog({
  open,
  onOpenChange,
  isDeleting,
  error,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Сигурни ли сте?</DialogTitle>
          <DialogDescription>
            Профилът ви и всички свързани данни ще бъдат изтрити завинаги. Това
            действие не може да бъде отменено.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Отказ
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Изтриване..." : "Изтрий завинаги"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
