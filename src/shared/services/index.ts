export * from "./firebase";
export { AuthService } from "./auth.service";
export { UserService } from "./user.service";
export { PuzzleService } from "./puzzle.service";

import { auth, db } from "./firebase";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { PuzzleService } from "./puzzle.service";

export const authService = new AuthService(auth);
export const userService = new UserService(db);
export const puzzleService = new PuzzleService(db);
