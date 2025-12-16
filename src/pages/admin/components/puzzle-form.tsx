import { Button } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { CategoryInput } from "./category-input";
import type { CategoryForm } from "../types";

interface PuzzleFormProps {
  open: boolean;
  isEditing: boolean;
  title: string;
  date: string;
  categories: CategoryForm[];
  onOpenChange: (open: boolean) => void;
  onTitleChange: (title: string) => void;
  onDateChange: (date: string) => void;
  onCategoryNameChange: (index: number, name: string) => void;
  onCategoryWordChange: (catIndex: number, wordIndex: number, value: string) => void;
  onSave: () => void;
}

export function PuzzleForm({
  open,
  isEditing,
  title,
  date,
  categories,
  onOpenChange,
  onTitleChange,
  onDateChange,
  onCategoryNameChange,
  onCategoryWordChange,
  onSave,
}: PuzzleFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Puzzle" : "Create New Puzzle"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the puzzle. Each puzzle has 4 categories with
            4 words each.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Puzzle Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g., Daily Connections #1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Puzzle Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Categories</h3>
            {categories.map((category, index) => (
              <CategoryInput
                key={index}
                category={category}
                index={index}
                onNameChange={onCategoryNameChange}
                onWordChange={onCategoryWordChange}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Save Changes" : "Create Puzzle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
