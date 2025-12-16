import { Input, Label, Badge } from "@/shared/ui";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/shared/constants";
import type { CategoryForm } from "../types";

interface CategoryInputProps {
  category: CategoryForm;
  index: number;
  onNameChange: (index: number, name: string) => void;
  onWordChange: (catIndex: number, wordIndex: number, value: string) => void;
}

export function CategoryInput({
  category,
  index,
  onNameChange,
  onWordChange,
}: CategoryInputProps) {
  const difficulty = index as 0 | 1 | 2 | 3;

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Category {index + 1}</h4>
        <Badge className={DIFFICULTY_COLORS[difficulty]}>
          {DIFFICULTY_LABELS[difficulty]}
        </Badge>
      </div>

      <div className="space-y-2">
        <Label>Category Name</Label>
        <Input
          value={category.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder={`e.g., Category ${index + 1}`}
        />
      </div>

      <div className="space-y-2">
        <Label>Words</Label>
        <div className="grid grid-cols-2 gap-2">
          {category.words.map((word, wordIndex) => (
            <Input
              key={wordIndex}
              value={word}
              onChange={(e) => onWordChange(index, wordIndex, e.target.value)}
              placeholder={`Word ${wordIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
