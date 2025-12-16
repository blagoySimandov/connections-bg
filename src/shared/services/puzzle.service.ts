import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  type Firestore,
} from "firebase/firestore/lite";
import type { Puzzle } from "../types";

export class PuzzleService {
  private readonly collectionName = "connections";

  constructor(private db: Firestore) {}

  async getAll(): Promise<Puzzle[]> {
    const connectionsRef = collection(this.db, this.collectionName);
    const q = query(connectionsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
      } as Puzzle;
    });
  }

  async getPuzzleByDate(date: Date): Promise<Puzzle | null> {
    const connectionsRef = collection(this.db, this.collectionName);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      connectionsRef,
      where("date", ">=", startOfDay.toISOString()),
      where("date", "<=", endOfDay.toISOString())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0]?.data();
    return {
      id: snapshot.docs[0]?.id,
      ...data,
      date: data?.date ? new Date(data.date) : new Date(),
    } as Puzzle;
  }

  async getById(id: string): Promise<Puzzle | null> {
    const connectionRef = doc(this.db, this.collectionName, id);
    const snapshot = await getDoc(connectionRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      date: data.date ? new Date(data.date) : new Date(),
    } as Puzzle;
  }

  async create(puzzle: Puzzle, userId: string): Promise<string> {
    const connectionsRef = collection(this.db, this.collectionName);
    const newConnectionRef = doc(connectionsRef);

    const puzzleData = {
      solution: puzzle.solution,
      title: puzzle.title,
      author: userId,
      date: puzzle.date.toISOString(),
    };

    await setDoc(newConnectionRef, puzzleData);

    return newConnectionRef.id;
  }

  async update(id: string, puzzle: Partial<Puzzle>): Promise<void> {
    const connectionRef = doc(this.db, this.collectionName, id);
    const existing = await getDoc(connectionRef);

    if (!existing.exists()) {
      throw new Error("Connection not found");
    }

    const updates: any = {
      solution: puzzle.solution,
      title: puzzle.title,
    };

    if (puzzle.date) {
      updates.date = puzzle.date.toISOString();
    }

    await setDoc(connectionRef, updates, { merge: true });
  }

  async delete(id: string): Promise<void> {
    const connectionRef = doc(this.db, this.collectionName, id);
    await deleteDoc(connectionRef);
  }
}
