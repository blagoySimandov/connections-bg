import { useState, useEffect, useCallback } from "react";
import type { Puzzle } from "@/shared/types";
import type { SolvedGroup, AttemptHistory, GameState } from "../types";
import { shuffleArray, getStorageKey } from "../utils/game-utils";
import { syncService } from "@/shared/services";

/**
 * Custom hook for managing game state with localStorage and Firestore sync
 */
export function useGameState(puzzle: Puzzle, userId: string | null) {
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([]);
  const [showOneAway, setShowOneAway] = useState(false);

  /**
   * Saves the current game state to localStorage
   */
  const saveGameState = useCallback((state: GameState) => {
    const key = getStorageKey(puzzle.date);
    localStorage.setItem(key, JSON.stringify(state));
  }, [puzzle.date]);

  /**
   * Loads the game state from localStorage
   */
  const loadGameState = useCallback((): GameState | null => {
    const saved = localStorage.getItem(getStorageKey(puzzle.date));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }, [puzzle.date]);

  /**
   * Initialize game state from Firestore (cross-device), localStorage, or create new game
   */
  useEffect(() => {
    const initializeGameState = async () => {
      let savedState: GameState | null = null;

      // Try loading from Firestore first if user is logged in (cross-device sync)
      if (userId) {
        try {
          const history = await syncService.loadGameHistory(userId, puzzle.date);
          if (history) {
            savedState = {
              mistakes: history.mistakes,
              solvedGroups: history.solvedGroups,
              attemptHistory: history.attemptHistory,
              words: history.solvedGroups.flatMap((g) => g.words).concat(
                Object.values(puzzle.solution)
                  .flatMap((theme) => theme.words)
                  .filter(
                    (word) =>
                      !history.solvedGroups.some((g) => g.words.includes(word))
                  )
              ),
            };
          }
        } catch (error) {
          console.error("Failed to load game history from Firestore:", error);
        }
      }

      // Fall back to localStorage if Firestore didn't have data
      if (!savedState) {
        savedState = loadGameState();
      }

      if (savedState) {
        setWords(savedState.words);
        setSolvedGroups(savedState.solvedGroups);
        setMistakes(savedState.mistakes);
        setAttemptHistory(savedState.attemptHistory);
      } else {
        // Create new game if no saved state exists
        const allWords = Object.values(puzzle.solution).flatMap(
          (theme) => theme.words
        );
        const shuffledWords = shuffleArray(allWords);
        setWords(shuffledWords);

        saveGameState({
          mistakes: 0,
          solvedGroups: [],
          attemptHistory: [],
          words: shuffledWords,
        });
      }
    };

    initializeGameState();
  }, [puzzle, userId, loadGameState, saveGameState]);

  /**
   * Displays the "one away" message temporarily
   */
  const triggerOneAwayMessage = useCallback(() => {
    setShowOneAway(true);
    setTimeout(() => {
      setShowOneAway(false);
    }, 2000);
  }, []);

  return {
    // State
    words,
    selectedWords,
    solvedGroups,
    mistakes,
    attemptHistory,
    showOneAway,

    // State setters
    setWords,
    setSelectedWords,
    setSolvedGroups,
    setMistakes,
    setAttemptHistory,

    // Helper functions
    saveGameState,
    loadGameState,
    triggerOneAwayMessage,
  };
}
