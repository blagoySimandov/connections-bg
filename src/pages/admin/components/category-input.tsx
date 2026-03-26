import { Input, Label, Badge, Button } from "@/shared/ui";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/shared/constants";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { CategoryForm, ValidationErrors } from "../types";

interface CategoryInputProps {
  category: CategoryForm;
  index: number;
  errors?: ValidationErrors["categories"][number];
  onNameChange: (index: number, name: string) => void;
  onWordChange: (catIndex: number, wordIndex: number, value: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export function CategoryInput({
  category,
  index,
  errors,
  onNameChange,
  onWordChange,
  onMoveUp,
  onMoveDown,
}: CategoryInputProps) {
  const difficulty = index as 0 | 1 | 2 | 3;

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Category {index + 1}</h4>
        <div className="flex items-center gap-2">
          <Badge className={DIFFICULTY_COLORS[difficulty]}>
            {DIFFICULTY_LABELS[difficulty]}
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveUp?.(index)}
              disabled={index === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveDown?.(index)}
              disabled={index === 3}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category Name</Label>
        <Input
          value={category.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder={`e.g., Category ${index + 1}`}
          className={errors?.name ? "border-destructive" : ""}
        />
        {errors?.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Words</Label>
        <div className="grid grid-cols-2 gap-2">
          {category.words.map((word, wordIndex) => (
            <div key={wordIndex} className="space-y-1">
              <Input
                value={word}
                onChange={(e) => onWordChange(index, wordIndex, e.target.value)}
                placeholder={`Word ${wordIndex + 1}`}
                className={errors?.words[wordIndex] ? "border-destructive" : ""}
              />
              {errors?.words[wordIndex] && (
                <p className="text-sm text-destructive">{errors.words[wordIndex]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
