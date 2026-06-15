interface LegalSectionProps {
  heading: string;
  children: React.ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2 text-gray-900">{heading}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
