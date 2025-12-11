import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { db } from "../lib/firebase";
import type { User } from "firebase/auth";
import type { UserData } from "../types/user";

export async function saveUserToFirestore(user: User) {
  const userRef = doc(db, "users", user.uid);
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

export async function getUserData(uid: string): Promise<UserData | null> {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }

  return null;
}
