import { doc, setDoc, getDoc, type Firestore } from "firebase/firestore/lite";
import type { GameHistory } from "../types";

export class GameHistoryService {
  constructor(private db: Firestore) {}

  /**
   * Get date string in format YYYY-MM-DD for use as document ID
   */
  private getDateKey(date: Date): string {
    return date.toISOString().split("T")[0] || "";
  }

  /**
   * Save game history using date as document ID to prevent duplicates
   */
  async saveGameHistory(
    userId: string,
    puzzleDate: Date,
    historyData: GameHistory,
  ): Promise<void> {
    const dateKey = this.getDateKey(puzzleDate);
    const historyRef = doc(this.db, "users", userId, "history", dateKey);
    await setDoc(historyRef, historyData);
  }

  /**
   * Get game history for a specific date (for cross-device sync)
   */
  async getGameHistory(
    userId: string,
    puzzleDate: Date,
  ): Promise<GameHistory | null> {
    const dateKey = this.getDateKey(puzzleDate);
    const historyRef = doc(this.db, "users", userId, "history", dateKey);
    const historyDoc = await getDoc(historyRef);

    if (historyDoc.exists()) {
      return historyDoc.data() as GameHistory;
    }

    return null;
  }
}
