import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore/lite";
import { db } from "./firebase";
import type { Puzzle } from "../types/puzzle";

export class ConnectionService {
  private readonly collectionName = "connections";

  async getAll(): Promise<Puzzle[]> {
    const connectionsRef = collection(db, this.collectionName);
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

  async getById(id: string): Promise<Puzzle | null> {
    const connectionRef = doc(db, this.collectionName, id);
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
    const connectionsRef = collection(db, this.collectionName);
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
    const connectionRef = doc(db, this.collectionName, id);
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
    const connectionRef = doc(db, this.collectionName, id);
    await deleteDoc(connectionRef);
  }
}

export const connectionService = new ConnectionService();
