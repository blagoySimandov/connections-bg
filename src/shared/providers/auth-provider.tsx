import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { authService, userService, analyticsService, ANALYTICS_EVENTS } from "../services";
import type { UserData } from "../types";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        const data = await userService.getUserData(user.uid);
        setUserData(data);
        analyticsService.setUserId(user.uid);
      } else {
        setUserData(null);
        analyticsService.setUserId(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    const result = await authService.signInWithGoogle();
    if (result.user) {
      await userService.saveUserToFirestore(result.user);
      const data = await userService.getUserData(result.user.uid);
      setUserData(data);
      analyticsService.logEvent(ANALYTICS_EVENTS.SIGN_IN, {
        method: "google",
      });
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setUserData(null);
    analyticsService.logEvent(ANALYTICS_EVENTS.SIGN_OUT);
  };

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
