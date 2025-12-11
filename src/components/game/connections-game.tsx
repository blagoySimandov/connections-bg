import { useCallback } from "react";
import type { Puzzle } from "@/types";
import { useGameState } from "./hooks/use-game-state";
import { useGameLogic } from "./hooks/use-game-logic";
import { shuffleArray } from "./utils/game-utils";
import { GameHeader } from "./game-header";
import { OneAwayPopup } from "./one-away-popup";
import { SolvedGroupsDisplay } from "./solved-groups-display";
import { WordGrid } from "./word-grid";
import { MistakesIndicator } from "./mistakes-indicator";
import { GameActions } from "./game-actions";
import { GameEndScreen } from "./game-end-screen";

interface ConnectionsGameProps {
  puzzle: Puzzle;
}

const MAX_MISTAKES = 4;

export function ConnectionsGame({ puzzle }: ConnectionsGameProps) {
  const {
    words,
    selectedWords,
    solvedGroups,
    mistakes,
    attemptHistory,
    showOneAway,
    setWords,
    setSelectedWords,
    setSolvedGroups,
    setMistakes,
    setAttemptHistory,
    saveGameState,
    triggerOneAwayMessage,
  } = useGameState(puzzle);

  const {
    getCategoryForWord,
    isOneAway,
    isWordSolved,
    getWordDifficulty,
    checkGameWon,
    checkGameLost,
  } = useGameLogic(puzzle, solvedGroups);

  const handleShuffle = useCallback(() => {
    const remainingWords = words.filter(
      (word: string) => !solvedGroups.some((group) => group.words.includes(word)),
    );
    const solved = words.filter((word: string) =>
      solvedGroups.some((group) => group.words.includes(word)),
    );
    const newWords = [...solved, ...shuffleArray(remainingWords)];
    setWords(newWords);

    saveGameState({
      mistakes,
      solvedGroups,
      attemptHistory,
      words: newWords,
    });
  }, [words, solvedGroups, mistakes, attemptHistory, setWords, saveGameState]);

  const handleWordClick = useCallback((word: string) => {
    setSelectedWords((prev: Set<string>) => {
      const newSelected = new Set(prev);
      if (newSelected.has(word)) {
        newSelected.delete(word);
      } else {
        if (newSelected.size < 4) {
          newSelected.add(word);
        }
      }
      return newSelected;
    });
  }, [setSelectedWords]);

  const handleDeselectAll = useCallback(() => {
    setSelectedWords(new Set());
  }, [setSelectedWords]);

  const handleSubmit = useCallback(() => {
    if (selectedWords.size !== 4) return;

    const selectedArray = Array.from(selectedWords);
    const categories = selectedArray.map(word => getCategoryForWord(word));

    for (const [category, theme] of Object.entries(puzzle.solution)) {
      const isCorrect = theme.words.every((word) =>
        selectedArray.includes(word),
      );

      if (isCorrect) {
        const newSolvedGroups = [
          ...solvedGroups,
          {
            category,
            difficulty: theme.difficulty,
            words: theme.words,
          },
        ];
        const newWords = words.filter((word: string) => !theme.words.includes(word));
        const newAttemptHistory = [...attemptHistory, { categories }];

        setSolvedGroups(newSolvedGroups);
        setWords([...theme.words, ...newWords]);
        setAttemptHistory(newAttemptHistory);
        setSelectedWords(new Set());

        saveGameState({
          mistakes,
          solvedGroups: newSolvedGroups,
          attemptHistory: newAttemptHistory,
          words: [...theme.words, ...newWords],
        });
        return;
      }
    }

    const newMistakes = mistakes + 1;
    const newAttemptHistory = [...attemptHistory, { categories }];

    if (isOneAway(categories)) {
      triggerOneAwayMessage();
    }

    setMistakes(newMistakes);
    setAttemptHistory(newAttemptHistory);
    setSelectedWords(new Set());

    saveGameState({
      mistakes: newMistakes,
      solvedGroups,
      attemptHistory: newAttemptHistory,
      words,
    });
  }, [
    selectedWords,
    getCategoryForWord,
    puzzle.solution,
    solvedGroups,
    words,
    attemptHistory,
    mistakes,
    isOneAway,
    setSolvedGroups,
    setWords,
    setAttemptHistory,
    setSelectedWords,
    setMistakes,
    saveGameState,
    triggerOneAwayMessage,
  ]);

  const gameWon = checkGameWon();
  const gameLost = checkGameLost(mistakes, MAX_MISTAKES);

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <OneAwayPopup show={showOneAway} />

      <GameHeader date={puzzle.date} />

      <main className="space-y-6">
        <p className="text-center text-lg font-medium">
          Направете групи с по 4 думи!
        </p>

        <SolvedGroupsDisplay solvedGroups={solvedGroups} />

        {!gameWon && !gameLost && (
          <>
            <WordGrid
              words={words}
              selectedWords={selectedWords}
              solvedGroups={solvedGroups}
              isWordSolved={isWordSolved}
              getWordDifficulty={getWordDifficulty}
              onWordClick={handleWordClick}
            />

            <MistakesIndicator mistakes={mistakes} maxMistakes={MAX_MISTAKES} />

            <GameActions
              selectedCount={selectedWords.size}
              onShuffle={handleShuffle}
              onDeselectAll={handleDeselectAll}
              onSubmit={handleSubmit}
            />
          </>
        )}

        <GameEndScreen gameWon={gameWon} gameLost={gameLost} puzzle={puzzle} />
      </main>
    </div>
  );
}
