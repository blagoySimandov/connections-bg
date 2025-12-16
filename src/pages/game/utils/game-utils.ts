import { DIFFICULTY_COLORS as colorMap } from "@/shared/constants";
import type { SolvedGroup } from "../types";
/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!];
  }
  return newArray;
};

/**
 * Gets the difficulty color classes for a given difficulty level
 */
export const getDifficultyColors = (
  difficulty: SolvedGroup["difficulty"],
): string => {
  return colorMap[difficulty];
};

/**
 * Formats a date for display in Bulgarian locale
 */
export const formatDateBulgarian = (date: Date): string => {
  return date.toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generates a storage key for a specific puzzle date
 */
export const getStorageKey = (date: Date): string => {
  return `connections-game-${date.toISOString().split("T")[0]}`;
};
