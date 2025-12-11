import { useCallback } from "react";
import type { Puzzle } from "@/types";
import type { SolvedGroup } from "../types/game-types";

/**
 * Custom hook for game logic and validation
 */
export function useGameLogic(puzzle: Puzzle, solvedGroups: SolvedGroup[]) {
  /**
   * Gets the category difficulty for a given word
   */
  const getCategoryForWord = useCallback((word: string): number => {
    for (const [_, theme] of Object.entries(puzzle.solution)) {
      if (theme.words.includes(word)) {
        return theme.difficulty;
      }
    }
    return -1;
  }, [puzzle.solution]);

  /**
   * Checks if the selected words are "one away" from a correct answer
   * (3 words from one category, 1 from another)
   */
  const isOneAway = useCallback((categories: number[]): boolean => {
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const counts = Object.values(categoryCounts);
    return counts.includes(3) && counts.includes(1);
  }, []);

  /**
   * Checks if a word has been solved
   */
  const isWordSolved = useCallback((word: string): boolean => {
    return solvedGroups.some((group) => group.words.includes(word));
  }, [solvedGroups]);

  /**
   * Gets the difficulty level of a solved word
   */
  const getWordDifficulty = useCallback((word: string): 0 | 1 | 2 | 3 | undefined => {
    const group = solvedGroups.find((g) => g.words.includes(word));
    return group?.difficulty;
  }, [solvedGroups]);

  /**
   * Checks if the game is won (all 4 groups solved)
   */
  const checkGameWon = useCallback((): boolean => {
    return solvedGroups.length === 4;
  }, [solvedGroups.length]);

  /**
   * Checks if the game is lost (max mistakes reached)
   */
  const checkGameLost = useCallback((mistakes: number, maxMistakes: number): boolean => {
    return mistakes >= maxMistakes;
  }, []);

  return {
    getCategoryForWord,
    isOneAway,
    isWordSolved,
    getWordDifficulty,
    checkGameWon,
    checkGameLost,
  };
}
