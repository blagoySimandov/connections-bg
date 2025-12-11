interface OneAwayPopupProps {
  show: boolean;
}

/**
 * Popup overlay that displays "За Малко..." (One Away) message
 */
export function OneAwayPopup({ show }: OneAwayPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-black/80 text-white px-8 py-4 rounded-lg text-xl font-bold">
        За Малко...
      </div>
    </div>
  );
}
