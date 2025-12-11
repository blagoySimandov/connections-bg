export const DIFFICULTY_COLORS = {
  0: "bg-chart-2 text-white",
  1: "bg-chart-4 text-white",
  2: "bg-chart-1 text-white",
  3: "bg-destructive text-white",
} as const;

export const DIFFICULTY_LABELS = {
  0: "Easy",
  1: "Medium",
  2: "Hard",
  3: "Very Hard",
} as const;

export const EMPTY_CATEGORY = {
  name: "",
  words: ["", "", "", ""] as [string, string, string, string],
};

export const INITIAL_CATEGORIES = [
  { ...EMPTY_CATEGORY },
  { ...EMPTY_CATEGORY },
  { ...EMPTY_CATEGORY },
  { ...EMPTY_CATEGORY },
];
