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

const WORD_SUBMIT_DELAY = 500;
const INCORRECT_DELAY = 600;
const END_SCREEN_DELAY = 900;

export {
  EMOJI_SQUARES,
  difficultyColors,
  WORD_SUBMIT_DELAY,
  END_SCREEN_DELAY,
  INCORRECT_DELAY,
};
