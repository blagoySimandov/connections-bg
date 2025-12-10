import { Button } from "../ui/button";
import { useAuth } from "../../auth";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">Connections</div>
        {user && (
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            {user.displayName && (
              <span className="text-sm">{user.displayName}</span>
            )}
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
