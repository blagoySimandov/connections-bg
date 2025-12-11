import { Navigate } from "react-router";
import { useAuth } from "./use-auth";
import type { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
