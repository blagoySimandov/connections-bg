import { Link } from "react-router";
import { Button } from "@/shared/ui";
import { useAuth } from "@/shared/hooks";
import logo from "@/logo.png";

export function Navbar() {
  const { user, userData, signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg md:text-xl font-bold hover:text-primary transition-colors"
          >
            <img src={logo} alt="Connections Logo" className="h-6 w-6 md:h-8 md:w-8" />
            Connections
          </Link>
          {userData?.role === "admin" && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </Link>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-6 w-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span>Profile</span>
              </Button>
            </Link>
            {user.displayName && (
              <span className="hidden md:inline text-sm">{user.displayName}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-xs md:text-sm"
            >
              Sign out
            </Button>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button size="sm">Log in</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
