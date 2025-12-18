import { cn } from "@/shared/utils";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div
      className={cn("loader", className)}
      style={{
        width: "85px",
        height: "35px",
        color: "hsl(var(--foreground))",
        background:
          "var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2)",
        backgroundSize: "25px 25px",
        backgroundRepeat: "no-repeat",
        animation: "loader-animation 1s infinite alternate",
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
