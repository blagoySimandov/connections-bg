import { useState, useEffect, useCallback } from "react";
import type { Puzzle } from "@/types";
import type { SolvedGroup, AttemptHistory, GameState } from "../types/game-types";
import { shuffleArray, getStorageKey } from "../utils/game-utils";

/**
 * Custom hook for managing game state and localStorage persistence
 */
export function useGameState(puzzle: Puzzle) {
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
   * Initialize game state from localStorage or create new game
   */
  useEffect(() => {
    const savedState = loadGameState();

    if (savedState) {
      setWords(savedState.words);
      setSolvedGroups(savedState.solvedGroups);
      setMistakes(savedState.mistakes);
      setAttemptHistory(savedState.attemptHistory);
    } else {
      const allWords = Object.values(puzzle.solution).flatMap(
        (theme) => theme.words,
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
  }, [puzzle, loadGameState, saveGameState]);

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
