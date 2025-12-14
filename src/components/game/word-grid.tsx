import { WordTile } from "./word-tile";
import type { SolvedGroup } from "./types/game-types";

interface WordGridProps {
  words: string[];
  selectedWords: Set<string>;
  solvedGroups: SolvedGroup[];
  isWordSolved: (word: string) => boolean;
  getWordDifficulty: (word: string) => 0 | 1 | 2 | 3 | undefined;
  onWordClick: (word: string) => void;
  isIncorrect?: boolean;
}

/**
 * Grid of word tiles for the game
 */
export function WordGrid({
  words,
  selectedWords,
  solvedGroups,
  isWordSolved,
  getWordDifficulty,
  onWordClick,
  isIncorrect = false,
}: WordGridProps) {
  const unsolvedWords = words.filter(
    (w) => !solvedGroups.some((sg) => sg.words.includes(w))
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {unsolvedWords.map((word, index) => (
        <WordTile
          key={index}
          word={word}
          selected={selectedWords.has(word)}
          solved={isWordSolved(word)}
          difficulty={getWordDifficulty(word)}
          onClick={() => onWordClick(word)}
          isIncorrect={isIncorrect && selectedWords.has(word)}
        />
      ))}
    </div>
  );
}
