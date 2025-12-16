import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore/lite";
import type { User } from "firebase/auth";
import type { UserData } from "../types";

export class UserService {
  private readonly collectionName = "users";

  constructor(private db: Firestore) {}

  async getUserData(uid: string): Promise<UserData | null> {
    const userRef = doc(this.db, this.collectionName, uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }

    return null;
  }

  async saveUserToFirestore(user: User): Promise<void> {
    const userRef = doc(this.db, this.collectionName, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        role: "user",
      });
    } else {
      await setDoc(
        userRef,
        {
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  }
}
