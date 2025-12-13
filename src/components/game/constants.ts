const EMOJI_SQUARES = {
  0: "🟨",
  1: "🟩",
  2: "🟦",
  3: "🟪",
} as const;

const difficultyColors = {
  0: "bg-connections-easy text-black",
  1: "bg-connections-medium text-white",
  2: "bg-connections-hard text-white",
  3: "bg-connections-hardest text-white",
};

export { EMOJI_SQUARES, difficultyColors };
