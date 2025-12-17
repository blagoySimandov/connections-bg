import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ trigger, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        {trigger}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 border-t">
          {children}
        </div>
      )}
    </div>
  );
}
