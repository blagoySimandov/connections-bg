import { Card, CardContent } from "@/shared/ui";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          No games played yet. Start playing to see your stats!
        </p>
      </CardContent>
    </Card>
  );
}
