import type { Puzzle, PuzzleTheme } from "../../types/puzzle";
import { EMPTY_CATEGORY } from "./constants";

export interface CategoryForm {
  name: string;
  words: [string, string, string, string];
}

export function buildSolutionFromCategories(
  categories: CategoryForm[]
): Record<string, PuzzleTheme> {
  const solution: Record<string, PuzzleTheme> = {};

  categories.forEach((cat, index) => {
    if (cat.name.trim()) {
      solution[cat.name] = {
        difficulty: index as 0 | 1 | 2 | 3,
        words: cat.words,
      };
    }
  });

  return solution;
}

export function buildCategoriesFromSolution(
  solution: Record<string, PuzzleTheme>
): CategoryForm[] {
  const categories: CategoryForm[] = [];

  Object.entries(solution).forEach(([name, theme]) => {
    categories.push({
      name,
      words: theme.words,
    });
  });

  while (categories.length < 4) {
    categories.push({ ...EMPTY_CATEGORY });
  }

  categories.sort((a, b) => {
    const diffA = solution[a.name]?.difficulty ?? 999;
    const diffB = solution[b.name]?.difficulty ?? 999;
    return diffA - diffB;
  });

  return categories;
}

export function updateCategoryName(
  categories: CategoryForm[],
  index: number,
  name: string
): CategoryForm[] {
  const newCategories = [...categories];
  newCategories[index] = {
    ...newCategories[index],
    name,
  };
  return newCategories;
}

export function updateCategoryWord(
  categories: CategoryForm[],
  catIndex: number,
  wordIndex: number,
  value: string
): CategoryForm[] {
  const newCategories = [...categories];
  const newWords = [...newCategories[catIndex].words];
  newWords[wordIndex] = value;
  newCategories[catIndex] = {
    ...newCategories[catIndex],
    words: newWords as [string, string, string, string],
  };
  return newCategories;
}

export function getInitialFormDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateForDisplay(date: Date): string {
  return new Date(date).toLocaleDateString();
}
