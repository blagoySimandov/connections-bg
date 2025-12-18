interface PerformanceStatRowProps {
  label: string;
  value: string | number;
}

export function PerformanceStatRow({ label, value }: PerformanceStatRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
