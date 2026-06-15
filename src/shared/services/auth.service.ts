import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  deleteUser,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";

export class AuthService {
  private provider: GoogleAuthProvider;

  constructor(private auth: Auth) {
    this.provider = new GoogleAuthProvider();
  }

  async signInWithGoogle() {
    return signInWithPopup(this.auth, this.provider);
  }

  async signOut() {
    return firebaseSignOut(this.auth);
  }

  async deleteAccount(user: User) {
    return deleteUser(user);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseOnAuthStateChanged(this.auth, callback);
  }
}
