import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { db } from "../lib/firebase";
import type { User } from "firebase/auth";

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
