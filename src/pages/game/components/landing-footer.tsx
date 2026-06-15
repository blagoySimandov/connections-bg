import { Link } from "react-router";

export function LandingFooter() {
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
