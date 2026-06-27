import { Link } from "react-router";

const isFacebook = process.env.BUN_PUBLIC_PLATFORM === "fb";

export function LandingFooter() {
  // Facebook hosts its own legal links; hide ours in the FB build.
  if (isFacebook) return null;

  return (
    <footer className="fixed bottom-2 left-3 flex gap-3 text-xs text-gray-400">
      <Link to="/terms" className="hover:text-gray-600 transition-colors">
        Условия за ползване
      </Link>
      <Link to="/privacy" className="hover:text-gray-600 transition-colors">
        Политика за поверителност
      </Link>
    </footer>
  );
}
