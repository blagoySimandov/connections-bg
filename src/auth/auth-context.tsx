import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithGoogle, signOut } from "./auth-helpers";
import { saveUserToFirestore, getUserData } from "./user-operations";
import { auth } from "../lib/firebase";
import type { UserData } from "../types/user";

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    if (result.user) {
      await saveUserToFirestore(result.user);
      const data = await getUserData(result.user.uid);
      setUserData(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserData(null);
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
