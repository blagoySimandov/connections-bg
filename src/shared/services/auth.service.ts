import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";

export class AuthService {
  private googleProvider: GoogleAuthProvider;
  private facebookProvider: FacebookAuthProvider;

  constructor(private auth: Auth) {
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
  }

  async signInWithGoogle() {
    return signInWithPopup(this.auth, this.googleProvider);
  }

  async signInWithFacebook() {
    return signInWithPopup(this.auth, this.facebookProvider);
  }

  async signOut() {
    return firebaseSignOut(this.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseOnAuthStateChanged(this.auth, callback);
  }
}
