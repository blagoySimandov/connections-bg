export type UserRole = "admin" | "user";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: string;
  role: UserRole;
}
