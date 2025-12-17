import { doc, setDoc, type Firestore } from "firebase/firestore/lite";
import type { GameHistory } from "../types";

export class GameHistoryService {
  constructor(private db: Firestore) {}

  async saveGameHistory(
    userId: string,
    puzzleId: string,
    historyData: GameHistory
  ): Promise<void> {
    const historyRef = doc(
      this.db,
      "users",
      userId,
      "history",
      puzzleId
    );
    await setDoc(historyRef, historyData);
  }
}
