import { Card, CardContent } from "@/shared/ui";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          Все още няма изиграни игри. Започнете да играете, за да видите вашата статистика!
        </p>
      </CardContent>
    </Card>
  );
}
