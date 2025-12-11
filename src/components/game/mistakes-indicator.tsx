import { cn } from "@/lib/utils";

interface MistakesIndicatorProps {
  mistakes: number;
  maxMistakes: number;
}

/**
 * Displays the remaining attempts as dots and text
 */
export function MistakesIndicator({ mistakes, maxMistakes }: MistakesIndicatorProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxMistakes }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full",
              i < mistakes ? "bg-muted" : "bg-foreground",
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Оставащи опити: {maxMistakes - mistakes}
      </p>
    </div>
  );
}
